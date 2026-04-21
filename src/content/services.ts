import type { Accent, Category } from "./work";

export type ServiceSlug =
  | "websites"
  | "consultancy"
  | "automation-ai"
  | "seo"
  | "marketing"
  | "design";

/** A piece of visual media shown on the service page. Kept narrow so
 *  ServiceView can render it without pulling in the full case-study
 *  block system. */
export type ServiceMedia =
  | {
      kind: "browser";
      src: string;
      alt: string;
      url: string;
      phone?: { src: string; alt: string };
    }
  | { kind: "uiMock"; name: string; caption?: string }
  | { kind: "phone"; src: string; alt: string; caption?: string }
  | { kind: "image"; src: string; alt: string; aspect?: string; caption?: string }
  | {
      kind: "statGroup";
      items: Array<{ eyebrow?: string; value: string; label: string }>;
    };

export type Service = {
  slug: ServiceSlug;
  num: string;
  name: string;
  accent: Accent;
  tagline: string;
  /** Summary shown on the index page */
  summary: string;
  hero: {
    eyebrow: string;
    heading: string;
    headingAccent?: string;
    lead: string;
  };
  overview: {
    heading: string;
    body: string | string[];
  };
  capabilities: string[];
  approach?: {
    heading: string;
    body: string | string[];
    steps?: Array<{ label: string; body: string }>;
  };
  /** Which case categories (from work.ts) surface as related work */
  relatedCategories?: Category[];
  /** Optional keyword to match services strings on case studies */
  relatedKeyword?: RegExp;
  /** Optional visuals so the page isn't text-only */
  heroMedia?: ServiceMedia;
  midMedia?: ServiceMedia;
  /** Optional typographic platforms showcase, huge gradient type per platform */
  platforms?: {
    eyebrow: string;
    heading: string;
    lead?: string;
    items: Array<{ name: string; tagline: string; accent: Accent }>;
  };
  /** Optional three-device showcase, desktop + tablet + phone, different sites */
  triplePreview?: {
    eyebrow: string;
    heading: string;
    headingAccent?: string;
    lead?: string;
    caption?: string;
    desktop: { src: string; alt: string; url: string; label?: string };
    tablet: { src: string; alt: string; label?: string };
    phone: { src: string; alt: string; label?: string };
  };
  faqs?: Array<{ q: string; a: string }>;
  cta: {
    heading: string;
    headingAccent: string;
    body: string;
  };
};

