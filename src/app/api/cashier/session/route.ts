import { NextResponse } from "next/server";
import { verifyCashier } from "@/lib/cashier-auth";

export async function GET(request: Request) {
  const auth = await verifyCashier(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  return NextResponse.json({ id: auth.staff.id, username: auth.staff.username });
}
