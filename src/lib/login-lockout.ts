import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 15;

type LockableAccount = {
  id: string;
  failed_attempts: number;
  locked_until: string | null;
};

export function isLocked(account: Pick<LockableAccount, "locked_until">): boolean {
  return Boolean(account.locked_until && new Date(account.locked_until).getTime() > Date.now());
}

// After MAX_FAILED_ATTEMPTS consecutive wrong passwords against the same
// existing account, lock it out for LOCKOUT_MINUTES — slows down brute
// forcing a specific admin/cashier account. Doesn't protect against an
// attacker spraying many different usernames, which would need IP-based
// rate limiting (separate infrastructure this project doesn't have).
export async function recordFailedAttempt(
  supabaseAdmin: SupabaseClient,
  table: "admins" | "staff",
  account: LockableAccount,
): Promise<void> {
  const attempts = account.failed_attempts + 1;
  const lockedOut = attempts >= MAX_FAILED_ATTEMPTS;
  await supabaseAdmin
    .from(table)
    .update({
      failed_attempts: lockedOut ? 0 : attempts,
      locked_until: lockedOut ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000).toISOString() : null,
    })
    .eq("id", account.id);
}

export async function clearFailedAttempts(
  supabaseAdmin: SupabaseClient,
  table: "admins" | "staff",
  id: string,
): Promise<void> {
  await supabaseAdmin.from(table).update({ failed_attempts: 0, locked_until: null }).eq("id", id);
}
