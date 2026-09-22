"use client";

import { useRef } from "react";
import type { FigureDrawing } from "../content";
import { useDrawing } from "./useDrawing";

/**
 * A small drawing above a result figure. Each one is drawn from the numbers
 * in the figure itself (a score out of 100, a before and after, a share of a
 * whole), so it never shows anything the figure doesn't say.
 */
export function FigureDraw({ draw }: { draw?: FigureDrawing }) {
  const root = useRef<HTMLDivElement>(null);

  useDrawing(root, ({ gsap, q, el }) => {
    if (!draw) return;
    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
    switch (draw.kind) {
      case "ring":
      case "share":
        tl.fromTo([...q(".pv-svc-f-arc--before"), ...q(".pv-svc-f-arc--now")], { strokeDashoffset: (_: number, t: Element) => Number(t.getAttribute("data-len")) },
          { strokeDashoffset: 0, duration: 1.3, stagger: 0.55 }, 0.1)
          .fromTo(q(".pv-svc-f-ring-note"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.6);
        break;
      case "bars":
      case "months":
        tl.fromTo(q(".pv-svc-f-bar i"), { scaleY: 0 }, { scaleY: 1, duration: 0.9, stagger: draw.kind === "months" ? 0.08 : 0.35 }, 0.1)
          .fromTo(q(".pv-svc-f-bar em"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.2 }, 0.5);
        break;
      case "rank":
        tl.fromTo(q(".pv-svc-f-rank li"), { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.07 }, 0)
          .fromTo(q(".pv-svc-f-rank .is-us"), { yPercent: 300 }, { yPercent: 0, duration: 1.1, ease: "power3.inOut" }, 0.2)
          .fromTo(q(".pv-svc-f-rank .is-us b"), { scaleX: 0 }, { scaleX: 1, duration: 0.5 }, 1.1);
        break;
      case "line":
        tl.fromTo(q(".pv-svc-f-line"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.5, ease: "power1.inOut" }, 0.1)
          .fromTo(q(".pv-svc-f-area"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 0.8)
          .fromTo(q(".pv-svc-f-dot"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.4, stagger: 1.2, ease: "back.out(2.4)" }, 0.1)
          .fromTo(q(".pv-svc-f-line-labels em"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, stagger: 1 }, 0.3);
        break;
      case "range":
        tl.fromTo(q(".pv-svc-f-range-row i"), { scaleX: 0 }, { scaleX: 1, duration: 0.8, stagger: 0.4 }, 0.1)
          .fromTo(q(".pv-svc-f-range-band"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 1)
          .fromTo(q(".pv-svc-f-range-row em"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, stagger: 0.3 }, 0.5);
        break;
      case "mail":
        tl.fromTo(q(".pv-svc-f-mail"), { autoAlpha: 0, y: 20, rotation: -6 }, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.8, ease: "back.out(1.6)" }, 0.1)
          .fromTo(q(".pv-svc-f-mail i"), { scaleX: 0 }, { scaleX: 1, duration: 0.4, stagger: 0.12 }, 0.5)
          .fromTo(q(".pv-svc-f-mail-stamp"), { autoAlpha: 0, scale: 1.8, rotation: -20 }, { autoAlpha: 1, scale: 1, rotation: -8, duration: 0.5, ease: "back.out(2)" }, 1);
        break;
      case "mails":
        tl.fromTo(q(".pv-svc-f-mails span"), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: { each: 0.03, from: "random" } }, 0.1);
        break;
    }
  });

  if (!draw) return <div className="pv-svc-f-box" aria-hidden="true" />;

  return (
    <div className="pv-svc-f-box" ref={root} aria-hidden="true">
      {(draw.kind === "ring" || draw.kind === "share") && <Ring draw={draw} />}
      {draw.kind === "bars" && (
        <div className="pv-svc-f-bars">
          {draw.bars.map((b) => (
            <span className="pv-svc-f-bar" key={b.label} style={{ ["--h" as string]: b.value / Math.max(...draw.bars.map((x) => x.value)) }}>
              <i className={b.accent ? "is-accent" : undefined} />
              <em>{b.label}</em>
            </span>
          ))}
        </div>
      )}
      {draw.kind === "months" && (
        <div className="pv-svc-f-bars pv-svc-f-bars--months">
          {Array.from({ length: draw.count }, (_, i) => (
            <span className="pv-svc-f-bar" key={i} style={{ ["--h" as string]: 1 }}><i className="is-accent" /></span>
          ))}
          <p className="pv-svc-f-months-note">{draw.note}</p>
        </div>
      )}
      {draw.kind === "rank" && (
        <div className="pv-svc-f-rank">
          <p>{draw.query}</p>
          <ol>
            <li className="is-us"><b /><span>1</span><strong>{draw.client}</strong></li>
            <li><span>2</span><i /></li>
            <li><span>3</span><i /></li>
            <li><span>4</span><i /></li>
          </ol>
        </div>
      )}
      {draw.kind === "line" && <Line ratio={draw.ratio} from={draw.from} to={draw.to} />}
      {draw.kind === "range" && (
        <div className="pv-svc-f-range">
          <p className="pv-svc-f-range-row"><em>{draw.before}</em><i style={{ width: "100%" }} /></p>
          <p className="pv-svc-f-range-row">
            <em>{draw.after}</em>
            <i className="is-accent" style={{ width: `${100 - draw.max}%` }} />
            <span className="pv-svc-f-range-band" style={{ left: `${100 - draw.max}%`, width: `${draw.max - draw.min}%` }} />
          </p>
        </div>
      )}
      {draw.kind === "mail" && (
        <div className="pv-svc-f-mail">
          <svg viewBox="0 0 100 30" preserveAspectRatio="none"><path d="M0 0 L50 28 L100 0" /></svg>
          <i /><i /><i style={{ width: "58%" }} />
          <span className="pv-svc-f-mail-stamp">{draw.stamp}</span>
        </div>
      )}
      {draw.kind === "mails" && (
        <div className="pv-svc-f-mails">
          {Array.from({ length: draw.count }, (_, i) => <span key={i} />)}
        </div>
      )}
    </div>
  );
}

function Ring({ draw }: { draw: Extract<FigureDrawing, { kind: "ring" | "share" }> }) {
  // The result on the outer ring, and the score before the work on an inner one.
  const arc = (r: number, v: number, cls: string) => {
    const c = 2 * Math.PI * r;
    const l = (c * v) / 100;
    return (
      <>
        <circle className="pv-svc-f-track" cx="50" cy="50" r={r} />
        <circle className={`pv-svc-f-arc ${cls}`} cx="50" cy="50" r={r} data-len={l} strokeDasharray={`${l} ${c}`} />
      </>
    );
  };
  return (
    <div className="pv-svc-f-ring">
      <svg viewBox="0 0 100 100">
        {arc(44, draw.value, "pv-svc-f-arc--now")}
        {draw.kind === "ring" && arc(31, draw.from, "pv-svc-f-arc--before")}
      </svg>
      {draw.kind === "ring" ? (
        <p className="pv-svc-f-ring-note">
          <span><i className="is-before" />Before: {draw.from}</span>
          <span><i className="is-now" />After: {draw.value}</span>
        </p>
      ) : (
        <p className="pv-svc-f-ring-note">{draw.note}</p>
      )}
    </div>
  );
}

/** A smooth rise from 1 to `ratio`, the shape of a Search Console clicks chart. Only the two ends are real. */
function Line({ ratio, from, to }: { ratio: number; from: string; to: string }) {
  const W = 200;
  const H = 80;
  // Measured from a zero baseline at the bottom, so the end really is `ratio` times the start.
  const y1 = 8;
  const y0 = H - (H - y1) / ratio;
  const d = `M4 ${y0} C 60 ${y0}, 110 ${(y0 + y1) / 2 + 6}, 150 ${(y0 + y1) / 2 - 4} S 186 ${y1 + 2}, ${W - 4} ${y1}`;
  return (
    <div className="pv-svc-f-linechart">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <path className="pv-svc-f-area" d={`${d} L ${W - 4} ${H} L 4 ${H} Z`} />
        <path className="pv-svc-f-grid" d={`M0 ${H - 0.5} H ${W}`} />
        <path className="pv-svc-f-line" pathLength={1} d={d} />
      </svg>
      <span className="pv-svc-f-dot" style={{ left: "2%", top: `${(y0 / H) * 100}%` }} />
      <span className="pv-svc-f-dot" style={{ left: "98%", top: `${(y1 / H) * 100}%` }} />
      <p className="pv-svc-f-line-labels"><em>{from}</em><em>{to}</em></p>
    </div>
  );
}
