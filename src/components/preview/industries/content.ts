/**
 * Copy and data for the industry pages at /industries/<slug>.
 *
 * An industry only gets a page when there are at least two real case studies in
 * it in src/content/work.ts. Every requirement, result and price below restates
 * a fact from work.ts, the case study summaries or the services copy.
 *
 *   fashion        Gieves & Hawkes, Twisted Tailor, Threadology (all tagged Fashion or tailoring)
 *   print          ANYPRINT, Sublishop, Fun Cases (a print room, a print-trade supplier, a print-on-demand brand)
 *   trade-and-b2b  Origin Architectural, Sublishop, Paragon Freight, Tough Code (all sell to other businesses)
 *   charities      JBVC Foundation. The exception to the two-case rule: the page exists for the free
 *                  charity website application, so it has an `apply` block and no `needs` list.
 *                  The offer copy only says we sometimes build a charity's site for free. Don't add
 *                  numbers, deadlines or promises, and don't say whether JBVC's site was free.
 */

export type Faq = { q: string; a: string };
export type Result = { value: string; label: string };

export type Need = { title: string; body: string; case: string };

export type IndustryCase = { slug: string; summary: string; results: Result[] };

export type IndustryService = { name: string; price: string; body: string; path: string };

export type Link = { label: string; href: string };

/** The free website offer and application form. Only the charities page has one. */
export type ApplyCopy = {
  how: { label: string; heading: string; intro: string; steps: { title: string; body: string }[] };
  strong: { heading: string; items: string[]; note: string };
  form: { heading: string; intro: string };
};

export type Industry = {
  slug: string;
  name: string;
  /** Used inside sentences, e.g. "Questions about ...". */
  lower: string;
  /** Schema.org audienceType. */
  audience: string;
  meta: { title: string; description: string };
  /** One line for the industries index and the local pages. */
  short: string;
  /** `primary` and `secondary` default to Get in touch and the needs list. */
  hero: { lines: string[]; brush: string; intro: string; primary?: Link; secondary?: Link };
  needs?: { heading: string; intro: string; items: Need[] };
  cases: IndustryCase[];
  /** Defaults to "Projects and results". */
  casesHeading?: string;
  services: IndustryService[];
  /** Defaults to the line about scoping and the free first call. */
  servicesLede?: string;
  apply?: ApplyCopy;
  faqs: Faq[];
};

