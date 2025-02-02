// import { NextResponse } from "next/server";
// import { getCurrentCompany } from "@/lib/auth";
// import { supabase } from "@/lib/supabase/supabaseClient"

// // Initialize Supabase client


// export async function GET() {
//   try {
//     const company = await getCurrentCompany();

//     // Fetch knowledge items from Supabase
//     const { data: items, error } = await supabase
//       .from("knowledgeItem")
//       .select("*")
//       .eq("companyId", company.id);

//     if (error) {
//       throw new Error("Failed to fetch knowledge items");
//     }

//     return NextResponse.json(items);
//   } catch (error) {
//     console.error("Error fetching knowledge items:", error);
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const company = await getCurrentCompany();
//     const data = await req.json();

//     // Insert new knowledge item into Supabase
//     const { data: item, error } = await supabase
//       .from("knowledgeItem")
//       .insert([{ companyId: company.id, ...data }])
//       .select()
//       .single();

//     if (error) {
//       throw new Error("Failed to create knowledge item");
//     }

//     return NextResponse.json(item);
//   } catch (error) {
//     console.error("Error creating knowledge item:", error);
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
// }
