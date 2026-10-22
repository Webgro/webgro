import dns from "node:dns";
import http from "node:http";
import https from "node:https";
import net from "node:net";
import zlib from "node:zlib";
import type { LookupFunction } from "node:net";
import { checkVersion, fixFor, isDistroBuild, parseVersion } from "./versions";

/**
 * The PHP2Shell URL check. It makes one ordinary GET request for the page the
 * visitor typed in (following up to five redirects), the same request a browser
 * makes, and reads what the server says about itself. It never sends exploit
 * payloads or probes other paths, so it's safe to run against any public site.
 *
 * Every hostname is resolved through a guarded lookup that refuses private,
 * loopback and link-local addresses, at connect time, so the check can't be
 * pointed at anything inside our own network (including by DNS rebinding).
 */

export type ScanVerdict =
  /** Hosted platform (Shopify, Wix and so on) that runs and patches its own servers. */
  | "platform"
  /** PHP version visible and at or above the fix. */
  | "patched"
  /** PHP version visible and below the fix. */
  | "vulnerable"
  /** PHP 8.1 or older. */
  | "end-of-life"
  /** PHP is in use but the version is hidden. */
  | "php-unknown"
  /** No sign of PHP at all. */
  | "no-php"
  /** A firewall or bot check stopped us reading the site. */
  | "blocked"
  /** The site didn't respond or the address was wrong. */
  | "unreachable";

export type ScanResult = {
  verdict: ScanVerdict;
  url: string;
  host: string;
  /** e.g. "8.3.20", when the server shows it. */
  phpVersion?: string;
  /** The version string exactly as the server sent it. */
  phpRaw?: string;
  /** The release to move to, when we know the branch. */
  fixVersion?: string;
  /** True when the version looks like a Linux distro package, which may be patched without a version change. */
  distroBuild?: boolean;
  /** e.g. "WordPress", "Shopify". */
  platform?: string;
  /** Plain-English list of what we saw. */
  signals: string[];
  /** Whether the site is behind Cloudflare, which has added firewall rules for known attacks. */
  cloudflare?: boolean;
  /** Why the check couldn't finish, for blocked and unreachable. */
  reason?: string;
  checkedAt: string;
};

const TIMEOUT_MS = 9000;
const MAX_REDIRECTS = 5;
const MAX_BODY = 400_000;
const USER_AGENT =
  "Mozilla/5.0 (compatible; WebgroPHP2ShellCheck/1.0; +https://webgro.co.uk/php2shell-checker)";

/* ── Address guard ──────────────────────────────────────────────────────── */

function isPrivateV4(ip: string): boolean {
  const [a, b] = ip.split(".").map(Number);
  return (
    a === 0 || a === 10 || a === 127 || a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0) ||
    (a === 198 && (b === 18 || b === 19))
  );
}

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) return isPrivateV4(ip);
  const v6 = ip.toLowerCase();
  const mapped = v6.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isPrivateV4(mapped[1]);
  return (
    v6 === "::" || v6 === "::1" ||
    v6.startsWith("fc") || v6.startsWith("fd") ||
    v6.startsWith("fe8") || v6.startsWith("fe9") || v6.startsWith("fea") || v6.startsWith("feb") ||
    v6.startsWith("ff") || v6.startsWith("64:ff9b") || v6.startsWith("2001:db8")
  );
}

class BlockedAddress extends Error {}

/** dns.lookup with private addresses refused. Handles both the single and `all` call shapes Node uses. */
const guardedLookup = ((hostname: string, options: dns.LookupOptions, callback: (...args: unknown[]) => void) => {
  dns.lookup(hostname, { ...options, all: true }, (err, addresses) => {
    if (err) return callback(err);
    const list = addresses as dns.LookupAddress[];
    if (!list.length || list.some((a) => isPrivateIp(a.address))) {
      return callback(new BlockedAddress("That address points to a private network."));
    }
    if (options.all) return callback(null, list);
    callback(null, list[0].address, list[0].family);
  });
}) as unknown as LookupFunction;

/* ── One request ────────────────────────────────────────────────────────── */

type RawResponse = { status: number; headers: http.IncomingHttpHeaders; body: string; url: URL };

function requestOnce(url: URL): Promise<RawResponse> {
  return new Promise((resolve, reject) => {
    const lib = url.protocol === "https:" ? https : http;
    const req = lib.request(
      url,
      {
        method: "GET",
        lookup: guardedLookup,
        timeout: TIMEOUT_MS,
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "en-GB,en;q=0.8",
        },
      },
      (res) => {
        const status = res.statusCode ?? 0;
        if (status >= 300 && status < 400) {
          res.resume();
          return resolve({ status, headers: res.headers, body: "", url });
        }
        const enc = String(res.headers["content-encoding"] ?? "").toLowerCase();
        const stream =
          enc.includes("br") ? res.pipe(zlib.createBrotliDecompress()) :
          enc.includes("gzip") ? res.pipe(zlib.createGunzip()) :
          enc.includes("deflate") ? res.pipe(zlib.createInflate()) :
          res;
        const chunks: Buffer[] = [];
        let size = 0;
        const finish = () => resolve({ status, headers: res.headers, body: Buffer.concat(chunks).toString("utf8"), url });
        stream.on("data", (c: Buffer) => {
          chunks.push(c);
          size += c.length;
          // We only need the top of the page, so stop reading once we have enough.
          if (size >= MAX_BODY) {
            finish();
            res.destroy();
          }
        });
        stream.on("end", finish);
        stream.on("error", finish);
      },
    );
    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.on("error", reject);
    req.end();
  });
}

