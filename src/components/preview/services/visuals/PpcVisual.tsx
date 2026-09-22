"use client";

import { useRef } from "react";
import { useSceneOnly } from "./useSceneOnly";

const RETURN = "M20 372 C 150 368, 230 352, 330 300 C 450 236, 560 150, 700 96 C 800 58, 900 40, 980 30";

/**
 * Spend against return, as a sketch. There are no axes and no numbers, because
 * it is a picture of the idea and makes no promise: the ink line is what goes
 * out, the blue line is what comes back, and the hatched gap is what we manage.
 */
export function PpcVisual({ still = false }: { still?: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useSceneOnly(root, ({ gsap, timeline }) => {
    const q = gsap.utils.selector(root.current!);
    gsap.set(q(".pv-svc-ppc-spend, .pv-svc-ppc-return"), { strokeDasharray: 1, strokeDashoffset: 1 });
    const notes = q(".pv-svc-ppc-note");
    gsap.set(notes, { autoAlpha: 0, y: 14 });

    const tl = timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: root.current, start: "top 85%", end: "center 40%", scrub: 0.5 },
    });
    tl.to(q(".pv-svc-ppc-spend"), { strokeDashoffset: 0, duration: 1 }, 0)
      .to(notes[0], { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, 0.3)
      .to(q(".pv-svc-ppc-return"), { strokeDashoffset: 0, duration: 2 }, 0.5)
      .to(notes[1], { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, 1.15)
      .fromTo(q(".pv-svc-ppc-cross"), { scale: 0 }, { scale: 1, duration: 0.25, ease: "back.out(2.4)" }, 1.15)
      .fromTo(q(".pv-svc-ppc-hatch"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3 }, 1.2)
      .to(notes[2], { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, 1.9)
      .to(notes[3], { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, 2.3);
  }, still);

  return (
    <div className="pv-svc-ppc" ref={root}>
      <div className="pv-svc-ppc-plot">
        <svg className="pv-svc-ppc-hatch" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <pattern id="pv-svc-hatch" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
              <line x1="0" y1="0" x2="0" y2="16" />
            </pattern>
            <clipPath id="pv-svc-gap">
              <path d="M330 300 C 450 236, 560 150, 700 96 C 800 58, 900 40, 980 30 L980 262 L330 300 Z" />
            </clipPath>
          </defs>
          <rect x="330" y="20" width="650" height="290" fill="url(#pv-svc-hatch)" clipPath="url(#pv-svc-gap)" />
        </svg>
        <svg className="pv-svc-ppc-lines" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true">
          <path className="pv-svc-ppc-spend" pathLength={1} d="M20 318 L980 262" />
          <path className="pv-svc-ppc-return pv-svc-ppc-return--dry" pathLength={1} d={RETURN} transform="translate(2 5)" />
          <path className="pv-svc-ppc-return" pathLength={1} d={RETURN} />
        </svg>
        <span className="pv-svc-ppc-cross" aria-hidden="true" />
        <p className="pv-svc-ppc-note pv-svc-ppc-note--spend">What you spend</p>
        <p className="pv-svc-ppc-note pv-svc-ppc-note--cross">The first results usually show in weeks 2 to 4</p>
        <p className="pv-svc-ppc-note pv-svc-ppc-note--gap">This gap is what we manage, measured against your margins</p>
        <p className="pv-svc-ppc-note pv-svc-ppc-note--return">What comes back</p>
      </div>
      <p className="pv-svc-visual-caption">
        An illustration of spend and return, with no real figures. Realistic returns depend on your category, and
        we benchmark them before you spend anything.
      </p>
    </div>
  );
}
