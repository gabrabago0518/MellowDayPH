import "server-only";
import { getSupabaseAdmin, isAdminConfigured } from "./supabase-admin";

export type CustomerAuthResult =
  | { ok: true; userId: string }
  | { ok: false; status: 401 | 503; error: string };

// Verifies the Supabase access token a signed-in customer sends in the
// Authorization header, returning their real user id. Every order-writing
// route uses this instead of trusting a client-supplied user id — order
// creation and status/stage changes must be tied to whoever actually holds
// a valid session, not whatever the request body claims.
export async function verifyCustomer(request: Request): Promise<CustomerAuthResult> {
  if (!isAdminConfigured) {
    return { ok: false, status: 503, error: "Accounts aren't set up on this site yet." };
  }

  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;
  if (!token) {
    return { ok: false, status: 401, error: "You need to be logged in to do that." };
  }

  const { data, error } = await getSupabaseAdmin().auth.getUser(token);
  if (error || !data.user) {
    return { ok: false, status: 401, error: "Your session has expired — please log in again." };
  }

  return { ok: true, userId: data.user.id };
}
