"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { getCaseBySlug } from "@/content/work";
import { pv } from "../links";
import { BrushedTitle } from "../services/sections";
import { SCENE_QUERY, useGsap } from "../useGsap";
import { workExtras, workImage } from "../work/data";
import type { Industry } from "./content";

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function CaseImage({ slug, sizes, lazy = true, className }: { slug: string; sizes: string; lazy?: boolean; className?: string }) {
  const cs = getCaseBySlug(slug);
  const extra = workExtras[slug];
  if (!cs || !extra) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={workImage(slug, "sm")}
      srcSet={`${workImage(slug, "sm")} 800w, ${workImage(slug, "lg")} ${extra.w}w`}
      sizes={sizes}
      alt={cs.heroImageAlt}
      width={extra.w}
      height={extra.h}
      loading={lazy ? "lazy" : undefined}
    />
  );
}

const clientName = (slug: string) => getCaseBySlug(slug)?.client ?? slug;

/** In-page anchors are plain links. Everything else goes through next/link. */
function HeroLink({ link, className, children }: { link: { href: string }; className: string; children: ReactNode }) {
  if (link.href.startsWith("#")) {
    return <a href={link.href} className={className} data-cursor>{children}</a>;
  }
  return <Link href={link.href} className={className} data-cursor>{children}</Link>;
}

/* ── Hero ───────────────────────────────────────────────────────────────── */

