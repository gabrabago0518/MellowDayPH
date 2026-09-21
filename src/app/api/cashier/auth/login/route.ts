import { NextResponse } from "next/server";
import { getSupabaseAdmin, isAdminConfigured } from "@/lib/supabase-admin";
import { verifyPassword } from "@/lib/admin-credentials";
import { clearFailedAttempts, isLocked, recordFailedAttempt } from "@/lib/login-lockout";
import {
  CASHIER_SESSION_COOKIE,
  CASHIER_SESSION_MAX_AGE,
  createCashierSessionToken,
  isCashierSessionConfigured,
} from "@/lib/cashier-session";

export async function POST(request: Request) {
  if (!isAdminConfigured || !isCashierSessionConfigured) {
    return NextResponse.json(
      { error: "Cashier dashboard isn't configured yet on the server." },
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
  const { data: staff, error } = await supabaseAdmin
    .from("staff")
    .select("id, username, password_hash, status, failed_attempts, locked_until")
    .eq("username", username)
    .maybeSingle();

  // Same generic error whether the username doesn't exist, the password is
  // wrong, or the account has no login set up (password_hash null) or has
  // been deactivated — never reveal which.
  if (error || !staff || !staff.password_hash || staff.status !== "active") {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  if (isLocked(staff)) {
    return NextResponse.json(
      { error: "Too many failed attempts. Try again in a few minutes." },
      { status: 401 },
    );
  }

  if (!verifyPassword(password, staff.password_hash)) {
    await recordFailedAttempt(supabaseAdmin, "staff", staff);
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  await clearFailedAttempts(supabaseAdmin, "staff", staff.id);

  const token = createCashierSessionToken({ id: staff.id, username: staff.username });

  const res = NextResponse.json({ username: staff.username });
  res.cookies.set(CASHIER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CASHIER_SESSION_MAX_AGE,
  });
  return res;
}
