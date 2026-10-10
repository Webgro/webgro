import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/work";
import { articles } from "@/content/the-gro";
import { CARE_PATH } from "@/components/preview/care/content";
import { industries } from "@/components/preview/industries/content";
import { towns } from "@/components/preview/local/content";
import { pvServices, pvSubServices } from "@/components/preview/services/content";

/**
 * Auto-generated sitemap, served at /sitemap.xml.
 *
 * Regenerates at build time from the same content arrays that power the
 * site's routes. When a new service / case / article / industry / town is
 * added to the content files, it appears in the sitemap on the next deploy,
 * no manual edits needed.
 *
 * Change `BASE` if the site moves to a different canonical domain.
 */
const BASE = "https://webgro.co.uk";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static marketing routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/work`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}${CARE_PATH}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/industries`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/web-design/berkshire`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/the-gro`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  // Dynamic routes from content
  const serviceRoutes: MetadataRoute.Sitemap = pvServices.map((s) => ({
    url: `${BASE}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // The three marketing sub-services sit under /services/marketing.
  const subServiceRoutes: MetadataRoute.Sitemap = pvSubServices.map((s) => ({
    url: `${BASE}/services/marketing/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const industryRoutes: MetadataRoute.Sitemap = industries.map((i) => ({
    url: `${BASE}/industries/${i.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const townRoutes: MetadataRoute.Sitemap = towns.map((t) => ({
    url: `${BASE}/web-design/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const caseRoutes: MetadataRoute.Sitemap = caseStudies.map((c) => ({
    url: `${BASE}/work/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE}/the-gro/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Legal pages: low priority but still indexed so the links in the
  // footer resolve in search if someone searches for our privacy policy
  // explicitly.
  const legalRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/accessibility`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...subServiceRoutes,
    ...industryRoutes,
    ...townRoutes,
    ...caseRoutes,
    ...articleRoutes,
    ...legalRoutes,
  ];
}
