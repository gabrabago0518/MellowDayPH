import type { NextConfig } from "next";

// A Content-Security-Policy isn't set here — this app relies on inline
// <script>/<style> (Next.js's own hydration payload, and inline style
// attributes like Reveal's transition-delay) in ways that would need a
// nonce-based middleware setup to lock down safely. Shipping a CSP that
// hadn't been verified against the real production Supabase project URL
// and the Google Maps embed risked silently breaking login/checkout/maps
// with no way to catch it from this environment — worth adding later once
// it can be tested against the live site.
const securityHeaders = [
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
