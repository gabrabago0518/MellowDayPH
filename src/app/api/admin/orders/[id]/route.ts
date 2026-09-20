import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const VALID_STAGES = ["confirmation", "preparing", "out_for_delivery", "delivered"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const stage = body?.stage;

  if (typeof stage !== "string" || !VALID_STAGES.includes(stage)) {
    return NextResponse.json({ error: "Invalid stage." }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from("orders")
    .update({ stage })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ order: data });
}
