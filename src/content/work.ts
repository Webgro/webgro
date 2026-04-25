export type Accent = "blue" | "violet" | "teal";

export type CaseBlock =
  | { type: "intro"; text: string }
  | { type: "chapter"; id: string; num: string; label: string; description?: string }
  | {
      type: "section";
      heading: string;
      body: string | string[];
      eyebrow?: string;
      phone?: { src: string; alt: string; caption?: string; width?: "sm" | "md" | "lg" };
    }
  | { type: "stats"; items: Array<{ label: string; value: string }> }
  | { type: "heroStat"; value: string; label: string; eyebrow?: string; footnote?: string }
  | {
      type: "statGroup";
      items: Array<{ value: string; label: string; eyebrow?: string; footnote?: string }>;
    }
  | { type: "image"; src: string; alt: string; caption?: string; full?: boolean; aspect?: string }
  | { type: "product"; src: string; alt: string; aspect?: string; fit?: "contain" | "cover"; padded?: boolean; caption?: string }
  | {
      type: "browser";
      src: string;
      alt: string;
      url: string;
      aspect?: string;
      caption?: string;
      phone?: { src: string; alt: string };
    }
  | { type: "phone"; src: string; alt: string; caption?: string; width?: "sm" | "md" | "lg" }
  | { type: "uiMock"; name: string; caption?: string }
  | { type: "split"; left: { src: string; alt: string }; right: { src: string; alt: string } }
  | {
      type: "beforeAfter";
      before: { src: string; alt: string; label?: string };
      after: { src: string; alt: string; label?: string };
      aspect?: string;
      caption?: string;
    }
  | { type: "gallery"; images: Array<{ src: string; alt: string; aspect?: string }> }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "deliverables"; heading?: string; items: string[] };

export type Category = "ecommerce" | "wordpress" | "ai";

export type CaseStudy = {
  slug: string;
  client: string;
  tag: string;
  year: string;
  accent: Accent;
  heroImage: string;
  heroImageAlt: string;
  excerpt: string;
  services: string[];
  stack: string[];
  timeline: string;
  url?: string;
  featured?: boolean;
  /** Filter categories, drives the filter bar on /work */
  categories: Category[];
  body: CaseBlock[];
};

export const categoryLabel: Record<Category, string> = {
  ecommerce: "eCommerce",
  wordpress: "WordPress",
  ai: "AI & Custom Apps",
};

