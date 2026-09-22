"use client";

import { useRef } from "react";
import { useSceneOnly } from "./useSceneOnly";

/**
 * A specimen sheet of this site's own system, used as the example: three
 * colours, one typeface, one button and one easing curve. The measurements on
 * the button are its real padding.
 */
export function SpecimenVisual({ still = false }: { still?: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useSceneOnly(root, ({ gsap, timeline }) => {
    const q = gsap.utils.selector(root.current!);
    gsap.set(q(".pv-svc-spec-curve"), { strokeDasharray: 1, strokeDashoffset: 1 });
    const tl = timeline({
      defaults: { ease: "power2.out" },
      scrollTrigger: { trigger: root.current, start: "top 88%", end: "top 22%", scrub: 0.5 },
    });
    tl.fromTo(q(".pv-svc-spec-cell"), { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, stagger: 0.35 }, 0)
      .fromTo(q(".pv-svc-spec-swatch"), { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5, stagger: 0.12, ease: "back.out(1.8)" }, 0.3)
      .fromTo(q(".pv-svc-spec-aa"), { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.7 }, 0.7)
      .fromTo(q(".pv-svc-spec-dim"), { scaleX: 0 }, { scaleX: 1, duration: 0.5, stagger: 0.15 }, 1.3)
      .to(q(".pv-svc-spec-curve"), { strokeDashoffset: 0, duration: 0.9, ease: "none" }, 1.5)
      .fromTo(q(".pv-svc-spec-ball"), { xPercent: 0 }, { xPercent: 100, duration: 0.9, ease: "none" }, 1.5);
  }, still);

  return (
    <div className="pv-svc-spec" ref={root}>
      <div className="pv-svc-spec-board">
        <div className="pv-svc-spec-cell">
          <p className="pv-svc-spec-tag">Colour</p>
          <div className="pv-svc-spec-swatches">
            <span className="pv-svc-spec-swatch pv-svc-spec-swatch--paper"><em>Paper</em></span>
            <span className="pv-svc-spec-swatch pv-svc-spec-swatch--ink"><em>Ink</em></span>
            <span className="pv-svc-spec-swatch pv-svc-spec-swatch--blue"><em>Blue</em></span>
          </div>
        </div>
        <div className="pv-svc-spec-cell">
          <p className="pv-svc-spec-tag">Type</p>
          <p className="pv-svc-spec-aa">Aa</p>
          <p className="pv-svc-spec-small">Satoshi, in two weights</p>
        </div>
        <div className="pv-svc-spec-cell">
          <p className="pv-svc-spec-tag">Component</p>
          <div className="pv-svc-spec-btnwrap">
            <span className="pv-svc-spec-dim pv-svc-spec-dim--x" aria-hidden="true"><em>1.75em</em></span>
            <span className="pv-svc-spec-btn">Start a project</span>
            <span className="pv-svc-spec-dim pv-svc-spec-dim--w" aria-hidden="true"><em>fully rounded</em></span>
          </div>
        </div>
        <div className="pv-svc-spec-cell">
          <p className="pv-svc-spec-tag">Motion</p>
          <svg viewBox="0 0 120 70" preserveAspectRatio="none" aria-hidden="true">
            <path className="pv-svc-spec-axis" d="M2 68 H118 M2 68 V2" />
            <path className="pv-svc-spec-curve" pathLength={1} d="M2 68 C 25 15, 25 2, 118 2" />
          </svg>
          <span className="pv-svc-spec-rail" aria-hidden="true"><i className="pv-svc-spec-ball" /></span>
          <p className="pv-svc-spec-small">One easing curve, used everywhere</p>
        </div>
      </div>
    </div>
  );
}
