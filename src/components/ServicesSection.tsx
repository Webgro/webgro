"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Accent = "blue" | "violet" | "teal";

type Service = {
  num: string;
  name: string;
  tagline: string;
  body: string;
  deliverables: string[];
  accent: Accent;
};

const primary: Service[] = [
  {
    num: "01",
    name: "Websites",
    tagline: "Sites that sell, scale, and stay yours.",
    body: "Design and development for brands that need their site to earn its keep. Shopify and WordPress, built fast out of the gate, easy to edit, and ready to extend with AI when the business is.",
    deliverables: [
      "Shopify",
      "Shopify Plus",
      "WordPress",
      "UX & UI",
      "Site speed",
      "Conversion",
    ],
    accent: "blue",
  },
  {
    num: "02",
    name: "Consultancy",
    tagline: "eCommerce strategy, without the fluff.",
    body: "Senior eCommerce expertise, shaped around your team. We liquify around in-house staff, scaling up to strategy, platform, and growth calls, scaling down to hands-on delivery when you need it. Vetted marketing, design, and dev specialists brought in per project. 15+ years across luxury, DTC, and lifestyle.",
    deliverables: [
      "Audits",
      "Growth strategy",
      "Platform selection",
      "Stack architecture",
      "CRO",
    ],
    accent: "violet",
  },
  {
    num: "03",
    name: "Automation & AI",
    tagline: "AI that does the work, not the talking.",
    body: "Custom AI layers, smart automation, and workflow systems that actually ship. Built into your stack, not bolted on. Practical, measurable, and yours to own.",
    deliverables: [
      "Custom AI apps",
      "Workflow automation",
      "Content ops",
      "Integrations",
      "Chat & voice",
    ],
    accent: "teal",
  },
];

const secondary: Service[] = [
  {
    num: "04",
    name: "SEO",
    tagline: "Traffic that compounds.",
    body: "Technical foundations first, content architecture second. We make sites Google and LLMs both understand: clean schema, fast cores, content clusters that compound. Rankings follow craft, not hacks.",
    deliverables: [
      "Technical SEO",
      "Keyword research",
      "Content architecture",
      "Schema",
      "AIO & GEO",
      "Migrations",
    ],
    accent: "blue",
  },
  {
    num: "05",
    name: "Marketing",
    tagline: "Campaigns that land.",
    body: "Paid, lifecycle, and analytics stitched into a single loop. We measure what actually drives revenue and cut what doesn't. Campaigns that compound, attribution you can explain, budgets spent where they return.",
    deliverables: [
      "Paid media",
      "Lifecycle email",
      "Analytics",
      "CRO",
      "Attribution",
    ],
    accent: "violet",
  },
  {
    num: "06",
    name: "Design",
    tagline: "Systems, not decoration.",
    body: "Brand systems that scale with you. Identity, UI, motion, typography. We build the tokens, components, and guidelines once, then every page, campaign, and product ships faster because the craft is already there.",
    deliverables: [
      "Brand identity",
      "UI systems",
      "Motion",
      "Typography",
      "Design ops",
    ],
    accent: "teal",
  },
];

const accentBorder: Record<Accent, string> = {
  blue: "hover:border-wg-blue/60",
  violet: "hover:border-wg-violet/60",
  teal: "hover:border-wg-teal/60",
};

const accentGlow: Record<Accent, string> = {
  blue: "from-wg-blue/20",
  violet: "from-wg-violet/20",
  teal: "from-wg-teal/20",
};

const accentText: Record<Accent, string> = {
  blue: "text-wg-blue",
  violet: "text-wg-violet",
  teal: "text-wg-teal",
};

const accentHover: Record<Accent, string> = {
  blue: "group-hover:text-wg-blue",
  violet: "group-hover:text-wg-violet",
  teal: "group-hover:text-wg-teal",
};

const accentDot: Record<Accent, string> = {
  blue: "bg-wg-blue",
  violet: "bg-wg-violet",
  teal: "bg-wg-teal",
};

