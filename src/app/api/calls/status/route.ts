import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import type { CallStatus } from "@/lib/twilio"
import { sendNotification } from "@/lib/notifications"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const callSid = formData.get("CallSid") as string
    const status = formData.get("CallStatus") as CallStatus
    const duration = formData.get("CallDuration")

    // Update call record
    const call = await prisma.call.update({
      where: { callSid },
      data: {
        status,
        duration: duration ? Number.parseInt(duration as string) : undefined,
      },
      include: {
        company: {
          include: {
            settings: true,
          },
        },
      },
    })

    // Send notifications if needed
    if (status === "completed" && call.company.settings?.missedCallAlerts) {
      await sendNotification({
        type: "call_completed",
        companyId: call.companyId,
        data: {
          callSid,
          from: call.from,
          duration: duration,
          aiHandled: call.aiHandled,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error handling call status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

