"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Accent, Article } from "@/content/the-gro";

/**
 * Horizontal scroll-snap carousel for the Gro index. Shows 1 card + a
 * peek on small screens, 2 on tablet, 3 on desktop, with prev/next
 * buttons that scroll one card at a time. Works with any number of
 * articles, so adding more posts doesn't break the layout.
 */

const accentDot: Record<Accent, string> = {
  blue: "bg-wg-blue",
  violet: "bg-wg-violet",
  teal: "bg-wg-teal",
};

const accentText: Record<Accent, string> = {
  blue: "text-wg-blue",
  violet: "text-wg-violet",
  teal: "text-wg-teal",
};

const accentHoverBorder: Record<Accent, string> = {
  blue: "hover:border-wg-blue/60",
  violet: "hover:border-wg-violet/60",
  teal: "hover:border-wg-teal/60",
};

export function TheGroCarousel({ articles }: { articles: Article[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    // 8px tolerance so we don't re-render on sub-pixel scroll
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>("[data-card]");
    if (!firstCard) return;
    // Card width + gap (gap-6 = 24px)
    const step = firstCard.offsetWidth + 24;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  return (
    <div className="relative">
      {/* Prev button, hidden on mobile where swipe is native */}
      <div className="pointer-events-none absolute inset-y-0 -left-2 z-20 hidden items-center md:flex lg:-left-4">
        <button
          type="button"
          aria-label="Previous articles"
          onClick={() => scrollByCard(-1)}
          disabled={!canLeft}
          data-cursor="hover"
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-wg-ink/70 text-white/80 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white hover:text-wg-ink disabled:pointer-events-none disabled:opacity-20"
        >
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M7.5 10L3.5 6L7.5 2"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Next button */}
      <div className="pointer-events-none absolute inset-y-0 -right-2 z-20 hidden items-center md:flex lg:-right-4">
        <button
          type="button"
          aria-label="Next articles"
          onClick={() => scrollByCard(1)}
          disabled={!canRight}
          data-cursor="hover"
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-wg-ink/70 text-white/80 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white hover:text-wg-ink disabled:pointer-events-none disabled:opacity-20"
        >
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M4.5 2L8.5 6L4.5 10"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Scroller */}
      <div
        ref={scrollerRef}
        className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 pb-6 md:-mx-12 md:px-12 lg:-mx-16 lg:px-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/the-gro/${a.slug}`}
            data-cursor="hover"
            data-card
            className={`group relative flex w-[85%] flex-shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-white/10 bg-wg-ink-raised transition-all duration-500 hover:-translate-y-1 sm:w-[62%] md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] ${accentHoverBorder[a.accent]}`}
          >
            {/* Hero image */}
            <div className="relative aspect-[16/11] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={a.heroImage}
                alt={a.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wg-ink-raised via-wg-ink-raised/10 to-transparent" />

              <div className="absolute inset-x-5 top-5 flex items-center justify-between">
                <div
                  className={`inline-flex items-center gap-2 rounded-full border border-white/20 bg-wg-ink/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] ${accentText[a.accent]} backdrop-blur-md`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${accentDot[a.accent]}`} />
                  {a.category}
                </div>
                <div className="inline-flex items-center rounded-full border border-white/20 bg-wg-ink/70 px-3 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
                  {a.readTime}
                </div>
              </div>
            </div>

            {/* Text block */}
            <div className="flex flex-1 flex-col p-8">
              <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl">
                {a.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/60">{a.excerpt}</p>
              <div className="mt-auto flex items-center justify-between pt-10">
                <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-white/40">
                  {a.date}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all duration-500 group-hover:border-white/40 group-hover:bg-white group-hover:text-wg-ink">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path
                      d="M3 9L9 3M9 3H4M9 3V8"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
