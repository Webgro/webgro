import type { MockupName } from "@/components/mockups";
import type { ScreenName } from "./bespoke/Screen";

/**
 * Copy for the services pages in the redesign concept. The facts all come from
 * src/content/services.ts and src/content/work.ts. The three marketing
 * sub-services have no source entry in services.ts, so their copy is assembled
 * here from the marketing service and the marketing chapters of the case
 * studies.
 */

export type VisualName =
  | "websites"
  | "consultancy"
  | "automation"
  | "bespoke"
  | "seo"
  | "marketing"
  | "design"
  | "email"
  | "ppc"
  | "social";

export type Stage = { name: string; time?: string; body: string };
/**
 * A small drawing above a result figure, built only from numbers the figure
 * itself states. See body/FigureDraw.tsx.
 */
export type FigureDrawing =
  | { kind: "ring"; value: number; from: number; note: string }
  | { kind: "share"; value: number; note: string }
  | { kind: "bars"; bars: Array<{ label: string; value: number; accent?: boolean }> }
  | { kind: "months"; count: number; note: string }
  | { kind: "rank"; query: string; client: string }
  | { kind: "line"; ratio: number; from: string; to: string }
  | { kind: "range"; min: number; max: number; before: string; after: string }
  | { kind: "mail"; stamp: string }
  | { kind: "mails"; count: number };
export type Figure = { value: string; label: string; draw?: FigureDrawing };
export type Fact = { label: string; value: string };
export type Faq = { q: string; a: string };

export type PvService = {
  slug: string;
  /** Path on the live site. Always pass it through pv(). */
  path: string;
  parent?: "marketing" | "bespoke-software" | "websites";
  name: string;
  /** Used inside sentences, e.g. "Questions about ...". */
  lower: string;
  /** Who the service is for, in one plain third-person sentence. */
  say: string;
  /** One plain sentence about what the service is. */
  short: string;
  /** Two comparison facts for the index sheet. */
  facts: [Fact, Fact];
  recent: string;
  visual: VisualName;
  hero: { title: [string, string, string]; brush: string; intro: string };
  forYou: { heading: string; yes: string[]; no?: string; noLink?: { label: string; path: string } };
  get: { heading: string; body: string[]; items: string[] };
  platforms?: Array<{ name: string; body: string; /** Links the card to the platform's own page. */ path?: string }>;
  devices?: string;
  mockups?: Array<{ name: MockupName }>;
  /** Adds a showcase of builds after "What's included" (bespoke/Showcase.tsx). */
  showcase?: "software" | "shopify-apps" | "wordpress-plugins";
  /** The redrawn screen in the hero, for services whose visual is "bespoke". */
  heroScreen?: ScreenName;
  process: { heading: string; total: string; stages: Stage[] };
  proof: { heading: string; intro: string; figures: Figure[]; cases: string[] };
  faqs: Faq[];
  start: { heading: string; body: string };
  pairs: string[];
};

/* ── Case studies, as they appear on service pages ──────────────────────── */

export const caseNotes: Record<string, { client: string; img: string; w: number; h: number; line: string }> = {
  "gieves-and-hawkes": {
    client: "Gieves & Hawkes",
    img: "/preview/reel-gieves.jpg", w: 1800, h: 1200,
    line: "A ground-up Shopify build for the Savile Row tailor. We replaced eight paid apps with our own code, and the mobile speed score went from 64 to 85.",
  },
  berrymae: {
    client: "BerryMae",
    img: "/preview/reel-berrymae.jpg", w: 1500, h: 1000,
    line: "A brand identity and a custom Shopify theme for a new phone case brand. Shoppers choose their phone once, from 68 models, and the shop shows the cases that fit.",
  },
  "fun-cases": {
    client: "Fun Cases",
    img: "/preview/reel-fun-cases.jpg", w: 1280, h: 853,
    line: "A full rebrand and a new Shopify theme for a business shipping thousands of phone cases a week. We've run their email and paid ads since.",
  },
  anyprint: {
    client: "ANYPRINT",
    img: "/preview/reel-anyprint.jpg", w: 1399, h: 933,
    line: "A WordPress rebuild designed around page speed, and a quote desk that saves the team 8 hours a week. Lighthouse performance went from 54 to 99.",
  },
  sublishop: {
    client: "Sublishop",
    img: "/preview/reel-sublishop.jpg", w: 1425, h: 950,
    line: "A Shopify relaunch for a trade print supplier, plus two AI tools for stock planning and competitor tracking. Sales rose 240% in three months.",
  },
  "twisted-tailor": {
    client: "Twisted Tailor",
    img: "/preview/reel-twisted-tailor.jpg", w: 1620, h: 1080,
    line: "A Shopify rebuild for the London menswear label. We replaced eight apps with native code and built an AI support agent that passes complex tickets to a person.",
  },
  valuepet: {
    client: "ValuePet",
    img: "/preview/work-valuepet-lg.jpg", w: 1400, h: 924,
    line: "A Shopify redesign for one of Ireland's biggest pet retailers, with a Pet Hub that personalises the shop and an app that keeps their two stores in step.",
  },
  "architectural-fx": {
    client: "Architectural FX",
    img: "/preview/work-architectural-fx-lg.jpg", w: 1200, h: 800,
    line: "A custom WordPress plugin for a Wokingham lighting distributor. Products are published from their Google Sheet, and one plugin replaced three.",
  },
  "origin-architectural": {
    client: "Origin Architectural",
    img: "/preview/work-origin-architectural-lg.jpg", w: 1400, h: 930,
    line: "A move from WordPress to Shopify with no loss of rankings, plus an AI pipeline that retouches customers' installation photos.",
  },
  "its-pouch": {
    client: "it's Pouch",
    img: "/preview/work-its-pouch-lg.jpg", w: 1280, h: 955,
    line: "Shopify development for a new product line, and a set of order and lifecycle emails designed to match the brand.",
  },
  threadology: {
    client: "Threadology",
    img: "/preview/work-threadology-lg.jpg", w: 1400, h: 788,
    line: "A fast, phone-first WordPress site the team can edit themselves, with no custom CMS and no headless setup.",
  },
  "fandp-agency": {
    client: "F&P Agency",
    img: "/preview/work-fandp-agency-lg.jpg", w: 1400, h: 932,
    line: "A WordPress redesign that moved an estate agency's site upmarket to match their rebrand.",
  },
  "paragon-freight": {
    client: "Paragon Freight",
    img: "/preview/work-paragon-freight-lg.jpg", w: 1400, h: 932,
    line: "A WordPress redesign for a freight business, plus ongoing social media management.",
  },
};

/* ── Index page ─────────────────────────────────────────────────────────── */

export const reasons = [
  {
    title: "Priced per project",
    body: "We quote for the work your business needs, whatever its size or budget. There's no fixed rate card.",
  },
  {
    title: "One team",
    body: "Strategy, build and marketing are handled by the same small team, so you only need to brief one agency.",
  },
  {
    title: "Fifteen years in eCommerce",
    body: "We've worked on eCommerce and WordPress projects for more than fifteen years.",
  },
  {
    title: "Clear advice on spend",
    body: "Before you sign anything, we explain which pieces of work we expect to pay back. Our reporting afterwards tracks the same numbers.",
  },
];

/* ── The services ───────────────────────────────────────────────────────── */

const websites: PvService = {
  slug: "websites",
  path: "/services/websites",
  name: "Websites",
  lower: "websites",
  say: "New Shopify and WordPress websites, and rebuilds of existing ones.",
  short: "Shopify shops and WordPress sites, designed and built by us, with custom features added where the standard platform can't do what you need.",
  facts: [
    { label: "Usually costs", value: "£4k to £15k for WordPress. £5k to £25k for a Shopify rebuild." },
    { label: "Usually takes", value: "4 to 12 weeks" },
  ],
  recent: "Gieves & Hawkes: mobile speed score up from 64 to 85, and £300 a month off the app bill.",
  visual: "websites",
  hero: {
    title: ["Shopify and", "WordPress", "websites"],
    brush: "websites",
    intro: "We design and build websites on Shopify and WordPress. We use Shopify for online shops and WordPress for content-led sites. Every build is fast on a phone, easy for your team to edit and set up for search from launch.",
  },
  forYou: {
    heading: "Online shops and business websites",
    yes: [
      "Online shops that are slow, hard to update or paying too much in monthly app fees.",
      "Businesses that need a website their own staff can edit without a developer.",
      "Sites moving off WooCommerce, Magento or an older WordPress build, where rankings and order history need to come across intact.",
      "Brands with an existing identity or a finished design that needs building.",
    ],
    no: "Businesses turning over less than £2m rarely need Shopify Plus. Standard Shopify is quicker to build, cheaper to run and covers nearly everything a shop of that size needs.",
  },
  get: {
    heading: "A fast site your team can edit",
    body: [
      "Every site we build loads quickly, is designed for phones first and can be edited by your own team. It launches with SEO foundations in place and a clear structure, so AI tools or automations can be added later if you need them.",
      "Shopify and WordPress cover about 95% of what a growing business needs from a website, so we rarely recommend a headless build. Where a site needs something the platform can't do, we build that part ourselves, as a custom Shopify app or a custom WordPress plugin.",
    ],
    items: [
      "Shopify", "Shopify Plus", "WordPress", "Block themes", "Custom theme development",
      "Platform migrations", "Performance", "UX and UI", "Conversion", "SEO foundations",
    ],
  },
  platforms: [
    { name: "Shopify", body: "Suits most online shops. It's quick to launch, easy to run and handles high order volumes.", path: "/services/websites/shopify" },
    { name: "Shopify Plus", body: "For businesses that need B2B and wholesale, several regions, a custom checkout or Launchpad." },
    { name: "WordPress", body: "For content-led sites, such as service businesses, portfolios and company blogs.", path: "/services/websites/wordpress" },
  ],
  devices: "Every build is responsive, with the checkout designed for phones, the catalogue for tablets and the homepage for large screens.",
  process: {
    heading: "How a website project works",
    total: "Most projects take 4 to 12 weeks from kick-off to launch. WordPress builds usually take 4 to 6 weeks, Shopify rebuilds 6 to 10, and heavier custom work 10 to 12. We fix the timeline at the end of discovery.",
    stages: [
      { name: "Discovery", time: "One week", body: "We agree the scope, the goals, the audience and the platform." },
      { name: "Design", body: "We set the visual direction, design the page templates and make the UX decisions. You sign off the designs before we start building." },
      { name: "Build", body: "We build the theme or template, connect the integrations and structure the content so it's easy to manage." },
      { name: "Launch", body: "Testing, redirects, analytics and DNS, all checked before the site goes live." },
      { name: "Care", time: "Optional", body: "A retainer for updates, conversion work, performance monitoring and new features. Most clients keep us on for 2 to 6 days a month, with no lock-in." },
    ],
  },
  proof: {
    heading: "Website results",
    intro: "Measured results from website projects, from luxury tailoring to trade print.",
    figures: [
      { value: "85", label: "Gieves & Hawkes mobile speed score out of 100, up from 64 before the rebuild.", draw: { kind: "ring", value: 85, from: 64, note: "64 before" } },
      { value: "99", label: "ANYPRINT's Lighthouse performance score, up from 54.", draw: { kind: "ring", value: 99, from: 54, note: "54 before" } },
      { value: "+240%", label: "Sublishop sales growth in the three months after relaunch.", draw: { kind: "bars", bars: [{ label: "Before", value: 1 }, { label: "After", value: 3.4, accent: true }] } },
    ],
    cases: ["gieves-and-hawkes", "berrymae", "anyprint", "fun-cases", "origin-architectural", "threadology", "fandp-agency"],
  },
  faqs: [
    {
      q: "How much does a website cost?",
      a: "It depends on scope. WordPress builds usually cost between £4k and £15k, and Shopify rebuilds between £5k and £25k. Heavier custom work and Shopify Plus builds cost more. We scope the work before we quote, and the discovery call is free.",
    },
    {
      q: "How long does a build take?",
      a: "Between 4 and 12 weeks, depending on scope. WordPress builds take 4 to 6 weeks, Shopify rebuilds 6 to 10, and heavier custom work 10 to 12. We fix the timeline after discovery and work to it.",
    },
    {
      q: "Do you build standard WordPress sites, or only eCommerce?",
      a: "Both. We build brochure sites, service business sites, portfolios and company blogs on WordPress. They get the same build standards as our eCommerce work: fast pages, SEO, a clean structure and no unnecessary code.",
    },
    {
      q: "Can you move us from another platform?",
      a: "Yes. We've moved shops from Shopify to Shopify Plus, from WooCommerce to Shopify, from Magento to Shopify, and from WordPress to Shopify (as we did for Origin Architectural). A migration includes your content, redirects, SEO protection and, where relevant, your order history.",
    },
    {
      q: "What happens after launch?",
      a: "You can run the site yourself, or keep us on a retainer for updates, conversion work, performance monitoring and new features. Most clients keep us on for 2 to 6 days a month. The retainer is flexible, with no lock-in.",
    },
    {
      q: "Is Shopify Plus worth it over standard Shopify?",
      a: "For most brands turning over less than £2m, no. Standard Shopify is faster to build, cheaper to run and covers most of what you'll need. Plus is worth it once you need B2B, several regions, Launchpad or significant checkout customisation.",
    },
    {
      q: "Can you work with an existing design or brand?",
      a: "Yes. If you have a design system, we'll build to it. If you have a brand book but no page designs, we'll design the site around it. If you have neither, we can do the design and the build.",
    },
  ],
  start: {
    heading: "Start with a 30-minute call",
    body: "We'll talk through what you need and whether we're a good fit, then scope the work before we quote.",
  },
  pairs: ["seo", "marketing", "automation-ai"],
};

