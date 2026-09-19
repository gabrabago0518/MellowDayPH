import { supabase } from "./supabase";

// Every /api/admin/* route re-verifies the caller server-side, so this just
// attaches the current session's access token — it never grants access on
// its own.
export async function adminFetch(path: string, init?: RequestInit): Promise<Response> {
  if (!supabase) throw new Error("Supabase isn't configured.");

  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const headers = new Headers(init?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  return fetch(path, { ...init, headers });
}
