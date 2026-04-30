#!/usr/bin/env python3
"""
Branded article hero image generator for The Gro.

Outputs a 1240x691 JPEG that reads on-brand (dark ink ground, soft
accent glow, three-dot brand moment, big title type) so any new
article ships with a hero that fits the visual system without
needing a getimg.ai pass.

Run on demand for any article:

    python3 scripts/generate-article-image.py \
        --slug   ai-2026-boring-wins \
        --title  "AI in 2026: the boring wins." \
        --eyebrow "AI" \
        --accent  teal

Output goes to public/articles/<slug>.jpg.

Replace later with a getimg.ai photographic image if you want by
overwriting the same file. Anything saved at /public/articles/<slug>.jpg
is what the article uses.
"""

from __future__ import annotations
import argparse
import os
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

# ---- Brand palette ---------------------------------------------------------
INK         = (7, 8, 12)
INK_RAISED  = (13, 17, 23)
SLATE       = (107, 122, 153)
WHITE       = (237, 239, 244)
WHITE_60    = (164, 167, 181)
BLUE        = (45, 141, 255)
VIOLET      = (124, 58, 237)
TEAL        = (0, 201, 167)

ACCENTS = {"blue": BLUE, "violet": VIOLET, "teal": TEAL}

W, H = 1240, 691

# ---- Font discovery --------------------------------------------------------
# PIL needs an actual TTF/OTF on disk. We try the bold fonts that ship with
# macOS first, then fall back to PIL's bundled default (which looks bad but
# at least won't crash). If you want a specific font, drop a .ttf into
# /System/Library/Fonts/ or /Library/Fonts/ and add it to the list.
FONT_CANDIDATES_BOLD = [
    "/System/Library/Fonts/Helvetica.ttc",
    "/System/Library/Fonts/HelveticaNeue.ttc",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/Library/Fonts/Arial Bold.ttf",
    "/System/Library/Fonts/SFNSDisplay.ttf",
    "/System/Library/Fonts/SFNS.ttf",
]
FONT_CANDIDATES_MONO = [
    "/System/Library/Fonts/Menlo.ttc",
    "/System/Library/Fonts/SFMono.ttf",
    "/System/Library/Fonts/Courier.dfont",
]


def first_font(paths: list[str], size: int) -> ImageFont.ImageFont:
    for p in paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                continue
    return ImageFont.load_default()


# ---- Drawing primitives ---------------------------------------------------

def vertical_gradient(width: int, height: int, top: tuple, bottom: tuple) -> Image.Image:
    img = Image.new("RGB", (width, height), top)
    px = img.load()
    for y in range(height):
        t = y / (height - 1)
        r = int(top[0] * (1 - t) + bottom[0] * t)
        g = int(top[1] * (1 - t) + bottom[1] * t)
        b = int(top[2] * (1 - t) + bottom[2] * t)
        for x in range(width):
            px[x, y] = (r, g, b)
    return img


def soft_glow(width: int, height: int, bbox: tuple, colour: tuple, alpha: int, blur: int) -> Image.Image:
    """Returns a transparent layer with a single blurred ellipse.
    Composite onto the base with paste(layer, (0,0), layer)."""
    layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse(bbox, fill=(*colour, alpha))
    return layer.filter(ImageFilter.GaussianBlur(blur))


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


# ---- Main render ----------------------------------------------------------