const consultancy: PvService = {
  slug: "consultancy",
  path: "/services/consultancy",
  name: "Consultancy",
  lower: "consultancy",
  say: "Senior eCommerce advice, without the cost of a full-time hire.",
  short: "Senior eCommerce advice for your team, covering strategy, platform decisions and growth plans, with hands-on help when you need it.",
  facts: [
    { label: "Usually costs", value: "£400 a day, booked as a few days a month (usually 2, 4 or 8) or as a one-off project." },
    { label: "Starts with", value: "A free 30-minute call, then an audit that takes 2 to 3 weeks." },
  ],
  recent: "eCommerce consultancy is part of our ongoing work with Gieves & Hawkes and Twisted Tailor.",
  visual: "consultancy",
  hero: {
    title: ["Senior eCommerce", "advice for", "your team"],
    brush: "your team",
    intro: "We work as part of your team on eCommerce strategy, platform choices and growth planning, and help with delivery when the workload grows. It gives you senior experience without adding a full-time hire.",
  },
  forYou: {
    heading: "Online businesses without a senior eCommerce lead",
    yes: [
      "Shops that could be performing better, where it's unclear whether the platform, the traffic or the checkout is the problem.",
      "Capable in-house teams that are missing someone at senior level.",
      "Businesses choosing between Shopify, WordPress and Magento that want independent advice.",
      "Businesses that want more than 15 years of eCommerce experience available without paying a full-time salary.",
    ],
    no: "This suits most businesses turning over less than £10m. Above that, a full-time hire may make more sense.",
  },
  get: {
    heading: "One senior contact, backed by specialists",
    body: [
      "You get one point of contact who knows your business. They give weekly strategic guidance, join calls about your platform and stack, help plan growth and take on delivery work when the scope grows. We fill the gaps in your existing team.",
      "When a project needs it, we bring in specialists from a vetted network: senior paid-media buyers, logistics consultants, B2B strategists, luxury brand designers and platform migration specialists. You keep one point of contact, and we coordinate the rest.",
    ],
    items: [
      "eCommerce strategy", "Platform selection", "Stack architecture", "Growth planning",
      "CRO audits", "Team support", "Retainer consulting", "Specialist network",
    ],
  },
  mockups: [
    { name: "consultancy-audit-board" },
  ],
  process: {
    heading: "How consultancy works",
    total: "A free 30-minute call, then an audit that usually takes 2 to 3 weeks. The work after that depends on what the audit finds.",
    stages: [
      { name: "A call", time: "30 minutes, free", body: "We learn about the business and decide together whether we're a good fit. If we are, we send a proposal for an audit." },
      { name: "The audit", time: "2 to 3 weeks", body: "We review your stack, traffic, checkout process, marketing and team capacity. The recommendations are based on your own data." },
      { name: "The roadmap", body: "You get a prioritised list of what to do. That might be a rebuild, a few targeted fixes or no changes at all. Some of our retainers have involved no rebuild." },
      { name: "Retainer or project", body: "We then set up the work around what the business needs, such as a weekly strategy call, a three-month growth sprint, or a migration plan your team carries out with our support." },
    ],
  },
  proof: {
    heading: "Consultancy clients",
    intro: "At Gieves & Hawkes we provide ongoing strategy, platform guidance and hands-on delivery each week. Twisted Tailor also use our eCommerce consultancy.",
    figures: [],
    cases: ["gieves-and-hawkes", "twisted-tailor"],
  },
  faqs: [
    {
      q: "How is this different from hiring an in-house eCommerce manager?",
      a: "You get more than 15 years of eCommerce experience without paying a full-time salary, plus access to specialists when the scope grows. For most businesses turning over less than £10m it makes more sense than a full-time hire, which you can make later once you need one.",
    },
    {
      q: "What does a typical consultancy retainer look like?",
      a: "Usually a fixed number of days a month (2, 4 or 8) covering strategy calls, platform decisions, growth planning and hands-on work when it's needed. We scope each retainer for the client, and we don't sell fixed packages.",
    },
    {
      q: "Do you work alongside our in-house team?",
      a: "Yes. We fill the gaps around your team, taking on strategy calls, one-off specialist jobs and growth projects that fall outside its day-to-day work. You keep the same point of contact throughout.",
    },
    {
      q: "Do we need to rebuild, or can you improve what we have?",
      a: "Often you don't need either. We start with an audit, then recommend a rebuild, targeted fixes or leaving things as they are. Some of our retainers have been strategy only, with no rebuild.",
    },
    {
      q: "What if we need help outside your own skills?",
      a: "We have a vetted network of specialists (senior paid-media buyers, logistics consultants, B2B strategists, luxury brand designers and platform migration specialists) that we bring in per project. You keep one point of contact, and we coordinate the work.",
    },
    {
      q: "How do engagements usually start?",
      a: "With a free 30-minute discovery call about the business, followed by an audit proposal if we're a good fit. Audits usually take 2 to 3 weeks and end with a prioritised roadmap. The retainer or project starts from there.",
    },
    {
      q: "Can you help us choose between Shopify, WordPress or Magento?",
      a: "Yes. Platform choice is one of the most common outcomes of an audit. We recommend a platform based on your catalogue size, your team, how complex your operations are and your plans. We don't favour any platform, and we've moved businesses off every major platform and onto most of them.",
    },
    {
      q: "Is consultancy priced per project or on a retainer?",
      a: "Both, at £400 a day. Retainers suit ongoing strategic support. Projects suit a defined piece of work such as a migration, an audit, a re-platform or a growth sprint. We'll suggest whichever fits.",
    },
  ],
  start: {
    heading: "Start with a free call",
    body: "We'll discuss the business and where we think the biggest improvements are before you commit to anything.",
  },
  pairs: ["websites", "marketing", "automation-ai"],
};

