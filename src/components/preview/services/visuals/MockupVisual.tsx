"use client";

import { useRef } from "react";
import { Mockup, type MockupName } from "@/components/mockups";
import { useSceneOnly } from "./useSceneOnly";

/** One of the live product mockups, framed as a screen on the desk and tilted upright as it scrolls in. */
export function MockupVisual({ name, still = false }: { name: MockupName; still?: boolean }) {
  const root = useRef<HTMLElement>(null);

  useSceneOnly(root, ({ gsap, inHero, timeline }) => {
    const q = gsap.utils.selector(root.current!);
    if (inHero) {
      // Already on screen, so it stands up as the page loads.
      timeline({})
        .fromTo(q(".pv-svc-demo-tilt"), { rotationX: 16, yPercent: 8, scale: 0.94 },
          { rotationX: 0, yPercent: 0, scale: 1, duration: 1.2, ease: "power2.out" }, 0);
      return;
    }
    gsap.fromTo(q(".pv-svc-demo-tilt"), { rotationX: 16, yPercent: 8, scale: 0.94 }, {
      rotationX: 0, yPercent: 0, scale: 1, ease: "none",
      scrollTrigger: { trigger: root.current, start: "top 95%", end: "top 30%", scrub: 0.5 },
    });
  }, still);

  return (
    <figure className="pv-svc-demo" ref={root}>
      <div className="pv-svc-demo-persp">
        <div className="pv-svc-demo-tilt">
          <div className="pv-svc-demo-screen" aria-hidden="true">
            <Mockup name={name} />
          </div>
        </div>
      </div>
    </figure>
  );
}