export function IndustryHero({ industry }: { industry: Industry }) {
  const root = useRef<HTMLElement>(null);
  const slugs = industry.cases.map((c) => c.slug).slice(0, 3);
  const primary = industry.hero.primary ?? { label: "Get in touch", href: pv("/contact") };
  const secondary = industry.hero.secondary ?? { label: "What we\u2019ve built", href: "#needs" };

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    gsap.fromTo(q(".pv-ind-hero-brush"), { clipPath: "inset(0% 100% 0% 0%)" }, {
      clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, delay: 0.9, ease: "power3.out",
    });
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      // The pictures spread apart as the hero scrolls away.
      q(".pv-ind-hero-shot").forEach((shot, i) => {
        gsap.to(shot, {
          yPercent: [-10, -26, -4][i] ?? -10, rotation: [-3, 2, 4][i] ?? 0, ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
    });
    return () => mm.revert();
  });

  return (
    <section className="pv-ind-hero" ref={root} data-pv-theme="paper">
      <div className="pv-ind-hero-copy">
        <p className="pv-ind-crumbs">
          <Link href={pv("/")} data-cursor>Home</Link>
          <span aria-hidden="true">/</span>
          <Link href={pv("/industries")} data-cursor>Industries</Link>
          <span aria-hidden="true">/</span>
          <span>{industry.name}</span>
        </p>
        <h1 className="pv-h1 pv-ind-h1">
          <BrushedTitle lines={industry.hero.lines} brush={industry.hero.brush} brushClass="pv-ind-hero-brush" />
        </h1>
        <p className="pv-ind-hero-intro">{industry.hero.intro}</p>
        <div className="pv-ind-hero-actions">
          <HeroLink link={primary} className="pv-btn"><span>{primary.label}</span></HeroLink>
          <HeroLink link={secondary} className="pv-textlink">{secondary.label}</HeroLink>
        </div>
      </div>
      {/* One project gets a single wide picture instead of the fanned stack. */}
      <div className={`pv-ind-hero-shots${slugs.length === 1 ? " pv-ind-hero-shots--one" : ""}`} aria-hidden="true">
        {slugs.map((slug) => (
          <div className="pv-ind-hero-shot" key={slug}>
            <div className="pv-ind-hero-shot-in">
              <CaseImage slug={slug} sizes={slugs.length === 1 ? "(min-width: 900px) 42vw, 92vw" : "(min-width: 900px) 24vw, 46vw"} lazy={false} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── What the site needs: the scroll scene ──────────────────────────────── */

/**
 * The requirements scroll past a sticky picture. As each one crosses the
 * reading line it lights up, and the picture changes to the project where we
 * built it. Without JS every row is readable and the first picture shows.
 */
export function Needs({ industry }: { industry: Industry & { needs: NonNullable<Industry["needs"]> } }) {
  const root = useRef<HTMLElement>(null);
  const { items } = industry.needs;
  const slugs = Array.from(new Set(items.map((n) => n.case)));
  const [active, setActive] = useState(0);
  const current = items[active];

  useGsap(root, ({ gsap, ScrollTrigger }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    gsap.from(q(".pv-ind-needs-head > *"), {
      y: 30, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.08,
      scrollTrigger: { trigger: el, start: "top 75%" },
    });

    // Which row is on the reading line decides the picture. This is a state
    // change, not motion, so it runs with reduced motion too.
    q(".pv-ind-need").forEach((row, i) => {
      ScrollTrigger.create({
        trigger: row, start: "top 62%", end: "bottom 62%",
        onToggle: (self) => { if (self.isActive) setActive(i); },
      });
    });

    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      el.classList.add("is-scene");
      q(".pv-ind-need").forEach((row) => {
        gsap.from(row.querySelector(".pv-ind-need-rule"), {
          scaleX: 0, duration: 1.1, ease: "power3.inOut",
          scrollTrigger: { trigger: row, start: "top 85%" },
        });
      });
      gsap.fromTo(q(".pv-ind-needs-frame"), { clipPath: "inset(12% 10% 12% 10% round 22px)" }, {
        clipPath: "inset(0% 0% 0% 0% round 16px)", ease: "none",
        scrollTrigger: { trigger: el, start: "top 80%", end: "top 20%", scrub: 0.5 },
      });
      return () => el.classList.remove("is-scene");
    });
    return () => mm.revert();
  });

  return (
    <section className="pv-ind-needs" id="needs" ref={root} data-pv-theme="ink">
      <div className="pv-ind-needs-head">
        <p className="pv-label">What we&rsquo;ve built</p>
        <h2 className="pv-h2">{industry.needs.heading}</h2>
        <p className="pv-lede">{industry.needs.intro}</p>
      </div>
      <div className="pv-ind-needs-body">
        <div className="pv-ind-needs-media" aria-hidden="true">
          <div className="pv-ind-needs-frame">
            {slugs.map((slug) => (
              <div className={`pv-ind-needs-img${current.case === slug ? " is-on" : ""}`} key={slug}>
                <CaseImage slug={slug} sizes="(min-width: 900px) 42vw, 92vw" />
              </div>
            ))}
          </div>
          <p className="pv-ind-needs-cap">
            <span className="pv-ind-needs-count">
              {String(active + 1).padStart(2, "0")} of {String(items.length).padStart(2, "0")}
            </span>
            <span>{clientName(current.case)}</span>
          </p>
        </div>
        <ol className="pv-ind-needs-list">
          {items.map((n, i) => (
            <li className={`pv-ind-need${i === active ? " is-on" : ""}`} key={n.title}>
              <span className="pv-ind-need-rule" aria-hidden="true" />
              <h3>{n.title}</h3>
              <p>{n.body}</p>
              <Link href={pv(`/work/${n.case}`)} className="pv-textlink" data-cursor>
                {clientName(n.case)} case study
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Case studies with their results ────────────────────────────────────── */

export function Cases({ industry }: { industry: Industry }) {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    gsap.from(q(".pv-ind-cases-head > *"), {
      y: 30, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.08,
      scrollTrigger: { trigger: el, start: "top 75%" },
    });
    q(".pv-ind-case").forEach((row) => {
      gsap.from(row.querySelectorAll(".pv-ind-case-text > *"), {
        y: 26, autoAlpha: 0, duration: 0.85, ease: "power3.out", stagger: 0.07,
        scrollTrigger: { trigger: row, start: "top 78%" },
      });
      gsap.from(row.querySelectorAll(".pv-ind-result strong > span"), {
        yPercent: 110, duration: 1, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: row.querySelector(".pv-ind-results") ?? row, start: "top 88%" },
      });
    });
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      q(".pv-ind-case-media img").forEach((img) => {
        gsap.fromTo(img, { yPercent: -6 }, {
          yPercent: 6, ease: "none",
          scrollTrigger: { trigger: img.closest(".pv-ind-case"), start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    });
    return () => mm.revert();
  });

  return (
    <section className="pv-ind-cases" ref={root} data-pv-theme="paper">
      <div className="pv-ind-cases-head">
        <p className="pv-label">Case studies</p>
        <h2 className="pv-h2">{industry.casesHeading ?? "Projects and results"}</h2>
      </div>
      <div className="pv-ind-case-list">
        {industry.cases.map((c) => {
          const cs = getCaseBySlug(c.slug);
          if (!cs) return null;
          return (
            <article className="pv-ind-case" key={c.slug}>
              <Link href={pv(`/work/${c.slug}`)} className="pv-ind-case-media" data-cursor aria-label={`${cs.client} case study`}>
                <CaseImage slug={c.slug} sizes="(min-width: 900px) 50vw, 92vw" />
              </Link>
              <div className="pv-ind-case-text">
                <p className="pv-ind-case-tag">{cs.tag}, {cs.year}</p>
                <h3>{cs.client}</h3>
                <p className="pv-ind-case-sum">{c.summary}</p>
                {c.results.length > 0 && (
                  <ul className="pv-ind-results">
                    {c.results.map((r) => (
                      <li className="pv-ind-result" key={r.label}>
                        <strong><span>{r.value}</span></strong>
                        <span>{r.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <Link href={pv(`/work/${c.slug}`)} className="pv-textlink" data-cursor>Read the case study</Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ── Services and prices ────────────────────────────────────────────────── */

export function Services({ industry }: { industry: Industry }) {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    gsap.from(q(".pv-ind-svc-head > *"), {
      y: 30, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.08,
      scrollTrigger: { trigger: root.current, start: "top 75%" },
    });
    q(".pv-ind-svc").forEach((row) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 90%" } });
      tl.from(row.querySelector(".pv-ind-svc-rule"), { scaleX: 0, duration: 1.1, ease: "power3.inOut" })
        .from(row.querySelectorAll(".pv-ind-svc-mask > span"), { yPercent: 110, duration: 0.9, ease: "power3.out", stagger: 0.06 }, 0.15);
    });
  });

  return (
    <section className="pv-ind-svcs" ref={root} data-pv-theme="ink">
      <div className="pv-ind-svc-head">
        <p className="pv-label">Services</p>
        <h2 className="pv-h2">Services and prices</h2>
        <p className="pv-lede">
          {industry.servicesLede ?? "We scope every project before we quote, and the first 30-minute call is free."}
        </p>
      </div>
      <div className="pv-ind-svc-list">
        {industry.services.map((s) => (
          <Link href={pv(s.path)} className="pv-ind-svc" key={s.name} data-cursor>
            <span className="pv-ind-svc-rule" aria-hidden="true" />
            <span className="pv-ind-svc-mask pv-ind-svc-mask--name"><span>{s.name}</span></span>
            <span className="pv-ind-svc-mask pv-ind-svc-mask--price"><span>{s.price}</span></span>
            <span className="pv-ind-svc-mask pv-ind-svc-mask--body"><span>{s.body}</span></span>
            <Arrow />
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ── Other industries ───────────────────────────────────────────────────── */

export function OtherIndustries({ others }: { others: Industry[] }) {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    q(".pv-ind-other").forEach((row) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 92%" } });
      tl.from(row.querySelector(".pv-ind-other-rule"), { scaleX: 0, duration: 1.1, ease: "power3.inOut" })
        .from(row.querySelectorAll(".pv-ind-other-mask > span"), { yPercent: 110, duration: 0.9, ease: "power3.out", stagger: 0.06 }, 0.12);
    });
  });

  return (
    <section className="pv-ind-others" ref={root} data-pv-theme="ink">
      <p className="pv-label">Other industries</p>
      <div className="pv-ind-other-list">
        {others.map((o) => (
          <Link href={pv(`/industries/${o.slug}`)} className="pv-ind-other" key={o.slug} data-cursor>
            <span className="pv-ind-other-rule" aria-hidden="true" />
            <span className="pv-ind-other-mask pv-ind-other-mask--name"><span>{o.name}</span></span>
            <span className="pv-ind-other-mask pv-ind-other-mask--sub"><span>{o.short}</span></span>
            <Arrow />
          </Link>
        ))}
        <Link href={pv("/web-design/berkshire")} className="pv-ind-other" data-cursor>
          <span className="pv-ind-other-rule" aria-hidden="true" />
          <span className="pv-ind-other-mask pv-ind-other-mask--name"><span>Web design in Berkshire</span></span>
          <span className="pv-ind-other-mask pv-ind-other-mask--sub"><span>Our office is in Bracknell, and we work across the county.</span></span>
          <Arrow />
        </Link>
      </div>
    </section>
  );
}