const automation: PvService = {
  slug: "automation-ai",
  path: "/services/automation-ai",
  name: "Automation and AI",
  lower: "automation and AI",
  say: "Automating repetitive work your team does by hand.",
  short: "Custom AI tools and automations built into the systems you already use, to handle repetitive work.",
  facts: [
    { label: "Usually costs", value: "£1k to £15k to build, then £50 to £300 a month per tool in running costs." },
    { label: "Usually takes", value: "1 to 4 weeks for one tool, 4 to 8 for a bigger system." },
  ],
  recent: "Fun Cases and Twisted Tailor: AI customer service that saves 50 to 70% of support hours.",
  visual: "automation",
  hero: {
    title: ["AI tools and", "automations built into", "your systems"],
    brush: "your systems",
    intro: "We build automations and AI that run in the background of the systems you already use: syncing data between your shop, stock and accounts, passing work to the right person or system, drafting replies and content for a person to approve, and running jobs on a schedule. Each one is set up so you can measure the time it saves from its first week.",
  },
  forYou: {
    heading: "Teams spending hours on repetitive work",
    yes: [
      "Support teams answering the same questions again and again.",
      "Shops where launching a new product range takes days of copying, pasting and resizing.",
      "Teams that move figures between the shop, spreadsheets and the accounts by hand.",
      "Businesses with an existing AI tool that needs fixing or extending.",
    ],
    no: "We only recommend building a tool if it should pay for itself within weeks of going live. Software your team logs into and works in, such as a portal, a helpdesk or a warehouse system, is a separate service.",
    noLink: { label: "See the Bespoke Software service", path: "/services/bespoke-software" },
  },
  get: {
    heading: "Measured tools that you own",
    body: [
      "If a tool can't show its value by week four, we don't ship it. Every tool has a way of measuring what it returns, and a person reviews its output before it goes anywhere. We call this AI-assisted, as opposed to AI-automated.",
      "We build into your existing stack, whether that's Shopify, WordPress or a custom system, using the Claude API and other tools where they suit the job. You own the code, and there's no platform of ours to be locked into.",
    ],
    items: [
      "Custom AI apps", "AI customer service agents", "Product generators", "Image retouching pipelines",
      "Content operations", "Internal search and RAG", "Workflow automation", "Claude API integrations",
      "System syncing", "Scheduled jobs",
    ],
  },
  mockups: [
    { name: "sublishop-competitor-tracker" },
    { name: "fun-cases-ai-image-generator" },
  ],
  process: {
    heading: "How an automation project works",
    total: "1 to 4 weeks for a single tool, and 4 to 8 weeks for a larger system.",
    stages: [
      { name: "Payback", body: "We start by working out what the tool would save you. If it won't pay for itself within weeks of going live, we won't recommend building it." },
      { name: "First version", time: "1 to 4 weeks", body: "We build the smallest version that proves the idea, inside your own stack." },
      { name: "Testing with your team", body: "Your team uses it on real work, and a person reviews anything that goes to a customer. We adjust it based on their feedback." },
      { name: "Extending it", time: "4 to 8 weeks for larger systems", body: "Once it's working, we extend it. Every AI tool we've built started small and was extended afterwards." },
      { name: "Handover", body: "The system runs on your infrastructure and you own it. If your team wants to take it in-house, we hand over the codebase." },
    ],
  },
  proof: {
    heading: "AI tools in daily use",
    intro: "Most of the AI tools we've built we can't talk about, but the ones below we can.",
    figures: [
      { value: "50–70%", label: "of customer service hours saved at Fun Cases and Twisted Tailor with AI customer service.", draw: { kind: "range", min: 50, max: 70, before: "Hours before", after: "Hours after" } },
    ],
    cases: ["fun-cases", "sublishop", "twisted-tailor", "origin-architectural"],
  },
  faqs: [
    {
      q: "How can AI help my business?",
      a: "We've built five kinds of tool. AI customer service, which Fun Cases and Twisted Tailor both use, saving 50 to 70% of customer service hours. Product generators that publish a range in minutes instead of days. Image pipelines that standardise lifestyle and product shots. Competitor and inventory trackers, like the ones we built for Sublishop. And internal search across your documents, Drive and email. Each one has results you can measure.",
    },
    {
      q: "What does 'AI-assisted, not AI-automated' mean?",
      a: "A person checks everything the AI produces before it goes out. The AI does most of the work and your team makes the final call. Fully autonomous AI fails on edge cases and weakens your brand voice, so we don't build it.",
    },
    {
      q: "How much does a custom AI app cost?",
      a: "Custom AI builds cost from £1k to £15k depending on scope. Small, single-purpose tools (a content drafter, a tagging agent, a simple workflow script) are at the lower end. Larger systems (product generators with Shopify integration, live competitor tracking with alerts, internal search with RAG) are at the top. Ongoing API costs depend on volume, and are usually £50 to £300 a month per tool.",
    },
    {
      q: "How long does a build take?",
      a: "1 to 4 weeks for a single tool, and 4 to 8 weeks for larger systems. We build the smallest useful version first, get it live within weeks, then extend it based on your team's feedback.",
    },
    {
      q: "Who owns the code and the AI system afterwards?",
      a: "You do. Every AI system we build runs in your stack, on your infrastructure, and you own it outright. We don't have a platform to lock you into. If your team wants to take it in-house, we hand over the codebase.",
    },
    {
      q: "Which AI model do you use?",
      a: "Claude, for most production work. We find it the strongest model for reasoning and writing, and Anthropic's approach to safety fits our practice of keeping a person in the loop. We use other models (GPT, Gemini or open-source) where they suit a specific job better.",
    },
    {
      q: "What happens if Claude's pricing or API changes?",
      a: "Every system we build keeps the model behind an interface, so switching to a different provider takes days and doesn't need a rebuild. We also fix the model version, so your production pipeline doesn't break when Anthropic releases a new one.",
    },
    {
      q: "Is AI work GDPR compliant?",
      a: "Yes. We design around data minimisation (the model only sees the fields it needs), use enterprise endpoints that are opted out of training, and put every customer-facing output through human review. We can share our compliance playbook during scoping.",
    },
    {
      q: "Can you extend an AI system we already have?",
      a: "Usually, yes. We've taken over AI projects started by other teams, either to fix problems in production or to add features. We start with an audit of the code and infrastructure before agreeing a scope.",
    },
  ],
  start: {
    heading: "Tell us about the idea",
    body: "We'll work out with you whether it's likely to pay back before you commit to building anything.",
  },
  pairs: ["bespoke-software", "websites", "consultancy"],
};

const bespoke: PvService = {
  slug: "bespoke-software",
  path: "/services/bespoke-software",
  name: "Bespoke Software",
  lower: "bespoke software",
  say: "Software built for one business, for its own team to log into and use.",
  short: "Portals, quoting tools, helpdesks, and stock and warehouse systems, built for one business to save its team time and money, with AI built in where it helps.",
  facts: [
    { label: "Usually costs", value: "From £3,000, plus a monthly charge that depends on the build." },
    { label: "Usually takes", value: "8 to 10 weeks, including testing." },
  ],
  recent: "Fun Cases: ten tools behind one login, saving about 20 hours of work a day.",
  visual: "bespoke",
  showcase: "software",
  hero: {
    title: ["Bespoke software", "built around", "your business"],
    brush: "your business",
    intro: "We design and build software for one business at a time: portals, quoting tools, helpdesks, and stock and warehouse systems that your team logs into and uses every day. Each one is designed to save the business time and money. AI is built in where it helps, such as sorting support tickets, reading emailed enquiries into quotes and drafting replies for a person to approve.",
  },
  forYou: {
    heading: "Businesses that have outgrown spreadsheets and separate apps",
    yes: [
      "Teams running stock, purchase orders or quotes from spreadsheets.",
      "Businesses paying for several apps that each do part of a job and don't share data.",
      "Warehouses and workshops that need screens built for a scanner, a packing bench or a print room.",
      "Businesses with a process that off-the-shelf software doesn't fit.",
    ],
    no: "Bespoke Software is for tools your team logs into and works in. Work that runs in the background with no screens of its own, such as syncing data between systems, AI drafting and scheduled jobs, is our Automation and AI service.",
    noLink: { label: "See the Automation and AI service", path: "/services/automation-ai" },
  },
  get: {
    heading: "Software built for one business",
    body: [
      "Each build starts with how your team does the job now: who does it, where, and on what device. A warehouse scanner, a packing bench and an office desk each need a different kind of screen, and one login can cover all of them.",
      "The software connects to the systems you already use, from your shop and your accounts to your couriers, printers, email and social channels, so nobody retypes figures between them. Where AI is useful it's given one defined job, and a person approves what goes to a customer.",
      "We host and maintain what we build, and keep developing it after launch as your team asks for new features. The monthly charge covers the servers, storage and maintenance, and depends on the build.",
    ],
    items: [
      "Internal staff systems", "Client portals", "Warehouse and stock systems", "Quoting and job boards", "Helpdesks",
      "Returns portals", "Shipping and print tools", "Content tools", "Integrations with your existing systems", "Ongoing development",
    ],
  },
  process: {
    heading: "How a bespoke software project works",
    total: "We scope the work and quote before anything is built. Builds start from £3,000, and the monthly charge depends on the servers, storage and maintenance the software needs.",
    stages: [
      { name: "Scoping", body: "We go through the job with the people who do it now, and agree what the first version needs to do." },
      { name: "Design", body: "We design each screen for the device and the place it's used, such as a handheld scanner, a packing bench or a desk." },
      { name: "Build", time: "From £3,000", body: "We build the first version and connect it to the systems you already use." },
      { name: "Testing", time: "In test mode first", body: "Tools that print, send or refund start in a test mode, so nothing reaches a printer or a customer until your team has checked it." },
      { name: "Hosting and maintenance", time: "Monthly charge", body: "We host and maintain the software. The monthly charge covers the servers, storage and maintenance, and depends on the build." },
      { name: "Ongoing development", time: "Quoted per request", body: "After launch the software keeps changing with the business. Your team sends feature requests, we scope and quote each one, then build it. The Fun Cases software grew to ten tools this way." },
    ],
  },
  proof: {
    heading: "Bespoke software results",
    intro: "Figures from three of the builds shown above. The case studies cover each one in more detail, alongside the websites we built for the same businesses.",
    figures: [
      { value: "20", label: "hours of work saved each day by the Fun Cases software." },
      { value: "8", label: "hours a week saved at ANYPRINT by the quote desk." },
      { value: "50%", label: "fewer support hours at Twisted Tailor with AI support." },
    ],
    cases: ["fun-cases", "anyprint", "twisted-tailor"],
  },
  faqs: [
    {
      q: "How much does bespoke software cost?",
      a: "Builds start from £3,000. There's also a monthly charge for servers, storage and maintenance, which depends on the build. We scope the work and quote before anything is built.",
    },
    {
      q: "What does the monthly charge cover?",
      a: "The servers the software runs on, its database and file storage, and maintenance. The amount depends on the build.",
    },
    {
      q: "What's the difference between Bespoke Software and Automation and AI?",
      a: "Bespoke Software is software people log into and use, such as portals, quoting tools, helpdesks and warehouse systems. Automation and AI is work that runs in the background, such as syncing data, AI drafting and scheduled jobs. Many projects include both.",
    },
    {
      q: "Can it connect to the systems we already use?",
      a: "Usually, yes. Bespoke software can connect to most systems that have an API or can export a file. The list further up this page shows some of them, from shops, accounting and stock systems to couriers, email, social channels and AI models. We confirm each connection during scoping, before we quote.",
    },
    {
      q: "Does bespoke software have to use AI?",
      a: "No. We use it where it does one defined job. In the Fun Cases helpdesk an AI assistant sorts new tickets and writes a summary for the person handling them. The stock forecast in the same software is a statistical calculation with every number shown.",
    },
    {
      q: "Can staff use it on phones and scanners?",
      a: "Yes. The Fun Cases warehouse screens are built for rugged Android phones with barcode scanners, on screens 360 to 400 pixels wide with large buttons. Each scan is saved on the device before it's sent, so a dropped wifi connection doesn't lose it.",
    },
    {
      q: "Who can see what?",
      a: "Each person has their own login with a role, and access to only the tools they need. In the Fun Cases software, stock planning is open to admins only, and the warehouse scanner screens are a separate permission.",
    },
    {
      q: "How long does a build take?",
      a: "Most builds take 8 to 10 weeks, including testing. We confirm the timeline when we scope the work, before you commit to anything.",
    },
    {
      q: "Who owns the code?",
      a: "You do. The software is built for your business, and the code is yours.",
    },
    {
      q: "What happens after it's built?",
      a: "We host and maintain it, and it keeps changing with the business. Your team sends feature requests, we scope and quote each one, then build it. Fun Cases now have ten tools under one login. Several of them started as separate apps and were moved in later, with their data.",
    },
  ],
  start: {
    heading: "Tell us about the job",
    body: "Tell us what your team does by hand or in spreadsheets today. We'll scope what the software would need to do, then quote.",
  },
  pairs: ["automation-ai", "websites", "consultancy"],
};