export const industries: Industry[] = [
  {
    slug: "fashion",
    name: "Fashion and tailoring",
    lower: "websites for fashion brands",
    audience: "Fashion, menswear and tailoring brands",
    meta: {
      title: "Shopify Websites for Fashion and Tailoring | Webgro",
      description:
        "Shopify builds for fashion brands, with made-to-measure booking, saved sizes and suits sold as separates. Work for Gieves & Hawkes and Twisted Tailor.",
    },
    short: "Shopify builds for Gieves & Hawkes and Twisted Tailor, and a WordPress site for Threadology.",
    hero: {
      lines: ["Websites for", "fashion and", "tailoring"],
      brush: "tailoring",
      intro:
        "We've built Shopify stores for Gieves & Hawkes and Twisted Tailor, and a WordPress site for Threadology. The work covers the parts of a fashion site that usually end up running on paid apps: sizing, suits sold as separates, wishlists and made-to-measure appointments.",
    },
    needs: {
      heading: "What a fashion website needs",
      intro: "Each of these came from a client brief, and each one is now part of a live site.",
      items: [
        {
          title: "Made-to-measure appointments",
          case: "gieves-and-hawkes",
          body: "Gieves & Hawkes take made-to-measure bookings through SimplyBookMe. We connected it through the API, so appointments go into the calendar the team already use, and the booking screens are part of the theme.",
        },
        {
          title: "Suits sold as separates",
          case: "twisted-tailor",
          body: "Twisted Tailor price the jacket, trousers and waistcoat separately, but the product page has to work as one product. The jacket and trousers each have their own size dropdown, and the basket groups the pieces together.",
        },
        {
          title: "Sizes remembered across the store",
          case: "twisted-tailor",
          body: "With MyFitt, customers set their sizes once. They're pre-selected on product pages, collection pages hide styles that aren't in stock in their size, and the settings follow a signed-in customer across devices.",
        },
        {
          title: "Size guides, wishlists and alerts without apps",
          case: "gieves-and-hawkes",
          body: "Gieves & Hawkes had twelve apps. We built predictive search, size guides, wishlists that sync to Klaviyo, bundles and back-in-stock alerts into the theme, which took £300 a month off the app bill.",
        },
        {
          title: "Pages beyond the catalogue",
          case: "gieves-and-hawkes",
          body: "Bespoke, made to measure, the journal, the brand's heritage and the showroom locator each have their own page template, designed in the same system as the shop.",
        },
        {
          title: "A site the team can edit",
          case: "threadology",
          body: "Threadology's WordPress site is built on a block theme, so the team can update any page without contacting us.",
        },
      ],
    },
    cases: [
      {
        slug: "gieves-and-hawkes",
        summary:
          "Our second Shopify build from scratch for the Savile Row tailor, finished in two months. We replaced eight apps with theme code, and we also look after SEO, email marketing and consultancy.",
        results: [
          { value: "85", label: "mobile Lighthouse score, up from 64" },
          { value: "£300", label: "a month saved on app fees" },
          { value: "#1", label: "on Google UK for 'luxury suit'" },
        ],
      },
      {
        slug: "twisted-tailor",
        summary:
          "A Shopify rebuild from scratch in eight weeks for the London menswear brand, with eight apps rewritten as theme code, the MyFitt size system and an AI support agent.",
        results: [
          { value: "8", label: "apps replaced with theme code" },
          { value: "$250", label: "a month off the app bill" },
          { value: "50%", label: "fewer customer service hours" },
        ],
      },
      {
        slug: "threadology",
        summary: "A fast, mobile-first WordPress site on a block theme, with on-page SEO, which the team can edit themselves.",
        results: [{ value: "6 weeks", label: "from start to launch" }],
      },
    ],
    services: [
      { name: "Websites", price: "Shopify rebuilds usually £5k to £25k", body: "Custom Shopify themes with sizing, bundles and booking built in.", path: "/services/websites" },
      { name: "SEO", price: "From £750 a month", body: "Technical SEO and content. Gieves & Hawkes reached #1 on Google UK for 'luxury suit'.", path: "/services/seo" },
      { name: "Email marketing", price: "From £800 a month, plus setup", body: "Klaviyo flows and campaigns. Gieves & Hawkes' wishlists sync straight to Klaviyo.", path: "/services/marketing/email-marketing" },
      { name: "Automation and AI", price: "Priced per project", body: "AI support agents, like the one that halved Twisted Tailor's customer service hours.", path: "/services/automation-ai" },
      { name: "Consultancy", price: "£400 a day", body: "Working alongside your in-house team, as we do at Gieves & Hawkes.", path: "/services/consultancy" },
    ],
    faqs: [
      {
        q: "Can you connect a made-to-measure booking system to Shopify?",
        a: "Yes. Gieves & Hawkes use SimplyBookMe for made-to-measure appointments. We connected it through its API, so bookings go into the calendar the team already use, and the booking screens are designed as part of the theme.",
      },
      {
        q: "Can Shopify sell a suit as separate pieces in different sizes?",
        a: "Yes, without a bundle app. On Twisted Tailor's store the jacket, trousers and waistcoat are priced separately, the jacket and trousers each have their own size dropdown, and the basket shows them together as one purchase.",
      },
      {
        q: "Do we need apps for size guides, wishlists and back-in-stock alerts?",
        a: "Not usually. We built all three into the theme for both Gieves & Hawkes and Twisted Tailor. Each brand replaced eight apps, and Gieves & Hawkes now save £300 a month on app fees.",
      },
      {
        q: "How long does a Shopify rebuild for a fashion brand take?",
        a: "Twisted Tailor's rebuild took eight weeks and Gieves & Hawkes' took two months. Shopify rebuilds usually cost between £5k and £25k, depending on how much custom work is involved.",
      },
    ],
  },

  {
    slug: "print",
    name: "Print and personalised products",
    lower: "websites for print businesses",
    audience: "Printers, print-trade suppliers and personalised product brands",
    meta: {
      title: "Websites for Print and Personalised Products | Webgro",
      description:
        "Websites for printers and personalised product brands, with product options, design tools, trade pricing and order routing. ANYPRINT, Sublishop and Fun Cases.",
    },
    short: "A print room, a supplier to the print trade and a brand that prints thousands of phone cases a week.",
    hero: {
      lines: ["Websites for", "print and", "personalised", "products"],
      brush: "personalised",
      intro:
        "We've built websites for ANYPRINT, a commercial print room, Sublishop, a supplier to the print trade, and Fun Cases, who ship thousands of phone cases a week. Between them they cover product options, customer design tools, trade pricing and getting orders to the printer.",
    },
    needs: {
      heading: "What a print website needs",
      intro: "Each of these is running on one of the three sites.",
      items: [
        {
          title: "Product options that are easy to choose",
          case: "anyprint",
          body: "ANYPRINT's product pages let customers choose the paper, finish and quantity, on a WordPress site that scores 99 for mobile performance.",
        },
        {
          title: "Customers designing their own product",
          case: "fun-cases",
          body: "Fun Cases' personaliser is a full-screen editor built into the theme. Customers add photos, text and stickers to a live mockup, and a print-ready file is added to the order.",
        },
        {
          title: "Orders sent to the right printer",
          case: "fun-cases",
          body: "A routing app checks each Fun Cases order as it arrives. Orders the automatic printers can handle go straight to them, and the rest are queued for printing in-house. On the automatic route, an order can be printed within two minutes.",
        },
        {
          title: "Trade pricing on a B2B catalogue",
          case: "sublishop",
          body: "Sublishop sell to the print trade, where customers buy on availability and price. The Shopify store is set up for B2B, with filters and trade pricing on collection pages.",
        },
        {
          title: "Knowing what to reorder, and what competitors charge",
          case: "sublishop",
          body: "Two AI apps for Sublishop: an inventory planner that recommends what to reorder and when, and a tracker that emails the team when a competitor drops a price or runs out of a product line.",
        },
        {
          title: "Pages that load quickly",
          case: "anyprint",
          body: "We checked every decision on ANYPRINT's rebuild against page speed. Lighthouse performance went from 54 to 99, and accessibility, best practices and SEO all reached 100.",
        },
      ],
    },
    cases: [
      {
        slug: "anyprint",
        summary: "A WordPress redesign and rebuild on a custom theme, with page speed as the main requirement, followed by an ongoing SEO programme.",
        results: [
          { value: "99", label: "Lighthouse performance, up from 54" },
          { value: "100", label: "for accessibility, best practices and SEO" },
        ],
      },
      {
        slug: "sublishop",
        summary: "A Shopify relaunch for a B2B print supplier, and two custom AI apps for stock planning and competitor tracking.",
        results: [
          { value: "+240%", label: "sales in the first three months" },
          { value: "£15k", label: "from a single email campaign" },
          { value: "2", label: "AI apps in daily use" },
        ],
      },
      {
        slug: "fun-cases",
        summary: "A rebrand and a Shopify theme built from scratch, with our own personaliser, an order-routing app and a custom warehouse system.",
        results: [
          { value: "+300%", label: "revenue over five years" },
          { value: "£5k", label: "a year saved by replacing the personaliser app" },
          { value: "2 min", label: "from order to print on the automatic route" },
        ],
      },
    ],
    services: [
      { name: "Websites", price: "From £4,000", body: "Shopify or WordPress, with product options and design tools built in.", path: "/services/websites" },
      { name: "Automation and AI", price: "Priced per project", body: "Order routing, stock planning and competitor tracking, built around how your production works.", path: "/services/automation-ai" },
      { name: "SEO", price: "From £750 a month", body: "Category and product page SEO. ANYPRINT's rebuild was paired with an ongoing SEO retainer.", path: "/services/seo" },
      { name: "Email marketing", price: "From £800 a month, plus setup", body: "Klaviyo campaigns and flows. One Sublishop email brought in £15k.", path: "/services/marketing/email-marketing" },
      { name: "Google Ads and Meta Ads", price: "From £1,000 a month, plus ad budget", body: "Search, Shopping and paid social. Fun Cases run at a blended return of more than 8.", path: "/services/marketing/ppc" },
    ],
    faqs: [
      {
        q: "Can customers upload artwork or design their own product on the site?",
        a: "Yes. For Fun Cases we built a full-screen personaliser into the Shopify theme, where customers add photos, text and stickers to a live mockup of their phone. The design is added to the order as a print-ready file, and the tool replaced an app that cost nearly £5,000 a year.",
      },
      {
        q: "Can the website show trade prices?",
        a: "Yes. Sublishop's Shopify store is set up for B2B, with trade pricing on collection pages for the print-trade customers they sell to.",
      },
      {
        q: "Should a print business use WordPress or Shopify?",
        a: "Both can work. ANYPRINT's site runs on WordPress with a custom theme. Sublishop and Fun Cases use Shopify, which suits catalogues where customers order and pay online. We recommend one after the first call, once we know how you take orders.",
      },
      {
        q: "Can orders go straight to production?",
        a: "Yes. At Fun Cases a routing app checks every order. Orders the automatic printing machines can handle go straight to them with no manual step, and the rest are queued for printing in-house.",
      },
    ],
  },

  {
    slug: "trade-and-b2b",
    name: "Trade and B2B",
    lower: "websites for trade and B2B businesses",
    audience: "Trade suppliers, manufacturers and B2B service businesses",
    meta: {
      title: "Websites for Trade and B2B Suppliers | Webgro",
      description:
        "Websites for trade suppliers, manufacturers and B2B services, with trade software integrations, trade pricing and quotes in the buyer's currency.",
    },
    short: "Trade integrations, trade pricing and credible sites for suppliers, manufacturers and freight.",
    hero: {
      lines: ["Websites for", "trade and B2B", "suppliers"],
      brush: "suppliers",
      intro:
        "We've built websites for businesses that sell to other businesses: an architectural products company with a trade operation, a supplier to the print trade, a freight company and a UK manufacturer. The work usually involves trade software, pricing, and showing buyers they can trust you.",
    },
    needs: {
      heading: "What a trade or B2B website needs",
      intro: "Each of these came from one of the four projects below.",
      items: [
        {
          title: "Your trade software connected to the site",
          case: "origin-architectural",
          body: "Origin Architectural's trade operation runs on Smart Glazier. We built an integration that sends product data, pricing and availability into Shopify, so nobody has to reconcile the two by hand.",
        },
        {
          title: "Trade pricing on a B2B catalogue",
          case: "sublishop",
          body: "Sublishop's customers buy on availability and price. Their Shopify store is set up for B2B, with trade pricing on collection pages and a checkout that works as well on mobile as on desktop.",
        },
        {
          title: "Rates in the buyer's currency",
          case: "paragon-freight",
          body: "Paragon Freight get enquiries from the EU, the Middle East and North America. A currency selector shows visitors rates and quotes in their own currency from their first visit.",
        },
        {
          title: "A clear route to a meeting",
          case: "toughcode",
          body: "Tough Code make oral pouch products for other brands. Their landing page covers what they make, their capabilities, their facility and their six-step process, and ends with a way to book a meeting.",
        },
        {
          title: "Consistent product photos",
          case: "origin-architectural",
          body: "Most of Origin's photos were taken on phones by installers and customers. An AI pipeline now standardises angles, lighting and backgrounds, so the catalogue looks consistent.",
        },
        {
          title: "Pages your team can change",
          case: "origin-architectural",
          body: "Origin's old WordPress site needed a developer for every edit. On Shopify, any page can be changed in under a minute, which saves more than ten developer hours a month.",
        },
      ],
    },
    cases: [
      {
        slug: "origin-architectural",
        summary: "A move from WordPress to Shopify in three months, with a live Smart Glazier integration and AI retouching for customer install photos.",
        results: [
          { value: "10+", label: "developer hours saved per month" },
          { value: "3 months", label: "from start to launch" },
        ],
      },
      {
        slug: "sublishop",
        summary: "A Shopify relaunch for a supplier to the print trade, plus an AI inventory planner and a competitor tracker.",
        results: [
          { value: "+240%", label: "sales in the first three months" },
          { value: "2", label: "AI apps in daily use" },
        ],
      },
      {
        slug: "paragon-freight",
        summary: "A WordPress redesign over eight weeks, with a currency selector for overseas enquiries. We've managed their social media since.",
        results: [{ value: "8 weeks", label: "for the redesign" }],
      },
      {
        slug: "toughcode",
        summary: "A single landing page with scroll animations for a UK manufacturer, taking visitors from what they make to booking a meeting.",
        results: [],
      },
    ],
    services: [
      { name: "Websites", price: "From £4,000", body: "WordPress for service businesses and Shopify for catalogues, with trade integrations where you need them.", path: "/services/websites" },
      { name: "Automation and AI", price: "Priced per project", body: "Integrations with trade software, and tools such as Sublishop's inventory planner.", path: "/services/automation-ai" },
      { name: "SEO", price: "From £750 a month", body: "Technical SEO and content for the searches your buyers make.", path: "/services/seo" },
      { name: "Social media", price: "From £400 a month", body: "Planned posts for LinkedIn and other channels, as we run for Paragon Freight.", path: "/services/marketing/social-media" },
      { name: "Consultancy", price: "£400 a day", body: "Platform decisions and growth plans, including whether you need Shopify Plus for B2B.", path: "/services/consultancy" },
    ],
    faqs: [
      {
        q: "Can you connect our trade software to the website?",
        a: "Often, yes, if the software has an API. For Origin Architectural we connected Smart Glazier to Shopify, so product data, pricing and availability come from one place and nobody reconciles them by hand.",
      },
      {
        q: "Can we show different prices to trade customers?",
        a: "Yes. Sublishop's Shopify store is set up for B2B, with trade pricing on collection pages. If you need more B2B features, such as several regions or a custom checkout, Shopify Plus may be worth it.",
      },
      {
        q: "We get enquiries from abroad. Can the site show other currencies?",
        a: "Yes. Paragon Freight's site has a currency selector, so visitors from the EU, the Middle East and North America see rates and quotes in their own currency.",
      },
      {
        q: "Do we need a full website, or would a landing page do?",
        a: "It depends on how you sell. Tough Code needed one page that explains what they make and gets buyers to book a meeting, so we built a single landing page. Where buyers order online, a full catalogue makes more sense.",
      },
    ],
  },

  {
    slug: "charities",
    name: "Charities",
    lower: "websites for charities",
    audience: "UK charities",
    meta: {
      title: "Charity Websites and Free Website Applications | Webgro",
      description:
        "We sometimes build a charity's website for free. Apply online, or work with us at normal rates: WordPress sites from £4,000, care plans from £80 a month.",
    },
    short: "A WordPress site for the JBVC Foundation. We sometimes build a charity's website for free, and charities can apply.",
    hero: {
      lines: ["Websites for", "charities"],
      brush: "charities",
      intro:
        "We designed and built the website for the JBVC Foundation, a charity that protects vulnerable children from criminal exploitation and violence. We sometimes build a charity's website for free, and any charity can apply using the application form.",
      primary: { label: "Apply for a free website", href: "#apply" },
      secondary: { label: "How it works", href: "#how" },
    },
    casesHeading: "Charity work",
    cases: [
      {
        slug: "jbvc-foundation",
        summary:
          "A single-page WordPress site for the Johnson Beharry VC Foundation, which works with children aged 10 and above. The page is split into full-screen sections: what the foundation does, its founder Johnson Beharry VC, why early prevention matters, and its two programmes, Project Alpha and The Regiment.",
        results: [],
      },
    ],
    apply: {
      how: {
        label: "Free charity websites",
        heading: "How it works",
        intro: "We sometimes build a charity's website for free. We can't do this for every charity that applies.",
        steps: [
          {
            title: "Apply",
            body: "Fill in the application form. It asks what the charity does, what it needs from a website, and what difference a website would make.",
          },
          {
            title: "We read every application",
            body: "Applications are reviewed by the Webgro team. It may take us a little while to reply.",
          },
          {
            title: "We get in touch if we can help",
            body: "If we can help, we'll contact you to talk about what the charity needs.",
          },
        ],
      },
      strong: {
        heading: "What makes a strong application",
        items: [
          "A registered charity. If the charity isn't registered yet, you can still apply.",
          "A clear need: what the website has to do, and who it's for.",
          "A clear idea of the difference a website would make to the charity's work.",
        ],
        note: "Charities we can't build a free website for can still work with us at our normal rates. WordPress websites start from £4,000, and care plans from £80 a month.",
      },
      form: {
        heading: "Apply for a free charity website",
        intro: "Tell us about the charity and what it needs. Fields marked optional can be left blank.",
      },
    },
    services: [
      { name: "Websites", price: "From £4,000", body: "WordPress websites usually cost £4k to £15k, depending on how much custom work is involved.", path: "/services/websites" },
      { name: "Care plans", price: "From £80 a month", body: "Monthly updates, backups, uptime monitoring and time for changes.", path: "/care-plans" },
    ],
    servicesLede:
      "These are our normal prices, for charities we can't build a free website for. We scope every project before we quote, and the first 30-minute call is free.",
    faqs: [
      {
        q: "Do you build charity websites for free?",
        a: "Sometimes. We build some charities' websites for free, but we can't do it for every charity that applies. If we can help, we'll get in touch to talk about what the charity needs.",
      },
      {
        q: "What counts as a charity?",
        a: "Registered charities make the strongest applications, so the form asks for your charity number from the Charity Commission. If the charity isn't registered yet, you can still apply. Tick the not registered yet box on the form.",
      },
      {
        q: "What's included in a free website?",
        a: "It depends on what the charity needs. If we can help, we'll talk it through with you and agree what's included before any work starts.",
      },
      {
        q: "What happens after we apply?",
        a: "The Webgro team reads every application. It may take us a little while to reply. If we can help, we'll get in touch to talk about what the charity needs.",
      },
      {
        q: "Can we pay for a website instead?",
        a: "Yes. Charities can work with us at our normal rates. WordPress websites start from £4,000 and usually cost £4k to £15k, and care plans start from £80 a month. For a paid project, use the contact page.",
      },
    ],
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}

export const INDUSTRIES_META = {
  title: "Industries We Build Websites For | Webgro",
  description:
    "Websites for fashion brands, print businesses, trade and B2B suppliers, and charities, with case studies and prices. Charities can apply for a free site.",
};
