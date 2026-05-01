import type { NextConfig } from "next";

/**
 * Redirect table for the 2026 redesign.
 *
 * Runs whenever the site is served by Next.js itself (Vercel, Netlify's
 * Next.js runtime, self-hosted node). If the site is deployed behind
 * Apache (20i / cPanel), the equivalent table lives in public/.htaccess
 * and Apache handles it before Next.js gets the request. Keep both in
 * sync if you edit one.
 */
const legacyRedirects = async () => {
  type R = { source: string; destination: string; permanent: true };
  const r = (source: string, destination: string): R => ({
    source,
    destination,
    permanent: true,
  });

  // --- Legacy service-location pages (hundreds, wildcards only) -----------
  // The :city* capture matches any depth of trailing path segments.
  const serviceLocation: R[] = [
    r("/services/web-design-development", "/services/websites"),
    r("/services/web-design-development/:city*", "/services/websites"),
    r("/services/shopify-web-design", "/services/websites"),
    r("/services/shopify-web-design/:city*", "/services/websites"),
    r("/services/wordpress-web-design", "/services/websites"),
    r("/services/wordpress-web-design/:city*", "/services/websites"),
  ];

  // --- Specific services ---------------------------------------------------
  const services: R[] = [
    r("/services/seo-packages", "/services/seo"),
    r("/services/seo", "/services/seo"),
    r("/services/ecommerce", "/services/consultancy"),
    r("/services/maintenance", "/services/websites"),
  ];

  // --- Top-level pages -----------------------------------------------------
  const topLevel: R[] = [
    // `/contact/` (old WordPress) → new dedicated route. Skipping
    // `/contact` → `/contact` because Next.js would redirect to itself.
    r("/request-a-proposal", "/contact"),
    r("/our-work", "/work"),
    r("/our-awards", "/about"),
    r("/blog", "/the-gro"),
  ];

  // --- Categories ----------------------------------------------------------
  const categories: R[] = [
    r("/category/portfolio", "/work"),
    r("/category/portfolio/:slug*", "/work"),
    r("/category/tips-tricks", "/the-gro"),
    r("/category/news", "/the-gro"),
    r("/category/uncategorised", "/the-gro"),
  ];

  // --- Portfolio with a direct equivalent ---------------------------------
  const portfolioDirect: R[] = [
    r("/fun-cases", "/work/fun-cases"),
    r("/twisted-tailor", "/work/twisted-tailor"),
    r("/gieves-and-hawkes", "/work/gieves-and-hawkes"),
    r("/sublishop", "/work/sublishop"),
  ];

  // --- Portfolio we didn't port → /work -----------------------------------
  const portfolioLegacy = [
    "/admiral-cunningham",
    "/middleton-associates",
    "/bms-driveways",
    "/patrick-grant-studio",
    "/kibble-watches",
    "/georgina-bywater",
    "/vagamundo",
    "/anyprint",
    "/kim-duffy",
    "/tc4re",
    "/lawnify",
    "/architectural-fx",
    "/samso-solar",
  ].map((p) => r(p, "/work"));

  // --- Auto-sector PPC landers → /services/websites ------------------------
  const autoLanders = [
    "/elite-autocentre",
    "/longshot-lane-mot",
    "/asj-auto-services",
    "/baileys-garage",
    "/helyer-autos",
    "/ackroyd-ackroyd-autos",
  ].map((p) => r(p, "/services/websites"));

  // --- One-off proposal URLs → homepage ------------------------------------
  const proposals = [
    "/proposal-altos-lighting-ai-demo",
    "/proposal-altos-lighting",
  ].map((p) => r(p, "/"));

  // --- News-style posts with a specific destination ------------------------
  const specificPosts: R[] = [
    r("/broadbridge-design-is-now-webgro", "/about"),
    r("/webgro-nominated-for-best-gardening-website-design-award-by-designrush", "/about"),
    r(
      "/webgro-embarks-on-a-digital-odyssey-with-the-launch-of-gieves-and-hawkes-impeccable-online-presence",
      "/work/gieves-and-hawkes",
    ),
    r("/we-have-moved", "/about"),
    r("/how-to-use-your-webgro-email-address", "/"),
  ];

  // --- Editorial blog posts we didn't port individually → /the-gro --------
  const blogPosts = [
    "/top-tips-for-starting-an-e-commerce-business",
    "/the-benefits-of-hiring-a-professional-web-design-agency",
    "/what-makes-a-great-landing-page",
    "/how-much-should-i-expect-to-pay-for-a-website-design",
    "/how-does-infinite-scrolling-affect-seo",
    "/5-ways-a-blog-can-benefit-your-business",
    "/4-reasons-you-need-to-use-a-business-email-address",
    "/7-tricks-to-increase-your-conversion-rate",
    "/web-accessibility-designing-for-inclusivity",
    "/e-commerce-trends-in-2024-the-future-of-online-shopping",
    "/the-importance-of-mobile-first-web-design",
    "/the-dos-and-donts-of-website-navigation",
    "/how-to-make-your-website-look-more-christmassy-a-guide-to-festive-web-design",
    "/the-unseen-benefits-of-a-dedicated-server-in-website-design",
    "/a-b-testing-your-email-campaigns-a-step-by-step-guide",
    "/email-marketing-101-building-and-growing-your-subscriber-list",
    "/top-seo-tools-every-website-needs-in-2024",
    "/leveraging-shopify-apps-to-enhance-your-online-store",
    "/crafting-compelling-email-campaigns-best-practices-for-marketers",
    "/on-page-vs-off-page-seo-whats-the-difference-and-why-it-matters",
    "/responsive-design-why-its-crucial-for-your-wordpress-website",
    "/squarespace-vs-professional-web-design-which-is-the-better-option",
    "/wix-vs-professional-web-design-which-is-the-better-option",
    "/how-to-appear-on-google-maps-a-comprehensive-guide",
    "/how-to-add-a-user-to-your-google-my-business-listing",
    "/the-benefits-of-ecommerce-consultancy-for-small-businesses",
    "/essential-shopify-plugins-to-supercharge-your-online-store",
    "/wordpress-vs-shopify-which-platform-is-right-for-your-business",
    "/how-to-optimise-your-shopify-store-for-mobile-users",
    "/boost-your-local-seo-tips-for-small-businesses",
    "/seo-best-practices-for-wordpress-a-beginners-guide",
    "/why-seo-is-important-for-local-businesses",
    "/how-a-website-redesign-can-boost-your-conversion-rates",
    "/5-common-web-design-mistakes-that-could-be-hurting-your-business",
    "/is-shopify-plus-worth-it",
    "/the-ultimate-guide-to-optimising-your-shopify-store-for-seo",
    "/why-content-is-king-the-role-of-blogging-in-boosting-seo",
    "/how-to-choose-the-best-e-commerce-platform-for-your-business",
    "/the-10-most-common-reasons-for-abandoned-carts-and-how-to-fix-them",
    "/how-to-improve-your-e-commerce-sites-product-pages-for-maximum-conversions",
    "/is-dropshipping-still-profitable-in-2025",
    "/what-to-do-when-your-online-store-isnt-generating-sales",
    "/the-role-of-customer-reviews-in-e-commerce-success",
    "/how-to-use-email-marketing-to-drive-repeat-sales-for-your-online-store",
    "/how-to-offer-free-shipping-without-hurting-your-profit-margins",
    "/how-to-write-product-descriptions-that-actually-sell",
    "/essential-website-features-every-e-commerce-store-needs",
    "/how-to-optimise-your-product-pages-for-seo",
    "/the-best-free-and-paid-seo-tools-for-e-commerce",
    "/how-blogging-can-boost-your-online-stores-seo-and-sales",
    "/why-internal-linking-is-crucial-for-e-commerce-seo",
    "/what-is-retargeting-and-how-can-it-help-your-e-commerce-business",
    "/how-to-use-user-generated-content-to-increase-sales",
    "/how-to-reduce-bounce-rate-and-keep-visitors-on-your-site-longer",
    "/how-to-handle-negative-reviews-and-turn-them-into-opportunities",
  ].map((p) => r(p, "/the-gro"));

  // --- Old sitemap addresses → the site's own sitemap ----------------------
  const sitemaps: R[] = [
    r("/sitemap_index.xml", "/sitemap.xml"),
    r("/post-sitemap.xml", "/sitemap.xml"),
    r("/page-sitemap.xml", "/sitemap.xml"),
    r("/category-sitemap.xml", "/sitemap.xml"),
    r("/author-sitemap.xml", "/sitemap.xml"),
    r("/e-landing-page-sitemap.xml", "/sitemap.xml"),
  ];

  // --- Conventional feed paths → the canonical RSS at /the-gro/feed.xml ----
  const feeds: R[] = [
    r("/feed.xml", "/the-gro/feed.xml"),
    r("/rss.xml", "/the-gro/feed.xml"),
    r("/feed", "/the-gro/feed.xml"),
    r("/rss", "/the-gro/feed.xml"),
  ];

  return [
    ...serviceLocation,
    ...services,
    ...topLevel,
    ...categories,
    ...portfolioDirect,
    ...portfolioLegacy,
    ...autoLanders,
    ...proposals,
    ...specificPosts,
    ...blogPosts,
    ...sitemaps,
    ...feeds,
  ];
};

const nextConfig: NextConfig = {
  turbopack: {
    root: "/Users/michaelbroadbridge/Desktop/Claude/webgro-site",
  },
  redirects: legacyRedirects,
};

export default nextConfig;
