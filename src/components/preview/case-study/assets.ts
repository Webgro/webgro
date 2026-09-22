import { closeSync, existsSync, openSync, readSync } from "node:fs";
import path from "node:path";
import type { CaseStudy } from "@/content/work";
import { collectSources } from "./structure";

/**
 * Server-only. Checks every image a case study refers to against public/, so
 * the view can swap in an optimised copy from public/preview where one exists
 * and show a quiet placeholder where the file is missing. Also reads each
 * image's pixel size so <img> tags carry real width and height.
 */
export type Asset = { src: string; w: number; h: number };
export type AssetMap = Record<string, Asset | null>;

const PUBLIC_DIR = path.join(process.cwd(), "public");
const abs = (p: string) => path.join(PUBLIC_DIR, p.replace(/^\//, ""));

function readHead(file: string, bytes: number): Buffer | null {
  try {
    const fd = openSync(file, "r");
    const buf = Buffer.alloc(bytes);
    const n = readSync(fd, buf, 0, bytes, 0);
    closeSync(fd);
    return buf.subarray(0, n);
  } catch {
    return null;
  }
}

/** Reads width and height from a PNG, JPEG or WebP header. Several .jpg files here are really PNGs. */
function probe(file: string): { w: number; h: number } | null {
  const b = readHead(file, 512 * 1024);
  if (!b || b.length < 32) return null;

  if (b[0] === 0x89 && b[1] === 0x50) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };

  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i += 1; continue; }
      const marker = b[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
      }
      i += 2 + b.readUInt16BE(i + 2);
    }
    return null;
  }

  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const kind = b.toString("ascii", 12, 16);
    if (kind === "VP8X") return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
    if (kind === "VP8 ") return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    if (kind === "VP8L") {
      const bits = b.readUInt32LE(21);
      return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 };
    }
  }
  return null;
}

function firstExisting(candidates: string[]): Asset | null {
  for (const c of candidates) {
    const file = abs(c);
    if (!existsSync(file)) continue;
    const size = probe(file) ?? { w: 1440, h: 950 };
    return { src: c, ...size };
  }
  return null;
}

/** "/work/sublishop/mobile.jpg" is optimised as "/preview/cs-sublishop-mobile.jpg". */
function optimisedCopy(src: string): string | null {
  const m = src.match(/^\/work\/([^/]+)\/([^/]+)\.(?:jpe?g|png|webp)$/i);
  return m ? `/preview/cs-${m[1]}-${m[2]}.jpg` : null;
}

const TILE_NAMES: Record<string, string> = {
  "fandp-agency": "fandp",
  "origin-architectural": "origin",
  "paragon-freight": "paragon",
  "space-4-u-self-storage": "space4u",
};

function heroCandidates(cs: CaseStudy): string[] {
  return [
    `/preview/cs-hero-${cs.slug}.jpg`,
    cs.heroImage,
    `/work/${cs.slug}/storefront.jpg`,
    `/preview/reel-${cs.slug}.jpg`,
    `/preview/tile-${TILE_NAMES[cs.slug] ?? cs.slug}.jpg`,
  ].filter(Boolean);
}

export function resolveHero(cs: CaseStudy): Asset | null {
  if (!existsSync(PUBLIC_DIR)) return cs.heroImage ? { src: cs.heroImage, w: 1800, h: 1200 } : null;
  return firstExisting(heroCandidates(cs));
}

export function resolveAssets(cs: CaseStudy): AssetMap {
  const map: AssetMap = {};
  const canCheck = existsSync(PUBLIC_DIR);
  for (const src of collectSources(cs)) {
    if (!canCheck) {
      map[src] = { src, w: 1440, h: 950 };
      continue;
    }
    const copy = optimisedCopy(src);
    map[src] = firstExisting(copy ? [copy, src] : [src]);
  }
  return map;
}
