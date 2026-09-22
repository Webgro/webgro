"use client";

import { useRef } from "react";
import { BrushBand } from "../BrushBand";
import { useDrawing } from "./useDrawing";

function Tick() {
  return (
    <svg className="pv-svc-d-tick" viewBox="0 0 24 24" aria-hidden="true">
      <path pathLength={1} d="M4 13 L10 19 L21 5" />
    </svg>
  );
}

/* ── Websites: Twisted Tailor's eight apps, rewritten as theme code ────── */

const TT_APPS = [
  "Cart recommendations", "Trouser upsell", "Size recommender", "Size guide",
  "Gallery", "Wishlist", "Bundle logic", "Back-in-stock alerts",
];

export function AppBill() {
  const root = useRef<HTMLElement>(null);

  useDrawing(root, ({ gsap, q, el }) => {
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 55%", scrub: 0.5 },
    });
    q(".pv-svc-d-bill-row").forEach((row, i) => {
      const t = i * 0.3;
      tl.fromTo(row.querySelector(".is-app"), { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -8, duration: 0.25 }, t)
        .fromTo(row.querySelector(".is-code"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.25 }, t + 0.12)
        .fromTo(row.querySelector("span"), { color: "rgba(13,13,15,0.42)" }, { color: "#0d0d0f", duration: 0.25 }, t);
    });
    tl.fromTo(q(".pv-svc-d-bill-total"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4 }, TT_APPS.length * 0.3)
      .fromTo(q(".pv-svc-d-bill-total .pv-svc-band"), { clipPath: "inset(-60% 100% -60% 0%)" }, { clipPath: "inset(-60% 0% -60% 0%)", duration: 0.5 }, TT_APPS.length * 0.3 + 0.2);
  });

  return (
    <figure className="pv-svc-d pv-svc-d-bill" ref={root}>
      <div className="pv-svc-d-card">
        <p className="pv-svc-d-card-head">Third-party apps on the old theme</p>
        <ul>
          {TT_APPS.map((a) => (
            <li className="pv-svc-d-bill-row" key={a}>
              <span>{a}</span>
              <em aria-hidden="true"><b className="is-app">App</b><b className="is-code">Theme code</b></em>
            </li>
          ))}
        </ul>
        <p className="pv-svc-d-bill-total">
          <strong>Roughly $250 a month off the app bill</strong>
          <BrushBand className="pv-svc-d-bill-band" seed={3} />
        </p>
      </div>
    </figure>
  );
}

/* ── SEO: an AI answer that cites your site ────────────────────────────── */

export function AiAnswer() {
  const root = useRef<HTMLElement>(null);

  useDrawing(root, ({ gsap, q, el }) => {
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 60%", scrub: 0.5 },
    });
    tl.fromTo(q(".pv-svc-d-ai-ask"), { autoAlpha: 0, y: 16, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.6)" }, 0)
      .fromTo(q(".pv-svc-d-ai-lines i"), { scaleX: 0 }, { scaleX: 1, duration: 0.25, stagger: 0.18, ease: "power1.out" }, 0.35)
      .fromTo(q(".pv-svc-d-ai-cite"), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, 1.25)
      .fromTo(q(".pv-svc-d-ai-src > *"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.25, stagger: 0.1 }, 1.4)
      .fromTo(q(".pv-svc-d-ai-src .is-you"), { backgroundColor: "rgba(13,13,15,0.06)", color: "#0d0d0f" }, { backgroundColor: "#2d8dff", color: "#ffffff", duration: 0.25 }, 1.8);
  });

  return (
    <figure className="pv-svc-d pv-svc-d-ai" ref={root}>
      <div className="pv-svc-d-card">
        <p className="pv-svc-d-card-head">AI search</p>
        <p className="pv-svc-d-ai-ask">Where should I buy a phone case in the UK?</p>
        <div className="pv-svc-d-ai-answer" aria-hidden="true">
          <div className="pv-svc-d-ai-lines"><i /><i /><i /><i style={{ width: "62%" }} /></div>
          <span className="pv-svc-d-ai-cite">1</span>
        </div>
        <div className="pv-svc-d-ai-src">
          <span className="pv-svc-d-ai-srclabel">Sources</span>
          <span className="is-you">yoursite.co.uk</span>
          <span className="is-other" aria-hidden="true"><i /></span>
          <span className="is-other" aria-hidden="true"><i /></span>
        </div>
      </div>
    </figure>
  );
}

/* ── SEO: the technical checks ─────────────────────────────────────────── */

const CHECKS = [
  "Schema markup", "Site speed", "Crawling and indexing", "Internal linking",
  "301 redirect mapping", "Canonicals", "Structured data carried over", "Content parity",
];

