/**
 * PHP2Shell (CVE-2026-109618 and CVE-2026-109619) version rules, shared by the
 * URL scanner on the server and the "type your version" check in the browser.
 *
 * Source: the PHP project's 21 October 2026 security release. Fixed in 8.5.12,
 * 8.4.27, 8.3.36 and 8.2.35. PHP 8.1 and older get no release from the project,
 * only source backports for 7.4 to 8.1, so they count as vulnerable unless the
 * host has patched them.
 */

export const FIXED: Record<string, number> = {
  "8.5": 12,
  "8.4": 27,
  "8.3": 36,
  "8.2": 35,
};

export const FIXED_LIST = ["8.5.12", "8.4.27", "8.3.36", "8.2.35"];

export type VersionVerdict =
  /** At or above the fixed release for its branch. */
  | "patched"
  /** A supported branch below the fixed release. */
  | "vulnerable"
  /** 8.1 or older: no release from the PHP project. */
  | "end-of-life"
  /** Not a version we can read. */
  | "invalid";

export type ParsedVersion = { major: number; minor: number; patch: number; text: string };

/** Pulls "8.3.20" out of strings like "PHP/8.3.20", "8.3.20-1ubuntu1" or "8.3". */
export function parseVersion(input: string): ParsedVersion | null {
  const m = input.trim().match(/(\d+)\.(\d+)(?:\.(\d+))?/);
  if (!m) return null;
  const major = Number(m[1]);
  const minor = Number(m[2]);
  const patch = m[3] === undefined ? -1 : Number(m[3]);
  if (major < 4 || major > 9) return null;
  return { major, minor, patch, text: m[3] === undefined ? `${major}.${minor}` : `${major}.${minor}.${patch}` };
}

export function checkVersion(v: ParsedVersion): VersionVerdict {
  if (v.major < 8 || (v.major === 8 && v.minor <= 1)) return "end-of-life";
  const fixedPatch = FIXED[`${v.major}.${v.minor}`];
  if (fixedPatch === undefined) {
    // A branch newer than 8.5 was released after this fix, so it includes it.
    return v.major > 8 || v.minor > 5 ? "patched" : "invalid";
  }
  // "8.3" with no patch number can't be judged, so treat it as unpatched until proven otherwise.
  if (v.patch < 0) return "vulnerable";
  return v.patch >= fixedPatch ? "patched" : "vulnerable";
}

/** The release to update to, for the branch a site is on. */
export function fixFor(v: ParsedVersion): string {
  const fixedPatch = FIXED[`${v.major}.${v.minor}`];
  return fixedPatch === undefined ? "8.4.27" : `${v.major}.${v.minor}.${fixedPatch}`;
}

/**
 * Linux distributions (Ubuntu, Debian, Red Hat and others) patch their own PHP
 * packages without changing the main version number, so a version string with
 * a distro suffix may already be patched.
 */
export function isDistroBuild(raw: string): boolean {
  return /\d-\d|ubuntu|deb\d|debian|\.el\d|remi|sury/i.test(raw);
}
