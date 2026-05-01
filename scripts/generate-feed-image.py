#!/usr/bin/env python3
"""
Feed-only image generator.

Takes an existing article hero from public/articles/<slug>.jpg and
returns a copy with a brand-tinted gradient + the article title burnt
in across the bottom. Output goes to public/articles/feed/<slug>.jpg
and is referenced only by the RSS feed (NOT by the website cards,
which still use the unmodified hero).

Run on demand for any article:

    python3 scripts/generate-feed-image.py \\
        --slug    ai-2026-boring-wins \\
        --title   "AI in 2026: the boring wins." \\
        --accent  teal

Or in bulk for every article currently in src/content/the-gro.ts:

    python3 scripts/generate-feed-image.py --all
"""

from __future__ import annotations
import argparse
import json
import os
import re
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

# ---- Brand palette --------------------------------------------------------
INK         = (7, 8, 12)
INK_RAISED  = (13, 17, 23)
BLUE        = (45, 141, 255)
VIOLET      = (124, 58, 237)
TEAL        = (0, 201, 167)
WHITE       = (244, 246, 251)

ACCENTS = {"blue": BLUE, "violet": VIOLET, "teal": TEAL}

# Match the on-disk hero dimensions.
TARGET_W, TARGET_H = 1240, 692

# ---- Font discovery -------------------------------------------------------
FONT_CANDIDATES = [
    "/System/Library/Fonts/Helvetica.ttc",
    "/System/Library/Fonts/HelveticaNeue.ttc",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/Library/Fonts/Arial Bold.ttf",
    "/System/Library/Fonts/SFNSDisplay.ttf",
    "/System/Library/Fonts/SFNS.ttf",
]


def first_font(size: int) -> ImageFont.ImageFont:
    for p in FONT_CANDIDATES:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                continue
    return ImageFont.load_default()


# ---- Drawing primitives ---------------------------------------------------

def make_gradient_overlay(width: int, height: int, accent: tuple) -> Image.Image:
    """Bottom-anchored vertical gradient: fully transparent at the top
    fading through ink to a hint of the accent colour at the very bottom.

    The result is composited onto the photographic base image to give
    the title a dark zone to sit on without flattening the photo.
    """
    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    px = overlay.load()
    # Gradient covers the bottom 60% of the image:
    #   - top 40% of image: fully transparent (preserve photo detail)
    #   - 40-70%: gentle fade in, ink tone, low alpha
    #   - 70-100%: full ink, high alpha (target for the title text)
    fade_start = int(height * 0.40)
    solid_start = int(height * 0.85)
    for y in range(fade_start, height):
        if y < solid_start:
            # Eased fade from transparent to ~85% ink
            t = (y - fade_start) / max(1, solid_start - fade_start - 1)
            eased = t ** 1.4
            a = int(220 * eased)
            r = int(INK[0] * (1 - eased * 0.10) + accent[0] * (eased * 0.10))
            g = int(INK[1] * (1 - eased * 0.10) + accent[1] * (eased * 0.10))
            b = int(INK[2] * (1 - eased * 0.10) + accent[2] * (eased * 0.10))
        else:
            # Title band: fully opaque ink, accent hint at the very base
            t = (y - solid_start) / max(1, height - solid_start - 1)
            r = int(INK[0] * (1 - t * 0.18) + accent[0] * (t * 0.18))
            g = int(INK[1] * (1 - t * 0.18) + accent[1] * (t * 0.18))
            b = int(INK[2] * (1 - t * 0.18) + accent[2] * (t * 0.18))
            a = 245
        for x in range(width):
            px[x, y] = (r, g, b, a)
    return overlay


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        trial = (current + " " + word).strip()
        bbox = draw.textbbox((0, 0), trial, font=font)
        if bbox[2] - bbox[0] <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


# ---- Render ---------------------------------------------------------------