export function TechChecklist() {
  const root = useRef<HTMLElement>(null);

  useDrawing(root, ({ gsap, q, el }) => {
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 60%", scrub: 0.5 },
    });
    tl.fromTo(q(".pv-svc-d-check-bar i"), { scaleX: 0 }, { scaleX: 1, duration: CHECKS.length * 0.3 }, 0);
    q(".pv-svc-d-check").forEach((row, i) => {
      const t = i * 0.3;
      tl.fromTo(row.querySelector(".pv-svc-d-tick path"), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.25 }, t + 0.05)
        .fromTo(row.querySelector(".pv-svc-d-check-box"), { backgroundColor: "rgba(45,141,255,0)" }, { backgroundColor: "rgba(45,141,255,0.14)", duration: 0.2 }, t)
        .fromTo(row.querySelector("span:last-child"), { opacity: 0.4 }, { opacity: 1, duration: 0.2 }, t);
    });
  });

  return (
    <figure className="pv-svc-d pv-svc-d-checks" ref={root}>
      <div className="pv-svc-d-card">
        <div className="pv-svc-d-check-top">
          <p className="pv-svc-d-card-head">Technical audit</p>
          <span className="pv-svc-d-check-bar" aria-hidden="true"><i /></span>
        </div>
        <ul>
          {CHECKS.map((c) => (
            <li className="pv-svc-d-check" key={c}>
              <span className="pv-svc-d-check-box"><Tick /></span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}

/* ── Consultancy: one contact, backed by specialists ───────────────────── */

const SPECIALISTS = [
  "Senior paid-media buyers", "Logistics consultants", "B2B strategists",
  "Luxury brand designers", "Platform migration specialists",
];

export function SpecialistHub() {
  const root = useRef<HTMLElement>(null);

  useDrawing(root, ({ gsap, q, el, wide }) => {
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 62%", scrub: 0.5 },
    });
    const [a, b] = q(".pv-svc-d-hub-stem");
    tl.fromTo(q(".pv-svc-d-hub-node--you"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0)
      .fromTo(a, { clipPath: "inset(0% -60% 100% -60%)" }, { clipPath: "inset(0% -60% 0% -60%)", duration: 0.3 }, 0.25)
      .fromTo(q(".pv-svc-d-hub-node--main"), { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, 0.5)
      .fromTo(b, { clipPath: "inset(0% -60% 100% -60%)" }, { clipPath: "inset(0% -60% 0% -60%)", duration: 0.3 }, 0.75)
      .fromTo(q(".pv-svc-d-hub-bus"), wide ? { clipPath: "inset(-60% 50% -60% 50%)" } : { clipPath: "inset(0% -60% 100% -60%)" },
        { clipPath: wide ? "inset(-60% 0% -60% 0%)" : "inset(0% -60% 0% -60%)", duration: 0.6 }, 1);
    q(".pv-svc-d-hub-chip").forEach((chip, i) => {
      tl.fromTo(chip.querySelector(".pv-svc-d-hub-drop"), wide ? { scaleY: 0 } : { scaleX: 0 }, wide ? { scaleY: 1, duration: 0.2 } : { scaleX: 1, duration: 0.2 }, 1.2 + i * 0.12)
        .fromTo(chip.querySelector("strong"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 1.3 + i * 0.12);
    });
  });

  return (
    <figure className="pv-svc-d pv-svc-d-hub" ref={root}>
      <div className="pv-svc-d-hub-tree">
        <p className="pv-svc-d-hub-node pv-svc-d-hub-node--you">Your business and your team</p>
        <BrushBand className="pv-svc-d-hub-stem" vertical seed={5} />
        <p className="pv-svc-d-hub-node pv-svc-d-hub-node--main">One senior point of contact</p>
        <BrushBand className="pv-svc-d-hub-stem" vertical seed={9} />
        <div className="pv-svc-d-hub-chips">
          <span className="pv-svc-d-hub-bus" aria-hidden="true" />
          <ul>
            {SPECIALISTS.map((s) => (
              <li className="pv-svc-d-hub-chip" key={s}>
                <span className="pv-svc-d-hub-drop" aria-hidden="true" />
                <strong>{s}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </figure>
  );
}

/* ── Marketing: revenue against margin ─────────────────────────────────── */

/** Illustrative proportions only, with no values shown. */
const CAMPAIGNS = [
  { name: "Campaign A", revenue: 0.55, margin: 0.22 },
  { name: "Campaign B", revenue: 0.4, margin: 0.14 },
  { name: "Campaign C", revenue: 0.92, margin: -0.18 },
];

export function MarginReport() {
  const root = useRef<HTMLElement>(null);

  useDrawing(root, ({ gsap, q, el }) => {
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 60%", scrub: 0.5 },
    });
    q(".pv-svc-d-margin-row").forEach((row, i) => {
      tl.fromTo(row.querySelector(".is-rev"), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power1.out" }, i * 0.25)
        .fromTo(row.querySelector(".is-margin"), { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: "power1.out" }, 0.9 + i * 0.25);
    });
    tl.fromTo(q(".pv-svc-d-margin-flag"), { autoAlpha: 0, x: 12 }, { autoAlpha: 1, x: 0, duration: 0.3 }, 1.8);
  });

  return (
    <figure className="pv-svc-d pv-svc-d-margin" ref={root}>
      <div className="pv-svc-d-card">
        <div className="pv-svc-d-margin-top">
          <p className="pv-svc-d-card-head">Monthly report</p>
          <p className="pv-svc-d-margin-key" aria-hidden="true"><span className="is-rev" />Revenue<span className="is-margin" />Margin after ad spend</p>
        </div>
        <ul>
          {CAMPAIGNS.map((c) => (
            <li className="pv-svc-d-margin-row" key={c.name}>
              <span className="pv-svc-d-margin-name">{c.name}</span>
              <span className="pv-svc-d-margin-bars" aria-hidden="true">
                <i className="is-rev" style={{ ["--v" as string]: c.revenue }} />
                <i className={`is-margin${c.margin < 0 ? " is-loss" : ""}`} style={{ ["--v" as string]: Math.abs(c.margin) }} />
              </span>
              {c.margin < 0 && <span className="pv-svc-d-margin-flag">Losing money</span>}
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}

/* ── Design: one logo used six ways, then set by one rule ──────────────── */

const PLACES = ["Website", "Email", "Social", "Print", "Packaging", "Signage"];
/** How each copy of the logo starts out before the rules pull it into line. */
const MESS = [
  { rotation: -9, scaleX: 1.25, scaleY: 0.9, x: -14, y: 6, color: "#2d8dff" },
  { rotation: 6, scaleX: 0.8, scaleY: 1, x: 10, y: -8, color: "#0d0d0f" },
  { rotation: 0, scaleX: 1.4, scaleY: 1.4, x: 0, y: 10, color: "#2d8dff" },
  { rotation: -4, scaleX: 0.7, scaleY: 0.7, x: 16, y: 0, color: "#6b6b70" },
  { rotation: 12, scaleX: 1, scaleY: 1.2, x: -8, y: -10, color: "#0d0d0f" },
  { rotation: -14, scaleX: 1.1, scaleY: 0.8, x: 6, y: 12, color: "#6b6b70" },
];

export function ConsistencyGrid() {
  const root = useRef<HTMLElement>(null);

  useDrawing(root, ({ gsap, q, el }) => {
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 55%", scrub: 0.5 },
    });
    q(".pv-svc-d-mark").forEach((mark, i) => {
      const m = MESS[i % MESS.length];
      tl.fromTo(mark, { rotation: m.rotation, scaleX: m.scaleX, scaleY: m.scaleY, x: m.x, y: m.y, color: m.color },
        { rotation: 0, scaleX: 1, scaleY: 1, x: 0, y: 0, color: "#0d0d0f", duration: 1, ease: "power2.inOut" }, 0.3 + i * 0.06);
    });
    tl.fromTo(q(".pv-svc-d-grid-guide"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0.9);
  });

  return (
    <figure className="pv-svc-d pv-svc-d-grid" ref={root}>
      <div className="pv-svc-d-grid-board">
        {PLACES.map((p) => (
          <div className="pv-svc-d-grid-cell" key={p}>
            <span className="pv-svc-d-grid-guide" aria-hidden="true" />
            <span className="pv-svc-d-mark" aria-hidden="true"><i />Brand</span>
            <em>{p}</em>
          </div>
        ))}
      </div>
    </figure>
  );
}

/* ── Email: how much revenue comes from email ──────────────────────────── */

export function EmailShare() {
  const root = useRef<HTMLElement>(null);

  useDrawing(root, ({ gsap, q, el }) => {
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 60%", scrub: 0.5 },
    });
    tl.fromTo(q(".pv-svc-d-share-axis"), { scaleX: 0 }, { scaleX: 1, duration: 0.4 }, 0)
      .fromTo(q(".pv-svc-d-share-low"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.4 }, 0.3)
      .fromTo(q(".pv-svc-d-share-best"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.4 }, 0.6)
      .fromTo(q(".pv-svc-d-share-note"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.25, stagger: 0.15 }, 0.5)
      .fromTo(q(".pv-svc-d-share-pin"), { left: "0%" }, { left: "60%", duration: 0.8, ease: "power2.out" }, 1)
      .fromTo(q(".pv-svc-d-share-pin strong"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 1.6);
  });

  return (
    <figure className="pv-svc-d pv-svc-d-share" ref={root}>
      <div className="pv-svc-d-card">
        <p className="pv-svc-d-card-head">Share of revenue from email</p>
        <div className="pv-svc-d-share-plot">
          <span className="pv-svc-d-share-low" style={{ left: 0, width: "30%" }} />
          <span className="pv-svc-d-share-best" style={{ left: "50%", width: "30%" }} />
          <span className="pv-svc-d-share-pin" style={{ left: "60%" }}><strong>Fun Cases, 30%+</strong></span>
          <span className="pv-svc-d-share-axis" />
          <ol className="pv-svc-d-share-ticks" aria-hidden="true">
            {[0, 10, 20, 30, 40, 50].map((t) => <li key={t} style={{ left: `${t * 2}%` }}>{t}%</li>)}
          </ol>
        </div>
        <div className="pv-svc-d-share-notes">
          <p className="pv-svc-d-share-note"><i className="is-low" />Under 15%: a lot of room to grow</p>
          <p className="pv-svc-d-share-note"><i className="is-best" />25 to 40%: the best online shops</p>
        </div>
      </div>
    </figure>
  );
}

/* ── PPC: the reported return against the real one ─────────────────────── */

export function ReportGap() {
  const root = useRef<HTMLElement>(null);

  useDrawing(root, ({ gsap, q, el }) => {
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 60%", scrub: 0.5 },
    });
    tl.fromTo(q(".pv-svc-d-gap-col.is-claim i"), { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: "power1.out" }, 0)
      .fromTo(q(".pv-svc-d-gap-col.is-real i"), { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: "power1.out" }, 0.35)
      .fromTo(q(".pv-svc-d-gap-brace"), { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.35 }, 0.9)
      .fromTo(q(".pv-svc-d-gap-brace em"), { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.25 }, 1.2);
  });

  return (
    <figure className="pv-svc-d pv-svc-d-gap" ref={root}>
      <div className="pv-svc-d-card">
        <p className="pv-svc-d-card-head">Return on ad spend</p>
        <div className="pv-svc-d-gap-plot" aria-hidden="true">
          <div className="pv-svc-d-gap-col is-claim"><i /></div>
          <div className="pv-svc-d-gap-col is-real"><i /></div>
          <span className="pv-svc-d-gap-brace"><em>The gap</em></span>
        </div>
        <div className="pv-svc-d-gap-labels">
          <p>What the ad platform reports</p>
          <p>What your accounts show</p>
        </div>
      </div>
    </figure>
  );
}

/* ── Social: a set of post templates ───────────────────────────────────── */

const TEMPLATES = [
  { kind: "photo", name: "Photo post" },
  { kind: "words", name: "Announcement" },
  { kind: "film", name: "Short video" },
  { kind: "list", name: "Tips carousel" },
  { kind: "photo2", name: "Case study" },
  { kind: "event", name: "Event or date" },
];

export function TemplateGrid() {
  const root = useRef<HTMLElement>(null);

  useDrawing(root, ({ gsap, q, el }) => {
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 60%", scrub: 0.5 },
    });
    q(".pv-svc-d-tpl").forEach((t, i) => {
      tl.fromTo(t, { autoAlpha: 0, yPercent: 24, rotation: i % 2 ? 5 : -5 }, { autoAlpha: 1, yPercent: 0, rotation: 0, duration: 0.5, ease: "power2.out" }, i * 0.14)
        .fromTo(t.querySelectorAll(".pv-svc-d-tpl-art > *"), { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, stagger: 0.05, ease: "back.out(1.8)" }, i * 0.14 + 0.25);
    });
  });

  return (
    <figure className="pv-svc-d pv-svc-d-tpls" ref={root}>
      <div className="pv-svc-d-tpl-grid">
        {TEMPLATES.map((t) => (
          <div className={`pv-svc-d-tpl is-${t.kind}`} key={t.name}>
            <div className="pv-svc-d-tpl-art" aria-hidden="true">
              {t.kind === "photo" && <><u /><i /><i /></>}
              {t.kind === "photo2" && <><u /><b /><i /></>}
              {t.kind === "words" && <><i /><i /><i /></>}
              {t.kind === "film" && <><b /></>}
              {t.kind === "list" && <><i /><i /><i /><s /></>}
              {t.kind === "event" && <><b /><i /><i /></>}
            </div>
            <p className="pv-svc-d-tpl-foot"><span aria-hidden="true" />{t.name}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
