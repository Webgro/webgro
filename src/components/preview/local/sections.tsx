"use client";

import Link from "next/link";
import { Fragment, useRef } from "react";
import { getCaseBySlug } from "@/content/work";
import { pv } from "../links";
import { reviews, GOOGLE_RATING } from "../reviewData";
import { ShotDuo } from "../services/body/Frames";
import { BrushedTitle } from "../services/sections";
import { SCENE_QUERY, STATIC_QUERY, useGsap } from "../useGsap";
import { workExtras, workImage } from "../work/data";
import { industries } from "../industries/content";
import { MapScene } from "./MapScene";
import { OFFICE, towns, type Fact, type LocalCase, type LocalService, type LocalShots, type TownSlug } from "./content";

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export const DRIVES = Object.fromEntries(towns.map((t) => [t.slug, t.drive])) as Record<TownSlug, string>;

/* ── Hero, with the map ─────────────────────────────────────────────────── */

export function LocalHero({
  lines,
  brush,
  intro,
  facts,
  crumb,
  focus,
  mapLabel,
}: {
  lines: string[];
  brush: string;
  intro: string;
  facts: Fact[];
  /** Current page name for the trail. Omitted on the hub. */
  crumb?: string;
  /** Which routes the hero map draws. */
  focus: TownSlug | "all";
  mapLabel: string;
}) {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    gsap.fromTo(q(".pv-local-hero-brush"), { clipPath: "inset(0% 100% 0% 0%)" }, {
      clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, delay: 0.85, ease: "power3.out",
    });
    gsap.from(q(".pv-local-fact-rule"), { scaleX: 0, duration: 1.1, ease: "power3.out", stagger: 0.08, delay: 0.6 });
  });

  return (
    <section className="pv-local-hero" ref={root} data-pv-theme="paper">
      <div className="pv-local-hero-copy">
        <p className="pv-local-crumbs">
          <Link href={pv("/")} data-cursor>Home</Link>
          <span aria-hidden="true">/</span>
          {crumb ? (
            <>
              <Link href={pv("/web-design/berkshire")} data-cursor>Web design in Berkshire</Link>
              <span aria-hidden="true">/</span>
              <span>{crumb}</span>
            </>
          ) : (
            <span>Web design in Berkshire</span>
          )}
        </p>
        <h1 className="pv-h1 pv-local-h1">
          <BrushedTitle lines={lines} brush={brush} brushClass="pv-local-hero-brush" />
        </h1>
        <div className="pv-local-hero-row">
          <p className="pv-local-hero-intro">{intro}</p>
          <div className="pv-local-hero-actions">
            <Link href={pv("/contact")} className="pv-btn" data-cursor><span>Get in touch</span></Link>
            <a href={OFFICE.phoneHref} className="pv-textlink" data-cursor>Call {OFFICE.phone}</a>
          </div>
        </div>
      </div>
      <div className="pv-local-hero-map">
        <MapScene focus={focus} drives={DRIVES} label={mapLabel} />
      </div>
      <dl className="pv-local-facts">
        {facts.map((f) => (
          <div className="pv-local-fact" key={f.label}>
            <span className="pv-local-fact-rule" aria-hidden="true" />
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ── Where we are: travel notes and the office address ──────────────────── */

export function TravelSection({
  heading,
  body,
  children,
}: {
  heading: string;
  body: string[];
  /** Extra content for the right-hand column (the hub's town list). */
  children?: React.ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    gsap.from(q(".pv-local-map-text > *, .pv-local-map-aside > *"), {
      y: 30, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.08,
      scrollTrigger: { trigger: root.current, start: "top 75%" },
    });
  });

  return (
    <section className="pv-local-map" ref={root} data-pv-theme="ink">
      <div className="pv-local-map-text">
        <p className="pv-label">Where we are</p>
        <h2 className="pv-h2 pv-local-map-h2">{heading}</h2>
        {body.map((p) => <p className="pv-local-map-p" key={p}>{p}</p>)}
      </div>
      <div className="pv-local-map-aside">
        {children}
        <address className="pv-local-address">
          <span className="pv-label">Our office</span>
          <span>{OFFICE.street}</span>
          <span>{OFFICE.town}</span>
          <span>{OFFICE.postcode}</span>
        </address>
        <div className="pv-local-map-links">
          <a href={OFFICE.map} className="pv-textlink" target="_blank" rel="noopener noreferrer" data-cursor>Open in Google Maps</a>
          <a href={OFFICE.phoneHref} className="pv-textlink" data-cursor>{OFFICE.phone}</a>
        </div>
      </div>
    </section>
  );
}

/* ── Local businesses, and the services that suit them ─────────────────── */

export function Business({
  label,
  heading,
  body,
  services,
}: {
  label: string;
  heading: string;
  body: string[];
  services: LocalService[];
}) {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    gsap.from(q(".pv-local-biz-head > *"), {
      y: 30, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.08,
      scrollTrigger: { trigger: root.current, start: "top 75%" },
    });
    q(".pv-local-svc").forEach((row) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 90%" } });
      tl.from(row.querySelector(".pv-local-svc-rule"), { scaleX: 0, duration: 1.1, ease: "power3.inOut" })
        .from(row.querySelectorAll(".pv-local-svc-mask > span"), { yPercent: 110, duration: 0.9, ease: "power3.out", stagger: 0.06 }, 0.15);
    });
  });

  return (
    <section className="pv-local-biz" ref={root} data-pv-theme="paper">
      <div className="pv-local-biz-head">
        <p className="pv-label">{label}</p>
        <h2 className="pv-h2">{heading}</h2>
        {body.map((p) => <p className="pv-local-biz-p" key={p}>{p}</p>)}
      </div>
      <ServiceRows services={services} />
    </section>
  );
}

