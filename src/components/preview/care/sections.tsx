"use client";

import Link from "next/link";
import { useRef } from "react";
import { pv } from "../links";
import { BrushedTitle } from "../services/sections";
import { SCENE_QUERY, useGsap } from "../useGsap";
import { careForYou, careSteps } from "./content";
import { HealthPanel } from "./HealthPanel";
import { Tick } from "./Plans";

/* ── Hero ───────────────────────────────────────────────────────────────── */

/** Uses the service pages' hero classes, so the lines rise in with CSS and nothing shifts after load. */
export function CareHero() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      gsap.fromTo(q(".pv-care-hero-brush"), { clipPath: "inset(0% 100% 0% 0%)" }, {
        clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, delay: 0.9, ease: "power3.out",
      });
    });
    return () => mm.revert();
  });

  return (
    <section className="pv-svc-hero pv-care-hero" ref={root} data-pv-theme="paper">
      <div className="pv-care-hero-copy">
        <p className="pv-svc-crumbs">
          <Link href={pv("/services")} className="pv-care-hit" data-cursor>All services</Link>
          <span aria-hidden="true">/</span>
          <span>Care plans</span>
        </p>
        <h1 className="pv-h1 pv-svc-h1">
          <BrushedTitle
            lines={["Website care plans", "for Shopify", "and WordPress"]}
            brush="care plans"
            brushClass="pv-care-hero-brush"
          />
        </h1>
        <div className="pv-svc-hero-row">
          <p className="pv-svc-hero-intro">
            We look after Shopify and WordPress sites for a fixed monthly fee. Every plan covers updates, backups and
            monitoring, plus a set amount of time each month for changes. Plans start at £80 a month and run month to
            month.
          </p>
          <div className="pv-svc-hero-actions">
            <a href="#plans" className="pv-btn" data-cursor><span>See the plans</span></a>
            <Link href={pv("/contact")} className="pv-textlink pv-care-hit" data-cursor>Get in touch</Link>
          </div>
        </div>
      </div>
      <HealthPanel />
    </section>
  );
}

/* ── How a care plan works ──────────────────────────────────────────────── */

export function CareSteps() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      gsap.from(q(".pv-care-steps-head > *"), {
        yPercent: 40, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 75%" },
      });
      q(".pv-care-step").forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 86%" } });
        tl.from(row.querySelector(".pv-care-step-rule"), { scaleX: 0, duration: 1.1, ease: "power3.inOut" })
          .from(row.querySelector(".pv-care-step-num > span"), { yPercent: 110, duration: 0.9, ease: "power3.out" }, 0.1)
          .from(row.querySelector("h3 > span > span"), { yPercent: 110, duration: 0.9, ease: "power3.out" }, 0.18)
          .from(row.querySelector("p"), { y: 20, autoAlpha: 0, duration: 0.8, ease: "power3.out" }, 0.32);
      });
      // The blue rule down the left side fills as you read through the steps.
      gsap.fromTo(q(".pv-care-steps-progress"), { scaleY: 0 }, {
        scaleY: 1, ease: "none",
        scrollTrigger: { trigger: q(".pv-care-steps-track")[0], start: "top 65%", end: "bottom 65%", scrub: 0.4 },
      });
    });
    return () => mm.revert();
  });

  return (
    <section className="pv-care-steps" ref={root} data-pv-theme="ink">
      <div className="pv-care-steps-head">
        <p className="pv-label">How it works</p>
        <h2 className="pv-h2">What happens each month</h2>
      </div>
      <div className="pv-care-steps-track">
        <span className="pv-care-steps-progress" aria-hidden="true" />
        <ol className="pv-care-steps-list">
        {careSteps.map((s, i) => (
          <li className="pv-care-step" key={s.name}>
            <span className="pv-care-step-rule" aria-hidden="true" />
            <span className="pv-care-step-num" aria-hidden="true"><span>{String(i + 1).padStart(2, "0")}</span></span>
            <div>
              <h3><span className="pv-line"><span>{s.name}</span></span></h3>
              <p>{s.body}</p>
            </div>
          </li>
        ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Who care plans are for ─────────────────────────────────────────────── */

export function CareForYou() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      gsap.from(q(".pv-care-you-head > *"), {
        yPercent: 40, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 75%" },
      });
      // Same reading-line reveal as the service pages: each line lights up and gets its tick.
      q(".pv-care-you-item").forEach((item) => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: item, start: "top 82%", end: "top 55%", scrub: 0.4 },
        });
        tl.fromTo(item.querySelector("p"), { opacity: 0.16 }, { opacity: 1, duration: 1 }, 0)
          .fromTo(item.querySelector(".pv-care-tick path"), { strokeDasharray: 1, strokeDashoffset: 1 }, {
            strokeDashoffset: 0, duration: 0.6,
          }, 0.4);
      });
    });
    return () => mm.revert();
  });

  return (
    <section className="pv-care-you" ref={root} data-pv-theme="paper">
      <div className="pv-care-you-head">
        <p className="pv-label">Who it&rsquo;s for</p>
        <h2 className="pv-h3">{careForYou.heading}</h2>
      </div>
      <div className="pv-care-you-body">
        <ul className="pv-care-you-list">
          {careForYou.yes.map((y) => (
            <li className="pv-care-you-item" key={y}>
              <Tick />
              <p>{y}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
