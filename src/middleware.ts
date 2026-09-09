import { NextRequest, NextResponse } from "next/server";

/**
 * Gate for client proposals under /proposals. HTTP Basic Auth: any
 * username, password below. Also stamps X-Robots-Tag so nothing under
 * the path can be indexed even if a crawler gets past robots.txt
 * (robots.ts already disallows /proposals/).
 */
const PROPOSALS_PASSWORD = "Webgro!";

export function middleware(req: NextRequest) {
  const auth = req.headers.get("authorization");

  if (auth?.startsWith("Basic ")) {
    try {
      const [, password] = atob(auth.slice(6)).split(":");
      if (password === PROPOSALS_PASSWORD) {
        const res = NextResponse.next();
        res.headers.set("X-Robots-Tag", "noindex, nofollow");
        return res;
      }
    } catch {
      // Malformed header, fall through to the challenge.
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Webgro proposals"',
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export const config = {
  matcher: "/proposals/:path*",
};
