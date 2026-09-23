import { NextResponse } from "next/server";
import { logError } from "@/lib/error-log";

// Public, unauthenticated — the client error boundary (src/app/error.tsx)
// has no session to attach, by definition (it can fire on a page a signed-
// out visitor is looking at). Already covered by proxy.ts's default
// per-IP rate limit; logError itself caps message/stack length so a
// malicious payload here can't blow up storage.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message : "";
  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  await logError({
    source: "client",
    route: typeof body?.route === "string" ? body.route.slice(0, 200) : undefined,
    message,
    stack: typeof body?.stack === "string" ? body.stack : undefined,
  });

  return NextResponse.json({ ok: true });
}
