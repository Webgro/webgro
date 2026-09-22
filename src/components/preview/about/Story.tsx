"use client";

import { useRef } from "react";
import { useGsap } from "../useGsap";
import { story } from "./content";
import { Lines, visibleLines } from "./Lines";

export function Story() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    gsap.from(visibleLines(q(".pv-about-story-title .pv-line > span")), {
      yPercent: 110, duration: 1.1, ease: "power3.out", stagger: 0.09,
      scrollTrigger: { trigger: q(".pv-about-story-title")[0], start: "top 82%" },
    });
    gsap.from(q(".pv-about-story-rule"), {
      scaleX: 0, duration: 1.3, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 80%" },
    });
    q(".pv-about-story-body p").forEach((p) => {
      gsap.from(p, {
        y: 32, autoAlpha: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: p, start: "top 88%" },
      });
    });
  });

  return (
    <section className="pv-about-story" ref={root} data-pv-theme="paper">
      <span className="pv-about-story-rule" aria-hidden="true" />
      <p className="pv-label">{story.label}</p>
      <div className="pv-about-story-main">
        <h2 className="pv-h2 pv-about-story-title">
          <Lines wide={story.headingLines} narrow={story.headingLinesNarrow} />
        </h2>
        <div className="pv-about-story-body">
          {story.body.map((p) => <p key={p}>{p}</p>)}
        </div>
      </div>
    </section>
  );
}