const seo: PvService = {
  slug: "seo",
  path: "/services/seo",
  name: "SEO",
  lower: "SEO",
  say: "More visitors from Google and from AI search tools.",
  short: "Getting you found on Google, and in the answers people get from ChatGPT, Claude and Perplexity.",
  facts: [
    { label: "Usually costs", value: "From £750 a month. One-off audits from £1,000." },
    { label: "Usually takes", value: "6 to 12 months to pay back, and longer for very competitive terms." },
  ],
  recent: "Fun Cases rank first on Google UK for 'phone cases'. Gieves & Hawkes do the same for 'luxury suit'.",
  visual: "seo",
  hero: {
    title: ["SEO for", "Google and", "AI search"],
    brush: "AI search",
    intro: "We fix the technical basics first: clean markup, fast pages, sensible URLs and schema. Then we write content that answers the questions people in your market search for. We also optimise it so that Claude, ChatGPT and Perplexity mention your brand, as well as Google.",
  },
  forYou: {
    heading: "Businesses that want more search traffic",
    yes: [
      "Businesses losing searches for their own products to competitors.",
      "Sites about to rebuild or change platform that need to keep their current rankings.",
      "Businesses paying for every visitor through ads that want more unpaid traffic.",
      "Brands that don't appear in the answers ChatGPT and other AI tools give their customers.",
    ],
    no: "SEO usually takes 6 to 12 months to pay back. If you need sales next month, paid ads are faster.",
    noLink: { label: "See the PPC service", path: "/services/marketing/ppc" },
  },
  get: {
    heading: "Technical work, content and monthly reports",
    body: [
      "We start with the technical groundwork, then produce content that answers real questions in your category. An engagement covers a technical audit and fixes, content architecture, keyword research, ongoing content production or editing, and monthly reporting.",
      "Alongside traditional SEO we work on AIO (AI optimisation) and GEO (generative engine optimisation). This is the work of getting your brand into answers from Claude, ChatGPT and Perplexity, as well as into Google's results.",
    ],
    items: [
      "Technical SEO", "Content architecture", "Keyword research", "AIO and GEO", "Schema markup",
      "Internal linking", "Site audits", "Migration protection", "Content programmes",
    ],
  },
  process: {
    heading: "How SEO works",
    total: "Most categories take 6 to 12 months to pay back, and competitive terms 12 to 24. We agree expectations at the start and report progress every month.",
    stages: [
      { name: "Audit", time: "One-off audits from £1,000", body: "We review where you stand today and set out what's realistic." },
      { name: "Technical fixes", body: "Schema, site speed, how search engines crawl the site, and internal linking." },
      { name: "Content structure", body: "Keyword research, including the prompts people use in AI search, then a taxonomy and content clusters built around hub pages." },
      { name: "Content and links", body: "Ongoing content production or editing, and links from editorial coverage, partnerships, digital PR and resource outreach. We don't use link networks, paid directories or other tactics Google penalises." },
      { name: "Monthly reporting", body: "Rankings, impressions and how often AI models cite you, reported every month." },
    ],
  },
  proof: {
    heading: "SEO results",
    intro: "These rankings came from technical and content work over 12 to 24 months.",
    figures: [
      { value: "#1", label: "Fun Cases on Google UK for 'phone cases', a term with more than 25,000 UK searches a month.", draw: { kind: "rank", query: "phone cases", client: "Fun Cases" } },
      { value: "#1", label: "Gieves & Hawkes on Google UK for 'luxury suit', with more than 16,000 searches a month.", draw: { kind: "rank", query: "luxury suit", client: "Gieves & Hawkes" } },
      { value: "+46%", label: "more clicks from search for Gieves & Hawkes over six months.", draw: { kind: "line", ratio: 1.46, from: "Clicks, month one", to: "Six months on" } },
    ],
    cases: ["fun-cases", "gieves-and-hawkes", "anyprint", "sublishop", "twisted-tailor"],
  },
  faqs: [
    {
      q: "What rankings are realistic?",
      a: "It depends on the category and your starting point. Two examples: Fun Cases rank first on Google UK for 'phone cases', a high-intent eCommerce term with over 25,000 UK searches a month. Gieves & Hawkes rank first on Google UK for 'luxury suit', a competitive fashion term with over 16,000 monthly searches, reached from a standing start after the Frasers takeover. The top result on Google typically gets a click-through rate of around 30%, which on those two terms means thousands of high-intent visits a month. Both came from technical and content work over 12 to 24 months.",
    },
    {
      q: "How long until SEO pays back?",
      a: "6 to 12 months for most categories, and 12 to 24 for competitive terms. We agree expectations at the start and track progress monthly, covering both Google rankings and how often AI answers cite you.",
    },
    {
      q: "What are AIO and GEO?",
      a: "AI optimisation and generative engine optimisation. It means adjusting your content, schema and site structure so that large language models (Claude, ChatGPT, Perplexity, Gemini) mention your brand when people ask about your industry. It's becoming as important as Google rankings, and in some categories it already matters more.",
    },
    {
      q: "Is Google SEO still worth doing now that AI search is here?",
      a: "Yes. Google still handles around 70% of product discovery globally. AI Overviews now appear above the organic results, though, and AI answers are replacing short searches. SEO in 2026 means ranking in both places, and we work on both together.",
    },
    {
      q: "What does an SEO engagement include?",
      a: "A technical audit and fixes (schema, site speed, crawl and internal linking), content architecture (taxonomy, clusters, hub-and-spoke), keyword research (including prompt research for AI search), ongoing content production or editing, and monthly reporting on rankings, impressions and AI citations.",
    },
    {
      q: "Can you protect our rankings during a site migration?",
      a: "Yes. Migration SEO is one of our most requested services. It covers 301 mapping, keeping canonicals, carrying over structured data and checking content parity. We moved Origin Architectural from WordPress to Shopify with no loss of rankings.",
    },
    {
      q: "How much does SEO cost?",
      a: "It's retainer-based. Basic SEO starts from £750 a month, covering core technical work and monthly reporting. Full service (technical, content and AIO) costs £1,500 to £2,500 a month. One-off audits start from £1,000, depending on the size of the site and the depth required.",
    },
    {
      q: "Do you do link building?",
      a: "Yes. We focus on editorial links, partnerships, digital PR and resource-link outreach. We don't use private blog networks, paid directories or any tactic Google penalises.",
    },
  ],
  start: {
    heading: "Start with an SEO audit",
    body: "We'll look at where your site stands today and set out what's realistic.",
  },
  pairs: ["websites", "marketing", "consultancy"],
};

const marketing: PvService = {
  slug: "marketing",
  path: "/services/marketing",
  name: "Marketing",
  lower: "marketing",
  say: "Paid ads, email and social media, with reporting on what each one brings in.",
  short: "Paid ads, email and social media run together, with reporting that's easy to read.",
  facts: [
    { label: "First results", value: "2 to 4 weeks for paid ads, 6 to 8 for rebuilt email flows." },
    { label: "Usually costs", value: "Email from £800 a month plus setup. PPC from £1,000 a month plus ad budget. Social media from £400 a month." },
  ],
  recent: "Fun Cases: a blended return of more than 8 on around £35k a month of ad spend.",
  visual: "marketing",
  hero: {
    title: ["Paid ads, email", "and social media,", "run together"],
    brush: "run together",
    intro: "We run paid ads, email and social media together for online businesses. Analytics shows which spend is paying back, and the budget is adjusted to match.",
  },
  forYou: {
    heading: "Businesses already spending on marketing",
    yes: [
      "Businesses spending on Google or Meta ads without a clear view of what they bring in.",
      "Shops with a large email list that earns very little.",
      "Businesses whose social media stops whenever work gets busy.",
      "Teams receiving marketing reports that don't help them make decisions.",
    ],
    no: "We recommend a level of spend based on your margins. We've told clients to cut their ad budget when their email flows weren't performing.",
  },
  get: {
    heading: "Marketing measured against your margins",
    body: [
      "We measure campaigns against your product margins, because revenue alone can make a loss-making campaign look healthy. Email flows are built around what each customer has done, and attribution is reported in a way you can act on.",
      "A typical retainer covers paid media on Google and Meta (and sometimes TikTok), lifecycle email on Klaviyo with flows, campaigns and segmentation, analytics and attribution, and a monthly report. Some retainers also include conversion sprints and landing page work.",
    ],
    items: [
      "Google Ads", "Meta Ads", "Performance Max", "Paid social", "Lifecycle email on Klaviyo",
      "Campaign email", "Social media management", "Attribution", "Analytics", "CRO", "Reporting",
    ],
  },
  process: {
    heading: "How marketing works",
    total: "Paid ads show results within 2 to 4 weeks, rebuilt email flows within 6 to 8, and SEO-aware content marketing within 3 to 6 months.",
    stages: [
      { name: "A free audit", time: "30 minutes", body: "We review your accounts and show you where budget is being wasted." },
      { name: "Benchmarks", body: "We work out what's realistic for your margins and stage of growth, and agree a level of spend before any budget goes out. Most of our clients put 10 to 20% of revenue into paid acquisition." },
      { name: "Paid ads", time: "Results in 2 to 4 weeks", body: "Google and Meta campaigns, managed against product margin." },
      { name: "Email", time: "Results in 6 to 8 weeks", body: "Lifecycle flows and segmentation on Klaviyo, rebuilt to bring in more revenue." },
      { name: "Monthly checkpoints", body: "Each month we review progress against cost per acquisition, lifetime value and average order value." },
    ],
  },
  proof: {
    heading: "Marketing results",
    intro: "Figures from the email and paid campaigns we run for clients.",
    figures: [
      { value: "£3m+", label: "generated through email every year, across our clients.", draw: { kind: "mails", count: 24 } },
      { value: "£15k", label: "from a single Sublishop email, their biggest campaign so far.", draw: { kind: "mail", stamp: "£15k" } },
      { value: "8+", label: "blended return on ad spend at Fun Cases, held on £35k a month.", draw: { kind: "bars", bars: [{ label: "£1 spent", value: 1 }, { label: "£8+ back", value: 8, accent: true }] } },
    ],
    cases: ["fun-cases", "gieves-and-hawkes", "sublishop", "its-pouch", "paragon-freight"],
  },
  faqs: [
    {
      q: "What does a typical marketing retainer include?",
      a: "Paid media management (Google, Meta and sometimes TikTok), lifecycle email on Klaviyo (flows, campaigns and segmentation), analytics and attribution, and monthly reporting. Some retainers also include conversion sprints and landing page work.",
    },
    {
      q: "How much does marketing cost?",
      a: "Each channel is priced on its own. Email marketing starts from £800 a month plus setup fees, PPC management from £1,000 a month plus your ad budget, and social media from £400 a month.",
    },
    {
      q: "How much should we be spending?",
      a: "It depends on your margin and stage of growth, but most of our clients put 10 to 20% of revenue into paid acquisition. We recommend a level of spend based on your numbers, and we've told clients to reduce their paid budget when their email flows weren't performing.",
    },
    {
      q: "What return on ad spend can we expect?",
      a: "It depends on the category. Fun Cases run at a blended return of 8 or more, sustained on £35k a month of spend. Luxury and considered-purchase categories run lower, at 3 to 5 times. We benchmark against your margins and tell you what's realistic before you commit any spend.",
    },
    {
      q: "How much of our revenue should come from email?",
      a: "For most eCommerce brands, the best performers get 25 to 40%. Fun Cases are above 30%, mostly from lifecycle flows on Klaviyo and much less from campaign sends. If you're under 15%, there's a lot of room to grow.",
    },
    {
      q: "Do you handle creative, or only media buying?",
      a: "Both, if you need it. We have in-house designers for static and motion creative, and we work with editorial videographers for performance video where it's required. If you have a creative team, we'll work with them instead.",
    },
    {
      q: "How does attribution work in 2026?",
      a: "It's complicated. iOS and third-party cookie changes have broken traditional last-click attribution. We use a mix of server-side tracking, marketing mix modelling for larger accounts, and incrementality testing on the channels that matter most.",
    },
    {
      q: "Can you work with our existing agency or in-house team?",
      a: "Yes. We often act as strategic lead while an in-house junior carries out the work, or work alongside a specialist paid-media agency that handles one channel while we handle the others.",
    },
    {
      q: "How soon will we see results?",
      a: "Paid media within 2 to 4 weeks, email flow rebuilds within 6 to 8 weeks, and SEO-aware content marketing in 3 to 6 months. We review progress monthly against cost per acquisition, lifetime value and average order value.",
    },
  ],
  start: {
    heading: "Start with a free audit",
    body: "A 30-minute review of your ad and email accounts, showing where budget is being wasted.",
  },
  pairs: ["seo", "websites", "design"],
};