async function fetchFollowing(start: URL): Promise<RawResponse> {
  let url = start;
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    const res = await requestOnce(url);
    const loc = res.headers.location;
    if (res.status >= 300 && res.status < 400 && loc) {
      const next = new URL(loc, url);
      if (!isAllowedUrl(next)) throw new BlockedAddress("The site redirected somewhere we won't follow.");
      url = next;
      continue;
    }
    return res;
  }
  throw new Error("Too many redirects.");
}

function isAllowedUrl(u: URL): boolean {
  if (u.protocol !== "http:" && u.protocol !== "https:") return false;
  if (u.username || u.password) return false;
  if (u.port && u.port !== "80" && u.port !== "443") return false;
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (net.isIP(host) && isPrivateIp(host)) return false;
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) return false;
  // Public sites need a dotted hostname.
  return host.includes(".");
}

/** Turns "example.co.uk" or "www.example.co.uk/page" into a full https URL, or null if it can't be a public site. */
export function normaliseUrl(input: string): URL | null {
  const raw = input.trim();
  if (!raw || raw.length > 300) return null;
  try {
    const u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    u.hash = "";
    return isAllowedUrl(u) ? u : null;
  } catch {
    return null;
  }
}

/* ── Reading the response ───────────────────────────────────────────────── */

const header = (h: http.IncomingHttpHeaders, name: string) => {
  const v = h[name];
  return Array.isArray(v) ? v.join(", ") : (v ?? "");
};

/** Platforms that run and patch their own servers, so the site owner has nothing to do. */
function hostedPlatform(h: http.IncomingHttpHeaders, body: string): string | null {
  const server = header(h, "server").toLowerCase();
  const powered = header(h, "x-powered-by").toLowerCase();
  if (h["x-shopid"] || h["x-shopify-stage"] || /cdn\.shopify\.com|Shopify\.theme/.test(body)) return "Shopify";
  if (h["x-wix-request-id"] || /static\.wixstatic\.com|wix-warmup-data/.test(body)) return "Wix";
  if (server.includes("squarespace") || /static1\.squarespace\.com/.test(body)) return "Squarespace";
  if (/data-wf-site=|website-files\.com|webflow\.com\/css/.test(body)) return "Webflow";
  if (server.includes("framer") || /framerusercontent\.com/.test(body)) return "Framer";
  if (/BigCommerce/i.test(body) && /cdn\d*\.bigcommerce\.com/.test(body)) return "BigCommerce";
  if (/WordPress\.com|WordPress VIP/i.test(header(h, "host-header"))) return "WordPress.com";
  if (powered.includes("hubspot") || h["x-hs-hub-id"]) return "HubSpot";
  if (h["x-vercel-id"] || server === "vercel") return "Vercel";
  if (server.includes("netlify") || h["x-nf-request-id"]) return "Netlify";
  if (server === "github.com") return "GitHub Pages";
  return null;
}

