import { caseStudies } from "@/content/work";
import { articles } from "@/content/the-gro";
import { pvServices, pvSubServices } from "@/components/preview/services/content";
import { towns } from "@/components/preview/local/content";
import { industries } from "@/components/preview/industries/content";
import { ARTICLE_META, CASE_META, PREVIEW_ROBOTS, SERVICE_META } from "@/components/preview/seo";

/**
 * Served at /llms.txt: a plain summary of the site for AI tools such as
 * ChatGPT, Claude and Perplexity (https://llmstxt.org). Built from the same
 * content as the pages, so it stays current.
 *
 * It is tied to the same switch as the pages: if PREVIEW_ROBOTS is ever set
 * back to noindex this returns 404, so the file never describes a site that
 * is not meant to be found. ?preview=1 still serves it either way, for
 * checking locally.
 */
const SITE = "https://webgro.co.uk";

const PRICES: Record<string, string> = {
  websites: "from £4,000. WordPress builds usually £4k to £15k, Shopify rebuilds £5k to £25k",
  consultancy: "£400 a day",
  "automation-ai": "per project, usually £1k to £15k to build",
  seo: "from £750 a month",
  design: "£80 an hour",
  "email-marketing": "from £800 a month plus setup fees",
  ppc: "from £1,000 a month plus ad budget",
  "social-media": "from £400 a month",
};

const launched = () => {
  const r = PREVIEW_ROBOTS;
  return !(r && typeof r === "object" && "index" in r && r.index === false);
};

export function GET(request: Request) {
  if (!launched() && new URL(request.url).searchParams.get("preview") !== "1") {
    return new Response("Not found", { status: 404 });
  }

  const service = (s: { slug: string; name: string; parent?: string }) => {
    const path = s.parent ? `/services/${s.parent}/${s.slug}` : `/services/${s.slug}`;
    const price = PRICES[s.slug] ? ` Price: ${PRICES[s.slug]}.` : "";
    return `- [${s.name}](${SITE}${path}): ${SERVICE_META[s.slug]?.description ?? ""}${price}`;
  };

  const body = `# Webgro

> Webgro is a four-person web design studio in Bracknell, Berkshire, UK. We design, build and look after Shopify and WordPress websites, and also offer eCommerce consultancy, AI and automation, SEO, email marketing, PPC, social media management and brand design. In business since 2012 (as 4ogo, then Broadbridge Design, and Webgro since 2022). Shopify Partner. Rated 5.0 on Google from 14 reviews.

Contact: hello@webgro.co.uk, 01344 231 119. Address: 12 Longshot Lane, Bracknell, Berkshire RG12 1RL. Webgro Ltd, company number 10889889.

## Services

${pvServices.map(service).join("\n")}
${pvSubServices.map(service).join("\n")}
- [Care plans](${SITE}/care-plans): Monthly website care from £80, £250 or £500 a month.

## Industries

${industries.map((i) => `- [${i.name}](${SITE}/industries/${i.slug}): ${i.meta.description}`).join("\n")}

## Local

- [Web design in Berkshire](${SITE}/web-design/berkshire): The studio is in Bracknell and works with businesses across Berkshire and the UK.
${towns.map((t) => `- [Web design in ${t.name}](${SITE}/web-design/${t.slug}): ${t.meta.description}`).join("\n")}

## Case studies

${caseStudies.map((c) => `- [${c.client}](${SITE}/work/${c.slug}): ${CASE_META[c.slug]?.description ?? c.excerpt}`).join("\n")}

## Articles

${articles.map((a) => `- [${ARTICLE_META[a.slug]?.title.replace(/ \| Webgro$/, "") ?? a.title}](${SITE}/the-gro/${a.slug}): ${ARTICLE_META[a.slug]?.description ?? a.excerpt}`).join("\n")}

## About

- [About Webgro](${SITE}/about): The team, the studio's history since 2012 and its awards, including Best Web Design Agency in the UK in 2022.
- [Contact](${SITE}/contact): Start a project. We reply within one working day.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
