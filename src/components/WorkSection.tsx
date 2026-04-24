"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Accent = "blue" | "violet" | "teal";
type CardSize = "hero" | "fill";

type CaseStudy = {
  slug: string;
  client: string;
  tag: string;
  services: string;
  image: string;
  accent: Accent;
  size: CardSize;
};

// Bento layout: hero + fill + fill + hero produces a mirrored asymmetric grid
// Row 1: Fun Cases (8) + Gieves (4).  Row 2: it's Pouch (4) + Origin (8).
const cases: CaseStudy[] = [
  {
    slug: "fun-cases",
    client: "Fun Cases",
    tag: "eCommerce",
    services: "Shopify · Design · Build",
    image: "/work/fun-cases.png",
    accent: "blue",
    size: "hero",
  },
  {
    slug: "gieves-and-hawkes",
    client: "Gieves & Hawkes",
    tag: "Luxury eCommerce",
    services: "Shopify · Design · Build",
    image: "/work/gieves-hawkes.webp",
    accent: "violet",
    size: "fill",
  },
  {
    slug: "its-pouch",
    client: "it's Pouch",
    tag: "eCommerce",
    services: "Shopify · Build · Email",
    image: "/work/its-pouch.png",
    accent: "teal",
    size: "fill",
  },
  {
    slug: "sublishop",
    client: "Sublishop",
    tag: "B2B eCommerce · AI",
    services: "Shopify · AI apps · SEO",
    image: "/work/sublishop.jpg",
    accent: "violet",
    size: "hero",
  },
];

const accentDot: Record<Accent, string> = {
  blue: "bg-wg-blue",
  violet: "bg-wg-violet",
  teal: "bg-wg-teal",
};

const sizeClasses: Record<CardSize, string> = {
  hero: "col-span-12 aspect-[4/3] md:col-span-8",
  fill: "col-span-12 aspect-[4/3] md:col-span-4 md:aspect-auto",
};

function MarqueeSegment() {
  return (
    <div className="flex shrink-0 items-center gap-12 pr-12">
      <span>Websites</span>
      <span className="text-wg-blue">●</span>
      <span>Consultancy</span>
      <span className="text-wg-violet">●</span>
      <span>Automation &amp; AI</span>
      <span className="text-wg-teal">●</span>
      <span>SEO</span>
      <span className="text-wg-blue">●</span>
      <span>Marketing</span>
      <span className="text-wg-violet">●</span>
      <span>Design</span>
      <span className="text-wg-teal">●</span>
    </div>
  );
}

export function WorkSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-work-eyebrow]",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: "[data-work-header]", start: "top 85%" },
        }
      );

      gsap.set("[data-work-h2-word]", {
        y: 40,
        opacity: 0,
        filter: "blur(12px)",
      });
      gsap.to("[data-work-h2-word]", {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.1,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: { trigger: "[data-work-header]", start: "top 80%" },
      });

      gsap.fromTo(
        "[data-work-intro]",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-work-header]", start: "top 75%" },
        }
      );

      gsap.fromTo(
        "[data-case-card]",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-work-grid]", start: "top 85%" },
        }
      );

      gsap.fromTo(
        "[data-view-all]",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-view-all]", start: "top 95%" },
        }
      );

      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="work"
      className="relative overflow-hidden bg-wg-ink-raised"
    >
      {/* Marquee */}
      <div className="overflow-hidden border-y border-white/10 bg-wg-ink py-5">
        <div className="animate-marquee flex whitespace-nowrap font-[family-name:var(--font-display)] text-2xl font-bold uppercase tracking-tight text-white/25 md:text-3xl">
          <MarqueeSegment />
          <MarqueeSegment />
          <MarqueeSegment />
          <MarqueeSegment />
        </div>
      </div>

      {/* Header */}
      <div
        className="mx-auto max-w-7xl px-6 pb-16 pt-32 md:px-12 md:pb-20 md:pt-40 lg:px-16"
        data-work-header
      >
        <div className="flex items-center gap-4" data-work-eyebrow>
          <span className="h-[1px] w-12 bg-wg-blue"></span>
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] text-wg-blue">
            [ 02 ] Selected work
          </p>
        </div>
        <h2 className="mt-8 font-[family-name:var(--font-display)] text-5xl font-bold leading-[0.95] tracking-tight text-white md:text-7xl lg:text-[7.5rem]">
          <span className="block pb-3">
            <span data-work-h2-word className="inline-block will-change-transform">
              Work that
            </span>
          </span>
          <span className="block pb-3">
            <span
              data-work-h2-word
              className="inline-block bg-gradient-to-r from-wg-blue via-wg-violet to-wg-teal bg-clip-text pr-[0.35em] text-transparent will-change-transform"
            >
              earns its keep.
            </span>
          </span>
        </h2>
        <p
          data-work-intro
          className="mt-10 max-w-xl text-lg leading-relaxed text-white/60"
        >
          Three featured from 100+ shipped builds. Each one lighter, faster, and ready to extend with AI when the business is.
        </p>
      </div>

      {/* Bento grid */}
      <div className="mx-auto max-w-7xl px-6 pb-16 md:px-12 md:pb-20 lg:px-16">
        <div
          data-work-grid
          className="grid grid-cols-12 gap-4 md:gap-5 lg:gap-6"
        >
          {cases.map((c) => (
            <article
              key={c.client}
              data-case-card
              className={`${sizeClasses[c.size]} group relative overflow-hidden rounded-3xl border border-white/10 bg-wg-ink transition-colors duration-500 hover:border-white/25`}
            >
              <Link
                href={`/work/${c.slug}`}
                data-cursor="hover"
                className="absolute inset-0 block"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image}
                  alt={c.client}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />

                {/* Bottom gradient for text readability */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wg-ink via-wg-ink/30 to-transparent" />

                {/* Top-left category pill */}
                <div className="absolute left-5 top-5 md:left-6 md:top-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-wg-ink/70 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white backdrop-blur-md">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${accentDot[c.accent]}`}
                    ></span>
                    {c.tag}
                  </div>
                </div>

                {/* Top-right "View" pill on hover */}
                <div className="pointer-events-none absolute right-5 top-5 translate-x-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 md:right-6 md:top-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-wg-ink">
                    View case study →
                  </div>
                </div>

                {/* Bottom content */}
                <div className="absolute inset-x-5 bottom-5 md:inset-x-8 md:bottom-7">
                  <h3 className="font-[family-name:var(--font-display)] text-3xl font-bold leading-[0.95] tracking-tight text-white md:text-4xl lg:text-5xl">
                    {c.client}
                  </h3>
                  <p className="mt-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/60">
                    {c.services}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* View all projects CTA */}
      <div
        data-view-all
        className="mx-auto flex max-w-7xl justify-center px-6 pb-24 pt-4 md:px-12 md:pb-32 lg:px-16"
      >
        <Link
          href="/work"
          data-cursor="hover"
          className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-5 text-base font-medium text-white backdrop-blur-md transition hover:border-white/40 hover:bg-white/10"
        >
          View all projects
          <span className="inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
