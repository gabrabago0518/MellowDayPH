import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const PAGE_SIZE = 100;

export async function GET(request: Request) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { data, error } = await getSupabaseAdmin()
    .from("error_logs")
    .select("id, source, route, message, stack, context, created_at")
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ errors: data });
}