def render(slug: str, title: str, eyebrow: str, accent: str, out_path: Path) -> None:
    accent_rgb = ACCENTS.get(accent, TEAL)

    # Layer 1: vertical gradient ink -> ink-raised
    img = vertical_gradient(W, H, INK, INK_RAISED).convert("RGBA")

    # Layer 2: large soft accent glow upper-right
    glow_a = soft_glow(W, H,
                       bbox=(W - 760, -180, W + 240, 540),
                       colour=accent_rgb, alpha=85, blur=110)
    img.alpha_composite(glow_a)

    # Layer 3: smaller violet glow lower-left for depth
    glow_b = soft_glow(W, H,
                       bbox=(-160, H - 380, 520, H + 100),
                       colour=VIOLET, alpha=55, blur=130)
    img.alpha_composite(glow_b)

    # Layer 4: faint vignette so edges sit darker than centre
    vignette = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    vd = ImageDraw.Draw(vignette)
    # Painted-on radial: just two soft ovals along the edges
    vd.ellipse((-300, -200, 400, 400), fill=(0, 0, 0, 60))
    vd.ellipse((W - 400, H - 400, W + 300, H + 200), fill=(0, 0, 0, 60))
    vignette = vignette.filter(ImageFilter.GaussianBlur(180))
    img.alpha_composite(vignette)

    img = img.convert("RGB")
    draw = ImageDraw.Draw(img)

    # Fonts
    title_font = first_font(FONT_CANDIDATES_BOLD, 86)
    sub_font   = first_font(FONT_CANDIDATES_BOLD, 78)
    meta_font  = first_font(FONT_CANDIDATES_MONO, 18)

    # ---- Eyebrow rule + label (mono, top-left) ----------------------------
    PAD_X, PAD_Y = 80, 80

    # Mono "[ Webgro . The Gro ]" line
    eyebrow_label = "[ Webgro . The Gro ]"
    draw.text((PAD_X, PAD_Y), eyebrow_label, fill=SLATE, font=meta_font)

    # Hairline under it in accent
    bbox = draw.textbbox((PAD_X, PAD_Y), eyebrow_label, font=meta_font)
    rule_y = bbox[3] + 14
    draw.line([(PAD_X, rule_y), (PAD_X + 64, rule_y)], fill=accent_rgb, width=2)

    # Category badge
    category_text = f"  {eyebrow.upper()}  "
    cat_bbox = draw.textbbox((0, 0), category_text, font=meta_font)
    cat_w = cat_bbox[2] - cat_bbox[0] + 24
    cat_h = cat_bbox[3] - cat_bbox[1] + 14
    cat_x = PAD_X
    cat_y = rule_y + 24
    draw.rounded_rectangle(
        [(cat_x, cat_y), (cat_x + cat_w, cat_y + cat_h)],
        radius=18, outline=accent_rgb, width=1,
    )
    draw.text((cat_x + 12, cat_y + 8), eyebrow.upper(), fill=accent_rgb, font=meta_font)

    # ---- Title (large, white, wrapped) ------------------------------------
    title_max_w = W - PAD_X * 2
    lines = wrap_text(draw, title, title_font, title_max_w)
    # If title overflows three lines, drop to a smaller size and re-wrap.
    if len(lines) > 3:
        title_font = first_font(FONT_CANDIDATES_BOLD, 70)
        lines = wrap_text(draw, title, title_font, title_max_w)

    line_h = title_font.size + 12
    title_block_h = line_h * len(lines)
    title_y = (H - title_block_h) // 2 + 10
    for i, line in enumerate(lines):
        draw.text((PAD_X, title_y + i * line_h), line, fill=WHITE, font=title_font)

    # ---- Three-dot brand moment + meta footer -----------------------------
    dot_y = H - 80
    dot_r = 6
    for i, c in enumerate([BLUE, VIOLET, TEAL]):
        cx = PAD_X + i * 22
        draw.ellipse((cx - dot_r, dot_y - dot_r, cx + dot_r, dot_y + dot_r), fill=c)

    # Right-aligned meta line
    meta_text = "Read at webgro.co.uk/the-gro"
    mb = draw.textbbox((0, 0), meta_text, font=meta_font)
    draw.text((W - PAD_X - (mb[2] - mb[0]), dot_y - 4), meta_text, fill=WHITE_60, font=meta_font)

    # ---- Save -------------------------------------------------------------
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path, "JPEG", quality=88, optimize=True, progressive=True)
    size_kb = out_path.stat().st_size / 1024
    print(f"Saved {out_path}  ({W}x{H}, {size_kb:.0f} KB)")


# ---- Entrypoint -----------------------------------------------------------

def main() -> int:
    p = argparse.ArgumentParser(description="Generate a branded hero image for a Gro article.")
    p.add_argument("--slug", required=True, help="Article slug; output filename is <slug>.jpg")
    p.add_argument("--title", required=True, help="Article title text rendered on the image")
    p.add_argument("--eyebrow", default="The Gro", help="Category badge label, e.g. AI / SEO / Strategy")
    p.add_argument("--accent", choices=ACCENTS.keys(), default="teal", help="Brand accent for glow + badge")
    p.add_argument("--out", default=None, help="Override output path; default public/articles/<slug>.jpg")
    args = p.parse_args()

    repo_root = Path(__file__).resolve().parent.parent
    out_path = Path(args.out) if args.out else repo_root / "public" / "articles" / f"{args.slug}.jpg"
    render(args.slug, args.title, args.eyebrow, args.accent, out_path)
    return 0


if __name__ == "__main__":
    sys.exit(main())
