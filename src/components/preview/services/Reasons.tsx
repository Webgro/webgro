"use client";

import { useRef } from "react";
import { useGsap } from "../useGsap";
import { reasons } from "./content";

/** Why people pick us, set as a plain typographic list with ruled rows. */
export function Reasons() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    gsap.from(q(".pv-svc-reasons-head > *"), {
      yPercent: 40, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: root.current, start: "top 75%" },
    });
    q(".pv-svc-reason").forEach((row) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 88%" } });
      tl.from(row.querySelector(".pv-svc-reason-rule"), { scaleX: 0, duration: 1.1, ease: "power3.inOut" })
        .from(row.querySelector(".pv-line > span"), { yPercent: 110, duration: 0.9, ease: "power3.out" }, 0.15)
        .from(row.querySelector("p"), { autoAlpha: 0, y: 20, duration: 0.8, ease: "power3.out" }, 0.3);
    });
  });

  return (
    <section className="pv-svc-reasons" ref={root} data-pv-theme="paper">
      <div className="pv-svc-reasons-head">
        <h2 className="pv-h2">Why clients work with us</h2>
      </div>
      <div className="pv-svc-reasons-list">
        {reasons.map((r) => (
          <div className="pv-svc-reason" key={r.title}>
            <span className="pv-svc-reason-rule" />
            <h3><span className="pv-line"><span>{r.title}</span></span></h3>
            <p>{r.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
