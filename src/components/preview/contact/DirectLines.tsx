"use client";

import { useRef } from "react";
import { BrushStroke } from "../Brush";
import { useGsap } from "../useGsap";
import { directLines, EMAIL, EMAIL_HREF } from "./content";

/**
 * The page's own ending. Every other page closes on the blue dome that sends
 * people here, so this one closes on the shortest route in: the email address,
 * as big as it will go, then the phone line and the studio door.
 */
export function DirectLines() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);

    gsap.from(q(".pv-contact-end-head > *"), {
      y: 36, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: el, start: "top 72%" },
    });

    const email = q(".pv-contact-end-email")[0];
    gsap.from(q(".pv-contact-end-char"), {
      yPercent: 110, duration: 1, ease: "power3.out", stagger: 0.022,
      scrollTrigger: { trigger: email, start: "top 86%" },
    });
    gsap.fromTo(q(".pv-contact-end-brush"), { clipPath: "inset(0% 100% 0% 0%)" }, {
      clipPath: "inset(0% 0% 0% 0%)", ease: "none",
      scrollTrigger: { trigger: email, start: "top 74%", end: "top 40%", scrub: 0.4 },
    });

    q(".pv-contact-row").forEach((row) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 90%" } });
      tl.from(row.querySelector(".pv-contact-row-rule"), { scaleX: 0, duration: 1.1, ease: "power3.inOut" })
        .from(row.querySelectorAll(".pv-contact-row-cell"), {
          y: 28, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.07,
        }, 0.15);
    });
  });

  return (
    <section className="pv-contact-end" ref={root} data-pv-theme="paper">
      <div className="pv-contact-end-head">
        <h2 className="pv-h2">Email or phone</h2>
        <p className="pv-lede">
          You can also email or call us directly. We reply within one working day.
        </p>
      </div>

      <a className="pv-contact-end-email" href={EMAIL_HREF} aria-label={`Email ${EMAIL}`} data-cursor>
        <span className="pv-contact-end-mask" aria-hidden="true">
          {EMAIL.split("").map((c, i) => (
            <span className="pv-contact-end-char" key={i}>
              <span className="pv-contact-end-roll" data-char={c} style={{ "--i": i } as React.CSSProperties}>{c}</span>
            </span>
          ))}
        </span>
        <BrushStroke className="pv-contact-end-brush" />
      </a>

      <div className="pv-contact-rows">
        {directLines.map((d) => (
          <a
            className="pv-contact-row"
            key={d.kind}
            aria-label={`${d.action}: ${d.value}`}
            href={d.href}
            target={d.external ? "_blank" : undefined}
            rel={d.external ? "noopener noreferrer" : undefined}
            data-cursor
          >
            <span className="pv-contact-row-rule" />
            <span className="pv-contact-row-fill" />
            <span className="pv-contact-row-cell pv-label">{d.label}</span>
            <span className="pv-contact-row-cell pv-contact-row-main">
              <span className="pv-contact-row-value">{d.value}</span>
              <span className="pv-contact-row-meta">{d.meta}</span>
            </span>
            <span className="pv-contact-row-cell pv-contact-row-action">
              {d.action}
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
