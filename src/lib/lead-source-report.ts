import { z } from "zod";

/**
 * The server side of lib/lead-source.ts: checks what the browser sent and turns
 * it into rows for the team email. The browser's word is taken as a hint, so a
 * bad value is dropped and never fails the submission.
 */
export const LeadSourceBody = z
  .object({
    referrer: z.string().trim().max(200).optional(),
    landing: z.string().trim().max(500).optional(),
  })
  .optional()
  .catch(undefined);

export type CheckedLeadSource = z.infer<typeof LeadSourceBody>;

const SEARCH_ENGINE: [RegExp, string][] = [
  [/(^|\.)google\.[a-z.]+$/, "Google search"],
  [/(^|\.)bing\.com$/, "Bing search"],
  [/(^|\.)duckduckgo\.com$/, "DuckDuckGo search"],
];

/** No control characters, so nothing can sneak into the email. */
const clean = (s: string) => s.replace(/\p{Cc}+/gu, " ").trim();

function cameFrom(source: NonNullable<CheckedLeadSource>): string {
  const params = new URLSearchParams((source.landing ?? "").split("?")[1] ?? "");
  if (params.has("gclid") || params.has("gbraid") || params.has("wbraid")) return "Google Ads";
  if (params.has("msclkid")) return "Microsoft Ads";
  const campaign = params.get("utm_source");
  if (campaign) return clean([campaign, params.get("utm_medium")].filter(Boolean).join(" / "));
  if (params.has("fbclid")) return "Facebook or Instagram";
  const referrer = clean(source.referrer ?? "");
  if (!referrer) return "Direct, or the source was hidden";
  return SEARCH_ENGINE.find(([host]) => host.test(referrer))?.[1] ?? referrer;
}

/** "Came from" and "Landed on" rows. Nothing if the browser sent nothing. */
export function leadSourceRows(source: CheckedLeadSource): [string, string][] {
  if (!source) return [];
  return [
    ["Came from", cameFrom(source)],
    ...(source.landing ? ([["Landed on", clean(source.landing)]] as [string, string][]) : []),
  ];
}