def render(slug: str, title: str, accent: str, source_path: Path, out_path: Path) -> None:
    if not source_path.exists():
        raise FileNotFoundError(f"Source hero not found: {source_path}")

    accent_rgb = ACCENTS.get(accent, TEAL)

    # 1. Load source, normalise to target size.
    base = Image.open(source_path).convert("RGB")
    if base.size != (TARGET_W, TARGET_H):
        base = base.resize((TARGET_W, TARGET_H), Image.LANCZOS)
    img = base.convert("RGBA")

    # 2. Composite the gradient overlay.
    overlay = make_gradient_overlay(TARGET_W, TARGET_H, accent_rgb)
    img.alpha_composite(overlay)

    # 3. Title text. Pick a size that fits the available width within
    #    a maximum of three lines; shrink until it fits.
    img_rgb = img.convert("RGB")
    draw = ImageDraw.Draw(img_rgb)
    PAD_X = 60
    title_max_w = TARGET_W - PAD_X * 2

    title_size = 64
    while title_size > 40:
        font = first_font(title_size)
        lines = wrap_text(draw, title, font, title_max_w)
        if len(lines) <= 3:
            break
        title_size -= 4

    line_height = int(title_size * 1.15)
    block_height = line_height * len(lines)
    # Anchor the title block towards the lower portion of the image,
    # leaving room for the photographic detail above it.
    title_y = TARGET_H - block_height - 56

    for i, line in enumerate(lines):
        # Subtle text-shadow for crispness over busy photo zones.
        shadow_pos = (PAD_X + 1, title_y + i * line_height + 1)
        draw.text(shadow_pos, line, fill=(0, 0, 0), font=font)
        draw.text((PAD_X, title_y + i * line_height), line, fill=WHITE, font=font)

    # 4. Save.
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img_rgb.save(out_path, "JPEG", quality=85, optimize=True, progressive=True)
    size_kb = out_path.stat().st_size / 1024
    print(f"  {out_path.relative_to(out_path.parents[3])}  ({TARGET_W}x{TARGET_H}, {size_kb:.0f} KB)")


# ---- Bulk mode: parse the-gro.ts ------------------------------------------

def find_articles(repo_root: Path) -> list[dict]:
    """Pull slug/title/accent/heroImage out of the-gro.ts so the bulk
    mode doesn't need to be kept in sync manually."""
    content_file = repo_root / "src" / "content" / "the-gro.ts"
    text = content_file.read_text(encoding="utf-8")

    # Crude but effective: match each article object literal by its
    # leading 'slug:' field, then pluck title / accent / heroImage from
    # the same block.
    articles: list[dict] = []
    pattern = re.compile(
        r'slug:\s*"([^"]+)"[\s\S]*?'
        r'title:\s*"([^"]+)"[\s\S]*?'
        r'accent:\s*"(blue|violet|teal)"[\s\S]*?'
        r'heroImage:\s*"([^"]+)"',
        re.MULTILINE,
    )
    for m in pattern.finditer(text):
        articles.append({
            "slug": m.group(1),
            "title": m.group(2),
            "accent": m.group(3),
            "heroImage": m.group(4),
        })
    return articles


def main() -> int:
    p = argparse.ArgumentParser(description="Generate RSS-feed-only images with title overlay.")
    p.add_argument("--slug", help="Article slug; output is public/articles/feed/<slug>.jpg")
    p.add_argument("--title", help="Article title rendered onto the image")
    p.add_argument("--accent", choices=ACCENTS.keys(), default="teal", help="Brand accent colour")
    p.add_argument("--all", action="store_true", help="Regenerate feed images for every article in the-gro.ts")
    args = p.parse_args()

    repo_root = Path(__file__).resolve().parent.parent

    if args.all:
        articles = find_articles(repo_root)
        if not articles:
            print("No articles parsed from the-gro.ts. Aborting.", file=sys.stderr)
            return 1
        print(f"Generating feed images for {len(articles)} articles:")
        for a in articles:
            src = repo_root / "public" / a["heroImage"].lstrip("/")
            out = repo_root / "public" / "articles" / "feed" / f"{a['slug']}.jpg"
            render(a["slug"], a["title"], a["accent"], src, out)
        return 0

    if not (args.slug and args.title):
        p.error("--slug and --title are required (unless --all is used)")

    src = repo_root / "public" / "articles" / f"{args.slug}.jpg"
    out = repo_root / "public" / "articles" / "feed" / f"{args.slug}.jpg"
    render(args.slug, args.title, args.accent, src, out)
    return 0


if __name__ == "__main__":
    sys.exit(main())
