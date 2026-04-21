"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { articles, type Accent } from "@/content/the-gro";

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

const accentGlow: Record<Accent, string> = {
  blue: "from-wg-blue/15",
  violet: "from-wg-violet/15",
  teal: "from-wg-teal/15",
};

const accentHoverBorder: Record<Accent, string> = {
  blue: "group-hover:border-wg-blue/60",
  violet: "group-hover:border-wg-violet/60",
  teal: "group-hover:border-wg-teal/60",
};

export function TheGroSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const opts = { immediateRender: false, overwrite: "auto" as const };

      gsap.fromTo(
        "[data-gro-eyebrow]",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          ...opts,
          scrollTrigger: { trigger: "[data-gro-header]", start: "top 90%" },
        }
      );

      gsap.fromTo(
        "[data-gro-h2-word]",
        { y: 40, opacity: 0, filter: "blur(12px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.1,
          stagger: 0.12,
          ease: "power4.out",
          ...opts,
          scrollTrigger: { trigger: "[data-gro-header]", start: "top 90%" },
        }
      );

      gsap.fromTo(
        "[data-gro-intro]",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          ...opts,
          scrollTrigger: { trigger: "[data-gro-header]", start: "top 90%" },
        }
      );

      gsap.fromTo(
        "[data-gro-card]",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          ...opts,
          scrollTrigger: {
            trigger: root.current,
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        "[data-gro-cta]",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          ...opts,
          scrollTrigger: { trigger: "[data-gro-cta]", start: "top 95%" },
        }
      );

      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="the-gro"
      className="relative overflow-hidden bg-wg-ink-raised py-32 md:py-40"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-[10%] left-[5%] h-[50vh] w-[50vw] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.08)_0%,_transparent_70%)] blur-3xl"
          style={{ animation: "wgDrift 22s ease-in-out infinite" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        {/* Header */}
        <div
          data-gro-header
          className="mb-16 grid grid-cols-1 gap-10 md:mb-20 md:grid-cols-12 md:gap-16"
        >
          <div className="md:col-span-7">
            <div className="flex items-center gap-4" data-gro-eyebrow>
              <span className="h-[1px] w-12 bg-wg-violet"></span>
              <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] text-wg-violet">
                [ 04 ] The Gro
              </p>
            </div>
            <h2 className="mt-8 font-[family-name:var(--font-display)] text-5xl font-bold leading-[0.95] tracking-tight text-white md:text-7xl lg:text-[7.5rem]">
              <span className="block pb-3">
                <span data-gro-h2-word className="inline-block will-change-transform">
                  Thinking out
                </span>
              </span>
              <span className="block pb-4 md:pb-6 lg:pb-10">
                <span
                  data-gro-h2-word
                  className="inline-block bg-gradient-to-r from-wg-blue via-wg-violet to-wg-teal bg-clip-text pr-[0.35em] italic text-transparent will-change-transform"
                >
                  loud.
                </span>
              </span>
            </h2>
          </div>
          <div className="md:col-span-5 md:pt-40">
            <p
              data-gro-intro
              className="max-w-md text-lg leading-relaxed text-white/60"
            >
              Essays, experiments, and field notes from the studio. On building better websites, shipping AI that earns its keep, and the crossover where the real work happens.
            </p>
          </div>
        </div>

        {/* Articles grid */}
        <div
          data-gro-grid
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-6"
        >
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/the-gro/${a.slug}`}
              data-cursor="hover"
              data-gro-card
              className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-wg-ink transition-all duration-500 hover:-translate-y-1 ${accentHoverBorder[a.accent]}`}
            >
              {/* Hero image */}
              <div className="relative aspect-[16/11] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.heroImage}
                  alt={a.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wg-ink via-wg-ink/10 to-transparent" />

                {/* Overlay pills */}
                <div className="absolute inset-x-5 top-5 flex items-center justify-between">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full border border-white/20 bg-wg-ink/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] ${accentText[a.accent]} backdrop-blur-md`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${accentDot[a.accent]}`} />
                    {a.category}
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-wg-ink/70 px-3 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1" />
                      <path d="M5 3v2l1.5 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                    {a.readTime}
                  </div>
                </div>
              </div>

              {/* Text block */}
              <div className="relative flex flex-1 flex-col p-7 md:p-8">
                {/* Accent glow */}
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentGlow[a.accent]} via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />

                <h3 className="relative font-[family-name:var(--font-display)] text-xl font-bold leading-[1.2] tracking-tight text-white transition-colors duration-500 md:text-2xl">
                  {a.title}
                </h3>

                <div className="relative mt-auto flex items-end justify-between pt-8">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-white/40">
                    {a.date}
                  </span>
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all duration-500 group-hover:border-white/40 group-hover:bg-white group-hover:text-wg-ink`}
                    aria-hidden="true"
                  >
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
            </Link>
          ))}
        </div>

        {/* View all CTA */}
        <div
          data-gro-cta
          className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-12 md:flex-row md:items-center"
        >
          <p className="max-w-md font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] text-white/40">
            Updated weekly · AI-assisted · Human-edited
          </p>
          <Link
            href="/the-gro"
            data-cursor="hover"
            className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-base font-medium text-white backdrop-blur-md transition hover:border-white/40 hover:bg-white/10"
          >
            Read The Gro
            <span className="inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
