"use client";

import { useEffect, useRef, useState } from "react";
import type { Segment } from "./structure";

/**
 * The spine of the case study: a quiet strip along the bottom edge with one
 * segment per part. The current segment fills as you read through it, so you
 * always know which part you are in and how much of it is left. On phones the
 * labels collapse to the current one. Each segment jumps to its part.
 */
export function Spine({ segments }: { segments: Segment[] }) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const fills = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const els = segments.map((s) => document.getElementById(s.id));
    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const mid = vh * 0.5;
      let current = 0;
      let firstTop = Infinity;
      let lastBottom = -Infinity;
      els.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (i === 0) firstTop = r.top;
        if (i === els.length - 1) lastBottom = r.bottom;
        const p = Math.max(0, Math.min(1, (mid - r.top) / Math.max(1, r.height)));
        const fill = fills.current[i];
        if (fill) fill.style.transform = `scaleX(${p.toFixed(4)})`;
        if (r.top <= mid) current = i;
      });
      setActive((prev) => (prev === current ? prev : current));
      const show = firstTop < vh * 0.7 && lastBottom > vh * 0.35;
      setVisible((prev) => (prev === show ? prev : show));
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [segments]);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + 2, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <nav className={`pv-cs-spine${visible ? " is-visible" : ""}`} aria-label="Case study sections" aria-hidden={!visible}>
      <p className="pv-cs-spine-now">
        <span>{active + 1} of {segments.length}</span>
        <strong>{segments[active]?.label}</strong>
      </p>
      <ol className="pv-cs-spine-list">
        {segments.map((s, i) => (
          <li key={s.id} className={i === active ? "is-active" : i < active ? "is-done" : undefined}>
            <button type="button" onClick={() => jump(s.id)} tabIndex={visible ? 0 : -1} data-cursor aria-current={i === active ? "step" : undefined}>
              <span className="pv-cs-spine-label">{s.label}</span>
              <span className="pv-cs-spine-track" aria-hidden="true">
                <span ref={(node) => { fills.current[i] = node; }} />
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
