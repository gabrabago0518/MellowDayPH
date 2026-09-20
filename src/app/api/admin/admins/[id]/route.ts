import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;
  if (id === auth.admin.id) {
    return NextResponse.json({ error: "You can't remove your own admin account." }, { status: 400 });
  }

  const { error } = await getSupabaseAdmin().from("admins").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
