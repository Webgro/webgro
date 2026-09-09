import { NextRequest, NextResponse } from "next/server";
import { PROPOSALS_COOKIE, PROPOSALS_TOKEN } from "@/lib/proposals";

/**
 * Gate for client proposals under /proposals. Unlocked visitors carry a
 * cookie set by /api/proposals/unlock; everyone else sees the branded
 * unlock form (rewritten in place, so the proposal URL never changes).
 * Every response is stamped noindex on top of the robots.txt disallow.
 */
export function middleware(req: NextRequest) {
  const unlocked = req.cookies.get(PROPOSALS_COOKIE)?.value === PROPOSALS_TOKEN;

  if (unlocked) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  const unlock = new URL("/proposals-unlock", req.url);
  unlock.searchParams.set("next", req.nextUrl.pathname);
  if (req.nextUrl.searchParams.get("error")) {
    unlock.searchParams.set("error", "1");
  }
  const res = NextResponse.rewrite(unlock);
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: "/proposals/:path*",
};
