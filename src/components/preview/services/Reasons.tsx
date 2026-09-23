"use client";

import { useRef } from "react";
import { SCENE_QUERY, useGsap } from "../useGsap";
import { reasons } from "./content";

/**
 * One line drawing per reason, keyed by its heading. Every path carries
 * pathLength={1} so GSAP can draw it by running stroke-dashoffset from 1 to 0.
 * Stroke weight, caps and colour come from the CSS.
 */
const ICONS: Record<string, React.ReactNode> = {
  // A price tag for the pricing row.
  "Priced per project": (
    <>
      <path pathLength={1} d="M3 3h9.2l8.4 8.4a1.9 1.9 0 0 1 0 2.7l-6.5 6.5a1.9 1.9 0 0 1-2.7 0L3 12.2z" />
      <path pathLength={1} d="M8 6.6a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0" />
    </>
  ),
  // Three people for the one-team row.
  "One team": (
    <>
      <path pathLength={1} d="M15.4 8.2a3.4 3.4 0 1 1-6.8 0 3.4 3.4 0 0 1 6.8 0" />
      <path pathLength={1} d="M6 21v-1.2a4.6 4.6 0 0 1 4.6-4.6h2.8a4.6 4.6 0 0 1 4.6 4.6V21" />
      <path pathLength={1} d="M6.7 10a2.1 2.1 0 1 1-4.2 0 2.1 2.1 0 0 1 4.2 0" />
      <path pathLength={1} d="M2 21v-1a3.6 3.6 0 0 1 2.3-3.35" />
      <path pathLength={1} d="M21.5 10a2.1 2.1 0 1 1-4.2 0 2.1 2.1 0 0 1 4.2 0" />
      <path pathLength={1} d="M22 21v-1a3.6 3.6 0 0 0-2.3-3.35" />
    </>
  ),
  // A clock for the fifteen years row.
  "Fifteen years in eCommerce": (
    <>
      <path pathLength={1} d="M20.6 12a8.6 8.6 0 1 1-17.2 0 8.6 8.6 0 0 1 17.2 0" />
      <path pathLength={1} d="M12 6.6V12l4.3 2.6" />
    </>
  ),
  // A bar chart for the row about spend and reporting.
  "Clear advice on spend": (
    <>
      <path pathLength={1} d="M3.6 3.4v17h17" />
      <path pathLength={1} d="M6.4 14.8h3.2v5.6H6.4z" />
      <path pathLength={1} d="M11.4 10.4h3.2v10h-3.2z" />
      <path pathLength={1} d="M16.4 6.2h3.2v14.2h-3.2z" />
    </>
  ),
};

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

    // The icons draw themselves in with the row they sit on. Reduced motion
    // never runs this, so the CSS resting state (a finished drawing) stands.
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      q(".pv-svc-reason").forEach((row) => {
        const paths = row.querySelectorAll(".pv-svc-reason-icon path");
        if (!paths.length) return;
        gsap.fromTo(paths, { strokeDasharray: 1, strokeDashoffset: 1 }, {
          strokeDashoffset: 0, duration: 0.7, ease: "power2.out", stagger: 0.06, delay: 0.2,
          scrollTrigger: { trigger: row, start: "top 88%", once: true },
        });
      });
    });

    return () => mm.revert();
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
            <div className="pv-svc-reason-head">
              {ICONS[r.title] && (
                <span className="pv-svc-reason-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">{ICONS[r.title]}</svg>
                </span>
              )}
              <h3><span className="pv-line"><span>{r.title}</span></span></h3>
            </div>
            <p>{r.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
