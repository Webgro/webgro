"use client";

import Link from "next/link";
import { useRef } from "react";
import { BrushStroke } from "./Brush";
import { pv } from "./links";
import { SCENE_QUERY, useGsap } from "./useGsap";

export function Closing() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add(SCENE_QUERY, () => {
      // The fill reaches one screen above the section (see .is-scene in the CSS), so
      // the circle can rise over the content before it and stay round the whole way.
      // Its centre stays pinned to the bottom edge of the screen while it grows, so
      // it reads as a dome rising from the bottom until it covers everything.
      el.classList.add("is-scene");
      const fill = q(".pv-closing-fill")[0] as HTMLElement;
      const grow = { p: 0 };
      const draw = () => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const top = el.getBoundingClientRect().top;
        const cy = vh + (vh - Math.max(0, Math.min(vh, top)));
        const full = Math.hypot(vw / 2, Math.max(vh, el.offsetHeight)) * 1.03;
        const r = full * grow.p * grow.p;
        fill.style.clipPath = `circle(${r.toFixed(1)}px at 50% ${cy.toFixed(1)}px)`;
      };
      draw();
      gsap.to(grow, {
        p: 1, ease: "none", onUpdate: draw,
        scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: 0.5, onRefresh: draw },
      });

      // The copy arrives once the blue has covered the screen behind it.
      gsap.from(q(".pv-closing .pv-line > span"), {
        yPercent: 110, duration: 1.1, ease: "power3.out", stagger: 0.09,
        scrollTrigger: { trigger: el, start: "top 12%" },
      });
      gsap.fromTo(q(".pv-closing-brush"), { clipPath: "inset(0% 100% 0% 0%)" }, {
        clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.out", delay: 0.35,
        scrollTrigger: { trigger: el, start: "top 12%" },
      });
      gsap.from(q(".pv-closing-foot > *"), {
        y: 30, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.25,
        scrollTrigger: { trigger: el, start: "top 12%" },
      });

      return () => {
        el.classList.remove("is-scene");
        fill.style.clipPath = "";
      };
    });

    return () => mm.revert();
  });

  return (
    <section className="pv-closing" ref={root} data-pv-theme="blue" id="contact">
      <div className="pv-closing-fill" aria-hidden="true" />
      <div className="pv-closing-inner">
        <h2 className="pv-closing-title">
          <span className="pv-line"><span>Tell us about</span></span>
          <span className="pv-line"><span>
            <span className="pv-brushed">your project.<BrushStroke className="pv-closing-brush" /></span>
          </span></span>
        </h2>
        <div className="pv-closing-foot">
          <Link href={pv("/contact")} className="pv-btn pv-btn--white" data-cursor><span>Get in touch</span></Link>
          <p>
            You can also email <a href="mailto:hello@webgro.co.uk" data-cursor>hello@webgro.co.uk</a>{" "}or call{" "}
            <a href="tel:+441344231119" data-cursor>01344 231 119</a>. We reply within one working day.
          </p>
        </div>
      </div>
    </section>
  );
}
