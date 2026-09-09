import { NextRequest, NextResponse } from "next/server";
import {
  PROPOSALS_COOKIE,
  PROPOSALS_PASSWORD,
  PROPOSALS_TOKEN,
} from "@/lib/proposals";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = form.get("password");

  // Only ever bounce back into /proposals, so the next param can't be
  // abused as an open redirect.
  let next = String(form.get("next") ?? "");
  if (!next.startsWith("/proposals/")) next = "/proposals/";

  if (password === PROPOSALS_PASSWORD) {
    const res = NextResponse.redirect(new URL(next, req.url), 303);
    res.cookies.set(PROPOSALS_COOKIE, PROPOSALS_TOKEN, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  }

  const back = new URL(next, req.url);
  back.searchParams.set("error", "1");
  return NextResponse.redirect(back, 303);
}
