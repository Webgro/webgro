#!/usr/bin/env python3
"""
Hero image generator backed by Gemini 3 Pro Image (Nano Banana 2).

Used by the weekly auto-publish job. Produces a 1240x692 JPEG saved
to public/articles/<slug>.jpg, ready to be referenced by the article
entry in src/content/the-gro.ts and picked up by the feed-image
generator.

Usage:
    python3 scripts/gemini-image.py \\
        --slug    my-article-slug \\
        --prompt  "Editorial 3D product photography, ..."

Environment:
    GEMINI_API_KEY        Google AI Studio API key (required).
    GEMINI_IMAGE_MODEL    Override the model name. Default:
                          'gemini-3-pro-image-preview'.

The script always:
    - asks for a 16:9 image
    - resizes the result to 1240x692
    - re-saves as JPEG q85 progressive
    - prints the saved path on stdout
"""

from __future__ import annotations
import argparse
import base64
import json
import os
import sys
from io import BytesIO
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

DEFAULT_MODEL = os.environ.get("GEMINI_IMAGE_MODEL", "gemini-3-pro-image-preview")
API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"
TARGET_W, TARGET_H = 1240, 692


def call_gemini(prompt: str, api_key: str, model: str) -> bytes:
    """POST the prompt to Gemini and return the raw image bytes."""
    url = f"{API_BASE}/{model}:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "imageConfig": {"aspectRatio": "16:9"},
        },
    }
    body = json.dumps(payload).encode("utf-8")
    req = Request(
        url,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urlopen(req, timeout=180) as resp:
            data = json.loads(resp.read())
    except HTTPError as e:
        raise RuntimeError(f"Gemini HTTP {e.code}: {e.read().decode('utf-8', 'replace')[:600]}")
    except URLError as e:
        raise RuntimeError(f"Gemini network error: {e.reason}")

    for cand in data.get("candidates", []):
        for part in cand.get("content", {}).get("parts", []):
            inline = part.get("inlineData") or part.get("inline_data") or {}
            blob = inline.get("data")
            if blob:
                return base64.b64decode(blob)
    raise RuntimeError(
        "No image part in Gemini response. First 400 chars: "
        + json.dumps(data)[:400]
    )


def normalise_to_jpg(raw: bytes, out_path: Path) -> None:
    """Resize whatever Gemini returned to 1240x692 and save as JPEG."""
    from PIL import Image  # local import so the script's --help works without PIL

    img = Image.open(BytesIO(raw)).convert("RGB")
    if img.size != (TARGET_W, TARGET_H):
        img = img.resize((TARGET_W, TARGET_H), Image.LANCZOS)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path, "JPEG", quality=85, optimize=True, progressive=True)


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--slug", required=True, help="Article slug. Output goes to public/articles/<slug>.jpg")
    p.add_argument("--prompt", required=True, help="Image generation prompt for Nano Banana 2.")
    p.add_argument("--out-dir", default=None, help="Override output directory. Defaults to public/articles relative to repo root.")
    args = p.parse_args()

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("error: GEMINI_API_KEY env var is not set.", file=sys.stderr)
        return 1

    repo_root = Path(__file__).resolve().parent.parent
    out_dir = Path(args.out_dir) if args.out_dir else (repo_root / "public" / "articles")
    out_path = out_dir / f"{args.slug}.jpg"

    print(f"[gemini-image] requesting hero for slug='{args.slug}' via model='{DEFAULT_MODEL}'", file=sys.stderr)
    raw = call_gemini(args.prompt, api_key, DEFAULT_MODEL)
    normalise_to_jpg(raw, out_path)
    size_kb = out_path.stat().st_size / 1024
    print(f"[gemini-image] saved {out_path.relative_to(repo_root)} ({TARGET_W}x{TARGET_H}, {size_kb:.0f} KB)", file=sys.stderr)
    print(out_path)
    return 0


if __name__ == "__main__":
    sys.exit(main())
