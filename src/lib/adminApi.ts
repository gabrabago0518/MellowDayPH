// Admin auth is a signed httpOnly cookie (see admin-session.ts), sent
// automatically by the browser on same-origin requests — nothing to attach
// here. Every /api/admin/* route re-verifies that cookie server-side
// regardless.
export function adminFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(path, { ...init, credentials: "same-origin" });
}