const design: PvService = {
  slug: "design",
  path: "/services/design",
  name: "Design",
  lower: "design",
  say: "Brand identity and design systems, so the brand looks the same everywhere it appears.",
  short: "Brand identity and design systems: the logo, type, colours, components and rules that keep everything you make consistent.",
  facts: [
    { label: "What you end up with", value: "An identity, a set of components, and guidelines your team can build on." },
    { label: "Usually costs", value: "£80 an hour." },
  ],
  recent: "Fun Cases: a full rebrand covering the logo, tone of voice, website, socials and email.",
  visual: "design",
  hero: {
    title: ["Brand", "identity and", "design systems"],
    brush: "design systems",
    intro: "We design identity, interface, motion and typography as one system. The tokens, components and guidelines are set once, so every page, campaign and product after that is quicker to produce and consistent with the brand.",
  },
  forYou: {
    heading: "Brands that need a consistent look",
    yes: [
      "Brands with a logo and colour palette that are used differently everywhere.",
      "Businesses repositioning themselves that have outgrown their current identity.",
      "Teams that keep redesigning the same components from scratch.",
      "Businesses planning a new website that want the brand settled first.",
    ],
  },
  get: {
    heading: "Rules for how the brand is used",
    body: [
      "A design system sets the rules for tokens, typography, motion and interface components, so anyone producing work for the business has a clear reference.",
      "We create new identities for businesses that are repositioning, and turn existing brands into systems that can grow with them.",
    ],
    items: [
      "Brand identity", "Design tokens", "UI component systems", "Typography",
      "Motion", "Iconography", "Design ops", "Brand guidelines",
    ],
  },
  process: {
    heading: "How a design project works",
    total: "Timings depend on the brief, so we'll give you a timeline once we've seen it.",
    stages: [
      { name: "The brief", body: "You tell us what you need and where the current brand falls short." },
      { name: "Proposal", body: "We propose what the system should include for your business." },
      { name: "Identity and rules", body: "The identity, then the tokens, typography, motion and iconography that everything else is built from." },
      { name: "Components and guidelines", body: "Interface components and written brand guidelines, so your team and ours can produce new pages and campaigns without starting from scratch." },
    ],
  },
  proof: {
    heading: "Design work",
    intro: "Fun Cases was a full rebrand covering the logo, tone of voice, website, social templates and a new email system. All of it launched at the same time.",
    figures: [],
    cases: ["fun-cases", "fandp-agency", "threadology", "its-pouch"],
  },
  faqs: [],
  start: {
    heading: "Start with a brief",
    body: "Tell us what you need, and we'll come back with a proposal for the system.",
  },
  pairs: ["websites", "marketing", "seo"],
};

/* ── Marketing sub-services ─────────────────────────────────────────────── */

const email: PvService = {
  slug: "email-marketing",
  path: "/services/marketing/email-marketing",
  parent: "marketing",
  name: "Email marketing",
  lower: "email marketing",
  say: "Automated email flows and campaigns on Klaviyo.",
  short: "Automated flows and campaigns on Klaviyo that bring past customers back without extra ad spend.",
  facts: [
    { label: "First results", value: "6 to 8 weeks after a rebuild of your flows." },
    { label: "Usually costs", value: "From £800 a month, plus setup fees." },
  ],
  recent: "Fun Cases: more than 30% of total revenue now comes through email.",
  visual: "email",
  hero: {
    title: ["Email marketing", "and automated flows", "on Klaviyo"],
    brush: "on Klaviyo",
    intro: "We build automated flows on Klaviyo, design campaigns and segment your list by customer behaviour. Email is Fun Cases' most effective channel, and brings in more than 30% of their revenue.",
  },
  forYou: {
    heading: "Shops with an underused email list",
    yes: [
      "Shops that send the occasional newsletter and have nothing automated.",
      "Shops that send no follow-up when someone abandons a basket.",
      "Businesses getting less than 15% of revenue from email. The best online shops get 25 to 40%.",
      "Shops still using the platform's default order confirmation and delivery emails.",
    ],
    no: "We build email on Klaviyo, the platform we use alongside Shopify. If you use another platform, get in touch and we'll talk through the options.",
  },
  get: {
    heading: "Automated flows and campaigns",
    body: [
      "Lifecycle flows are emails sent automatically when someone joins your list, leaves a basket, places an order or stops buying. At Fun Cases, most email revenue comes from these flows.",
      "Campaigns are planned around your launches and promotions, and sent to segments based on customer behaviour. We also redesign transactional emails, such as order confirmations and delivery updates, to match your brand. We did this for it's Pouch.",
    ],
    items: [
      "Lifecycle flows on Klaviyo", "Campaign emails", "Segmentation", "Email template design",
      "Transactional email design", "Reporting",
    ],
  },
  process: {
    heading: "How email marketing works",
    total: "A rebuild of your email flows usually shows results within 6 to 8 weeks.",
    stages: [
      { name: "A free audit", time: "30 minutes", body: "We review what you send now, what it earns and what's missing." },
      { name: "Flows", body: "We build or rebuild the automated emails first: welcome, abandoned basket, post-purchase and others." },
      { name: "Segments", body: "We split your list by behaviour, so regular customers and one-time browsers get different emails." },
      { name: "Campaigns", body: "Designed by us and scheduled around your launches and promotions." },
      { name: "Monthly reporting", body: "What email earned that month, and what we're changing for the next one." },
    ],
  },
  proof: {
    heading: "Email results",
    intro: "At Fun Cases, lifecycle flows on Klaviyo, campaigns tied to their product release calendar and behaviour-based segments bring in more than 30% of revenue.",
    figures: [
      { value: "30%+", label: "of Fun Cases' total revenue now comes through email.", draw: { kind: "share", value: 30, note: "of revenue" } },
      { value: "£3m+", label: "generated through email every year, across our clients.", draw: { kind: "mails", count: 24 } },
      { value: "£15k", label: "from a single Sublishop email, their biggest campaign so far.", draw: { kind: "mail", stamp: "£15k" } },
    ],
    cases: ["fun-cases", "gieves-and-hawkes", "sublishop", "its-pouch"],
  },
  faqs: [
    {
      q: "Which email platform do you use?",
      a: "Klaviyo. It's what we use for email on Shopify, and our clients' flows and campaigns are built on it. If you use another platform, let us know and we'll talk through whether moving makes sense.",
    },
    {
      q: "What's the difference between a flow and a campaign?",
      a: "A flow is automatic. It sends when a customer does something, such as joining your list, abandoning a basket or placing an order. A campaign is a one-off email sent to a chosen segment on a particular day, for a launch or a sale. At Fun Cases most email revenue comes from flows, and much less from campaigns.",
    },
    {
      q: "How much of our revenue should come from email?",
      a: "For most eCommerce brands, the best performers get 25 to 40%. Fun Cases are above 30%. If you're under 15%, there's a lot of room to grow.",
    },
    {
      q: "How soon will we see results?",
      a: "Rebuilt email flows usually show results within 6 to 8 weeks. We review progress monthly against lifetime value and average order value.",
    },
    {
      q: "Do you design the emails as well?",
      a: "Yes. We have in-house designers, and design is part of the service. For it's Pouch we designed the transactional and lifecycle emails to match the brand's tone. If you have your own creative team, we'll work with them.",
    },
    {
      q: "Can you run email on its own, without ads or SEO?",
      a: "Yes. Email is often a good place to start, because it earns from customers you already have. It doesn't bring in new customers, so we usually recommend running it alongside paid ads.",
    },
    {
      q: "How much does email marketing cost?",
      a: "From £800 a month, plus setup fees. Setup covers building or rebuilding your flows in Klaviyo, and the monthly fee covers campaigns, flow improvements and reporting.",
    },
  ],
  start: {
    heading: "Start with a free email audit",
    body: "It takes about 30 minutes. We'll review what you send now and where there's room to grow.",
  },
  pairs: ["ppc", "social-media", "seo"],
};

