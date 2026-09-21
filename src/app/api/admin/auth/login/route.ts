import { NextResponse } from "next/server";
import { getSupabaseAdmin, isAdminConfigured } from "@/lib/supabase-admin";
import { verifyPassword } from "@/lib/admin-credentials";
import { clearFailedAttempts, isLocked, recordFailedAttempt } from "@/lib/login-lockout";
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

  const supabaseAdmin = getSupabaseAdmin();
  const { data: admin, error } = await supabaseAdmin
    .from("admins")
    .select("id, username, password_hash, failed_attempts, locked_until")
    .eq("username", username)
    .maybeSingle();

  // Same generic error whether the username doesn't exist or the password
  // is wrong — never reveal which.
  if (error || !admin) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  if (isLocked(admin)) {
    return NextResponse.json(
      { error: "Too many failed attempts. Try again in a few minutes." },
      { status: 401 },
    );
  }

  if (!verifyPassword(password, admin.password_hash)) {
    await recordFailedAttempt(supabaseAdmin, "admins", admin);
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  await clearFailedAttempts(supabaseAdmin, "admins", admin.id);

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
