import { NextResponse } from "next/server"
import  VoiceResponse  from "twilio/lib/twiml/VoiceResponse"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const callSid = formData.get("CallSid") as string
    const from = formData.get("From") as string
    const to = formData.get("To") as string

    // Create a new call record
    const call = await prisma.call.create({
      data: {
        callSid,
        from,
        to,
        status: "in-progress",
        companyId: process.env.COMPANY_ID!, // In production, get this from the phone number mapping
      },
    })

    // Get company settings
    const settings = await prisma.settings.findUnique({
      where: { companyId: call.companyId },
    })

    // Generate initial greeting
    const twiml = new VoiceResponse()

    // Add initial pause for natural conversation
    twiml.pause({ length: 1 })

    // Add initial greeting
    twiml.say(
      {
        voice: settings?.voiceType || "neural",
        language: "en-US",
      },
      settings?.greeting || "Hello, how can I help you today?",
    )

    // Gather customer input
    twiml.gather({
      input: "speech",
      action: "/api/calls/handle-response",
      method: "POST",
      speechTimeout: "auto",
      language: "en-US",
    })

    return new NextResponse(twiml.toString(), {
      headers: {
        "Content-Type": "text/xml",
      },
    })
  } catch (error) {
    console.error("Error handling incoming call:", error)
    const twiml = new VoiceResponse()
    twiml.say("We are experiencing technical difficulties. Please try again later.")
    return new NextResponse(twiml.toString(), {
      headers: {
        "Content-Type": "text/xml",
      },
    })
  }
}

