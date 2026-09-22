"use client";

import { useRef, type CSSProperties } from "react";
import { SCENE_QUERY, useGsap } from "../useGsap";
import { BrushBand } from "./BrushBand";
import type { PvService } from "./content";

/**
 * The signature scene on every service page. The stage pins, a brushed blue
 * line draws from one stage to the next, and each stage's detail swaps in
 * underneath. On a phone the line runs down the left edge instead of across.
 * Without scripts, or with reduced motion, it is a plain ordered list.
 */
export function Process({ process }: { process: PvService["process"] }) {
  const root = useRef<HTMLElement>(null);
  const n = process.stages.length;

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);

    gsap.from(q(".pv-svc-process-head > *"), {
      yPercent: 40, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: el, start: "top 75%" },
    });

    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      el.classList.add("is-scene");
      const stage = q(".pv-svc-process-stage")[0] as HTMLElement;
      const dots = q(".pv-svc-stage-node i");
      const names = q(".pv-svc-stage-label");
      const panels = q(".pv-svc-stage-panel") as HTMLElement[];
      const counts = q(".pv-svc-process-count-roll > span");
      const lineH = q(".pv-svc-track-line--h");
      const lineV = q(".pv-svc-track-line--v");

      gsap.set(dots, { scale: 0 });
      gsap.set(names, { opacity: 0.62 });
      gsap.set(panels, { autoAlpha: 0 });
      gsap.set(counts, { yPercent: 110 });
      gsap.set(lineH, { clipPath: "inset(-50% 100% -50% 0%)" });
      gsap.set(lineV, { clipPath: "inset(0% -50% 100% -50%)" });
      panels.forEach((panel) => {
        gsap.set(panel.querySelectorAll(".pv-line > span"), { yPercent: 110 });
        gsap.set(panel.querySelectorAll(".pv-svc-stage-fade"), { autoAlpha: 0, y: 26 });
      });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: `+=${n * 75}%`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      panels.forEach((panel, i) => {
        const t = i;
        const rest = 100 - (i / (n - 1)) * 100;
        if (i > 0) {
          tl.to(lineH, { clipPath: `inset(-50% ${rest}% -50% 0%)`, duration: 0.6, ease: "power1.inOut" }, t - 0.55)
            .to(lineV, { clipPath: `inset(0% -50% ${rest}% -50%)`, duration: 0.6, ease: "power1.inOut" }, t - 0.55);
        }
        tl.to(dots[i], { scale: 1, duration: 0.3, ease: "back.out(2.4)" }, t)
          .to(names[i], { opacity: 1, duration: 0.3 }, t)
          .to(counts[i], { yPercent: 0, duration: 0.35 }, t)
          .set(panel, { autoAlpha: 1 }, t)
          .to(panel.querySelectorAll(".pv-line > span"), { yPercent: 0, duration: 0.45, ease: "power3.out", stagger: 0.06 }, t)
          .to(panel.querySelectorAll(".pv-svc-stage-fade"), { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.07 }, t + 0.12);

        if (i < n - 1) {
          tl.to(panel, { autoAlpha: 0, y: -30, duration: 0.25, ease: "power2.in" }, t + 0.72)
            .to(counts[i], { yPercent: -110, duration: 0.3, ease: "power2.in" }, t + 0.7)
            .to(names[i], { opacity: 0.7, duration: 0.3 }, t + 0.72);
        }
      });
      tl.to({}, { duration: 0.6 });

      return () => el.classList.remove("is-scene");
    });

    return () => mm.revert();
  });

  return (
    <section className="pv-svc-process" id="process" ref={root} data-pv-theme="paper">
      <div className="pv-svc-process-head">
        <h2 className="pv-h2">{process.heading}</h2>
        <p className="pv-lede">{process.total}</p>
      </div>

      <div className="pv-svc-process-stage">
        <p className="pv-svc-process-count pv-label" aria-hidden="true">
          <span className="pv-svc-process-count-fixed">Stage</span>
          <span className="pv-svc-process-count-roll">
            {process.stages.map((s, i) => (
              <span key={s.name}>{i + 1}</span>
            ))}
          </span>
          <span className="pv-svc-process-count-fixed">of {n}</span>
        </p>

        <div className="pv-svc-track" style={{ "--pv-svc-n": n } as CSSProperties}>
          <BrushBand className="pv-svc-track-line pv-svc-track-line--h" seed={2} />
          <BrushBand className="pv-svc-track-line pv-svc-track-line--v" vertical seed={4} />
          <ol className="pv-svc-stages">
            {process.stages.map((s) => (
              <li className="pv-svc-stage" key={s.name}>
                <span className="pv-svc-stage-node" aria-hidden="true"><i /></span>
                <div className="pv-svc-stage-label">
                  <h3>{s.name}</h3>
                  {s.time && <p>{s.time}</p>}
                </div>
                <div className="pv-svc-stage-panel">
                  <p className="pv-svc-stage-title" aria-hidden="true">
                    <span className="pv-line"><span>{s.name}</span></span>
                  </p>
                  <p className="pv-svc-stage-body pv-svc-stage-fade">{s.body}</p>
                  {s.time && (
                    <p className="pv-svc-stage-time pv-svc-stage-fade" aria-hidden="true">{s.time}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
