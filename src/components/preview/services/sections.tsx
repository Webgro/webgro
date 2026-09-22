"use client";

import Link from "next/link";
import { Fragment, useRef } from "react";
import { Mockup } from "@/components/mockups";
import { PlatformMark } from "./PlatformMark";
import { ShopifyPartner } from "../ShopifyPartner";
import { BrushStroke } from "../Brush";
import { createGlPlanes } from "../glPlanes";
import { pv } from "../links";
import { SCENE_QUERY, useGsap } from "../useGsap";
import { caseNotes, getAnyPvService, pvSubServices, type PvService } from "./content";
import { HeroVisual } from "./visuals";
import { forYouVisual, getVisual } from "./body/BodyVisuals";
import { FigureDraw } from "./body/FigureDraw";

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Headline lines with one phrase brushed. The phrase has to sit inside a single line. */
export function BrushedTitle({ lines, brush, brushClass }: { lines: string[]; brush: string; brushClass: string }) {
  return (
    <>
      {lines.map((line) => {
        const at = brush ? line.indexOf(brush) : -1;
        return (
          <span className="pv-line" key={line}>
            <span>
              {at < 0 ? line : (
                <>
                  {line.slice(0, at)}
                  <span className="pv-brushed">
                    {brush}
                    <BrushStroke className={brushClass} />
                  </span>
                  {line.slice(at + brush.length)}
                </>
              )}
            </span>
          </span>
        );
      })}
    </>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────────── */

export function ServiceHero({ service }: { service: PvService }) {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    gsap.fromTo(q(".pv-svc-hero-brush"), { clipPath: "inset(0% 100% 0% 0%)" }, {
      clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, delay: 0.9, ease: "power3.out",
    });
  });

  return (
    <section className="pv-svc-hero pv-svc-hero--split" ref={root} data-pv-theme="paper">
      <div className="pv-svc-hero-copy">
        <p className="pv-svc-crumbs">
          <Link href={pv("/services")} data-cursor>All services</Link>
          {service.parent && (
            <>
              <span aria-hidden="true">/</span>
              <Link href={pv("/services/marketing")} data-cursor>Marketing</Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span>{service.name}</span>
        </p>
        <h1 className="pv-h1 pv-svc-h1">
          <BrushedTitle lines={service.hero.title} brush={service.hero.brush} brushClass="pv-svc-hero-brush" />
        </h1>
        <div className="pv-svc-hero-row">
          <p className="pv-svc-hero-intro">{service.hero.intro}</p>
          <div className="pv-svc-hero-actions">
            <Link href={pv("/contact")} className="pv-btn" data-cursor><span>Get in touch</span></Link>
            <a href="#process" className="pv-textlink" data-cursor>How it works</a>
          </div>
        </div>
      </div>
      <div className="pv-svc-hero-visual">
        <HeroVisual service={service} />
      </div>
    </section>
  );
}

/* ── Is this for me? ────────────────────────────────────────────────────── */

export function ForYou({ service }: { service: PvService }) {
  const root = useRef<HTMLElement>(null);
  const { forYou } = service;
  const pic = forYouVisual(service);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    gsap.from(q(".pv-svc-you-head > *"), {
      yPercent: 40, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: root.current, start: "top 75%" },
    });
    // Each statement lights up and gets its tick as it crosses the reading line.
    q(".pv-svc-you-item").forEach((item) => {
      const tick = item.querySelector(".pv-svc-tick path");
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: item, start: "top 80%", end: "top 52%", scrub: 0.4 },
      });
      tl.fromTo(item.querySelector("p"), { opacity: 0.16 }, { opacity: 1, duration: 1 }, 0)
        .fromTo(tick, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6 }, 0.4);
    });
    gsap.from(q(".pv-svc-you-no > *"), {
      y: 24, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: q(".pv-svc-you-no")[0], start: "top 88%" },
    });
  });

  return (
    <>
    <section className={`pv-svc-you${pic?.wide ? " has-after" : ""}`} ref={root} data-pv-theme="paper">
      <div className="pv-svc-you-head">
        <p className="pv-label">Who it&rsquo;s for</p>
        <h2 className="pv-h3">{forYou.heading}</h2>
        {pic && !pic.wide && <div className="pv-svc-you-pic">{pic.node}</div>}
      </div>
      <div className="pv-svc-you-body">
        <ul className="pv-svc-you-list">
          {forYou.yes.map((y) => (
            <li className="pv-svc-you-item" key={y}>
              <svg className="pv-svc-tick" viewBox="0 0 40 40" aria-hidden="true">
                <path pathLength={1} d="M6 22 C 10 25, 13 29, 16 34 C 21 22, 27 13, 36 5" />
              </svg>
              <p>{y}</p>
            </li>
          ))}
        </ul>
        {forYou.no && (
          <div className="pv-svc-you-no">
            <p className="pv-label">When it isn&rsquo;t a fit</p>
            <p>{forYou.no}</p>
            {forYou.noLink && (
              <Link href={pv(forYou.noLink.path)} className="pv-textlink" data-cursor>{forYou.noLink.label}</Link>
            )}
          </div>
        )}
      </div>
    </section>
    {/* A wide picture gets its own block, so the sticky heading above never slides over it. */}
    {pic?.wide && <section className="pv-svc-you-wide" data-pv-theme="paper">{pic.node}</section>}
    </>
  );
}

