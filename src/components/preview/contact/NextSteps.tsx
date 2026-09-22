"use client";

import { useRef } from "react";
import { BrushStroke } from "../Brush";
import { SCENE_QUERY, useGsap } from "../useGsap";
import { proposalRows, steps } from "./content";

/**
 * What happens after you press send. Pinned scene: one brushed line is painted
 * from stop to stop while the brief rides its tip, picks up our reply, turns
 * into the written proposal and gets signed at kickoff. Without the scene
 * (reduced motion, or before scripts) it is a plain ordered list.
 */
export function NextSteps() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap, ScrollTrigger }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add(SCENE_QUERY, () => {
      el.classList.add("is-scene");
      const stage = q(".pv-contact-steps-stage")[0] as HTMLElement;
      const rail = q(".pv-contact-rail")[0] as HTMLElement;
      const rider = q(".pv-contact-rider")[0];
      const sheet = q(".pv-contact-sheet--main")[0];
      const reply = q(".pv-contact-sheet--reply")[0];
      const brush = q(".pv-contact-rail-brush")[0];
      const items = q(".pv-contact-step");
      const dots = q(".pv-contact-node i");
      const names = q(".pv-contact-node em");
      const last = steps.length - 1;

      let railW = rail.offsetWidth;
      const measure = () => { railW = rail.offsetWidth; };

      const parts = (item: Element) => ({
        when: item.querySelector(".pv-contact-step-when"),
        title: item.querySelector(".pv-contact-step-mask > *"),
        body: item.querySelector(".pv-contact-step-body"),
      });

      // Opacity rather than visibility, so every step stays readable to
      // assistive tech while only one is on show.
      items.forEach((item, i) => {
        if (!i) return;
        const p = parts(item);
        gsap.set([p.when, p.body], { opacity: 0, y: 18 });
        gsap.set(p.title, { yPercent: 105 });
      });
      gsap.set(brush, { clipPath: "inset(0% 100% 0% 0%)" });
      gsap.set(dots, { scale: 0 });
      gsap.set(names, { opacity: 0.62 });
      gsap.set(rider, { x: 0 });
      gsap.set(sheet, { rotate: -3 });
      gsap.set(q(".pv-contact-sheet-brief i"), { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(reply, { autoAlpha: 0, xPercent: -30, yPercent: 12, rotate: -16 });
      gsap.set(q(".pv-contact-sheet-proposal"), { autoAlpha: 0 });
      gsap.set(q(".pv-contact-sheet-proposal > *"), { opacity: 0, y: 6 });
      gsap.set(q(".pv-contact-sheet-sign"), { clipPath: "inset(0% 100% 0% 0%)" });

      gsap.from(q(".pv-contact-steps-head > *"), {
        y: 36, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 70%" },
      });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=320%",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: measure,
        },
      });

      // Stop one: the brief gets written.
      tl.to(dots[0], { scale: 1, duration: 0.25, ease: "back.out(2.4)" }, 0)
        .to(names[0], { opacity: 1, duration: 0.25 }, 0)
        .to(q(".pv-contact-sheet-brief i"), { scaleX: 1, duration: 0.3, stagger: 0.06, ease: "power2.out" }, 0.05);

      for (let i = 1; i <= last; i++) {
        const t = i - 0.4;
        const prev = parts(items[i - 1]);
        const next = parts(items[i]);
        const clipRight = Math.max(0, 100 - (i / last) * 100);

        tl.to([prev.when, prev.body], { opacity: 0, y: -16, duration: 0.22, ease: "power2.in" }, t - 0.06)
          .to(prev.title, { yPercent: -105, duration: 0.26, ease: "power2.in" }, t - 0.06)
          .to(brush, { clipPath: `inset(0% ${clipRight}% 0% 0%)`, duration: 0.42, ease: "power1.inOut" }, t)
          .to(rider, { x: () => (railW * i) / last, duration: 0.42, ease: "power1.inOut" }, t)
          .to(sheet, { rotate: 5, duration: 0.2, ease: "power1.out" }, t)
          .to(sheet, { rotate: -3, duration: 0.26, ease: "power1.inOut" }, t + 0.2)
          .to(next.title, { yPercent: 0, duration: 0.42, ease: "power3.out" }, t + 0.22)
          .to([next.when, next.body], { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.06 }, t + 0.24)
          .to(dots[i], { scale: 1, duration: 0.25, ease: "back.out(2.4)" }, t + 0.38)
          .to(names[i], { opacity: 1, duration: 0.25 }, t + 0.38);
      }

      // Stop two: our reply tucks in behind the brief.
      tl.to(reply, { autoAlpha: 1, xPercent: 0, yPercent: 0, rotate: -10, duration: 0.4, ease: "power3.out" }, 1.05)
        // Stop three: the two become one written proposal.
        .to(reply, { autoAlpha: 0, yPercent: 10, duration: 0.22, ease: "power2.in" }, 2.02)
        .to(q(".pv-contact-sheet-brief"), { autoAlpha: 0, duration: 0.2 }, 2.05)
        .to(q(".pv-contact-sheet-proposal"), { autoAlpha: 1, duration: 0.2 }, 2.18)
        .to(q(".pv-contact-sheet-proposal > *"), { opacity: 1, y: 0, duration: 0.25, stagger: 0.07, ease: "power2.out" }, 2.2)
        // Stop four: signed, and we get started.
        .to(q(".pv-contact-sheet-sign"), { clipPath: "inset(0% 0% 0% 0%)", duration: 0.4, ease: "power2.out" }, 3.08)
        .to({}, { duration: 0.45 });

      return () => el.classList.remove("is-scene");
    });

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  });

  return (
    <section className="pv-contact-steps" ref={root} data-pv-theme="ink">
      <div className="pv-contact-steps-stage">
        <div className="pv-contact-steps-head">
          <h2 className="pv-h2">What happens next</h2>
          <p className="pv-lede">
            Most enquiries go from the first email to a signed proposal in about five working days, and the
            project usually starts the week after that.
          </p>
        </div>

        <ol className="pv-contact-steps-list">
          {steps.map((s) => (
            <li className="pv-contact-step" key={s.node}>
              <p className="pv-label pv-contact-step-when">{s.when}</p>
              <div className="pv-contact-step-mask"><h3 className="pv-h3">{s.heading}</h3></div>
              <p className="pv-contact-step-body">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="pv-contact-rail" aria-hidden="true">
          <div className="pv-contact-rider">
            <div className="pv-contact-sheet pv-contact-sheet--reply"><i /><i /><i /></div>
            <div className="pv-contact-sheet pv-contact-sheet--main">
              <div className="pv-contact-sheet-brief"><i /><i /><i /><i /><i /></div>
              <div className="pv-contact-sheet-proposal">
                <b>Proposal</b>
                {proposalRows.map((r) => (
                  <span key={r}>{r}<i /></span>
                ))}
              </div>
              <BrushStroke className="pv-contact-sheet-sign" />
            </div>
          </div>
          <span className="pv-contact-rail-line" />
          <BrushStroke className="pv-contact-rail-brush" />
          {steps.map((s, i) => (
            <span className="pv-contact-node" key={s.node} style={{ left: `${(i / (steps.length - 1)) * 100}%` }}>
              <i />
              <em>{s.node}</em>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
