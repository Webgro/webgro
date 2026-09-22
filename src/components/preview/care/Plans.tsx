"use client";

import Link from "next/link";
import { useRef } from "react";
import { pv } from "../links";
import { SCENE_QUERY, useGsap } from "../useGsap";
import { careForYou, carePlans, HOURLY_RATE } from "./content";

export function Tick({ className = "pv-care-tick" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <path pathLength={1} d="M6 22 C 10 25, 13 29, 16 34 C 21 22, 27 13, 36 5" />
    </svg>
  );
}

/**
 * The signature scene. The three cards rise at different speeds as the section
 * scrolls in (scrubbed), then each one is uncovered from the bottom edge. The
 * name and price climb out of their masks, and the ticks draw down the list. On
 * the Growth card a blue dome rises from the bottom and fills it, the same shape
 * as the closing section. Phones get the same scene, card by card.
 */
export function Plans() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add({ scene: SCENE_QUERY, wide: "(min-width: 900px)" }, (ctx) => {
      if (!ctx.conditions?.scene) return;
      const wide = Boolean(ctx.conditions.wide);
      const cards = q(".pv-care-plan") as HTMLElement[];

      gsap.from(q(".pv-care-plans-head .pv-line > span"), {
        yPercent: 110, duration: 1.05, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 72%" },
      });
      gsap.from(q(".pv-care-plans-fade"), {
        y: 26, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.15,
        scrollTrigger: { trigger: el, start: "top 72%" },
      });

      // Scrubbed rise. Side by side, the outer cards travel further than the
      // middle one so the row settles unevenly and lands flat. Stacked, each card
      // rises on its own.
      if (wide) {
        const grid = q(".pv-care-plans-grid")[0];
        const travel = [0.2, 0.1, 0.28];
        cards.forEach((card, i) => {
          gsap.fromTo(card, { y: () => window.innerHeight * travel[i] }, {
            y: 0, ease: "none",
            scrollTrigger: { trigger: grid, start: "top bottom", end: "top 30%", scrub: 0.6, invalidateOnRefresh: true },
          });
        });
      } else {
        cards.forEach((card) => {
          gsap.fromTo(card, { y: () => window.innerHeight * 0.12 }, {
            y: 0, ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "top 55%", scrub: 0.6, invalidateOnRefresh: true },
          });
        });
      }

      cards.forEach((card, i) => {
        const shell = card.querySelector(".pv-care-card");
        const fill = card.querySelector(".pv-care-card-fill");
        const rise = card.querySelectorAll(".pv-care-mask > span");
        const fade = card.querySelectorAll(".pv-care-card-fade");
        const facts = card.querySelectorAll(".pv-care-fact");
        const ticks = card.querySelectorAll(".pv-care-tick path");
        const items = card.querySelectorAll(".pv-care-inc li span");

        const tl = gsap.timeline({
          delay: wide ? i * 0.12 : 0,
          scrollTrigger: { trigger: wide ? q(".pv-care-plans-grid")[0] : card, start: wide ? "top 62%" : "top 80%" },
        });
        tl.fromTo(shell, { clipPath: "inset(100% 0% 0% 0% round 22px)" }, {
          clipPath: "inset(0% 0% 0% 0% round 22px)", duration: 1.1, ease: "power4.inOut",
        });
        if (fill) {
          tl.fromTo(fill, { clipPath: "circle(0% at 50% 100%)" }, {
            clipPath: "circle(150% at 50% 100%)", duration: 1.2, ease: "power3.inOut",
          }, 0.45);
        }
        tl.from(rise, { yPercent: 110, duration: 0.9, ease: "power3.out", stagger: 0.07 }, 0.55)
          .from(fade, { y: 18, autoAlpha: 0, duration: 0.8, ease: "power3.out", stagger: 0.06 }, 0.75)
          .from(facts, { y: 16, autoAlpha: 0, duration: 0.7, ease: "power3.out", stagger: 0.06 }, 0.8)
          .fromTo(ticks, { strokeDasharray: 1, strokeDashoffset: 1 }, {
            strokeDashoffset: 0, duration: 0.5, ease: "power2.out", stagger: 0.07,
          }, 1)
          .from(items, { autoAlpha: 0, x: -10, duration: 0.6, ease: "power3.out", stagger: 0.07 }, 1);
      });

      gsap.from(q(".pv-care-plans-note > *"), {
        y: 22, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: q(".pv-care-plans-note")[0], start: "top 90%" },
      });
    });

    return () => mm.revert();
  });

  return (
    <section className="pv-care-plans" id="plans" ref={root} data-pv-theme="ink">
      <div className="pv-care-plans-head">
        <p className="pv-label pv-care-plans-fade">Plans and prices</p>
        <h2 className="pv-h2">
          <span className="pv-line"><span>Three care plans</span></span>
        </h2>
        <p className="pv-lede pv-care-plans-fade">
          Prices are per month. Each plan includes everything in the plan before it, and they all run month to
          month.
        </p>
      </div>

      <ul className="pv-care-plans-grid">
        {carePlans.map((plan) => (
          <li className={`pv-care-plan${plan.featured ? " is-featured" : ""}`} key={plan.id}>
            <article className="pv-care-card" aria-labelledby={`pv-care-${plan.id}`}>
              {plan.featured && <span className="pv-care-card-fill" aria-hidden="true" />}
              <div className="pv-care-card-body">
                <h3 className="pv-care-plan-name" id={`pv-care-${plan.id}`}>
                  <span className="pv-care-mask"><span>{plan.name}</span></span>
                </h3>
                <p className="pv-care-price">
                  <span className="pv-care-mask">
                    <span><strong>£{plan.price}</strong> a month</span>
                  </span>
                </p>
                <p className="pv-care-plan-for pv-care-card-fade">{plan.for}</p>

                <dl className="pv-care-facts">
                  {plan.facts.map((f) => (
                    <div className="pv-care-fact" key={f.label}>
                      <dt>{f.label}</dt>
                      <dd>{f.value}</dd>
                    </div>
                  ))}
                </dl>

                <p className="pv-care-inc-label pv-care-card-fade">{plan.includesLabel}</p>
                <ul className="pv-care-inc">
                  {plan.includes.map((item) => (
                    <li key={item}>
                      <Tick />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pv-care-card-cta pv-care-card-fade">
                  <Link
                    href={pv("/contact")}
                    className={`pv-btn${plan.featured ? " pv-btn--white" : " pv-btn--light"}`}
                    aria-label={`Get in touch about the ${plan.name} plan`}
                    data-cursor
                  >
                    <span>Get in touch</span>
                  </Link>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <div className="pv-care-plans-note">
        <p>
          Unused time doesn&rsquo;t roll over to the next month. Work beyond your plan&rsquo;s time is charged at
          £{HOURLY_RATE} an hour, and we&rsquo;ll check with you first.
        </p>
        <p>
          {careForYou.larger}{" "}
          <Link href={pv("/contact")} className="pv-textlink pv-care-hit" data-cursor>Get in touch about a larger retainer</Link>
        </p>
      </div>
    </section>
  );
}
