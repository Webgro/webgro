"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Accent, Article, ArticleBlock } from "@/content/the-gro";
import { services } from "@/content/services";

const serviceAccent: Record<"blue" | "violet" | "teal", string> = {
  blue: "from-wg-blue/25 via-transparent",
  violet: "from-wg-violet/25 via-transparent",
  teal: "from-wg-teal/25 via-transparent",
};

function ArticleSidebar({ article }: { article: Article }) {
  const service = article.relatedService
    ? services.find((s) => s.slug === article.relatedService)
    : undefined;

  return (
    <div className="lg:sticky lg:top-28 lg:z-10 lg:flex lg:flex-col lg:gap-4">
      {service && (
        <Link
          href={`/services/${service.slug}`}
          data-cursor="hover"
          className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-wg-ink-raised p-7 transition-all duration-500 hover:-translate-y-1 hover:border-white/25 md:p-8 lg:min-h-[260px]"
        >
          <div
            className={`pointer-events-none absolute -right-1/3 -top-1/3 h-[200%] w-[80%] bg-gradient-to-br ${serviceAccent[service.accent]} to-transparent opacity-40 blur-3xl`}
          />
          <div className="relative">
            <p
              className={`font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] ${
                service.accent === "blue"
                  ? "text-wg-blue"
                  : service.accent === "violet"
                  ? "text-wg-violet"
                  : "text-wg-teal"
              }`}
            >
              {service.num} · {service.name}
            </p>
            <p className="mt-8 font-[family-name:var(--font-display)] text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl">
              {service.name}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              {service.tagline}
            </p>
          </div>
          <span className="relative mt-8 inline-flex items-center gap-2 text-sm font-medium text-white">
            Read more
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </span>
        </Link>
      )}

      <Link
        href="/#contact"
        data-cursor="hover"
        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white p-7 text-wg-ink transition-all duration-500 hover:-translate-y-1 md:p-8 lg:min-h-[200px]"
      >
        <div className="relative">
          <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-wg-ink/60">
            Talk to us
          </p>
          <p className="mt-8 font-[family-name:var(--font-display)] text-2xl font-bold leading-tight tracking-tight md:text-3xl">
            Speak to an expert
          </p>
          <p className="mt-2 text-sm leading-relaxed text-wg-ink/70">
            30 minutes, no decks, no pressure.
          </p>
        </div>
        <span className="relative mt-8 inline-flex items-center gap-2 text-sm font-semibold text-wg-ink">
          Start the project
          <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </span>
      </Link>
    </div>
  );
}

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

const accentBorder: Record<Accent, string> = {
  blue: "border-wg-blue/60",
  violet: "border-wg-violet/60",
  teal: "border-wg-teal/60",
};

const accentGradientFrom: Record<Accent, string> = {
  blue: "from-wg-blue/25",
  violet: "from-wg-violet/25",
  teal: "from-wg-teal/25",
};

const accentProgressGradient: Record<Accent, string> = {
  blue: "from-wg-blue via-wg-violet to-wg-teal",
  violet: "from-wg-violet via-wg-blue to-wg-teal",
  teal: "from-wg-teal via-wg-blue to-wg-violet",
};

