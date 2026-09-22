"use client";

import { useRef } from "react";
import { useSceneOnly } from "./useSceneOnly";

const LOOP = "M400 62 C 585 50, 742 150, 716 292 C 694 412, 540 470, 392 462 C 226 454, 70 384, 84 250 C 96 130, 232 72, 400 62";

/** Arrowheads sit on the path, at 18%, 52% and 85% of its length, turned to its direction there. */
const HEADS = [
  { x: 676, y: 154, a: 48 },
  { x: 372, y: 461, a: -176 },
  { x: 162, y: 127, a: -34 },
];

/** Paid, email and analytics drawn as one loop that closes as you scroll. */
export function LoopVisual({ still = false }: { still?: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useSceneOnly(root, ({ gsap, timeline }) => {
    const q = gsap.utils.selector(root.current!);
    const nodes = q(".pv-svc-loop-node");
    const labels = [".pv-svc-loop-label--a", ".pv-svc-loop-label--b", ".pv-svc-loop-label--c"].map((c) => q(c)[0]);
    const heads = q(".pv-svc-loop-head");
    gsap.set(q(".pv-svc-loop-path"), { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(nodes, { scale: 0, transformOrigin: "50% 50%" });
    gsap.set(heads, { autoAlpha: 0 });
    gsap.set(labels, { autoAlpha: 0, y: 18 });

    const tl = timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: root.current, start: "top 85%", end: "center 38%", scrub: 0.5 },
    });
    tl.to(q(".pv-svc-loop-path"), { strokeDashoffset: 0, duration: 3 }, 0);
    // The path takes three units to draw. Nodes sit at 0%, 36% and 68% of it.
    [0, 1.08, 2.04].forEach((t, i) => {
      tl.to(nodes[i], { scale: 1, duration: 0.3, ease: "back.out(2.2)" }, t)
        .to(labels[i], { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, t + 0.05)
        .to(heads[i], { autoAlpha: 1, duration: 0.2 }, [0.54, 1.56, 2.55][i]);
    });
    tl.to({}, { duration: 0.3 });
  }, still);

  return (
    <div className="pv-svc-loop" ref={root}>
      <p className="pv-svc-loop-label pv-svc-loop-label--a">
        <strong>Paid ads and social</strong>{" "}reach new customers.
      </p>
      <svg viewBox="0 0 800 520" aria-hidden="true">
        <path className="pv-svc-loop-path pv-svc-loop-path--dry" pathLength={1} d={LOOP} transform="translate(3 4)" />
        <path className="pv-svc-loop-path" pathLength={1} d={LOOP} />
        {HEADS.map((h) => (
          <path className="pv-svc-loop-head" key={h.x} d="M-15 -9 L0 0 L-15 9" transform={`translate(${h.x} ${h.y}) rotate(${h.a})`} />
        ))}
        <circle className="pv-svc-loop-node" cx="400" cy="62" r="13" />
        <circle className="pv-svc-loop-node" cx="630" cy="409" r="13" />
        <circle className="pv-svc-loop-node" cx="128" cy="370" r="13" />
      </svg>
      <div className="pv-svc-loop-foot">
        <p className="pv-svc-loop-label pv-svc-loop-label--c">
          <strong>Analytics</strong>{" "}shows which spend is paying back, and the budget is adjusted to match.
        </p>
        <p className="pv-svc-loop-label pv-svc-loop-label--b">
          <strong>Email</strong>{" "}brings them back without paying for another click.
        </p>
      </div>
    </div>
  );
}
