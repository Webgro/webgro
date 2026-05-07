#!/usr/bin/env python3
"""
Weekly auto-publish orchestrator for The Gro.

Runs entirely on GitHub Actions, no claude.ai dependency. Steps:

  1. Determine the next service bucket (next-service.py).
  2. Read existing articles in src/content/the-gro.ts.
  3. Call Gemini text API to draft the new article in Webgro voice;
     return strict JSON with slug, title, body blocks, image prompt.
  4. Insert the new article entry at the top of the articles array.
  5. Generate the hero image (gemini-image.py).
  6. Generate the title-overlay feed image (generate-feed-image.py).
  7. Print the slug + title to stdout for the workflow to commit.
  8. Send notification email (notify-published.py) AFTER the workflow
     has pushed and Vercel has deployed.

Environment:
  GEMINI_API_KEY        Google AI Studio key (text + image)
  RESEND_API_KEY        Resend transactional API key
  GEMINI_TEXT_MODEL     Override text model (default: gemini-3-pro)
  GEMINI_IMAGE_MODEL    Override image model (default: gemini-3-pro-image-preview)
"""

from __future__ import annotations
import json
import os
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

REPO_ROOT      = Path(__file__).resolve().parent.parent
CONTENT_FILE   = REPO_ROOT / "src" / "content" / "the-gro.ts"
ARTICLES_DIR   = REPO_ROOT / "public" / "articles"
TEXT_MODEL     = os.environ.get("GEMINI_TEXT_MODEL", "gemini-3-pro")
GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"


def run(cmd: list[str], capture: bool = True) -> str:
    """Run a subprocess, raise on non-zero exit, return stdout."""
    print(f"[auto-publish] $ {' '.join(cmd)}", file=sys.stderr)
    result = subprocess.run(
        cmd,
        cwd=REPO_ROOT,
        check=True,
        capture_output=capture,
        text=True,
    )
    return result.stdout.strip() if capture else ""


def get_next_service() -> dict:
    out = run(["python3", "scripts/next-service.py"])
    return json.loads(out)


def parse_existing_articles() -> list[dict]:
    """Pull a slim summary of every existing article so the writer
    knows what's already been covered."""
    text = CONTENT_FILE.read_text(encoding="utf-8")
    out: list[dict] = []
    for m in re.finditer(
        r'slug:\s*"([^"]+)"[\s\S]*?'
        r'category:\s*"([^"]+)"[\s\S]*?'
        r'title:\s*"([^"]+)"[\s\S]*?'
        r'excerpt:\s*\n?\s*"([^"]+)"',
        text,
    ):
        out.append({
            "slug": m.group(1),
            "category": m.group(2),
            "title": m.group(3),
            "excerpt": m.group(4),
        })
    return out


def call_gemini_json(prompt: str, api_key: str) -> dict:
    url = f"{GEMINI_API_BASE}/{TEXT_MODEL}:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.85,
            "maxOutputTokens": 8192,
        },
    }
    req = Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urlopen(req, timeout=180) as resp:
            data = json.loads(resp.read())
    except HTTPError as e:
        raise RuntimeError(f"Gemini text HTTP {e.code}: {e.read().decode('utf-8','replace')[:600]}")
    except URLError as e:
        raise RuntimeError(f"Gemini text network error: {e.reason}")

    parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
    raw = "".join(p.get("text", "") for p in parts).strip()
    if not raw:
        raise RuntimeError(f"Empty text response from Gemini: {json.dumps(data)[:400]}")
    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        raise RuntimeError(f"Gemini returned non-JSON. First 400 chars: {raw[:400]}")


