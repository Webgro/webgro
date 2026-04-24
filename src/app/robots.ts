import type { MetadataRoute } from "next";

/**
 * Served at /robots.txt. Allows the whole site to be crawled, points
 * Google at the auto-generated sitemap, and excludes paths that
 * shouldn't appear in the index (client proposals, internal API routes
 * if we add any).
 */
const BASE = "https://webgro.co.uk";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Client-specific proposal PDFs/decks we generate under /proposals
          "/proposals/",
          // Link-only brief forms — shared directly with clients, never
          // surfaced through nav, footer, or sitemap. Hard-disallow
          // crawling so a leaked URL doesn't accidentally get indexed.
          "/onboarding",
          "/forms/",
          // Any future API endpoints
          "/api/",
          // Next.js internals
          "/_next/",
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
