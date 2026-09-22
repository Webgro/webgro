import type { Metadata } from "next";
import type { StartingPrice } from "@/components/JsonLd";

/**
 * Page titles, descriptions, canonicals and social tags for every page on the
 * site. Canonicals point at the final URLs.
 *
 * The redesign is live, so pages are indexable. Setting this back to
 * { index: false, follow: false } takes the whole site out of search again,
 * and also switches /llms.txt back off.
 */
export const PREVIEW_ROBOTS: Metadata["robots"] = { index: true, follow: true };

const SITE = "https://webgro.co.uk";

type Meta = { title: string; description: string };

export function pageMeta({
  title,
  description,
  path,
  image,
  type = "website",
}: Meta & { path: string; image?: string; type?: "website" | "article" }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: `${SITE}${path}`,
      siteName: "Webgro",
      locale: "en_GB",
      type,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: { card: "summary_large_image", title, description, ...(image ? { images: [image] } : {}) },
    robots: PREVIEW_ROBOTS,
  };
}

export const PAGE_META = {
  home: {
    title: "Shopify & WordPress Web Design Studio in Bracknell | Webgro",
    description:
      "Webgro designs, builds and looks after Shopify and WordPress websites, with SEO, marketing and AI tools, from a small team in Bracknell, Berkshire.",
  },
  work: {
    title: "Our Work: Shopify & WordPress Case Studies | Webgro",
    description:
      "Case studies with measured results: Shopify rebuilds, WordPress sites and AI tools for Gieves & Hawkes, Fun Cases, ValuePet, Twisted Tailor and more.",
  },
  services: {
    title: "Web Design, SEO & Marketing Services | Webgro",
    description:
      "Shopify and WordPress websites, consultancy, AI and automation, SEO, marketing and design from Webgro, a small studio in Bracknell, Berkshire.",
  },
  about: {
    title: "About Webgro | Web Design Studio in Bracknell Since 2012",
    description:
      "Webgro has built websites since 2012, first as 4ogo and then Broadbridge Design. Meet the four-person team in Bracknell and see the awards we've won.",
  },
  contact: {
    title: "Contact Webgro | Start a Website Project",
    description:
      "Tell us about your project. Email hello@webgro.co.uk or call 01344 231 119, and we'll reply within one working day.",
  },
  journal: {
    title: "The Gro: Notes on Shopify, SEO and AI | Webgro",
    description:
      "Articles from the Webgro team on building websites, being found on Google and in AI search, and using AI where it saves real time.",
  },
  privacy: {
    title: "Privacy Policy | Webgro",
    description:
      "How Webgro Ltd collects, uses and protects personal data, including enquiries, analytics and your rights under UK GDPR.",
  },
  cookies: {
    title: "Cookie Policy | Webgro",
    description:
      "The cookies used on webgro.co.uk, what each one does, and how to change your cookie preferences at any time.",
  },
  accessibility: {
    title: "Accessibility Statement | Webgro",
    description:
      "How we make webgro.co.uk accessible, the standards we work to, and how to tell us about any accessibility problem you find.",
  },
} satisfies Record<string, Meta>;

export const SERVICE_META: Record<string, Meta> = {
  websites: {
    title: "Shopify & WordPress Website Design and Build | Webgro",
    description:
      "Custom Shopify and WordPress websites, designed and built in Bracknell. Fast on mobile, easy for your team to edit, and set up for search from launch.",
  },
  consultancy: {
    title: "eCommerce Consultancy | Webgro",
    description:
      "Senior eCommerce advice for growing online shops: audits, platform decisions and a clear plan of what to fix first, without a full-time hire.",
  },
  "automation-ai": {
    title: "AI & Automation for Online Businesses | Webgro",
    description:
      "Custom AI tools and automations built into your Shopify stack, for customer service, product content, stock planning and order routing.",
  },
  seo: {
    title: "SEO for Shopify & WordPress Websites | Webgro",
    description:
      "Technical SEO, content and monthly reporting for Shopify and WordPress sites, covering both Google rankings and AI search results.",
  },
  marketing: {
    title: "Digital Marketing: PPC, Email & Social | Webgro",
    description:
      "Paid ads, email marketing and social media run together by one team, with reporting that shows what each channel brings in.",
  },
  design: {
    title: "Brand Identity & Design Systems | Webgro",
    description:
      "Brand identity, logos and design systems that keep your website, email and social media consistent. Recent work includes the Fun Cases rebrand.",
  },
  "email-marketing": {
    title: "Klaviyo Email Marketing | Webgro",
    description:
      "Automated Klaviyo email flows, campaigns and segmentation for online shops. At Fun Cases, email brings in more than 30% of revenue.",
  },
  ppc: {
    title: "PPC Management: Google Ads & Meta Ads | Webgro",
    description:
      "Google Ads and Meta Ads for online shops, managed week to week and reported on monthly. Fun Cases run a blended return of more than 8 on ad spend.",
  },
  "social-media": {
    title: "Social Media Management | Webgro",
    description:
      "Planned, on-brand social media posts for your channels, a month at a time, written and designed by the Webgro team.",
  },
};

/** Starting prices for the Service structured data. Automation and AI is priced per project, so it has none. */
export const SERVICE_PRICE: Record<string, StartingPrice> = {
  websites: { from: 4000 },
  consultancy: { from: 400, unit: "DAY" },
  seo: { from: 750, unit: "MON" },
  marketing: { from: 400, unit: "MON" },
  design: { from: 80, unit: "HUR" },
  "email-marketing": { from: 800, unit: "MON" },
  ppc: { from: 1000, unit: "MON" },
  "social-media": { from: 400, unit: "MON" },
};

