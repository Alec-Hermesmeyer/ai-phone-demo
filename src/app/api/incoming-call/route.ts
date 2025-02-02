import { NextResponse } from "next/server"
import twilio from "twilio"
import { prisma } from "@/lib/prisma";
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

const VoiceResponse = twilio.twiml.VoiceResponse

export async function POST(req: Request) {
  try {
    const data = await req.formData()
    const callSid = data.get('CallSid') as string
    const from = data.get('From') as string
    const to = data.get('To') as string

    // Create call record
    const call = await prisma.call.create({
      data: {
        callSid,
        from,
        to,
        status: 'in-progress',
        companyId: 'default', // In production, lookup company by phone number
      },
    })

    // Get company settings and knowledge base
    const company = await prisma.company.findFirst({
      where: { id: call.companyId },
      include: { settings: true },
    })

    if (!company) {
      throw new Error('Company not found')
    }

    const knowledgeBase = await prisma.knowledgeItem.findMany({
      where: { companyId: company.id },
    })

    // Generate initial greeting
    const greeting = company.settings?.greeting || "Hello, how can I help you today?"

    const twiml = new VoiceResponse()
    
    // Gather user input
    const gather = twiml.gather({
      input: ["speech"], // Wrap in array
      action: "/api/handle-response",
      method: "POST",
      speechTimeout: "auto",
      language: "en-US",
    })

    gather.say(greeting)

    // If no input received
    twiml.redirect('/api/incoming-call')

    return new NextResponse(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    })
  } catch (error) {
    console.error('Error handling incoming call:', error)
    const twiml = new VoiceResponse()
    twiml.say('We are experiencing technical difficulties. Please try again later.')
    return new NextResponse(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    })
  }
}