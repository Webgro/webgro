/**
 * JSON-LD helpers.
 *
 * Centralises every structured-data object the site emits so we keep
 * the shapes consistent and can tweak Organisation-level facts in one
 * place. Rendered inside a `<script type="application/ld+json">` tag.
 *
 * Schemas used:
 *   - Organization + ProfessionalService: site-wide (mounted in layout.tsx)
 *   - WebSite: site-wide
 *   - Service (+ FAQPage): per service page
 *   - CreativeWork: per case study
 *   - Article: per journal article
 *   - BreadcrumbList: on nested routes
 *
 * Reference: https://schema.org, https://developers.google.com/search/docs
 */

type JsonValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonValue[]
  | { [k: string]: JsonValue };

/** Renders a plain JSON-LD script tag in the server HTML, as the Next.js
 *  JSON-LD guide recommends, so crawlers that don't run JavaScript still see
 *  it. `<` is escaped so the payload can't close the tag. `undefined` values
 *  are stripped by JSON.stringify, which suits optional fields. */
export function JsonLd({
  id,
  data,
}: {
  id: string;
  data: Record<string, JsonValue>;
}) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

// ---------------------------------------------------------------------------
// Site-wide building blocks
// ---------------------------------------------------------------------------

const SITE = "https://webgro.co.uk";

/** The named author of articles in The Gro. Add his LinkedIn to sameAs once it's confirmed. */
export const MICHAEL = {
  "@type": "Person",
  "@id": `${SITE}/#michael`,
  name: "Michael Broadbridge",
  jobTitle: "Co-founder and CEO",
  worksFor: { "@id": `${SITE}/#org` },
  url: `${SITE}/about`,
  knowsAbout: ["Shopify", "WordPress", "eCommerce", "SEO", "AI search", "Artificial intelligence"],
};

export function organisationLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${SITE}/#org`,
    name: "Webgro",
    legalName: "Webgro Ltd",
    url: SITE,
    logo: `${SITE}/brand/logo.png`,
    image: `${SITE}/brand/logo.png`,
    description:
      "Shopify and WordPress web design studio in Bracknell, Berkshire, also offering SEO, marketing and AI tools.",
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
    sameAs: [
      "https://www.linkedin.com/company/webgroltd",
      "https://www.facebook.com/webgroltd",
      "https://maps.google.com/?cid=10237799358321821754",
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

/** A starting price. unit is a UN/CEFACT code: MON a month, DAY a day, HUR an hour. None means a one-off price. */
export type StartingPrice = { from: number; unit?: "MON" | "DAY" | "HUR" };

export function serviceLd({
  slug,
  name,
  summary,
  price,
}: {
  slug: string;
  name: string;
  summary: string;
  price?: StartingPrice;
}) {
  const offers = price
    ? {
        offers: {
          "@type": "Offer",
          priceCurrency: "GBP",
          url: `${SITE}/services/${slug}`,
          priceSpecification: {
            "@type": price.unit ? "UnitPriceSpecification" : "PriceSpecification",
            minPrice: price.from,
            priceCurrency: "GBP",
            ...(price.unit ? { unitCode: price.unit } : {}),
          },
        },
      }
    : {};
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
    ...offers,
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
    name: `${client} case study`,
    about: client,
    abstract: excerpt,
    creator: { "@id": `${SITE}/#org` },
    image: heroImage ? `${SITE}${heroImage}` : undefined,
    // `year` is display text such as "2023 to present"; structured data needs a date.
    datePublished: year?.match(/\d{4}/)?.[0],
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
    datePublished: isoMonth(date),
    dateModified: isoMonth(date),
    author: author === MICHAEL.name ? MICHAEL : { "@type": "Organization", name: author, url: SITE },
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

/** "May 2026" to "2026-05". Anything already in ISO form passes through. */
function isoMonth(date: string): string {
  const m = date.match(/^([A-Za-z]{3})[a-z]*\s+(\d{4})$/);
  if (!m) return date;
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const i = months.indexOf(m[1].toLowerCase());
  return i < 0 ? date : `${m[2]}-${String(i + 1).padStart(2, "0")}`;
}

export function faqLd(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

// ---------------------------------------------------------------------------
// Local and industry landing pages (appended for the redesign concept)
// ---------------------------------------------------------------------------

/** Web design for one town or county. The studio's address stays on the
 *  Organization: this only says where the service is offered. */
export function localServiceLd({
  path,
  name,
  description,
  area,
}: {
  path: string;
  name: string;
  description: string;
  area: { type: "City" | "AdministrativeArea"; name: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE}${path}#service`,
    name,
    serviceType: "Web design",
    description,
    provider: { "@id": `${SITE}/#org` },
    areaServed: {
      "@type": area.type,
      name: area.name,
      ...(area.type === "City"
        ? { containedInPlace: { "@type": "AdministrativeArea", name: "Berkshire" } }
        : {}),
    },
    url: `${SITE}${path}`,
  };
}

/** Web design and related services for one industry. */
export function industryServiceLd({
  path,
  name,
  description,
  audience,
}: {
  path: string;
  name: string;
  description: string;
  audience: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE}${path}#service`,
    name,
    serviceType: "Web design and development",
    description,
    provider: { "@id": `${SITE}/#org` },
    audience: { "@type": "BusinessAudience", audienceType: audience },
    areaServed: "GB",
    url: `${SITE}${path}`,
  };
}