def build_article_prompt(service: dict, existing: list[dict]) -> str:
    return f"""You are writing a new article for "The Gro", the journal section of
webgro.co.uk, the studio site of a Bracknell-based eCommerce + WordPress + AI
agency owned by Michael Broadbridge.

VOICE RULES (absolute, no exceptions):
- NO em dashes anywhere. Use periods, parens, colons, or commas instead.
  En dashes are fine for numeric ranges (e.g. 4–8 weeks).
- Plain, blunt, direct British English (optimisation, organisation).
- Numbers-driven, opinionated, real-client-shaped scenarios.
- Sentence-case titles with a period at the end.
- No generic SEO fluff. No 'in today's fast-paced world'. No 'unleash'.
- Skim every existing article's title and excerpt before committing
  to your topic. Do not repeat angles already covered.

THIS WEEK'S SERVICE BUCKET:
- Service       : {service['service']}
- Category label: {service['label']}
- Accent colour : {service['accent']}
- relatedService: {service['relatedService']}

EXISTING ARTICLES (titles + excerpts only, for reference):
{json.dumps(existing, indent=2, ensure_ascii=False)}

TARGET LENGTH: 5-7 minute read (~1100 to 1700 words).

Return ONLY a JSON object with this exact shape, no surrounding text,
no markdown fences:

{{
  "slug":     "lower-kebab-slug-no-trailing-words",
  "title":    "Sentence case title with period at end.",
  "excerpt":  "1 to 2 sentences. The elevator version. No emoji.",
  "readTime": "6 min read",
  "imagePrompt": "Editorial 3D product photography, 16:9 aspect ratio. <single hero subject relevant to the article thesis> on a colour-blocked backdrop using deep charcoal (#0D1117) plus the article's accent colour as a dominant feature, with cream (#F4F6FB) and the other brand colours (electric blue #2D8DFF, royal violet #7C3AED, mint teal #00C9A7) as secondary blocks. Hard directional studio lighting, mid-century editorial design feel, slight low-angle perspective, generous breathing space. No people, no logos, no extra text on the subject.",
  "body": [
    {{ "type": "intro",     "text": "Opening that lands the thesis in 2 to 3 sentences." }},
    {{ "type": "chapter",   "id": "lowercase-id", "num": "01", "label": "Chapter label", "description": "One-sentence chapter description." }},
    {{ "type": "section",   "eyebrow": "OPTIONAL EYEBROW",   "heading": "Section heading",   "body": "Paragraph or array of paragraphs." }},
    {{ "type": "ul",        "items": ["item one", "item two", "item three", "item four"] }},
    {{ "type": "section",   "heading": "Another section",  "body": "More substance with real numbers." }},
    {{ "type": "callout",   "text": "Sharp single-sentence takeaway.", "accent": "{service['accent']}" }},
    {{ "type": "section",   "heading": "Closing section", "body": "Pointed close that justifies the article's existence. Action-shaped, not summary-shaped." }},
    {{ "type": "deliverables", "heading": "Our take", "items": ["takeaway one", "takeaway two", "takeaway three"] }}
  ]
}}

GUIDELINES FOR THE BODY:
- The body array should be 8 to 14 blocks total.
- At least one chapter, one section, one list (ul or ol), one callout.
- Section bodies can be a single string OR an array of strings (multiple paragraphs).
- Callout accent MUST be "{service['accent']}".
- Don't invent fake URLs. Don't reference clients we haven't worked with.
- Real-feeling numbers (e.g. "+34% in 90 days", "£8 to 15k"), not vague hype.

GUIDELINES FOR THE IMAGE PROMPT:
- Single hero subject visually punning on your article's thesis.
- Examples of past subjects we've used: stack of labelled blocks,
  vintage industrial levers, two hardback books, mechanical adding
  machine, tangled switchboard cables. Pick something that hasn't
  been used yet and clearly relates to your topic.
- Include the brand palette explicitly in the prompt.
- Do NOT include any people in the image.

Reply with ONLY the JSON object.
"""


def insert_article(article: dict, service: dict) -> None:
    """Insert the new article entry as the first element of the
    articles array in src/content/the-gro.ts."""
    text = CONTENT_FILE.read_text(encoding="utf-8")

    today = datetime.utcnow().strftime("%b %Y")  # e.g. "May 2026"
    entry = build_ts_entry(article, service, today)

    # Locate `export const articles: Article[] = [` and insert right
    # after the opening `[`.
    pattern = r'(export const articles: Article\[\] = \[\s*\n)'
    new_text, count = re.subn(pattern, r'\1' + entry + ",\n\n", text, count=1)
    if count != 1:
        raise RuntimeError("Could not locate `export const articles: Article[] = [` in the-gro.ts")
    CONTENT_FILE.write_text(new_text, encoding="utf-8")


def js_string(s: str) -> str:
    """Escape a Python string for use as a TypeScript double-quoted string."""
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n") + '"'


