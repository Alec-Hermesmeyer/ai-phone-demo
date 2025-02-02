import { NextResponse } from "next/server";
import { twilioClient } from "@/lib/twilio";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

interface Call {
  callSid: string;
  companyId: string;
  company: {
    id: string;
    settings: any;
  }[] | null; // Array type for joined records
}

export async function POST(req: Request) {
  try {
    const { callSid } = await req.json();

    // Fetch call details from Supabase
    const { data: call, error: callError } = await supabase
      .from("call")
      .select("callSid, companyId, company:companyId ( id, settings )")
      .eq("callSid", callSid)
      .maybeSingle();

    if (callError || !call) {
      return NextResponse.json({ error: "Call not found" }, { status: 404 });
    }

    // Get the settings correctly from the first company record
    const companySettings = call.company?.[0]?.settings || null;

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
          <Dial>${companySettings?.fallbackNumber || process.env.FALLBACK_PHONE_NUMBER}</Dial>
        </Response>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error transferring call:", error);
    return NextResponse.json({ error: "Failed to transfer call" }, { status: 500 });
  }
}