export function ServiceRows({ services, className = "" }: { services: LocalService[]; className?: string }) {
  return (
    <div className={`pv-local-svcs ${className}`}>
      <p className="pv-label">Services and prices</p>
      {services.map((s) => (
        <Link href={pv(s.path)} className="pv-local-svc" key={s.name} data-cursor>
          <span className="pv-local-svc-rule" aria-hidden="true" />
          <span className="pv-local-svc-mask pv-local-svc-mask--name"><span>{s.name}</span></span>
          <span className="pv-local-svc-mask pv-local-svc-mask--price"><span>{s.price}</span></span>
          <span className="pv-local-svc-mask pv-local-svc-mask--body"><span>{s.body}</span></span>
          <Arrow />
        </Link>
      ))}
    </div>
  );
}

/* ── Work cards ──────────────────────────────────────────────────────────── */

export function WorkCards({
  heading,
  intro,
  cases,
  shots,
  theme,
  review,
}: {
  heading: string;
  intro: string;
  cases: LocalCase[];
  /** Two screenshots of one of the clients above, in a browser and a phone. */
  shots: LocalShots;
  theme: "paper" | "ink";
  /** A featured Google review to close the section with. */
  review?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const quote = review ? reviews.find((r) => r.name === review) : undefined;

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    gsap.from(q(".pv-local-work-head > *"), {
      y: 30, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.08,
      scrollTrigger: { trigger: el, start: "top 75%" },
    });

    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      q(".pv-local-card").forEach((card) => {
        const media = card.querySelector(".pv-local-card-media");
        const img = card.querySelector(".pv-local-card-media img");
        gsap.fromTo(media, { clipPath: "inset(18% 8% 18% 8% round 18px)" }, {
          clipPath: "inset(0% 0% 0% 0% round 14px)", duration: 1.3, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 86%" },
        });
        gsap.fromTo(img, { yPercent: -6 }, {
          yPercent: 6, ease: "none",
          scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
        });
        gsap.from(card.querySelectorAll(".pv-local-card-text > *"), {
          y: 24, autoAlpha: 0, duration: 0.85, ease: "power3.out", stagger: 0.07,
          scrollTrigger: { trigger: card, start: "top 78%" },
        });
      });
      const words = q(".pv-local-quote-w");
      if (words.length) {
        gsap.fromTo(words, { opacity: 0.16 }, {
          opacity: 1, ease: "none", stagger: 0.05,
          scrollTrigger: { trigger: q(".pv-local-quote")[0], start: "top 85%", end: "bottom 55%", scrub: 0.4 },
        });
      }
    });
    mm.add(STATIC_QUERY, () => {
      gsap.set(q(".pv-local-quote-w"), { opacity: 1 });
    });
    return () => mm.revert();
  });

  return (
    <section className="pv-local-work" ref={root} data-pv-theme={theme}>
      <div className="pv-local-work-head">
        <p className="pv-label">Case studies</p>
        <h2 className="pv-h2">{heading}</h2>
        <p className="pv-lede">{intro}</p>
      </div>
      <div className="pv-local-work-shots">
        <ShotDuo desktop={shots.desktop} phone={shots.phone} />
      </div>
      <div className="pv-local-cards">
        {cases.map((c) => {
          const cs = getCaseBySlug(c.slug);
          const extra = workExtras[c.slug];
          if (!cs || !extra) return null;
          return (
            <article className="pv-local-card" key={c.slug}>
              <Link href={pv(`/work/${c.slug}`)} className="pv-local-card-media" data-cursor aria-label={`${cs.client} case study`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={workImage(c.slug, "sm")}
                  srcSet={`${workImage(c.slug, "sm")} 800w, ${workImage(c.slug, "lg")} ${extra.w}w`}
                  sizes="(min-width: 900px) 46vw, 92vw"
                  alt={cs.heroImageAlt}
                  width={extra.w}
                  height={extra.h}
                  loading="lazy"
                />
              </Link>
              <div className="pv-local-card-text">
                {c.where && <p className="pv-local-card-where">{c.where}</p>}
                <h3>{cs.client}</h3>
                <p className="pv-local-card-line">{c.line}</p>
                {c.figure && (
                  <p className="pv-local-card-fig"><strong>{c.figure.value}</strong><span>{c.figure.label}</span></p>
                )}
                <Link href={pv(`/work/${c.slug}`)} className="pv-textlink" data-cursor>Read the case study</Link>
              </div>
            </article>
          );
        })}
      </div>
      {quote && (
        <figure className="pv-local-quote">
          <blockquote>
            <p>
              {quote.text.split(" ").map((w, i) => (
                <Fragment key={i}><span className="pv-local-quote-w">{w}</span>{" "}</Fragment>
              ))}
            </p>
          </blockquote>
          <figcaption>
            {quote.name}, Google review. Webgro is rated {GOOGLE_RATING.score} from {GOOGLE_RATING.count} reviews.
          </figcaption>
        </figure>
      )}
      <div className="pv-local-work-foot">
        <Link href={pv("/work")} className={`pv-btn${theme === "ink" ? " pv-btn--light" : ""}`} data-cursor><span>View all work</span></Link>
      </div>
    </section>
  );
}