const ppc: PvService = {
  slug: "ppc",
  path: "/services/marketing/ppc",
  parent: "marketing",
  name: "PPC",
  lower: "PPC",
  say: "Google Ads and Meta Ads, managed each week and reported on monthly.",
  short: "Paid search and paid social on Google and Meta, managed against your margins.",
  facts: [
    { label: "First results", value: "2 to 4 weeks" },
    { label: "Usually costs", value: "From £1,000 a month, plus your ad budget." },
  ],
  recent: "Fun Cases: a blended return of more than 8 on around £35k a month of ad spend.",
  visual: "ppc",
  hero: {
    title: ["Paid search", "and paid social", "on Google and Meta"],
    brush: "on Google and Meta",
    intro: "We run Google Ads and Meta Ads, covering search, Shopping, Performance Max and paid social. We measure every campaign against each product's margin, because a campaign can show healthy revenue while losing money.",
  },
  forYou: {
    heading: "Businesses spending on Google or Meta ads",
    yes: [
      "Businesses spending on Google or Meta without knowing what it returns.",
      "Advertisers whose ad reports show a good return that their accounts don't reflect.",
      "Businesses that have run their own campaigns or boosted posts and now want them managed.",
      "Businesses planning to increase their ad spend that want to know how far it can go.",
    ],
    no: "We recommend a level of spend based on your margins, and we've told clients to cut their ad budget before now.",
  },
  get: {
    heading: "Ad accounts managed week to week",
    body: [
      "We set up your accounts or rebuild the existing ones, then manage search, Shopping, Performance Max and paid social every week. The aim is steady spend that returns more as your catalogue grows.",
      "We can produce the ads too. Our in-house designers make static and motion creative, and we work with editorial videographers for performance video when it's needed. If you have a creative team, we'll work with them.",
      "Attribution is difficult in 2026. We use server-side tracking, marketing mix modelling on larger accounts, and incrementality tests on the channels that matter most.",
    ],
    items: [
      "Google Ads", "Google Shopping", "Performance Max", "Meta Ads", "Paid social",
      "Ad creative", "Server-side tracking", "Attribution", "CRO and landing pages", "Reporting",
    ],
  },
  process: {
    heading: "How PPC works",
    total: "Paid ads usually show results within 2 to 4 weeks.",
    stages: [
      { name: "A free audit", time: "30 minutes", body: "We review your ad accounts and show you where budget is being wasted." },
      { name: "Benchmarks", body: "We work out what return is realistic for your margins and your category, and agree a level of spend. Most of our clients put 10 to 20% of revenue into paid acquisition." },
      { name: "Build", body: "Campaign structure, tracking and creative, set up so we can see what's working." },
      { name: "Weekly management", time: "First results in 2 to 4 weeks", body: "Bids, budgets, audiences and creative, adjusted each week against product margin." },
      { name: "Monthly checkpoints", body: "A clear report covering cost per acquisition, lifetime value and average order value." },
    ],
  },
  proof: {
    heading: "PPC results",
    intro: "We manage paid search and paid social for Fun Cases across Google and Meta.",
    figures: [
      { value: "8+", label: "blended return on ad spend at Fun Cases, held consistently.", draw: { kind: "bars", bars: [{ label: "£1 spent", value: 1 }, { label: "£8+ back", value: 8, accent: true }] } },
      { value: "£35k", label: "a month managed for Fun Cases across Google and Meta.", draw: { kind: "months", count: 6, note: "Every month" } },
    ],
    cases: ["fun-cases", "sublishop"],
  },
  faqs: [
    {
      q: "What return on ad spend can we expect?",
      a: "It depends on the category. Fun Cases run at a blended return of 8 or more, sustained on £35k a month of spend. Luxury and considered-purchase categories run lower, at 3 to 5 times. We benchmark against your margins and tell you what's realistic before you commit any spend.",
    },
    {
      q: "How much should we be spending?",
      a: "It depends on your margin and stage of growth, but most of our clients put 10 to 20% of revenue into paid acquisition. We recommend a level of spend based on your numbers, and we've told clients to reduce their budget when their email flows weren't performing.",
    },
    {
      q: "How much does PPC management cost?",
      a: "From £1,000 a month for managing your campaigns. Your ad budget is separate and is paid to Google or Meta directly.",
    },
    {
      q: "Which platforms do you manage?",
      a: "Google Ads (search, Shopping and Performance Max) and Meta Ads, and sometimes TikTok.",
    },
    {
      q: "Do you make the ads, or only manage the spend?",
      a: "Both, if you need it. We have in-house designers for static and motion creative, and we work with editorial videographers for performance video where it's required. If you have a creative team, we'll work with them instead.",
    },
    {
      q: "How do you know which sales came from the ads?",
      a: "It's complicated. iOS and third-party cookie changes have broken traditional last-click attribution. We use a mix of server-side tracking, marketing mix modelling for larger accounts, and incrementality testing on the channels that matter most.",
    },
    {
      q: "Can you work with our existing agency or in-house team?",
      a: "Yes. We often act as strategic lead while an in-house junior carries out the work, or work alongside a specialist agency that handles one channel while we handle the others.",
    },
  ],
  start: {
    heading: "Start with a free ad account audit",
    body: "It takes about 30 minutes, and we'll show you where budget is being wasted.",
  },
  pairs: ["email-marketing", "seo", "social-media"],
};

const social: PvService = {
  slug: "social-media",
  path: "/services/marketing/social-media",
  parent: "marketing",
  name: "Social media management",
  lower: "social media",
  say: "Planned, on-brand posts for your social channels, a month at a time.",
  short: "Planned, on-brand posts that keep your business visible between enquiries.",
  facts: [
    { label: "How it runs", value: "An ongoing monthly service, planned ahead." },
    { label: "Usually costs", value: "From £400 a month." },
  ],
  recent: "Paragon Freight: ongoing social media management alongside their redesigned website.",
  visual: "social",
  hero: {
    title: ["Social media", "posts, planned", "a month ahead"],
    brush: "a month ahead",
    intro: "We plan, design, write and publish your posts, so your social channels stay active and match your website.",
  },
  forYou: {
    heading: "Businesses that need regular posting",
    yes: [
      "Businesses that haven't posted for some time.",
      "Businesses whose feed no longer reflects how the company looks today.",
      "Businesses that sell on trust, like Paragon Freight in logistics, and need to stay visible between enquiries.",
      "Brands with a new website or rebrand whose social channels still use the old look.",
    ],
    no: "This service covers organic social: regular, on-brand posts on your own channels. Paid social advertising is part of our PPC service.",
    noLink: { label: "See the PPC service", path: "/services/marketing/ppc" },
  },
  get: {
    heading: "A month of posts, planned in advance",
    body: [
      "We plan each month's posts before the month starts, designed to match your brand and written in your tone of voice. Then we publish them for you each week.",
      "Social media is part of our rebrand work. Fun Cases got a set of social and email templates with their new website, and everything launched together. Paragon Freight use us for ongoing social media management alongside their redesigned site.",
    ],
    items: [
      "Content calendars", "Post design", "Copywriting", "Scheduling and publishing",
      "Social template systems", "Brand consistency",
    ],
  },
  process: {
    heading: "How social media management works",
    total: "An ongoing service, planned one month at a time.",
    stages: [
      { name: "Brief", body: "We find out who you want to reach, how you want to come across and your tone of voice." },
      { name: "Templates", body: "A set of post designs that match your brand and your website." },
      { name: "The monthly plan", body: "We plan the month's posts in advance, and you approve them before anything goes out." },
      { name: "Publishing", body: "We schedule and publish the posts each week." },
      { name: "Review", body: "We look at which posts people responded to and use that to plan the next month." },
    ],
  },
  proof: {
    heading: "Social media clients",
    intro: "Paragon Freight, a logistics business, needed a site that looked the part and a social presence to support it. Alongside the redesign, we manage their social channels on an ongoing basis.",
    figures: [],
    cases: ["paragon-freight", "fun-cases"],
  },
  faqs: [
    {
      q: "Which platforms do you look after?",
      a: "It depends where your customers are. For Paragon Freight, a logistics business, that's LinkedIn.",
    },
    {
      q: "Do you write and design the posts, or do we?",
      a: "We do both. We have in-house designers for static and motion work, and we write in your tone of voice. If you have your own photography or a creative team, we'll work with what they produce.",
    },
    {
      q: "Will we see posts before they go out?",
      a: "Yes. Posts are planned in advance, and you approve them before anything is published.",
    },
    {
      q: "How much does social media management cost?",
      a: "From £400 a month. The price depends on how many channels you need and how often you want to post.",
    },
    {
      q: "Is this the same as paid social advertising?",
      a: "No. This service is organic posting on your own channels. Paid social, meaning adverts you pay Meta to show, is part of our PPC service.",
    },
    {
      q: "Will social media bring in sales?",
      a: "Sometimes, but that isn't its main purpose. Organic social keeps your brand visible between visits and enquiries, and reassures people checking you out before they buy. If you need measurable sales quickly, paid ads and email are better suited.",
    },
    {
      q: "Can you set up templates and leave the posting to us?",
      a: "Yes. For Fun Cases we built a set of social and email templates as part of their rebrand, so that everything their team makes uses the new look.",
    },
  ],
  start: {
    heading: "Start with your current channels",
    body: "Tell us which channels you use and who you want to reach, and we'll explain what the service would involve.",
  },
  pairs: ["ppc", "email-marketing", "design"],
};

/* ── Bespoke Software's two branches ────────────────────────────────────── */

