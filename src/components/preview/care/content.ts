import type { Faq } from "../services/content";

/** Title and description for /care-plans. Kept here so seo.ts stays untouched. */
export const CARE_META = {
  title: "Website Care Plans for Shopify & WordPress | Webgro",
  description:
    "Monthly care plans for Shopify and WordPress sites, from £80 a month. Updates, backups, monitoring and time for changes, running month to month.",
};

export const CARE_PATH = "/care-plans";

/** The studio's design rate, used for work beyond a plan's monthly time. */
export const HOURLY_RATE = 80;

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

export const carePlans: CarePlan[] = [
  {
    id: "essential",
    name: "Essential",
    price: 80,
    for: "For sites that don't change often and need keeping updated, backed up and secure.",
    facts: [
      { label: "Time for changes", value: "30 minutes a month" },
      { label: "We start on requests", value: "Within 2 working days" },
      { label: "Support", value: "Email" },
    ],
    includesLabel: "Includes",
    includes: [
      "WordPress, plugin and theme updates every month",
      "Daily WordPress backups, kept for 30 days",
      "Uptime monitoring every 5 minutes",
      "Weekly WordPress security scan",
      "Monthly Shopify theme and app check",
      "Monthly report",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 250,
    for: "For sites that need changes most months, with regular checks on speed and broken pages.",
    facts: [
      { label: "Time for changes", value: "2 hours a month" },
      { label: "We start on requests", value: "Within 1 working day" },
      { label: "Support", value: "Email and phone" },
    ],
    includesLabel: "Everything in Essential, plus",
    includes: [
      "WordPress updates every two weeks",
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
    price: 500,
    for: "For busy online shops and larger sites that need regular changes and closer attention to search and sales.",
    facts: [
      { label: "Time for changes", value: "5 hours a month" },
      { label: "We start on requests", value: "Within 4 working hours" },
      { label: "Support", value: "Email and phone" },
    ],
    includesLabel: "Everything in Growth, plus",
    includes: [
      "Weekly WordPress updates",
      "SEO health check in Google Search Console",
      "Conversion review of your main pages and checkout",
      "Monthly analytics review with a written summary",
      "A call every month",
    ],
  },
];

/** A cell is true (included), false (not included) or a short value. */
export type CompareCell = boolean | string;
export type CompareRow = { label: string; note?: string; cells: [CompareCell, CompareCell, CompareCell] };
export type CompareGroup = { name: string; rows: CompareRow[] };

export const compareGroups: CompareGroup[] = [
  {
    name: "Updates and security",
    rows: [
      { label: "WordPress, plugin and theme updates", cells: ["Monthly", "Every 2 weeks", "Weekly"] },
      { label: "Daily backups, kept for 30 days", note: "WordPress", cells: [true, true, true] },
      { label: "Security scan", note: "WordPress", cells: ["Weekly", "Weekly", "Weekly"] },
      { label: "Theme and app check", note: "Shopify", cells: ["Monthly", "Monthly", "Monthly"] },
      { label: "Uptime monitoring every 5 minutes", cells: [true, true, true] },
    ],
  },
  {
    name: "Checks",
    rows: [
      { label: "Speed checks on your main pages", cells: [false, "Monthly", "Monthly"] },
      { label: "Broken link and 404 checks", cells: [false, "Monthly", "Monthly"] },
      { label: "Forms and checkout test", cells: [false, "Monthly", "Monthly"] },
      { label: "SEO health check", cells: [false, false, "Monthly"] },
      { label: "Conversion review", cells: [false, false, "Monthly"] },
      { label: "Analytics review", cells: [false, false, "Monthly"] },
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
    body: "Email us what you need. We log the time against your monthly allowance, and we'll tell you before a job goes over what you have left.",
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
    a: "Most small jobs you'd ask a developer for: editing text and images, adding a page from an existing template, new banners, small layout changes, setting up a plugin or app, and fixing bugs. Bigger pieces of work, like a new section of the site or a custom feature, we'll quote for separately before we start.",
  },
  {
    q: "Do unused hours roll over?",
    a: `No. Unused time doesn't carry over to the next month. If you need more time in a month, extra work is charged at £${HOURLY_RATE} an hour, and we'll check with you before we go over.`,
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
    q: "What happens if my site goes down?",
    a: "Every plan includes uptime monitoring, so we're alerted when the site stops responding. During working hours (Monday to Friday, 9 to 5.30) we start looking into it straight away, whichever plan you're on. If the problem is with your hosting, we'll work with your host to get the site back up.",
  },
  {
    q: "Is hosting included?",
    a: "No. Care plans cover looking after the site, not hosting it. Shopify sites are hosted by Shopify, and WordPress sites stay with your current host.",
  },
];
