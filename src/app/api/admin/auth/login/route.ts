import { NextResponse } from "next/server";
import { getSupabaseAdmin, isAdminConfigured } from "@/lib/supabase-admin";
import { verifyPassword } from "@/lib/admin-credentials";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createSessionToken,
  isAdminSessionConfigured,
} from "@/lib/admin-session";

export async function POST(request: Request) {
  if (!isAdminConfigured || !isAdminSessionConfigured) {
    return NextResponse.json(
      { error: "Admin dashboard isn't configured yet on the server." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  const { data: admin, error } = await getSupabaseAdmin()
    .from("admins")
    .select("id, username, password_hash")
    .eq("username", username)
    .maybeSingle();

  // Same generic error whether the username doesn't exist or the password
  // is wrong — never reveal which.
  if (error || !admin || !verifyPassword(password, admin.password_hash)) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const token = createSessionToken({ id: admin.id, username: admin.username });

  const res = NextResponse.json({ username: admin.username });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  return res;
}
