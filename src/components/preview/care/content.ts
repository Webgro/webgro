import type { Faq } from "../services/content";

/** Title and description for /care-plans. Kept here so seo.ts stays untouched. */
export const CARE_META = {
  title: "Website Care Plans for Shopify & WordPress | Webgro",
  description:
    "Monthly care plans for WordPress and Shopify sites, from £55 a month. WordPress plans include hosting. Shopify plans include time for changes. Month to month.",
};

export const CARE_PATH = "/care-plans";

/** The studio's design rate, used for changes that aren't covered by a plan. */
export const HOURLY_RATE = 80;

/** The two platforms have different prices and different structures, so the
    page carries two sets of plans and two comparison tables. */
export type CarePlatform = "wordpress" | "shopify";

export const DEFAULT_PLATFORM: CarePlatform = "wordpress";

export const carePlatforms: { id: CarePlatform; name: string }[] = [
  { id: "wordpress", name: "WordPress" },
  { id: "shopify", name: "Shopify" },
];

export type CarePlan = {
  id: "essential" | "growth" | "priority";
  name: string;
  price: number;
  /** One line on who the plan suits. */
  for: string;
  facts: { label: string; value: string }[];
  /** Heading above the list, e.g. "Everything in Essential, plus". */
  includesLabel: string;
  includes: string[];
  featured?: boolean;
};

/* ── WordPress: hosting is part of the plan, no dev time ────────────────── */

