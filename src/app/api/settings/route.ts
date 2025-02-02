import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "../../../../lib/supabase/types";

export async function GET() {
  try {
    const cookieStore = cookies(); // ✅ FIX: Do not await cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: settings, error } = await supabase
      .from("settings")
      .select("*")
      .eq("company_id", session.user.id)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = cookies(); // ✅ FIX: Do not await cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const { data: settings, error } = await supabase
      .from("settings")
      .upsert({
        company_id: session.user.id,
        ...data,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
