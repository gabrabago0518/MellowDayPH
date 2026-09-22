import type { NextConfig } from "next";

// Static-friendly CSP: set once via next.config.ts headers(), no proxy.ts
// generating per-request nonces. That's a deliberate choice — a nonce-based
// CSP is stricter (it can block inline script injection too) but requires
// every page to render dynamically instead of statically, which this app
// doesn't need to trade away. This version can't stop an inline <script>
// injected via XSS from running (script-src needs 'unsafe-inline' for
// Next's own hydration scripts, and style-src needs it for inline style
// attributes like Reveal's transition-delay), but it still blocks loading
// scripts/images/frames from unexpected domains, clickjacking, base-tag
// hijacking, and form-hijacking.
//
// Scoped to what this site actually loads: Supabase (auth/session calls
// from the browser), the Google Maps embed in Visit Us, and next/font's
// self-hosted (same-origin) fonts — no other third-party scripts, styles,
// or images are used anywhere in the app.
const isDev = process.env.NODE_ENV === "development";

const cspDirectives = [
  "default-src 'self'",
  // 'unsafe-eval' is only needed in dev (React's debug error reconstruction).
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://*.supabase.co",
  "frame-src https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
];

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives.join("; ") },
  // Blocks this site from being embedded in an iframe elsewhere (clickjacking).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Stops browsers from guessing a response's content type away from what
  // the server declared.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Sends the full URL as a referrer only to our own origin; other sites
  // just get the origin, not the full path/query.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // This site never uses these browser features.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