/* ── Other areas and industries ─────────────────────────────────────────── */

export function Nearby({
  current,
  theme = "ink",
  areas = true,
}: {
  current?: TownSlug;
  theme?: "paper" | "ink";
  /** The hub already lists every town, so it only shows the industries. */
  areas?: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const others = towns.filter((t) => t.slug !== current);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    gsap.from(q(".pv-local-near-head > *"), {
      y: 30, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.08,
      scrollTrigger: { trigger: root.current, start: "top 78%" },
    });
    q(".pv-local-near-row").forEach((row) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 92%" } });
      tl.from(row.querySelector(".pv-local-near-rule"), { scaleX: 0, duration: 1.1, ease: "power3.inOut" })
        .from(row.querySelectorAll(".pv-local-near-mask > span"), { yPercent: 110, duration: 0.9, ease: "power3.out", stagger: 0.06 }, 0.12);
    });
  });

  return (
    <section className="pv-local-near" ref={root} data-pv-theme={theme}>
      <div className="pv-local-near-head">
        <p className="pv-label">More pages</p>
        <h2 className="pv-h3">{areas ? "Other areas and industries" : "Industries we work in"}</h2>
      </div>
      <div className={`pv-local-near-cols${areas ? "" : " pv-local-near-cols--one"}`}>
        {areas && (
        <div className="pv-local-near-list">
          <p className="pv-label">Areas</p>
          {current && (
            <Link href={pv("/web-design/berkshire")} className="pv-local-near-row" data-cursor>
              <span className="pv-local-near-rule" aria-hidden="true" />
              <span className="pv-local-near-mask pv-local-near-mask--name"><span>Berkshire</span></span>
              <span className="pv-local-near-mask pv-local-near-mask--sub"><span>All the towns we work in</span></span>
              <Arrow />
            </Link>
          )}
          {others.map((t) => (
            <Link href={pv(`/web-design/${t.slug}`)} className="pv-local-near-row" key={t.slug} data-cursor>
              <span className="pv-local-near-rule" aria-hidden="true" />
              <span className="pv-local-near-mask pv-local-near-mask--name"><span>{t.name}</span></span>
              <span className="pv-local-near-mask pv-local-near-mask--sub"><span>{t.slug === "bracknell" ? "Our office" : `${t.drive} by car`}</span></span>
              <Arrow />
            </Link>
          ))}
        </div>
        )}
        <div className="pv-local-near-list">
          <p className="pv-label">Industries</p>
          {industries.map((i) => (
            <Link href={pv(`/industries/${i.slug}`)} className="pv-local-near-row" key={i.slug} data-cursor>
              <span className="pv-local-near-rule" aria-hidden="true" />
              <span className="pv-local-near-mask pv-local-near-mask--name"><span>{i.name}</span></span>
              <span className="pv-local-near-mask pv-local-near-mask--sub"><span>{i.short}</span></span>
              <Arrow />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