export const services: Service[] = [
  {
    slug: "websites",
    num: "01",
    name: "Websites",
    accent: "blue",
    tagline: "Sites that sell, scale, and stay yours.",
    summary:
      "Shopify and WordPress builds with the same speed, conversion, and SEO foundations across both. Plus the bespoke functionality when the standard stack isn't enough.",
    hero: {
      eyebrow: "[ 01 ] Websites",
      heading: "Shopify and WordPress builds,",
      headingAccent: "plus the bespoke parts.",
      lead: "We design and develop on the two platforms we know deepest. Shopify for eCommerce, WordPress for anything content-led. Same build standard across both.",
    },
    overview: {
      heading: "What we mean by this",
      body: [
        "Fast, mobile-first, editable without developer support. Every build ships with proper SEO foundations, clean information architecture, and enough room to plug in AI or automation when the business is ready.",
        "We don't pretend headless is the answer to everything. Shopify and WordPress solve 95% of the problems a growing business throws at a website. Where they don't, we build the custom piece that fills the gap.",
      ],
    },
    capabilities: [
      "Shopify",
      "Shopify Plus",
      "WordPress",
      "Block themes",
      "Custom theme development",
      "Platform migrations",
      "Performance",
      "UX & UI",
      "Conversion",
      "SEO foundations",
    ],
    approach: {
      heading: "How it goes",
      body: "No mystery process. Five stages, locked down up front.",
      steps: [
        { label: "Discovery", body: "Scope, goals, audience, stack. One week." },
        { label: "Design", body: "Visual direction, page templates, UX decisions signed off." },
        { label: "Build", body: "Clean theme/template build, integrations, content structure." },
        { label: "Launch", body: "QA, redirects, analytics, DNS. Go-live without the drama." },
        { label: "Care", body: "Optional retainer for ongoing iteration, updates, and optimisation." },
      ],
    },
    relatedCategories: ["ecommerce", "wordpress"],
    relatedKeyword: /shopify|wordpress|build|replatform|relaunch|redesign/i,
    triplePreview: {
      eyebrow: "Across every device",
      heading: "Built for the size",
      headingAccent: "they actually use.",
      lead: "Every build ships responsive by default. Checkout fluent on phone, catalogue readable on tablet, hero impactful on desktop.",
      desktop: {
        src: "/work/showcase/desktop.jpg",
        alt: "Desktop browser view",
        url: "funcases.com",
        label: "Desktop",
      },
      tablet: {
        src: "/work/showcase/tablet.jpg",
        alt: "Tablet view",
        label: "Tablet",
      },
      phone: {
        src: "/work/showcase/mobile.jpg",
        alt: "Mobile view",
        label: "Mobile",
      },
    },
    platforms: {
      eyebrow: "Platforms",
      heading: "Three platforms. One build standard.",
      lead: "We know Shopify and WordPress deeper than most. Same build standard across both.",
      items: [
        {
          name: "Shopify",
          tagline: "For most eCommerce, fast to launch, easy to operate, built for volume.",
          accent: "blue",
        },
        {
          name: "Shopify Plus",
          tagline: "For scale. B2B, multi-region, custom checkout, Launchpad, wholesale.",
          accent: "violet",
        },
        {
          name: "WordPress",
          tagline: "For anything content-led. Service businesses, portfolios, company blogs.",
          accent: "teal",
        },
      ],
    },
    faqs: [
      {
        q: "How much does a website cost?",
        a: "Scope drives price. WordPress builds typically land between £4k and £15k. Shopify rebuilds between £5k and £25k. Heavier custom work and Shopify Plus builds scale from there. We scope honestly before quoting, no paid discovery call required.",
      },
      {
        q: "How long does a build take?",
        a: "4–12 weeks depending on scope. WordPress builds at 4–6. Shopify rebuilds at 6–10. Heavier custom work at 10–12. Timelines get locked after discovery, and we hit them.",
      },
      {
        q: "Do you build standard WordPress sites, or only eCommerce?",
        a: "Both. Brochure sites, service businesses, portfolios, company blogs. WordPress is our go-to for anything content-led. Same build standards as our eCommerce work: speed, SEO, clean architecture, no bloat.",
      },
      {
        q: "Can you migrate us from another platform?",
        a: "Yes. Shopify → Shopify Plus, WooCommerce → Shopify, Magento → Shopify, WordPress → Shopify (like we did for Origin Architectural). Migrations include content, redirects, SEO protection, and order-history preservation where relevant.",
      },
      {
        q: "What happens after launch?",
        a: "You can take it from there, or keep us on retainer for ongoing updates, CRO, performance monitoring, and new features. Most clients keep us on 2–6 days a month. Flexible, no lock-in.",
      },
      {
        q: "Is Shopify Plus worth it over standard Shopify?",
        a: "For most brands under £2M revenue, no. Standard Shopify is faster to build, cheaper to run, and handles the vast majority of what you'll need. Plus pays off once you need B2B, multi-region, Launchpad, or headline-level checkout customisation.",
      },
      {
        q: "Can you work with an existing design or brand?",
        a: "Yes. If you have a design system, we'll build to it. If you have a brand book with no screens yet, we'll design the site around it. If you have neither, we handle both ends.",
      },
    ],
    cta: {
      heading: "Need a new",
      headingAccent: "website?",
      body: "30 minutes, no decks, no pressure. We'll tell you if we're the right fit before anything else.",
    },
  },

  {
    slug: "consultancy",
    num: "02",
    name: "Consultancy",
    accent: "violet",
    tagline: "eCommerce strategy, without the fluff.",
    summary:
      "Senior eCommerce expertise that plugs in where your team needs it. Strategy, platform calls, growth planning, and hands-on delivery, shaped around your in-house team.",
    hero: {
      eyebrow: "[ 02 ] Consultancy",
      heading: "Senior eCommerce expertise,",
      headingAccent: "shaped around your team.",
      lead: "We liquify around in-house staff. Scaling up to strategy, platform, and growth calls, scaling down to hands-on delivery when you need it. A vetted network of specialists pulled in per project.",
    },
    heroMedia: {
      kind: "uiMock",
      name: "consultancy-audit-board",
      caption: "Every retainer starts with an audit · scorecard + prioritised roadmap",
    },
    overview: {
      heading: "What we mean by this",
      body: [
        "Most eCommerce businesses don't need another full-time hire, they need senior expertise on tap when decisions stack up. We run as an extension of your team, not a replacement.",
        "Weekly strategic guidance, platform and stack calls, growth planning, and hands-on delivery when scope widens. A consistent point of contact, backed by a vetted network of specialists in marketing, design, and development we pull in per project.",
      ],
    },
    capabilities: [
      "eCommerce strategy",
      "Platform selection",
      "Stack architecture",
      "Growth planning",
      "CRO audits",
      "Team support",
      "Retainer consulting",
      "Specialist network",
    ],
    approach: {
      heading: "How we plug in",
      body: [
        "Every consultancy engagement starts with an audit. We look at the stack, the traffic, the conversion path, the marketing loop, and where the team's bandwidth is already thin. The recommendations come from the data, not a decks template.",
        "From there, we shape a retainer or project around what the business actually needs. Sometimes that's a weekly strategy call. Sometimes it's a three-month growth sprint. Sometimes it's a platform migration plan you execute in-house with us on speed-dial.",
      ],
    },
    relatedCategories: ["ecommerce"],
    relatedKeyword: /consultancy|strategy/i,
    faqs: [
      {
        q: "How does this differ from hiring an in-house eCommerce manager?",
        a: "Seniority and flexibility. You get 15+ years of eCommerce experience on tap without carrying the salary year-round, plus a network of specialists to pull in when scope widens. Better for most operations under £10M revenue. You grow into needing a full-time hire rather than betting on one.",
      },
      {
        q: "What does a typical consultancy retainer look like?",
        a: "Usually a fixed number of days per month (2, 4, or 8) covering strategy calls, platform decisions, growth planning, and hands-on execution when needed. Scoped per client. We don't have one-size-fits-all packages.",
      },
      {
        q: "Do you work alongside our in-house team?",
        a: "Always. We don't replace teams, we blend in where the gaps are. Strategic calls, specialist one-offs, and growth programs that sit outside the in-house day-to-day. Same consistent point of contact, scope shapes around you.",
      },
      {
        q: "Do we need to rebuild, or can you improve what we have?",
        a: "Often neither. We start with an audit and tell you straight: rebuild, targeted fixes, or leave it alone. We don't oversell. Some of our best retainers have been pure strategy with zero re-build involved.",
      },
      {
        q: "What if we need specialist help outside your in-house skills?",
        a: "We have a vetted network of specialists (senior paid-media buyers, logistics consultants, B2B strategists, luxury brand designers, platform migration specialists) that we bring in per project. You get one point of contact. We handle coordination.",
      },
      {
        q: "How do engagements usually start?",
        a: "A 30-minute discovery call (free) to understand the business, followed by an audit proposal if there's a fit. Audits typically run 2–3 weeks and deliver a prioritised roadmap. Retainer or project engagement starts from there.",
      },
      {
        q: "Can you help us choose between Shopify, WordPress, or platforms like Magento?",
        a: "Yes. Platform selection is one of the most common audit outputs. We'll tell you which fits your business based on catalogue size, team composition, operational complexity, and growth trajectory. We have no platform allegiance. We've rebuilt off every major platform and onto most of them.",
      },
      {
        q: "Are your consultancy rates project-based or retained?",
        a: "Both. Retainers for ongoing strategic support, projects for defined scope (migrations, audits, re-platforms, growth sprints). We'll propose whichever fits.",
      },
    ],
    cta: {
      heading: "Need an eCommerce",
      headingAccent: "partner?",
      body: "One call. We'll tell you where the biggest wins are before you commit to anything.",
    },
  },

  {
    slug: "automation-ai",
    num: "03",
    name: "Automation & AI",
    accent: "teal",
    tagline: "AI that does the work, not the talking.",
    summary:
      "Custom AI tools, automation layers, and workflow systems built into your stack. The kind that pay back in weeks, not months.",
    hero: {
      eyebrow: "[ 03 ] Automation & AI",
      heading: "AI that earns its keep,",
      headingAccent: "built into your stack.",
      lead: "Not chatbots. Production AI tools that your team uses every day. Customer-service agents, product generators, image pipelines, internal search, workflow automation. Measurable from week one.",
    },
    overview: {
      heading: "What we mean by this",
      body: [
        "Most agency AI is theatre. Our rule: if it can't prove value in week four, it doesn't ship. Every AI system we build has a clear ROI attribution path and a human-review gate. AI-assisted, not AI-automated.",
        "We build directly into your stack (Shopify, WordPress, or custom) using the Claude API and whatever tools fit the job. You own the codebase. No lock-in to our platform, because we don't have one.",
      ],
    },
    capabilities: [
      "Custom AI apps",
      "AI customer service agents",
      "Product generators",
      "Image retouching pipelines",
      "Content operations",
      "Internal search & RAG",
      "Workflow automation",
      "Claude API integrations",
      "Custom WMS / internal tools",
    ],
    approach: {
      heading: "How we scope AI work",
      body: [
        "We start with the ROI conversation, not the tech. If a tool can't pay back within weeks of shipping, we say so.",
        "From there, we build the smallest version that proves the model works, put it in front of the team, and iterate. No hero launches. Every AI tool in our portfolio was shipped lean first, then widened.",
      ],
    },
    relatedCategories: ["ai"],
    relatedKeyword: /ai|automation|wms|agent|integration|generator|pipeline|retouch/i,
    heroMedia: {
      kind: "uiMock",
      name: "fun-cases-ai-customer-service",
      caption: "Fun Cases · AI support queue · in production",
    },
    midMedia: {
      kind: "uiMock",
      name: "stack-integration-flow",
      caption: "Shopify → router → Xero, Sheets, Klaviyo, Slack · one scenario, live",
    },
    faqs: [
      {
        q: "How does AI actually help my business?",
        a: "Five patterns we've shipped: AI-drafted customer service (Fun Cases and Twisted Tailor run this, 50–70% of CS hours saved), AI product generators that publish a range in minutes not days, AI image pipelines for standardising lifestyle and product shots, AI competitor and inventory trackers (Sublishop), and internal search across docs/Drive/email. All measurable. No chatbot theatre.",
      },
      {
        q: "What does 'AI-assisted, not AI-automated' mean?",
        a: "Every output our AI produces crosses a human desk before it goes out. Humans keep the taste. AI does the bulk work. Autonomous AI fails in edge cases and erodes brand voice, so we don't ship it. The win is in human-reviewed throughput, not human-replaced pipelines.",
      },
      {
        q: "How much does a custom AI app cost?",
        a: "Custom AI builds range from £1k to £15k depending on scope. Small, single-purpose tools (a content drafter, a tagging agent, a simple workflow script) land at the lower end. More involved systems (product generators with Shopify integration, live competitor tracking with alerts, internal search with RAG) land at the top. Ongoing API costs depend on volume, typically £50 to £300 per month per tool.",
      },
      {
        q: "How long does a build take?",
        a: "1–4 weeks for a single tool, 4–8 weeks for larger systems. We scope against a 'ships lean first' principle: smallest version that proves value, live in weeks, then widen based on team feedback.",
      },
      {
        q: "Who owns the code and the AI system afterwards?",
        a: "You do. Every AI system we build lives in your stack, on your infrastructure, owned outright. No vendor lock-in to our platform because we don't have one. If the team wants to take it in-house and extend, the codebase is handed over clean.",
      },
      {
        q: "Which AI model do you use?",
        a: "Claude for most production work. It's the best available on reasoning and writing, and Anthropic's safety stance fits our 'human-in-the-loop' philosophy. We'll use other models (GPT, Gemini, open-source) where they fit a specific use case better.",
      },
      {
        q: "What happens if Claude's pricing changes or the API changes?",
        a: "Every system we build abstracts the model behind an interface. Swapping to a different provider takes days, not a rebuild. We also version-lock models so your production pipeline doesn't break when Anthropic ships a new release.",
      },
      {
        q: "Is AI work GDPR / data-compliant?",
        a: "Yes. We architect around data minimisation (only the fields the model needs), use enterprise endpoints with no training opt-in, and run everything through a human review gate for customer-facing outputs. Happy to share our compliance playbook during scoping.",
      },
      {
        q: "Can you extend an existing AI system we've built?",
        a: "Usually, yes. We've taken over AI projects started by other teams, either to fix production issues or to add new capability. Start with an audit of the codebase and infrastructure before committing to scope.",
      },
    ],
    cta: {
      heading: "Have an",
      headingAccent: "AI idea?",
      body: "We'll tell you if it'll pay back, honestly. Before you commit to a build.",
    },
  },

  {
    slug: "seo",
    num: "04",
    name: "SEO",
    accent: "blue",
    tagline: "Traffic that compounds.",
    summary:
      "Technical foundations first, content architecture second. The kind of SEO that still works in 2026, legible to Google and LLMs both.",
    hero: {
      eyebrow: "[ 04 ] SEO",
      heading: "Technical foundations",
      headingAccent: "and content that compounds.",
      lead: "Clean schema, fast cores, content clusters that compound. AIO & GEO tuning so LLMs surface your brand as often as Google does. Rankings follow craft, not hacks.",
    },
    overview: {
      heading: "What we mean by this",
      body: [
        "SEO is a long game. We build the technical foundations any site needs (clean markup, fast load, sensible URL structure, proper schema) then layer content that earns rankings because it answers real questions in your category.",
        "The rise of AI search has changed the shape of SEO. We tune for AIO (AI Optimisation) and GEO (Generative Engine Optimisation) alongside traditional SEO, so your brand surfaces in Claude, ChatGPT, Perplexity answers as well as Google results.",
      ],
    },
    capabilities: [
      "Technical SEO",
      "Content architecture",
      "Keyword research",
      "AIO & GEO",
      "Schema markup",
      "Internal linking",
      "Site audits",
      "Migration protection",
      "Content programs",
    ],
    relatedCategories: ["ecommerce", "wordpress"],
    // Intentionally strict: only match case studies that explicitly list
    // "SEO" (or a close organic-search term). Previously /seo|search/i was
    // too loose and pulled in unrelated cases (e.g. Little Muddy Boots'
    // "Custom postcode search" tool, which isn't SEO work).
    relatedKeyword: /\bSEO\b|\borganic\b|\bAIO\b|\bGEO\b|schema|search engine/i,
    heroMedia: {
      kind: "statGroup",
      items: [
        {
          eyebrow: "Google UK · Fun Cases",
          value: "#1",
          label: "for 'Phone Cases'",
        },
        {
          eyebrow: "Google UK · Gieves & Hawkes",
          value: "#1",
          label: "for 'Luxury Suit'",
        },
        {
          eyebrow: "Gieves · 6-month organic growth",
          value: "+46%",
          label: "clicks from search",
        },
      ],
    },
    faqs: [
      {
        q: "What kind of rankings are realistic?",
        a: "Depends on the category and starting point, but here are two we've delivered. Fun Cases at #1 on Google UK for 'Phone Cases', one of the highest-intent eCommerce terms in the space, with over 25,000 UK searches a month. Gieves & Hawkes at #1 on Google UK for 'Luxury Suit', a competitive fashion term with over 16,000 monthly searches, ranked from a standing start after their Frasers takeover. Position one on Google typically earns around a 30% click-through rate, so on those two terms alone that's thousands of high-intent visits a month. Those aren't anomalies, they're what deliberate technical and content work compounds into over 12 to 24 months.",
      },
      {
        q: "How long until SEO pays back?",
        a: "6–12 months for most categories. Competitive terms take 12–24. We set honest expectations up front and track progress monthly against both Google rankings and LLM citation share.",
      },
      {
        q: "What's AIO & GEO?",
        a: "AI Optimisation and Generative Engine Optimisation. Tuning content, schema, and structure so LLMs (Claude, ChatGPT, Perplexity, Gemini) cite and surface your brand when users ask industry questions. Increasingly as important as Google rankings. For some categories, already more important.",
      },
      {
        q: "Is Google SEO dead now that AI search is here?",
        a: "No. Google still handles ~70% of product discovery globally. But the shape is shifting: AI Overviews above the organic list, LLM answers replacing short-tail searches. SEO in 2026 means ranking in both surfaces. We tune for both simultaneously.",
      },
      {
        q: "What does an SEO engagement include?",
        a: "Technical audit and fixes (schema, site speed, crawl, internal linking), content architecture (taxonomy, clusters, hub-and-spoke), keyword research (including prompt-query research for AI search), ongoing content production or editing support, and monthly reporting on rankings, impressions, and LLM citations.",
      },
      {
        q: "Can you protect our rankings during a site migration?",
        a: "Yes, migration SEO is one of our most-asked services. 301 mapping, canonical preservation, structured-data continuity, content parity checks. We've migrated brands off WordPress onto Shopify (Origin Architectural) with zero ranking loss.",
      },
      {
        q: "How much does SEO cost?",
        a: "Retainer-based. Basic SEO starts from £750/month covering core technical care and monthly reporting. Full-service (technical, content, AIO) runs £1,500 to £2,500/month. One-off audits from £1,000 depending on site size and depth required.",
      },
      {
        q: "Do you do link building?",
        a: "Yes, but not the spammy kind. We focus on editorial links, partnerships, digital PR, and resource-link outreach. No PBNs, no paid directories, no shortcuts that Google is actively penalising.",
      },
    ],
    cta: {
      heading: "Want organic traffic",
      headingAccent: "that compounds?",
      body: "We'll audit where you stand today and tell you what's realistic. No sales theatre.",
    },
  },

  {
    slug: "marketing",
    num: "05",
    name: "Marketing",
    accent: "violet",
    tagline: "Campaigns that land.",
    summary:
      "Paid, lifecycle email, and analytics stitched into one loop. Campaigns that compound, attribution you can explain, budget spent where it returns.",
    hero: {
      eyebrow: "[ 05 ] Marketing",
      heading: "Paid, email, and analytics,",
      headingAccent: "one compounding loop.",
      lead: "Google and Meta at the top. Klaviyo lifecycle holding the middle. Analytics and attribution honest enough to steer both. No hero launches, no dashboard theatre.",
    },
    overview: {
      heading: "What we mean by this",
      body: [
        "Paid media alone doesn't build a brand. Email alone doesn't drive new customers. We run both as a single loop, with analytics as the honest broker that tells you where each pound is earning out.",
        "Campaigns tuned against actual product margin, not top-line revenue. Lifecycle flows that land because they're relevant, not because they're frequent. Attribution you can actually read and act on.",
      ],
    },
    capabilities: [
      "Google Ads",
      "Meta Ads",
      "Performance Max",
      "Paid social",
      "Lifecycle email (Klaviyo)",
      "Campaign email",
      "Attribution",
      "Analytics",
      "CRO",
      "Reporting",
    ],
    relatedCategories: ["ecommerce"],
    relatedKeyword: /ppc|paid|marketing|email|klaviyo|social|google|meta/i,
    heroMedia: {
      kind: "statGroup",
      items: [
        {
          eyebrow: "Email marketing · across our clients",
          value: "£3m+",
          label: "generated annually through email",
        },
        {
          eyebrow: "Sublishop · biggest single campaign",
          value: "£15k",
          label: "from one send",
        },
        {
          eyebrow: "Fun Cases · blended ROAS",
          value: "8+",
          label: "sustained on £35k/mo spend",
        },
      ],
    },
    faqs: [
      {
        q: "What does a typical marketing retainer include?",
        a: "Paid media management (Google, Meta, and sometimes TikTok), lifecycle email on Klaviyo (flows, campaigns, segmentation), analytics and attribution, monthly reporting. Some retainers also include CRO sprints and landing-page work.",
      },
      {
        q: "How much should we be spending?",
        a: "Depends on margin and growth stage, but most of our clients run at 10–20% of revenue on paid acquisition. We'd rather steer you to the right spend level than just spend whatever you hand us. We've told clients to reduce their paid budget when email flows weren't pulling their weight.",
      },
      {
        q: "What kind of ROAS can we expect?",
        a: "Depends on the category. Fun Cases run at 8+ blended ROAS sustained against £35k/month spend. Luxury and considered-purchase categories run lower (3–5x). We'll benchmark against your margin structure and tell you what's realistic before committing spend.",
      },
      {
        q: "How much of our revenue should come from email?",
        a: "Best-in-class is 25–40% for most eCommerce brands. Fun Cases sits at 30%+, mostly lifecycle flows on Klaviyo, not campaign blasts. If you're under 15%, there's significant headroom.",
      },
      {
        q: "Do you handle creative or just media buying?",
        a: "Both, if you need. We have in-house designers for static and motion creative, and partner with editorial videographers for performance video where required. Or we'll work with your creative team if you have one.",
      },
      {
        q: "What does attribution look like in 2026?",
        a: "Messy, honestly. iOS and third-party cookie changes have broken traditional last-click attribution. We use a mix of server-side tracking, MMM (marketing mix modelling) for larger accounts, and honest causal testing (incrementality) for the channels that matter most. No dashboard theatre.",
      },
      {
        q: "Can you work with our existing agency or in-house team?",
        a: "Yes, we often run as the strategic lead with an in-house junior executing, or alongside a specialist paid-media agency handling one channel while we handle the others. Collaborative, not territorial.",
      },
      {
        q: "How soon will we see results?",
        a: "Paid media within 2–4 weeks. Email flow rebuilds within 6–8 weeks. SEO-aware content marketing 3–6 months. We set monthly checkpoints against metrics that actually matter (CPA, LTV, AOV) rather than vanity ones.",
      },
    ],
    cta: {
      heading: "Need marketing that",
      headingAccent: "pays back?",
      body: "Start with a 30-minute audit. We'll tell you where your budget's leaking, for free.",
    },
  },

  {
    slug: "design",
    num: "06",
    name: "Design",
    accent: "teal",
    tagline: "Systems, not decoration.",
    summary:
      "Brand identity, UI systems, motion, and typography as one coherent system. Build once, ship faster forever after.",
    hero: {
      eyebrow: "[ 06 ] Design",
      heading: "Brand systems,",
      headingAccent: "not decoration.",
      lead: "Identity, UI, motion, and typography as one system. Tokens, components, and guidelines built once so every page, campaign, and product ships faster after.",
    },
    overview: {
      heading: "What we mean by this",
      body: [
        "Most brands end up with a logo, a palette, and a hundred inconsistent touch-points. Design as a system means defining the rules once (tokens, typography, motion, UI components) so every team shipping anything downstream has a clear surface to build on.",
        "We work at both ends: new identities for brands repositioning themselves, and refactoring existing brands into proper systems that scale.",
      ],
    },
    capabilities: [
      "Brand identity",
      "Design tokens",
      "UI component systems",
      "Typography",
      "Motion",
      "Iconography",
      "Design ops",
      "Brand guidelines",
    ],
    relatedCategories: ["ecommerce", "wordpress"],
    relatedKeyword: /design|brand|theme|typography|identity/i,
    cta: {
      heading: "Want a brand",
      headingAccent: "that scales?",
      body: "Tell us the brief. We'll come back with the shape of what a proper system looks like for your business.",
    },
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getNextService(slug: string): Service | undefined {
  const i = services.findIndex((s) => s.slug === slug);
  if (i === -1) return undefined;
  return services[(i + 1) % services.length];
}
