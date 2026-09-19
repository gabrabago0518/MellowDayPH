import "server-only";
import type { User } from "@supabase/supabase-js";
import { getAdminEmails, getSupabaseAdmin, isAdminConfigured } from "./supabase-admin";

export type AdminAuthResult =
  | { ok: true; user: User }
  | { ok: false; status: 401 | 403 | 503; error: string };

// Shared by every /api/admin/* route: verify the caller's Supabase session
// token server-side (never trust a client-claimed identity), then check
// their email against the server-only ADMIN_EMAILS allowlist.
export async function verifyAdmin(request: Request): Promise<AdminAuthResult> {
  if (!isAdminConfigured) {
    return { ok: false, status: 503, error: "Admin dashboard isn't configured yet on the server." };
  }

  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return { ok: false, status: 401, error: "Not authenticated" };
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user?.email) {
    return { ok: false, status: 401, error: error?.message || "Not authenticated" };
  }

  const adminEmails = getAdminEmails();
  if (!adminEmails.includes(data.user.email.toLowerCase())) {
    return { ok: false, status: 403, error: "Not authorized" };
  }

  return { ok: true, user: data.user };
}
