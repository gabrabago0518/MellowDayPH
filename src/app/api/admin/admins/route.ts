import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { hashPassword } from "@/lib/admin-credentials";

const USERNAME_PATTERN = /^[a-z0-9._-]+$/;

export async function GET(request: Request) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { data, error } = await getSupabaseAdmin()
    .from("admins")
    .select("id, username, full_name, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ admins: data });
}

export async function POST(request: Request) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await request.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";

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

  const { data, error } = await getSupabaseAdmin()
    .from("admins")
    .insert({ username, password_hash: hashPassword(password), full_name: fullName || null })
    .select("id, username, full_name, created_at")
    .single();

  if (error) {
    const message = error.code === "23505" ? "That username is already taken." : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ admin: data }, { status: 201 });
}
