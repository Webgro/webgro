/**
 * Copy and data for the local pages: /web-design/<town> and the Berkshire hub.
 *
 * Facts come from src/content/work.ts, the concept's services and about copy,
 * and reviewData.ts. Client locations are only stated where the client's own
 * website says so:
 *   - ANYPRINT describes itself as Bracknell's local commercial print room.
 *     Don't mention any ownership connection to Webgro (the owner's choice).
 *   - Architectural FX are at Unit 16, The Business Centre, Molly Millars Lane,
 *     Wokingham (their website footer).
 *   - Paragon Freight list offices at 329 Doncastle Road, Bracknell, and in
 *     Hamilton, Lanarkshire (paragonfreight.com/contact).
 *   - F&P Agency's office is at Lily Hill House, Bracknell, and its service
 *     areas include Ascot, Maidenhead and Windsor.
 *   - Space 4 U Self Storage operate sites in Bracknell and Windsor.
 *   - Little Muddy Boots list classes in Ascot, Bracknell, Maidenhead and
 *     Wokingham, among other towns.
 * Driving times are approximate and deliberately rounded up.
 */

export type TownSlug = "bracknell" | "reading" | "wokingham" | "windsor" | "maidenhead";

export type Fact = { label: string; value: string };
export type Faq = { q: string; a: string };

export type LocalCase = {
  slug: string;
  /** Where the client is based or works, only when their own site says so. */
  where?: string;
  line: string;
  figure?: { value: string; label: string };
};

export type LocalService = { name: string; price: string; body: string; path: string };

/**
 * Two real screenshots of one of the clients the page names, shown in a
 * browser window with the same site on a phone in front of it. Sources and
 * alt text match the case study in src/content/work.ts.
 */
export type LocalShots = {
  desktop: { src: string; alt: string; url: string; w: number; h: number };
  phone: { src: string; alt: string; w: number; h: number };
};

export type Town = {
  slug: TownSlug;
  name: string;
  meta: { title: string; description: string };
  /** Schema.org type for areaServed. */
  areaType: "City" | "AdministrativeArea";
  /** Short driving time, shown on the map label and the hub list. */
  drive: string;
  hero: { lines: string[]; brush: string; intro: string; facts: Fact[] };
  travel: { heading: string; body: string[] };
  business: { label: string; heading: string; body: string[]; services: LocalService[] };
  work: { heading: string; intro: string; cases: LocalCase[]; shots: LocalShots };
  /** Name of a featured Google review in reviewData.ts. Bracknell shows the full reviews section instead. */
  review?: string;
  faqs: Faq[];
  /** One line for the Berkshire hub list. */
  hubLine: string;
};

export const OFFICE = {
  street: "12 Longshot Lane",
  town: "Bracknell, Berkshire",
  postcode: "RG12 1RL",
  map: "https://maps.google.com/?q=12+Longshot+Lane+Bracknell+RG12+1RL",
  phone: "01344 231 119",
  phoneHref: "tel:+441344231119",
};

/* ── Service rows, with the prices on the services pages ─────────────────── */

const S = {
  websites: (body: string): LocalService => ({ name: "Websites", price: "From £4,000", body, path: "/services/websites" }),
  seo: (body: string): LocalService => ({ name: "SEO", price: "From £750 a month", body, path: "/services/seo" }),
  consultancy: (body: string): LocalService => ({ name: "Consultancy", price: "£400 a day", body, path: "/services/consultancy" }),
  automation: (body: string): LocalService => ({ name: "Automation and AI", price: "Priced per project", body, path: "/services/automation-ai" }),
  design: (body: string): LocalService => ({ name: "Design", price: "£80 an hour", body, path: "/services/design" }),
  email: (body: string): LocalService => ({ name: "Email marketing", price: "From £800 a month, plus setup", body, path: "/services/marketing/email-marketing" }),
  ppc: (body: string): LocalService => ({ name: "Google Ads and Meta Ads", price: "From £1,000 a month, plus ad budget", body, path: "/services/marketing/ppc" }),
  social: (body: string): LocalService => ({ name: "Social media", price: "From £400 a month", body, path: "/services/marketing/social-media" }),
  care: (body: string): LocalService => ({ name: "Care plans", price: "From £80 a month", body, path: "/care-plans" }),
};

