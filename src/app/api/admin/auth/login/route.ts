import { NextResponse } from "next/server";
import { getAdminEmails, getSupabaseAdmin, isAdminConfigured } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  if (!isAdminConfigured) {
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

  // There's no separate username field anywhere — it's just the local part
  // of one of the allowed admin emails, so logging in this way needs no new
  // table or migration. (If ADMIN_EMAILS ever has two emails sharing a
  // local part, the first match wins.)
  const email = getAdminEmails().find((e) => e.split("@")[0] === username);

  // Same generic error either way — never reveal whether the username
  // matched an admin email or not.
  if (!email) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const { data, error } = await getSupabaseAdmin().auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  return NextResponse.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });
}
