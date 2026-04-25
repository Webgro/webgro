"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useIsomorphicLayoutEffect from "@/lib/useIsomorphicLayoutEffect";
import type { Accent, CaseBlock, CaseStudy } from "@/content/work";
import { BrandImage } from "@/components/BrandImage";
import { BrowserFrame } from "@/components/BrowserFrame";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BeforeAfter } from "@/components/BeforeAfter";
import { LighthouseScores } from "@/components/LighthouseScores";
import { CaseStudyNav } from "@/components/CaseStudyNav";
import { Mockup, type MockupName } from "@/components/mockups";

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

const accentBorder: Record<Accent, string> = {
  blue: "border-wg-blue/60",
  violet: "border-wg-violet/60",
  teal: "border-wg-teal/60",
};

function Placeholder({ client, accent }: { client: string; accent: Accent }) {
  const grad: Record<Accent, string> = {
    blue: "from-wg-blue/25",
    violet: "from-wg-violet/25",
    teal: "from-wg-teal/25",
  };
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center bg-gradient-to-br ${grad[accent]} via-wg-ink-raised to-wg-ink`}
    >
      <span className="pointer-events-none select-none font-[family-name:var(--font-display)] text-6xl font-bold tracking-tight text-white/15 md:text-8xl">
        {client}
      </span>
    </div>
  );
}

function Block({ block, accent, client }: { block: CaseBlock; accent: Accent; client: string }) {
  switch (block.type) {
    case "intro":
      return (
        <p
          data-case-reveal
          className="mx-auto mt-8 max-w-3xl font-[family-name:var(--font-display)] text-2xl leading-[1.35] tracking-tight text-white/90 md:text-[2rem] md:leading-[1.3]"
        >
          {block.text}
        </p>
      );

    case "chapter":
      return (
        <section
          id={block.id}
          data-case-reveal
          className="mx-auto mt-32 scroll-mt-32 md:mt-40"
        >
          <div className="flex items-center gap-6 border-t border-white/10 pt-12 md:pt-16">
            <p className={`font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.28em] ${accentText[accent]}`}>
              Chapter {block.num}
            </p>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <h2 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
            {block.label}
          </h2>
          {block.description && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65 md:text-xl">
              {block.description}
            </p>
          )}
        </section>
      );

    case "section": {
      const paragraphs = Array.isArray(block.body) ? block.body : [block.body];

      if (block.phone) {
        return (
          <div
            data-case-reveal
            className="mx-auto mt-24 max-w-6xl md:mt-32"
          >
            <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-12 lg:gap-16">
              <div className="md:col-span-8">
                {block.eyebrow && (
                  <p className={`mb-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] ${accentText[accent]}`}>
                    {block.eyebrow}
                  </p>
                )}
                <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl">
                  {block.heading}
                </h2>
                <div className="mt-8 space-y-6">
                  {paragraphs.map((p, i) => (
                    <p key={i} className="text-lg leading-[1.7] text-white/75 md:text-xl md:leading-[1.65]">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
              <div className="relative flex justify-center md:col-span-4 md:justify-end">
                <div
                  className={`pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br ${accentGradientFrom[accent]} via-transparent to-transparent opacity-25 blur-3xl`}
                />
                <div className="relative">
                  <PhoneFrame
                    src={block.phone.src}
                    alt={block.phone.alt}
                    caption={block.phone.caption}
                    width={block.phone.width ?? "xs"}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div data-case-reveal className="mx-auto mt-24 max-w-3xl md:mt-32">
          {block.eyebrow && (
            <p className={`mb-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] ${accentText[accent]}`}>
              {block.eyebrow}
            </p>
          )}
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl">
            {block.heading}
          </h2>
          <div className="mt-8 space-y-6">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-lg leading-[1.7] text-white/75 md:text-xl md:leading-[1.65]">
                {p}
              </p>
            ))}
          </div>
        </div>
      );
    }

    case "stats":
      return (
        <div
          data-case-reveal
          className="mx-auto mt-24 grid max-w-5xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:mt-32 md:grid-cols-3"
        >
          {block.items.map((s, i) => (
            <div key={i} className="flex flex-col justify-between bg-wg-ink-raised p-8 md:p-10">
              <p className={`font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.22em] ${accentText[accent]}`}>
                {s.label}
              </p>
              <p className="mt-6 font-[family-name:var(--font-display)] text-5xl font-bold leading-none tracking-tight text-white md:text-6xl">
                {s.value}
              </p>
            </div>
          ))}
        </div>
      );

    case "heroStat":
      return (
        <div
          data-case-reveal
          className="relative mx-auto mt-24 max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent p-10 md:mt-32 md:p-16 lg:p-20"
        >
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentGradientFrom[accent]} via-transparent to-transparent opacity-40 blur-3xl`}
          />
          <div className="relative">
            {block.eyebrow && (
              <p className={`mb-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.28em] ${accentText[accent]}`}>
                {block.eyebrow}
              </p>
            )}
            <div className="flex flex-col items-baseline gap-x-10 gap-y-4 md:flex-row md:flex-wrap">
              <p className="font-[family-name:var(--font-display)] text-[6rem] font-bold leading-[0.85] tracking-tight text-white md:text-[10rem] lg:text-[13rem]">
                {block.value}
              </p>
              <p className="max-w-md text-xl leading-tight tracking-tight text-white/85 md:text-3xl">
                {block.label}
              </p>
            </div>
            {block.footnote && (
              <p className="mt-8 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-white/45">
                {block.footnote}
              </p>
            )}
          </div>
        </div>
      );

    case "statGroup": {
      const items = block.items;
      const layouts =
        items.length === 3
          ? ["md:col-span-7 md:row-span-2", "md:col-span-5", "md:col-span-5"]
          : items.map(() => "md:col-span-6");
      return (
        <div data-case-reveal className="mx-auto mt-24 max-w-6xl md:mt-32">
          <div className="grid auto-rows-fr grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
            {items.map((s, i) => {
              const featured = i === 0 && items.length === 3;
              return (
                <div
                  key={i}
                  className={`${layouts[i] ?? ""} relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent p-8 md:p-10 lg:p-12`}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentGradientFrom[accent]} via-transparent to-transparent opacity-35 blur-3xl`}
                  />
                  <div className="relative flex h-full flex-col justify-between gap-6">
                    {s.eyebrow ? (
                      <p className={`font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.28em] ${accentText[accent]}`}>
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
                      {s.footnote && (
                        <p className="mt-4 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-white/45">
                          {s.footnote}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    case "image": {
      const aspect = block.aspect ?? "aspect-[16/9]";
      const width = block.full ? "max-w-none" : "mx-auto max-w-5xl";
      return (
        <figure data-case-reveal className={`mt-20 md:mt-28 ${width}`}>
          <div className={`relative ${aspect} overflow-hidden ${block.full ? "" : "rounded-3xl"} border border-white/10 bg-wg-ink-raised`}>
            {block.src ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={block.src} alt={block.alt} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <Placeholder client={client} accent={accent} />
            )}
          </div>
          {block.caption && (
            <figcaption className="mx-auto mt-4 max-w-3xl text-center font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.22em] text-white/40">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case "product":
      return (
        <div data-case-reveal className="mx-auto mt-20 max-w-4xl md:mt-28">
          {block.src ? (
            <BrandImage
              src={block.src}
              alt={block.alt}
              accent={accent}
              aspect={block.aspect}
              fit={block.fit}
              padded={block.padded}
              caption={block.caption}
            />
          ) : (
            <div className={`relative ${block.aspect ?? "aspect-[4/3]"} overflow-hidden rounded-3xl border border-white/10`}>
              <Placeholder client={client} accent={accent} />
            </div>
          )}
        </div>
      );

    case "browser":
      return (
        <div data-case-reveal className="mx-auto mt-20 max-w-6xl md:mt-28">
          {block.src ? (
            <BrowserFrame
              src={block.src}
              alt={block.alt}
              url={block.url}
              aspect={block.aspect}
              caption={block.caption}
              phone={block.phone}
            />
          ) : (
            <figure>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-wg-ink-raised shadow-2xl shadow-black/50">
                <div className="flex items-center gap-3 border-b border-white/10 bg-wg-ink/70 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-white/15" />
                    <span className="h-3 w-3 rounded-full bg-white/15" />
                    <span className="h-3 w-3 rounded-full bg-white/15" />
                  </div>
                  <div className="flex-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-[family-name:var(--font-mono)] text-[11px] tracking-wide text-white/55">
                    {block.url}
                  </div>
                </div>
                <div className={`relative ${block.aspect ?? "aspect-[16/10]"}`}>
                  <Placeholder client={client} accent={accent} />
                </div>
              </div>
              {block.caption && (
                <figcaption className="mt-4 text-center font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/40">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          )}
        </div>
      );

    case "uiMock":
      return (
        <figure data-case-reveal className="mx-auto mt-20 max-w-6xl md:mt-28">
          <Mockup name={block.name as MockupName} />
          {block.caption && (
            <figcaption className="mt-4 text-center font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/40">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "phone":
      return (
        <div data-case-reveal className="mt-20 md:mt-28">
          <PhoneFrame
            src={block.src}
            alt={block.alt}
            caption={block.caption}
            width={block.width}
          />
        </div>
      );

    case "beforeAfter":
      return (
        <div data-case-reveal className="mx-auto mt-20 max-w-6xl md:mt-28">
          <BeforeAfter
            before={block.before}
            after={block.after}
            aspect={block.aspect}
            caption={block.caption}
          />
        </div>
      );

    case "beforeAfterStacked": {
      // Tall portrait full-page screenshots, side by side.
      // Each gets a clear BEFORE / AFTER badge that floats over the
      // top so the comparison is unmistakable. Mobile stacks them.
      const Pane = ({
        src,
        alt,
        kind,
      }: {
        src: string;
        alt: string;
        kind: "before" | "after";
      }) => (
        <div className="relative">
          <div
            className={`absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.28em] backdrop-blur-md md:left-5 md:top-5 ${
              kind === "before"
                ? "border-white/20 bg-wg-ink/80 text-white/65"
                : "border-wg-teal/40 bg-wg-ink/80 text-wg-teal"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                kind === "before" ? "bg-white/45" : "bg-wg-teal"
              }`}
            />
            {kind === "before" ? "Before" : "After"}
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-wg-ink-raised">
            {src ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={src}
                alt={alt}
                loading="lazy"
                className="block h-auto w-full"
              />
            ) : (
              <div className="aspect-[3/8]">
                <Placeholder client={client} accent={accent} />
              </div>
            )}
          </div>
        </div>
      );

      return (
        <div data-case-reveal className="mx-auto mt-20 max-w-6xl md:mt-28">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            <Pane src={block.before.src} alt={block.before.alt} kind="before" />
            <Pane src={block.after.src} alt={block.after.alt} kind="after" />
          </div>
          {block.caption && (
            <p className="mt-6 text-center text-sm leading-relaxed text-white/55">
              {block.caption}
            </p>
          )}
        </div>
      );
    }

    case "split":
      return (
        <div data-case-reveal className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-4 md:mt-28 md:grid-cols-2 md:gap-6">
          {[block.left, block.right].map((img, i) => (
            <div key={i} className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-wg-ink-raised">
              {img.src ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={img.src} alt={img.alt} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <Placeholder client={client} accent={accent} />
              )}
            </div>
          ))}
        </div>
      );

    case "gallery":
      return (
        <div data-case-reveal className="mx-auto mt-20 grid max-w-6xl grid-cols-2 gap-4 md:mt-28 md:grid-cols-3 md:gap-6">
          {block.images.map((img, i) => (
            <div key={i} className={`relative ${img.aspect ?? "aspect-square"} overflow-hidden rounded-2xl border border-white/10 bg-wg-ink-raised`}>
              {img.src ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={img.src} alt={img.alt} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <Placeholder client={client} accent={accent} />
              )}
            </div>
          ))}
        </div>
      );

    case "quote":
      return (
        <figure data-case-reveal className="mx-auto mt-24 max-w-4xl md:mt-32">
          <blockquote
            className={`border-l-2 pl-8 font-[family-name:var(--font-display)] text-3xl italic leading-[1.2] tracking-tight text-white md:text-5xl ${accentBorder[accent]}`}
          >
            &ldquo;{block.text}&rdquo;
          </blockquote>
          {block.attribution && (
            <figcaption className="mt-6 pl-8 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] text-white/50">
              {block.attribution}
            </figcaption>
          )}
        </figure>
      );

    case "deliverables":
      return (
        <div data-case-reveal className="mx-auto mt-24 max-w-4xl md:mt-32">
          {block.heading && (
            <p className={`mb-6 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] ${accentText[accent]}`}>
              {block.heading}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            {block.items.map((d) => (
              <span
                key={d}
                className="rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/80"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      );

    case "lighthouseScores":
      return (
        <div data-case-reveal className="mx-auto mt-24 max-w-6xl md:mt-32">
          <LighthouseScores scores={block.scores} />
          {block.caption && (
            <p className="mt-8 text-center text-sm leading-relaxed text-white/55">
              {block.caption}
            </p>
          )}
        </div>
      );
  }
}

export function CaseStudyView({
  caseStudy,
  next,
}: {
  caseStudy: CaseStudy;
  next?: CaseStudy;
}) {
  const root = useRef<HTMLElement>(null);

  const chapters = caseStudy.body
    .filter((b): b is Extract<CaseBlock, { type: "chapter" }> => b.type === "chapter")
    .map((c) => ({ id: c.id, num: c.num, label: c.label }));

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const opts = { immediateRender: false, overwrite: "auto" as const };

      // Hero entrance (data-case-title-word, data-case-meta, data-case-excerpt)
      // is CSS-only via globals.css. LCP fires on first paint.

      gsap.fromTo(
        "[data-case-reveal]",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          ...opts,
          scrollTrigger: {
            trigger: root.current,
            start: "top 60%",
          },
          stagger: 0.06,
        }
      );

      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <article ref={root} className="relative bg-wg-ink">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/10 bg-wg-ink-raised pb-20 pt-32 md:pb-28 md:pt-40">
        <div
          className={`pointer-events-none absolute -top-[30%] left-1/2 h-[70vh] w-[70vw] -translate-x-1/2 rounded-full bg-gradient-to-br ${accentGradientFrom[caseStudy.accent]} via-transparent to-transparent blur-3xl`}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12 lg:px-16">
          <Link
            href="/work"
            data-cursor="hover"
            data-case-meta
            className="group mb-12 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-white/85 backdrop-blur-md transition hover:border-white/35 hover:bg-white/[0.08] hover:text-white"
          >
            <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
            All work
          </Link>

          <div className="flex flex-wrap items-center gap-3" data-case-meta>
            <div
              className={`inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] ${accentText[caseStudy.accent]}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${accentDot[caseStudy.accent]}`} />
              {caseStudy.tag}
            </div>
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/40">
              {caseStudy.year}
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/40">
              ·
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/40">
              {caseStudy.timeline}
            </span>
          </div>

          <h1 className="mt-10 font-[family-name:var(--font-display)] text-5xl font-bold leading-[1] tracking-tight text-white md:text-8xl lg:text-[9rem]">
            {caseStudy.client.split(" ").map((word, i) => (
              <span key={i} className="inline-block pb-2 pr-[0.15em]">
                <span data-case-title-word className="inline-block will-change-transform">
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <p
            data-case-excerpt
            className="mt-8 max-w-3xl text-lg leading-relaxed text-white/70 md:text-2xl md:leading-[1.4]"
          >
            {caseStudy.excerpt}
          </p>

          {/* Visit live site, only renders when url is set */}
          {caseStudy.url && (
            <a
              href={caseStudy.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              data-case-meta
              className="group mt-10 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur-md transition hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              Visit live site
              <svg
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                <path
                  d="M3 8L8 3 M8 3H4 M8 3V7"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          )}

          {/* Meta grid */}
          <div
            data-case-meta
            className="mt-16 grid grid-cols-2 gap-8 border-t border-white/10 pt-8 md:grid-cols-4 md:gap-12 md:pt-10"
          >
            <div>
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-white/40">
                Services
              </p>
              <p className="mt-2 text-sm text-white/80 md:text-base">
                {caseStudy.services.join(" · ")}
              </p>
            </div>
            <div>
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-white/40">
                Stack
              </p>
              <p className="mt-2 text-sm text-white/80 md:text-base">
                {caseStudy.stack.join(" · ")}
              </p>
            </div>
            <div>
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-white/40">
                Timeline
              </p>
              <p className="mt-2 text-sm text-white/80 md:text-base">{caseStudy.timeline}</p>
            </div>
            <div>
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-white/40">
                Year
              </p>
              <p className="mt-2 text-sm text-white/80 md:text-base">{caseStudy.year}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero image, full bleed */}
      <div className="relative">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-wg-ink-raised md:aspect-[21/9]">
          {caseStudy.heroImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={caseStudy.heroImage}
              alt={caseStudy.heroImageAlt}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Placeholder client={caseStudy.client} accent={caseStudy.accent} />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wg-ink/40 via-transparent to-transparent" />
        </div>
      </div>

      {/* Chapter nav, sticky, only if the case has chapters */}
      {chapters.length > 0 && <CaseStudyNav chapters={chapters} />}

      {/* Body */}
      <div className="px-6 pb-28 pt-8 md:px-12 md:pb-36 md:pt-12 lg:px-16">
        {caseStudy.body.map((block, i) => (
          <Block key={i} block={block} accent={caseStudy.accent} client={caseStudy.client} />
        ))}
      </div>

      {/* End-of-case CTA */}
      <div className="border-t border-white/10 bg-wg-ink py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6 md:px-12 lg:px-16">
          <div className="flex items-center gap-4">
            <span className={`h-[1px] w-12 ${accentDot[caseStudy.accent]}`}></span>
            <p className={`font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] ${accentText[caseStudy.accent]}`}>
              Next steps
            </p>
          </div>
          <h2 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
            Thinking about{" "}
            <span className="bg-gradient-to-r from-wg-blue via-wg-violet to-wg-teal bg-clip-text pr-[0.35em] text-transparent">
              your own build?
            </span>
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/65 md:text-xl">
            Tell us what you&rsquo;re trying to build, fix, or rethink. 30 minutes, no decks, no pressure.
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
              href="/work"
              data-cursor="hover"
              className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-base font-medium text-white backdrop-blur-md transition hover:border-white/40 hover:bg-white/10"
            >
              Explore more work
            </Link>
          </div>
        </div>
      </div>

      {/* Next case */}
      {next && (
        <div className="border-t border-white/10 bg-wg-ink-raised py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <div className="mb-10 flex items-center gap-4">
              <span className={`h-[1px] w-12 ${accentDot[next.accent]}`}></span>
              <p className={`font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] ${accentText[next.accent]}`}>
                Next case
              </p>
            </div>
            <Link
              href={`/work/${next.slug}`}
              data-cursor="hover"
              className="group block overflow-hidden rounded-3xl border border-white/10 bg-wg-ink transition-all duration-500 hover:-translate-y-1 hover:border-white/25"
            >
              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="relative aspect-[16/11] md:col-span-7 md:aspect-auto">
                  {next.heroImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={next.heroImage}
                      alt={next.heroImageAlt}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                  ) : (
                    <Placeholder client={next.client} accent={next.accent} />
                  )}
                </div>
                <div className="flex flex-col justify-center p-10 md:col-span-5 md:p-14">
                  <p className={`font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] ${accentText[next.accent]}`}>
                    {next.tag}
                  </p>
                  <h3 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">
                    {next.client}
                  </h3>
                  <p className="mt-6 text-base leading-relaxed text-white/70 md:text-lg">
                    {next.excerpt}
                  </p>
                  <span className="mt-10 inline-flex items-center gap-3 text-base font-medium text-white">
                    View the case
                    <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </article>
  );
}
