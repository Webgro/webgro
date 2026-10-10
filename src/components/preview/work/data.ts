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
/** "index" is the wall of photos, "grid" is the details view with the descriptions. */
export type ViewKey = "index" | "grid";

/** Below this width the details view is one column. Matches work.css. */
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
  berrymae: {
    w: 1200, h: 800,
    blurb: "A brand identity and a custom Shopify theme for a new phone case brand. Shoppers choose their phone once and the shop shows the cases that fit.",
    figure: { value: "68", label: "phone models in the shop-by-phone picker" },
  },
  fleaway: {
    w: 1200, h: 800,
    blurb: "A Shopify store for a flea and tick treatment sold in Ireland. A pack finder matches the treatment to the pet's weight, and the same theme runs the sister site.",
    figure: { value: "2", label: "sites run from one Shopify theme" },
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

/**
 * Where the subject sits in each photo, as a CSS object-position, so a tile
 * of any shape keeps the face or the product in frame. Anything not listed
 * is cropped from the centre.
 */
export const workFocus: Record<string, string> = {
  "fun-cases": "40% 30%",
  "gieves-and-hawkes": "50% 35%",
  valuepet: "50% 55%",
  berrymae: "45% 50%",
  "twisted-tailor": "50% 30%",
  "its-pouch": "50% 60%",
  threadology: "45% 30%",
  "little-muddy-boots": "50% 45%",
  "jbvc-foundation": "55% 30%",
  toughcode: "40% 40%",
};

/* ── The wall's composition ───────────────────────────────────────────────
   The wall is built from bands. A band is a full-width rectangle holding one
   to five tiles with no gaps, so any run of bands is a wall with no holes and
   no orphan on the last row. The layout is derived from the number of
   projects showing, which is how the filtered walls stay composed. */

/** A tile's place on the grid: row, column, rows spanned, columns spanned (1-based). */
export type Area = { r: number; c: number; rs: number; cs: number };

type Band = { rows: number; tiles: [r: number, c: number, rs: number, cs: number][] };

/** Wide screens: twelve columns, rows counted in half-height units. "m" is the mirrored form. */
const BANDS: Record<string, Band> = {
  "1": { rows: 5, tiles: [[1, 1, 5, 12]] },
  "2": { rows: 4, tiles: [[1, 1, 4, 7], [1, 8, 4, 5]] },
  "2m": { rows: 4, tiles: [[1, 1, 4, 5], [1, 6, 4, 7]] },
  "3": { rows: 3, tiles: [[1, 1, 3, 4], [1, 5, 3, 5], [1, 10, 3, 3]] },
  "3m": { rows: 3, tiles: [[1, 1, 3, 3], [1, 4, 3, 5], [1, 9, 3, 4]] },
  // Two large tiles and a stacked pair.
  "4": { rows: 4, tiles: [[1, 1, 4, 5], [1, 6, 4, 4], [1, 10, 2, 3], [3, 10, 2, 3]] },
  "4m": { rows: 4, tiles: [[1, 1, 2, 3], [1, 4, 4, 4], [3, 1, 2, 3], [1, 8, 4, 5]] },
  // One large tile beside a block of four.
  "5": { rows: 4, tiles: [[1, 1, 4, 6], [1, 7, 2, 3], [1, 10, 2, 3], [3, 7, 2, 3], [3, 10, 2, 3]] },
  "5m": { rows: 4, tiles: [[1, 1, 2, 3], [1, 4, 2, 3], [3, 1, 2, 3], [1, 7, 4, 6], [3, 4, 2, 3]] },
};
const CYCLE = [4, 5, 3, 5];
const MIRRORED = [false, true, false, false];

export function composeWide(n: number): Area[] {
  const out: Area[] = [];
  let left = n;
  let row = 1;
  for (let i = 0; left > 0; i++) {
    let take = CYCLE[i % CYCLE.length];
    if (left <= 5) take = left;
    else if (left - take === 1) take -= 1; // never leave one tile for a band of its own
    const mirror = MIRRORED[i % CYCLE.length] !== (Math.floor(i / CYCLE.length) % 2 === 1);
    const band = BANDS[`${take}${mirror ? "m" : ""}`] ?? BANDS[String(take)];
    for (const [r, c, rs, cs] of band.tiles) out.push({ r: row + r - 1, c, rs, cs });
    row += band.rows;
    left -= take;
  }
  return out;
}

/** Phones: two columns. A full-width tile, then pairs, in a repeating rhythm. */
const RHYTHM = ["full", "pair", "full", "pair", "pair"] as const;

export function composeNarrow(n: number): Area[] {
  const out: Area[] = [];
  let row = 1;
  for (let i = 0; out.length < n; i++) {
    if (RHYTHM[i % RHYTHM.length] === "pair" && n - out.length >= 2) {
      out.push({ r: row, c: 1, rs: 1, cs: 1 }, { r: row, c: 2, rs: 1, cs: 1 });
      row += 1;
    } else {
      out.push({ r: row, c: 1, rs: 2, cs: 2 });
      row += 2;
    }
  }
  return out;
}
