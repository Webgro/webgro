"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useIsomorphicLayoutEffect from "@/lib/useIsomorphicLayoutEffect";
import type { Service, ServiceMedia } from "@/content/services";
import type { Accent, CaseStudy } from "@/content/work";
import { BrowserFrame } from "@/components/BrowserFrame";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BrandImage } from "@/components/BrandImage";
import { TripleDeviceShowcase } from "@/components/TripleDeviceShowcase";
import { Mockup, type MockupName } from "@/components/mockups";

type ClientService = Omit<Service, "relatedKeyword" | "relatedCategories">;

function ServiceMediaBlock({
  media,
  accent,
  maxWidth = "max-w-7xl",
}: {
  media: ServiceMedia;
  accent: Accent;
  maxWidth?: string;
}) {
  if (media.kind === "browser") {
    return (
      <div className={`mx-auto ${maxWidth}`}>
        <BrowserFrame
          src={media.src}
          alt={media.alt}
          url={media.url}
          phone={media.phone}
        />
      </div>
    );
  }
  if (media.kind === "uiMock") {
    return (
      <figure className={`mx-auto ${maxWidth}`}>
        <Mockup name={media.name as MockupName} />
        {media.caption && (
          <figcaption className="mt-4 text-center font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/40">
            {media.caption}
          </figcaption>
        )}
      </figure>
    );
  }
  if (media.kind === "phone") {
    return (
      <PhoneFrame
        src={media.src}
        alt={media.alt}
        caption={media.caption}
        width="md"
      />
    );
  }
  if (media.kind === "image") {
    return (
      <div className={`mx-auto ${maxWidth}`}>
        <BrandImage
          src={media.src}
          alt={media.alt}
          accent={accent}
          aspect={media.aspect ?? "aspect-[16/9]"}
          fit="cover"
          padded={false}
          caption={media.caption}
        />
      </div>
    );
  }
  // statGroup
  const items = media.items;
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
  return (
    <div className={`mx-auto ${maxWidth}`}>
      <div className="grid auto-rows-fr grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
        {items.map((s, i) => {
          const featured = i === 0 && items.length === 3;
          const span =
            items.length === 3
              ? i === 0
                ? "md:col-span-7 md:row-span-2"
                : "md:col-span-5"
              : "md:col-span-6";
          return (
            <div
              key={i}
              className={`${span} relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent p-8 md:p-10 lg:p-12`}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentGradientFrom[accent]} via-transparent to-transparent opacity-35 blur-3xl`}
              />
              <div className="relative flex h-full flex-col justify-between gap-6">
                {s.eyebrow ? (
                  <p
                    className={`font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.28em] ${accentText[accent]}`}
                  >
                    {s.eyebrow}
                  </p>
                ) : (
                  <span />
                )}
                <div>
                  <p
                    className={`font-[family-name:var(--font-display)] font-bold leading-[0.85] tracking-tight text-white ${
                      featured
                        ? "text-[5rem] md:text-[8rem] lg:text-[10rem]"
                        : "text-5xl md:text-6xl lg:text-7xl"
                    }`}
                  >
                    {s.value}
                  </p>
                  <p
                    className={`mt-4 leading-tight text-white/85 ${
                      featured ? "text-lg md:text-2xl" : "text-base md:text-lg"
                    }`}
                  >
                    {s.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function IconFlexible() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="17" cy="6" r="2.3" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <path d="M21 12H11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="7" cy="12" r="2.3" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <path d="M3 18h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="17" cy="18" r="2.3" stroke="currentColor" strokeWidth="1.6" fill="none" />
    </svg>
  );
}

function IconStudio() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <circle cx="4.5" cy="4.5" r="1.8" fill="currentColor" />
      <circle cx="19.5" cy="4.5" r="1.8" fill="currentColor" />
      <circle cx="4.5" cy="19.5" r="1.8" fill="currentColor" />
      <circle cx="19.5" cy="19.5" r="1.8" fill="currentColor" />
      <path
        d="M10 10L5.5 5.5 M14 10l4.5-4.5 M10 14l-4.5 4.5 M14 14l4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconExperience() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <path
        d="M12 7v5l3.5 2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconOutcomes() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 20h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="4" y="14" width="3.5" height="6" rx="0.8" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <rect x="10.25" y="9" width="3.5" height="11" rx="0.8" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <rect x="16.5" y="4" width="3.5" height="16" rx="0.8" stroke="currentColor" strokeWidth="1.6" fill="none" />
    </svg>
  );
}

const whyChooseUs: Array<{
  icon: () => React.ReactElement;
  heading: string;
  body: string;
}> = [
  {
    icon: IconFlexible,
    heading: "Flexible, affordable packages",
    body: "For every business, brand, and budget. We scope against what you actually need, not a price sheet.",
  },
  {
    icon: IconStudio,
    heading: "One studio, six capabilities",
    body: "No agency-hopping for strategy, build, and marketing. Same team, same standard, across the whole loop.",
  },
  {
    icon: IconExperience,
    heading: "15+ years of eCommerce and WordPress",
    body: "Under the bonnet. Not a freelancer pivot or a junior team learning on your project.",
  },
  {
    icon: IconOutcomes,
    heading: "Measurable outcomes, not reassurance",
    body: "We'll tell you which work pays back and which doesn't. Honest scoping before contracts, honest reporting after.",
  },
];

function FaqAccordion({
  faqs,
  accent,
}: {
  faqs: NonNullable<ClientService["faqs"]>;
  accent: Accent;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const active: Record<Accent, string> = {
    blue: "text-wg-blue",
    violet: "text-wg-violet",
    teal: "text-wg-teal",
  };
  const activeBg: Record<Accent, string> = {
    blue: "border-wg-blue bg-wg-blue text-wg-ink",
    violet: "border-wg-violet bg-wg-violet text-wg-ink",
    teal: "border-wg-teal bg-wg-teal text-wg-ink",
  };
  const hoverText: Record<Accent, string> = {
    blue: "group-hover:text-wg-blue",
    violet: "group-hover:text-wg-violet",
    teal: "group-hover:text-wg-teal",
  };
  return (
    <div className="border-t border-white/10" role="list">
      {faqs.map((f, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="border-b border-white/10"
            role="listitem"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              data-cursor="hover"
              aria-expanded={isOpen}
              className="group flex w-full items-center gap-4 py-6 text-left transition-colors md:gap-8 md:py-8"
            >
              <span
                className={`font-[family-name:var(--font-mono)] text-sm transition-colors duration-300 md:text-base ${
                  isOpen ? active[accent] : `text-white/40 ${hoverText[accent]}`
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`flex-1 font-[family-name:var(--font-display)] text-xl font-bold leading-tight tracking-tight transition-colors duration-300 md:text-2xl lg:text-3xl ${
                  isOpen ? "text-white" : "text-white/85 group-hover:text-white"
                }`}
              >
                {f.q}
              </span>
              <span
                className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 md:h-12 md:w-12 ${
                  isOpen
                    ? activeBg[accent]
                    : "border-white/20 bg-white/[0.03] text-white/70 group-hover:border-white/40 group-hover:bg-white/[0.08]"
                }`}
                aria-hidden="true"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className={`transition-transform duration-500 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  <path
                    d="M7 1v12M1 7h12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </button>
            <div
              style={{
                display: "grid",
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                transition:
                  "grid-template-rows 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease",
                opacity: isOpen ? 1 : 0,
              }}
            >
              <div className="overflow-hidden">
                <div className="grid grid-cols-1 gap-6 pb-8 md:grid-cols-12 md:gap-8 md:pb-10">
                  <div className="md:col-span-1" aria-hidden="true" />
                  <p className="max-w-2xl text-base leading-relaxed text-white/70 md:col-span-10 md:text-lg">
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
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

const accentGradientFrom: Record<Accent, string> = {
  blue: "from-wg-blue/30",
  violet: "from-wg-violet/30",
  teal: "from-wg-teal/30",
};

const accentHoverBorder: Record<Accent, string> = {
  blue: "hover:border-wg-blue/60",
  violet: "hover:border-wg-violet/60",
  teal: "hover:border-wg-teal/60",
};

function RelatedCaseCard({ c }: { c: CaseStudy }) {
  const ref = useRef<HTMLAnchorElement>(null);
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

  return (
    <Link
      ref={ref}
      href={`/work/${c.slug}`}
      data-cursor="hover"
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-wg-ink-raised transition-all duration-700 ${accentHoverBorder[c.accent]} ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } hover:-translate-y-1`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {c.heroImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={c.heroImage}
            alt={c.heroImageAlt}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
        ) : (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${accentGradientFrom[c.accent]} via-wg-ink-raised to-wg-ink`}
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
      <div className="flex flex-col p-6 md:p-7">
        <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold leading-tight tracking-tight text-white">
          {c.client}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/60">{c.excerpt}</p>
        <div className="mt-5 flex items-center justify-end">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all duration-500 group-hover:border-white/40 group-hover:bg-white group-hover:text-wg-ink">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
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
  );
}

export function ServiceView({
  service,
  relatedCases,
  more,
}: {
  service: ClientService;
  relatedCases: CaseStudy[];
  /** Three other services shown in the "More Ways To Gro" section. */
  more: ClientService[];
}) {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const opts = { immediateRender: false, overwrite: "auto" as const };

      // Hero entrance (title/meta/lead) is CSS-only via globals.css.
      // LCP fires on first paint without waiting for hydration.

      // Section-level reveals, batched so each enters the viewport on its
      // own, not all at once when the article top hits the fold.
      ScrollTrigger.batch("[data-service-reveal]", {
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

      // Platform rows, stagger slide from the left with a blur fade.
      ScrollTrigger.batch("[data-platform-row]", {
        start: "top 85%",
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { x: -60, opacity: 0, filter: "blur(10px)" },
            {
              x: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 1.1,
              ease: "power4.out",
              stagger: 0.15,
              overwrite: "auto",
            }
          ),
      });

      // Capability cards, stagger rise.
      ScrollTrigger.batch("[data-capability]", {
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
              stagger: 0.04,
              overwrite: "auto",
            }
          ),
      });

      // Why Brands cards, stagger rise with slight scale-in.
      ScrollTrigger.batch("[data-why-card]", {
        start: "top 85%",
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { y: 40, opacity: 0, scale: 0.96 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.1,
              overwrite: "auto",
            }
          ),
      });

      // Approach step cards, stagger from bottom.
      ScrollTrigger.batch("[data-approach-step]", {
        start: "top 90%",
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.09,
              overwrite: "auto",
            }
          ),
      });

      // More Ways cards, stagger with subtle rotation feel.
      ScrollTrigger.batch("[data-more-card]", {
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
              stagger: 0.1,
              overwrite: "auto",
            }
          ),
      });

      // Triple device showcase, choreographed: tablet from left, desktop
      // fades in, phone from right. Each at slightly different delay.
      ScrollTrigger.batch("[data-triple-tablet]", {
        start: "top 85%",
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { x: -80, y: 30, opacity: 0, filter: "blur(12px)" },
            { x: 0, y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power4.out", overwrite: "auto" }
          ),
      });
      ScrollTrigger.batch("[data-triple-desktop]", {
        start: "top 85%",
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { y: 50, opacity: 0, filter: "blur(12px)" },
            { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power4.out", delay: 0.15, overwrite: "auto" }
          ),
      });
      ScrollTrigger.batch("[data-triple-phone]", {
        start: "top 85%",
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { x: 80, y: 30, opacity: 0, filter: "blur(12px)" },
            { x: 0, y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power4.out", delay: 0.3, overwrite: "auto" }
          ),
      });

      void opts;
      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <article ref={root} className="relative bg-wg-ink">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-wg-ink-raised pb-20 pt-32 md:pb-28 md:pt-40">
        <div
          className={`pointer-events-none absolute -top-[30%] left-1/2 h-[70vh] w-[70vw] -translate-x-1/2 rounded-full bg-gradient-to-br ${accentGradientFrom[service.accent]} via-transparent to-transparent blur-3xl`}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <Link
            href="/services"
            data-cursor="hover"
            data-service-meta
            className="group mb-12 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-white/85 backdrop-blur-md transition hover:border-white/35 hover:bg-white/[0.08] hover:text-white"
          >
            <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
            All services
          </Link>

          <p
            data-service-meta
            className={`font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.28em] ${accentText[service.accent]}`}
          >
            {service.hero.eyebrow}
          </p>

          <h1
            data-service-title
            className="mt-6 max-w-5xl font-[family-name:var(--font-display)] text-5xl font-bold leading-[1] tracking-tight text-white md:text-7xl lg:text-[5.5rem]"
          >
            {service.hero.heading}
            {service.hero.headingAccent && (
              <>
                {" "}
                <span className="bg-gradient-to-r from-wg-blue via-wg-violet to-wg-teal bg-clip-text pr-[0.35em] text-transparent">
                  {service.hero.headingAccent}
                </span>
              </>
            )}
          </h1>

          <p
            data-service-lead
            className="mt-10 max-w-3xl text-lg leading-relaxed text-white/70 md:text-2xl md:leading-[1.4]"
          >
            {service.hero.lead}
          </p>

          {/* Capability pills */}
          <div
            data-service-meta
            className="mt-12 flex flex-wrap gap-2 border-t border-white/10 pt-8"
          >
            {service.capabilities.slice(0, 8).map((cap) => (
              <span
                key={cap}
                className="rounded-full border border-white/15 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-white/80"
              >
                {cap}
              </span>
            ))}
            {service.capabilities.length > 8 && (
              <span className="font-[family-name:var(--font-mono)] px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white/40">
                +{service.capabilities.length - 8} more
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Hero media */}
      {service.heroMedia && (
        <section className="border-b border-white/10 bg-wg-ink py-16 md:py-20">
          <div data-service-reveal className="px-6 md:px-12 lg:px-16">
            <ServiceMediaBlock media={service.heroMedia} accent={service.accent} />
          </div>
        </section>
      )}

      {/* Overview */}
      <section className="relative overflow-hidden bg-wg-ink py-24 md:py-32">
        {/* Ambient drifting glow */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className={`absolute top-[20%] right-[-5%] h-[50vh] w-[45vw] rounded-full bg-gradient-to-br ${accentGradientFrom[service.accent]} via-transparent to-transparent opacity-[0.3] blur-3xl`}
            style={{ animation: "wgDrift 26s ease-in-out infinite" }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div data-service-reveal className="flex items-center gap-4">
            <span className={`h-[1px] w-12 ${accentDot[service.accent]}`} />
            <p
              className={`font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] ${accentText[service.accent]}`}
            >
              Overview
            </p>
          </div>
          <h2
            data-service-reveal
            className="mt-6 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl"
          >
            {service.overview.heading}
          </h2>
          <div data-service-reveal className="mt-8 max-w-3xl space-y-6">
            {(Array.isArray(service.overview.body)
              ? service.overview.body
              : [service.overview.body]
            ).map((p, i) => (
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

      {/* Triple device showcase, only renders when set */}
      {service.triplePreview && (
        <section className="relative overflow-hidden border-t border-white/10 bg-wg-ink-raised py-24 md:py-32">
          {/* Ambient drifting glows */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className={`absolute top-[10%] left-[-5%] h-[55vh] w-[50vw] rounded-full bg-gradient-to-br ${accentGradientFrom[service.accent]} via-transparent to-transparent opacity-[0.3] blur-3xl`}
              style={{ animation: "wgDrift 30s ease-in-out infinite" }}
            />
            <div
              className="absolute bottom-[0%] right-[-5%] h-[55vh] w-[50vw] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(0,201,167,0.12)_0%,_transparent_70%)] blur-3xl"
              style={{ animation: "wgDrift 36s ease-in-out infinite reverse" }}
            />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <div data-service-reveal className="flex items-center gap-4">
              <span className={`h-[1px] w-12 ${accentDot[service.accent]}`} />
              <p
                className={`font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] ${accentText[service.accent]}`}
              >
                {service.triplePreview.eyebrow}
              </p>
            </div>
            <h2
              data-service-reveal
              className="mt-6 max-w-4xl font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl"
            >
              {service.triplePreview.heading}
              {service.triplePreview.headingAccent && (
                <>
                  {" "}
                  <span className="bg-gradient-to-r from-wg-blue via-wg-violet to-wg-teal bg-clip-text pr-[0.35em] text-transparent">
                    {service.triplePreview.headingAccent}
                  </span>
                </>
              )}
            </h2>
            {service.triplePreview.lead && (
              <p
                data-service-reveal
                className="mt-8 max-w-2xl text-lg leading-relaxed text-white/65"
              >
                {service.triplePreview.lead}
              </p>
            )}
            <div data-service-reveal className="mt-16 md:mt-20">
              <TripleDeviceShowcase
                desktop={service.triplePreview.desktop}
                tablet={service.triplePreview.tablet}
                phone={service.triplePreview.phone}
                caption={service.triplePreview.caption}
              />
            </div>
          </div>
        </section>
      )}

      {/* Platforms, big typographic showcase, only renders when set */}
      {service.platforms && service.platforms.items.length > 0 && (
        <section className="relative overflow-hidden border-t border-white/10 bg-wg-ink py-24 md:py-32">
          {/* Ambient drifting glows */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute -top-[10%] right-[-10%] h-[60vh] w-[55vw] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(45,141,255,0.14)_0%,_transparent_70%)] blur-3xl"
              style={{ animation: "wgDrift 28s ease-in-out infinite" }}
            />
            <div
              className="absolute bottom-[-10%] left-[-10%] h-[60vh] w-[55vw] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.12)_0%,_transparent_70%)] blur-3xl"
              style={{ animation: "wgDrift 32s ease-in-out infinite reverse" }}
            />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <div data-service-reveal className="flex items-center gap-4">
              <span className={`h-[1px] w-12 ${accentDot[service.accent]}`} />
              <p
                className={`font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] ${accentText[service.accent]}`}
              >
                {service.platforms.eyebrow}
              </p>
            </div>
            <h2
              data-service-reveal
              className="mt-6 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl"
            >
              {service.platforms.heading}
            </h2>
            {service.platforms.lead && (
              <p
                data-service-reveal
                className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65"
              >
                {service.platforms.lead}
              </p>
            )}
            <div data-service-reveal className="mt-16 space-y-12 md:mt-24 md:space-y-16">
              {service.platforms.items.map((p, i) => {
                const accentGrad: Record<Accent, string> = {
                  blue: "from-wg-blue via-wg-blue/70 to-wg-violet/60",
                  violet: "from-wg-violet via-wg-violet/70 to-wg-teal/60",
                  teal: "from-wg-teal via-wg-teal/70 to-wg-blue/60",
                };
                return (
                  <div
                    key={p.name}
                    data-platform-row
                    className="group relative grid grid-cols-1 gap-6 border-t border-white/10 pt-10 md:grid-cols-12 md:gap-12 md:pt-14"
                  >
                    <p
                      className={`font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] md:col-span-1 ${accentText[p.accent]}`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <div className="md:col-span-8">
                      <h3
                        className={`font-[family-name:var(--font-display)] text-6xl font-bold leading-[0.9] tracking-tight text-transparent bg-clip-text bg-gradient-to-br ${accentGrad[p.accent]} pr-[0.35em] md:text-8xl lg:text-9xl`}
                      >
                        {p.name}
                      </h3>
                    </div>
                    <p className="max-w-sm text-base leading-relaxed text-white/70 md:col-span-3 md:self-end md:text-lg">
                      {p.tagline}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Capabilities grid */}
      <section className="relative overflow-hidden border-t border-white/10 bg-wg-ink-raised py-24 md:py-32">
        {/* Ambient drifting glow */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className={`absolute top-[10%] left-[-5%] h-[50vh] w-[45vw] rounded-full bg-gradient-to-br ${accentGradientFrom[service.accent]} via-transparent to-transparent opacity-[0.25] blur-3xl`}
            style={{ animation: "wgDrift 28s ease-in-out infinite" }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div data-service-reveal className="flex items-center gap-4">
            <span className={`h-[1px] w-12 ${accentDot[service.accent]}`} />
            <p
              className={`font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] ${accentText[service.accent]}`}
            >
              Capabilities
            </p>
          </div>
          <h2
            data-service-reveal
            className="mt-6 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl"
          >
            What we actually do.
          </h2>
          <div
            data-service-reveal
            className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-12 md:grid-cols-3 md:gap-4"
          >
            {service.capabilities.map((cap) => (
              <div
                key={cap}
                data-capability
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-wg-ink px-5 py-4 transition hover:border-white/20"
              >
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${accentDot[service.accent]}`} />
                <span className="text-sm font-medium text-white/85 md:text-base">{cap}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why brands choose us */}
      <section className="relative overflow-hidden border-t border-white/10 bg-wg-ink py-24 md:py-32">
        {/* Ambient drifting glows */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className={`absolute -top-[10%] left-[5%] h-[50vh] w-[45vw] rounded-full bg-gradient-to-br ${accentGradientFrom[service.accent]} via-transparent to-transparent opacity-[0.35] blur-3xl`}
            style={{ animation: "wgDrift 22s ease-in-out infinite" }}
          />
          <div
            className="absolute bottom-[0%] right-[10%] h-[40vh] w-[40vw] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.12)_0%,_transparent_70%)] blur-3xl"
            style={{ animation: "wgDrift 30s ease-in-out infinite reverse" }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div data-service-reveal className="flex items-center gap-4">
            <span className={`h-[1px] w-12 ${accentDot[service.accent]}`} />
            <p
              className={`font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] ${accentText[service.accent]}`}
            >
              Why brands pick us
            </p>
          </div>
          <h2
            data-service-reveal
            className="mt-6 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl"
          >
            Four reasons brands pick us.
          </h2>
          <div
            data-service-reveal
            className="mt-10 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-2 md:gap-6 lg:grid-cols-4"
          >
            {whyChooseUs.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.heading}
                  data-why-card
                  className="relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-wg-ink-raised p-8 transition-colors hover:border-white/20 md:p-10"
                >
                  <div
                    className={`pointer-events-none absolute -right-1/4 -top-1/3 h-[140%] w-[80%] bg-gradient-to-br ${accentGradientFrom[service.accent]} via-transparent to-transparent opacity-25 blur-3xl`}
                  />
                  <div className={`relative ${accentText[service.accent]}`}>
                    <Icon />
                  </div>
                  <h3 className="relative mt-8 font-[family-name:var(--font-display)] text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl">
                    {item.heading}
                  </h3>
                  <p className="relative mt-4 text-base leading-relaxed text-white/70">
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Approach */}
      {service.approach && (
        <section className="relative overflow-hidden border-t border-white/10 bg-wg-ink py-24 md:py-32">
          {/* Ambient drifting glow */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute bottom-[10%] left-[-5%] h-[45vh] w-[45vw] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(0,201,167,0.1)_0%,_transparent_70%)] blur-3xl"
              style={{ animation: "wgDrift 24s ease-in-out infinite" }}
            />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <div data-service-reveal className="flex items-center gap-4">
              <span className={`h-[1px] w-12 ${accentDot[service.accent]}`} />
              <p
                className={`font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] ${accentText[service.accent]}`}
              >
                Approach
              </p>
            </div>
            <h2
              data-service-reveal
              className="mt-6 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl"
            >
              {service.approach.heading}
            </h2>
            <div data-service-reveal className="mt-8 max-w-3xl space-y-6">
              {(Array.isArray(service.approach.body)
                ? service.approach.body
                : [service.approach.body]
              ).map((p, i) => (
                <p
                  key={i}
                  className="text-lg leading-[1.7] text-white/75 md:text-xl md:leading-[1.65]"
                >
                  {p}
                </p>
              ))}
            </div>

            {service.approach.steps && service.approach.steps.length > 0 && (
              <div
                data-service-reveal
                className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-5"
              >
                {service.approach.steps.map((step, i) => (
                  <div
                    key={step.label}
                    data-approach-step
                    className="relative rounded-2xl border border-white/10 bg-wg-ink-raised p-5"
                  >
                    <p
                      className={`font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] ${accentText[service.accent]}`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-3 font-[family-name:var(--font-display)] text-lg font-bold text-white">
                      {step.label}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{step.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Mid media, contextual visual between Approach and Related work */}
      {service.midMedia && (
        <section className="relative overflow-hidden border-t border-white/10 bg-wg-ink py-24 md:py-32">
          <div className="pointer-events-none absolute inset-0">
            <div
              className={`absolute top-[-10%] right-[-5%] h-[55vh] w-[45vw] rounded-full bg-gradient-to-br ${accentGradientFrom[service.accent]} via-transparent to-transparent opacity-[0.22] blur-3xl`}
              style={{ animation: "wgDrift 26s ease-in-out infinite" }}
            />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <div data-service-reveal>
              <ServiceMediaBlock media={service.midMedia} accent={service.accent} />
            </div>
          </div>
        </section>
      )}

      {/* Related work */}
      {relatedCases.length > 0 && (
        <section className="border-t border-white/10 bg-wg-ink-raised py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <div
              data-service-reveal
              className="flex flex-wrap items-end justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-4">
                  <span className={`h-[1px] w-12 ${accentDot[service.accent]}`} />
                  <p
                    className={`font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] ${accentText[service.accent]}`}
                  >
                    Selected work
                  </p>
                </div>
                <h2 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl">
                  {service.name} in the wild.
                </h2>
              </div>
              <Link
                href="/work"
                data-cursor="hover"
                className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium text-white backdrop-blur-md transition hover:border-white/40 hover:bg-white/10"
              >
                See all work
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
            <div
              data-service-reveal
              className="mt-10 grid grid-cols-1 gap-6 md:mt-12 md:grid-cols-2 md:gap-8 lg:grid-cols-3"
            >
              {relatedCases.slice(0, 6).map((c) => (
                <RelatedCaseCard key={c.slug} c={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="relative overflow-hidden border-t border-white/10 bg-wg-ink py-24 md:py-32">
          {/* Ambient drifting glow */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className={`absolute top-[10%] right-[-5%] h-[50vh] w-[45vw] rounded-full bg-gradient-to-br ${accentGradientFrom[service.accent]} via-transparent to-transparent opacity-[0.22] blur-3xl`}
              style={{ animation: "wgDrift 30s ease-in-out infinite" }}
            />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <div data-service-reveal className="mb-12 flex items-center gap-4 md:mb-16">
              <span className={`h-[1px] w-12 ${accentDot[service.accent]}`} />
              <p
                className={`font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] ${accentText[service.accent]}`}
              >
                Common questions
              </p>
            </div>
            <div data-service-reveal>
              <FaqAccordion faqs={service.faqs} accent={service.accent} />
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-white/10 bg-wg-ink-raised py-24 md:py-32">
        {/* Ambient drifting glows */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className={`absolute -bottom-[20%] left-[-5%] h-[60vh] w-[55vw] rounded-full bg-gradient-to-br ${accentGradientFrom[service.accent]} via-transparent to-transparent opacity-[0.3] blur-3xl`}
            style={{ animation: "wgDrift 28s ease-in-out infinite" }}
          />
          <div
            className="absolute top-[-10%] right-[0%] h-[50vh] w-[45vw] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.14)_0%,_transparent_70%)] blur-3xl"
            style={{ animation: "wgDrift 34s ease-in-out infinite reverse" }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div className="flex items-center gap-4">
            <span className={`h-[1px] w-12 ${accentDot[service.accent]}`} />
            <p
              className={`font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] ${accentText[service.accent]}`}
            >
              Next steps
            </p>
          </div>
          <h2 className="mt-6 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
            {service.cta.heading}{" "}
            <span className="bg-gradient-to-r from-wg-blue via-wg-violet to-wg-teal bg-clip-text pr-[0.35em] text-transparent">
              {service.cta.headingAccent}
            </span>
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/65 md:text-xl">
            {service.cta.body}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/#contact"
              data-cursor="hover"
              className="group inline-flex items-center gap-3 rounded-full bg-wg-blue px-7 py-4 text-base font-medium text-white transition-colors hover:bg-white hover:text-wg-ink"
            >
              Start the project
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/services"
              data-cursor="hover"
              className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-base font-medium text-white backdrop-blur-md transition hover:border-white/40 hover:bg-white/10"
            >
              Explore other services
            </Link>
          </div>
        </div>
      </section>

      {/* More Ways To Gro */}
      {more.length > 0 && (
        <section className="border-t border-white/10 bg-wg-ink py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <div className="mb-10 flex items-center gap-4 md:mb-14">
              <span className={`h-[1px] w-12 ${accentDot[service.accent]}`} />
              <p
                className={`font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] ${accentText[service.accent]}`}
              >
                Most clients end up across two or three
              </p>
            </div>
            <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl">
              More Ways To Gro.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
              Services compound when they work together. Here&rsquo;s what pairs
              well with {service.name.toLowerCase()}.
            </p>
            <div className="mt-12 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-3 md:gap-6 lg:gap-8">
              {more.map((m) => (
                <Link
                  key={m.slug}
                  href={`/services/${m.slug}`}
                  data-cursor="hover"
                  data-more-card
                  className={`group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-wg-ink-raised p-8 transition-all duration-500 hover:-translate-y-1 md:p-10 ${accentHoverBorder[m.accent]}`}
                >
                  <div
                    className={`pointer-events-none absolute -right-1/4 -top-1/3 h-[180%] w-[70%] bg-gradient-to-br ${accentGradientFrom[m.accent]} via-transparent to-transparent opacity-30 blur-3xl`}
                  />
                  <div className="relative flex items-start justify-between">
                    <span
                      className={`font-[family-name:var(--font-mono)] text-sm font-medium tracking-[0.2em] ${accentText[m.accent]}`}
                    >
                      {m.num}
                    </span>
                    <span className={`h-2 w-2 rounded-full ${accentDot[m.accent]} opacity-70`} />
                  </div>
                  <h3 className="relative mt-12 font-[family-name:var(--font-display)] text-3xl font-bold leading-[0.95] tracking-tight text-white md:text-4xl">
                    {m.name}
                  </h3>
                  <p className="relative mt-3 text-sm font-medium uppercase tracking-[0.15em] text-white/50">
                    {m.tagline}
                  </p>
                  <p className="relative mt-5 max-w-md text-sm leading-relaxed text-white/65">
                    {m.summary}
                  </p>
                  <div className="relative mt-auto flex items-center justify-between pt-10">
                    <span className="text-sm font-medium text-white">Read more</span>
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
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
