import type { Category } from "@/content/work";

/**
 * Everything the work index needs that is not in src/content/work.ts.
 *
 * Images: several heroImage paths in work.ts point at files that are no longer
 * in public/, so each project is mapped to optimised copies in public/preview/
 * (work-<slug>-lg.jpg at up to 1400w, work-<slug>-sm.jpg at 800w). Where the
 * heroImage still exists it was the source. Where it does not, the source was
 * the lifestyle hero from git history (the originals were removed from
 * public/work), so every project shows a lifestyle image rather than a screenshot.
 * Gieves & Hawkes uses the surviving public/work/gieves-hawkes.jpg campaign shot.
 *
 * Figures and blurbs only restate facts already in work.ts.
 */

export type FilterKey = "all" | Category;
export type ViewKey = "index" | "grid";

/** Below this width the index drops the travelling viewer and shows an image in every row. Matches work.css. */
export const NARROW_QUERY = "(max-width: 899px)";

export type WorkExtra = {
  /** Pixel size of the -lg file. The -sm file is always 800 wide. */
  w: number;
  h: number;
  blurb: string;
  figure?: { value: string; label: string };
};

export type WorkItem = WorkExtra & {
  slug: string;
  client: string;
  tag: string;
  year: string;
  categories: Category[];
  imgLg: string;
  imgSm: string;
};

export const workImage = (slug: string, size: "lg" | "sm") => `/preview/work-${slug}-${size}.jpg`;

export const workExtras: Record<string, WorkExtra> = {
  "fun-cases": {
    w: 1280, h: 955,
    blurb: "A full rebrand and a new Shopify theme, built from scratch, for a business that ships thousands of phone cases a week. We also built a product personaliser to replace an app that cost nearly £5,000 a year.",
    figure: { value: "£5k", label: "a year saved on app fees by replacing the personaliser app" },
  },
  "gieves-and-hawkes": {
    w: 1400, h: 990,
    blurb: "Our second ground-up Shopify build for the Savile Row tailor. We replaced eight third-party apps with theme code, which cut £300 a month from the app bill.",
    figure: { value: "85", label: "mobile Lighthouse score, up from 64" },
  },
  anyprint: {
    w: 1400, h: 933,
    blurb: "A WordPress redesign and rebuild with page speed treated as a design constraint. Accessibility, Best Practices and SEO all score 100.",
    figure: { value: "99", label: "Lighthouse performance score, up from 54" },
  },
  sublishop: {
    w: 1120, h: 625,
    blurb: "A Shopify relaunch for a B2B print supplier, plus two AI apps we built for them: an inventory planner and a competitor tracker.",
    figure: { value: "+240%", label: "sales in the first three months after the relaunch" },
  },
  "twisted-tailor": {
    w: 1400, h: 788,
    blurb: "A ground-up Shopify rebuild for the London menswear brand, including MyFitt, a system that saves each customer's sizes and applies them across the store.",
    figure: { value: "8", label: "third-party apps replaced with native theme code" },
  },
  "its-pouch": {
    w: 1280, h: 955,
    blurb: "Shopify development for a lifestyle brand launching a new product line, plus order, shipping and post-purchase emails designed to match the brand.",
  },
  "origin-architectural": {
    w: 1400, h: 930,
    blurb: "A move to Shopify from an over-developed WordPress site, with a live Smart Glazier integration and an AI pipeline that retouches customers' install photos.",
    figure: { value: "10+", label: "developer hours saved per month" },
  },
  threadology: {
    w: 1400, h: 788,
    blurb: "A mobile-first WordPress build on a block theme. The team can update any page without calling us.",
  },
  "fandp-agency": {
    w: 1400, h: 932,
    blurb: "A WordPress redesign for an estate agency moving to the luxury end of the market, built to match their rebrand.",
  },
  "little-muddy-boots": {
    w: 1400, h: 781,
    blurb: "A WordPress redesign of a self-built site, with a mobile-first booking flow and a custom postcode search.",
  },
  "space-4-u-self-storage": {
    w: 1400, h: 933,
    blurb: "A WordPress redesign for a regional self-storage company, built around unit sizes, pricing and a direct route to a unit enquiry.",
  },
  valuepet: {
    w: 1400, h: 924,
    blurb: "A Shopify redesign for one of Ireland's biggest pet retailers, with a Pet Hub that personalises the shop to each customer's pets and an app that keeps stock in sync with their second store.",
    figure: { value: "+62%", label: "average order value in the week after launch" },
  },
  "architectural-fx": {
    w: 1200, h: 800,
    blurb: "A custom WordPress plugin for a Wokingham lighting distributor. Products are published from their Google Sheet, and the new products page has live filters and a configurator that produces spec sheets.",
    figure: { value: "3", label: "plugins replaced by one custom plugin" },
  },
  "jbvc-foundation": {
    w: 1400, h: 900,
    blurb: "A single-page WordPress site for a charity that protects vulnerable children from criminal exploitation and violence.",
  },
  toughcode: {
    w: 1400, h: 788,
    blurb: "A single-page landing site for a UK manufacturer of oral pouch products, with scroll animations throughout.",
  },
  "paragon-freight": {
    w: 1400, h: 932,
    blurb: "A WordPress redesign for a freight business, with a currency selector for enquiries from abroad. We've managed their social media since.",
  },
};

/** The line under "Our work", which rolls to match the filter. No counts: the list is a selection, not the total. */
const PHRASES: Record<FilterKey, string> = {
  all: "Selected projects",
  ecommerce: "eCommerce projects",
  wordpress: "WordPress websites",
  ai: "AI and custom software",
};
export const filterPhrase = (key: FilterKey) => PHRASES[key];
