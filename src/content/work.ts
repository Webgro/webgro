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
  | {
      /** Side-by-side comparison for tall (portrait) page screenshots.
       *  No drag slider; both images stay on screen with prominent
       *  BEFORE / AFTER badges so the comparison is unambiguous. */
      type: "beforeAfterStacked";
      before: { src: string; alt: string };
      after: { src: string; alt: string };
      caption?: string;
    }
  | { type: "gallery"; images: Array<{ src: string; alt: string; aspect?: string }> }
  | { type: "quote"; text: string; attribution?: string }
  | {
      type: "lighthouseScores";
      caption?: string;
      scores: Array<{ label: string; before: number; after: number }>;
    }
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
      "A rebrand and a new Shopify theme built from scratch for a business that ships thousands of phone cases a week. The work covered the logo, tone of voice, website, social templates and email, plus a custom product personaliser that replaced an app costing nearly £5,000 a year.",
    services: [
      "Rebrand",
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
        text: "Fun Cases ship thousands of phone cases a week from a catalogue of over 20,000 designs, and we've run their eCommerce since 2012, before we were called Webgro. The most recent project was a full rebrand and a new Shopify theme built from scratch, including a custom product personaliser that replaced a paid third-party app. Revenue is up 300% over the last five years.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "website",
        num: "01",
        label: "Rebrand & Website",
        description:
          "A full rebrand (logo, tone of voice, social, email) and a new Shopify theme built from scratch, with a custom personaliser that replaced a £5,000-a-year app.",
      },
      {
        type: "section",
        eyebrow: "The rebrand",
        heading: "A new brand across every channel",
        body: [
          "Fun Cases had outgrown its old look. We rebuilt the brand starting with the logo: a bold pop-art identity, a new tone of voice, and a design system of rounded blocks, ink outlines and a colour palette chosen to feel fun. Some things stayed the same, including the promise that every order plants a tree.",
          "The website, social templates and a new email marketing system in Klaviyo all launched at the same time, so every channel moved to the new brand together.",
        ],
        phone: {
          src: "/work/fun-cases/mobile-home.jpg",
          alt: "Fun Cases homepage in the new brand on mobile",
          caption: "Mobile · the new brand",
        },
      },
      {
        type: "section",
        eyebrow: "The theme",
        heading: "A new theme for a 20,000-product catalogue",
        body: [
          "We built the new theme from scratch around how people shop for phone cases. It has a mega menu with trending collections and products, predictive search, a native wishlist, and a slide-out cart that shows progress towards free shipping and a free gift.",
          "Every section can be edited in the theme editor and the colour palette is a theme setting, so the in-house team can restyle or rearrange pages without a developer.",
        ],
      },
      {
        type: "browser",
        src: "/work/fun-cases/desktop-megamenu.jpg",
        alt: "Fun Cases mega menu with trending collections and products",
        url: "funcases.com",
      },
      {
        type: "section",
        eyebrow: "Phone model selector",
        heading: "Choose your phone model once",
        body: [
          "With 20,000 designs, customers shouldn't have to check compatibility on every product. The site asks for their phone model once and remembers it. From then on, every product image in collections, search results and product pages shows the case on that exact phone.",
          "This removes the biggest source of doubt when buying a phone case: whether the design the customer likes will fit the phone they own.",
        ],
      },
      {
        type: "section",
        eyebrow: "The personaliser",
        heading: "A custom case designer built into the theme",
        body: [
          "Custom cases are a large part of the business. The previous design tool was a third-party app costing nearly £5,000 a year. We replaced it with our own full-screen editor, built into the theme, where customers add photos, text and stickers to a live mockup of their exact phone and case type.",
          "The editor adds a print-ready file to the order, so the studio prints exactly what the customer approved. There's no monthly fee or third-party checkout script, and Fun Cases own the tool outright.",
        ],
        phone: {
          src: "/work/fun-cases/mobile-personaliser.jpg",
          alt: "Fun Cases personaliser editor on mobile",
          caption: "Mobile · the personaliser",
        },
      },
      {
        type: "statGroup",
        items: [
          { eyebrow: "App cost saved", value: "£5k", label: "per year" },
          { eyebrow: "Revenue growth", value: "+300%", label: "over 5 years" },
          { eyebrow: "Average conversion rate", value: "6.0%", label: "worldwide" },
          { eyebrow: "Peak conversion rate", value: "11.2%", label: "best day, Dec 2025" },
        ],
      },
      {
        type: "browser",
        src: "/work/fun-cases/desktop-pdp.jpg",
        alt: "Fun Cases product page with phone model and case type selectors",
        url: "funcases.com",
      },
      {
        type: "browser",
        src: "/work/fun-cases/live-collection.jpg",
        alt: "Fun Cases phone case collection page",
        url: "funcases.com/collections/phone-cases",
        caption: "A collection page, with filters for design and phone model.",
        phone: {
          src: "/work/fun-cases/live-mobile-product.jpg",
          alt: "Fun Cases design-your-own product page on a phone",
        },
      },

      // ── Chapter 02 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "marketing",
        num: "02",
        label: "Marketing & SEO",
        description:
          "Paid search, paid social, email and organic search, built on technical SEO that Google and LLMs can read easily.",
      },
      {
        type: "section",
        eyebrow: "SEO",
        heading: "Ranked #1 for 'Phone Cases'",
        body: [
          "We built SEO into the rebuild from the start: content architecture, internal linking, technical foundations, and a content programme tied to the merchandising calendar.",
          "Fun Cases have since reached #1 on Google UK for 'Phone Cases', one of the most competitive category terms in the market.",
        ],
      },
      {
        type: "statGroup",
        items: [
          { eyebrow: "Revenue from email", value: "30%", label: "of total revenue" },
          { eyebrow: "Monthly paid spend", value: "£35k", label: "across Google and Meta" },
          { eyebrow: "Blended ROAS", value: "8+", label: "sustained" },
        ],
      },
      {
        type: "section",
        eyebrow: "Email marketing",
        heading: "Over 30% of revenue from email",
        body: [
          "Email brings in more for its cost than any other channel Fun Cases use. We run lifecycle flows in Klaviyo, design campaigns around the product drop calendar, and segment customers on what they do rather than on vanity fields.",
          "Over 30% of total revenue now comes through email, and that revenue doesn't depend on extra ad spend.",
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
        heading: "£35k a month on Google and Meta",
        body: [
          "We run paid media on Google and Meta, with combined spend of around £35,000 a month and blended ROAS consistently above 8. Search, Shopping, Performance Max and paid social campaigns are all optimised against product margins rather than top-line revenue alone.",
          "We manage the spend week to week as the catalogue grows.",
        ],
      },

      // ── Chapter 03 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "apps",
        num: "03",
        label: "Custom Apps",
        description:
          "Three AI tools in daily use, a custom Stock System, and an order-routing app that sends orders to the print floor, all built around how Fun Cases work.",
      },
      {
        type: "section",
        eyebrow: "Order routing",
        heading: "Automatic order routing",
        body: [
          "Fun Cases invested in automatic printing machines, but not every order can go to them. It depends on the phone model and case type the customer chose.",
          "We built a routing app that checks every order as it comes in. Orders the machines can handle go straight to the automatic printers with no manual step, and the rest are queued for manual printing in-house. On the automatic route, an order can be placed and printed within two minutes.",
        ],
      },
      {
        type: "uiMock",
        name: "fun-cases-order-routing",
        caption: "Order routing · live product view",
      },
      {
        type: "statGroup",
        items: [
          { eyebrow: "Order to print", value: "2 min", label: "on the automatic route" },
          { eyebrow: "Routing decisions", value: "Every order", label: "made automatically" },
          { eyebrow: "Customer service hours", value: "−70%", label: "with AI triage" },
        ],
      },
      {
        type: "section",
        heading: "AI customer service",
        body: "AI triages and summarises every incoming ticket and drafts a reply. A member of the team then reviews, edits and sends it. Customer service hours are down 70% and customer satisfaction has improved. Replies stay in the brand's tone because a person signs off each one.",
      },
      {
        type: "uiMock",
        name: "fun-cases-ai-customer-service",
        caption: "AI support queue · live product view",
      },
      {
        type: "section",
        heading: "AI product generator",
        body: "Staff enter a design and a collection title, and the tool generates and publishes a full range (Phone Cases, Laptop Sleeves, Lunchboxes, Keyrings, Posters) in under ten minutes, including mockups, SKUs, variants, imagery and copy. Creating a range used to take the merchandising team a day.",
      },
      {
        type: "uiMock",
        name: "fun-cases-ai-product-generator",
        caption: "Product generator · design input to 5-product range",
      },
      {
        type: "section",
        heading: "AI image generator",
        body: "Staff upload a product mockup and get back lifestyle images for Instagram in two clicks, with models, settings and different angles. The images can go straight to social without booking a photographer.",
      },
      {
        type: "uiMock",
        name: "fun-cases-ai-image-generator",
        caption: "Image generator · mockup to lifestyle variants",
      },
      {
        type: "section",
        eyebrow: "Stock System",
        heading: "A custom warehouse management system",
        body: [
          "Off-the-shelf warehouse management software was either too big or too limited for Fun Cases, so we built a custom WMS for their operation. It connects directly to Shopify, shows live stock without any middleware, and the client owns it outright.",
          "The system also includes a productivity tracker for the pick-and-pack team, AI restock and fulfilment recommendations, and a set of smaller tools we build as the ops team ask for them. We keep adding to it.",
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
          "Full rebrand (logo, tone of voice, design system)",
          "Custom Shopify theme (built from scratch)",
          "Product personaliser (app replaced, £5k/yr saved)",
          "Phone model selector (remembered across the site)",
          "Native wishlist",
          "Social and email templates",
          "Order routing app (automatic print or in-house)",
          "Custom WMS with Shopify integration",
          "AI customer service agent",
          "AI product generator",
          "AI lifestyle image generator",
          "SEO programme",
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
    year: "2023 to present",
    accent: "violet",
    heroImage: "/work/gieves-hawkes.webp",
    heroImageAlt: "Gieves & Hawkes website",
    excerpt:
      "Our second Shopify build from scratch for the Savile Row house. Custom theme sections replaced eight third-party apps, mobile Lighthouse went from 64 to 85, and the app bill dropped by £300 a month.",
    services: ["Shopify build", "eCommerce consultancy", "SEO", "Email marketing"],
    stack: ["Shopify", "Custom theme", "SimplyBookMe API"],
    timeline: "Ongoing partnership",
    url: "https://gievesandhawkes.com",
    featured: true,
    categories: ["ecommerce"],
    body: [
      {
        type: "intro",
        text: "Gieves & Hawkes have tailored for British royalty since 1771. We've worked with them since 2023 and run the brand's eCommerce. We built their first Shopify store after the Frasers takeover, launched in 2024, and rebuilt it from scratch in 2026.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "website",
        num: "01",
        label: "Website",
        description:
          "Our second Shopify build from scratch. Custom sections replaced eight third-party apps, mobile Lighthouse went from 64 to 85, and the in-house team now have a theme they fully control.",
      },
      {
        type: "section",
        eyebrow: "The brief",
        heading: "A theme the in-house team can manage",
        body: [
          "The first store we built for them launched in 2024. By the time we started the rebuild, it relied on twelve apps for predictive search, wishlists, size guides, bundles, back-in-stock alerts and other features. Each one added a monthly fee and a render-blocking script, and could break when its developer pushed an update.",
          "The brief was to rebuild the theme from scratch, move every app's function into the theme itself, and make every section editable so the in-house team could add to the site without a developer. Mobile performance also had to improve. The build took two months.",
        ],
      },
      {
        type: "section",
        eyebrow: "What we rebuilt",
        heading: "Eight apps replaced with theme code",
        body: [
          "We built predictive search, size guides, wishlists that sync to Klaviyo, bundle merchandising and back-in-stock alerts directly into the theme. None of them rely on third-party scripts or app fees now. Features that used to cost £300 a month are part of a codebase Gieves own.",
          "The made-to-measure booking flow is the one exception. We connected SimplyBookMe through its API so MTM appointments go into the calendar the team already use. SimplyBookMe handles the booking logic, and the booking screens are part of the theme.",
        ],
      },
      {
        type: "statGroup",
        items: [
          {
            eyebrow: "Mobile Lighthouse",
            value: "+21",
            label: "from 64 to 85",
            footnote: "Average of the homepage, collection pages and product pages.",
          },
          {
            eyebrow: "Shopify apps removed",
            value: "8",
            label: "12 down to 4",
            footnote: "Replaced with sections built into the theme.",
          },
          {
            eyebrow: "App costs saved",
            value: "£300",
            label: "per month",
          },
          {
            eyebrow: "Build time",
            value: "2 mo",
            label: "start to finish",
          },
        ],
      },
      {
        type: "browser",
        src: "/work/gieves-and-hawkes/storefront.jpg",
        alt: "Gieves & Hawkes storefront",
        url: "gievesandhawkes.com",
      },
      {
        type: "browser",
        src: "/work/gieves-and-hawkes/live-collection.jpg",
        alt: "Gieves & Hawkes AW26 collection page",
        url: "gievesandhawkes.com/collections/aw26-collection",
        caption: "The AW26 collection page.",
        phone: {
          src: "/work/gieves-and-hawkes/live-mobile-product.jpg",
          alt: "Gieves & Hawkes product page on a phone",
        },
      },
      {
        type: "browser",
        src: "/work/gieves-and-hawkes/live-product.jpg",
        alt: "Gieves & Hawkes product page for the Newton Donegal lambswool suit",
        url: "gievesandhawkes.com/products/newton-donegal-lambswool-suit-brown",
        caption: "A product page, with separate jacket and trouser sizing.",
      },
      {
        type: "section",
        eyebrow: "Other page templates",
        heading: "Bespoke, made to measure, journal, heritage",
        body: [
          "The product catalogue is only part of what Gieves sell. Bespoke suits, fittings at the Savile Row showroom, and a journal covering two and a half centuries of tailoring each needed their own page template rather than a reworked product page.",
          "The new theme includes five more template families: bespoke, made to measure, journal, a heritage page with the brand's full timeline, and the showroom locator. They use the same design system as the rest of the theme, with layouts suited to their content.",
        ],
        phone: {
          src: "/work/gieves-and-hawkes/mobile.jpg",
          alt: "Gieves & Hawkes new theme on mobile",
          caption: "Mobile · the new build",
        },
      },
      {
        type: "section",
        eyebrow: "Design",
        heading: "Every section designed individually",
        body: [
          "We designed every section of the site individually, including the product page, rather than using the standard Shopify components that come with most themes.",
          "The design uses restrained typography, plenty of whitespace and motion used sparingly, applied consistently across every page template, block and state.",
        ],
      },

      // ── Chapter 02 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "marketing",
        num: "02",
        label: "Marketing & SEO",
        description:
          "Technical SEO and a content programme that took the brand to #1 on Google UK for 'luxury suit'. Organic traffic has grown month on month.",
      },
      {
        type: "section",
        eyebrow: "SEO",
        heading: "#1 on Google UK for 'luxury suit'",
        body: "We worked on content, site structure, links and technical SEO so the site is easy for both Google and LLMs to read. Within months, Gieves ranked #1 in the UK for 'luxury suit', and organic traffic has kept growing since.",
        phone: {
          src: "/work/gieves-and-hawkes/mobile-2.jpg",
          alt: "Gieves & Hawkes product view on mobile",
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
          "Ongoing strategy, platform advice and hands-on delivery, working alongside the in-house team week to week.",
      },
      {
        type: "section",
        eyebrow: "Ongoing partnership",
        heading: "Working with the in-house team",
        body: [
          "We fill the gaps in the Gieves in-house team. That covers strategic decisions, specialist one-off projects, and growth work that sits outside the day-to-day but still needs senior eCommerce input.",
          "The scope changes with what the in-house team is working on. For bigger decisions we help with strategy, platform choices and growth planning, and when the scope widens we take on the delivery ourselves. For some projects we bring in marketing, design and development specialists from a vetted network. Gieves keep the same point of contact throughout.",
        ],
      },
      {
        type: "deliverables",
        heading: "Deliverables",
        items: [
          "Shopify build",
          "Custom theme (second full rebuild)",
          "Eight custom theme sections replacing apps",
          "SimplyBookMe API integration for MTM",
          "Heritage, bespoke, MTM, journal, showroom templates",
          "Performance and accessibility improvements",
          "Ongoing eCommerce consultancy",
          "SEO programme",
          "Email marketing",
          "Growth planning",
        ],
      },
    ],
  },

  {
    slug: "valuepet",
    client: "ValuePet",
    tag: "eCommerce · Pet retail",
    year: "2026",
    accent: "blue",
    heroImage: "/work/valuepet.jpg",
    heroImageAlt: "A dog and a cat asleep together on a sofa",
    excerpt:
      "A Shopify redesign for one of Ireland's biggest pet retailers, with a Pet Hub that personalises the shop to each customer's pets and a custom app that keeps stock in sync between two stores. Average order value rose from €42.51 to €69.03 in the week after launch.",
    services: ["Shopify redesign", "Custom app", "Email marketing"],
    stack: ["Shopify", "Custom app", "Klaviyo"],
    timeline: "8 weeks",
    url: "https://valuepet.ie",
    categories: ["ecommerce"],
    body: [
      {
        type: "intro",
        text: "ValuePet have been selling pet food and supplies in Ireland since 1993. We redesigned their Shopify store in 2026, added a Pet Hub that tailors the shop to each customer's pets, and built an app that keeps stock in sync with their second Shopify store. We've since taken over their email marketing too.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "website",
        num: "01",
        label: "Website",
        description:
          "A Shopify redesign launched in eight weeks, with personalisation built around the customer's own pets.",
      },
      {
        type: "section",
        eyebrow: "Redesign",
        heading: "A new Shopify store in eight weeks",
        body: [
          "We redesigned the whole store, from the homepage and navigation through to collection and product pages, and launched it eight weeks after starting.",
        ],
      },
      {
        type: "browser",
        src: "/work/valuepet/storefront.jpg",
        alt: "ValuePet homepage",
        url: "valuepet.ie",
        phone: {
          src: "/work/valuepet/mobile.jpg",
          alt: "ValuePet homepage on a phone, with a personalised search bar",
        },
      },
      {
        type: "browser",
        src: "/work/valuepet/live-product.jpg",
        alt: "ValuePet product page",
        url: "valuepet.ie/products/hills-science-plan-mature-adult-light-dry-cat-food-1-5kg-chicken",
        caption: "A product page.",
        phone: {
          src: "/work/valuepet/live-mobile-product.jpg",
          alt: "ValuePet product page on a phone",
        },
      },
      {
        type: "section",
        eyebrow: "Pet Hub",
        heading: "A shop that knows your pets",
        body: [
          "Customers can add their pets to their account, with each pet's type, breed and age. The store uses those details to personalise what they see.",
          "The search bar asks what their pet needs by name, headings change to match, and product recommendations are chosen for each pet's type and life stage.",
        ],
      },
      {
        type: "browser",
        src: "/work/valuepet/live-home-scroll.jpg",
        alt: "ValuePet homepage product rows and the Pet Hub prompt",
        url: "valuepet.ie",
        caption: "The homepage, with the Pet Hub prompt in the corner.",
      },
      {
        type: "section",
        eyebrow: "Custom app",
        heading: "Stock kept in sync between two stores",
        body: [
          "ValuePet run two Shopify stores. We built a custom app that links them, so stock levels stay in sync between the two automatically, without anyone updating them by hand.",
        ],
      },

      // ── Chapter 02 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "email",
        num: "02",
        label: "Email marketing",
        description: "We now run ValuePet's email marketing in Klaviyo.",
      },
      {
        type: "section",
        eyebrow: "Klaviyo",
        heading: "Email marketing on Klaviyo",
        body: [
          "After launch we took over ValuePet's email marketing, which we run in Klaviyo.",
        ],
      },
      {
        type: "statGroup",
        items: [
          { eyebrow: "Week before launch", value: "€42.51", label: "average order value" },
          { eyebrow: "Week after launch", value: "€69.03", label: "average order value" },
          { eyebrow: "Change", value: "+62%", label: "in average order value" },
          { eyebrow: "Timescale", value: "8 weeks", label: "from start to launch" },
        ],
      },
      {
        type: "deliverables",
        heading: "Deliverables",
        items: [
          "Shopify redesign",
          "Pet Hub personalisation",
          "Custom stock sync app between two Shopify stores",
          "Klaviyo email marketing",
        ],
      },
    ],
  },

  {
    slug: "architectural-fx",
    client: "Architectural FX",
    tag: "WordPress · Lighting",
    year: "2026",
    accent: "teal",
    heroImage: "/work/architectural-fx.jpg",
    heroImageAlt: "A curved white room lit by warm LED strip lighting along the floor and walls",
    excerpt:
      "A custom WordPress plugin for Architectural FX, a lighting distributor in Wokingham. Products are published from the team's Google Sheet, and the new products page has live filters and a configurator that produces spec sheets.",
    services: ["WordPress development", "Custom plugin", "Google Sheets integration"],
    stack: ["WordPress", "Custom plugin", "Google Apps Script"],
    timeline: "Launched June 2026",
    url: "https://architecturalfx.co.uk",
    categories: ["wordpress"],
    body: [
      {
        type: "intro",
        text: "Architectural FX supply premium LED lighting to architects, lighting designers and specifiers from their office in Wokingham. We rebuilt how their WordPress site handles products. The catalogue now comes from the Google Sheet the team already use, and the products page, product pages and configurator are new.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "catalogue",
        num: "01",
        label: "Catalogue",
        description:
          "A custom WordPress plugin that publishes products from the team's Google Sheet.",
      },
      {
        type: "section",
        eyebrow: "The starting point",
        heading: "The old setup",
        body: [
          "Product data lived in a Google Sheet. To change a product, the team emailed the sheet to us and waited for an import to run, so small edits cost time and money.",
          "The site ran on WooCommerce, with a catalogue-mode plugin and a separate plugin for the product configurator. When we reviewed it in May 2026, the products page took more than six seconds to load.",
        ],
      },
      {
        type: "section",
        eyebrow: "Google Sheet",
        heading: "Publishing from the sheet",
        body: [
          "We added an Architectural FX menu to the Google Sheet. When the team have made their changes, they publish from that menu and an Apps Script sends the update to the website.",
          "Each update is signed, so the site only accepts changes that come from the sheet.",
        ],
      },
      {
        type: "section",
        eyebrow: "Custom plugin",
        heading: "One plugin in place of three",
        body: [
          "We wrote a WordPress plugin that holds the catalogue and runs the products page, the product pages and the configurator. It replaced WooCommerce, the catalogue-mode plugin and the old configurator plugin.",
          "The site went live on the new plugin on 25 June 2026.",
        ],
      },
      {
        type: "browser",
        src: "/work/architectural-fx/storefront.jpg",
        alt: "Architectural FX homepage",
        url: "architecturalfx.co.uk",
        phone: {
          src: "/work/architectural-fx/mobile.jpg",
          alt: "Architectural FX homepage on a phone",
        },
      },
      {
        type: "section",
        eyebrow: "Drawings",
        heading: "DWG files moved into WordPress",
        body: [
          "The CAD drawings for the products were stored in an Amazon S3 bucket. We moved all 128 DWG files into the WordPress media library and mapped each product to its new file.",
          "We also scanned the media library for files that nothing on the site uses, and listed them for review.",
        ],
      },

      // ── Chapter 02 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "products",
        num: "02",
        label: "Products",
        description:
          "A new products page, new product pages and a configurator that produces spec sheets.",
      },
      {
        type: "section",
        eyebrow: "Catalogue",
        heading: "The products page",
        body: [
          "The products page loads the catalogue from the plugin and filters it in the browser, without reloading the page.",
          "Visitors can search by name or SKU and narrow the list by application, colour, colour temperature, wattage, lumens, CRI, IP rating, mounting and optic.",
        ],
      },
      {
        type: "browser",
        src: "/work/architectural-fx/live-products.jpg",
        alt: "Architectural FX products page with search and filters",
        url: "architecturalfx.co.uk/products",
        caption: "The products page, with search and filters.",
        phone: {
          src: "/work/architectural-fx/live-mobile-products.jpg",
          alt: "Architectural FX products page on a phone",
        },
      },
      {
        type: "section",
        eyebrow: "Product pages",
        heading: "Specifications and downloads",
        body: [
          "Each product page lists the main specifications, such as dimensions, lifetime, wattage range, LED types and IP rating. It also has downloads for the photometric data, the DWG file and the technical drawing.",
        ],
      },
      {
        type: "browser",
        src: "/work/architectural-fx/live-product.jpg",
        alt: "Architectural FX product page for Integrate 2, with specifications and downloads",
        url: "architecturalfx.co.uk/product/integrate-2",
        caption: "A product page.",
        phone: {
          src: "/work/architectural-fx/live-mobile-product.jpg",
          alt: "Architectural FX product page on a phone",
        },
      },
      {
        type: "section",
        eyebrow: "Configurator",
        heading: "Spec sheets from the configurator",
        body: [
          "Specifiers pick the LED type, colour temperature and other options, add their project details and download a spec sheet as a PDF. A second button asks the Architectural FX team for help or a quote.",
        ],
      },
      {
        type: "browser",
        src: "/work/architectural-fx/live-configurator.jpg",
        alt: "Architectural FX configurator for Integrate 2, with LED type options and a spec sheet download",
        url: "architecturalfx.co.uk/product/integrate-2",
        caption: "The configurator on a product page.",
      },
      {
        type: "section",
        eyebrow: "Navigation",
        heading: "Menu and search",
        body: [
          "The products menu lists the brands and applications, with the number of products in each application. Site search takes visitors to the products page with their search already applied.",
        ],
      },
      {
        type: "statGroup",
        items: [
          { eyebrow: "Plugins", value: "3", label: "replaced by one custom plugin" },
          { eyebrow: "Drawings", value: "128", label: "DWG files moved from Amazon S3 into WordPress" },
          { eyebrow: "Filters", value: "9", label: "ways to narrow the catalogue" },
        ],
      },
      {
        type: "deliverables",
        heading: "Deliverables",
        items: [
          "Custom WordPress catalogue plugin",
          "Google Sheet publishing with Apps Script",
          "Products page with search and filters",
          "Product page template",
          "Configurator with PDF spec sheets",
          "DWG migration from Amazon S3",
          "Media library audit",
        ],
      },
    ],
  },

  {
    slug: "anyprint",
    client: "ANYPRINT",
    tag: "WordPress · Performance",
    year: "2026",
    accent: "violet",
    heroImage: "/work/anyprint.webp",
    heroImageAlt: "ANYPRINT homepage",
    excerpt:
      "A WordPress redesign and rebuild with page speed as the main requirement. Lighthouse Performance went from 54 to 99, and Accessibility, Best Practices and SEO all went to 100.",
    services: [
      "WordPress",
      "Performance",
      "Accessibility",
      "SEO programme",
    ],
    stack: ["WordPress", "Custom theme"],
    timeline: "Rebuild, then ongoing",
    url: "https://any-print.co.uk",
    featured: true,
    categories: ["wordpress"],
    body: [
      {
        type: "intro",
        text: "ANYPRINT's WordPress site was slow, relied on too many plugins, and had an admin panel the team found awkward to use. We rebuilt it with page speed as the main requirement.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "rebuild",
        num: "01",
        label: "Rebuild",
        description:
          "A clean WordPress build designed around page speed. Lighthouse Performance went from 54 to 99.",
      },
      {
        type: "section",
        eyebrow: "The starting point",
        heading: "The old site",
        body: "The old site had been built up over years of small changes. It had a heavy theme, a lot of plugins and render-blocking scripts throughout. The brief was to rebuild it, keeping what worked and fixing what didn't.",
      },
      {
        type: "beforeAfterStacked",
        before: {
          src: "/work/anyprint/before.jpg",
          alt: "ANYPRINT site before the rebuild, full page screenshot",
        },
        after: {
          src: "/work/anyprint/after.jpg",
          alt: "ANYPRINT site after the rebuild, full page screenshot",
        },
        caption: "Full page screenshots before and after the rebuild.",
      },
      {
        type: "section",
        eyebrow: "Page speed",
        heading: "Built for page speed",
        body: "We checked every decision on this build against its effect on page speed. We used a custom theme instead of a page builder, kept image sizes under strict control, used WordPress as a clean publishing tool, kept plugins to a minimum, and only added third-party scripts where they were needed. The site loads fast on mobile and scores close to full marks in Lighthouse.",
      },
      {
        type: "lighthouseScores",
        caption: "Lighthouse scores, mobile, simulated 4G. Old site on the left, new site on the right.",
        scores: [
          { label: "Performance",   before: 54, after: 99 },
          { label: "Accessibility", before: 91, after: 100 },
          { label: "Best Practices", before: 90, after: 100 },
          { label: "SEO",            before: 75, after: 100 },
        ],
      },
      {
        type: "browser",
        src: "/work/anyprint/storefront.jpg",
        alt: "ANYPRINT homepage after the rebuild",
        url: "any-print.co.uk",
        phone: {
          src: "/work/anyprint/mobile.jpg",
          alt: "ANYPRINT on mobile",
        },
      },
      {
        type: "browser",
        src: "/work/anyprint/live-categories.jpg",
        alt: "ANYPRINT homepage product categories",
        url: "any-print.co.uk",
        caption: "Product categories on the homepage.",
        phone: {
          src: "/work/anyprint/live-mobile-home.jpg",
          alt: "ANYPRINT homepage on a phone",
        },
      },
      {
        type: "browser",
        src: "/work/anyprint/live-product.jpg",
        alt: "ANYPRINT standard business cards product page",
        url: "any-print.co.uk/business-cards/standard",
        caption: "A product page, with paper, finish and quantity options.",
      },

      // ── Chapter 02 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "next",
        num: "02",
        label: "What's next",
        description:
          "An ongoing SEO programme to turn the faster site into better rankings.",
      },
      {
        type: "section",
        eyebrow: "Next steps",
        heading: "Ongoing SEO",
        body: "Page speed helps SEO but doesn't win rankings on its own. We've paired the rebuild with a content and technical SEO retainer, which started this month and focuses on the categories ANYPRINT compete in. We'll update this case study in three to six months when there's data to report.",
      },
      {
        type: "deliverables",
        heading: "Deliverables",
        items: [
          "WordPress redesign",
          "Custom theme build",
          "Performance optimisation, mobile and desktop",
          "Accessibility audit and fixes",
          "SEO programme (ongoing)",
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
      "A Shopify relaunch and two custom AI apps (an inventory planner and a live competitor tracker) for a B2B print supplier. Sales went up 240% in the first three months.",
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
    categories: ["ecommerce", "ai"],
    body: [
      {
        type: "intro",
        text: "Sublishop supply the print trade, where customers buy on availability and price. We rebuilt the storefront to load faster and convert better, then built two custom AI apps to help the team manage inventory and pricing.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "website",
        num: "01",
        label: "Website",
        description:
          "A Shopify relaunch built to sell more stock. Sales went up 240% in the first three months.",
      },
      {
        type: "section",
        eyebrow: "The relaunch",
        heading: "A Shopify rebuild for a B2B catalogue",
        body: "We reorganised the site's information architecture, sped up the product pages, and built a checkout that works as well on mobile as on desktop. Three months after the relaunch, sales were up 240%.",
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
        type: "browser",
        src: "/work/sublishop/live-collection.jpg",
        alt: "Sublishop latest arrivals collection page",
        url: "sublishop.co.uk/collections/latest-arrivals",
        caption: "A collection page, with filters and trade pricing.",
        phone: {
          src: "/work/sublishop/live-mobile-home.jpg",
          alt: "Sublishop homepage on a phone",
        },
      },
      {
        type: "browser",
        src: "/work/sublishop/live-product.jpg",
        alt: "Sublishop product page for a sublimation hoodie",
        url: "sublishop.co.uk/products/plain-white-adult-100-polyester-sublimation-hoodie",
        caption: "A product page.",
      },
      {
        type: "statGroup",
        items: [
          { eyebrow: "Sales · first 3 months", value: "+240%", label: "after relaunch" },
          { eyebrow: "Custom AI apps", value: "2", label: "in daily use" },
          { eyebrow: "Platform", value: "Shopify", label: "set up for B2B" },
        ],
      },

      // ── Chapter 02 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "apps",
        num: "02",
        label: "Custom Apps",
        description:
          "Two custom AI apps the team use to plan inventory and track competitor pricing.",
      },
      {
        type: "section",
        eyebrow: "AI apps",
        heading: "Inventory planner",
        body: "A custom app that uses sales velocity, lead times and seasonality to recommend what to reorder and when. It helps the team avoid both dead stock and stockouts, and replaces the spreadsheet calculations they used to do by hand.",
      },
      {
        type: "uiMock",
        name: "sublishop-inventory-planner",
        caption: "AI inventory planner · live product view",
      },
      {
        type: "section",
        heading: "Competitor tracker",
        body: "The tracker shows live and historical sales, inventory and pricing for competitors in one dashboard. It sends email alerts when a competitor drops a price, runs out of a product line or starts a promotion, so the team can respond within hours.",
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
          "SEO programme",
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
    year: "2020 to present",
    accent: "teal",
    heroImage: "/work/twisted-tailor.jpg",
    heroImageAlt: "Twisted Tailor storefront",
    excerpt:
      "A Shopify rebuild from scratch for the London menswear brand. We replaced eight third-party apps with theme code, cut roughly $250 a month from the app bill, and built MyFitt, a custom system that remembers each customer's sizes across the store.",
    services: ["Shopify build", "eCommerce consultancy", "SEO", "AI support agent"],
    stack: ["Shopify", "Custom theme", "Claude API"],
    timeline: "Ongoing partnership",
    url: "https://twistedtailor.com",
    featured: true,
    categories: ["ecommerce", "ai"],
    body: [
      {
        type: "intro",
        text: "Twisted Tailor is one of London's best-known menswear brands, and we've worked with them for years. The latest project was a full theme rebuild from scratch. We rewrote eight third-party apps as native theme sections, built a custom size-persistence system, and set up an AI support agent that halved support hours.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "website",
        num: "01",
        label: "Website",
        description:
          "A second Shopify build from scratch. Eight apps replaced with theme code, roughly $250 a month off the app bill, and a size-persistence system built for the brand.",
      },
      {
        type: "section",
        eyebrow: "The brief",
        heading: "Replacing the app stack",
        body: [
          "The previous build worked, but by the time the store was three years old it relied on a lot of apps. They covered cart recommendations, a 'buy the trousers, save 10%' upsell, a size recommender, a size guide, a gallery, a wishlist, a bundle app for suits sold as separates, and back-in-stock alerts. Each one added a monthly fee and a script, and could break when its developer updated it.",
          "The brief was to rebuild from scratch, move every app's function into the theme, and make every section editable so the team could add to the site without a developer.",
        ],
      },
      {
        type: "section",
        eyebrow: "What we rebuilt",
        heading: "Eight apps replaced with theme code",
        body: [
          "We rewrote all eight as native theme sections: cart recommendations, the 'complete the suit' trouser upsell, the size recommender, the size guide, the gallery, the wishlist, the bundle logic for suits sold as separates, and back-in-stock alerts. None of them need third-party scripts or app fees now.",
          "The bundle logic was the most important part. Twisted's suits are sold as a jacket, trouser and waistcoat, each priced separately, but the product page has to work as one product. Jacket and trouser sizes each have their own dropdown, the exclusive TT suit carrier is added with a toggle, and the basket groups the pieces together. It all runs in the theme without a bundle app.",
        ],
      },
      {
        type: "statGroup",
        items: [
          {
            eyebrow: "Shopify apps removed",
            value: "8",
            label: "replaced with theme sections",
          },
          {
            eyebrow: "App costs saved",
            value: "$250",
            label: "per month",
          },
          {
            eyebrow: "MyFitt",
            value: "Live",
            label: "saves each customer's sizes",
          },
          {
            eyebrow: "Build",
            value: "8 weeks",
            label: "start to finish",
          },
        ],
      },
      {
        type: "browser",
        src: "/work/twisted-tailor/storefront-2.jpg",
        alt: "Twisted Tailor product page with separate jacket and trouser size dropdowns",
        url: "twistedtailor.com",
      },
      {
        type: "browser",
        src: "/work/twisted-tailor/live-collection.jpg",
        alt: "Twisted Tailor new drops collection page",
        url: "twistedtailor.com/collections/new-drops",
        caption: "The new drops collection page.",
        phone: {
          src: "/work/twisted-tailor/live-mobile-product.jpg",
          alt: "Twisted Tailor product page on a phone",
        },
      },
      {
        type: "browser",
        src: "/work/twisted-tailor/live-product.jpg",
        alt: "Twisted Tailor product page for the Fleet floral suit",
        url: "twistedtailor.com/products/fleet-skinny-fit-black-floral-suit",
        caption: "A product page, with jacket and trouser sizes chosen separately.",
      },
      {
        type: "section",
        eyebrow: "MyFitt",
        heading: "Saved sizes across the store",
        body: [
          "Twisted sell jackets, trousers, waistcoats and casualwear, each with its own sizing grid. Customers who have to remember four sizes between visits are more likely to leave without buying.",
          "With MyFitt, customers set their sizes once in a single drawer and the site remembers them. Sizes are pre-selected on product pages, and collection pages hide styles that aren't in stock in their size. Because the settings are saved to the customer account, they carry across devices once the customer signs in.",
        ],
        phone: {
          src: "/work/twisted-tailor/mobile.jpg",
          alt: "MyFitt size drawer on mobile",
          caption: "Mobile · MyFitt",
        },
      },
      {
        type: "section",
        eyebrow: "The basket",
        heading: "Suits in the basket",
        body: [
          "The pieces are sold separately, but the basket needs to show them as one purchase. The jacket, trouser and optional TT suit carrier appear as clear line items, the free-shipping threshold is shown at the top, and a 'complete the look' section replaces the cart recommendations app that used to charge a fee for the same feature.",
        ],
        phone: {
          src: "/work/twisted-tailor/mobile-2.jpg",
          alt: "Twisted Tailor basket showing jacket, trouser and TT suit carrier",
          caption: "Mobile · basket",
        },
      },

      // ── Chapter 02 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "apps",
        num: "02",
        label: "AI Support",
        description:
          "An AI customer service agent that halved support hours, with replies kept in the brand's tone.",
      },
      {
        type: "section",
        eyebrow: "AI",
        heading: "AI customer service agent",
        body: [
          "Twisted's support inbox was busy, and most tickets were about sizing, returns and order status. We built an AI agent that reads incoming tickets, answers the repetitive ones directly, and summarises the complex ones for a member of the team to sign off.",
          "Customer service hours are down 50% and customer satisfaction has improved.",
        ],
      },
      {
        type: "uiMock",
        name: "twisted-tailor-ai-support",
        caption: "AI support agent · live product view",
      },
      {
        type: "deliverables",
        heading: "Deliverables",
        items: [
          "Shopify build (second full rebuild)",
          "Custom theme",
          "Suits-as-separates bundle logic (app replaced)",
          "Native wishlist (app replaced)",
          "Native size recommender and size guide (2 apps replaced)",
          "Cart recommendations and trouser upsell (2 apps replaced)",
          "Native gallery and back-in-stock alerts (2 apps replaced)",
          "MyFitt cross-device size persistence",
          "AI customer service agent",
          "eCommerce consultancy",
          "SEO programme",
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
      "Shopify development and a set of branded notification emails for a lifestyle brand launching a new product line.",
    services: ["Shopify development", "Email design"],
    stack: ["Shopify", "Klaviyo"],
    timeline: "4 weeks",
    url: "https://itspouch.com",
    featured: true,
    categories: ["ecommerce"],
    body: [
      {
        type: "intro",
        text: "A small, focused project: Shopify development to support a new product line, and a set of transactional and lifecycle emails designed in the brand's tone.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "build",
        num: "01",
        label: "The build",
        description:
          "Shopify work to launch the new range, and order and shipping emails designed to match the brand.",
      },
      {
        type: "section",
        eyebrow: "Scope",
        heading: "Shopify development and email design",
        body: "We did the Shopify work to launch the new range. We also designed the order confirmation, shipping update and post-purchase emails so they carry the same branding as the rest of the site.",
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
        type: "browser",
        src: "/work/its-pouch/live-home.jpg",
        alt: "it's Pouch homepage",
        url: "itspouch.com",
        caption: "The homepage.",
        phone: {
          src: "/work/its-pouch/live-mobile-home.jpg",
          alt: "it's Pouch homepage on a phone",
        },
      },
      {
        type: "browser",
        src: "/work/its-pouch/live-collection.jpg",
        alt: "it's Pouch nicotine pouches collection page",
        url: "itspouch.com/collections/nicotine-pouches",
        caption: "A collection page.",
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
      "A move to Shopify from an over-developed WordPress site, plus a live Smart Glazier integration and an AI image pipeline that turns customer install photos into consistent, on-brand imagery.",
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
        text: "Origin's WordPress site couldn't be changed without a developer, so every edit meant a ticket and each ticket took hours. We moved them to Shopify, connected their trade software, and used AI to fix their product imagery.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "website",
        num: "01",
        label: "Website",
        description:
          "A move from an over-developed WordPress build to Shopify. Every page can now be edited in under a minute.",
      },
      {
        type: "section",
        eyebrow: "From WordPress to Shopify",
        heading: "A platform the team can use",
        body: [
          "The previous WordPress build had been over-developed, with custom post types, nested blocks and tangled shortcodes. Nothing could be edited without a developer on call.",
          "We moved the site to Shopify with a lean theme and a simple content model. Every page can be edited in under a minute, and the conversion rate went up straight after launch.",
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
        type: "browser",
        src: "/work/origin-architectural/live-collection.jpg",
        alt: "Origin Architectural preassembled posts collection page",
        url: "originarchitectural.co.uk/collections/preassembled-posts",
        caption: "A collection page.",
        phone: {
          src: "/work/origin-architectural/live-mobile-product.jpg",
          alt: "Origin Architectural Juliet balcony product page on a phone",
        },
      },
      {
        type: "browser",
        src: "/work/origin-architectural/live-product.jpg",
        alt: "Origin Architectural Skyforce Juliet balcony product page",
        url: "originarchitectural.co.uk/products/skyforce-juliet-balcony",
        caption: "A product page.",
      },
      {
        type: "statGroup",
        items: [
          { eyebrow: "Developer hours saved", value: "10+", label: "per month since launch" },
          { eyebrow: "Conversion rate", value: "Up", label: "straight after the move to Shopify" },
          { eyebrow: "Platform", value: "Shopify", label: "moved from WordPress" },
        ],
      },

      // ── Chapter 02 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "integration",
        num: "02",
        label: "Integration",
        description:
          "A live Smart Glazier integration, so the trade system and the storefront use the same data.",
      },
      {
        type: "section",
        eyebrow: "Integration",
        heading: "Smart Glazier integration",
        body: "Origin's trade operation runs on Smart Glazier. We built an integration that sends product data, pricing and availability into Shopify, so nobody has to reconcile them by hand. That means fewer errors, less admin and one source of truth for both systems.",
      },

      // ── Chapter 03 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "ai",
        num: "03",
        label: "AI",
        description:
          "An AI image pipeline that turns customer install photos into consistent, on-brand imagery.",
      },
      {
        type: "section",
        eyebrow: "AI",
        heading: "Retouching customer photos with AI",
        body: [
          "Most of Origin's imagery came from installers and customers. The photos were taken on phones in daylight, from different angles and in mixed quality, and couldn't be used on the storefront as they were.",
          "We built an AI retouching pipeline that standardises angles, lighting and backgrounds across the catalogue, so the product images now look consistent.",
        ],
      },
      {
        type: "beforeAfter",
        before: {
          src: "/work/origin-architectural/customer-photo.jpg",
          alt: "Install photo taken by a customer",
          label: "Customer shot",
        },
        after: {
          src: "/work/origin-architectural/ai-retouched.jpg",
          alt: "The same photo after AI retouching",
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
      "A clean, mobile-first WordPress site built on a block theme, which the Threadology team can edit themselves.",
    services: ["WordPress", "Design"],
    stack: ["WordPress", "Block theme"],
    timeline: "6 weeks",
    url: "https://threadology.co.uk",
    featured: true,
    categories: ["wordpress"],
    body: [
      {
        type: "intro",
        text: "Threadology needed a well-built WordPress site that was fast, worked well on mobile and was easy to edit. We built it on a block theme.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "build",
        num: "01",
        label: "The build",
        description:
          "A WordPress site built to the same standard as our larger projects: fast, mobile-first and editable by the team.",
      },
      {
        type: "section",
        eyebrow: "Approach",
        heading: "How we built it",
        body: [
          "We used a block theme and a focused content model, and applied the same build standards, speed targets and SEO work as on our larger projects.",
          "The team can update any page without contacting us.",
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
        type: "browser",
        src: "/work/threadology/live-about.jpg",
        alt: "Threadology homepage section describing the business",
        url: "threadology.co.uk",
        caption: "Further down the homepage.",
        phone: {
          src: "/work/threadology/live-mobile-home.jpg",
          alt: "Threadology homepage on a phone",
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
      "A WordPress redesign that moved F&P Agency from a standard estate agency site to a more upmarket one, in line with their rebrand.",
    services: ["WordPress redesign", "Brand alignment"],
    stack: ["WordPress"],
    timeline: "12 weeks",
    url: "https://fandpagency.com",
    categories: ["wordpress"],
    body: [
      {
        type: "intro",
        text: "F&P Agency were rebranding to position the business at the luxury end of the estate agency market. The old website reflected the old positioning, so we rebuilt it to match the new one.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "build",
        num: "01",
        label: "The rebuild",
        description:
          "A restrained WordPress site with an upmarket look that avoids the usual luxury property conventions.",
      },
      {
        type: "section",
        eyebrow: "The rebuild",
        heading: "An upmarket redesign",
        body: [
          "F&P wanted an upmarket site that avoided the usual luxury property conventions, such as a large hero video, thin serif type and heavy use of the word 'bespoke'.",
          "We built a restrained WordPress site with generous typography, real property photography and a slower pace between sections.",
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
        type: "phone",
        src: "/work/fandp-agency/live-mobile-home.jpg",
        alt: "F&P Agency homepage on a phone",
        caption: "The homepage on a phone.",
        width: "md",
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
      "A WordPress redesign that replaced a self-built site with a professional, mobile-first booking site, including a custom postcode search tool.",
    services: ["WordPress redesign", "Custom postcode search"],
    stack: ["WordPress"],
    timeline: "5 weeks",
    url: "https://littlemuddyboots.co.uk",
    categories: ["wordpress"],
    body: [
      {
        type: "intro",
        text: "The original site was self-designed. A service business needs a site that looks trustworthy at first glance, so we redesigned and rebuilt it.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "build",
        num: "01",
        label: "The build",
        description:
          "A mobile-first booking site with a custom postcode search tool that tells visitors straight away whether the service covers their area.",
      },
      {
        type: "section",
        eyebrow: "Scope",
        heading: "Redesign and postcode search",
        body: "We redesigned the site for mobile, reorganised the content so it's easier to find, and simplified the booking flow. We also built a custom postcode search tool that tells visitors straight away whether the service covers their area.",
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
        type: "browser",
        src: "/work/little-muddy-boots/live-classes.jpg",
        alt: "Little Muddy Boots classes page",
        url: "littlemuddyboots.co.uk/classes",
        caption: "The classes page.",
      },
      {
        type: "browser",
        src: "/work/little-muddy-boots/live-parties.jpg",
        alt: "Little Muddy Boots birthday parties page",
        url: "littlemuddyboots.co.uk/parties",
        caption: "The birthday parties page.",
      },
      {
        type: "deliverables",
        heading: "Deliverables",
        items: [
          "WordPress redesign",
          "Mobile-first UX",
          "Custom postcode search tool",
          "Site structure built around booking",
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
      "A WordPress redesign for a regional self-storage company, built to make it quick for visitors to find a unit and enquire.",
    services: ["WordPress redesign"],
    stack: ["WordPress"],
    timeline: "4 weeks",
    url: "https://space4uselfstorage.co.uk",
    categories: ["wordpress"],
    body: [
      {
        type: "intro",
        text: "Self-storage customers want to know what sizes are available, how much they cost and how to get one. We rebuilt the site around those questions.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "build",
        num: "01",
        label: "The build",
        description:
          "A clear, fast WordPress site built around unit sizes, pricing and a simple way to enquire.",
      },
      {
        type: "section",
        eyebrow: "Scope",
        heading: "Sizes, pricing and enquiries",
        body: "We redesigned the WordPress site around the three things storage customers look for: unit sizes, transparent pricing and an easy way to enquire. The site is fast and the team can edit it themselves.",
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
        type: "browser",
        src: "/work/space-4-u-self-storage/live-home-scroll.jpg",
        alt: "Space 4 U homepage personal and business storage sections",
        url: "space4uselfstorage.co.uk",
        caption: "Personal and business storage on the homepage.",
        phone: {
          src: "/work/space-4-u-self-storage/live-mobile-home.jpg",
          alt: "Space 4 U homepage on a phone",
        },
      },
      {
        type: "browser",
        src: "/work/space-4-u-self-storage/live-quote.jpg",
        alt: "Space 4 U quote request page",
        url: "space4uselfstorage.co.uk/get-a-quote",
        caption: "The quote request page.",
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
      "A WordPress redesign for a freight business, plus ongoing social media management.",
    services: ["WordPress redesign", "Currency selector", "Social media management"],
    stack: ["WordPress"],
    timeline: "8 weeks, then a retainer",
    url: "https://paragonfreight.com",
    categories: ["wordpress"],
    body: [
      {
        type: "intro",
        text: "Freight customers need to trust a company before they get in touch. Paragon Freight needed a more credible website and a social media presence to support it.",
      },

      // ── Chapter 01 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "website",
        num: "01",
        label: "Website",
        description:
          "A WordPress redesign focused on credibility, the full range of services and clear ways to enquire.",
      },
      {
        type: "section",
        eyebrow: "Scope",
        heading: "Website redesign",
        body: "We redesigned the WordPress site to build credibility, explain the full range of services and give visitors clear ways to enquire. It's fast and the team can edit it in-house.",
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
        type: "browser",
        src: "/work/paragon-freight/live-services.jpg",
        alt: "Paragon Freight services on the homepage",
        url: "paragonfreight.com",
        caption: "Services on the homepage.",
        phone: {
          src: "/work/paragon-freight/live-mobile-home.jpg",
          alt: "Paragon Freight homepage on a phone",
        },
      },
      {
        type: "browser",
        src: "/work/paragon-freight/live-customs.jpg",
        alt: "Paragon Freight customs clearance page",
        url: "paragonfreight.com/services/customs",
        caption: "The customs clearance page.",
      },
      {
        type: "section",
        eyebrow: "International enquiries",
        heading: "Currency selector",
        body: "Paragon get enquiries from operators across the EU, the Middle East and North America. We added a currency selector so visitors see rates and quotes in their own currency from their first visit.",
      },

      // ── Chapter 02 ─────────────────────────────────────────────
      {
        type: "chapter",
        id: "social",
        num: "02",
        label: "Social",
        description:
          "Ongoing social media management to keep the brand visible between project enquiries.",
      },
      {
        type: "section",
        eyebrow: "Retainer",
        heading: "Social media management",
        body: "We manage Paragon's social media week to week and keep the branding consistent with the new website.",
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

  {
    slug: "jbvc-foundation",
    client: "JBVC Foundation",
    tag: "Charity · WordPress",
    year: "2025",
    accent: "violet",
    heroImage: "/work/jbvc-foundation.jpg",
    heroImageAlt: "A young person sitting outside, from the JBVC Foundation website",
    excerpt:
      "A single-page WordPress site for the Johnson Beharry VC Foundation, a charity that protects vulnerable children from criminal exploitation and violence.",
    services: ["WordPress", "Design"],
    stack: ["WordPress"],
    timeline: "Single-page build",
    url: "https://jbvcfoundation.org.uk",
    categories: ["wordpress"],
    body: [
      {
        type: "intro",
        text: "The Johnson Beharry VC Foundation works with children aged 10 and above to protect them from criminal exploitation and violence. We designed and built its website as a single WordPress page.",
      },
      {
        type: "section",
        eyebrow: "The site",
        heading: "One page, in full-screen sections",
        body: [
          "The site is one page split into full-screen sections: what the foundation does, its founder Johnson Beharry VC, why early prevention matters, and its two programmes, Project Alpha and The Regiment.",
        ],
      },
      {
        type: "browser",
        src: "/work/jbvc-foundation/storefront.jpg",
        alt: "JBVC Foundation homepage",
        url: "jbvcfoundation.org.uk",
        phone: {
          src: "/work/jbvc-foundation/mobile.jpg",
          alt: "JBVC Foundation homepage on a phone",
        },
      },
      {
        type: "browser",
        src: "/work/jbvc-foundation/live-founder.jpg",
        alt: "JBVC Foundation section about its founder, Johnson Beharry VC",
        url: "jbvcfoundation.org.uk",
        caption: "The section about the foundation's founder.",
      },
      {
        type: "browser",
        src: "/work/jbvc-foundation/live-stats.jpg",
        alt: "JBVC Foundation section on why early prevention matters",
        url: "jbvcfoundation.org.uk",
        caption: "Why early prevention matters.",
      },
      {
        type: "browser",
        src: "/work/jbvc-foundation/live-programmes.jpg",
        alt: "JBVC Foundation programmes, Project Alpha and The Regiment",
        url: "jbvcfoundation.org.uk",
        caption: "The foundation's two programmes.",
      },
      {
        type: "deliverables",
        heading: "Deliverables",
        items: ["Website design", "Single-page WordPress build"],
      },
    ],
  },
  {
    slug: "toughcode",
    client: "Tough Code",
    tag: "Manufacturing · Landing page",
    year: "2026",
    accent: "teal",
    heroImage: "/work/toughcode.jpg",
    heroImageAlt: "A Tough Code lab technician weighing ingredients",
    excerpt:
      "A single-page landing site for Tough Code, a UK manufacturer of oral pouch products, with scroll animations that move the story along as you read.",
    services: ["Design", "Development"],
    stack: ["Landing page", "Scroll animation"],
    timeline: "Single-page build",
    url: "https://toughcode.com",
    categories: [],
    body: [
      {
        type: "intro",
        text: "Tough Code develop and manufacture oral pouch products in the UK for other brands. We designed and built a single landing page for them, with scroll animations that bring each section in as you move down the page.",
      },
      {
        type: "section",
        eyebrow: "The site",
        heading: "One page, told through scroll",
        body: [
          "The page covers what Tough Code make, their manufacturing capabilities, their facility and their six-step process, and ends with a way to book a meeting. Each section animates in as you scroll.",
        ],
      },
      {
        type: "browser",
        src: "/work/toughcode/storefront.jpg",
        alt: "Tough Code landing page hero",
        url: "toughcode.com",
        phone: {
          src: "/work/toughcode/mobile.jpg",
          alt: "Tough Code landing page on a phone",
        },
      },
      {
        type: "browser",
        src: "/work/toughcode/live-capabilities.jpg",
        alt: "Tough Code capabilities: product development, precision production, regulatory support and commercial scale",
        url: "toughcode.com",
        caption: "The capabilities section.",
      },
      {
        type: "browser",
        src: "/work/toughcode/live-about.jpg",
        alt: "Tough Code section about their UK manufacturing facility",
        url: "toughcode.com",
        caption: "About the company and its facility.",
      },
      {
        type: "browser",
        src: "/work/toughcode/live-process.jpg",
        alt: "Tough Code six-step process and meeting call to action",
        url: "toughcode.com",
        caption: "The six-step process.",
      },
      {
        type: "deliverables",
        heading: "Deliverables",
        items: ["Landing page design", "Development", "Scroll animations"],
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