const shopifyApps: PvService = {
  slug: "shopify-apps",
  path: "/services/bespoke-software/shopify-apps",
  parent: "bespoke-software",
  name: "Custom Shopify apps",
  lower: "custom Shopify apps",
  say: "Apps built for one Shopify store, for jobs Shopify and its App Store can't do.",
  short: "Custom Shopify app development for one store: loyalty schemes, syncing between stores and features on the product page.",
  facts: [
    { label: "Usually costs", value: "Quoted per build." },
    { label: "Runs on", value: "Your Shopify store, with its own hosting where it needs a server." },
  ],
  recent: "Fun Cases: Case Club, a loyalty app that replaced Smile.io.",
  visual: "bespoke",
  heroScreen: "case-club",
  showcase: "shopify-apps",
  hero: {
    title: ["Custom Shopify", "apps, built for", "one store"],
    brush: "one store",
    intro: "A custom Shopify app is software built for one store, to do something Shopify and the apps in its App Store can't. We offer custom Shopify app development for loyalty schemes, syncing products and stock between stores, tools on the product page and other jobs that are specific to one business.",
  },
  forYou: {
    heading: "When a store needs its own app",
    yes: [
      "Stores that need something Shopify can't do, and that no app in the App Store does well.",
      "Stores paying for several apps that one app built to fit could replace.",
      "Businesses with more than one store that need products or stock kept in step.",
      "Stores that want a feature on the product page, in the cart or in customer accounts that works their own way.",
    ],
    no: "Where an existing app already does the job well, we recommend using it. Software your team works in outside Shopify is covered by our Bespoke Software service.",
    noLink: { label: "See the Bespoke Software service", path: "/services/bespoke-software" },
  },
  get: {
    heading: "An app built for one store",
    body: [
      "A custom app is installed on your store only. It can add screens inside the Shopify admin for your staff, add features to the storefront for shoppers, or run in the background with no screens at all.",
      "Each of the three apps on this page has a switch that keeps it from going live until someone turns it on: a preview mode, a programme switch, or a dry run that logs what it would have done.",
      "Custom Shopify apps are quoted per build, once we've scoped the work.",
    ],
    items: [
      "Embedded admin apps", "Theme app extensions", "App proxies", "Shopify Functions", "Webhooks",
      "Loyalty schemes", "Store-to-store sync", "Customer account extensions", "Klaviyo and Judge.me integration",
    ],
  },
  process: {
    heading: "How a custom Shopify app project works",
    total: "We scope the work and quote before anything is built. Each custom Shopify app is quoted per build.",
    stages: [
      { name: "Scoping", body: "We go through the job with the people who do it now, and agree what the first version needs to do." },
      { name: "Design", body: "We design the screens your staff and your customers will use, and agree how it connects to the systems you already have." },
      { name: "Build", time: "Quoted per build", body: "We build the first version and connect it to your store or site." },
      { name: "Testing", time: "Switched off until you're ready", body: "It's installed behind a switch, a preview mode or on a staging site, so your team can check it before customers see it." },
      { name: "Hosting and maintenance", body: "We host the app's server and keep it working as Shopify updates its API." },
      { name: "Ongoing development", time: "Quoted per request", body: "After launch it keeps changing with the business. Your team sends feature requests, we scope and quote each one, then build it." },
    ],
  },
  proof: {
    heading: "Case studies",
    intro: "The case studies cover each app alongside the Shopify store it runs on.",
    figures: [],
    cases: ["fun-cases", "valuepet", "twisted-tailor"],
  },
  faqs: [
    {
      q: "What is a custom Shopify app?",
      a: "An app built for one store. It's installed on your store only, and it does the one job your business needs, where an App Store app is built to suit thousands of shops. It can have screens in the Shopify admin, features on the storefront, or neither.",
    },
    {
      q: "Is it listed on the Shopify App Store?",
      a: "No. The apps on this page are custom apps, each private to the store it was built for. A public App Store app is a different kind of project, with Shopify's review process, and we'd scope it separately.",
    },
    {
      q: "Will it survive a theme update?",
      a: "Yes. An app runs separately from the theme, so changing or updating the theme doesn't remove it. Features an app adds to the storefront through a theme app extension are switched on in the theme editor, with no edits to the theme's code.",
    },
    {
      q: "Can it replace apps we already pay for?",
      a: "Sometimes. Case Club replaced Smile.io at Fun Cases, and balances from the old scheme were imported at launch. Whether it makes sense for you depends on what the existing apps do, which we look at during scoping.",
    },
    {
      q: "Who owns the code?",
      a: "You do. The app is built for your store, and the code is yours.",
    },
    {
      q: "How much does a custom Shopify app cost?",
      a: "It's quoted per build. We scope the work first, then quote.",
    },
  ],
  start: {
    heading: "Tell us what the store needs",
    body: "Tell us what you'd like the store to do that it can't do now. We'll scope the app, then quote.",
  },
  pairs: ["bespoke-software", "wordpress-plugins", "websites"],
};

const wordpressPlugins: PvService = {
  slug: "wordpress-plugins",
  path: "/services/bespoke-software/wordpress-plugins",
  parent: "bespoke-software",
  name: "Custom WordPress plugins",
  lower: "custom WordPress plugins",
  say: "Plugins built for one WordPress site, for features off-the-shelf plugins can't provide.",
  short: "Custom WordPress plugin development for one site: product catalogues, configurators and forms that connect to other systems.",
  facts: [
    { label: "Usually costs", value: "Quoted per build." },
    { label: "Runs on", value: "Your WordPress site." },
  ],
  recent: "Architectural FX: one custom plugin in place of three.",
  visual: "bespoke",
  heroScreen: "afx-configurator",
  showcase: "wordpress-plugins",
  hero: {
    title: ["Custom WordPress", "plugins, built for", "one site"],
    brush: "one site",
    intro: "A custom WordPress plugin adds a feature to one site that WordPress and off-the-shelf plugins can't provide. We offer custom WordPress plugin development for product catalogues, configurators, forms that connect to other systems and other jobs that are specific to one business.",
  },
  forYou: {
    heading: "When a site needs its own plugin",
    yes: [
      "Sites running several plugins to do one job, where one plugin built to fit would be simpler.",
      "Businesses that need a catalogue, a configurator or a calculator built around their own products.",
      "Businesses that want a form to pass what it collects to another system and act on the answer.",
      "Teams that want to manage website content from a spreadsheet they already keep.",
    ],
    no: "Where an existing plugin already does the job well, we recommend using it. Software your team works in outside WordPress is covered by our Bespoke Software service.",
    noLink: { label: "See the Bespoke Software service", path: "/services/bespoke-software" },
  },
  get: {
    heading: "A plugin built for one site",
    body: [
      "A custom plugin is installed and switched on like any other WordPress plugin. It can add its own kinds of content, pages, admin screens and connections to other systems.",
      "The feature lives in the plugin and not in the theme, so it carries on working when the theme is changed or updated.",
      "Custom WordPress plugins are quoted per build, once we've scoped the work.",
    ],
    items: [
      "Custom post types", "Shortcodes", "REST endpoints", "Admin screens", "Product configurators",
      "PDF spec sheets and reports", "Google Sheets publishing", "Form integrations",
    ],
  },
  process: {
    heading: "How a custom WordPress plugin project works",
    total: "We scope the work and quote before anything is built. Each custom WordPress plugin is quoted per build.",
    stages: [
      { name: "Scoping", body: "We go through the job with the people who do it now, and agree what the first version needs to do." },
      { name: "Design", body: "We design the screens your staff and your customers will use, and agree how it connects to the systems you already have." },
      { name: "Build", time: "Quoted per build", body: "We build the first version and connect it to your store or site." },
      { name: "Testing", time: "Switched off until you're ready", body: "It's installed behind a switch, a preview mode or on a staging site, so your team can check it before customers see it." },
      { name: "Maintenance", body: "We keep the plugin working with new versions of WordPress." },
      { name: "Ongoing development", time: "Quoted per request", body: "After launch it keeps changing with the business. Your team sends feature requests, we scope and quote each one, then build it." },
    ],
  },
  proof: {
    heading: "Case study",
    intro: "The Architectural FX case study covers the plugin in full, from the old setup to the new products page and configurator.",
    figures: [
      { value: "3", label: "plugins replaced by one custom plugin at Architectural FX." },
      { value: "9", label: "ways to filter the Architectural FX catalogue." },
      { value: "128", label: "DWG files moved from Amazon S3 into WordPress." },
    ],
    cases: ["architectural-fx"],
  },
  faqs: [
    {
      q: "What is a custom WordPress plugin?",
      a: "A plugin written for one site. It's installed and switched on like any other plugin, and it adds the one feature your business needs, where an off-the-shelf plugin is built to suit thousands of sites.",
    },
    {
      q: "Will it survive WordPress and theme updates?",
      a: "A plugin is separate from the theme, so changing or updating the theme doesn't remove the feature. WordPress itself changes over time, and keeping the plugin working with new versions is part of maintenance.",
    },
    {
      q: "Does it work alongside a page builder and our other plugins?",
      a: "Yes. At Architectural FX the plugin runs the product catalogue and configurator, and the rest of the site is built with a page builder.",
    },
    {
      q: "Is the plugin listed publicly?",
      a: "No. The plugins on this page are private to the site they were built for, and aren't in the WordPress plugin directory.",
    },
    {
      q: "Who owns the code?",
      a: "You do. The plugin is built for your site, and the code is yours.",
    },
    {
      q: "How much does a custom WordPress plugin cost?",
      a: "It's quoted per build. We scope the work first, then quote.",
    },
  ],
  start: {
    heading: "Tell us what the site needs",
    body: "Tell us what you'd like the site to do that it can't do now. We'll scope the plugin, then quote.",
  },
  pairs: ["bespoke-software", "shopify-apps", "websites"],
};

/* ── Websites' two branches ─────────────────────────────────────────────── */