const RATING: Fact = { label: "Google rating", value: "5.0 from 14 reviews" };

/* ── Towns ───────────────────────────────────────────────────────────────── */

export const towns: Town[] = [
  {
    slug: "bracknell",
    name: "Bracknell",
    meta: {
      title: "Web Design in Bracknell | Webgro",
      description:
        "Shopify and WordPress websites from a four-person studio at 12 Longshot Lane, Bracknell. Meet the team at the office. Websites from £4,000.",
    },
    areaType: "City",
    drive: "Our office",
    hero: {
      lines: ["Web design", "in Bracknell"],
      brush: "Bracknell",
      intro:
        "Webgro is a four-person studio at 12 Longshot Lane in Bracknell. We design and build Shopify and WordPress websites, and run SEO, email, paid ads and social media for businesses in the town and across the UK.",
      facts: [
        { label: "Our office", value: "12 Longshot Lane, RG12 1RL" },
        { label: "Meetings", value: "At our office, at yours, or on a call" },
        { label: "Awards", value: "Best Web Design Agency in Berkshire, 2020" },
      ],
    },
    travel: {
      heading: "Our office in Bracknell",
      body: [
        "The whole team works from the office on Longshot Lane: Michael and Lily, who started the business in 2012, and Matt and Kira. If your business is in Bracknell, it's easy to meet in person, here or at your premises.",
        "Most projects start with a free 30-minute call. After that we send a written proposal within three working days, covering the scope, timeline and price.",
      ],
    },
    business: {
      label: "Businesses in Bracknell",
      heading: "Websites for Bracknell businesses",
      body: [
        "Bracknell has a lot of business parks and industrial estates, from small trade firms to company head offices, as well as the shops and services in and around the town centre.",
        "Our local projects range from WordPress sites that bring in enquiries to Shopify shops, rebuilds of slow older sites, and SEO for businesses that want to be found in local searches.",
      ],
      services: [
        S.websites("Shopify and WordPress, designed and built in the office. WordPress builds usually cost £4k to £15k, and Shopify rebuilds £5k to £25k."),
        S.seo("Technical fixes, content and monthly reporting, covering Google and AI search."),
        S.email("Automated flows and campaigns in Klaviyo for businesses that sell online."),
        S.ppc("Google and Meta campaigns, managed week to week against your margins."),
        S.consultancy("Senior eCommerce advice on strategy, platforms and growth, booked by the day."),
        S.automation("Custom tools that take repetitive work off your team, built into the systems you already use."),
        S.design("Logos, brand identity and design systems."),
        S.care("Updates, backups and monitoring once your site is live."),
      ],
    },
    work: {
      heading: "Work for Bracknell businesses",
      shots: {
        desktop: { src: "/work/anyprint/live-categories.jpg", alt: "ANYPRINT homepage product categories", url: "any-print.co.uk", w: 1440, h: 950 },
        phone: { src: "/work/anyprint/live-mobile-home.jpg", alt: "ANYPRINT homepage on a phone", w: 700, h: 1515 },
      },
      intro:
        "These clients are based in Bracknell or have sites here. We also work with businesses across the UK, including Gieves & Hawkes on Savile Row and Twisted Tailor in London.",
      cases: [
        {
          slug: "paragon-freight",
          where: "Bracknell and Hamilton",
          line: "Paragon Freight have an office on Doncastle Road in Bracknell. We redesigned their WordPress site, added a currency selector for enquiries from abroad, and run their social media.",
        },
        {
          slug: "fandp-agency",
          where: "Bracknell",
          line: "F&P Agency is an estate agency with its office in Bracknell. We redesigned their WordPress site over twelve weeks to match a rebrand towards the luxury end of the market.",
        },
        {
          slug: "space-4-u-self-storage",
          where: "Bracknell and Windsor",
          line: "Space 4 U have storage sites in Bracknell and Windsor. We rebuilt their WordPress site in four weeks around unit sizes, prices and enquiries.",
        },
        {
          slug: "little-muddy-boots",
          where: "Bracknell, Wokingham, Ascot, Maidenhead and other towns",
          line: "Little Muddy Boots run classes in Bracknell and several other towns. Their new WordPress site has a postcode search that tells visitors whether there's a class in their area.",
        },
        {
          slug: "anyprint",
          where: "Bracknell",
          line: "ANYPRINT is a Bracknell print business. We redesigned and rebuilt their WordPress site with page speed as the main requirement.",
          figure: { value: "99", label: "Lighthouse performance, up from 54" },
        },
      ],
    },
    faqs: [
      {
        q: "Can we meet you in Bracknell?",
        a: "Yes. Our office is at 12 Longshot Lane, Bracknell, RG12 1RL, and the whole team works there. You can come to us, we can come to you, or we can talk on a call. The first conversation is a free 30-minute discovery call.",
      },
      {
        q: "How much does a website cost?",
        a: "Websites start from £4,000. WordPress builds usually cost between £4k and £15k, and Shopify rebuilds between £5k and £25k. After the first call we send a written proposal within three working days, with the scope, timeline and price.",
      },
      {
        q: "Do you look after the website after launch?",
        a: "Yes. Care plans start from £80 a month and cover updates, backups and monitoring. We can also run your SEO, from £750 a month, or your email marketing, paid ads and social media once the site is live.",
      },
      {
        q: "Have you worked with other businesses in Bracknell?",
        a: "Yes. Recent Bracknell projects include websites for Paragon Freight, F&P Agency and Space 4 U Self Storage, who have sites in Bracknell and Windsor. We also rebuilt the site for ANYPRINT, a Bracknell print room. In 2020 we were named Best Web Design Agency in Berkshire.",
      },
    ],
    hubLine: "Our office. Clients here include Paragon Freight, F&P Agency and Space 4 U.",
  },

  {
    slug: "reading",
    name: "Reading",
    meta: {
      title: "Web Design for Reading Businesses | Webgro",
      description:
        "Shopify and WordPress websites, SEO and consultancy for Reading businesses, from our Bracknell studio about half an hour away. Websites from £4,000.",
    },
    areaType: "City",
    drive: "About 30 min",
    hero: {
      lines: ["Web design", "for businesses", "in Reading"],
      brush: "Reading",
      intro:
        "We're a Shopify and WordPress studio in Bracknell, about half an hour from Reading by car. We build websites for Reading businesses and run their SEO and marketing, working with them on calls and in person.",
      facts: [
        { label: "From our office", value: "About 30 minutes by car" },
        { label: "Meetings", value: "Video calls, our office, or yours" },
        RATING,
      ],
    },
    travel: {
      heading: "Getting to us from Reading",
      body: [
        "Our only office is in Bracknell, at 12 Longshot Lane. From central Reading it's about half an hour by car, most of it on the A329(M), depending on traffic.",
        "Most of our work with Reading clients happens on video calls and by email. We meet in person when it helps, such as at the start of a project or for design reviews, either in Bracknell or at your office.",
      ],
    },
    business: {
      label: "Businesses in Reading",
      heading: "Websites for Reading businesses",
      body: [
        "Reading has a large office and technology sector, along with retail and professional services. Many businesses in the town sell to other businesses, so their websites need to explain a service clearly and turn visits into enquiries.",
        "For those sites we usually recommend WordPress, which suits content-led sites and is easy for your team to edit. If you sell products online, Shopify is usually the better fit.",
      ],
      services: [
        S.websites("WordPress builds for service and B2B firms usually cost £4k to £15k. Shopify rebuilds cost £5k to £25k."),
        S.seo("Technical fixes, content and monthly reporting. One-off audits start from £1,000."),
        S.consultancy("For in-house marketing and digital teams that need senior eCommerce advice without a full-time hire."),
        S.ppc("Google Ads and Meta Ads, with reporting on what each campaign brings in."),
      ],
    },
    work: {
      heading: "B2B and service work",
      shots: {
        desktop: { src: "/work/origin-architectural/live-collection.jpg", alt: "Origin Architectural preassembled posts collection page", url: "originarchitectural.co.uk/collections/preassembled-posts", w: 1440, h: 950 },
        phone: { src: "/work/origin-architectural/live-mobile-product.jpg", alt: "Origin Architectural Juliet balcony product page on a phone", w: 700, h: 1515 },
      },
      intro:
        "None of these clients are based in Reading, though Paragon Freight have an office in Bracknell. We've picked them because they sell to other businesses, like many firms in the town.",
      cases: [
        {
          slug: "paragon-freight",
          where: "Bracknell and Hamilton",
          line: "A WordPress redesign for a freight business that gets enquiries from the EU, the Middle East and North America. We added a currency selector, and we run their social media.",
        },
        {
          slug: "toughcode",
          line: "A single landing page for a UK manufacturer that makes oral pouch products for other brands. It covers their capabilities, facility and process, and ends with a way to book a meeting.",
        },
        {
          slug: "sublishop",
          line: "A Shopify relaunch for a supplier to the print trade, plus two AI apps for stock planning and tracking competitors' prices.",
          figure: { value: "+240%", label: "sales in the first three months" },
        },
        {
          slug: "origin-architectural",
          line: "A move from WordPress to Shopify with a live Smart Glazier integration, so trade product data, pricing and availability come from one system.",
          figure: { value: "10+", label: "developer hours saved per month" },
        },
      ],
    },
    review: "Victoria Short",
    faqs: [
      {
        q: "Do you have an office in Reading?",
        a: "No. Our only office is in Bracknell, about 30 minutes from central Reading by car. We work with Reading clients on video calls and by email, and meet in person at either office when it's useful.",
      },
      {
        q: "Do you build websites for B2B and professional services firms?",
        a: "Yes. Recent examples include Paragon Freight, whose site has a currency selector for enquiries from abroad, and a landing page for Tough Code, a UK manufacturer that makes products for other brands. For service businesses we usually build on WordPress.",
      },
      {
        q: "Can you help us rank in Google searches in Reading?",
        a: "SEO starts from £750 a month and covers technical fixes, content and monthly reporting, including how often AI tools such as ChatGPT cite you. We start with an audit so you know what's realistic before you commit. One-off audits start from £1,000.",
      },
      {
        q: "Can you work alongside our in-house team?",
        a: "Yes. Consultancy is £400 a day. At Gieves & Hawkes we work with the in-house team week to week on strategy, platform decisions and specialist projects.",
      },
    ],
    hubLine: "About 30 minutes. B2B and professional services firms, and SEO.",
  },

  {
    slug: "wokingham",
    name: "Wokingham",
    meta: {
      title: "Web Design in Wokingham | Webgro",
      description:
        "WordPress and Shopify websites for Wokingham businesses, from a small studio in Bracknell about 15 minutes away. Websites from £4,000, care from £80 a month.",
    },
    areaType: "City",
    drive: "About 15 min",
    hero: {
      lines: ["Web design", "in Wokingham"],
      brush: "Wokingham",
      intro:
        "Webgro is a small web design studio in Bracknell, about 15 minutes' drive from Wokingham. We build WordPress and Shopify websites for local businesses, and look after them once they're live.",
      facts: [
        { label: "From our office", value: "About 15 minutes by car" },
        { label: "Meetings", value: "In person or on a call" },
        { label: "Websites", value: "From £4,000" },
      ],
    },
    travel: {
      heading: "Getting to us from Wokingham",
      body: [
        "Our office is at 12 Longshot Lane in Bracknell, about 15 minutes from Wokingham by car. That makes it easy to meet in person, at our office or at yours.",
        "We don't have an office in Wokingham. Everyone works from the Bracknell office, so the people you meet are the people who build your site.",
      ],
    },
    business: {
      label: "Businesses in Wokingham",
      heading: "Websites for Wokingham businesses",
      body: [
        "Wokingham is a market town with a lot of new housing around it, and many of its businesses are independent shops, trades and local services. Their websites need to show people nearby what's on offer and make it easy to book or get in touch.",
        "We usually build these sites on WordPress, set up so you can edit every page yourself. Smaller sites sit towards the lower end of our £4k to £15k range for WordPress.",
      ],
      services: [
        S.websites("WordPress sites for local businesses, usually £4k to £15k. Shopify if you sell products online."),
        S.care("Monthly updates, backups and uptime monitoring after launch."),
        S.seo("Being found when people nearby search for what you do, with a report every month."),
        S.design("Logos and brand identity, if you need them before the website."),
      ],
    },
    work: {
      heading: "Work for Wokingham businesses",
      shots: {
        desktop: { src: "/work/architectural-fx/live-products.jpg", alt: "Architectural FX products page with search and filters", url: "architecturalfx.co.uk/products", w: 1440, h: 950 },
        phone: { src: "/work/architectural-fx/live-mobile-product.jpg", alt: "Architectural FX product page on a phone", w: 700, h: 1515 },
      },
      intro:
        "Architectural FX are based on Molly Millars Lane in Wokingham, and Little Muddy Boots run classes in the town. The other two projects are for businesses with similar needs: clear information and an easy way to book or enquire.",
      cases: [
        {
          slug: "architectural-fx",
          where: "Wokingham",
          line: "Architectural FX supply LED lighting to architects and specifiers. We built a WordPress plugin that publishes their catalogue from a Google Sheet, with a configurator that produces spec sheets.",
          figure: { value: "128", label: "DWG drawings moved into WordPress" },
        },
        {
          slug: "little-muddy-boots",
          where: "Wokingham, Bracknell and other towns",
          line: "A mobile-first WordPress redesign with a simpler booking flow and a postcode search that shows visitors straight away whether there's a class in their area.",
        },
        {
          slug: "space-4-u-self-storage",
          where: "Bracknell and Windsor",
          line: "A four-week WordPress redesign built around what storage customers look for: the unit sizes, what they cost and how to get one.",
        },
        {
          slug: "threadology",
          line: "A mobile-first WordPress site on a block theme, built in six weeks. The team can update any page without contacting us.",
        },
      ],
    },
    review: "Bradley Ashton",
    faqs: [
      {
        q: "How far is your office from Wokingham?",
        a: "Our office in Bracknell is about 15 minutes from Wokingham by car. We can meet at your premises or ours, or talk on a call if that's easier.",
      },
      {
        q: "Have you worked with businesses in Wokingham?",
        a: "Yes. Architectural FX, a lighting distributor on Molly Millars Lane, publish their product catalogue from a Google Sheet through a WordPress plugin we built. Little Muddy Boots, who run classes in Wokingham, have a WordPress site we redesigned.",
      },
      {
        q: "Is a £4,000 website realistic for a small business?",
        a: "Yes, for a focused WordPress site. WordPress builds usually cost between £4k and £15k, depending on the number of pages and any custom features. Space 4 U's redesign took four weeks, and Little Muddy Boots' took five.",
      },
      {
        q: "Can the website show which areas we cover?",
        a: "Yes. For Little Muddy Boots we built a postcode search that tells visitors straight away whether there's a class near them. The same approach works for trades and services that cover set areas.",
      },
      {
        q: "Can we update the website ourselves?",
        a: "Yes. We set up WordPress sites so your team can edit the pages without a developer. Threadology's team update any page on their site themselves.",
      },
    ],
    hubLine: "About 15 minutes. Clients here include Architectural FX and Little Muddy Boots.",
  },

  {
    slug: "windsor",
    name: "Windsor",
    meta: {
      title: "Web Design in Windsor | Webgro",
      description:
        "Websites, online booking and social media for Windsor businesses, from our Bracknell studio about 25 minutes away. Websites from £4,000.",
    },
    areaType: "City",
    drive: "About 25 min",
    hero: {
      lines: ["Web design", "in Windsor"],
      brush: "Windsor",
      intro:
        "We're a Shopify and WordPress studio in Bracknell, about 25 minutes from Windsor by car. We build websites for Windsor businesses and can run their social media, SEO and paid ads once the site is live.",
      facts: [
        { label: "From our office", value: "About 25 minutes by car" },
        { label: "Meetings", value: "Our office, yours, or a call" },
        { label: "Social media", value: "From £400 a month" },
      ],
    },
    travel: {
      heading: "Getting to us from Windsor",
      body: [
        "Our office is in Bracknell, at 12 Longshot Lane. Windsor is about 25 minutes away by car, depending on traffic, so meeting in person is straightforward.",
        "We don't have an office in Windsor. Two of our clients work in the area: Space 4 U Self Storage have a storage site there, and Windsor is one of F&P Agency's service areas.",
      ],
    },
    business: {
      label: "Businesses in Windsor",
      heading: "Websites for Windsor businesses",
      body: [
        "A lot of Windsor's businesses are in tourism, hospitality and retail, serving visitors as well as people who live locally. Visitors often find these businesses on their phones, so the site needs to load quickly on mobile and make booking or enquiring easy.",
        "We build every site mobile first. Where a business takes bookings, we can connect the booking system it already uses, as we did for Gieves & Hawkes' made-to-measure appointments.",
      ],
      services: [
        S.websites("Mobile-first WordPress and Shopify sites, with booking systems connected where you need them."),
        S.social("Planned, on-brand posts for your channels, a month at a time."),
        S.seo("Local and national search, with monthly reporting on rankings and traffic."),
        S.design("Brand identity and design for print, social and the website."),
      ],
    },
    work: {
      heading: "Work in and around Windsor",
      shots: {
        desktop: { src: "/work/space-4-u-self-storage/live-quote.jpg", alt: "Space 4 U quote request page", url: "space4uselfstorage.co.uk/get-a-quote", w: 1440, h: 950 },
        phone: { src: "/work/space-4-u-self-storage/live-mobile-home.jpg", alt: "Space 4 U homepage on a phone", w: 700, h: 1515 },
      },
      intro:
        "Space 4 U and F&P Agency both work in Windsor. We've included Gieves & Hawkes for the booking work.",
      cases: [
        {
          slug: "space-4-u-self-storage",
          where: "Windsor and Bracknell",
          line: "Space 4 U run storage sites in Windsor and Bracknell. We rebuilt their WordPress site in four weeks so visitors can see unit sizes and prices and ask for a quote.",
        },
        {
          slug: "fandp-agency",
          where: "Service areas include Windsor, Ascot and Maidenhead",
          line: "An upmarket WordPress redesign for an estate agency whose service areas include Windsor, built over twelve weeks to match their rebrand.",
        },
        {
          slug: "gieves-and-hawkes",
          line: "Made-to-measure appointments are booked on the site through SimplyBookMe, the calendar the team already used, as part of a Shopify rebuild for the Savile Row tailor.",
          figure: { value: "85", label: "mobile Lighthouse score, up from 64" },
        },
      ],
    },
    review: "Steven Hibbert",
    faqs: [
      {
        q: "Can our website take bookings?",
        a: "Yes. Where we can, we connect the booking system you already use. For Gieves & Hawkes we linked SimplyBookMe through its API, so made-to-measure appointments go straight into the team's calendar. For Little Muddy Boots we simplified the booking flow on their WordPress site.",
      },
      {
        q: "Can you meet us in Windsor?",
        a: "Yes. Windsor is about 25 minutes from our Bracknell office by car. We can meet at your premises or ours, or talk on a call.",
      },
      {
        q: "Will the site work well on phones?",
        a: "Yes. We design and build mobile first, and check page speed on mobile before launch. ANYPRINT's rebuilt site scores 99 for Lighthouse performance on mobile.",
      },
      {
        q: "Can you run our social media?",
        a: "Yes. Social media management starts from £400 a month and covers planned, on-brand posts for your channels. We've managed Paragon Freight's social media since redesigning their website.",
      },
    ],
    hubLine: "About 25 minutes. Bookings, social media and mobile-first sites.",
  },

  {
    slug: "maidenhead",
    name: "Maidenhead",
    meta: {
      title: "Web Design in Maidenhead | Webgro",
      description:
        "Shopify and WordPress websites, Google Ads and email marketing for Maidenhead businesses, from our studio in Bracknell about 25 minutes away.",
    },
    areaType: "City",
    drive: "About 25 min",
    hero: {
      lines: ["Web design", "in Maidenhead"],
      brush: "Maidenhead",
      intro:
        "Webgro is a Shopify and WordPress studio in Bracknell, about 25 minutes' drive from Maidenhead. We build websites for Maidenhead businesses and run their Google Ads, email marketing and SEO.",
      facts: [
        { label: "From our office", value: "About 25 minutes by car" },
        { label: "Meetings", value: "Our office, yours, or a video call" },
        { label: "Google Ads", value: "From £1,000 a month, plus ad budget" },
      ],
    },
    travel: {
      heading: "Getting to us from Maidenhead",
      body: [
        "Our only office is in Bracknell, at 12 Longshot Lane, about 25 minutes from Maidenhead by car depending on traffic. We meet Maidenhead clients there, at their own offices, or on video calls.",
        "Little Muddy Boots run classes in Maidenhead, and the town is one of the areas F&P Agency cover.",
      ],
    },
    business: {
      label: "Businesses in Maidenhead",
      heading: "Websites for Maidenhead businesses",
      body: [
        "Maidenhead has a mix of offices, professional services and independent shops, and the Elizabeth line links it directly to central London.",
        "Once a site is live, we can run the paid ads and email marketing that bring in new enquiries and orders. Paid ads are managed week to week against your margins, and email runs on Klaviyo.",
      ],
      services: [
        S.websites("Shopify rebuilds usually cost £5k to £25k, and WordPress builds £4k to £15k."),
        S.ppc("Google and Meta campaigns. We agree a level of spend with you before any budget goes out."),
        S.email("Klaviyo flows, campaigns and segmentation for businesses that sell online."),
        S.consultancy("Senior advice on platforms, growth plans and what to fix first."),
      ],
    },
    work: {
      heading: "Work in Maidenhead and beyond",
      shots: {
        desktop: { src: "/work/little-muddy-boots/live-classes.jpg", alt: "Little Muddy Boots classes page", url: "littlemuddyboots.co.uk/classes", w: 1440, h: 950 },
        phone: { src: "/work/little-muddy-boots/mobile.jpg", alt: "Little Muddy Boots on mobile", w: 1290, h: 2795 },
      },
      intro:
        "Little Muddy Boots and F&P Agency both work in Maidenhead. We've added Fun Cases because we run their paid ads and email marketing.",
      cases: [
        {
          slug: "little-muddy-boots",
          where: "Maidenhead, Bracknell and other towns",
          line: "A mobile-first WordPress booking site with a custom postcode search, replacing a site the business had built itself.",
        },
        {
          slug: "fandp-agency",
          where: "Service areas include Maidenhead, Windsor and Ascot",
          line: "A WordPress redesign for an estate agency moving to the luxury end of the market, with generous typography and real property photography.",
        },
        {
          slug: "fun-cases",
          line: "We run Google and Meta ads for Fun Cases on around £35,000 a month of spend, as well as their Klaviyo email marketing.",
          figure: { value: "8+", label: "blended return on ad spend" },
        },
      ],
    },
    review: "James Kibble",
    faqs: [
      {
        q: "How do meetings work if we're in Maidenhead?",
        a: "Our Bracknell office is about 25 minutes from Maidenhead by car. We can meet there, at your office or on a video call, and the day-to-day work is done by email and phone.",
      },
      {
        q: "How much does it cost to manage Google Ads?",
        a: "PPC management starts from £1,000 a month, plus your ad budget, which is paid to Google or Meta. We agree a level of spend with you, based on your margins, before any budget goes out.",
      },
      {
        q: "Can you move our website from WordPress to Shopify?",
        a: "Yes. We moved Origin Architectural from an over-developed WordPress site to Shopify in three months and connected it to their trade software. Every page can now be edited in under a minute.",
      },
      {
        q: "Do you run email marketing?",
        a: "Yes, on Klaviyo. Email marketing starts from £800 a month plus a setup fee. At Fun Cases, email brings in over 30% of total revenue.",
      },
    ],
    hubLine: "About 25 minutes. Websites, Google Ads and email marketing.",
  },
];

