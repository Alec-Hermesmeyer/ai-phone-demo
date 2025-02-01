import { NextResponse } from "next/server"
import { twilioClient } from "@/lib/twilio"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { callSid } = await req.json()

    // Get call details
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
      return NextResponse.json({ error: "Call not found" }, { status: 404 })
    }

    // Update call in database
    await prisma.call.update({
      where: { callSid },
      data: {
        aiHandled: false,
      },
    })

    // Transfer call in Twilio
    await twilioClient.calls(callSid).update({
      twiml: `
          <Response>
            <Say>Transferring you to an agent now.</Say>
            <Dial>${call.company.settings?.fallbackNumber || process.env.FALLBACK_PHONE_NUMBER}</Dial>
          </Response>
        `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error transferring call:", error)
    return NextResponse.json({ error: "Failed to transfer call" }, { status: 500 })
  }
}

