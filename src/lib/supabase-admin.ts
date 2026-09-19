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

// Safe-to-show diagnostics for when Supabase rejects the service-role key —
// never the key itself, just enough shape (length, which key format) to
// confirm whether the value the running deployment actually has matches
// what was pasted into Vercel, without a screenshot round-trip.
export function getServiceKeyDiagnostics() {
  const key = serviceRoleKey ?? "";
  let format: "empty" | "new-secret" | "legacy-jwt" | "unrecognized" = "unrecognized";
  if (!key) format = "empty";
  else if (key.startsWith("sb_secret_")) format = "new-secret";
  else if (key.startsWith("eyJ")) format = "legacy-jwt";

  return {
    urlUsed: supabaseUrl ?? null,
    serviceKeyLength: key.length,
    serviceKeyFormat: format,
  };
}

export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}
