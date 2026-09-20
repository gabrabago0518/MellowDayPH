import "server-only";
import { isAdminConfigured } from "./supabase-admin";
import {
  CASHIER_SESSION_COOKIE,
  isCashierSessionConfigured,
  verifyCashierSessionToken,
  type CashierSessionPayload,
} from "./cashier-session";

export type CashierAuthResult =
  | { ok: true; staff: CashierSessionPayload }
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

// Shared by every /api/cashier/* route: verify the signed cashier_session
// cookie server-side. Cashier accounts live in the same `staff` table the
// admin Employees tab manages, but login is entirely separate from admin
// login (different cookie, verified here rather than in admin-auth.ts).
export async function verifyCashier(request: Request): Promise<CashierAuthResult> {
  if (!isAdminConfigured || !isCashierSessionConfigured) {
    return { ok: false, status: 503, error: "Cashier dashboard isn't configured yet on the server." };
  }

  const token = getCookie(request, CASHIER_SESSION_COOKIE);
  const staff = verifyCashierSessionToken(token);
  if (!staff) {
    return { ok: false, status: 401, error: "Not authenticated" };
  }

  return { ok: true, staff };
}
