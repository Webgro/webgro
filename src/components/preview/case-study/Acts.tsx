"use client";

import { useRef } from "react";
import { SCENE_QUERY, useGsap } from "../useGsap";
import type { Act } from "./structure";

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: reduce ? "auto" : "smooth" });
};

/** The intro paragraph, lit word by word as it is read, like the founders' letter on the homepage. */
export function BackgroundIntro({ label, text }: { label: string; text: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    gsap.fromTo(q(".pv-cs-bg-word"), { opacity: 0.13 }, {
      opacity: 1, ease: "none", stagger: 0.1,
      scrollTrigger: { trigger: q(".pv-cs-bg-text")[0], start: "top 80%", end: "bottom 56%", scrub: 0.4 },
    });
  });

  return (
    <div className="pv-cs-bg" ref={root}>
      <p className="pv-label">{label}</p>
      <p className="pv-cs-bg-text">
        {text.split(" ").map((w, i) => (
          <span className="pv-cs-bg-word" key={i}>{w} </span>
        ))}
      </p>
    </div>
  );
}

/**
 * The start of an act. A numeral the height of the screen fills with blue as
 * the part begins, the page colour turns over, and a short list says what is
 * coming so nobody has to scroll to find out.
 */
export function ActOpener({ act, index, total }: { act: Act; index: number; total: number }) {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add(SCENE_QUERY, () => {
      // Negative insets: the digit's ink spills past its tight line box, and a mask
      // cut to the box would slice the right edge and leave the outline showing below.
      gsap.fromTo(q(".pv-cs-act-num-fill"), { clipPath: "inset(100% -15% -15% -15%)" }, {
        clipPath: "inset(-15% -15% -15% -15%)", ease: "none",
        scrollTrigger: { trigger: el, start: "top 70%", end: "top 8%", scrub: 0.5 },
      });
      gsap.fromTo(q(".pv-cs-act-num"), { yPercent: 16 }, {
        yPercent: -12, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
      });
      gsap.fromTo(q(".pv-cs-act-rule span"), { scaleX: 0 }, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: el, start: "top 88%", end: "top 40%", scrub: 0.4 },
      });
      // The copy sits at the foot of a tall header, so it is its own trigger.
      const copy = q(".pv-cs-act-copy")[0];
      gsap.from(q(".pv-line > span"), {
        yPercent: 110, duration: 1.1, ease: "power3.out", stagger: 0.09,
        scrollTrigger: { trigger: copy, start: "top 84%" },
      });
      gsap.from(q(".pv-cs-act-part, .pv-cs-act-desc, .pv-cs-act-contents > *"), {
        y: 26, autoAlpha: 0, duration: 0.95, ease: "power3.out", stagger: 0.07,
        scrollTrigger: { trigger: copy, start: "top 80%" },
      });
    });
    return () => mm.revert();
  });

  return (
    <header className={`pv-cs-act-head${total > 1 ? " pv-cs-act-head--num" : ""}`} ref={root}>
      <div className="pv-cs-act-rule" aria-hidden="true"><span /></div>
      {total > 1 && (
        <div className="pv-cs-act-num" aria-hidden="true">
          <span className="pv-cs-act-num-line">{index + 1}</span>
          <span className="pv-cs-act-num-fill">{index + 1}</span>
        </div>
      )}
      <div className="pv-cs-act-copy">
        <p className="pv-label pv-cs-act-part">{total > 1 ? `Part ${index + 1} of ${total}` : "What we did"}</p>
        <h2 className="pv-h2"><span className="pv-line"><span>{act.label}</span></span></h2>
        {act.description && <p className="pv-lede pv-cs-act-desc">{act.description}</p>}
        {act.contents.length > 1 && (
          <div className="pv-cs-act-contents">
            <p className="pv-label">In this section</p>
            <ol>
              {act.contents.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} onClick={(e) => { e.preventDefault(); scrollToId(c.id); }} data-cursor>
                    {c.heading}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </header>
  );
}
