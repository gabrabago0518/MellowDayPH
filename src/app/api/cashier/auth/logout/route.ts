import { NextResponse } from "next/server";
import { CASHIER_SESSION_COOKIE } from "@/lib/cashier-session";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CASHIER_SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
