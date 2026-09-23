"use client";

import Link from "next/link";
import { useRef } from "react";
import { routes } from "./content";
import { SCENE_QUERY, useGsap } from "./useGsap";

/**
 * Line drawings for the route rows, one per service. Every path carries
 * pathLength={1} so GSAP can draw it by running stroke-dashoffset from 1 to 0.
 * Stroke weight, caps and colour all come from the CSS.
 */
const COG_TEETH: [number, number, number, number][] = [
  [18.4, 12, 21.4, 12],
  [16.53, 16.53, 18.65, 18.65],
  [12, 18.4, 12, 21.4],
  [7.47, 16.53, 5.35, 18.65],
  [5.6, 12, 2.6, 12],
  [7.47, 7.47, 5.35, 5.35],
  [12, 5.6, 12, 2.6],
  [16.53, 7.47, 18.65, 5.35],
];

const ICONS: Record<string, React.ReactNode> = {
  // A shopping bag for the Shopify row.
  bag: (
    <>
      <path pathLength={1} d="M4.2 7.9h15.6l-1.1 12.9H5.3z" />
      <path pathLength={1} d="M8.6 10.6V7.1a3.4 3.4 0 0 1 6.8 0v3.5" />
    </>
  ),
  // A browser window with a page of copy in it for the WordPress row.
  window: (
    <>
      <path pathLength={1} d="M3.2 5h17.6v14H3.2z" />
      <path pathLength={1} d="M3.2 8.9h17.6" />
      <path pathLength={1} d="M6.6 12.4h10.8" />
      <path pathLength={1} d="M6.6 15.7h6.8" />
    </>
  ),
  // A magnifier for the search and marketing row.
  magnifier: (
    <>
      <path pathLength={1} d="M15.6 10.4a5.2 5.2 0 1 1-10.4 0 5.2 5.2 0 0 1 10.4 0" />
      <path pathLength={1} d="M14.3 14.3 20 20" />
    </>
  ),
  // A cog for the automation row.
  cog: (
    <>
      <path pathLength={1} d="M19.4 12a7.4 7.4 0 1 1-14.8 0 7.4 7.4 0 0 1 14.8 0" />
      {COG_TEETH.map(([x1, y1, x2, y2]) => (
        <path pathLength={1} key={`${x1}-${y1}`} d={`M${x1} ${y1} ${x2} ${y2}`} />
      ))}
      <path pathLength={1} d="M14.8 12a2.8 2.8 0 1 1-5.6 0 2.8 2.8 0 0 1 5.6 0" />
    </>
  ),
  // A clipboard with a checked list for the audit row.
  clipboard: (
    <>
      <path pathLength={1} d="M6 4.8h12v16.4H6z" />
      <path pathLength={1} d="M9.4 3.4h5.2v2.8H9.4z" />
      <path pathLength={1} d="m9 11.5 1.5 1.5 3-3.4" />
      <path pathLength={1} d="M9 16.1h6" />
      <path pathLength={1} d="M9 18.9h3.8" />
    </>
  ),
};

export function Routes() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    gsap.from(q(".pv-routes-head > *"), {
      yPercent: 40, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: root.current, start: "top 75%" },
    });
    q(".pv-route").forEach((row) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 88%" } });
      tl.from(row.querySelector(".pv-route-rule"), { scaleX: 0, duration: 1.1, ease: "power3.inOut" })
        .from(row.querySelectorAll(".pv-route-problem, .pv-route-answer"), {
          yPercent: 110, duration: 0.9, ease: "power3.out", stagger: 0.08,
        }, 0.15);
    });

    // The icons draw themselves in with the row they belong to. Reduced motion
    // never runs this, so the CSS resting state (a finished drawing) stands.
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      q(".pv-route").forEach((row) => {
        const paths = row.querySelectorAll(".pv-route-icon path");
        if (!paths.length) return;
        gsap.fromTo(paths, { strokeDasharray: 1, strokeDashoffset: 1 }, {
          strokeDashoffset: 0, duration: 0.7, ease: "power2.out", stagger: 0.05, delay: 0.2,
          scrollTrigger: { trigger: row, start: "top 88%", once: true },
        });
      });
    });

    return () => mm.revert();
  });

  return (
    <section className="pv-routes" ref={root} data-pv-theme="paper">
      <div className="pv-routes-head">
        <h2 className="pv-h2">What we can help with</h2>
        <p className="pv-lede">
          Each link goes to the service page, with what&rsquo;s included, typical costs and time frames, and
          examples of similar projects.
        </p>
      </div>
      <div className="pv-routes-list">
        {routes.map((r) => (
          <Link href={r.href} className="pv-route" key={r.problem} data-cursor>
            <span className="pv-route-rule" />
            <span className="pv-route-fill" />
            <span className="pv-route-main">
              <span className="pv-route-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">{ICONS[r.icon]}</svg>
              </span>
              <span className="pv-route-mask"><span className="pv-route-problem">{r.problem}</span></span>
            </span>
            <span className="pv-route-mask pv-route-mask--answer">
              <span className="pv-route-answer">
                {r.answer}
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
