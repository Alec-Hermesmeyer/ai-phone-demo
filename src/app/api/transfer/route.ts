import { NextResponse } from "next/server";
import { twilioClient } from "@/lib/twilio";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export async function POST(req: Request) {
  try {
    const { callSid } = await req.json();

    // Fetch call details from Supabase
    const { data: call, error: callError } = await supabase
      .from("call")
      .select("callSid, companyId, company:companyId ( settings )")
      .eq("callSid", callSid)
      .single();

    if (callError || !call) {
      return NextResponse.json({ error: "Call not found" }, { status: 404 });
    }

    // Update call in Supabase
    const { error: updateError } = await supabase
      .from("call")
      .update({ aiHandled: false })
      .eq("callSid", callSid);

    if (updateError) {
      throw new Error("Failed to update call in Supabase");
    }

    // Transfer call in Twilio
    await twilioClient.calls(callSid).update({
      twiml: `
        <Response>
          <Say>Transferring you to an agent now.</Say>
          <Dial>${call.company?.settings?.fallbackNumber || process.env.FALLBACK_PHONE_NUMBER}</Dial>
        </Response>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error transferring call:", error);
    return NextResponse.json({ error: "Failed to transfer call" }, { status: 500 });
  }
}
