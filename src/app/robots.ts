import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Aree private/non indicizzabili.
      disallow: ["/admin", "/checkout", "/account", "/login", "/register"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
