import { articles, type Article, type ArticleBlock } from "@/content/the-gro";

/**
 * RSS 2.0 feed for The Gro at /the-gro/feed.xml.
 *
 * Pre-rendered at build time (force-static) since article content is
 * defined in the-gro.ts and only changes when a new article is
 * committed and re-deployed. Convenience redirects from /feed.xml and
 * /rss.xml live in next.config.ts.
 */

export const dynamic = "force-static";
export const runtime = "nodejs";

const SITE_URL = "https://webgro.co.uk";
const FEED_URL = `${SITE_URL}/the-gro/feed.xml`;
const FEED_TITLE = "The Gro · Webgro Studio";
const FEED_DESCRIPTION =
  "Essays, experiments, and field notes from Webgro Studio. Better websites, AI that earns its keep, and the crossover where the real work happens.";

export async function GET() {
  // Newest first. Articles use a "MMM YYYY" string; treat each as the
  // first of that month at noon UTC for a stable, monotonic ordering.
  const sorted = [...articles].sort((a, b) => parseDate(b.date) - parseDate(a.date));

  const items = sorted
    .map((article) => {
      const url = `${SITE_URL}/the-gro/${article.slug}`;
      const pubDate = new Date(parseDate(article.date)).toUTCString();
      const fullHtml = renderBodyToHtml(article.body);
      const heroImage = article.heroImage
        ? `<enclosure url="${SITE_URL}${article.heroImage}" type="image/jpeg" />`
        : "";

      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(article.category)}</category>
      <dc:creator>${escapeXml(article.author)}</dc:creator>
      <description>${escapeXml(article.excerpt)}</description>
      <content:encoded><![CDATA[${fullHtml}]]></content:encoded>
      ${heroImage}
    </item>`;
    })
    .join("");

  const lastBuildDate = sorted[0] ? new Date(parseDate(sorted[0].date)).toUTCString() : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}/the-gro</link>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en-GB</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <generator>Webgro / Next.js</generator>
    <image>
      <url>${SITE_URL}/brand/logo-white.png</url>
      <title>${escapeXml(FEED_TITLE)}</title>
      <link>${SITE_URL}/the-gro</link>
    </image>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      // Edge cache for an hour, browsers for ten minutes. Articles
      // change rarely; a stale-while-revalidate strategy keeps reader
      // apps snappy without serving truly stale content for long.
      "Cache-Control": "public, max-age=600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

// ---------- helpers ----------

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseDate(dateStr: string): number {
  // Accepts "Apr 2026" and similar. Returns ms-since-epoch for the
  // first of that month at noon UTC. Falls back to "now" so the item
  // still appears in the feed even if a date string is malformed.
  const m = dateStr.match(/(\w{3})\s+(\d{4})/);
  if (!m) return Date.now();
  const month = MONTHS[m[1]] ?? 0;
  const year = parseInt(m[2], 10);
  return Date.UTC(year, month, 1, 12, 0, 0);
}

function renderBodyToHtml(body: Article["body"]): string {
  return body.map(blockToHtml).join("\n");
}

function blockToHtml(block: ArticleBlock): string {
  switch (block.type) {
    case "p":
      return `<p>${inlineEscape(block.text)}</p>`;
    case "h2":
      return `<h2>${inlineEscape(block.text)}</h2>`;
    case "h3":
      return `<h3>${inlineEscape(block.text)}</h3>`;
    case "ul":
      return `<ul>${block.items.map((i) => `<li>${inlineEscape(i)}</li>`).join("")}</ul>`;
    case "ol":
      return `<ol>${block.items.map((i) => `<li>${inlineEscape(i)}</li>`).join("")}</ol>`;
    case "quote":
      return `<blockquote><p>${inlineEscape(block.text)}</p></blockquote>`;
    case "callout":
      // Render callouts as a pull-quote-ish styled paragraph that any
      // RSS reader can display; the on-site styling can't be carried
      // through.
      return `<aside style="border-left:3px solid #2D8DFF;padding:0 0 0 1em;font-style:italic;"><p>${inlineEscape(block.text)}</p></aside>`;
  }
}

/** Escape characters that have special meaning in HTML when emitted
 *  inside CDATA. Apostrophes / quotes don't need escaping inside
 *  CDATA, only the ampersand and angle brackets to keep the HTML
 *  itself well-formed for readers that re-parse it.  */
function inlineEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Escape for a plain XML element body (no CDATA). */
function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