const shopifySites: PvService = {
  slug: "shopify",
  path: "/services/websites/shopify",
  parent: "websites",
  name: "Shopify websites",
  lower: "Shopify websites",
  say: "New Shopify shops, Shopify rebuilds and moves to Shopify from other platforms.",
  short: "Shopify design and development for UK brands: custom themes, rebuilds, Shopify Plus and migrations from WooCommerce, Magento and WordPress.",
  facts: [
    { label: "Usually costs", value: "£5k to £25k for a Shopify rebuild." },
    { label: "Usually takes", value: "6 to 10 weeks" },
  ],
  recent: "Gieves & Hawkes: eight apps replaced with theme code, and mobile speed up from 64 to 85.",
  visual: "websites",
  hero: {
    title: ["Shopify design", "and development", "for UK brands"],
    brush: "UK brands",
    intro: "We design and build Shopify shops, from a first store to a full rebuild on Shopify Plus. Every theme is built for the shop it runs, so it's fast on a phone, easy for your team to run and doesn't lean on a pile of monthly apps.",
  },
  forYou: {
    heading: "Shops that have outgrown their theme",
    yes: [
      "Shopify shops that are slow on mobile, or paying for apps that theme code could replace.",
      "Brands moving to Shopify from WooCommerce, Magento or WordPress, where rankings and order history have to come across intact.",
      "Shops selling to trade as well as the public, or in more than one country.",
      "Brands launching a new shop that need the design and the build from one team.",
    ],
    no: "Businesses turning over less than £2m rarely need Shopify Plus. Standard Shopify is quicker to build, cheaper to run and covers nearly everything a shop of that size needs.",
  },
  get: {
    heading: "A Shopify theme built for your shop",
    body: [
      "We build custom Shopify themes rather than reskinning a bought one. That keeps the code lean, which is why our rebuilds get faster: at Gieves & Hawkes the mobile speed score went from 64 to 85, and eight apps were replaced with theme code, saving £300 a month.",
      "Where Shopify can't do something, we build it as a custom Shopify app. Shops we look after include Fun Cases, Sublishop, ValuePet and Twisted Tailor.",
    ],
    items: [
      "Custom Shopify themes", "Shopify Plus", "Shopify Markets", "B2B and wholesale", "Migrations to Shopify",
      "Theme speed work", "App audits", "Custom Shopify apps", "Klaviyo", "SEO foundations",
    ],
  },
  platforms: [
    { name: "Shopify", body: "Suits most online shops. It's quick to launch, easy to run and handles high order volumes." },
    { name: "Shopify Plus", body: "For businesses that need B2B and wholesale, several regions, a custom checkout or Launchpad." },
  ],
  devices: "Every build is responsive, with the checkout designed for phones, the catalogue for tablets and the homepage for large screens.",
  process: {
    heading: "How a Shopify project works",
    total: "Most Shopify rebuilds take 6 to 10 weeks from kick-off to launch, and heavier custom work 10 to 12. We fix the timeline at the end of discovery.",
    stages: [
      { name: "Discovery", time: "One week", body: "We agree the scope, the goals and whether standard Shopify or Shopify Plus is the right fit." },
      { name: "Design", body: "We design the page templates and the product and checkout journeys. You sign off the designs before we start building." },
      { name: "Build", body: "We build the theme, move the products, customers and orders, and connect the apps you keep." },
      { name: "Launch", body: "Redirects from every old URL, analytics, payments and shipping, all tested before the shop goes live." },
      { name: "Care", time: "Optional", body: "A Shopify care plan for updates, speed and new features, with no lock-in." },
    ],
  },
  proof: {
    heading: "Shopify results",
    intro: "Measured results from Shopify builds and rebuilds.",
    figures: [
      { value: "85", label: "Gieves & Hawkes mobile speed score out of 100, up from 64 before the rebuild.", draw: { kind: "ring", value: 85, from: 64, note: "64 before" } },
      { value: "+240%", label: "Sublishop sales growth in the three months after relaunch.", draw: { kind: "bars", bars: [{ label: "Before", value: 1 }, { label: "After", value: 3.4, accent: true }] } },
      { value: "+62%", label: "ValuePet average order value the week after launch.", draw: { kind: "bars", bars: [{ label: "Before", value: 1 }, { label: "After", value: 1.62, accent: true }] } },
    ],
    cases: ["gieves-and-hawkes", "berrymae", "sublishop", "valuepet", "fun-cases", "twisted-tailor", "origin-architectural", "its-pouch"],
  },
  faqs: [
    {
      q: "How much does a Shopify website cost?",
      a: "A Shopify rebuild usually costs between £5k and £25k, depending on the number of templates, the custom features and whether you're on Shopify Plus. We scope the work before we quote, and the discovery call is free.",
    },
    {
      q: "How long does a Shopify build take?",
      a: "Most rebuilds take 6 to 10 weeks. Heavier custom work takes 10 to 12. We fix the timeline after discovery and work to it.",
    },
    {
      q: "Can you move us to Shopify from WooCommerce or Magento?",
      a: "Yes. We've moved shops from WooCommerce, Magento and WordPress to Shopify, as we did for Origin Architectural. A migration covers products, customers, order history where you need it, and a redirect for every old URL so you keep your rankings.",
    },
    {
      q: "Do we need Shopify Plus?",
      a: "For most brands turning over less than £2m, no. Plus is worth it once you need B2B, several regions, Launchpad or significant checkout customisation.",
    },
    {
      q: "Do you use a bought theme?",
      a: "No. We build the theme for your shop. Bought themes carry code for features you'll never use, which slows the shop down and makes changes harder.",
    },
    {
      q: "Can you work on a shop someone else built?",
      a: "Yes. We start with an audit of the theme and the apps, then fix what's slowing the shop down before adding anything new.",
    },
  ],
  start: {
    heading: "Start with a 30-minute call",
    body: "Tell us about the shop and what's holding it back. We'll scope the work, then quote.",
  },
  pairs: ["shopify-apps", "seo", "email-marketing"],
};

const wordpressSites: PvService = {
  slug: "wordpress",
  path: "/services/websites/wordpress",
  parent: "websites",
  name: "WordPress websites",
  lower: "WordPress websites",
  say: "New WordPress websites and rebuilds of older ones, for service businesses, charities and content-led brands.",
  short: "WordPress design and development for UK businesses: custom block themes, fast pages and a site your own team can edit.",
  facts: [
    { label: "Usually costs", value: "£4k to £15k" },
    { label: "Usually takes", value: "4 to 6 weeks" },
  ],
  recent: "ANYPRINT: rebuilt on WordPress, with a Lighthouse performance score up from 54 to 99.",
  visual: "websites",
  hero: {
    title: ["WordPress design", "and development", "for UK businesses"],
    brush: "UK businesses",
    intro: "We design and build WordPress websites for service businesses, charities, manufacturers and anyone whose site is mostly content. Each one is built on a custom block theme, so pages load fast and your team can edit them without a developer.",
  },
  forYou: {
    heading: "Sites that are hard to edit or slow to load",
    yes: [
      "WordPress sites built on a page builder that has become slow and hard to change.",
      "Businesses that need staff to add pages, case studies and news without breaking the layout.",
      "Charities and organisations that need forms which connect to their other systems.",
      "Manufacturers with product catalogues that need filters, spec sheets and downloads.",
    ],
    no: "If you mainly sell products online, Shopify is usually the better platform, and we'll tell you so.",
    noLink: { label: "See Shopify websites", path: "/services/websites/shopify" },
  },
  get: {
    heading: "A WordPress site your team can run",
    body: [
      "We build WordPress sites on custom block themes rather than heavy page builders. The editor shows your own blocks in your own styles, so the site looks the same after a year of edits as on launch day.",
      "Where a site needs something no plugin does well, we build it as a custom WordPress plugin. At Architectural FX one custom plugin replaced three, and products now publish from a Google Sheet.",
    ],
    items: [
      "Custom block themes", "Gutenberg blocks", "WooCommerce", "Custom WordPress plugins", "Forms and integrations",
      "Speed work", "Accessibility", "Migrations from page builders", "Hosting", "SEO foundations",
    ],
  },
  devices: "Every build is responsive and tested on phones, tablets and large screens before launch.",
  process: {
    heading: "How a WordPress project works",
    total: "Most WordPress builds take 4 to 6 weeks from kick-off to launch. Sites with custom plugins or integrations take longer. We fix the timeline at the end of discovery.",
    stages: [
      { name: "Discovery", time: "One week", body: "We agree the pages, the goals, the audience and what your team needs to edit." },
      { name: "Design", body: "We design the page templates and the blocks your team will build pages with. You sign off the designs before we start building." },
      { name: "Build", body: "We build the block theme, move your content across and connect forms and integrations." },
      { name: "Launch", body: "Redirects, analytics, hosting and DNS, all checked before the site goes live." },
      { name: "Care", time: "Optional", body: "A WordPress care plan with hosting, updates, backups and monitoring, from £55 a month." },
    ],
  },
  proof: {
    heading: "WordPress results",
    intro: "Measured results from WordPress builds.",
    figures: [
      { value: "99", label: "ANYPRINT's Lighthouse performance score after the rebuild, up from 54.", draw: { kind: "ring", value: 99, from: 54, note: "54 before" } },
      { value: "3 to 1", label: "Plugins replaced by one custom plugin at Architectural FX.", draw: { kind: "bars", bars: [{ label: "Before", value: 3 }, { label: "After", value: 1, accent: true }] } },
    ],
    cases: ["anyprint", "architectural-fx", "threadology", "fandp-agency", "little-muddy-boots", "space-4-u-self-storage", "jbvc-foundation"],
  },
  faqs: [
    {
      q: "How much does a WordPress website cost?",
      a: "Most WordPress builds cost between £4k and £15k, depending on the number of templates and any custom features. We scope the work before we quote, and the discovery call is free.",
    },
    {
      q: "How long does a WordPress build take?",
      a: "Usually 4 to 6 weeks. Sites with custom plugins or integrations take longer, and we fix the timeline after discovery.",
    },
    {
      q: "Do you use page builders like Elementor or Divi?",
      a: "We don't build new sites on them. We build custom block themes for the WordPress editor, which load faster and are harder to break than page builder layouts.",
    },
    {
      q: "Can you rebuild our existing WordPress site?",
      a: "Yes. We move your content across, keep your URLs or redirect them, and make sure the new site keeps the rankings the old one had.",
    },
    {
      q: "Do you host WordPress sites?",
      a: "Yes. Our WordPress care plans include hosting, updates, backups and monitoring, from £55 a month.",
    },
    {
      q: "Can you build WooCommerce shops?",
      a: "Yes, where WooCommerce suits the business. For most shops selling online as their main business, we recommend Shopify.",
    },
  ],
  start: {
    heading: "Start with a 30-minute call",
    body: "Tell us about the site and what your team needs from it. We'll scope the work, then quote.",
  },
  pairs: ["wordpress-plugins", "seo", "design"],
};

/* ── Lookups ────────────────────────────────────────────────────────────── */

/** The seven top-level services, in the order they appear on the index. */
export const pvServices: PvService[] = [websites, consultancy, automation, bespoke, seo, marketing, design];

/** Marketing's three branches. */
export const pvSubServices: PvService[] = [email, ppc, social];

/** Bespoke Software's two branches. */
export const pvBespokeSubs: PvService[] = [shopifyApps, wordpressPlugins];

/** Websites' two branches, one per platform. */
export const pvWebsiteSubs: PvService[] = [shopifySites, wordpressSites];

/** What the menus list under Websites: the main page first, as with Bespoke Software. */
export const pvWebsitesMenu: Pick<PvService, "slug" | "path" | "name">[] = [
  { slug: "all-websites", path: "/services/websites", name: "Shopify and WordPress" },
  ...pvWebsiteSubs,
];

/**
 * What the menus list under Bespoke Software. The first entry points at the
 * main page: without it the two branches read as the whole service, as if we
 * only built Shopify apps and WordPress plugins.
 */
export const pvBespokeMenu: Pick<PvService, "slug" | "path" | "name">[] = [
  { slug: "custom-built-software", path: "/services/bespoke-software", name: "Custom-built software" },
  ...pvBespokeSubs,
];

const all = [...pvServices, ...pvSubServices, ...pvBespokeSubs, ...pvWebsiteSubs];

export function getPvService(slug: string): PvService | undefined {
  return pvServices.find((s) => s.slug === slug);
}

export function getPvSubService(slug: string): PvService | undefined {
  return pvSubServices.find((s) => s.slug === slug);
}

export function getBespokeSub(slug: string): PvService | undefined {
  return pvBespokeSubs.find((s) => s.slug === slug);
}

export function getWebsiteSub(slug: string): PvService | undefined {
  return pvWebsiteSubs.find((s) => s.slug === slug);
}

export function getAnyPvService(slug: string): PvService | undefined {
  return all.find((s) => s.slug === slug);
}