export function ServicesSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Eyebrow
      gsap.fromTo(
        "[data-services-eyebrow]",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: "[data-services-header]", start: "top 85%" },
        }
      );

      // H2 word-level reveal
      gsap.fromTo(
        "[data-services-h2-word]",
        { y: 40, opacity: 0, filter: "blur(12px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.1,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: { trigger: "[data-services-header]", start: "top 80%" },
        }
      );

      // Intro paragraph
      gsap.fromTo(
        "[data-services-intro]",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-services-header]", start: "top 75%" },
        }
      );

      // Service cards, immediateRender:false ensures cards stay visible
      // if the trigger fails to fire for any reason.
      gsap.fromTo(
        "[data-service-card]",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 60%",
          },
        }
      );

      // Secondary cards, flow directly below primary
      gsap.fromTo(
        "[data-secondary-card]",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-secondary-grid]",
            start: "top 85%",
          },
        }
      );

      // Safety refresh after section is laid out
      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="services"
      className="relative overflow-hidden bg-wg-ink py-32 md:py-40"
    >
      {/* Ambient drifting glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-[20%] left-[15%] h-[50vh] w-[50vw] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(45,141,255,0.12)_0%,_transparent_70%)] blur-3xl"
          style={{ animation: "wgDrift 18s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-[10%] right-[10%] h-[45vh] w-[45vw] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(0,201,167,0.10)_0%,_transparent_70%)] blur-3xl"
          style={{ animation: "wgDrift 22s ease-in-out infinite reverse" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        {/* Header */}
        <div className="mb-20 md:mb-28" data-services-header>
          <div className="flex items-center gap-4" data-services-eyebrow>
            <span className="h-[1px] w-12 bg-wg-violet"></span>
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] text-wg-violet">
              [ 03 ] What we do
            </p>
          </div>
          <h2 className="mt-8 font-[family-name:var(--font-display)] text-5xl font-bold leading-[0.95] tracking-tight text-white md:text-7xl lg:text-[7.5rem]">
            <span className="block pb-3">
              <span data-services-h2-word className="inline-block will-change-transform">
                Websites.
              </span>{" "}
              <span data-services-h2-word className="inline-block will-change-transform">
                Strategy.
              </span>
            </span>
            <span className="block pb-3">
              <span
                data-services-h2-word
                className="inline-block bg-gradient-to-r from-wg-blue via-wg-violet to-wg-teal bg-clip-text pr-[0.35em] text-transparent will-change-transform"
              >
                AI.
              </span>
            </span>
          </h2>
          <p
            data-services-intro
            className="mt-10 max-w-xl text-lg leading-relaxed text-white/60"
          >
            Three primary services. One workflow. We build the site you need today, shape the strategy for where you're heading, and plug in the AI that gets you there faster.
          </p>
        </div>

        {/* Primary grid */}
        <div
          data-services-grid
          className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-6 lg:gap-8"
        >
          {primary.map((s) => (
            <article
              key={s.num}
              data-service-card
              className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.04] md:p-10 ${accentBorder[s.accent]}`}
            >
              {/* Accent glow on hover */}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentGlow[s.accent]} via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100`}
              />

              {/* Number + name row */}
              <div className="relative flex items-start justify-between">
                <span
                  className={`font-[family-name:var(--font-mono)] text-sm font-medium tracking-[0.2em] ${accentText[s.accent]}`}
                >
                  {s.num}
                </span>
                <span
                  className={`h-2 w-2 rounded-full ${
                    s.accent === "blue"
                      ? "bg-wg-blue"
                      : s.accent === "violet"
                      ? "bg-wg-violet"
                      : "bg-wg-teal"
                  } opacity-70`}
                />
              </div>

              {/* Service name */}
              <h3
                className={`relative mt-16 font-[family-name:var(--font-display)] text-4xl font-bold leading-[0.95] tracking-tight text-white transition-colors duration-500 md:text-5xl ${accentHover[s.accent]}`}
              >
                {s.name}
              </h3>

              {/* Tagline */}
              <p className="relative mt-4 text-sm font-medium uppercase tracking-[0.15em] text-white/50">
                {s.tagline}
              </p>

              {/* Body */}
              <p className="relative mt-6 text-base leading-relaxed text-white/70">
                {s.body}
              </p>

              {/* Deliverables */}
              <div className="relative mt-8 flex flex-wrap gap-2">
                {s.deliverables.map((d) => (
                  <span
                    key={d}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-white/70"
                  >
                    {d}
                  </span>
                ))}
              </div>

              {/* Link */}
              <a
                href="#"
                data-cursor="hover"
                className={`relative mt-10 inline-flex items-center gap-3 border-b border-white/20 pb-1 text-sm font-medium text-white transition group-hover:w-fit ${
                  s.accent === "blue"
                    ? "hover:border-wg-blue hover:text-wg-blue"
                    : s.accent === "violet"
                    ? "hover:border-wg-violet hover:text-wg-violet"
                    : "hover:border-wg-teal hover:text-wg-teal"
                } w-fit self-start`}
              >
                Learn more
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </article>
          ))}
        </div>

        {/* Secondary cards, flow directly below primary, no divider */}
        <div
          data-secondary-grid
          className="mt-6 grid grid-cols-1 gap-6 md:mt-8 md:grid-cols-3 md:gap-6 lg:gap-8"
        >
          {secondary.map((s) => (
            <article
              key={s.name}
              data-secondary-card
              className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.04] md:p-10 ${accentBorder[s.accent]}`}
            >
              {/* Accent glow on hover, matching primary */}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentGlow[s.accent]} via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100`}
              />

              {/* Number + dot */}
              <div className="relative flex items-start justify-between">
                <span
                  className={`font-[family-name:var(--font-mono)] text-sm font-medium tracking-[0.2em] ${accentText[s.accent]}`}
                >
                  {s.num}
                </span>
                <span className={`h-2 w-2 rounded-full ${accentDot[s.accent]} opacity-70`} />
              </div>

              {/* Service name */}
              <h3
                className={`relative mt-16 font-[family-name:var(--font-display)] text-4xl font-bold leading-[0.95] tracking-tight text-white transition-colors duration-500 md:text-5xl ${accentHover[s.accent]}`}
              >
                {s.name}
              </h3>

              {/* Tagline */}
              <p className="relative mt-4 text-sm font-medium uppercase tracking-[0.15em] text-white/50">
                {s.tagline}
              </p>

              {/* Body */}
              <p className="relative mt-6 text-base leading-relaxed text-white/70">
                {s.body}
              </p>

              {/* Deliverables */}
              <div className="relative mt-8 flex flex-wrap gap-2">
                {s.deliverables.map((d) => (
                  <span
                    key={d}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-white/70"
                  >
                    {d}
                  </span>
                ))}
              </div>

              {/* Link */}
              <a
                href="#"
                data-cursor="hover"
                className={`relative mt-10 inline-flex items-center gap-3 border-b border-white/20 pb-1 text-sm font-medium text-white transition group-hover:w-fit ${
                  s.accent === "blue"
                    ? "hover:border-wg-blue hover:text-wg-blue"
                    : s.accent === "violet"
                    ? "hover:border-wg-violet hover:text-wg-violet"
                    : "hover:border-wg-teal hover:text-wg-teal"
                } w-fit self-start`}
              >
                Learn more
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
