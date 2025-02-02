interface NotificationOptions {
  type: "call_completed" | "missed_call" | "voicemail"
  companyId: string
  data: Record<string, any>
}

export async function sendNotification(options: NotificationOptions) {
  try {
    // 🔴 Since Prisma is removed, you must replace this with Supabase or another database lookup
    console.warn("⚠️ No database lookup! Ensure company settings are available elsewhere.");

    const { type, data } = options;

    let subject = "";
    let content = "";

    switch (type) {
      case "call_completed":
        subject = `Call Completed - ${data.from}`;
        content = `
          A call from ${data.from} has been completed.
          Duration: ${Math.round(data.duration / 60)} minutes
          Handled by: ${data.aiHandled ? "AI Assistant" : "Human Agent"}
        `;
        break;

      case "missed_call":
        subject = `Missed Call - ${data.from}`;
        content = `
          You missed a call from ${data.from}
          Time: ${new Date().toLocaleString()}
        `;
        break;

      case "voicemail":
        subject = `New Voicemail - ${data.from}`;
        content = `
          You have a new voicemail from ${data.from}
          Duration: ${data.duration} seconds
          Recording URL: ${data.recordingUrl}
        `;
        break;
    }

    console.log("📨 Notification:", { subject, content });

    // 🔴 If you're using an email service (like SendGrid, AWS SES, or another provider), implement it here.
    // Example using console log for now:
    console.log(`Email would be sent to: (replace this with actual email service)`);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}
