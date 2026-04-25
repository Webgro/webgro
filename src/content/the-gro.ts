export type Accent = "blue" | "violet" | "teal";

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "callout"; text: string; accent?: Accent };

export type Article = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  accent: Accent;
  author: string;
  heroImage: string;
  /** Which service this article supports. Drives the sticky sidebar CTA. */
  relatedService?:
    | "websites"
    | "consultancy"
    | "automation-ai"
    | "seo"
    | "marketing"
    | "design";
  body: ArticleBlock[];
};

export const articles: Article[] = [
  {
    slug: "seo-after-ai-overviews-2026",
    category: "SEO",
    title: "SEO after AI Overviews: the three levers that still move the needle.",
    excerpt:
      "AI Overviews killed half of organic CTR for informational queries. SEO didn't die, it just got harder to fake. Here's what's still working for our clients in 2026.",
    date: "Apr 2026",
    readTime: "6 min read",
    accent: "violet",
    author: "Webgro Studio",
    heroImage: "/articles/seo-ai-overviews.jpg",
    relatedService: "seo",
    body: [
      {
        type: "p",
        text: "Google's AI Overviews changed organic search. We have twelve months of client data to say how much, and the short version is this: traffic didn't evaporate, but the queries that still send clicks are very different from the ones SEO teams were optimising for three years ago.",
      },
      {
        type: "p",
        text: "The teams that adjusted quickly kept growing. The ones that held onto the old playbook lost somewhere between 18 and 42% of organic traffic over the last year, depending on how informational their niche was.",
      },
      { type: "h2", text: "The shape of the loss" },
      {
        type: "p",
        text: "Across ten of our clients, CTR on top-of-funnel informational queries ('what is X', 'how does Y work', 'is Z worth it') dropped 40 to 60% year on year. Google answers those inside the AI Overview now. The click to your page is optional, and most users don't bother.",
      },
      {
        type: "p",
        text: "The clients who'd built their entire content strategy on informational capture saw the steepest falls. The ones with a mix of intents were bruised but intact.",
      },
      { type: "h2", text: "What didn't change" },
      {
        type: "ul",
        items: [
          "Transactional queries ('buy Y', 'Z near me', 'X pricing'). AI Overviews are cautious here. Commercial intent still drives clicks to your site.",
          "Branded queries. Overviews almost never block a click through to your own brand.",
          "High-consideration research. Two-sided comparison articles that genuinely earn trust still pull clicks when the buyer wants more than a summary.",
          "Local and in-person intent. Maps, directories, and brand presence matter more than ever.",
        ],
      },
      {
        type: "callout",
        text: "Overviews killed the top of funnel, not the whole funnel. The revenue end is still intact.",
        accent: "violet",
      },
      { type: "h2", text: "Lever 1. Become a source AI cites" },
      {
        type: "p",
        text: "AI Overviews cite their sources. Being cited is the new rank one, and citation is worth something even when the click doesn't happen. Users read the citation, remember the brand, and come back for the transactional query later.",
      },
      {
        type: "p",
        text: "We've had three clients enter citation lists on queries they'd never ranked in the organic top 10 for. The mechanism isn't mysterious:",
      },
      {
        type: "ul",
        items: [
          "Clean, well-structured content with clear answer paragraphs that models can lift cleanly.",
          "Genuine subject-matter authority: named authors, expertise signals, reviews from trusted peers.",
          "Schema markup. FAQ, Article, and Product are still free rank insurance.",
          "Fresh-enough content. Models cite recent sources disproportionately.",
        ],
      },
      { type: "h2", text: "Lever 2. Double down on the commercial floor" },
      {
        type: "p",
        text: "If transactional queries still convert, and they do, the smart move is to stop chasing flat informational traffic and redirect that effort into pages that match buying intent.",
      },
      {
        type: "p",
        text: "For a retail client, we paused 40% of the blog calendar and redirected the budget to twenty net-new category pages, product comparison tables, and a 'find the right X' quiz. Organic revenue went up 31% in six months while total sessions dropped 8%.",
      },
      {
        type: "p",
        text: "Traffic is a vanity metric now. Revenue per query is the real number.",
      },
      { type: "h2", text: "Lever 3. Measure what SEO actually delivers" },
      {
        type: "p",
        text: "The old SEO dashboard (rankings, sessions, impressions) tells you less every quarter. The useful metrics now are:",
      },
      {
        type: "ul",
        items: [
          "Branded search volume. A real leading indicator of mind-share. If Overviews are citing you, this number climbs.",
          "Share of voice on transactional SERPs. Rank tracking on your revenue-earning queries only, not a vanity set of 500 keywords.",
          "Assisted conversions via organic. Most organic value is now assist, not last-click.",
          "Citation rate in AI Overviews. Tooling is still poor but improving. Manual spot-checks on your top fifty commercial queries work well enough.",
        ],
      },
      { type: "h2", text: "Our default SEO stack in 2026" },
      {
        type: "ol",
        items: [
          "Schema audit on first engagement. A single afternoon's work can move CTR 3 to 7% on existing content.",
          "Commercial floor first, informational second. Ship the category, comparison, and product pages before the blog.",
          "One citable pillar per quarter. Deep, genuine expertise, not 500-word fluff. The goal is to be the piece AI lifts from.",
          "Kill decay monthly, not yearly. The rank decay cycle is faster now because Google retrains Overviews more often.",
          "Measure branded search every month. It's the cleanest signal that your SEO is actually paying off.",
        ],
      },
      { type: "h2", text: "Don't panic, plan" },
      {
        type: "p",
        text: "SEO isn't dead. The part of SEO that was always a bit lazy (generic informational content farming) is dead, and good riddance. What replaces it is harder and slower, but the payoff is real when it compounds.",
      },
      {
        type: "p",
        text: "If your organic revenue is down year on year, the question isn't 'how do we claw back the traffic'. It's 'which of the three levers are we not pulling?'. Nine times out of ten, it's the commercial floor.",
      },
      {
        type: "p",
        text: "Traffic you can't monetise isn't worth chasing. Traffic that converts is worth more than ever.",
      },
    ],
  },
  {
    slug: "shopify-vs-headless-framework-2026",
    category: "Strategy",
    title: "Shopify vs headless: a framework for choosing in 2026.",
    excerpt:
      "The Shopify-vs-headless debate has become reflexive. The truth is usually less interesting: the right answer depends on six questions nobody's asking.",
    date: "Apr 2026",
    readTime: "6 min read",
    accent: "blue",
    author: "Webgro Studio",
    heroImage: "/articles/shopify-vs-headless.jpg",
    relatedService: "websites",
    body: [
      {
        type: "p",
        text: "The Shopify-vs-headless debate has become reflexive. Somebody gets a Shopify quote, sees someone else's headless case study, and suddenly everyone's arguing ideology instead of trade-offs.",
      },
      {
        type: "p",
        text: "The truth is usually less interesting: the right answer depends on six boring questions nobody's asking.",
      },
      { type: "h2", text: "Why the choice matters more in 2026" },
      {
        type: "p",
        text: "The gap between 'good Shopify' and 'good headless' has never been larger. Shopify has invested heavily in checkout, CDN, AI-product discovery, and Hydrogen, their own headless framework. Custom headless stacks now ship faster than ever with Vercel + AI-assisted generation. Both sides are genuinely more capable than two years ago.",
      },
      {
        type: "p",
        text: "So picking wrong has a higher opportunity cost, not a lower one.",
      },
      { type: "h2", text: "When Shopify is still the right call" },
      {
        type: "ul",
        items: [
          "You ship product regularly and need a zero-friction editor experience",
          "Your team isn't technical, or you don't want dev dependencies in content ops",
          "Your catalogue sits between 50–5,000 SKUs with standard taxonomy",
          "Your integrations are mostly mainstream: Klaviyo, Gorgias, Postscript",
          "You care more about time-to-launch than bespoke UX",
        ],
      },
      {
        type: "p",
        text: "Shopify with a smart theme build still beats headless-for-the-sake-of-it seven times out of ten.",
      },
      { type: "h2", text: "When headless earns its keep" },
      {
        type: "ul",
        items: [
          "Your UX is genuinely unusual: configurators, product builders, AR, complex gifting flows",
          "You have 10,000+ SKUs with faceted navigation that Shopify Search & Discovery strains on",
          "You're building an omnichannel system (web, in-store, wholesale, B2B) all on the same product data",
          "You need sub-800ms TTFB at the 95th percentile and Hydrogen isn't cutting it",
          "Your brand leans on motion, interaction, or editorial content, not a grid and filters",
        ],
      },
      {
        type: "p",
        text: "Headless pays back when the UX is a genuine competitive edge, not when it's vanity.",
      },
      { type: "h2", text: "Five questions we ask every client" },
      {
        type: "ol",
        items: [
          "How often do non-technical people need to edit the site? (Daily → Shopify-lean. Monthly → either.)",
          "Is the UX itself a selling point? (Yes → headless-lean. No → Shopify-lean.)",
          "What's your team composition? (No in-house devs → Shopify. Two-plus engineers → either.)",
          "Are you planning a native app in 18 months? (Yes → headless-lean, unified API layer.)",
          "How much of 'custom' is real and how much is nice-to-have? (Honest answer required.)",
        ],
      },
      {
        type: "callout",
        text: "Choose the problem, not the tool. The tool follows.",
        accent: "blue",
      },
      { type: "h2", text: "Our default position" },
      {
        type: "p",
        text: "If you're under £5M revenue and don't have an in-house engineering team, start on Shopify. The velocity you'll get from the platform outweighs almost every headless benefit at that scale.",
      },
      {
        type: "p",
        text: "Above £5M, or if your brand strategy includes a genuine interaction layer, consider headless seriously, but pick the stack from the problem, not from which framework is trending on Twitter.",
      },
      {
        type: "p",
        text: "The worst outcome isn't picking the 'wrong' platform. It's picking either before you've sat with the questions for an afternoon. An hour of honest discovery saves weeks of rework.",
      },
    ],
  },
  {
    slug: "five-ai-integrations-first-month-roi",
    category: "AI",
    title: "Five AI integrations that paid back in their first month.",
    excerpt:
      "Most agency AI builds are theatre. But a handful have paid back their build cost in week four, not month four. Here's what actually worked.",
    date: "Apr 2026",
    readTime: "4 min read",
    accent: "teal",
    author: "Webgro Studio",
    heroImage: "/articles/five-ai-integrations.jpg",
    relatedService: "automation-ai",
    body: [
      {
        type: "p",
        text: "Every agency is shipping AI features now. Most are theatre. A chatbot nobody uses, an AI-generated blog post that reads like vanilla ChatGPT output, a vanity badge on the homepage. We've built those too. Nobody should pretend otherwise.",
      },
      {
        type: "p",
        text: "But a handful of AI integrations have paid back their build cost in week four, not month four. Here's what worked.",
      },
      { type: "h2", text: "1. Product recommendation via LLM + catalogue" },
      {
        type: "p",
        text: "For a fashion client with 80K+ SKUs, we replaced the 'you might also like' block with a small LLM that takes the current product + session behaviour and recommends based on semantic match, not tag overlap.",
      },
      {
        type: "p",
        text: "Build: two weeks. Claude API + embedding cache + product catalogue JSON. Cost: ~£48/month in API spend. Result: +17% AOV on sessions that clicked a recommended product. Paid back in week three.",
      },
      { type: "h2", text: "2. Customer-service triage with human hand-off" },
      {
        type: "p",
        text: "Not a chatbot. A triage layer that reads incoming support emails, categorises them, drafts a response, and queues them for human review. Humans approve or edit before sending.",
      },
      {
        type: "p",
        text: "Build: 10 days. API + email webhook + a simple review UI. Result: 73% of support emails now take under 30 seconds of human time. Response time dropped from 14 hours to 47 minutes. CSAT up 12 points.",
      },
      {
        type: "callout",
        text: "AI-assisted, not AI-automated. Every output crosses a human desk.",
        accent: "teal",
      },
      { type: "h2", text: "3. One-line brief → full creative draft" },
      {
        type: "p",
        text: "For a luxury client's in-house marketing team, we built a tool that takes a one-line brief ('new campaign for AW26 woolens') and returns six headline options, two paragraph versions, twenty social captions, and a shot-list suggestion.",
      },
      {
        type: "p",
        text: "Build: one week. Nothing fancy, just a prompt chain with brand-guide context. Marketing team now ships 3× more concepts weekly. Creative time shifts from first-draft to editing, which is where the craft actually lives.",
      },
      { type: "h2", text: "4. Internal search across Notion + Drive + Gmail" },
      {
        type: "p",
        text: "A team of 12 couldn't find things across four years of accumulated docs. We built an internal search that embeds everything weekly, queries in natural language ('what did we agree with Client X about mobile breakpoints?'), and cites sources.",
      },
      {
        type: "p",
        text: "Build: two weeks. Result: ~8 minutes saved per person per day. For a team of 12, ~400 hours a year. Running cost: £90/month.",
      },
      { type: "h2", text: "5. SEO content-decay automation" },
      {
        type: "p",
        text: "For a B2B SaaS client, we automated the monthly 'which pages are decaying' audit. AI reads GSC data, correlates with content age, identifies pages losing rank, and drafts refresh briefs for the human editor.",
      },
      {
        type: "p",
        text: "Build: one week plus a day of tuning. Result: organic traffic stopped declining year-on-year. Three pages refreshed monthly instead of nothing for a year.",
      },
      { type: "h2", text: "What didn't work (for balance)" },
      {
        type: "p",
        text: "The things that failed: customer-facing chatbots that tried to answer product questions (hallucination rate > 8%, too risky). Fully autonomous social posting (low engagement, felt hollow). End-to-end AI email replies (edge cases ruined the brand voice).",
      },
      {
        type: "p",
        text: "The wins share a shape. AI does the bulk work, humans keep the taste. The failures tried to remove humans entirely.",
      },
      {
        type: "p",
        text: "If you're evaluating AI for your business, pick one with a clear ROI attribution path and a human review gate. You'll ship it in a month. You'll know if it's paying back by week six. That's worth more than a dozen 'AI-first' press releases.",
      },
    ],
  },
  {
    slug: "hidden-cost-cms-complexity",
    category: "Web Craft",
    title: "The hidden cost of CMS complexity, and why less is faster.",
    excerpt:
      "Most CMS rebuilds aren't about features. They're about complexity. Somebody built for every possible future need, and now nobody can update the homepage without a ticket.",
    date: "Mar 2026",
    readTime: "7 min read",
    accent: "violet",
    author: "Webgro Studio",
    heroImage: "/articles/cms-complexity.jpg",
    relatedService: "websites",
    body: [
      {
        type: "p",
        text: "Most CMS rebuilds we're asked to do aren't about features. They're about complexity. Somebody built a site five years ago with every possible future need baked in, and now nobody can update the homepage without opening a ticket.",
      },
      {
        type: "p",
        text: "The thing is, complexity feels like capability. More fields, more post types, more flexibility. It all looks like 'investment' at build time. It rarely is.",
      },
      { type: "h2", text: "The real costs of an overbuilt CMS" },
      {
        type: "ul",
        items: [
          "Editor friction. Simple content changes need developer intervention. Marketing velocity hits zero.",
          "Maintenance burden. Every custom block, integration, and 'flexible' field is a surface that can break.",
          "Onboarding drag. New hires take weeks to learn the admin, not minutes. Agencies charge for the learning curve.",
          "Hidden performance tax. More fields = more queries = slower builds and slower page loads.",
        ],
      },
      {
        type: "p",
        text: "None of these are visible to the person spec'ing the build. All of them compound.",
      },
      { type: "h2", text: "Signs you're overbuilt" },
      {
        type: "ul",
        items: [
          "Your CMS has 40+ custom post types and half are unused",
          "Publishing a blog post requires knowing which of 8 page templates to pick",
          "The dev rebuilds the staging environment once a quarter 'to clean things up'",
          "Marketing asks the agency to make small copy changes",
          "The admin UI has tabs that lead to 404s",
        ],
      },
      { type: "h2", text: "The 80% test" },
      {
        type: "p",
        text: "We ask every client this: what are the eight things your team actually edits every week?",
      },
      {
        type: "p",
        text: "Then we build those into simple, obvious blocks. Everything else becomes 'contact dev for edit', because it should. Most 'flexibility' is used once by the agency at launch and never again.",
      },
      {
        type: "callout",
        text: "Optimise for the top eight. Everything else is a rounding error.",
        accent: "violet",
      },
      { type: "h2", text: "What good looks like" },
      {
        type: "ul",
        items: [
          "Under 10 content types for most sites",
          "A block library of 20–40 curated blocks, not 120 parametric ones",
          "One editor session to publish a blog post, end-to-end",
          "Zero developer involvement for 95% of content changes",
          "Stack maintenance is a quarterly review, not a constant rescue mission",
        ],
      },
      {
        type: "p",
        text: "Simpler CMSes ship faster, move faster, and cost less to maintain. The complexity that felt like capability was a tax in disguise.",
      },
      { type: "h2", text: "Our rule of thumb" },
      {
        type: "p",
        text: "If a content change needs explanation, the CMS is wrong. If every editor's first question is 'which template should I use?', the CMS is wrong. If the admin panel has more options than your homepage has sections, the CMS is wrong.",
      },
      {
        type: "p",
        text: "We've rebuilt enough of these to see the pattern. The next agency comes in and adds more flexibility. The new editor loves it for six weeks. Then they stop using it. Then in two years, somebody asks us to 'tidy it up.'",
      },
      {
        type: "p",
        text: "Start simpler. You'll build less, break less, and ship more. The eight things matter. Everything else is ornament.",
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getOtherArticles(slug: string, limit = 2): Article[] {
  return articles.filter((a) => a.slug !== slug).slice(0, limit);
}
