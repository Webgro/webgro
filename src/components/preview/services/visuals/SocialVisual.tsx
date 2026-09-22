"use client";

import { useRef } from "react";
import { useSceneOnly } from "./useSceneOnly";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
/** Which cells of a four-week month carry a post, and what kind. It is an example, so it makes no claim about frequency. */
const POSTS: Record<number, "photo" | "words" | "film"> = {
  0: "photo", 2: "words", 4: "film",
  8: "photo", 10: "words", 11: "photo",
  14: "film", 16: "photo", 18: "words",
  22: "photo", 23: "words", 25: "film",
};

/** A month's calendar that fills itself in as you scroll, then gets its tick of approval. */
export function SocialVisual({ still = false }: { still?: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useSceneOnly(root, ({ gsap, timeline }) => {
    const q = gsap.utils.selector(root.current!);
    const tl = timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: root.current, start: "top 85%", end: "center 42%", scrub: 0.5 },
    });
    tl.fromTo(q(".pv-svc-cal-cell"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, stagger: { each: 0.02, from: "start" } }, 0)
      .fromTo(q(".pv-svc-cal-post"), { autoAlpha: 0, scale: 0.5, rotation: -8 },
        { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.3, stagger: 0.16, ease: "back.out(1.8)" }, 0.4)
      .fromTo(q(".pv-svc-cal-tick path"), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.4 }, 2.5)
      .fromTo(q(".pv-svc-cal-status"), { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.3, ease: "power2.out" }, 2.6);
  }, still);

  return (
    <div className="pv-svc-cal" ref={root}>
      <div className="pv-svc-cal-board">
        <div className="pv-svc-cal-top">
          <p>Next month</p>
          <p className="pv-svc-cal-approved">
            <svg className="pv-svc-cal-tick" viewBox="0 0 24 24" aria-hidden="true"><path pathLength={1} d="M4 13 L10 19 L21 5" /></svg>
            <span className="pv-svc-cal-status">Planned and approved</span>
          </p>
        </div>
        <div className="pv-svc-cal-days" aria-hidden="true">
          {DAYS.map((d, i) => <span key={i}>{d}</span>)}
        </div>
        <div className="pv-svc-cal-grid" aria-hidden="true">
          {Array.from({ length: 28 }, (_, i) => (
            <div className="pv-svc-cal-cell" key={i}>
              {POSTS[i] && (
                <span className={`pv-svc-cal-post pv-svc-cal-post--${POSTS[i]}`}>
                  {POSTS[i] === "words" ? <><i /><i /><i /></> : POSTS[i] === "film" ? <b /> : <u />}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
