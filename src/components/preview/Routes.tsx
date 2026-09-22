"use client";

import Link from "next/link";
import { useRef } from "react";
import { routes } from "./content";
import { useGsap } from "./useGsap";

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
            <span className="pv-route-mask"><span className="pv-route-problem">{r.problem}</span></span>
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
