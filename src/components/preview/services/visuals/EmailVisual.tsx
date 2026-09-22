"use client";

import { useRef } from "react";
import { BrushBand } from "../BrushBand";
import { useSceneOnly } from "./useSceneOnly";

const flows = [
  { name: "Welcome", when: "When someone joins your list", mails: ["Hello, and here's who we are", "What most people buy first"] },
  { name: "Abandoned basket", when: "When someone leaves without paying", mails: ["You left something behind", "Still thinking it over?"] },
  { name: "Post-purchase", when: "After an order arrives", mails: ["Thanks, it's on its way", "How are you getting on with it?"] },
];

/**
 * Three automated flows drawn as one branching brushed line. The trunk runs
 * down the left, each flow branches off it, and the emails drop onto the branch
 * in the order a customer would receive them.
 */
export function EmailVisual({ still = false }: { still?: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useSceneOnly(root, ({ timeline }) => {
    const el = root.current!;
    const tl = timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 62%", scrub: 0.5 },
    });
    tl.fromTo(el.querySelector(".pv-svc-flow-start"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, 0);

    el.querySelectorAll<HTMLElement>(".pv-svc-flow-row").forEach((row, i) => {
      const t = 0.2 + i * 1.1;
      tl.fromTo(row.querySelector(".pv-svc-flow-trunk"), { clipPath: "inset(0% -80% 100% -80%)" }, { clipPath: "inset(0% -80% 0% -80%)", duration: 0.4 }, t)
        .fromTo(row.querySelector(".pv-svc-flow-knot"), { scale: 0 }, { scale: 1, duration: 0.2, ease: "back.out(2.4)" }, t + 0.35)
        .fromTo(row.querySelector(".pv-svc-flow-label"), { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.3, ease: "power2.out" }, t + 0.35)
        .fromTo(row.querySelector(".pv-svc-flow-branch"), { clipPath: "inset(-80% 100% -80% 0%)" }, { clipPath: "inset(-80% 0% -80% 0%)", duration: 0.75 }, t + 0.4)
        .fromTo(row.querySelectorAll(".pv-svc-flow-mail"), { autoAlpha: 0, yPercent: -40, rotation: -5 },
          { autoAlpha: 1, yPercent: 0, rotation: 0, duration: 0.3, stagger: 0.25, ease: "back.out(1.6)" }, t + 0.55);
    });
    tl.to({}, { duration: 0.2 });
  }, still);

  return (
    <div className="pv-svc-flow" ref={root}>
      <p className="pv-svc-flow-start">A customer does something</p>
      <ul className="pv-svc-flow-rows">
        {flows.map((f, i) => (
          <li className="pv-svc-flow-row" key={f.name}>
            <BrushBand className="pv-svc-flow-trunk" vertical seed={i + 8} />
            <div className="pv-svc-flow-label">
              <strong>{f.name}</strong>
              <span>{f.when}</span>
            </div>
            <div className="pv-svc-flow-lane">
              <span className="pv-svc-flow-knot" aria-hidden="true" />
              <BrushBand className="pv-svc-flow-branch" seed={i + 12} />
              {f.mails.map((m) => (
                <div className="pv-svc-flow-mail" key={m}>
                  <svg viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0 L50 28 L100 0" /></svg>
                  <p>{m}</p>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
