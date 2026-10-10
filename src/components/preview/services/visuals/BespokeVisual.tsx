"use client";

import { useRef } from "react";
import { Screen } from "../bespoke/Screen";
import { useSceneOnly } from "./useSceneOnly";

/** A redrawn screen of the Fun Cases hub, stood up on the desk as the page loads or scrolls in. */
export function BespokeVisual({ still = false }: { still?: boolean }) {
  const root = useRef<HTMLElement>(null);

  useSceneOnly(root, ({ gsap, inHero, timeline }) => {
    const q = gsap.utils.selector(root.current!);
    if (inHero) {
      timeline({})
        .fromTo(q(".pv-bsp-tilt"), { rotationX: 16, yPercent: 8, scale: 0.94 },
          { rotationX: 0, yPercent: 0, scale: 1, duration: 1.2, ease: "power2.out" }, 0);
      return;
    }
    gsap.fromTo(q(".pv-bsp-tilt"), { rotationX: 16, yPercent: 8, scale: 0.94 }, {
      rotationX: 0, yPercent: 0, scale: 1, ease: "none",
      scrollTrigger: { trigger: root.current, start: "top 95%", end: "top 30%", scrub: 0.5 },
    });
  }, still);

  return (
    <figure className="pv-bsp-figure" ref={root}>
      <div className="pv-bsp-persp">
        <div className="pv-bsp-tilt">
          <Screen name="fc-stock-planning" decorative />
        </div>
      </div>
    </figure>
  );
}