/* ── Marketing's three branches ─────────────────────────────────────────── */

export function Branches() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    gsap.from(q(".pv-svc-branches-head > *"), {
      yPercent: 40, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: root.current, start: "top 75%" },
    });
    q(".pv-svc-branch").forEach((row) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 88%" } });
      tl.from(row.querySelector(".pv-svc-branch-rule"), { scaleX: 0, duration: 1.1, ease: "power3.inOut" })
        .from(row.querySelectorAll(".pv-svc-branch-mask > span"), { yPercent: 110, duration: 0.9, ease: "power3.out", stagger: 0.08 }, 0.15);
    });
  });

  return (
    <section className="pv-svc-branches" ref={root} data-pv-theme="paper">
      <div className="pv-svc-branches-head">
        <h2 className="pv-h2">Email, PPC and social media</h2>
        <p className="pv-lede">
          Marketing covers three services. Each can be taken on its own or combined with the others.
        </p>
      </div>
      <div className="pv-svc-branch-list">
        {pvSubServices.map((s) => (
          <Link href={pv(s.path)} className="pv-svc-branch" key={s.slug} data-cursor>
            <span className="pv-svc-branch-rule" />
            <span className="pv-svc-branch-fill" />
            <span className="pv-svc-branch-mask pv-svc-branch-mask--say"><span>{s.say}</span></span>
            <span className="pv-svc-branch-mask pv-svc-branch-mask--name">
              <span>{s.name}<Arrow /></span>
            </span>
            <span className="pv-svc-branch-mask pv-svc-branch-mask--short"><span>{s.short}</span></span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ── What you get ─────────────────────────────────────────────────────── */

export function WhatYouGet({ service }: { service: PvService }) {
  const root = useRef<HTMLElement>(null);
  const { get, platforms, devices, mockups } = service;
  // The first mockup is the hero picture. Any others are shown here.
  const extra = service.visual === "consultancy" || service.visual === "automation" ? (mockups ?? []).slice(1) : [];
  const pic = getVisual(service);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    gsap.from(q(".pv-svc-get-head > *"), {
      yPercent: 40, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: root.current, start: "top 75%" },
    });
    gsap.from(q(".pv-svc-get-body p"), {
      y: 30, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.12,
      scrollTrigger: { trigger: q(".pv-svc-get-body")[0], start: "top 82%" },
    });
    gsap.from(q(".pv-svc-item"), {
      yPercent: 105, duration: 0.9, ease: "power3.out", stagger: 0.04,
      scrollTrigger: { trigger: q(".pv-svc-items")[0], start: "top 82%" },
    });
    q(".pv-svc-platform").forEach((row) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 88%" } });
      const mark = row.querySelector(".pv-svc-platform-mark");
      tl.from(row.querySelector(".pv-svc-platform-rule"), { scaleX: 0, duration: 1.1, ease: "power3.inOut" });
      if (mark) tl.from(mark, { autoAlpha: 0, scale: 0.4, rotation: -14, duration: 0.9, ease: "back.out(1.8)" }, 0.1);
      tl.from(row.querySelectorAll(".pv-line > span"), { yPercent: 110, duration: 0.9, ease: "power3.out" }, 0.15)
        .from(row.querySelector("p"), { autoAlpha: 0, y: 20, duration: 0.8, ease: "power3.out" }, 0.3);
    });
    q(".pv-svc-get-extra").forEach((fig) => {
      gsap.from(fig, {
        y: 60, autoAlpha: 0, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: fig, start: "top 85%" },
      });
    });
  });

  return (
    <section className="pv-svc-get" ref={root} data-pv-theme="ink">
      <div className="pv-svc-get-head">
        <p className="pv-label">What&rsquo;s included</p>
        <h2 className="pv-h2">{get.heading}</h2>
      </div>
      <div className="pv-svc-get-body">
        {get.body.map((p) => <p key={p}>{p}</p>)}
      </div>

      {pic && <div className="pv-svc-get-pic">{pic}</div>}

      <div className="pv-svc-get-list">
        <p className="pv-label">Includes</p>
        <p className="pv-svc-items">
          {get.items.map((item, i) => (
            <Fragment key={item}>
              <span className="pv-svc-item-mask">
                <span className="pv-svc-item">{item}{i < get.items.length - 1 ? "," : "."}</span>
              </span>{" "}
            </Fragment>
          ))}
        </p>
      </div>

      {platforms && (
        <div className="pv-svc-platforms">
          <p className="pv-label">Which platform</p>
          {platforms.map((p) => (
            <div className="pv-svc-platform" key={p.name}>
              <span className="pv-svc-platform-rule" />
              <h3 className="pv-svc-platform-name">
                <PlatformMark name={p.name} />
                <span className="pv-line"><span>{p.name}</span></span>
              </h3>
              <p>{p.body}</p>
            </div>
          ))}
          {devices && <p className="pv-svc-platforms-note">{devices}</p>}
          {platforms.some((p) => p.name === "Shopify") && <ShopifyPartner className="pv-svc-partner" />}
        </div>
      )}

      {extra.map((m) => (
        <figure className="pv-svc-get-extra" key={m.name}>
          <div className="pv-svc-demo-screen" aria-hidden="true"><Mockup name={m.name} /></div>
          <figcaption className="pv-svc-visual-caption">{m.caption}</figcaption>
        </figure>
      ))}
    </section>
  );
}

