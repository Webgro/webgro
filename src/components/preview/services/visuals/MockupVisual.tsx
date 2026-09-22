"use client";

import { useRef } from "react";
import { Mockup, type MockupName } from "@/components/mockups";
import { useSceneOnly } from "./useSceneOnly";

/** One of the live product mockups, framed as a screen on the desk and tilted upright as it scrolls in. */
export function MockupVisual({ name, caption, still = false }: { name: MockupName; caption: string; still?: boolean }) {
  const root = useRef<HTMLElement>(null);

  useSceneOnly(root, ({ gsap, inHero, timeline }) => {
    const q = gsap.utils.selector(root.current!);
    if (inHero) {
      // Already on screen, so it stands up as the page loads.
      timeline({})
        .fromTo(q(".pv-svc-demo-tilt"), { rotationX: 16, yPercent: 8, scale: 0.94 },
          { rotationX: 0, yPercent: 0, scale: 1, duration: 1.2, ease: "power2.out" }, 0)
        .fromTo(q(".pv-svc-visual-caption"), { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.8);
      return;
    }
    gsap.fromTo(q(".pv-svc-demo-tilt"), { rotationX: 16, yPercent: 8, scale: 0.94 }, {
      rotationX: 0, yPercent: 0, scale: 1, ease: "none",
      scrollTrigger: { trigger: root.current, start: "top 95%", end: "top 30%", scrub: 0.5 },
    });
    gsap.from(q(".pv-svc-visual-caption"), {
      autoAlpha: 0, y: 16, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: q(".pv-svc-visual-caption")[0], start: "top 92%" },
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
      <figcaption className="pv-svc-visual-caption">{caption}</figcaption>
    </figure>
  );
}
