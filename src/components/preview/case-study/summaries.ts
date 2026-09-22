/**
 * Preview-only summaries for the opening screen of each case study: what the
 * client needed, what we did, and what changed. Every fact here is taken from
 * that case study's own content in src/content/work.ts and only reworded.
 * A case study without an entry falls back to its excerpt.
 */
export type Summary = { ask: string; did: string; changed: string };

export const summaries: Record<string, Summary> = {
  valuepet: {
    ask: "ValuePet needed a new Shopify store, and a way to keep stock in step with their second Shopify store without updating it by hand.",
    did: "We redesigned the store in eight weeks, added a Pet Hub that personalises the shop to each customer's pets, built an app that syncs stock between the two stores, and took over their Klaviyo email marketing.",
    changed: "Average order value went from €42.51 in the week before launch to €69.03 in the week after.",
  },
  "architectural-fx": {
    ask: "Architectural FX had to email their product spreadsheet to us and wait for an import every time a product changed, and their products page took more than six seconds to load.",
    did: "We replaced WooCommerce and two other plugins with one custom WordPress plugin, connected it to their Google Sheet, built new products and product pages with a configurator, and moved 128 DWG drawings off Amazon S3.",
    changed: "The team publish product changes from the sheet themselves, and specifiers can filter the catalogue and download a spec sheet for the configuration they need.",
  },
  "jbvc-foundation": {
    ask: "The Johnson Beharry VC Foundation needed a website that explains its work with vulnerable children clearly.",
    did: "We designed and built a single-page WordPress site in full-screen sections, covering the foundation, its founder, the case for early prevention and its two programmes.",
    changed: "The foundation has a clear, single-page site that sets out its work and programmes.",
  },
  toughcode: {
    ask: "Tough Code needed a landing page to present their UK pouch manufacturing to other brands.",
    did: "We designed and built a single landing page with scroll animations, covering their products, capabilities, facility and process.",
    changed: "Tough Code have one page that takes visitors from what they make to booking a meeting.",
  },
  "fun-cases": {
    ask: "Fun Cases had outgrown its old brand, and the third-party app customers used to design their own cases cost nearly £5,000 a year.",
    did: "We rebranded the business, starting with the logo, and built a new Shopify theme from scratch with our own personaliser in it. We also run their SEO, paid ads and email marketing, and we built the AI tools and warehouse system they use.",
    changed: "Revenue is up 300% over the last five years. Email brings in 30% of revenue, and AI triage has cut customer service hours by 70%.",
  },
  "gieves-and-hawkes": {
    ask: "The first store we built for them, launched in 2024, had come to rely on twelve apps. Each one added a monthly fee and a render-blocking script, and could break when someone else updated it.",
    did: "We rebuilt the theme from scratch in two months and moved eight of those apps into the theme code. The in-house team can edit every section without a developer.",
    changed: "Mobile Lighthouse went from 64 to 85 and the app bill dropped by £300 a month. Gieves also reached number one on Google UK for 'luxury suit'.",
  },
  anyprint: {
    ask: "ANYPRINT's WordPress site was slow. It had a heavy theme, too many plugins and an admin panel nobody enjoyed using.",
    did: "We redesigned the site and rebuilt it on a custom theme, checking every decision against its effect on page speed.",
    changed: "Lighthouse Performance went from 54 to 99, and Accessibility, Best Practices and SEO all reached 100.",
  },
  sublishop: {
    ask: "Sublishop supply the print trade, where customers buy on availability and price. They needed a faster store that converted better, and better information on stock and pricing.",
    did: "We relaunched the store on Shopify and built two AI apps. One recommends what to reorder and when. The other tracks competitors' sales, stock and prices.",
    changed: "Sales were up 240% in the first three months after the relaunch. Both apps are in production.",
  },
  "twisted-tailor": {
    ask: "The store was running eight third-party apps, each with a monthly fee and its own script. Customers also had to remember four different sizes between visits.",
    did: "We rebuilt the Shopify theme from the ground up in eight weeks and rewrote all eight apps as native theme code. We also built MyFitt, which saves a customer's sizes and applies them across the store, and an AI support agent.",
    changed: "The app bill is roughly $250 a month lower, and customer service hours are down 50%.",
  },
  "its-pouch": {
    ask: "it's Pouch were launching a new product line and needed Shopify work to support it, plus emails that matched the brand.",
    did: "We spent four weeks on Shopify development and designed a set of order, shipping and post-purchase emails in the brand's tone.",
    changed: "The new range had the Shopify work it needed to launch. Order confirmations, shipping updates and post-purchase emails now match the rest of the brand.",
  },
  "origin-architectural": {
    ask: "Origin's WordPress site had been over-developed, so every edit needed a developer. Most of their photos were phone shots taken by installers and customers.",
    did: "We moved them to Shopify in three months and connected it to Smart Glazier, the software their trade operation runs on. We also built an AI pipeline that retouches customer photos so the imagery is consistent.",
    changed: "Every page can now be edited in under a minute, which saves more than ten developer hours a month. The conversion rate went up from day one.",
  },
  threadology: {
    ask: "Threadology needed a fast, mobile-first WordPress site that their team could edit easily.",
    did: "We built it in six weeks on a block theme with a focused content model, to the same standard as our more complex projects.",
    changed: "The team can update any page without calling us.",
  },
  "fandp-agency": {
    ask: "F&P Agency were rebranding towards the luxury end of the estate agency market, and their website still reflected the old brand.",
    did: "We redesigned the WordPress site over twelve weeks, using generous typography, real property imagery and a quieter pace.",
    changed: "The site now matches the rebrand and presents F&P as an upmarket agency.",
  },
  "little-muddy-boots": {
    ask: "The original site was self-built. As a service business, Little Muddy Boots needed a professional site that visitors would trust.",
    did: "We redesigned the WordPress site over five weeks, mobile first, with a clearer structure, a simpler booking flow and a custom postcode search.",
    changed: "Visitors can see straight away whether the service covers their area, and the site is built for booking on a phone.",
  },
  "space-4-u-self-storage": {
    ask: "Space 4 U needed a site that showed visitors quickly what unit sizes they offer, what they cost and how to get one.",
    did: "We redesigned the WordPress site in four weeks around unit sizes, transparent pricing and an easy way to enquire.",
    changed: "There's now a direct path from first visit to unit enquiry, and the team can edit the site themselves.",
  },
  "paragon-freight": {
    ask: "Paragon Freight needed a more credible website, and social media to support it between visits.",
    did: "We redesigned the WordPress site over eight weeks and added a currency selector for enquiries from the EU, the Middle East and North America. We've managed their social media since.",
    changed: "Visitors see rates and quotes in their own currency from the first click, and the site and social feed share the same branding.",
  },
};

/**
 * Which existing figures lead the opening screen. Each key is the exact
 * `value` (or, for Lighthouse rows, the generated eyebrow) of a figure that
 * already exists in the case study body. Anything not listed falls back to
 * the first three numeric figures in the body.
 */
export const headlineFigures: Record<string, string[]> = {
  valuepet: ["+62%", "€69.03", "8 weeks"],
  "architectural-fx": ["3", "128", "9"],
  "fun-cases": ["+300%", "30%", "−70%"],
  "gieves-and-hawkes": ["+21", "£300", "#1"],
  anyprint: ["Lighthouse Performance", "Lighthouse Accessibility", "Lighthouse SEO"],
  sublishop: ["+240%", "2"],
  "twisted-tailor": ["8", "$250", "8 weeks"],
  "origin-architectural": ["10+"],
};
