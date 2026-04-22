"use client";

import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { HeroBackground } from "./HeroBackground";
import { MagneticLink } from "./MagneticLink";

function splitWords(text: string, charClassName = "") {
  const words = text.split(" ");
  return words.map((word, wi) => (
    <Fragment key={wi}>
      <span className="inline-block whitespace-nowrap">
        {[...word].map((c, ci) => (
          <span
            key={ci}
            data-hero-char
            className={`inline-block will-change-transform ${charClassName}`}
          >
            {c}
          </span>
        ))}
      </span>
      {wi < words.length - 1 && " "}
    </Fragment>
  ));
}

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set("[data-hero-char]", { y: 40, opacity: 0, filter: "blur(14px)" });
      gsap.set("[data-hero-meta]", { y: 20, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.to("[data-hero-char]", {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.1,
        stagger: 0.018,
        delay: 0.15,
      }).to(
        "[data-hero-meta]",
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", stagger: 0.08 },
        "-=0.6"
      );

      gsap.to("[data-float]", {
        y: -6,
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative min-h-screen w-full overflow-hidden bg-wg-ink"
    >
      <HeroBackground />

      {/* Bottom-to-top fade to the work section colour, smooths the transition */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-b from-transparent via-[rgba(7,8,12,0.55)] to-wg-ink-raised" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-between px-6 pb-8 pt-28 md:px-12 md:pt-32 lg:px-16">
        <div className="max-w-6xl py-16">
          <div
            className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/80 backdrop-blur-md"
            data-hero-meta
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wg-teal opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-wg-teal"></span>
            </span>
            Websites built for what&rsquo;s next
          </div>

          <h1 className="font-[family-name:var(--font-display)] text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[7rem]">
            <span className="block pb-2">{splitWords("We build websites.")}</span>
            <span className="block pb-2">
              {splitWords("And the")}{" "}
              <span
                data-hero-char
                className="inline-block bg-gradient-to-r from-wg-blue via-wg-violet to-wg-teal bg-clip-text pr-[0.35em] italic text-transparent will-change-transform"
              >
                systems
              </span>
              {" "}
              {splitWords("behind them.")}
            </span>
          </h1>

          <p
            className="mt-10 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl"
            data-hero-meta
          >
            Shopify and WordPress built for conversion and speed. Production AI tools layered in where the numbers say yes. Today&rsquo;s site. Tomorrow&rsquo;s system.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4" data-hero-meta>
            <MagneticLink
              href="#contact"
              className="group inline-flex items-center gap-3 rounded-full bg-wg-blue px-7 py-4 text-base font-medium text-white transition-colors hover:bg-white hover:text-wg-ink"
            >
              Start the project
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </MagneticLink>
            <MagneticLink
              href="#work"
              strength={0.2}
              className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-base font-medium text-white backdrop-blur-md transition-colors hover:bg-white/10"
            >
              See the work
            </MagneticLink>
          </div>
        </div>

        <div
          className="flex flex-wrap items-end justify-between gap-6 text-xs uppercase tracking-[0.2em] text-white/50"
          data-hero-meta
        >
          <div className="flex items-center gap-3" data-float>
            <span className="font-[family-name:var(--font-mono)] text-[11px]">[ 01 ]</span>
            <span>Scroll to explore</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="translate-y-[1px]" aria-hidden="true">
              <path d="M7 1v12M2 8l5 5 5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex gap-6 font-[family-name:var(--font-mono)] text-[11px] sm:gap-8">
            <span>15+ YRS</span>
            <span>100+ PROJECTS</span>
            <span>UK · WORLDWIDE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
