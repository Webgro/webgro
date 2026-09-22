"use client";

import { Fragment, useRef } from "react";
import { BrushStroke } from "./Brush";
import { letter } from "./content";
import { useGsap } from "./useGsap";

const HIGHLIGHT = "years.";

export function Letter() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    const words = q(".pv-letter-word");
    gsap.set(words, { opacity: 0.13 });
    gsap.to(words, {
      opacity: 1, ease: "none", stagger: 0.1,
      scrollTrigger: { trigger: q(".pv-letter-text")[0], start: "top 78%", end: "bottom 52%", scrub: 0.4 },
    });
    gsap.fromTo(q(".pv-letter-brush"), { clipPath: "inset(0% 100% 0% 0%)" }, {
      clipPath: "inset(0% 0% 0% 0%)", ease: "none",
      scrollTrigger: { trigger: q(".pv-brushed")[0], start: "top 62%", end: "top 48%", scrub: 0.4 },
    });
    gsap.from(q(".pv-letter-sign > *"), {
      y: 24, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.12,
      scrollTrigger: { trigger: q(".pv-letter-sign")[0], start: "top 85%" },
    });
  });

  return (
    <section className="pv-letter" ref={root} data-pv-theme="paper">
      <p className="pv-label">About Webgro</p>
      <p className="pv-letter-text">
        {letter.split(" ").map((w, i) =>
          w === HIGHLIGHT ? (
            <Fragment key={i}>
              <span className="pv-letter-word pv-brushed">
                {w}
                <BrushStroke className="pv-letter-brush" />
              </span>{" "}
            </Fragment>
          ) : (
            <span className="pv-letter-word" key={i}>{w} </span>
          ),
        )}
      </p>
      <div className="pv-letter-sign">
        <p>Michael and Lily</p>
        <p>Co-founders, Webgro</p>
      </div>
    </section>
  );
}
