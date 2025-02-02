// import { NextResponse } from "next/server";
// import twilio from "twilio";
// import { supabase } from "@/lib/supabase/supabaseClient"
// import { openai } from "@ai-sdk/openai";
// import { streamText } from "ai";

// const VoiceResponse = twilio.twiml.VoiceResponse;



// export async function POST(req: Request) {
//   try {
//     const data = await req.formData();
//     const callSid = data.get("CallSid") as string;
//     const speechResult = data.get("SpeechResult") as string;

//     // Get call and company info from Supabase
//     const { data: call, error: callError } = await supabase
//       .from("calls")
//       .select("*, company:companyId(*, settings:companyId(*))")
//       .eq("callSid", callSid)
//       .single();

//     if (callError || !call) {
//       throw new Error("Call not found");
//     }

//     // Get knowledge base from Supabase
//     const { data: knowledgeBase, error: kbError } = await supabase
//       .from("knowledgeItem")
//       .select("*")
//       .eq("companyId", call.companyId);

//     if (kbError) {
//       console.error("Failed to fetch knowledge base:", kbError.message);
//     }

//     // Generate AI response using OpenAI
//     const response = await streamText({
//       model: openai("gpt-4-turbo"),
//       messages: [
//         {
//           role: "system",
//           content: `You are an AI phone assistant for ${call.company.name}. 
//           Use the following knowledge base to answer questions:
//           ${JSON.stringify(knowledgeBase)}

//           If confidence is below ${call.company.settings?.confidenceThreshold || 0.7},
//           transfer to a human operator.
          
//           Keep responses concise and natural.`,
//         },
//         {
//           role: "user",
//           content: speechResult,
//         },
//       ],
//     });

//     const aiResponse = await response.text;

//     // Check if we should transfer to a human
//     const shouldTransfer =
//       aiResponse.toLowerCase().includes("transfer") || aiResponse.toLowerCase().includes("human operator");

//     const twiml = new VoiceResponse();

//     if (shouldTransfer) {
//       // Update call status in Supabase
//       const { error: updateError } = await supabase
//         .from("calls")
//         .update({
//           status: "transferred",
//           handoffTime: new Date().toISOString(),
//         })
//         .eq("callSid", callSid);

//       if (updateError) {
//         console.error("Failed to update call status:", updateError.message);
//       }

//       twiml.say("Transferring you to a human operator. Please hold.");
//       twiml.dial(call.company.settings?.transferNumber || "+1234567890");
//     } else {
//       twiml.say(aiResponse);

//       // Gather next response
//       twiml.gather({
//         input: ["speech"], // Wrap in array
//         action: "/api/handle-response",
//         method: "POST",
//         speechTimeout: "auto",
//         language: "en-US",
//       });
//     }

//     return new NextResponse(twiml.toString(), {
//       headers: {
//         "Content-Type": "text/xml",
//       },
//     });
//   } catch (error) {
//     console.error("Error handling response:", error);
//     const twiml = new VoiceResponse();
//     twiml.say("We are experiencing technical difficulties. Please try again later.");
//     return new NextResponse(twiml.toString(), {
//       headers: {
//         "Content-Type": "text/xml",
//       },
//     });
//   }
// }
