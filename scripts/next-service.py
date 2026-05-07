#!/usr/bin/env python3
"""
Service rotation logic for the weekly auto-publish job.

Reads src/content/the-gro.ts, looks at recent articles' categories,
and returns the next service category that should be written about.
The rotation cycles through Webgro's six service buckets in order.

Output: a JSON object on stdout with keys:
    service          one of: websites, consultancy, automation-ai,
                     seo, marketing, design
    label            the human label for the article's `category`
                     field (e.g. "Web Craft", "Strategy", "AI", "SEO")
    accent           a brand accent colour for this service
                     (one of "blue", "violet", "teal")
    relatedService   the slug used by the `relatedService` field on
                     articles (drives the sticky sidebar CTA)
"""

from __future__ import annotations
import argparse
import json
import re
import sys
from pathlib import Path

# Rotation order. The agent picks the entry whose CATEGORY hasn't been
# used most recently. If all categories are used, it picks the one
# that was used longest ago.
ROTATION = [
    {"service": "websites",       "label": "Web Craft",   "accent": "violet", "relatedService": "websites"},
    {"service": "consultancy",    "label": "Strategy",    "accent": "blue",   "relatedService": "consultancy"},
    {"service": "automation-ai",  "label": "AI",          "accent": "teal",   "relatedService": "automation-ai"},
    {"service": "seo",            "label": "SEO",         "accent": "violet", "relatedService": "seo"},
    {"service": "marketing",      "label": "Marketing",   "accent": "blue",   "relatedService": "marketing"},
    {"service": "design",         "label": "Design",      "accent": "teal",   "relatedService": "design"},
]


def parse_categories_in_order(content_path: Path) -> list[str]:
    """Pull category strings out of the-gro.ts in the order they appear.

    Articles are stored with newest-first convention in this codebase,
    so the first match is the most recently published.
    """
    text = content_path.read_text(encoding="utf-8")
    cats: list[str] = []
    for m in re.finditer(r'\bcategory:\s*"([^"]+)"', text):
        cats.append(m.group(1))
    return cats


def next_in_rotation(recent_categories: list[str]) -> dict:
    """Pick the rotation entry whose label hasn't been used most recently.

    We walk the rotation in order, scoring each by how recently its
    label appeared in `recent_categories` (lower = more recent).
    The entry with the highest "staleness" wins; ties broken by
    rotation order so we cycle predictably.
    """
    if not recent_categories:
        return ROTATION[0]

    # Map each rotation label to the position of its most recent use.
    # Position 0 = most recent; sys.maxsize = never used.
    last_used = {entry["label"]: sys.maxsize for entry in ROTATION}
    for idx, cat in enumerate(recent_categories):
        if cat in last_used and last_used[cat] == sys.maxsize:
            last_used[cat] = idx  # remember the first (most recent) occurrence

    # Pick the entry with the largest last_used value; ties go to
    # whatever appears earliest in ROTATION so the cycle is stable.
    best = ROTATION[0]
    best_score = last_used[ROTATION[0]["label"]]
    for entry in ROTATION[1:]:
        score = last_used[entry["label"]]
        if score > best_score:
            best = entry
            best_score = score
    return best


def main() -> int:
    p = argparse.ArgumentParser(description="Pick the next service for the weekly Gro post.")
    p.add_argument("--content", default=None,
                   help="Path to the-gro.ts. Defaults to src/content/the-gro.ts in repo.")
    args = p.parse_args()

    repo_root = Path(__file__).resolve().parent.parent
    content_path = Path(args.content) if args.content else (repo_root / "src" / "content" / "the-gro.ts")
    if not content_path.exists():
        print(f"error: cannot find {content_path}", file=sys.stderr)
        return 1

    recent = parse_categories_in_order(content_path)
    pick = next_in_rotation(recent)
    pick["recentCategories"] = recent[:8]  # for context / debugging
    print(json.dumps(pick, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
