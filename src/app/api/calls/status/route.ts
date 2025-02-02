import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabaseClient"
import type { CallStatus } from "@/lib/twilio";
import { sendNotification } from "@/lib/notifications";

// Initialize Supabase client


export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const callSid = formData.get("CallSid") as string;
    const status = formData.get("CallStatus") as CallStatus;
    const duration = formData.get("CallDuration");

    // Update call record in Supabase
    const { data: updatedCall, error: updateError } = await supabase
      .from("calls")
      .update({
        status,
        duration: duration ? Number.parseInt(duration as string) : undefined,
      })
      .eq("callSid", callSid)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update call record: ${updateError.message}`);
    }

    // Get company settings from Supabase
    const { data: settings, error: settingsError } = await supabase
      .from("settings")
      .select("*")
      .eq("companyId", updatedCall.companyId)
      .single();

    if (settingsError) {
      console.error("Failed to fetch company settings:", settingsError.message);
    }

    // Send notifications if needed
    if (status === "completed" && settings?.missedCallAlerts) {
      await sendNotification({
        type: "call_completed",
        companyId: updatedCall.companyId,
        data: {
          callSid,
          from: updatedCall.from,
          duration,
          aiHandled: updatedCall.aiHandled,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling call status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