export const CASE_META: Record<string, Meta> = {
  "fun-cases": {
    title: "Fun Cases: Rebrand, Shopify Theme & AI Tools | Webgro",
    description:
      "A rebrand, a custom Shopify theme and AI tools for Fun Cases. Revenue up 300% over five years, and email now brings in 30% of revenue.",
  },
  "gieves-and-hawkes": {
    title: "Gieves & Hawkes: Shopify Rebuild | Webgro Case Study",
    description:
      "A ground-up Shopify rebuild for Gieves & Hawkes. Eight apps replaced with theme code, mobile Lighthouse up from 64 to 85, and £300 a month saved.",
  },
  valuepet: {
    title: "ValuePet: Shopify Redesign with Pet Hub | Webgro",
    description:
      "A Shopify redesign for ValuePet.ie with a personalised Pet Hub and stock sync between two stores. Average order value up 62% the week after launch.",
  },
  "architectural-fx": {
    title: "Architectural FX: WordPress Catalogue Plugin | Webgro",
    description:
      "A custom WordPress plugin for Architectural FX in Wokingham. Products publish from a Google Sheet, with live filters and a spec sheet configurator.",
  },
  anyprint: {
    title: "ANYPRINT: WordPress Rebuild, Lighthouse 99 | Webgro",
    description:
      "A WordPress redesign and rebuild for ANYPRINT with page speed as a priority. Lighthouse performance up from 54 to 99, and 100 for SEO.",
  },
  sublishop: {
    title: "Sublishop: Shopify Relaunch & AI Apps | Webgro",
    description:
      "A Shopify relaunch for B2B print supplier Sublishop, plus a stock planner and competitor tracker built with AI. Sales up 240% in three months.",
  },
  "twisted-tailor": {
    title: "Twisted Tailor: Shopify Rebuild & AI Support | Webgro",
    description:
      "A ground-up Shopify rebuild for Twisted Tailor, replacing eight apps with theme code, plus an AI support agent that halved customer service hours.",
  },
  "its-pouch": {
    title: "it's Pouch: Shopify Development & Branded Emails | Webgro",
    description:
      "Shopify development and branded notification emails for it's Pouch, a lifestyle brand launching a new product line.",
  },
  "origin-architectural": {
    title: "Origin Architectural: WordPress to Shopify | Webgro",
    description:
      "A move from WordPress to Shopify for Origin Architectural, with a live Smart Glazier integration and an AI pipeline that tidies customer install photos.",
  },
  threadology: {
    title: "Threadology: WordPress Website | Webgro Case Study",
    description:
      "A clean, mobile-first WordPress site built on a block theme, which the Threadology team can edit themselves.",
  },
  "fandp-agency": {
    title: "F&P Agency: Estate Agency Website Redesign | Webgro",
    description:
      "A WordPress redesign that moved F&P Agency from a standard estate agency site to a more upmarket one, in line with their rebrand.",
  },
  "little-muddy-boots": {
    title: "Little Muddy Boots: WordPress Booking Site | Webgro",
    description:
      "A WordPress redesign that replaced a self-built site with a mobile-first booking site, including a custom postcode search tool.",
  },
  "space-4-u-self-storage": {
    title: "Space 4 U Self Storage: WordPress Redesign | Webgro",
    description:
      "A WordPress redesign for a regional self-storage company, built to make it quick for visitors to find a unit and enquire.",
  },
  "paragon-freight": {
    title: "Paragon Freight: Website & Social Media | Webgro",
    description:
      "A WordPress redesign for freight business Paragon Freight, with a currency selector for overseas enquiries and ongoing social media management.",
  },
  "jbvc-foundation": {
    title: "JBVC Foundation: Charity Website | Webgro Case Study",
    description:
      "A single-page WordPress site for the Johnson Beharry VC Foundation, a charity that protects vulnerable children from criminal exploitation and violence.",
  },
  toughcode: {
    title: "Tough Code: Landing Page with Scroll Animation | Webgro",
    description:
      "A single-page landing site for Tough Code, a UK manufacturer of oral pouch products, with scroll animations that move the story along as you read.",
  },
};

export const ARTICLE_META: Record<string, Meta> = {
  "what-is-vibe-coding": {
    title: "What Vibe Coding Is, and Where It Breaks | Webgro",
    description:
      "Vibe coding makes AI the developer and you the editor. It works for the first 80% of a project. Here's where it breaks, and what we use AI for instead.",
  },
  "ai-2026-boring-wins": {
    title: "AI in 2026: The Boring Wins | Webgro",
    description:
      "The AI wins we shipped in 2026 weren't agents or autonomous workflows. They were practical tools, and they're the ones that compound.",
  },
  "seo-after-ai-overviews-2026": {
    title: "SEO After AI Overviews: 3 Levers That Still Work | Webgro",
    description:
      "AI Overviews cut clicks on informational searches, but SEO still works. The three levers still moving rankings for our clients in 2026.",
  },
  "shopify-vs-headless-framework-2026": {
    title: "Shopify vs Headless: How to Choose in 2026 | Webgro",
    description:
      "The Shopify versus headless decision usually comes down to six questions nobody asks. A practical framework for choosing in 2026.",
  },
  "five-ai-integrations-first-month-roi": {
    title: "5 AI Integrations That Paid Back in a Month | Webgro",
    description:
      "Five AI integrations that paid back their build cost within the first month, what each one did, and why they worked.",
  },
  "hidden-cost-cms-complexity": {
    title: "The Hidden Cost of CMS Complexity | Webgro",
    description:
      "Most CMS rebuilds aren't about features, they're about complexity. Why a simpler setup is faster to run and cheaper to change.",
  },
};

/** Final URL of a page, for canonicals and structured data. */
export const siteUrl = (path: string) => `${SITE}${path}`;
