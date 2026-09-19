import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Trimmed defensively — a stray leading/trailing newline or space from
// copy-pasting into Vercel's env var UI turns into a literal "Invalid API
// key" rejection from Supabase's gateway that's otherwise very confusing
// to track down.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

export const isAdminConfigured = Boolean(supabaseUrl && serviceRoleKey && process.env.ADMIN_EMAILS);

// Service-role client — bypasses Row Level Security entirely. Only ever
// import this from a server-only file (API routes), never from anything
// that could end up in a client bundle.
let cachedClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL is not set");
  }
  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return cachedClient;
}

export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}