def render_block(block: dict) -> str:
    t = block.get("type")
    if t == "intro" or t == "h2" or t == "h3":
        return '      { type: "' + t + '", text: ' + js_string(block.get("text", "")) + ' }'
    if t == "chapter":
        return ('      { type: "chapter", id: ' + js_string(block.get("id", ""))
                + ', num: ' + js_string(block.get("num", ""))
                + ', label: ' + js_string(block.get("label", ""))
                + (', description: ' + js_string(block["description"]) if block.get("description") else "")
                + ' }')
    if t == "section":
        body = block.get("body", "")
        if isinstance(body, list):
            body_render = "[" + ", ".join(js_string(p) for p in body) + "]"
        else:
            body_render = js_string(body)
        out = '      { type: "section", '
        if block.get("eyebrow"):
            out += "eyebrow: " + js_string(block["eyebrow"]) + ", "
        out += 'heading: ' + js_string(block.get("heading", ""))
        out += ', body: ' + body_render
        out += ' }'
        return out
    if t in ("ul", "ol"):
        items = block.get("items", [])
        return ('      { type: "' + t + '", items: [\n        '
                + ",\n        ".join(js_string(i) for i in items)
                + "\n      ] }")
    if t == "callout":
        out = '      { type: "callout", text: ' + js_string(block.get("text", ""))
        if block.get("accent"):
            out += ', accent: ' + js_string(block["accent"])
        out += ' }'
        return out
    if t == "quote":
        out = '      { type: "quote", text: ' + js_string(block.get("text", ""))
        if block.get("attribution"):
            out += ', attribution: ' + js_string(block["attribution"])
        out += ' }'
        return out
    if t == "deliverables":
        items = block.get("items", [])
        out = '      { type: "deliverables"'
        if block.get("heading"):
            out += ", heading: " + js_string(block["heading"])
        out += ", items: [\n        " + ",\n        ".join(js_string(i) for i in items) + "\n      ] }"
        return out
    # Unsupported block type: emit as JSON-ish literal so the build
    # still type-checks if someone added a block we don't render here.
    raise RuntimeError(f"Unsupported block type: {t}")


def build_ts_entry(article: dict, service: dict, date: str) -> str:
    body_lines = ",\n".join(render_block(b) for b in article["body"])
    return f"""  {{
    slug: {js_string(article['slug'])},
    category: {js_string(service['label'])},
    title: {js_string(article['title'])},
    excerpt:
      {js_string(article['excerpt'])},
    date: {js_string(date)},
    readTime: {js_string(article['readTime'])},
    accent: {js_string(service['accent'])},
    author: "Webgro Studio",
    heroImage: {js_string('/articles/' + article['slug'] + '.jpg')},
    relatedService: {js_string(service['relatedService'])},
    body: [
{body_lines}
    ],
  }}"""


def main() -> int:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("error: GEMINI_API_KEY env var is not set.", file=sys.stderr)
        return 1

    # 1. Service rotation
    service = get_next_service()
    print(f"[auto-publish] next service: {service['service']} ({service['label']}, accent={service['accent']})", file=sys.stderr)

    # 2. Existing context
    existing = parse_existing_articles()
    print(f"[auto-publish] existing articles: {len(existing)}", file=sys.stderr)

    # 3. Draft via Gemini text
    prompt = build_article_prompt(service, existing)
    article = call_gemini_json(prompt, api_key)

    # Validate the shape we expect
    for required in ("slug", "title", "excerpt", "readTime", "body", "imagePrompt"):
        if not article.get(required):
            raise RuntimeError(f"Article JSON missing required field: {required}")
    print(f"[auto-publish] drafted: '{article['title']}' ({article['slug']})", file=sys.stderr)

    # 4. Insert into the-gro.ts
    insert_article(article, service)

    # 5. Hero image
    run([
        "python3", "scripts/gemini-image.py",
        "--slug", article["slug"],
        "--prompt", article["imagePrompt"],
    ])

    # 6. Feed image
    run([
        "python3", "scripts/generate-feed-image.py",
        "--slug",   article["slug"],
        "--title",  article["title"],
        "--accent", service["accent"],
    ])

    # 7. Print outputs the workflow expects
    summary = {
        "slug":      article["slug"],
        "title":     article["title"],
        "excerpt":   article["excerpt"],
        "category":  service["label"],
    }
    print(json.dumps(summary))
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:
        print(f"[auto-publish] FAILED: {e}", file=sys.stderr)
        sys.exit(1)