const wordpressPlans: CarePlan[] = [
  {
    id: "essential",
    name: "Essential",
    price: 55,
    for: "For sites that don't change often and need hosting, updates, backups and security looked after.",
    facts: [
      { label: "Hosting", value: "Shared hosting" },
      { label: "Dev time", value: `Not included, £${HOURLY_RATE} an hour` },
      { label: "We start on requests", value: "Within 2 working days" },
      { label: "Support", value: "Email" },
    ],
    includesLabel: "Includes",
    includes: [
      "Shared hosting",
      "Monthly WordPress, plugin and theme updates",
      "Daily backups, kept for 30 days",
      "Uptime monitoring 24/7, checked every 5 minutes",
      "Monthly security scan",
      "Monthly performance check",
      "Monthly report",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 120,
    for: "For sites that need regular checks on speed, broken pages, forms and checkout on top of the updates.",
    facts: [
      { label: "Hosting", value: "Shared hosting" },
      { label: "Dev time", value: `Not included, £${HOURLY_RATE} an hour` },
      { label: "We start on requests", value: "Within 1 working day" },
      { label: "Support", value: "Email and phone" },
    ],
    includesLabel: "Everything in Essential, plus",
    includes: [
      "Updates every two weeks",
      "Backups kept for 60 days",
      "Weekly security scan",
      "Speed checks on your main pages",
      "Broken link and 404 checks, with redirects set up",
      "Monthly test of your forms and checkout",
      "A review call every three months",
    ],
    featured: true,
  },
  {
    id: "priority",
    name: "Priority",
    price: 250,
    for: "For busy sites that need a server of their own and closer attention to search and analytics.",
    facts: [
      { label: "Hosting", value: "Dedicated server" },
      { label: "Dev time", value: `Not included, £${HOURLY_RATE} an hour` },
      { label: "We start on requests", value: "Within 4 working hours" },
      { label: "Support", value: "Email and phone" },
    ],
    includesLabel: "Everything in Growth, plus",
    includes: [
      "A dedicated server",
      "Weekly updates",
      "Backups kept for 90 days",
      "SEO health check in Google Search Console",
      "Monthly analytics summary",
      "A call every month",
    ],
  },
];

/* ── Shopify: Shopify hosts the store, time for changes is included ─────── */

const shopifyPlans: CarePlan[] = [
  {
    id: "essential",
    name: "Essential",
    price: 80,
    for: "For stores that don't change often and need a little time each month for small jobs.",
    facts: [
      { label: "Time for changes", value: "30 minutes a month" },
      { label: "We start on requests", value: "Within 2 working days" },
      { label: "Support", value: "Email" },
    ],
    includesLabel: "Includes",
    includes: [
      "Theme and app updates every month",
      "A theme backup before any change",
      "Uptime and checkout monitoring 24/7, checked every 5 minutes",
      "Monthly app review, covering cost, conflicts and unused apps",
      "Admin and app permissions check",
      "Monthly report",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 300,
    for: "For stores that need changes most months, with regular checks on speed and broken pages.",
    facts: [
      { label: "Time for changes", value: "2 hours a month" },
      { label: "We start on requests", value: "Within 1 working day" },
      { label: "Support", value: "Email and phone" },
    ],
    includesLabel: "Everything in Essential, plus",
    includes: [
      "Theme updates every two weeks",
      "Speed checks on your main pages",
      "Broken link and 404 checks, with redirects set up",
      "Monthly test of your forms and checkout",
      "A review call every three months",
    ],
    featured: true,
  },
  {
    id: "priority",
    name: "Priority",
    price: 600,
    for: "For busy stores that need several hours of changes a month and closer attention to search and sales.",
    facts: [
      { label: "Time for changes", value: "5 hours a month" },
      { label: "We start on requests", value: "Within 4 working hours" },
      { label: "Support", value: "Email and phone" },
    ],
    includesLabel: "Everything in Growth, plus",
    includes: [
      "Weekly theme and app checks",
      "SEO health check in Google Search Console",
      "Conversion review of your main pages and checkout",
      "Monthly analytics review with a written summary",
      "A call every month",
    ],
  },
];

export const carePlansByPlatform: Record<CarePlatform, CarePlan[]> = {
  wordpress: wordpressPlans,
  shopify: shopifyPlans,
};

/** The lines under the cards. Platform specific, because the two work differently. */
export const carePlatformNotes: Record<CarePlatform, string[]> = {
  wordpress: [
    "Hosting is part of every WordPress plan: shared hosting on Essential and Growth, a dedicated server on Priority.",
    `No dev time is included. These plans look after the site, so any change you ask for is charged at £${HOURLY_RATE} an hour and quoted before the work starts.`,
  ],
  shopify: [
    "Shopify hosts your store, so hosting isn't part of these plans. Shopify Plus stores are quoted separately.",
    `Unused time doesn't roll over to the next month. Work beyond your plan's time is charged at £${HOURLY_RATE} an hour, and we'll check with you first.`,
  ],
};

/** Every plan on the page, for the structured data on the route. */
export const careOffers: { id: string; name: string; description: string; price: number }[] =
  carePlatforms.flatMap((pf) =>
    carePlansByPlatform[pf.id].map((p) => ({
      id: `${pf.id}-${p.id}`,
      name: `${p.name} care plan for ${pf.name}`,
      description: p.for,
      price: p.price,
    })),
  );

/** A cell is true (included), false (not included) or a short value. */
export type CompareCell = boolean | string;
export type CompareRow = { label: string; note?: string; cells: [CompareCell, CompareCell, CompareCell] };
export type CompareGroup = { name: string; rows: CompareRow[] };

const wordpressCompare: CompareGroup[] = [
  {
    name: "Hosting and dev time",
    rows: [
      { label: "Hosting", cells: ["Shared", "Shared", "Dedicated server"] },
      {
        label: "Dev time for changes",
        note: `£${HOURLY_RATE} an hour`,
        cells: ["Not included", "Not included", "Not included"],
      },
    ],
  },
  {
    name: "Updates and security",
    rows: [
      { label: "WordPress, plugin and theme updates", cells: ["Monthly", "Every 2 weeks", "Weekly"] },
      { label: "Daily backups", cells: ["Kept 30 days", "Kept 60 days", "Kept 90 days"] },
      { label: "Security scan", cells: ["Monthly", "Weekly", "Weekly"] },
      { label: "Uptime monitoring 24/7", note: "checked every 5 minutes", cells: [true, true, true] },
    ],
  },
  {
    name: "Checks",
    rows: [
      { label: "Performance check", cells: ["Monthly", "Monthly", "Monthly"] },
      { label: "Speed checks on your main pages", cells: [false, "Monthly", "Monthly"] },
      { label: "Broken link and 404 checks", cells: [false, "Monthly", "Monthly"] },
      { label: "Forms and checkout test", cells: [false, "Monthly", "Monthly"] },
      { label: "SEO health check", note: "Search Console", cells: [false, false, "Monthly"] },
      { label: "Analytics summary", cells: [false, false, "Monthly"] },
    ],
  },
  {
    name: "Support and reporting",
    rows: [
      { label: "We start on requests within", cells: ["2 working days", "1 working day", "4 working hours"] },
      { label: "Support", cells: ["Email", "Email and phone", "Email and phone"] },
      { label: "Calls", cells: [false, "Every 3 months", "Monthly"] },
      { label: "Report", cells: ["Monthly", "Monthly", "Monthly"] },
    ],
  },
];

const shopifyCompare: CompareGroup[] = [
  {
    name: "Updates and monitoring",
    rows: [
      { label: "Theme and app updates", cells: ["Monthly", "Every 2 weeks", "Weekly"] },
      { label: "A theme backup before any change", cells: [true, true, true] },
      { label: "Uptime and checkout monitoring 24/7", note: "checked every 5 minutes", cells: [true, true, true] },
      { label: "App review", note: "cost, conflicts, unused apps", cells: ["Monthly", "Monthly", "Monthly"] },
      { label: "Admin and app permissions check", cells: [true, true, true] },
    ],
  },
  {
    name: "Checks",
    rows: [
      { label: "Speed checks on your main pages", cells: [false, "Monthly", "Monthly"] },
      { label: "Broken link and 404 checks", cells: [false, "Monthly", "Monthly"] },
      { label: "Forms and checkout test", cells: [false, "Monthly", "Monthly"] },
      { label: "SEO health check", note: "Search Console", cells: [false, false, "Monthly"] },
      { label: "Conversion review", note: "main pages and checkout", cells: [false, false, "Monthly"] },
      { label: "Analytics review", note: "written summary", cells: [false, false, "Monthly"] },
    ],
  },
  {
    name: "Time and support",
    rows: [
      { label: "Time for changes each month", cells: ["30 minutes", "2 hours", "5 hours"] },
      { label: "We start on requests within", cells: ["2 working days", "1 working day", "4 working hours"] },
      { label: "Support", cells: ["Email", "Email and phone", "Email and phone"] },
      { label: "Calls", cells: [false, "Every 3 months", "Monthly"] },
      { label: "Report", cells: ["Monthly", "Monthly", "Monthly"] },
    ],
  },
];

export const compareGroupsByPlatform: Record<CarePlatform, CompareGroup[]> = {
  wordpress: wordpressCompare,
  shopify: shopifyCompare,
};

export const careSteps: { name: string; body: string }[] = [
  {
    name: "Setting up",
    body: "We get access to the site, set up backups and uptime monitoring, and make a note of anything that needs fixing first. For a site we didn't build, this starts with an onboarding check.",
  },
  {
    name: "Each month",
    body: "We run the updates and checks in your plan, then look over the site afterwards to make sure everything still works.",
  },
  {
    name: "Asking for changes",
    body: `Email us what you need. On a Shopify plan we log the time against your monthly allowance and tell you before a job goes over what you have left. On a WordPress plan we quote the work at £${HOURLY_RATE} an hour before we start.`,
  },
  {
    name: "Your report",
    body: "Each month you get a short report listing what we updated, what we checked, anything we fixed and how much time was used.",
  },
];

export const careForYou = {
  heading: "Shopify and WordPress sites that need looking after",
  yes: [
    "Sites we've designed and built for you.",
    "Sites built by another agency or in-house, once we've checked them over.",
    "Businesses that need regular small changes but don't have a developer on the team.",
  ],
  larger:
    "Bigger sites that need more than 5 hours a month usually suit a larger retainer. Most of those clients keep us on for 2 to 6 days a month, with no lock-in.",
};

export const careFaqs: Faq[] = [
  {
    q: "What counts as a change?",
    a: `Most small jobs you'd ask a developer for: editing text and images, adding a page from an existing template, new banners, small layout changes, setting up a plugin or app, and fixing bugs. On a Shopify plan these come out of your monthly time. On a WordPress plan they're charged at £${HOURLY_RATE} an hour, quoted before we start. Bigger pieces of work, like a new section of the site or a custom feature, we'll quote for separately.`,
  },
  {
    q: "Do unused hours roll over?",
    a: `Shopify plans include time each month for changes, and that time doesn't carry over to the next month. If you need more in a month, the extra work is charged at £${HOURLY_RATE} an hour, and we'll check with you before we go over. WordPress plans don't include any time for changes, so anything you ask for is quoted at £${HOURLY_RATE} an hour before the work starts.`,
  },
  {
    q: "Can I switch plans?",
    a: "Yes. Plans run month to month with no lock-in, so you can move up or down a plan from the start of your next month.",
  },
  {
    q: "Do you look after sites you didn't build?",
    a: "Yes, as long as it's on Shopify or WordPress. Before you start we'll look through the site, its theme and its plugins or apps so we know what we're taking on. Some sites need an onboarding check or some tidying first, and we'll tell you what that involves and what it costs before you sign up.",
  },
  {
    q: "Do you look after Shopify Plus stores?",
    a: "Yes. Shopify Plus stores are quoted separately, so tell us about the store and we'll price a plan for it.",
  },
  {
    q: "What happens if my site goes down?",
    a: "Uptime monitoring runs 24 hours a day, 7 days a week on every plan, so we're alerted as soon as the site stops responding. We start fixing during working hours, Monday to Friday, 9 to 5.30, whichever plan you're on. On a WordPress plan the hosting is ours (shared hosting on Essential and Growth, a dedicated server on Priority), so a hosting problem is ours to sort out. For a Shopify store, or a site hosted somewhere else, we'll work with the host to get the site back up.",
  },
  {
    q: "Is hosting included?",
    a: "On WordPress plans, yes. Essential and Growth include shared hosting, and Priority includes a dedicated server. Shopify hosts your store itself, so there's no hosting to add on a Shopify plan.",
  },
];