export function getTown(slug: string): Town | undefined {
  return towns.find((t) => t.slug === slug);
}

/* ── The Berkshire hub ───────────────────────────────────────────────────── */

export const berkshire = {
  meta: {
    title: "Web Design in Berkshire | Webgro",
    description:
      "A Shopify and WordPress studio in Bracknell working with businesses in Reading, Wokingham, Windsor, Maidenhead and across Berkshire. Rated 5.0 on Google.",
  },
  hero: {
    lines: ["Web design", "in Berkshire"],
    brush: "Berkshire",
    intro:
      "Webgro is a four-person Shopify and WordPress studio in Bracknell. We work with businesses across Berkshire and the rest of the UK, and in 2020 we were named Best Web Design Agency in Berkshire.",
    facts: [
      { label: "Our office", value: "12 Longshot Lane, Bracknell" },
      RATING,
      { label: "Awards", value: "Five since 2020" },
    ] as Fact[],
  },
  towns: {
    heading: "Where we work in Berkshire",
    body: "Everyone works from our office in Bracknell. The driving times below are approximate and depend on traffic.",
  },
  work: {
    heading: "Work in Berkshire",
    shots: {
      desktop: { src: "/work/paragon-freight/live-services.jpg", alt: "Paragon Freight services on the homepage", url: "paragonfreight.com", w: 1440, h: 950 },
      phone: { src: "/work/paragon-freight/live-mobile-home.jpg", alt: "Paragon Freight homepage on a phone", w: 700, h: 1515 },
    },
    intro:
      "These clients are based in Berkshire or have sites here. We also work with clients elsewhere in the UK and abroad, including Gieves & Hawkes, Twisted Tailor and ValuePet in Ireland.",
    cases: [
      {
        slug: "architectural-fx",
        where: "Wokingham",
        line: "A custom WordPress plugin for a lighting distributor, publishing their catalogue from a Google Sheet, with a configurator that produces spec sheets.",
      },
      {
        slug: "paragon-freight",
        where: "Bracknell and Hamilton",
        line: "A WordPress redesign for a freight business with an office in Bracknell, plus a currency selector and ongoing social media.",
      },
      {
        slug: "space-4-u-self-storage",
        where: "Bracknell and Windsor",
        line: "A WordPress redesign for a self-storage company with sites in Bracknell and Windsor.",
      },
      {
        slug: "fandp-agency",
        where: "Bracknell, covering Windsor, Maidenhead, Ascot and more",
        line: "A WordPress redesign for an estate agency moving to the luxury end of the market.",
      },
      {
        slug: "little-muddy-boots",
        where: "Bracknell, Wokingham, Maidenhead, Ascot and other towns",
        line: "A WordPress booking site with a postcode search that shows visitors whether there's a class near them.",
      },
      {
        slug: "anyprint",
        where: "Bracknell",
        line: "A WordPress rebuild for ANYPRINT, a Bracknell print business, with page speed as the main requirement.",
        figure: { value: "99", label: "Lighthouse performance, up from 54" },
      },
    ] as LocalCase[],
  },
  faqs: [
    {
      q: "Which parts of Berkshire do you work in?",
      a: "All of it. Our office is in Bracknell, and we work with businesses in Reading, Wokingham, Windsor, Maidenhead and elsewhere in the county, as well as across the UK. Meetings can be at our office, at yours, or on a call.",
    },
    {
      q: "Do you only work with Berkshire businesses?",
      a: "No. Clients include Gieves & Hawkes on Savile Row, Twisted Tailor in London and ValuePet in Ireland.",
    },
    {
      q: "Have you won any awards?",
      a: "Yes, five since 2020. We were named Best Web Design Agency in Berkshire in 2020, in South East England in 2021 and in the United Kingdom in 2022. In 2024 we won Best Web Design Agency and Best eCommerce Consultant in South East England.",
    },
    {
      q: "Are you a Shopify Partner?",
      a: "Yes. We build on Shopify and WordPress. Shopify rebuilds usually cost between £5k and £25k, and WordPress builds between £4k and £15k.",
    },
  ] as Faq[],
};
