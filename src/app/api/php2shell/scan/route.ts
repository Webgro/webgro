import { clientIp, rateLimited } from "@/lib/enquiry/rate-limit";
import { normaliseUrl, scanSite } from "@/lib/php2shell/scan";

/**
 * POST /api/php2shell/scan  { url: string }
 * Runs the PHP2Shell check against one public site. One GET request per check
 * (plus redirects), so the limits below are about stopping the checker being
 * used as a crawler rather than protecting the sites it reads.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (rateLimited(`php2shell:${ip}`, 20, 60 * 60_000)) {
    return json({ ok: false, error: "You've run a lot of checks in the last hour. Please try again later." }, 429);
  }

  const body = (await req.json().catch(() => null)) as { url?: unknown } | null;
  const url = typeof body?.url === "string" ? body.url : "";
  if (!url.trim()) return json({ ok: false, error: "Type in your website address." }, 400);

  // A few checks per site per IP each minute is plenty, and stops a loop hammering one site.
  const host = normaliseUrl(url)?.hostname ?? url.trim().toLowerCase();
  if (rateLimited(`php2shell:${ip}:${host}`, 3, 60_000)) {
    return json({ ok: false, error: "You've just checked that site. Give it a minute and try again." }, 429);
  }

  const result = await scanSite(url);
  console.log(`[php2shell] ${result.host} ${result.verdict}${result.phpVersion ? ` ${result.phpVersion}` : ""}`);
  return json({ ok: true, result });
}
