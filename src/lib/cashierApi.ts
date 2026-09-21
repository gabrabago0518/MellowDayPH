import { fetchWithTimeout } from "./fetch-with-timeout";

// Cashier auth is a signed httpOnly cookie (see cashier-session.ts), sent
// automatically by the browser on same-origin requests. Every
// /api/cashier/* route re-verifies that cookie server-side regardless.
export function cashierFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetchWithTimeout(path, { ...init, credentials: "same-origin" });
}
