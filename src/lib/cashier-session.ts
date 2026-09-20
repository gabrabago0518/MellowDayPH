import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

export const CASHIER_SESSION_COOKIE = "cashier_session";
export const CASHIER_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Reuses ADMIN_SESSION_SECRET (same env var as admin-session.ts) so there's
// one less secret to set up in Vercel — the embedded role: "cashier"
// marker is what keeps a cashier's token from being accepted as an admin
// session (or vice versa) if the cookie value were copied into the wrong
// slot.
export const isCashierSessionConfigured = Boolean(process.env.ADMIN_SESSION_SECRET);

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return secret;
}

export type CashierSessionPayload = { id: string; username: string };

export function createCashierSessionToken(payload: CashierSessionPayload): string {
  const body = Buffer.from(
    JSON.stringify({ ...payload, role: "cashier", exp: Date.now() + CASHIER_SESSION_MAX_AGE * 1000 }),
  ).toString("base64url");
  const signature = createHmac("sha256", getSecret()).update(body).digest("base64url");
  return `${body}.${signature}`;
}

export function verifyCashierSessionToken(token: string | undefined | null): CashierSessionPayload | null {
  if (!token) return null;

  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = createHmac("sha256", getSecret()).update(body).digest("base64url");
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    if (payload.role !== "cashier") return null;
    if (typeof payload.id !== "string" || typeof payload.username !== "string") return null;
    return { id: payload.id, username: payload.username };
  } catch {
    return null;
  }
}
