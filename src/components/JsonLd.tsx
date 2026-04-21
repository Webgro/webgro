/**
 * JSON-LD helpers.
 *
 * Centralises every structured-data object the site emits so we keep
 * the shapes consistent and can tweak Organisation-level facts in one
 * place. Rendered inside a `<script type="application/ld+json">` tag.
 *
 * Schemas used:
 *   - Organisation + LocalBusiness    — site-wide (mounted in layout.tsx)
 *   - WebSite                         — site-wide, includes SearchAction
 *   - Service                         — per /services/[slug]
 *   - CreativeWork / CaseStudy        — per /work/[slug]
 *   - Article                         — per /the-gro/[slug]
 *   - BreadcrumbList                  — on nested routes
 *
 * Reference: https://schema.org, https://developers.google.com/search/docs
 */

import Script from "next/script";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonValue[]
  | { [k: string]: JsonValue };

/** Renders a JSON-LD script tag. Always uses `beforeInteractive` so
 *  crawlers see it before anything else executes. `undefined` values
 *  inside the data object are stripped by JSON.stringify, which is the
 *  behaviour we want (e.g. for optional fields). */
export function JsonLd({
  id,
  data,
}: {
  id: string;
  data: Record<string, JsonValue>;
}) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      strategy="afterInteractive"
      // Next's Script component escapes dangerouslySetInnerHTML safely.
      // The JSON itself is trusted (we generated it).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ---------------------------------------------------------------------------
// Site-wide building blocks
// ---------------------------------------------------------------------------

const SITE = "https://webgro.co.uk";

export function organisationLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${SITE}/#org`,
    name: "Webgro",
    legalName: "Webgro Ltd",
    url: SITE,
    logo: `${SITE}/brand/logo-white.png`,
    email: "hello@webgro.co.uk",
    telephone: "+44 1344 231119",
    foundingDate: "2012",
    vatID: undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: "12 Longshot Lane",
      addressLocality: "Bracknell",
      addressRegion: "Berkshire",
      postalCode: "RG12 1RL",
      addressCountry: "GB",
    },
    areaServed: "GB",
    parentOrganization: {
      "@type": "Organization",
      name: "Broadbridge Group",
      url: "https://broadbridge.co.uk",
    },
    sameAs: [
      // Add real social URLs as they go live.
      "https://broadbridge.co.uk",
    ],
    identifier: "10889889", // UK Companies House number
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: SITE,
    name: "Webgro",
    publisher: { "@id": `${SITE}/#org` },
    inLanguage: "en-GB",
  };
}

// ---------------------------------------------------------------------------
// Per-page builders
// ---------------------------------------------------------------------------

export function serviceLd({
  slug,
  name,
  summary,
}: {
  slug: string;
  name: string;
  summary: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE}/services/${slug}#service`,
    serviceType: name,
    name,
    description: summary,
    provider: { "@id": `${SITE}/#org` },
    areaServed: "GB",
    url: `${SITE}/services/${slug}`,
  };
}

export function caseStudyLd({
  slug,
  client,
  excerpt,
  heroImage,
  year,
}: {
  slug: string;
  client: string;
  excerpt: string;
  heroImage?: string;
  year?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${SITE}/work/${slug}#work`,
    name: `${client} — case study`,
    about: client,
    abstract: excerpt,
    creator: { "@id": `${SITE}/#org` },
    image: heroImage ? `${SITE}${heroImage}` : undefined,
    datePublished: year,
    url: `${SITE}/work/${slug}`,
  };
}

export function articleLd({
  slug,
  title,
  excerpt,
  author,
  heroImage,
  date,
}: {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  heroImage: string;
  date: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE}/the-gro/${slug}#article`,
    headline: title,
    description: excerpt,
    image: `${SITE}${heroImage}`,
    datePublished: date,
    dateModified: date,
    author: { "@type": "Person", name: author },
    publisher: { "@id": `${SITE}/#org` },
    mainEntityOfPage: `${SITE}/the-gro/${slug}`,
  };
}

export function breadcrumbsLd(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
