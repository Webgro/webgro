"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  categoryLabel,
  type Accent,
  type Category,
  type CaseStudy,
} from "@/content/work";

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

const accentGradient: Record<Accent, string> = {
  blue: "from-wg-blue/25",
  violet: "from-wg-violet/25",
  teal: "from-wg-teal/25",
};

type ServiceCategory = { slug: string; accent: Accent };

function classifyService(service: string): ServiceCategory {
  const s = service.toLowerCase();
  if (/\bseo\b|\bsearch\b/.test(s)) return { slug: "seo", accent: "blue" };
  if (/\b(ppc|paid|marketing|email|klaviyo|social|google|meta|campaign)\b/.test(s))
    return { slug: "marketing", accent: "violet" };
  if (/\b(ai|automation|wms|agent|integration|generator|pipeline|retouch)\b/.test(s))
    return { slug: "automation-ai", accent: "teal" };
  if (/\b(consultancy|strategy|planning|audit|advisory)\b/.test(s))
    return { slug: "consultancy", accent: "violet" };
  if (/\b(design|brand|theme|typography|identity)\b/.test(s))
    return { slug: "design", accent: "teal" };
  return { slug: "websites", accent: "blue" };
}

const servicePillAccent: Record<Accent, string> = {
  blue: "border-wg-blue/40 bg-wg-blue/10 text-wg-blue hover:bg-wg-blue/15",
  violet: "border-wg-violet/40 bg-wg-violet/10 text-wg-violet hover:bg-wg-violet/15",
  teal: "border-wg-teal/40 bg-wg-teal/10 text-wg-teal hover:bg-wg-teal/15",
};

// Deterministic aspect ratio per case, creates natural variance in the
// masonry without anyone having to hand-tune it. Based on slug hash so
// it stays stable across renders.
const ASPECTS = ["aspect-[4/3]", "aspect-[3/4]", "aspect-[16/10]"];
function aspectFor(slug: string): string {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return ASPECTS[h % ASPECTS.length];
}

type FilterKey = "all" | Category;

function Card({ c }: { c: CaseStudy }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const aspect = aspectFor(c.slug);

  return (
    <article
      ref={ref}
      data-slug={c.slug}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-wg-ink-raised transition-all duration-700 ${accentHoverBorder[c.accent]} ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } hover:-translate-y-1`}
    >
      {/* Full-card link overlay */}
      <Link
        href={`/work/${c.slug}`}
        data-cursor="hover"
        aria-label={`${c.client} case study`}
        className="absolute inset-0 z-[1]"
      />

      <div className={`relative ${aspect} overflow-hidden`}>
        {c.heroImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={c.heroImage}
            alt={c.heroImageAlt}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
        ) : (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${accentGradient[c.accent]} via-wg-ink-raised to-wg-ink`}
          >
            <span className="pointer-events-none select-none px-6 text-center font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-white/20 md:text-5xl">
              {c.client}
            </span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wg-ink-raised via-wg-ink-raised/10 to-transparent" />

        <div className="absolute left-5 top-5">
          <div
            className={`inline-flex items-center gap-2 rounded-full border border-white/20 bg-wg-ink/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] ${accentText[c.accent]} backdrop-blur-md`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${accentDot[c.accent]}`} />
            {c.tag}
          </div>
        </div>
      </div>

      <div className="flex flex-col p-7 md:p-8">
        <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl">
          {c.client}
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-white/60">
          {c.excerpt}
        </p>

        <div className="relative z-[2] mt-6 flex flex-wrap gap-2">
          {c.services.slice(0, 4).map((s) => {
            const cat = classifyService(s);
            return (
              <Link
                key={s}
                href={`/services/${cat.slug}`}
                data-cursor="hover"
                className={`rounded-full border px-3 py-1 text-[10px] font-medium transition ${servicePillAccent[cat.accent]}`}
              >
                {s}
              </Link>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-end">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all duration-500 group-hover:border-white/40 group-hover:bg-white group-hover:text-wg-ink">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
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
    </article>
  );
}

export function WorkBrowser({ caseStudies }: { caseStudies: CaseStudy[] }) {
  const [filter, setFilter] = useState<FilterKey>("all");

  const filters: Array<{ key: FilterKey; label: string; count: number }> = useMemo(() => {
    const counts: Record<FilterKey, number> = {
      all: caseStudies.length,
      ecommerce: 0,
      wordpress: 0,
      ai: 0,
    };
    for (const c of caseStudies) {
      for (const cat of c.categories) counts[cat]++;
    }
    return [
      { key: "all", label: "All work", count: counts.all },
      { key: "ecommerce", label: categoryLabel.ecommerce, count: counts.ecommerce },
      { key: "wordpress", label: categoryLabel.wordpress, count: counts.wordpress },
      { key: "ai", label: categoryLabel.ai, count: counts.ai },
    ];
  }, [caseStudies]);

  const filtered = useMemo(() => {
    if (filter === "all") return caseStudies;
    return caseStudies.filter((c) => c.categories.includes(filter));
  }, [filter, caseStudies]);

  // Track responsive column count so we can distribute items in reading
  // order (left-to-right across columns) rather than top-to-bottom within
  // a single column, which is what CSS `columns` would do.
  const [colCount, setColCount] = useState(3);
  useEffect(() => {
    const compute = () => {
      if (typeof window === "undefined") return 3;
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    };
    setColCount(compute());
    const onResize = () => setColCount(compute());
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const columns = useMemo(() => {
    const cols: CaseStudy[][] = Array.from({ length: colCount }, () => []);
    filtered.forEach((c, i) => cols[i % colCount].push(c));
    return cols;
  }, [filtered, colCount]);

  return (
    <>
      {/* Filter bar */}
      <div
        className="sticky top-0 z-30 border-y border-white/10 bg-wg-ink/95"
        data-filter-bar
      >
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div className="flex flex-wrap items-center gap-2 py-4 md:gap-3">
            <p className="hidden font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-white/40 md:block">
              Filter
            </p>
            {filters.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  data-cursor="hover"
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                    active
                      ? "border-white/30 bg-white text-wg-ink"
                      : "border-white/15 bg-white/[0.03] text-white/70 hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  {f.label}
                  <span
                    className={`font-[family-name:var(--font-mono)] text-[9px] tracking-[0.2em] ${
                      active ? "text-wg-ink/60" : "text-white/30"
                    }`}
                  >
                    {String(f.count).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Masonry grid, JS-distributed into columns so reading flows
          left-to-right across columns instead of top-to-bottom. */}
      <section className="bg-wg-ink py-16 md:py-20">
        <div className="mx-auto max-w-[120rem] px-6 md:px-12 lg:px-16">
          {filtered.length > 0 ? (
            <div className="flex flex-col gap-6 md:flex-row md:gap-6 lg:gap-8">
              {columns.map((col, ci) => (
                <div
                  key={ci}
                  className="flex flex-1 flex-col gap-6 md:gap-6 lg:gap-8"
                >
                  {col.map((c) => (
                    <Card key={c.slug} c={c} />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] text-white/40">
                No matching work
              </p>
              <p className="max-w-md text-white/60">
                Nothing in this category yet. Try another filter, or have a look
                at the full list.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
