import "server-only";

type Bucket = { count: number; resetAt: number };

// Fixed-window counter, per server instance. This is intentionally simple:
// on Vercel each instance keeps its own map, so a determined attacker
// spreading requests across many cold instances can get a higher effective
// rate than the numbers below suggest. It still stops the common case —
// a script or bot hammering one endpoint from one place — which is what
// actually runs up a bill, without adding a paid external store (e.g.
// Redis) this project doesn't otherwise need.
const buckets = new Map<string, Bucket>();

// Caps how many distinct keys (IP+route combinations) this instance will
// track at once. Without this, a distributed attacker sending a unique
// IP/header per request could grow this map forever until the function
// runs out of memory — the fix isn't to remember every attacker forever,
// just to bound memory and keep rate-limiting the ones that keep talking
// to us. Clearing under pressure occasionally lets a few requests slip
// through un-throttled, which is an acceptable trade for bounded memory.
const MAX_TRACKED_KEYS = 5000;

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    if (buckets.size >= MAX_TRACKED_KEYS) {
      buckets.clear();
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (existing.count >= limit) {
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)) };
  }

  existing.count++;
  return { ok: true };
}
