/**
 * A simple sliding-window rate limit per IP address, held in memory.
 *
 * It resets whenever the server restarts, and each server instance (or each
 * serverless function instance on Vercel) keeps its own count, so it's a
 * brake on casual abuse of the AI questions rather than a hard guarantee.
 * Swap it for a shared store (Upstash, Vercel KV) if that ever matters.
 */

const buckets = new Map<string, number[]>();
let lastSweep = 0;

export function clientIp(req: Request): string {
  return req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/** True if this key has used up `limit` requests in the last `windowMs`. Records the request otherwise. */
export function rateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (now - lastSweep > 60_000) {
    lastSweep = now;
    for (const [k, hits] of buckets) if (!hits.length || now - hits[hits.length - 1] > 60 * 60_000) buckets.delete(k);
  }
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return true;
  }
  hits.push(now);
  buckets.set(key, hits);
  return false;
}
