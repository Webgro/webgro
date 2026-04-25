"use client";

import dynamic from "next/dynamic";
import { MagneticLink } from "./MagneticLink";

// HeroBackground is a WebGL2 shader. Defer it so the GLSL compile
// + RAF loop don't block hydration or the LCP candidate. The hero
// looks fine without it during the brief moment before it loads.
const HeroBackground = dynamic(
  () => import("./HeroBackground").then((m) => m.HeroBackground),
  { ssr: false }
);

/**
 * Hero entrance is CSS-only (see [data-hero-line] / [data-hero-meta]
 * keyframes in globals.css). That keeps LCP firing on first paint
 * instead of waiting for hydration + GSAP, and removes the visible
 * "render, hide, animate" flicker the JS-driven version caused.
 *
 * The "Scroll to explore" floating cue is also pure CSS (wgFloat).
 */

export function Hero() {
  return (
    <section
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
            style={{ animationDelay: "0.05s" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wg-teal opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-wg-teal"></span>
            </span>
            Websites built for what&rsquo;s next
          </div>

          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-[1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[5rem] xl:text-[5.75rem]">
            <span
              data-hero-line
              className="block pb-2 will-change-transform"
              style={{ animationDelay: "0.1s" }}
            >
              We build websites.
            </span>
            <span
              data-hero-line
              className="block pb-2 will-change-transform"
              style={{ animationDelay: "0.25s" }}
            >
              And the{" "}
              <span className="inline-block bg-gradient-to-r from-wg-blue via-wg-violet to-wg-teal bg-clip-text pr-[0.35em] text-transparent">
                systems
              </span>
              {" "}behind them.
            </span>
          </h1>

          <p
            className="mt-10 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl"
            data-hero-meta
            style={{ animationDelay: "0.55s" }}
          >
            Shopify and WordPress built for conversion and speed. Production AI tools layered in where the numbers say yes. Today&rsquo;s site. Tomorrow&rsquo;s system.
          </p>

          <div
            className="mt-10 flex flex-wrap items-center gap-4"
            data-hero-meta
            style={{ animationDelay: "0.7s" }}
          >
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
          style={{ animationDelay: "0.85s" }}
        >
          <div className="flex items-center gap-3">
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
