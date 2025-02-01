import { prisma } from "./db"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface NotificationOptions {
  type: "call_completed" | "missed_call" | "voicemail"
  companyId: string
  data: Record<string, any>
}

export async function sendNotification(options: NotificationOptions) {
  try {
    const company = await prisma.company.findUnique({
      where: { id: options.companyId },
      include: { settings: true },
    })

    if (!company?.settings?.notificationEmail) {
      return
    }

    const { type, data } = options

    let subject = ""
    let content = ""

    switch (type) {
      case "call_completed":
        subject = `Call Completed - ${data.from}`
        content = `
          A call from ${data.from} has been completed.
          Duration: ${Math.round(data.duration / 60)} minutes
          Handled by: ${data.aiHandled ? "AI Assistant" : "Human Agent"}
        `
        break

      case "missed_call":
        subject = `Missed Call - ${data.from}`
        content = `
          You missed a call from ${data.from}
          Time: ${new Date().toLocaleString()}
        `
        break

      case "voicemail":
        subject = `New Voicemail - ${data.from}`
        content = `
          You have a new voicemail from ${data.from}
          Duration: ${data.duration} seconds
          Recording URL: ${data.recordingUrl}
        `
        break
    }

    await resend.emails.send({
      from: "AI Phone System <notifications@example.com>",
      to: company.settings.notificationEmail,
      subject,
      text: content.trim(),
    })
  } catch (error) {
    console.error("Error sending notification:", error)
  }
}