/* ── What it has done for someone like you ──────────────────────────────── */

export function Proof({ service }: { service: PvService }) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const { proof } = service;
  const cases = proof.cases.filter((slug) => caseNotes[slug]);

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    gsap.from(q(".pv-svc-proof-head > *"), {
      yPercent: 40, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: el, start: "top 75%" },
    });
    q(".pv-svc-figure").forEach((fig, i) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: fig, start: "top 88%" }, delay: i * 0.08 });
      tl.from(fig.querySelector(".pv-svc-figure-rule"), { scaleX: 0, duration: 1.1, ease: "power3.inOut" })
        .from(fig.querySelector("strong > span"), { yPercent: 110, duration: 1, ease: "power3.out" }, 0.1)
        .from(fig.querySelector(":scope > p"), { autoAlpha: 0, y: 18, duration: 0.8, ease: "power3.out" }, 0.35);
    });
    q(".pv-svc-case").forEach((item) => {
      gsap.from(item.querySelectorAll(".pv-svc-case-text > *"), {
        y: 28, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: item, start: "top 78%" },
      });
    });

    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      // Plain numbers count up to their value as they rise into view. Ranges
      // and ranks (50–70%, #1) are left as they are.
      const restore: Array<() => void> = [];
      q(".pv-svc-figure strong > span").forEach((span) => {
        const text = span.textContent ?? "";
        const m = text.match(/^([^\d]*)(\d+(?:\.\d+)?)([^\d]*)$/);
        if (!m || m[1].includes("#")) return;
        const end = Number(m[2]);
        const n = { v: 0 };
        span.textContent = `${m[1]}0${m[3]}`;
        restore.push(() => { span.textContent = text; });
        gsap.to(n, {
          v: end, duration: 1.4, ease: "power2.out",
          scrollTrigger: { trigger: span, start: "top 90%" },
          onUpdate: () => { span.textContent = `${m[1]}${Math.round(n.v)}${m[3]}`; },
          onComplete: () => { span.textContent = text; },
        });
      });

      // The pictures drift at a slightly different rate from the page, and the
      // WebGL layer bows them in the direction of travel.
      q(".pv-svc-case").forEach((item, i) => {
        gsap.fromTo(item.querySelector(".pv-svc-case-media"), { yPercent: i % 2 ? 14 : 7 }, {
          yPercent: i % 2 ? -14 : -7, ease: "none",
          scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      let planes: ReturnType<typeof createGlPlanes> = null;
      let io: IntersectionObserver | undefined;
      if (canvas.current) {
        planes = createGlPlanes(canvas.current, q(".pv-svc-case-media") as HTMLElement[]);
        if (planes) {
          el.classList.add("is-gl-on");
          io = new IntersectionObserver(([e]) => planes?.setRunning(e.isIntersecting), { rootMargin: "20% 0px" });
          io.observe(el);
        }
      }
      return () => {
        restore.forEach((f) => f());
        io?.disconnect();
        planes?.destroy();
        el.classList.remove("is-gl-on");
      };
    });
    return () => mm.revert();
  });

  return (
    <section className="pv-svc-proof" ref={root} data-pv-theme="ink">
      <canvas className="pv-svc-gl" ref={canvas} aria-hidden="true" />
      <div className="pv-svc-proof-head">
        <h2 className="pv-h2">{proof.heading}</h2>
        <p className="pv-lede">{proof.intro}</p>
      </div>

      {proof.figures.length > 0 && (
        <div className="pv-svc-figures">
          {proof.figures.map((f) => (
            <div className="pv-svc-figure" key={f.label}>
              <span className="pv-svc-figure-rule" />
              <FigureDraw draw={f.draw} />
              <strong><span>{f.value}</span></strong>
              <p>{f.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="pv-svc-cases">
        {cases.map((slug) => {
          const c = caseNotes[slug];
          return (
            <article className="pv-svc-case" key={slug}>
              <Link href={pv(`/work/${slug}`)} className="pv-svc-case-media" data-cursor aria-label={`${c.client} case study`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={`${c.client} project by Webgro`} width={c.w} height={c.h} loading="lazy" />
              </Link>
              <div className="pv-svc-case-text">
                <h3>{c.client}</h3>
                <p>{c.line}</p>
                <Link href={pv(`/work/${slug}`)} className="pv-textlink" data-cursor>Read the case study</Link>
              </div>
            </article>
          );
        })}
      </div>
      <div className="pv-svc-proof-foot">
        <Link href={pv("/work")} className="pv-btn pv-btn--light" data-cursor><span>View all work</span></Link>
      </div>
    </section>
  );
}

/* ── How do I start? ────────────────────────────────────────────────────── */

export function Start({ service, theme }: { service: PvService; theme: "paper" | "ink" }) {
  const root = useRef<HTMLElement>(null);
  const pairs = service.pairs.map(getAnyPvService).filter((s): s is PvService => Boolean(s));

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    gsap.from(q(".pv-svc-start-main .pv-line > span"), {
      yPercent: 110, duration: 1, ease: "power3.out", stagger: 0.08,
      scrollTrigger: { trigger: root.current, start: "top 72%" },
    });
    gsap.from(q(".pv-svc-start-fade"), {
      y: 26, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: root.current, start: "top 66%" },
    });
    q(".pv-svc-pair").forEach((row) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 90%" } });
      tl.from(row.querySelector(".pv-svc-pair-rule"), { scaleX: 0, duration: 1.1, ease: "power3.inOut" })
        .from(row.querySelectorAll(".pv-svc-pair-mask > span"), { yPercent: 110, duration: 0.9, ease: "power3.out", stagger: 0.08 }, 0.15);
    });
  });

  return (
    <section className="pv-svc-start" ref={root} data-pv-theme={theme}>
      <div className="pv-svc-start-main">
        <p className="pv-label pv-svc-start-fade">How to start</p>
        <h2 className="pv-h2"><span className="pv-line"><span>{service.start.heading}</span></span></h2>
        <p className="pv-lede pv-svc-start-fade">{service.start.body}</p>
        <div className="pv-svc-start-actions pv-svc-start-fade">
          <Link href={pv("/contact")} className={`pv-btn${theme === "ink" ? " pv-btn--light" : ""}`} data-cursor><span>Get in touch</span></Link>
          <p>
            Or call <a href="tel:+441344231119" data-cursor>01344 231 119</a>. It&rsquo;s a small team, so
            you&rsquo;ll speak to the people who do the work.
          </p>
        </div>
      </div>

      <div className="pv-svc-pairs">
        <p className="pv-label">
          {service.parent ? "Other marketing and related services" : "Related services"}
        </p>
        {pairs.map((p) => (
          <Link href={pv(p.path)} className="pv-svc-pair" key={p.slug} data-cursor>
            <span className="pv-svc-pair-rule" />
            <span className="pv-svc-pair-mask pv-svc-pair-mask--name"><span>{p.name}</span></span>
            <span className="pv-svc-pair-mask pv-svc-pair-mask--short"><span>{p.short}</span></span>
            <Arrow />
          </Link>
        ))}
        <Link href={pv("/services")} className="pv-textlink pv-svc-pairs-all" data-cursor>View all services</Link>
      </div>
    </section>
  );
}
