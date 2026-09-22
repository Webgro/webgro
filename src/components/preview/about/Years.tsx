"use client";

import { useRef } from "react";
import { BrushStroke } from "../Brush";
import { SCENE_QUERY, STATIC_QUERY, useGsap } from "../useGsap";
import { FOUNDED, NOW_YEAR, milestones } from "./content";

const SPAN = NOW_YEAR - FOUNDED;
const YEARS = Array.from({ length: SPAN + 1 }, (_, i) => FOUNDED + i);
/** Years that get a printed label on the track. */
const LABELLED = new Set(milestones.map((m) => m.year));
/** Too close to its neighbours to print on a phone. */
const TIGHT = new Set([2021]);

/** The decade digit only changes once, as 2019 rolls into 2020. */
const TENS = [Math.floor((FOUNDED % 100) / 10), Math.floor((NOW_YEAR % 100) / 10)];
const TENS_FLIP = Math.floor(NOW_YEAR / 10) * 10;

export function Years() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap, ScrollTrigger }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add(SCENE_QUERY, () => {
      el.classList.add("is-scene");
      const stage = q(".pv-about-years-stage")[0] as HTMLElement;
      const cards = q(".pv-about-mile-inner");
      const units = q(".pv-about-year-units")[0];
      const tens = q(".pv-about-year-tens")[0];
      const brush = q(".pv-about-years-brush")[0];
      const ticks = q(".pv-about-tick");

      const state = { y: FOUNDED };
      let lit = -1;
      const render = () => {
        const done = state.y - FOUNDED;
        gsap.set(units, { yPercent: (-done / YEARS.length) * 100 });
        gsap.set(tens, { yPercent: -50 * Math.min(1, Math.max(0, state.y - (TENS_FLIP - 1))) });
        gsap.set(brush, { clipPath: `inset(0% ${(100 - (done / SPAN) * 100).toFixed(2)}% 0% 0%)` });
        const reached = Math.floor(done + 0.02);
        if (reached !== lit) {
          lit = reached;
          ticks.forEach((t, i) => t.classList.toggle("is-on", i <= reached));
        }
      };

      gsap.set(cards.slice(1), { autoAlpha: 0, x: 90 });
      render();

      const tl = gsap.timeline({ paused: true, onUpdate: render });

      // Each card leaves, the counter rolls on to its year, then the next card
      // arrives. Two cards can share a year (2022), in which case the counter
      // holds still and the cards swap.
      let t = 0.8;
      milestones.forEach((m, i) => {
        if (i === 0) return;
        const gap = m.year - milestones[i - 1].year;
        const roll = gap ? 0.5 + 0.2 * gap : 0;
        const rollAt = t + 0.2;
        const inAt = Math.max(t + 0.5, rollAt + roll - 0.45);
        tl.to(cards[i - 1], { autoAlpha: 0, x: -70, duration: 0.5, ease: "power2.in" }, t);
        if (roll) tl.to(state, { y: m.year, duration: roll, ease: "power1.inOut" }, rollAt);
        tl.to(cards[i], { autoAlpha: 1, x: 0, duration: 0.6, ease: "power2.out" }, inAt);
        t = Math.max(inAt + 0.6, rollAt + roll) + 1;
      });
      tl.to({}, { duration: 0.5 });

      // The pin length follows the timeline, so adding or removing a milestone
      // keeps the same amount of scroll per card.
      ScrollTrigger.create({
        animation: tl,
        trigger: stage,
        start: "top top",
        end: `+=${Math.round(tl.duration() * 32.5)}%`,
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
      });

      return () => {
        el.classList.remove("is-scene");
        ticks.forEach((tick) => tick.classList.remove("is-on"));
      };
    });

    mm.add(STATIC_QUERY, () => {
      q(".pv-about-mile").forEach((row) => {
        gsap.from(row, {
          autoAlpha: 0, y: 24, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 90%" },
        });
      });
    });

    return () => mm.revert();
  });

  return (
    <section className="pv-about-years" ref={root} data-pv-theme="ink">
      <div className="pv-about-years-stage">
        <div className="pv-about-years-head">
          <h2 className="pv-about-years-title">Our history</h2>
          <p className="pv-about-years-note">In business since 2012. Five awards since 2020.</p>
        </div>

        <p className="pv-about-year" aria-hidden="true">
          <span>2</span>
          <span>0</span>
          <span className="pv-about-year-col">
            <span className="pv-about-year-strip pv-about-year-tens">
              {TENS.map((d) => <span key={d}>{d}</span>)}
            </span>
          </span>
          <span className="pv-about-year-col">
            <span className="pv-about-year-strip pv-about-year-units">
              {YEARS.map((y) => <span key={y}>{y % 10}</span>)}
            </span>
          </span>
        </p>

        <ol className="pv-about-miles">
          {milestones.map((m, i) => (
            <li className="pv-about-mile" key={`${m.year}-${i}`}>
              <div className="pv-about-mile-inner">
                <p className="pv-about-mile-year">{m.yearLabel}</p>
                <h3 className="pv-about-mile-title">{m.title}</h3>
                <p className="pv-about-mile-body">{m.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="pv-about-track" aria-hidden="true">
          <span className="pv-about-track-rule" />
          <BrushStroke className="pv-about-years-brush" />
          {YEARS.map((y, i) => (
            <span
              className={`pv-about-tick${LABELLED.has(y) ? " is-labelled" : ""}${TIGHT.has(y) ? " is-tight" : ""}${i === 0 ? " is-first" : ""}${i === SPAN ? " is-last" : ""}`}
              style={{ left: `${(i / SPAN) * 100}%` }}
              data-year={y}
              key={y}
            >
              {LABELLED.has(y) ? <em>{y}</em> : null}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
