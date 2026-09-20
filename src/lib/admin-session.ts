import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const isAdminSessionConfigured = Boolean(process.env.ADMIN_SESSION_SECRET);

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return secret;
}

export type AdminSessionPayload = { id: string; username: string };

// A minimal signed cookie token (payload + HMAC signature) rather than a
// full JWT library — the admin dashboard only ever needs to trust its own
// signature, never interop with anything else.
export function createSessionToken(payload: AdminSessionPayload): string {
  const body = Buffer.from(
    JSON.stringify({ ...payload, exp: Date.now() + ADMIN_SESSION_MAX_AGE * 1000 }),
  ).toString("base64url");
  const signature = createHmac("sha256", getSecret()).update(body).digest("base64url");
  return `${body}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): AdminSessionPayload | null {
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
    if (typeof payload.id !== "string" || typeof payload.username !== "string") return null;
    return { id: payload.id, username: payload.username };
  } catch {
    return null;
  }
}
