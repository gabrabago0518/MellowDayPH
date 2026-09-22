import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { flagAbuse } from "@/lib/abuse-alert";
import { checkRateLimit } from "@/lib/rate-limit";

const FIVE_MIN_MS = 5 * 60_000;
const ONE_MIN_MS = 60_000;

type RouteBudget = {
  label: string;
  match: (pathname: string, method: string) => boolean;
  limit: number;
  windowMs: number;
};

// Tighter budgets for the endpoints that either cost real money per call
// (checkout/orders create a PayMongo payment intent) or have no other
// abuse protection of their own (checkout/confirm needs no login by
// design — it's authorized by PayMongo's own client_key instead; the
// admin/cashier setup+login routes only lock out repeated guesses against
// one *existing* username, not a bot spraying many different ones from
// the same IP). Everything else under /api/ falls back to DEFAULT_BUDGET,
// which is generous enough for normal admin/cashier dashboard use.
const ROUTE_BUDGETS: RouteBudget[] = [
  {
    label: "order-create",
    match: (path, method) => method === "POST" && (path === "/api/checkout" || path === "/api/orders"),
    limit: 8,
    windowMs: FIVE_MIN_MS,
  },
  {
    label: "checkout-confirm",
    match: (path, method) => method === "POST" && path === "/api/checkout/confirm",
    limit: 20,
    windowMs: FIVE_MIN_MS,
  },
  {
    label: "order-advance",
    match: (path, method) => method === "POST" && /^\/api\/orders\/[^/]+\/advance$/.test(path),
    limit: 20,
    windowMs: FIVE_MIN_MS,
  },
  {
    label: "auth",
    match: (path, method) =>
      method === "POST" &&
      (path === "/api/admin/auth/login" ||
        path === "/api/cashier/auth/login" ||
        path === "/api/admin/auth/setup"),
    limit: 10,
    windowMs: FIVE_MIN_MS,
  },
];

const DEFAULT_BUDGET = { label: "default", limit: 60, windowMs: ONE_MIN_MS };

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function proxy(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const ip = getClientIp(request);

  const budget = ROUTE_BUDGETS.find((b) => b.match(pathname, method)) ?? DEFAULT_BUDGET;
  const key = `${budget.label}:${ip}`;

  const result = checkRateLimit(key, budget.limit, budget.windowMs);
  if (!result.ok) {
    event.waitUntil(
      flagAbuse(
        `rate-limit:${key}`,
        `IP ${ip} is being rate-limited on ${method} ${pathname} (budget: ${budget.limit} req / ${budget.windowMs / 1000}s).`,
      ),
    );
    return NextResponse.json(
      { error: "Too many requests. Please slow down and try again shortly." },
      { status: 429, headers: { "Retry-After": String(result.retryAfterSeconds) } },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