/** Software we can spot from the page that runs on PHP. */
function phpApp(body: string, cookies: string): string | null {
  if (/\/wp-content\/|\/wp-includes\/|<meta[^>]+generator[^>]+WordPress/i.test(body)) {
    return /\/plugins\/woocommerce\/|woocommerce-no-js/i.test(body) ? "WordPress with WooCommerce" : "WordPress";
  }
  if (/<meta[^>]+generator[^>]+Joomla|\/media\/jui\/|\/media\/system\/js\//i.test(body)) return "Joomla";
  if (/<meta[^>]+generator[^>]+Drupal|drupal-settings-json|\/sites\/default\/files\//i.test(body)) return "Drupal";
  if (/Mage\.Cookies|mage\/cookies|\/static\/version\d+\/frontend\//i.test(body)) return "Magento";
  if (/prestashop/i.test(body) || /PrestaShop-/.test(cookies)) return "PrestaShop";
  if (/catalog\/view\/theme\/|route=common\/home/i.test(body)) return "OpenCart";
  if (/CraftSessionId/i.test(cookies)) return "Craft CMS";
  if (/laravel_session/i.test(cookies)) return "Laravel";
  if (/MoodleSession/i.test(cookies)) return "Moodle";
  return null;
}

/** True if the page links to a .php file on its own domain (links to other sites' .php files don't count). */
function linksToOwnPhp(body: string, host: string): boolean {
  const bare = host.replace(/^www\./, "").replace(/\./g, "\\.");
  const own = new RegExp(`(?:href|src|action)=["'](?:(?:https?:)?//(?:www\\.)?${bare})?(?:/(?!/)|(?![a-z]+:|//))[^"'\\s>]*\\.php(?:[?#"']|$)`, "i");
  return own.test(body.slice(0, 200_000));
}

function isBotWall(res: RawResponse): boolean {
  if (res.headers["cf-mitigated"]) return true;
  if ((res.status === 403 || res.status === 503 || res.status === 429) &&
      /Just a moment|cf-chl|challenge-platform|Attention Required|captcha|Access denied/i.test(res.body)) return true;
  return false;
}

export async function scanSite(input: string): Promise<ScanResult> {
  const checkedAt = new Date().toISOString();
  const start = normaliseUrl(input);
  if (!start) {
    return {
      verdict: "unreachable", url: input, host: input, signals: [], checkedAt,
      reason: "That doesn't look like a public website address. Try something like example.co.uk.",
    };
  }

  let res: RawResponse;
  try {
    try {
      res = await fetchFollowing(start);
    } catch (err) {
      // Some sites don't have HTTPS set up yet. Try plain http once.
      if (err instanceof BlockedAddress || start.protocol !== "https:" || /^https:/i.test(input.trim())) throw err;
      const plain = new URL(start);
      plain.protocol = "http:";
      res = await fetchFollowing(plain);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    return {
      verdict: "unreachable", url: start.toString(), host: start.hostname, signals: [], checkedAt,
      reason:
        err instanceof BlockedAddress ? msg :
        /ENOTFOUND|EAI_AGAIN/.test(msg) ? "We couldn't find that domain. Check the spelling and try again." :
        /timeout/i.test(msg) ? "The site took too long to respond." :
        "We couldn't connect to the site.",
    };
  }

  const h = res.headers;
  const finalUrl = res.url.toString();
  const host = res.url.hostname;
  const cloudflare = Boolean(h["cf-ray"]);
  const signals: string[] = [];
  const cookies = header(h, "set-cookie");

  if (isBotWall(res)) {
    return {
      verdict: "blocked", url: finalUrl, host, signals, cloudflare, checkedAt,
      reason: "Your site's firewall stopped our check before we could read it.",
    };
  }

  // A server error page tells us nothing about the site, so don't report "no PHP" from it.
  if (res.status >= 500) {
    return {
      verdict: "unreachable", url: finalUrl, host, signals, cloudflare, checkedAt,
      reason: `The site returned an error (${res.status}) when we loaded it. Try again in a few minutes.`,
    };
  }

  const platform = hostedPlatform(h, res.body);
  if (platform) {
    signals.push(`The site runs on ${platform}.`);
    return { verdict: "platform", url: finalUrl, host, platform, signals, cloudflare, checkedAt };
  }

  // A version can show up in X-Powered-By ("PHP/8.3.20") or in a full Server banner ("Apache/2.4.58 PHP/8.3.20").
  const powered = header(h, "x-powered-by");
  const server = header(h, "server");
  const rawMatch = `${powered} ${server}`.match(/PHP\/(\d+\.\d+(?:\.\d+)?[^\s,;)]*)/i);
  const app = phpApp(res.body, cookies);
  if (app) signals.push(`The site is built with ${app}, which runs on PHP.`);
  if (/PHPSESSID/i.test(cookies)) signals.push("The server set a PHP session cookie (PHPSESSID).");
  const phpLinks = linksToOwnPhp(res.body, host);
  if (phpLinks) signals.push("The page links to .php files on the same site.");
  if (/PleskLin|PleskWin/i.test(powered)) signals.push("The server uses Plesk hosting, which is usually PHP hosting.");
  if (cloudflare) signals.push("The site is behind Cloudflare.");

  if (rawMatch) {
    const raw = rawMatch[1];
    const parsed = parseVersion(raw)!;
    signals.unshift(`The server reports PHP ${raw}.`);
    const v = checkVersion(parsed);
    const base = {
      url: finalUrl, host, phpVersion: parsed.text, phpRaw: raw, platform: app ?? undefined,
      distroBuild: isDistroBuild(raw), signals, cloudflare, checkedAt,
    };
    if (v === "patched") return { verdict: "patched", ...base };
    if (v === "end-of-life") return { verdict: "end-of-life", fixVersion: "8.4.27", ...base };
    if (v === "vulnerable") return { verdict: "vulnerable", fixVersion: fixFor(parsed), ...base };
  }

  const usesPhp = Boolean(app) || /PHPSESSID/i.test(cookies) || /php/i.test(powered) ||
    phpLinks || /PleskLin|PleskWin/i.test(powered);
  return {
    verdict: usesPhp ? "php-unknown" : "no-php",
    url: finalUrl, host, platform: app ?? undefined, signals, cloudflare, checkedAt,
  };
}
