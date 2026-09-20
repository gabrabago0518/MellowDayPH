import { NextResponse } from "next/server";
import { getSupabaseAdmin, isAdminConfigured } from "@/lib/supabase-admin";
import { hashPassword } from "@/lib/admin-credentials";

const USERNAME_PATTERN = /^[a-z0-9._-]+$/;

export async function POST(request: Request) {
  const setupKey = process.env.ADMIN_SETUP_KEY;
  if (!isAdminConfigured || !setupKey) {
    return NextResponse.json({ error: "Admin setup isn't enabled on this server." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const providedKey = typeof body?.setupKey === "string" ? body.setupKey : "";
  const username = typeof body?.username === "string" ? body.username.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";

  if (providedKey !== setupKey) {
    return NextResponse.json({ error: "Invalid setup key." }, { status: 401 });
  }
  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }
  if (!USERNAME_PATTERN.test(username)) {
    return NextResponse.json(
      { error: "Username can only contain lowercase letters, numbers, dots, underscores, and hyphens." },
      { status: 400 },
    );
  }

  const { error } = await getSupabaseAdmin()
    .from("admins")
    .insert({ username, password_hash: hashPassword(password), full_name: fullName || null });

  if (error) {
    const message = error.code === "23505" ? "That username is already taken." : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
