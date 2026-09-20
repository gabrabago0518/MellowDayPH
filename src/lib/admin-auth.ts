import "server-only";
import { isAdminConfigured } from "./supabase-admin";
import {
  ADMIN_SESSION_COOKIE,
  isAdminSessionConfigured,
  verifySessionToken,
  type AdminSessionPayload,
} from "./admin-session";

export type AdminAuthResult =
  | { ok: true; admin: AdminSessionPayload }
  | { ok: false; status: 401 | 503; error: string };

function getCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return undefined;
}

// Shared by every /api/admin/* route: verify the signed admin_session
// cookie server-side. Admin accounts live in their own `admins` table,
// entirely separate from customer accounts in auth.users — there is no
// email or allowlist involved here, just a valid signed session.
export async function verifyAdmin(request: Request): Promise<AdminAuthResult> {
  if (!isAdminConfigured || !isAdminSessionConfigured) {
    return { ok: false, status: 503, error: "Admin dashboard isn't configured yet on the server." };
  }

  const token = getCookie(request, ADMIN_SESSION_COOKIE);
  const admin = verifySessionToken(token);
  if (!admin) {
    return { ok: false, status: 401, error: "Not authenticated" };
  }

  return { ok: true, admin };
}
