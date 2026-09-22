import type { MetadataRoute } from "next";

const SITE_URL = "https://mellowdayph.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // No value to a searcher landing here, and no reason to spend crawl
      // budget on auth-gated or account-specific pages.
      disallow: [
        "/api/",
        "/admin",
        "/admin/",
        "/cashier",
        "/cashier/",
        "/checkout",
        "/checkout/",
        "/orders",
        "/profile",
        "/login",
        "/signup",
        "/auth/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