// Image paths with no corresponding file render as branded gradient
// placeholders with the client name baked in. Drop a file at the
// referenced path to swap the placeholder for the real asset.
export const caseStudies: CaseStudy[] = [
  {
    slug: "fun-cases",
    client: "Fun Cases",
    tag: "eCommerce · AI",
    year: "Since 2012",
    accent: "blue",
    heroImage: "/work/fun-cases.jpg",
    heroImageAlt: "Fun Cases storefront",
    excerpt:
      "A Shopify storefront, a custom inventory system, and three production-grade AI tools. Built for a team that ships designs faster than most brands ship campaigns.",
    services: [
      "Shopify",
      "AI integrations",
      "Custom WMS",
      "SEO",
      "PPC",
      "Email",
    ],
    stack: ["Shopify", "Klaviyo", "Google", "Meta"],
    timeline: "Long-term partnership",
    url: "https://funcases.com",
    featured: true,
    categories: ["ecommerce", "ai"],
    body: [
      {
        type: "intro",
        text: "Fun Cases ship thousands of phone cases across custom designs and licensed ranges. The old workflow turned ten new designs into a day of manual uploads. The new one does it in under ten minutes. Customer service hours are down 70%. And revenue is up 300% over the last five years.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "website",
        num: "01",
        label: "Website",
        description:
          "A Shopify storefront rebuilt for speed, merchandising flexibility, and a checkout that holds up on peak sales days.",
      },
      {
        type: "section",
        eyebrow: "The partnership",
        heading: "Built to keep up with the pace",
        body: [
          "Fun Cases design and ship quickly. The site had to match. We rebuilt on Shopify with a focus on speed, merchandising flexibility, and a checkout that holds up on their best sales days.",
          "One partnership, long-term. Continuously iterated against live business pressure rather than launched once and left.",
        ],
      },
      {
        type: "statGroup",
        items: [
          { eyebrow: "Revenue growth · 5 years", value: "+300%", label: "year-on-year" },
          { eyebrow: "Avg. conversion rate", value: "6.0%", label: "worldwide" },
          { eyebrow: "Peak CR · Dec 2025", value: "11.2%", label: "highest day" },
        ],
      },
      {
        type: "browser",
        src: "/work/fun-cases/storefront.jpg",
        alt: "Fun Cases storefront",
        url: "funcases.com",
      },

      // ── Chapter 02 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "marketing",
        num: "02",
        label: "Marketing & SEO",
        description:
          "A growth loop that earns out each quarter across paid, lifecycle, and organic. Built on a technical SEO foundation that reads cleanly to Google and LLMs.",
      },
      {
        type: "section",
        eyebrow: "SEO",
        heading: "Ranked #1 for 'Phone Cases'",
        body: [
          "SEO was built into the rebuild, not bolted on after. Content architecture, internal linking, technical foundations, and a content program tied to the merch calendar.",
          "Fun Cases have since peaked at #1 on Google UK for 'Phone Cases', one of the most competitive category terms in the space.",
        ],
      },
      {
        type: "statGroup",
        items: [
          { eyebrow: "Revenue via email", value: "30%", label: "of total revenue" },
          { eyebrow: "Paid spend · monthly", value: "£35k", label: "across Google & Meta" },
          { eyebrow: "Blended ROAS", value: "8+", label: "sustained" },
        ],
      },
      {
        type: "section",
        eyebrow: "Email marketing",
        heading: "Thirty percent of revenue, earned quietly",
        body: [
          "Email is the highest-leverage channel in Fun Cases' stack. Lifecycle flows on Klaviyo, campaign design tied to the merch drop calendar, segmentation on real behaviour rather than vanity fields.",
          "Over 30% of total revenue now comes through email. The kind of compounding margin that doesn't need more ad spend to stand up.",
        ],
        phone: {
          src: "/work/fun-cases/email.png",
          alt: "Fun Cases email campaign on mobile",
          caption: "Campaign email · mobile",
        },
      },
      {
        type: "section",
        eyebrow: "PPC",
        heading: "£35k a month, returning 8× and climbing",
        body: [
          "Paid media on Google and Meta. Combined spend around £35,000 a month, blended ROAS consistently above 8. Search, Shopping, Performance Max, paid social all tuned against actual product margins rather than top-line revenue alone.",
          "No spikes. No hero launches. Compounding spend against a catalogue that keeps widening, shepherded week-to-week.",
        ],
      },

      // ── Chapter 03 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "apps",
        num: "03",
        label: "Custom Apps",
        description:
          "Three production AI tools and a custom Stock System. Each one built into the Fun Cases workflow, earning its keep daily.",
      },
      {
        type: "section",
        heading: "AI customer service",
        body: "Every incoming ticket is triaged, summarised, and drafted by AI. A human reviews, edits, and sends. Customer service hours are down 70%. Response times are up. Tone stays on-brand because humans still sign off.",
      },
      {
        type: "uiMock",
        name: "fun-cases-ai-customer-service",
        caption: "AI support queue · live product view",
      },
      {
        type: "section",
        heading: "AI product generator",
        body: "Drop in a design and a collection title. The tool generates and publishes a full range (Phone Cases, Laptop Sleeves, Lunchboxes, Keyrings, Posters) in under ten minutes. Mockups, SKUs, variants, imagery, copy. Merchandising went from cutting a range in a day to cutting it before lunch.",
      },
      {
        type: "uiMock",
        name: "fun-cases-ai-product-generator",
        caption: "Product generator · design input to 5-product range",
      },
      {
        type: "section",
        heading: "AI image generator",
        body: "Upload a product mockup. Get back Instagram-ready lifestyle imagery in two clicks. Model shots, environments, angles. Ready for social without a photographer on the books.",
      },
      {
        type: "uiMock",
        name: "fun-cases-ai-image-generator",
        caption: "Image generator · mockup to lifestyle variants",
      },
      {
        type: "section",
        eyebrow: "Stock System",
        heading: "A WMS that actually fits the business",
        body: [
          "Off-the-shelf warehouse management was either too big or too limited. We built a custom WMS tailored to the Fun Cases operation. Integrated directly with Shopify, live stock, no middleware headaches, owned outright by the client.",
          "The platform also runs a productivity tracker across the pick-and-pack team, AI-driven restock and fulfilment recommendations, and a growing set of small tools the ops team ask for and we ship. It's less of a product and more of a living system.",
        ],
      },
      {
        type: "uiMock",
        name: "fun-cases-wms",
        caption: "Stock System · movement history · live product view",
      },
      {
        type: "deliverables",
        heading: "Deliverables",
        items: [
          "Shopify storefront",
          "Custom WMS + Shopify integration",
          "AI customer service agent",
          "AI product generator",
          "AI lifestyle image generator",
          "SEO program",
          "Paid media (Google · Meta)",
          "Email marketing (Klaviyo)",
        ],
      },
    ],
  },

  {
    slug: "gieves-and-hawkes",
    client: "Gieves & Hawkes",
    tag: "Luxury eCommerce",
    year: "2014 to present",
    accent: "violet",
    heroImage: "/work/gieves-hawkes.webp",
    heroImageAlt: "Gieves & Hawkes digital flagship",
    excerpt:
      "A ground-up Shopify rebuild for the Savile Row house after the Frasers takeover. Ranked #1 on Google UK for 'luxury suit', from zero.",
    services: ["Shopify build", "eCommerce consultancy", "SEO", "Email marketing"],
    stack: ["Shopify", "Custom theme"],
    timeline: "Ongoing partnership",
    url: "https://gievesandhawkes.com",
    featured: true,
    categories: ["ecommerce"],
    body: [
      {
        type: "intro",
        text: "Gieves & Hawkes have tailored for British royalty since 1771. When Frasers Group took over the brand, the digital estate needed rebuilding from the ground up. A platform the new operation could own, edit, and scale without calling developers for every season.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "website",
        num: "01",
        label: "Website",
        description:
          "A ground-up Shopify rebuild with a custom theme tuned for luxury. Quiet typography, considered pacing, a checkout that stays calm under high-intent traffic.",
      },
      {
        type: "section",
        eyebrow: "The rebuild",
        heading: "Shopify, ground-up",
        body: [
          "We rebuilt the storefront on Shopify with a custom theme tuned for luxury. Quiet typography, considered pacing, heavyweight imagery, and a checkout that stays calm under high-intent traffic.",
          "Nothing templated, nothing borrowed. Every section, every block, every product template built for Gieves.",
        ],
      },
      {
        type: "browser",
        src: "/work/gieves-and-hawkes/storefront.jpg",
        alt: "Gieves & Hawkes storefront",
        url: "gievesandhawkes.com",
      },

      // ── Chapter 02 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "marketing",
        num: "02",
        label: "Marketing & SEO",
        description:
          "A technical SEO foundation and content program that took the brand to #1 on Google UK for 'luxury suit'. Organic traffic compounds month on month.",
      },
      {
        type: "section",
        eyebrow: "SEO",
        heading: "From rebuild to category leader",
        body: "Content, structure, links, and a technical foundation that reads cleanly to both Google and LLMs. Within months, Gieves ranked #1 in the UK for 'luxury suit'. The organic engine has compounded ever since.",
        phone: {
          src: "/work/gieves-and-hawkes/mobile.jpg",
          alt: "Gieves & Hawkes storefront on mobile",
          caption: "Mobile · product view",
        },
      },
      {
        type: "statGroup",
        items: [
          {
            eyebrow: "Peak ranking · Google UK",
            value: "#1",
            label: "for 'luxury suit'",
            footnote: "One of the most competitive terms in fashion search.",
          },
          {
            eyebrow: "Organic clicks · first 6 months",
            value: "+46%",
            label: "growth",
          },
          {
            eyebrow: "Organic impressions",
            value: "2.3M",
            label: "per month",
          },
        ],
      },

      // ── Chapter 03 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "consultancy",
        num: "03",
        label: "Consultancy",
        description:
          "The eCommerce team Gieves don't need to hire. Ongoing strategy, platform guidance, and hands-on delivery, plugged in week to week.",
      },
      {
        type: "section",
        eyebrow: "Ongoing partnership",
        heading: "Blending into the team",
        body: [
          "Our team blends in where there are gaps in theirs. Strategic calls, specialist one-off work, and growth programs that sit outside the day-to-day but still need senior eCommerce eyes on them.",
          "We liquify around whatever the in-house team is running. Strategy, platform decisions, and growth planning when the conversation goes bigger. Hands-on delivery when scope widens. A vetted network of marketing, design, and dev specialists pulled in per project when the work calls for it. Same consistent point of contact, shape-shifting scope.",
        ],
      },
      {
        type: "deliverables",
        heading: "Deliverables",
        items: [
          "Shopify build",
          "Custom theme",
          "Ongoing eCommerce consultancy",
          "SEO program",
          "Email marketing",
          "Growth planning",
        ],
      },
    ],
  },

  {
    slug: "sublishop",
    client: "Sublishop",
    tag: "B2B eCommerce · AI",
    year: "2023 to present",
    accent: "violet",
    heroImage: "/work/sublishop.jpg",
    heroImageAlt: "Sublishop storefront",
    excerpt:
      "A Shopify relaunch plus two custom AI apps (an inventory planner and a live competitor tracker) for a B2B print supplier. Sales up 240% in the first three months.",
    services: [
      "Shopify relaunch",
      "Custom AI apps",
      "SEO",
      "PPC",
      "Email marketing",
    ],
    stack: ["Shopify", "Custom AI apps", "Claude API"],
    timeline: "Ongoing",
    url: "https://sublishop.co.uk",
    featured: true,
    categories: ["ecommerce", "ai"],
    body: [
      {
        type: "intro",
        text: "Sublishop supply the print trade. The market moves on availability and price. We rebuilt the storefront to load fast and convert harder, then built two custom AI apps to give the team a real edge on inventory and pricing.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "website",
        num: "01",
        label: "Website",
        description:
          "A Shopify relaunch designed to move stock. Sales up 240% in the first three months.",
      },
      {
        type: "section",
        eyebrow: "The relaunch",
        heading: "A Shopify rebuild designed to move stock",
        body: "Clean information architecture, fast product pages, and a checkout that converts on mobile as well as desktop. Three months in, sales are up 240%.",
        phone: {
          src: "/work/sublishop/mobile.jpg",
          alt: "Sublishop on mobile",
          caption: "Mobile · B2B catalogue",
        },
      },
      {
        type: "browser",
        src: "/work/sublishop/storefront.jpg",
        alt: "Sublishop storefront",
        url: "sublishop.co.uk",
      },
      {
        type: "statGroup",
        items: [
          { eyebrow: "Sales · first 3 months", value: "+240%", label: "after relaunch" },
          { eyebrow: "Custom AI apps", value: "2", label: "in production" },
          { eyebrow: "Platform", value: "Shopify", label: "B2B-tuned" },
        ],
      },

      // ── Chapter 02 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "apps",
        num: "02",
        label: "Custom Apps",
        description:
          "Two production AI apps that give the team a real edge on inventory and pricing. Built once, owned forever.",
      },
      {
        type: "section",
        eyebrow: "AI in production",
        heading: "Inventory planner",
        body: "A custom app that reads sales velocity, lead times, and seasonality to recommend what to reorder and when. Less dead stock. Fewer stockouts. No more spreadsheet maths on a Friday afternoon.",
      },
      {
        type: "uiMock",
        name: "sublishop-inventory-planner",
        caption: "AI inventory planner · live product view",
      },
      {
        type: "section",
        heading: "Competitor tracker",
        body: "Live and historical competitor sales, inventory, and pricing. Surfaced in one dashboard with email alerts when a rival drops a price, runs out of a line, or pushes a promo. The team acts within hours, not weeks.",
      },
      {
        type: "uiMock",
        name: "sublishop-competitor-tracker",
        caption: "AI competitor tracker · live product view",
      },
      {
        type: "deliverables",
        heading: "Deliverables",
        items: [
          "Shopify relaunch",
          "Custom AI inventory planner",
          "Custom AI competitor tracker",
          "SEO program",
          "Paid media",
          "Email marketing",
        ],
      },
    ],
  },

  {
    slug: "twisted-tailor",
    client: "Twisted Tailor",
    tag: "Fashion · eCommerce · AI",
    year: "2024",
    accent: "teal",
    heroImage: "/work/twisted-tailor.jpg",
    heroImageAlt: "Twisted Tailor storefront",
    excerpt:
      "A Shopify rebuild for one of London's most-recognisable menswear names, with custom suit-set functionality and an AI support agent that halved customer-service hours.",
    services: ["Shopify build", "eCommerce consultancy", "SEO", "AI support agent"],
    stack: ["Shopify", "Custom theme", "Claude API"],
    timeline: "8 weeks",
    url: "https://twistedtailor.com",
    featured: true,
    categories: ["ecommerce", "ai"],
    body: [
      {
        type: "intro",
        text: "Twisted Tailor sell suits, but standard Shopify treats a jacket and trousers as two separate products. Customers were adding half a suit to basket. We fixed it, then automated the support queue that came from years of confusion.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "website",
        num: "01",
        label: "Website",
        description:
          "A Shopify rebuild with custom suit-pairing functionality to solve the jacket-and-trousers problem at source.",
      },
      {
        type: "section",
        eyebrow: "The problem",
        heading: "A suit is not two products",
        body: [
          "Out of the box, Shopify doesn't know that a jacket and a trouser belong together. Customers were buying one half. Customer service were spending hours untangling it. Refunds climbed. Conversion dropped on what should have been a simple sale.",
          "We built custom functionality that pairs jacket and trouser as one item. Sizing logic, one add-to-basket moment, one sale on the ledger. The confusion stopped.",
        ],
        phone: {
          src: "/work/twisted-tailor/mobile.jpg",
          alt: "Twisted Tailor on mobile",
          caption: "Mobile · suit pairing",
        },
      },
      {
        type: "browser",
        src: "/work/twisted-tailor/storefront.jpg",
        alt: "Twisted Tailor storefront",
        url: "twistedtailor.com",
      },

      // ── Chapter 02 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "apps",
        num: "02",
        label: "Custom Apps",
        description:
          "An AI customer-service agent that halved support hours while keeping the brand voice intact.",
      },
      {
        type: "section",
        eyebrow: "AI",
        heading: "A support agent that knows what's routine",
        body: [
          "Twisted's support inbox ran hot. Sizing, returns, order status, sizing again. We built an AI agent that reads incoming tickets, answers the repetitive ones directly, and summarises the complex ones for a human to sign off.",
          "Customer service hours are down 50%. Response times are up. Nothing goes out without a human edit.",
        ],
      },
      {
        type: "uiMock",
        name: "twisted-tailor-ai-support",
        caption: "AI support agent · live product view",
      },
      {
        type: "statGroup",
        items: [
          {
            eyebrow: "Customer service hours",
            value: "−50%",
            label: "saved each week",
            footnote: "AI-drafted, human-approved.",
          },
          {
            eyebrow: "Custom build",
            value: "Suit pairing",
            label: "one item, one sale",
          },
          {
            eyebrow: "AI agent",
            value: "Live",
            label: "in production",
          },
        ],
      },
      {
        type: "deliverables",
        heading: "Deliverables",
        items: [
          "Shopify build",
          "Custom suit-pairing functionality",
          "AI customer service agent",
          "eCommerce consultancy",
          "SEO program",
        ],
      },
    ],
  },

  {
    slug: "its-pouch",
    client: "it's Pouch",
    tag: "eCommerce",
    year: "2025",
    accent: "teal",
    heroImage: "/work/its-pouch.jpg",
    heroImageAlt: "it's Pouch brand world",
    excerpt:
      "Shopify development and a considered email notification system for a lifestyle brand shipping a new line.",
    services: ["Shopify development", "Email design"],
    stack: ["Shopify", "Klaviyo"],
    timeline: "4 weeks",
    url: "https://itspouch.com",
    featured: true,
    categories: ["ecommerce"],
    body: [
      {
        type: "intro",
        text: "A focused build. Shopify development to support a new product line, plus a set of transactional and lifecycle emails designed to match the brand's tone end-to-end.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "build",
        num: "01",
        label: "The build",
        description:
          "Shopify work to ship the new range cleanly, and an email system that treats transactional moments as brand ones.",
      },
      {
        type: "section",
        eyebrow: "Scope",
        heading: "Ship and send, calmly",
        body: "Shopify work to launch the new range cleanly, and an email system that treats order confirmations, shipping updates, and post-purchase sequences as brand moments, not transactional afterthoughts.",
      },
      {
        type: "browser",
        src: "/work/its-pouch/storefront.jpg",
        alt: "it's Pouch storefront",
        url: "itspouch.com",
        phone: {
          src: "/work/its-pouch/mobile.jpg",
          alt: "it's Pouch on mobile",
        },
      },
      {
        type: "deliverables",
        heading: "Deliverables",
        items: [
          "Shopify development",
          "Transactional email design",
          "Lifecycle email setup",
        ],
      },
    ],
  },

  {
    slug: "origin-architectural",
    client: "Origin Architectural",
    tag: "eCommerce · AI",
    year: "2025",
    accent: "blue",
    heroImage: "/work/origin-architectural.webp",
    heroImageAlt: "Origin Architectural storefront",
    excerpt:
      "A Shopify replatform out of an over-developed WordPress site. Plus a live Smart Glazier integration and an AI image pipeline that turns customer install photos into uniform, brand-ready imagery.",
    services: [
      "Shopify replatform",
      "Smart Glazier integration",
      "AI image retouching",
    ],
    stack: ["Shopify", "Smart Glazier API"],
    timeline: "3 months",
    url: "https://originarchitectural.co.uk",
    featured: true,
    categories: ["ecommerce", "ai"],
    body: [
      {
        type: "intro",
        text: "Origin came to us with a WordPress site they couldn't change without a developer. Every edit was a ticket. Every ticket was hours. We moved them onto Shopify, wired in their trade software, and solved their imagery problem with a bit of AI.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "website",
        num: "01",
        label: "Website",
        description:
          "A Shopify replatform out of an over-developed WordPress maze. Every page editable in under a minute.",
      },
      {
        type: "section",
        eyebrow: "Out of WordPress, into Shopify",
        heading: "A platform the team can actually use",
        body: [
          "The previous WordPress build had been over-developed into a maze. Custom post types, nested blocks, shortcode tangles. Nothing could be edited without a developer on call.",
          "We replatformed onto Shopify with a lean theme and a clean content model. Every page editable in under a minute. Conversion rate lifted from day one.",
        ],
        phone: {
          src: "/work/origin-architectural/mobile.jpg",
          alt: "Origin Architectural on mobile",
          caption: "Mobile · product page",
        },
      },
      {
        type: "browser",
        src: "/work/origin-architectural/storefront.jpg",
        alt: "Origin Architectural storefront",
        url: "originarchitectural.co.uk",
      },
      {
        type: "statGroup",
        items: [
          { eyebrow: "Dev hours saved", value: "10+", label: "per month, from day one" },
          { eyebrow: "Conversion rate", value: "Up", label: "immediate lift after replatform" },
          { eyebrow: "Platform", value: "Shopify", label: "out of an over-developed WP maze" },
        ],
      },

      // ── Chapter 02 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "integration",
        num: "02",
        label: "Integration",
        description:
          "Smart Glazier, live and in sync. One source of truth across the trade operation and the storefront.",
      },
      {
        type: "section",
        eyebrow: "Integration",
        heading: "Smart Glazier, live and in sync",
        body: "Origin's trade operation runs on Smart Glazier. We built a proper integration. Product data, pricing, and availability flowing into Shopify without manual reconciliation. Fewer errors. Less admin. One source of truth.",
      },

      // ── Chapter 03 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "ai",
        num: "03",
        label: "AI",
        description:
          "An AI image pipeline that turns customer install photos into uniform, brand-ready imagery.",
      },
      {
        type: "section",
        eyebrow: "AI",
        heading: "Making customer photos look like a brand shoot",
        body: [
          "Most of Origin's imagery came from installers and customers. Phone shots taken in daylight, different angles, mixed quality. Unusable on the storefront as-is.",
          "We built an AI retouching pipeline that standardises angles, lighting, and backgrounds across the catalogue. The imagery now reads as one brand, from one camera, on one set.",
        ],
      },
      {
        type: "beforeAfter",
        before: {
          src: "/work/origin-architectural/customer-photo.jpg",
          alt: "Customer-shot install photo",
          label: "Customer shot",
        },
        after: {
          src: "/work/origin-architectural/ai-retouched.jpg",
          alt: "AI-retouched brand-ready image",
          label: "AI retouched",
        },
        aspect: "aspect-[16/10]",
        caption: "Drag the divider to compare",
      },
      {
        type: "deliverables",
        heading: "Deliverables",
        items: [
          "Shopify replatform",
          "Smart Glazier integration",
          "AI image retouching pipeline",
          "Design",
        ],
      },
    ],
  },

  {
    slug: "threadology",
    client: "Threadology",
    tag: "Fashion · WordPress",
    year: "2024",
    accent: "blue",
    heroImage: "/work/threadology.jpg",
    heroImageAlt: "Threadology storefront",
    excerpt:
      "A clean, mobile-first WordPress build. No custom CMS, no headless front-end. Just a site that earned out on day one and stayed out of the team's way.",
    services: ["WordPress", "Design"],
    stack: ["WordPress", "Block theme"],
    timeline: "6 weeks",
    url: "https://threadology.co.uk",
    featured: true,
    categories: ["wordpress"],
    body: [
      {
        type: "intro",
        text: "Not every project needs reinventing. Threadology needed a well-built WordPress site. Fast, mobile-first, easy to edit. We built exactly that.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "build",
        num: "01",
        label: "The build",
        description:
          "A clean WordPress site built to the same standard as our complex projects. Fast, mobile-first, editable by the team.",
      },
      {
        type: "section",
        eyebrow: "Approach",
        heading: "Simple, fast, maintainable",
        body: [
          "A block theme, a focused content model, and the same build standard we apply to our complex projects. Same speed target. Same SEO care. Same cleanliness under the hood.",
          "The team can update any page without calling us. Nothing fancy, which is the point.",
        ],
      },
      {
        type: "browser",
        src: "/work/threadology/storefront.jpg",
        alt: "Threadology storefront",
        url: "threadology.co.uk",
        phone: {
          src: "/work/threadology/mobile.jpg",
          alt: "Threadology on mobile",
        },
      },
      {
        type: "deliverables",
        heading: "Deliverables",
        items: [
          "WordPress build",
          "Block theme",
          "Content structure",
          "On-page SEO",
        ],
      },
    ],
  },

  // --- More work ---

  {
    slug: "fandp-agency",
    client: "F&P Agency",
    tag: "Property · WordPress",
    year: "2026",
    accent: "violet",
    heroImage: "/work/fandpagency.jpg",
    heroImageAlt: "F&P Agency website",
    excerpt:
      "A WordPress redesign taking F&P Agency from a standard estate-agency site into a more upmarket, luxury-aligned digital presence, on brief with their rebrand.",
    services: ["WordPress redesign", "Brand alignment"],
    stack: ["WordPress"],
    timeline: "12 weeks",
    url: "https://fandpagency.com",
    categories: ["wordpress"],
    body: [
      {
        type: "intro",
        text: "F&P Agency were rebranding upmarket, repositioning the business toward the luxury end of the estate-agency market. The old website told the old story. We rebuilt it to match the new one.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "build",
        num: "01",
        label: "The rebuild",
        description:
          "A restrained WordPress site that reads upmarket without reaching for the luxury-property formula.",
      },
      {
        type: "section",
        eyebrow: "The rebuild",
        heading: "Luxury, done without cliché",
        body: [
          "Most luxury property sites reach for the same formula. Big hero video, thin serif, the word 'bespoke' three times before the fold. F&P wanted something more considered.",
          "We built a restrained WordPress site around generous typography, real property imagery, and a quieter pacing that reads confident rather than loud. The brand's upmarket ambition is reinforced by how the site behaves, not what it shouts.",
        ],
      },
      {
        type: "browser",
        src: "/work/fandp-agency/storefront.jpg",
        alt: "F&P Agency site",
        url: "fandpagency.com",
        phone: {
          src: "/work/fandp-agency/mobile.jpg",
          alt: "F&P Agency on mobile",
        },
      },
      {
        type: "deliverables",
        heading: "Deliverables",
        items: [
          "WordPress redesign",
          "Information architecture",
          "Brand implementation",
          "Property listings integration",
        ],
      },
    ],
  },

  {
    slug: "little-muddy-boots",
    client: "Little Muddy Boots",
    tag: "WordPress",
    year: "2025",
    accent: "teal",
    heroImage: "/work/little-muddy-boots.jpg",
    heroImageAlt: "Little Muddy Boots booking site",
    excerpt:
      "A WordPress redesign lifting a self-built site into a professional, mobile-first booking experience with a custom postcode-search tool.",
    services: ["WordPress redesign", "Custom postcode search"],
    stack: ["WordPress"],
    timeline: "5 weeks",
    url: "https://littlemuddyboots.co.uk",
    categories: ["wordpress"],
    body: [
      {
        type: "intro",
        text: "The original site was self-designed and doing its best, but a service business needs a site that earns trust before the user reads a single word. We rebuilt it properly.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "build",
        num: "01",
        label: "The build",
        description:
          "A professional, mobile-first booking site, with a custom postcode-search tool so visitors know instantly whether the service covers their area.",
      },
      {
        type: "section",
        eyebrow: "Scope",
        heading: "Professional, mobile-first, bookable",
        body: "A full redesign focused on mobile, clearer information architecture, and a booking flow that doesn't make the visitor think. We also built a custom postcode-search tool so visitors instantly know whether the service covers their area.",
      },
      {
        type: "browser",
        src: "/work/little-muddy-boots/storefront.jpg",
        alt: "Little Muddy Boots site",
        url: "littlemuddyboots.co.uk",
        phone: {
          src: "/work/little-muddy-boots/mobile.jpg",
          alt: "Little Muddy Boots on mobile",
        },
      },
      {
        type: "deliverables",
        heading: "Deliverables",
        items: [
          "WordPress redesign",
          "Mobile-first UX",
          "Custom postcode search tool",
          "Bookable IA",
        ],
      },
    ],
  },

  {
    slug: "space-4-u-self-storage",
    client: "Space 4 U Self Storage",
    tag: "WordPress",
    year: "2025",
    accent: "blue",
    heroImage: "/work/space4u.jpg",
    heroImageAlt: "Space 4 U Self Storage",
    excerpt:
      "A WordPress redesign for a regional self-storage operator. Clarity, speed, and a direct path from visitor to unit enquiry.",
    services: ["WordPress redesign"],
    stack: ["WordPress"],
    timeline: "4 weeks",
    url: "https://space4uselfstorage.co.uk",
    categories: ["wordpress"],
    body: [
      {
        type: "intro",
        text: "Self-storage is a simple product, often sold badly online. The site's job is to close quickly: what, how much, how do I get one? We rebuilt the site around that.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "build",
        num: "01",
        label: "The build",
        description:
          "A clear, fast WordPress site focused on the three things a storage customer actually needs: sizes, pricing, and an easy enquiry.",
      },
      {
        type: "section",
        eyebrow: "Scope",
        heading: "Clarity first",
        body: "A WordPress redesign focused on the three things a storage customer actually needs: unit sizes, transparent pricing, and an easy way to enquire. Built fast, editable by the team.",
      },
      {
        type: "browser",
        src: "/work/space-4-u-self-storage/storefront.jpg",
        alt: "Space 4 U site",
        url: "space4uselfstorage.co.uk",
        phone: {
          src: "/work/space-4-u-self-storage/mobile.jpg",
          alt: "Space 4 U on mobile",
        },
      },
      {
        type: "deliverables",
        heading: "Deliverables",
        items: [
          "WordPress redesign",
          "Information architecture",
          "Mobile-first build",
        ],
      },
    ],
  },

  {
    slug: "paragon-freight",
    client: "Paragon Freight",
    tag: "WordPress · Social",
    year: "2025 to present",
    accent: "violet",
    heroImage: "/work/paragon-freight.jpg",
    heroImageAlt: "Paragon Freight",
    excerpt:
      "A WordPress redesign for a freight business, plus ongoing social-media management to match the upgrade online.",
    services: ["WordPress redesign", "Currency selector", "Social media management"],
    stack: ["WordPress"],
    timeline: "8 weeks + retainer",
    url: "https://paragonfreight.com",
    categories: ["wordpress"],
    body: [
      {
        type: "intro",
        text: "Logistics sell on trust. Paragon Freight needed a site that looked the part, and a social presence that reinforced it between visits.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "website",
        num: "01",
        label: "Website",
        description:
          "A WordPress redesign around credibility, service depth, and clear enquiry routes.",
      },
      {
        type: "section",
        eyebrow: "Scope",
        heading: "Site that looks the part",
        body: "We redesigned the WordPress site around credibility, service depth, and clear enquiry routes. Built fast, editable in-house.",
        phone: {
          src: "/work/paragon-freight/mobile.jpg",
          alt: "Paragon Freight on mobile",
          caption: "Mobile · homepage",
        },
      },
      {
        type: "browser",
        src: "/work/paragon-freight/storefront.jpg",
        alt: "Paragon Freight site",
        url: "paragonfreight.com",
      },
      {
        type: "section",
        eyebrow: "Global audience",
        heading: "A currency selector, baked in",
        body: "Paragon's enquiries come in from operators across the EU, the Middle East, and North America. We wired in a clean currency selector so visitors see rates and quotes in their own terms from the first click, no hops, no friction at the point of interest.",
      },

      // ── Chapter 02 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "social",
        num: "02",
        label: "Social",
        description:
          "Ongoing social-media management to keep the brand front-of-mind between project enquiries.",
      },
      {
        type: "section",
        eyebrow: "Retainer",
        heading: "Front-of-mind between visits",
        body: "Ongoing social management to match the upgrade online. Brand consistency across site and feed, kept warm week to week.",
      },
      {
        type: "browser",
        src: "/work/paragon-freight/linkedin.jpg",
        alt: "Paragon Freight LinkedIn post",
        url: "linkedin.com/company/paragon-freight",
        aspect: "aspect-[4/3]",
        caption: "Campaign post · LinkedIn",
      },
      {
        type: "deliverables",
        heading: "Deliverables",
        items: [
          "WordPress redesign",
          "Multi-currency selector",
          "Ongoing social media management",
        ],
      },
    ],
  },

];

export function getCaseBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export function getFeaturedCases(): CaseStudy[] {
  return caseStudies.filter((c) => c.featured);
}

export function getMoreCases(): CaseStudy[] {
  return caseStudies.filter((c) => !c.featured);
}

export function getNextCase(slug: string): CaseStudy | undefined {
  const i = caseStudies.findIndex((c) => c.slug === slug);
  if (i === -1) return undefined;
  return caseStudies[(i + 1) % caseStudies.length];
}