function BlockRenderer({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "p":
      return (
        <p className="mt-6 text-lg leading-[1.7] text-white/75 md:text-xl md:leading-[1.65]">
          {block.text}
        </p>
      );
    case "h2":
      return (
        <h2 className="mt-16 font-[family-name:var(--font-display)] text-3xl font-bold leading-tight tracking-tight text-white md:mt-20 md:text-4xl">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-10 font-[family-name:var(--font-display)] text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl">
          {block.text}
        </h3>
      );
    case "ul":
      return (
        <ul className="mt-6 space-y-3">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex gap-4 text-lg leading-[1.7] text-white/75 md:text-xl"
            >
              <span className="mt-[12px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="mt-6 space-y-4">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex gap-4 text-lg leading-[1.7] text-white/75 md:text-xl"
            >
              <span className="shrink-0 font-[family-name:var(--font-mono)] text-sm text-white/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
    case "quote":
      return (
        <blockquote className="my-10 border-l-2 border-white/30 pl-6 font-[family-name:var(--font-display)] text-2xl italic leading-snug text-white/90 md:text-3xl">
          &ldquo;{block.text}&rdquo;
        </blockquote>
      );
    case "callout": {
      const accent = block.accent ?? "blue";
      return (
        <div
          className={`my-12 rounded-2xl border ${accentBorder[accent]} bg-white/[0.02] p-6 md:p-8`}
        >
          <div className="flex items-start gap-4">
            <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${accentDot[accent]}`} />
            <p className="font-[family-name:var(--font-display)] text-xl font-medium italic leading-snug text-white md:text-2xl">
              {block.text}
            </p>
          </div>
        </div>
      );
    }
  }
}

export function ArticleView({
  article,
  related,
}: {
  article: Article;
  related: Article[];
}) {
  const root = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = bodyRef.current;
    const bar = progressRef.current;
    if (!body || !bar) return;
    const update = () => {
      const rect = body.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const pct = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
      bar.style.transform = `scaleX(${pct})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Hero entrance (data-article-title-line / -meta / -excerpt) is now
  // CSS-only via globals.css. LCP fires on first paint without waiting
  // for hydration, and there's no flash from JS hiding then animating.

  return (
    <article ref={root} className="relative bg-wg-ink">
      {/* Reading progress */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-white/5"
      >
        <div
          ref={progressRef}
          className={`h-full origin-left scale-x-0 bg-gradient-to-r ${accentProgressGradient[article.accent]}`}
        />
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/10 bg-wg-ink-raised pb-20 pt-32 md:pb-28 md:pt-40">
        {/* Accent glow */}
        <div
          className={`pointer-events-none absolute -top-[30%] left-1/2 h-[70vh] w-[70vw] -translate-x-1/2 rounded-full bg-gradient-to-br ${accentGradientFrom[article.accent]} via-transparent to-transparent blur-3xl`}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-12 lg:px-16">
          {/* Back link */}
          <Link
            href="/the-gro"
            data-cursor="hover"
            data-article-meta
            className="group mb-12 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-white/85 backdrop-blur-md transition hover:border-white/35 hover:bg-white/[0.08] hover:text-white"
          >
            <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
            The Gro
          </Link>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3" data-article-meta>
            <div
              className={`inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] ${accentText[article.accent]}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${accentDot[article.accent]}`} />
              {article.category}
            </div>
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/40">
              {article.date}
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/40">
              ·
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/40">
              {article.readTime}
            </span>
          </div>

          {/* Title */}
          <h1 className="mt-10 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
            {article.title.split(" ").map((word, i) => (
              <span key={i} className="inline-block pb-2 pr-[0.2em]">
                <span data-article-title-line className="inline-block will-change-transform">
                  {word}
                </span>
              </span>
            ))}
          </h1>

          {/* Excerpt */}
          <p
            data-article-excerpt
            className="mt-8 max-w-2xl text-lg leading-relaxed text-white/60 md:text-xl"
          >
            {article.excerpt}
          </p>

          {/* Author */}
          <div data-article-meta className="mt-12 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.05]">
              <span className="font-[family-name:var(--font-display)] text-sm font-bold text-white">W</span>
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-sm font-medium text-white">
                {article.author}
              </p>
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-white/40">
                AI-assisted · Human-edited
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero image */}
      <div className="relative -mt-12 md:-mt-16">
        <div className="mx-auto max-w-5xl px-6 md:px-12 lg:px-16">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-white/10 bg-wg-ink-raised shadow-2xl shadow-black/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.heroImage}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Body + sticky sidebar */}
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 md:px-12 md:pb-28 md:pt-20 lg:px-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_280px] lg:gap-16">
          <div ref={bodyRef} className="mx-auto w-full max-w-3xl min-w-0 lg:mx-0">
            {article.body.map((block, i) => (
              <BlockRenderer key={i} block={block} />
            ))}
          </div>

          {/* Sidebar, sticky on desktop, stacked above article on mobile */}
          <aside className="order-first lg:order-none">
            <ArticleSidebar article={article} />
          </aside>
        </div>
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <div className="border-t border-white/10 bg-wg-ink-raised py-20 md:py-24">
          <div className="mx-auto max-w-5xl px-6 md:px-12 lg:px-16">
            <div className="mb-10 flex items-center gap-4">
              <span className="h-[1px] w-12 bg-wg-blue"></span>
              <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] text-wg-blue">
                Keep reading
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/the-gro/${r.slug}`}
                  data-cursor="hover"
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-wg-ink p-8 transition-all duration-500 hover:-translate-y-1 hover:border-white/25"
                >
                  <div
                    className={`inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] ${accentText[r.accent]}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${accentDot[r.accent]}`} />
                    {r.category}
                  </div>
                  <h3 className="mt-6 font-[family-name:var(--font-display)] text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl">
                    {r.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/60">
                    {r.excerpt}
                  </p>
                  <div className="mt-8 flex items-center justify-between">
                    <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-white/40">
                      {r.readTime}
                    </span>
                    <span className="inline-block text-white/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <Link
                href="/the-gro"
                data-cursor="hover"
                className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-base font-medium text-white backdrop-blur-md transition hover:border-white/40 hover:bg-white/10"
              >
                View all articles
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
