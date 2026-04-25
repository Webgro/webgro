"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useIsomorphicLayoutEffect from "@/lib/useIsomorphicLayoutEffect";
import type { Accent } from "@/content/work";
import type { Principle, TeamMember } from "@/content/about";
import { about } from "@/content/about";

// -----------------------------------------------------------------------------
// Small shared styling maps. Mirrors the service pages so the About page sits
// in the same visual system without pulling in ServiceView's heavier parts.
// -----------------------------------------------------------------------------

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

const accentGradientFrom: Record<Accent, string> = {
  blue: "from-wg-blue/30",
  violet: "from-wg-violet/30",
  teal: "from-wg-teal/30",
};

const accentRing: Record<Accent, string> = {
  blue: "ring-wg-blue/30",
  violet: "ring-wg-violet/30",
  teal: "ring-wg-teal/30",
};

// -----------------------------------------------------------------------------
// Avatar — initial-on-colour fallback that cleanly swaps for a photo when
// the `photo` field on a team member is populated. Keeps the design consistent
// while the real headshots are still being shot.
// -----------------------------------------------------------------------------
function Avatar({ member }: { member: TeamMember }) {
  const initials = member.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  if (member.photo) {
    return (
      <div
        className={`relative h-28 w-28 overflow-hidden rounded-full ring-4 ${accentRing[member.accent]} md:h-32 md:w-32`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={member.photo}
          alt={member.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    );
  }
  return (
    <div
      className={`relative flex h-28 w-28 items-center justify-center rounded-full ring-4 ${accentRing[member.accent]} bg-gradient-to-br ${accentGradientFrom[member.accent]} via-wg-ink-raised to-wg-ink md:h-32 md:w-32`}
    >
      <span
        className={`font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight ${accentText[member.accent]} md:text-5xl`}
      >
        {initials}
      </span>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Section helper — matches the service page's "eyebrow + rule" label pattern.
// -----------------------------------------------------------------------------
function Eyebrow({
  dotAccent,
  text,
  color,
}: {
  dotAccent: Accent;
  text: string;
  color: Accent;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className={`h-[1px] w-12 ${accentDot[dotAccent]}`} />
      <p
        className={`font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] ${accentText[color]}`}
      >
        {text}
      </p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// The About page itself. Mirrors the service page animation approach:
// data-* attributes are set to opacity:0 via globals.css, then revealed by
// GSAP as the user scrolls into each section. Fail-safe if JS misfires is
// handled at the CSS layer.
// -----------------------------------------------------------------------------
export function AboutView() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero meta + lead (fire on mount, not scroll)
      gsap.fromTo(
        "[data-about-meta]",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.1,
        }
      );
      gsap.fromTo(
        "[data-about-title]",
        { y: 40, opacity: 0, filter: "blur(12px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power4.out",
          delay: 0.2,
        }
      );
      gsap.fromTo(
        "[data-about-lead]",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.7 }
      );

      // Section reveals — generic stagger for eyebrow/heading/body triples
      ScrollTrigger.batch("[data-about-reveal]", {
        start: "top 85%",
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.08,
              overwrite: "auto",
            }
          ),
      });

      // Team cards — rise + slight scale-in, staggered
      ScrollTrigger.batch("[data-about-person]", {
        start: "top 88%",
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { y: 40, opacity: 0, scale: 0.96 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.08,
              overwrite: "auto",
            }
          ),
      });

      // Principle cards — simple rise stagger
      ScrollTrigger.batch("[data-about-principle]", {
        start: "top 90%",
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.05,
              overwrite: "auto",
            }
          ),
      });

      // Award medallion cards
      ScrollTrigger.batch("[data-about-award]", {
        start: "top 88%",
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { y: 30, opacity: 0, scale: 0.94 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.08,
              overwrite: "auto",
            }
          ),
      });

      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, []);

  const yearsRunning = new Date().getFullYear() - about.founded;

  return (
    <article ref={root} className="relative bg-wg-ink">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/10 bg-wg-ink-raised pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="pointer-events-none absolute -top-[30%] left-1/2 h-[70vh] w-[70vw] -translate-x-1/2 rounded-full bg-gradient-to-br from-wg-blue/30 via-wg-violet/20 to-wg-teal/10 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <Link
            href="/"
            data-cursor="hover"
            data-about-meta
            className="group mb-12 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-white/85 backdrop-blur-md transition hover:border-white/35 hover:bg-white/[0.08] hover:text-white"
          >
            <span className="inline-block transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Home
          </Link>

          <p
            data-about-meta
            className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.28em] text-wg-blue"
          >
            {about.hero.eyebrow}
          </p>

          <h1
            data-about-title
            className="mt-6 max-w-5xl font-[family-name:var(--font-display)] text-5xl font-bold leading-[1] tracking-tight text-white md:text-7xl lg:text-[5.5rem]"
          >
            {about.hero.heading}{" "}
            <span className="bg-gradient-to-r from-wg-blue via-wg-violet to-wg-teal bg-clip-text pr-[0.35em] text-transparent">
              {about.hero.headingAccent}
            </span>
          </h1>

          <p
            data-about-lead
            className="mt-10 max-w-3xl text-lg leading-relaxed text-white/70 md:text-2xl md:leading-[1.4]"
          >
            {about.hero.lead}
          </p>

          {/* Hero footer meta: founding year + running-years counter */}
          <div
            data-about-meta
            className="mt-12 flex flex-wrap items-center gap-6 border-t border-white/10 pt-8 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] text-white/50 md:gap-10"
          >
            <span>
              <span className="text-wg-teal">Est.</span> {about.founded}
            </span>
            <span>
              <span className="text-wg-violet">{yearsRunning}</span> years running
            </span>
            <span>
              <span className="text-wg-blue">5x</span> award-winning
            </span>
            <span>
              <span className="text-wg-teal">{about.team.length}</span> senior
              team + network
            </span>
          </div>
        </div>
      </section>

      {/* ── Story ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-wg-ink py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-[20%] right-[-5%] h-[50vh] w-[45vw] rounded-full bg-gradient-to-br from-wg-violet/30 via-transparent to-transparent opacity-[0.3] blur-3xl"
            style={{ animation: "wgDrift 26s ease-in-out infinite" }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div data-about-reveal>
            <Eyebrow dotAccent="violet" text={about.story.eyebrow} color="violet" />
          </div>
          <h2
            data-about-reveal
            className="mt-6 max-w-4xl font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl"
          >
            {about.story.heading}
          </h2>
          <div data-about-reveal className="mt-8 max-w-3xl space-y-6">
            {about.story.body.map((p, i) => (
              <p
                key={i}
                className="text-lg leading-[1.7] text-white/75 md:text-xl md:leading-[1.65]"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Broadbridge Group angle ──────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/10 bg-wg-ink-raised py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-[10%] left-[-5%] h-[55vh] w-[50vw] rounded-full bg-gradient-to-br from-wg-teal/25 via-transparent to-transparent opacity-[0.35] blur-3xl"
            style={{ animation: "wgDrift 32s ease-in-out infinite" }}
          />
        </div>
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-12 md:gap-16 md:px-12 lg:px-16">
          <div className="md:col-span-5">
            <div data-about-reveal>
              <Eyebrow
                dotAccent="teal"
                text={about.broadbridge.eyebrow}
                color="teal"
              />
            </div>
            <h2
              data-about-reveal
              className="mt-6 font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl"
            >
              {about.broadbridge.heading}
            </h2>
          </div>
          <div className="md:col-span-7">
            <div data-about-reveal className="space-y-6">
              {about.broadbridge.body.map((p, i) => (
                <p
                  key={i}
                  className="text-lg leading-[1.7] text-white/75 md:text-xl md:leading-[1.55]"
                >
                  {p}
                </p>
              ))}
            </div>
            <a
              data-about-reveal
              href="https://broadbridge.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="group mt-10 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium text-white backdrop-blur-md transition hover:border-wg-teal/60 hover:bg-white/10"
            >
              Broadbridge Group
              <span className="inline-block transition-transform group-hover:translate-x-1">
                ↗
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/10 bg-wg-ink py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-[-10%] right-[-5%] h-[60vh] w-[50vw] rounded-full bg-gradient-to-br from-wg-blue/20 via-transparent to-transparent opacity-[0.3] blur-3xl"
            style={{ animation: "wgDrift 28s ease-in-out infinite" }}
          />
          <div
            className="absolute bottom-[0%] left-[-5%] h-[40vh] w-[45vw] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.14)_0%,_transparent_70%)] blur-3xl"
            style={{ animation: "wgDrift 34s ease-in-out infinite reverse" }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div data-about-reveal>
            <Eyebrow dotAccent="blue" text="[ The team ]" color="blue" />
          </div>
          <h2
            data-about-reveal
            className="mt-6 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl"
          >
            Five people, one studio.
          </h2>
          <p
            data-about-reveal
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65"
          >
            A small senior core, each running their own discipline end-to-end.
            Specialist partners brought in per project, same standard, no
            agency-hopping on your watch.
          </p>

          <div
            data-about-reveal
            className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {about.team.map((m) => (
              <div
                key={m.name}
                data-about-person
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-wg-ink-raised p-8 transition-colors hover:border-white/20 md:p-9"
              >
                <div
                  className={`pointer-events-none absolute -right-1/4 -top-1/3 h-[140%] w-[80%] bg-gradient-to-br ${accentGradientFrom[m.accent]} via-transparent to-transparent opacity-25 blur-3xl`}
                />
                <div className="relative flex items-start gap-5">
                  <Avatar member={m} />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] ${accentText[m.accent]}`}
                    >
                      {m.role}
                    </p>
                    <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold leading-tight tracking-tight text-white md:text-[1.7rem]">
                      {m.name}
                    </h3>
                    {m.since && (
                      <p className="mt-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-white/40">
                        Since {m.since}
                      </p>
                    )}
                  </div>
                </div>
                <p className="relative mt-6 text-[15px] leading-relaxed text-white/70">
                  {m.bio}
                </p>
              </div>
            ))}

            {/* Sixth tile: "join us" / network placeholder so the grid stays
                balanced at 3 columns and the page has somewhere to point
                ambitious candidates. */}
            <div
              data-about-person
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-dashed border-white/15 bg-wg-ink p-8 md:p-9"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-wg-blue/10 via-wg-violet/10 to-wg-teal/10 opacity-30" />
              <div className="relative">
                <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-white/50">
                  And the network
                </p>
                <h3 className="mt-6 font-[family-name:var(--font-display)] text-2xl font-bold leading-tight tracking-tight text-white md:text-[1.7rem]">
                  Senior specialists, brought in per project.
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-white/65">
                  Paid-media buyers, logistics consultants, B2B strategists,
                  luxury brand designers, platform migration specialists. One
                  point of contact for you, the coordination handled here.
                </p>
              </div>
              <Link
                href="/#contact"
                data-cursor="hover"
                className="relative mt-6 inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/70 transition hover:text-white"
              >
                Get in touch{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── How we work / Principles ─────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/10 bg-wg-ink-raised py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-[10%] left-[5%] h-[50vh] w-[45vw] rounded-full bg-gradient-to-br from-wg-teal/25 via-transparent to-transparent opacity-[0.3] blur-3xl"
            style={{ animation: "wgDrift 24s ease-in-out infinite" }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div data-about-reveal>
            <Eyebrow dotAccent="teal" text="[ How we work ]" color="teal" />
          </div>
          <h2
            data-about-reveal
            className="mt-6 max-w-4xl font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl"
          >
            Six rules the studio runs by.
          </h2>
          <p
            data-about-reveal
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65"
          >
            Not a process doc. The things we've learned by being the agency and
            being the client, sometimes on the same project.
          </p>

          <div
            data-about-reveal
            className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6"
          >
            {about.principles.map((p: Principle) => (
              <div
                key={p.num}
                data-about-principle
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-wg-ink p-7 transition-colors hover:border-white/20 md:p-8"
              >
                <div
                  className={`pointer-events-none absolute -right-1/4 -top-1/3 h-[140%] w-[70%] bg-gradient-to-br ${accentGradientFrom[p.accent]} via-transparent to-transparent opacity-25 blur-3xl`}
                />
                <div className="relative flex items-center justify-between">
                  <span
                    className={`font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.28em] ${accentText[p.accent]}`}
                  >
                    {p.num}
                  </span>
                  <span className={`h-1.5 w-1.5 rounded-full ${accentDot[p.accent]}`} />
                </div>
                <h3 className="relative mt-5 font-[family-name:var(--font-display)] text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
                  {p.heading}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-white/70 md:text-[15px]">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Studio / HQ ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/10 bg-wg-ink py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute bottom-[10%] left-[-5%] h-[45vh] w-[45vw] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(45,141,255,0.14)_0%,_transparent_70%)] blur-3xl"
            style={{ animation: "wgDrift 30s ease-in-out infinite" }}
          />
        </div>
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-12 md:gap-16 md:px-12 lg:px-16">
          <div className="md:col-span-5">
            <div data-about-reveal>
              <Eyebrow dotAccent="blue" text={about.studio.eyebrow} color="blue" />
            </div>
            <h2
              data-about-reveal
              className="mt-6 font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl"
            >
              {about.studio.heading}
            </h2>
          </div>
          <div className="md:col-span-7">
            <div data-about-reveal className="space-y-6">
              {about.studio.body.map((p, i) => (
                <p
                  key={i}
                  className="text-lg leading-[1.7] text-white/75 md:text-xl md:leading-[1.55]"
                >
                  {p}
                </p>
              ))}
            </div>
            <div
              data-about-reveal
              className="mt-10 rounded-3xl border border-white/10 bg-wg-ink-raised p-6 md:p-8"
            >
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-wg-blue">
                Head office
              </p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-white">
                {about.studio.address}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Awards ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/10 bg-wg-ink-raised py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-[10%] right-[0%] h-[50vh] w-[45vw] rounded-full bg-gradient-to-br from-wg-violet/25 via-transparent to-transparent opacity-[0.3] blur-3xl"
            style={{ animation: "wgDrift 22s ease-in-out infinite" }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div data-about-reveal>
            <Eyebrow dotAccent="violet" text="[ Awards ]" color="violet" />
          </div>
          <h2
            data-about-reveal
            className="mt-6 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl"
          >
            Five-time award winners.
          </h2>

          <div
            data-about-reveal
            className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-5"
          >
            {about.awards.map((a, i) => (
              <div
                key={`${a.year}-${i}`}
                data-about-award
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-wg-ink p-6 text-center md:p-7"
              >
                {/* Medallion: colored disc with a star. Same treatment used
                    in the proposal deck, translated to dark mode. */}
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full md:h-16 md:w-16" style={{
                  backgroundColor:
                    a.accent === "blue"
                      ? "#2D8DFF"
                      : a.accent === "violet"
                      ? "#7C3AED"
                      : "#00C9A7",
                }}>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 md:h-7 md:w-7"
                    fill="white"
                    aria-hidden="true"
                  >
                    <path d="M12 2l2.6 6.3L21 9l-5 4.4 1.6 6.6L12 16.8 6.4 20 8 13.4 3 9l6.4-.7L12 2z" />
                  </svg>
                </div>
                <p
                  className={`font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight ${accentText[a.accent]} md:text-4xl`}
                >
                  {a.year}
                </p>
                <p className="mt-2 text-sm font-medium leading-tight text-white md:text-base">
                  {a.title}
                </p>
                <p className="mt-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-white/50">
                  {a.region}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/10 bg-wg-ink py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -bottom-[20%] left-[-5%] h-[60vh] w-[55vw] rounded-full bg-gradient-to-br from-wg-blue/25 via-transparent to-transparent opacity-[0.3] blur-3xl"
            style={{ animation: "wgDrift 28s ease-in-out infinite" }}
          />
          <div
            className="absolute top-[-10%] right-[0%] h-[50vh] w-[45vw] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.14)_0%,_transparent_70%)] blur-3xl"
            style={{ animation: "wgDrift 34s ease-in-out infinite reverse" }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12 lg:px-16">
          <Eyebrow dotAccent="blue" text="[ Next steps ]" color="blue" />
          <h2 className="mt-6 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
            {about.cta.heading}{" "}
            <span className="bg-gradient-to-r from-wg-blue via-wg-violet to-wg-teal bg-clip-text pr-[0.35em] text-transparent">
              {about.cta.headingAccent}
            </span>
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/65 md:text-xl">
            {about.cta.body}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/#contact"
              data-cursor="hover"
              className="group inline-flex items-center gap-3 rounded-full bg-wg-blue px-7 py-4 text-base font-medium text-white transition-colors hover:bg-white hover:text-wg-ink"
            >
              Start a conversation
              <span className="inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              href="/work"
              data-cursor="hover"
              className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-base font-medium text-white backdrop-blur-md transition hover:border-white/40 hover:bg-white/10"
            >
              See the work
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
