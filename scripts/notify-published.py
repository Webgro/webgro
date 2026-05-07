#!/usr/bin/env python3
"""
Send Michael an email when the weekly auto-publish job ships a new
article. Uses the same Resend account already wired up for the
contact form and the Vapi receptionist.

Usage:
    python3 scripts/notify-published.py \\
        --slug      my-article-slug \\
        --title     "My new article" \\
        --excerpt   "..." \\
        --category  "AI"

Environment:
    RESEND_API_KEY        Resend transactional API key (required).
    NOTIFY_EMAIL          Override recipient. Default: michael@webgro.co.uk
    NOTIFY_FROM           Override From: header.
                          Default: "Webgro Auto-publish <receptionist@webgro.co.uk>"
"""

from __future__ import annotations
import argparse
import json
import os
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

DEFAULT_TO = os.environ.get("NOTIFY_EMAIL", "michael@webgro.co.uk")
DEFAULT_FROM = os.environ.get("NOTIFY_FROM", "Webgro Auto-publish <receptionist@webgro.co.uk>")
SITE_URL = os.environ.get("SITE_URL", "https://webgro.co.uk")


def send(slug: str, title: str, excerpt: str, category: str) -> dict:
    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        raise RuntimeError("RESEND_API_KEY env var is not set.")

    article_url = f"{SITE_URL}/the-gro/{slug}"
    feed_image_url = f"{SITE_URL}/articles/feed/{slug}.jpg"

    html = f'''<!doctype html>
<html><body style="margin:0;background:#F4F6FB;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:32px 16px;">
  <table align="center" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(13,17,23,.06);">
    <tr><td style="height:4px;background:linear-gradient(90deg,#2D8DFF,#7C3AED,#00C9A7);"></td></tr>
    <tr><td>
      <a href="{article_url}" style="display:block;">
        <img src="{feed_image_url}" alt="{title}" style="display:block;width:100%;height:auto;" />
      </a>
    </td></tr>
    <tr><td style="padding:24px 32px 28px;">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#7C3AED;">[ The Gro / Auto-publish ]</p>
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#6B7A99;">{category}</p>
      <h1 style="margin:8px 0 0;font-size:22px;color:#0D1117;font-weight:700;letter-spacing:-.01em;line-height:1.25;">{title}</h1>
      <p style="margin:14px 0 0;font-size:15px;line-height:1.6;color:#0D1117;">{excerpt}</p>
      <p style="margin:24px 0 0;">
        <a href="{article_url}" style="display:inline-block;padding:11px 18px;border-radius:999px;background:#2D8DFF;color:#fff;text-decoration:none;font-size:14px;font-weight:500;">Read on the live site &rarr;</a>
      </p>
      <p style="margin:18px 0 0;font-size:12px;color:#6B7A99;line-height:1.6;">Auto-published by the weekly Gro schedule. If anything reads off, edit src/content/the-gro.ts and push, or rerun the schedule manually.</p>
    </td></tr>
  </table>
</td></tr></table>
</body></html>'''

    text = (
        f"New article auto-published to The Gro.\n\n"
        f"Title    : {title}\n"
        f"Category : {category}\n"
        f"URL      : {article_url}\n\n"
        f"Excerpt  : {excerpt}\n\n"
        f"If anything reads off, edit src/content/the-gro.ts and push.\n"
    )

    payload = {
        "from": DEFAULT_FROM,
        "to": [DEFAULT_TO],
        "subject": f"[ The Gro ] Published: {title}",
        "html": html,
        "text": text,
    }

    req = Request(
        "https://api.resend.com/emails",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urlopen(req, timeout=20) as resp:
            return json.loads(resp.read())
    except HTTPError as e:
        raise RuntimeError(f"Resend HTTP {e.code}: {e.read().decode('utf-8', 'replace')[:500]}")
    except URLError as e:
        raise RuntimeError(f"Resend network error: {e.reason}")


def main() -> int:
    p = argparse.ArgumentParser(description="Send a 'new article published' email.")
    p.add_argument("--slug", required=True)
    p.add_argument("--title", required=True)
    p.add_argument("--excerpt", required=True)
    p.add_argument("--category", required=True)
    args = p.parse_args()

    result = send(args.slug, args.title, args.excerpt, args.category)
    print(f"[notify-published] sent: {result.get('id', '?')}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
