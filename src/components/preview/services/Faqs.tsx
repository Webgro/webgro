"use client";

import { useEffect, useRef, useState } from "react";
import { STATIC_QUERY, useGsap } from "../useGsap";
import type { Faq } from "./content";

type Tools = {
  gsap: typeof import("gsap").default;
  SplitText: typeof import("gsap/SplitText").SplitText;
};

/**
 * Questions open one at a time. The row unfolds with a CSS grid-row
 * transition, and the answer is split into its real rendered lines so each one
 * rises out of its own mask. The split is undone as soon as the reveal has
 * played, so the text reflows normally on resize.
 */
export function Faqs({ faqs, topic }: { faqs: Faq[]; topic: string }) {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);
  const tools = useRef<Tools | null>(null);
  const mounted = useRef(false);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    let cancelled = false;
    import("gsap/SplitText").then((m) => {
      if (cancelled) return;
      gsap.registerPlugin(m.SplitText);
      tools.current = { gsap, SplitText: m.SplitText };
    });

    gsap.from(q(".pv-svc-faq-head > *"), {
      yPercent: 40, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: root.current, start: "top 75%" },
    });
    q(".pv-svc-faq-item").forEach((row) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 90%" } });
      tl.from(row.querySelector(".pv-svc-faq-rule"), { scaleX: 0, duration: 1.1, ease: "power3.inOut" })
        .from(row.querySelector(".pv-svc-faq-q > span"), { yPercent: 110, duration: 0.9, ease: "power3.out" }, 0.15)
        .from(row.querySelector(".pv-svc-faq-sign"), { autoAlpha: 0, scale: 0.6, duration: 0.6, ease: "power3.out" }, 0.3);
    });

    return () => { cancelled = true; };
  });

  useEffect(() => {
    // The first answer is open when the page loads, and needs no reveal.
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const t = tools.current;
    if (!t || open === null || window.matchMedia(STATIC_QUERY).matches) return;
    const p = root.current?.querySelector<HTMLElement>(`[data-faq="${open}"] .pv-svc-faq-a p`);
    if (!p) return;

    const split = t.SplitText.create(p, { type: "lines", mask: "lines" });
    const tween = t.gsap.from(split.lines, {
      yPercent: 115, duration: 0.85, ease: "power3.out", stagger: 0.045, delay: 0.1,
      onComplete: () => split.revert(),
    });
    return () => {
      tween.kill();
      split.revert();
    };
  }, [open]);

  return (
    <section className="pv-svc-faq" ref={root} data-pv-theme="paper">
      <div className="pv-svc-faq-head">
        <h2 className="pv-h2">Questions about {topic}</h2>
        <p className="pv-lede">
          If your question isn&rsquo;t answered here, get in touch.
        </p>
      </div>
      <div className="pv-svc-faq-list">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div className={`pv-svc-faq-item${isOpen ? " is-open" : ""}`} key={f.q} data-faq={i}>
              <span className="pv-svc-faq-rule" />
              <h3>
                <button
                  type="button"
                  className="pv-svc-faq-btn"
                  aria-expanded={isOpen}
                  aria-controls={`pv-svc-faq-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  data-cursor
                >
                  <span className="pv-svc-faq-q"><span>{f.q}</span></span>
                  <span className="pv-svc-faq-sign" aria-hidden="true"><i /><i /></span>
                </button>
              </h3>
              <div className="pv-svc-faq-a" id={`pv-svc-faq-${i}`} role="region" aria-hidden={!isOpen}>
                <div>
                  <p>{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
