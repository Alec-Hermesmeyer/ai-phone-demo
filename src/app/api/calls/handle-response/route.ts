import { NextResponse } from "next/server"
import  VoiceResponse  from "twilio/lib/twiml/VoiceResponse"
import { prisma } from "@/lib/db"
import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { ragClient } from "@/lib/rag"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const callSid = formData.get("CallSid") as string
    const speechResult = formData.get("SpeechResult") as string

    // Get call details and company settings
    const call = await prisma.call.findUnique({
      where: { callSid },
      include: {
        company: {
          include: {
            settings: true,
          },
        },
      },
    })

    if (!call) {
      throw new Error("Call not found")
    }

    // Query the RAG system
    const ragResponse = await ragClient.query({
      query: speechResult,
      companyId: call.companyId,
      minConfidence: call.company.settings?.confidenceThreshold || 0.7,
    })

    // Generate AI response using RAG context
    const aiResponseResult = await streamText({
      model: openai("gpt-4-turbo"),
      messages: [
        {
          role: "system",
          content: `You are an AI phone assistant for ${call.company.name}. 
          Use the following relevant information to answer the question:
          ${ragResponse.sources.map((source) => source.content).join("\n\n")}
          
          Confidence level: ${ragResponse.confidence}
          If confidence is below ${call.company.settings?.confidenceThreshold || 0.7}, 
          acknowledge uncertainty and offer to transfer to a human operator.
          
          Keep responses concise and natural for phone conversation.`,
        },
        {
          role: "user",
          content: speechResult,
        },
      ],
    });
    
    // Ensure aiResponse is a string
    const aiResponse = await aiResponseResult.text();
    

    // Update call record with RAG metrics
    await prisma.call.update({
      where: { callSid },
      data: {
        transcript: speechResult,
        aiHandled: ragResponse.confidence >= (call.company.settings?.confidenceThreshold || 0.7),
        metadata: {
          ragConfidence: ragResponse.confidence,
          sourcesUsed: ragResponse.sources.length,
        },
      },
    })

    // Generate TwiML response
    const twiml = new VoiceResponse()

    // If confidence is too low, transfer to human
    if (ragResponse.confidence < (call.company.settings?.confidenceThreshold || 0.7)) {
      twiml.say(
        {
          voice: call.company.settings?.voiceType || "neural",
          language: "en-US",
        },
        "I apologize, but I'll need to transfer you to a human agent for better assistance.",
      )

      twiml.dial(call.company.settings?.fallbackNumber || process.env.FALLBACK_PHONE_NUMBER)
    } else {
      twiml.say(
        {
          voice: call.company.settings?.voiceType || "neural",
          language: "en-US",
        },
        aiResponse,
      )

      // Gather next response
      twiml.gather({
        input: "speech",
        action: "/api/calls/handle-response",
        method: "POST",
        speechTimeout: "auto",
        language: "en-US",
      })
    }

    return new NextResponse(twiml.toString(), {
      headers: {
        "Content-Type": "text/xml",
      },
    })
  } catch (error) {
    console.error("Error handling response:", error)
    const twiml = new VoiceResponse()
    twiml.say("I apologize, but I need to transfer you to a human operator.")
    twiml.dial(process.env.FALLBACK_PHONE_NUMBER)
    return new NextResponse(twiml.toString(), {
      headers: {
        "Content-Type": "text/xml",
      },
    })
  }
}

