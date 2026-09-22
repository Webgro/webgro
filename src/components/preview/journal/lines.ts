import type { Article } from "@/content/the-gro";

/** Everything the index and the "keep reading" rows need. The body stays on the server. */
export type ArticleSummary = Omit<Article, "body">;

export function summarise(article: Article): ArticleSummary {
  const { slug, category, title, excerpt, date, readTime, accent, author, heroImage, relatedService } = article;
  return { slug, category, title, excerpt, date, readTime, accent, author, heroImage, relatedService };
}

/**
 * Breaks a headline into balanced lines of at most `max` characters, the way
 * a sub-editor would: the fewest lines that fit, then the most even split of
 * those lines. Done on the server so the masked line-by-line reveal can run
 * as plain CSS on first paint, with no measuring and no flash.
 */
export function setLines(text: string, max: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const n = words.length;
  if (n === 0) return [];

  const width = (from: number, to: number) => {
    let w = to - from - 1;
    for (let i = from; i < to; i++) w += words[i].length;
    return w;
  };
  const fits = (from: number, to: number) => to - from === 1 || width(from, to) <= max;

  let count = 1;
  let start = 0;
  for (let i = 1; i <= n; i++) {
    if (!fits(start, i)) {
      count++;
      start = i - 1;
    }
  }

  // cost[k][i]: the lowest sum of squared line widths for the first i words set in k lines.
  const cost: number[][] = Array.from({ length: count + 1 }, () => Array<number>(n + 1).fill(Infinity));
  const from: number[][] = Array.from({ length: count + 1 }, () => Array<number>(n + 1).fill(0));
  cost[0][0] = 0;
  for (let k = 1; k <= count; k++) {
    for (let i = k; i <= n; i++) {
      for (let j = k - 1; j < i; j++) {
        if (cost[k - 1][j] === Infinity || !fits(j, i)) continue;
        const c = cost[k - 1][j] + width(j, i) ** 2;
        if (c < cost[k][i]) {
          cost[k][i] = c;
          from[k][i] = j;
        }
      }
    }
  }
  if (cost[count][n] === Infinity) return [text];

  const lines: string[] = [];
  let end = n;
  for (let k = count; k >= 1; k--) {
    const j = from[k][end];
    lines.unshift(words.slice(j, end).join(" "));
    end = j;
  }
  return lines;
}

/** Published copy is left alone, but an em dash never reaches the page. */
const EM_DASH = new RegExp(`\\s*${String.fromCharCode(8212)}\\s*`, "g");
export const tidy = (s: string) => s.replace(EM_DASH, ", ");

const NUMBER_WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
export const inWords = (n: number) => NUMBER_WORDS[n] ?? String(n);
export const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const headingId = (text: string, index: number) =>
  `${text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section"}-${index}`;
