"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type CSSProperties } from "react";
import { BrushStroke } from "@/components/preview/Brush";
import { pv } from "@/components/preview/links";
import "./legal.css";

/**
 * The homepage hero in reverse. A finished page (the same Gieves & Hawkes
 * collection page the hero builds) is scanned away to the wireframe it was
 * traced from, the pencil lines rub themselves out, and a dry-brushed 404 is
 * painted onto the empty sheet.
 *
 * The whole sequence is CSS keyframes with backwards fill, so it starts on the
 * first paint without waiting for a script, and the resting CSS state is the
 * end of the story: that is what reduced-motion visitors get.
 */

type Shape =
  | { k: "rect"; x: number; y: number; w: number; h: number; rx?: number }
  | { k: "line"; x1: number; y1: number; x2: number; y2: number; sw?: number };

const bar = (x: number, y: number, w: number): Shape => ({ k: "line", x1: x, y1: y, x2: x + w, y2: y, sw: 9 });

// Same geometry as the hero wireframe, which is traced over the real page.
const SHAPES: Shape[] = [
  { k: "rect", x: 62, y: 18, w: 254, h: 58, rx: 3 },
  ...[348, 469, 608, 687, 765].map((x, i) => bar(x, 44, [94, 112, 52, 51, 56][i])),
  ...[1128, 1212, 1292, 1388, 1462].map((x) => bar(x, 45, 62)),
  { k: "line", x1: 0, y1: 93, x2: 1600, y2: 93 },
  { k: "rect", x: 512, y: 166, w: 578, h: 52, rx: 3 },
  bar(412, 251, 776),
  bar(406, 280, 788),
  bar(518, 310, 564),
  { k: "line", x1: 62, y1: 361, x2: 1538, y2: 361 },
  ...[62, 148, 253, 396, 476, 566, 699, 841, 992].map((x, i) => bar(x, 393, [44, 64, 102, 38, 48, 92, 102, 108, 104][i])),
  { k: "line", x1: 62, y1: 427, x2: 1538, y2: 427 },
  ...[62, 558, 1054].flatMap((x): Shape[] => [
    { k: "rect", x, y: 455, w: 484, h: 640 },
    { k: "line", x1: x, y1: 455, x2: x + 484, y2: 1095, sw: 1.2 },
    { k: "line", x1: x + 484, y1: 455, x2: x, y2: 1095, sw: 1.2 },
  ]),
];

function WireShapes() {
  return (
    <>
      {SHAPES.map((s, i) => {
        // Rubbed out in the reverse of the order the hero draws them.
        const style = { "--i": SHAPES.length - 1 - i } as CSSProperties;
        return s.k === "rect" ? (
          <rect key={i} pathLength={1} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx} style={style} />
        ) : (
          <line key={i} pathLength={1} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} strokeWidth={s.sw} style={style} />
        );
      })}
    </>
  );
}

const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export function NotFoundView() {
  const pathname = usePathname();
  const [run, setRun] = useState(0);

  return (
    <section className="pv-legal-nf" data-pv-theme="paper">
      <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
        <defs>
          {/* Dry brush: wobble the edges, then let long horizontal streaks of the same noise run out of paint. */}
          <filter id="pv-legal-nf-dry" x="-6%" y="-6%" width="112%" height="112%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.12" numOctaves="2" seed="11" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G" result="wobble" />
            <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -14 9.1" result="paint" />
            <feComposite in="wobble" in2="paint" operator="in" />
          </filter>
        </defs>
      </svg>

      <div className="pv-legal-nf-copy">
        <p className="pv-label pv-legal-nf-label">Error 404</p>
        <h1 className="pv-h1 pv-legal-nf-title">
          <span className="pv-line"><span>Page</span></span>
          <span className="pv-line">
            <span>
              <span className="pv-brushed">not found.<BrushStroke className="pv-legal-nf-brush" /></span>
            </span>
          </span>
        </h1>
        <div className="pv-legal-nf-rest">
          <p className="pv-legal-nf-body">
            There is no page at <span className="pv-legal-nf-path">{pathname}</span>. It may have moved, or the
            link may be out of date. These links may help.
          </p>
          <div className="pv-legal-nf-actions">
            <Link href={pv("/")} className="pv-btn" data-cursor><span>Back to the homepage</span></Link>
            <Link href={pv("/work")} className="pv-textlink" data-cursor>See our work</Link>
            <Link href={pv("/contact")} className="pv-textlink" data-cursor>Get in touch</Link>
          </div>
          <p className="pv-legal-nf-email">
            If you can&rsquo;t find what you need, email{" "}
            <a href="mailto:hello@webgro.co.uk" data-cursor>hello@webgro.co.uk</a>.
          </p>
        </div>
      </div>

      <div className="pv-legal-nf-scene">
        {/* Re-keying the tile remounts it, which restarts every keyframe for the replay. */}
        <div
          className={`pv-legal-nf-tile${run ? "" : " is-first"}`}
          key={run}
          style={{ "--pv-legal-nf-t0": run ? "0.15s" : "1.1s" } as CSSProperties}
          aria-hidden="true"
        >
          <span className="pv-legal-nf-chrome"><i /><i /><i /></span>
          <div className="pv-legal-nf-frame">
            <svg className="pv-legal-nf-wire" viewBox="0 0 1600 1055" preserveAspectRatio="xMidYMin slice">
              <g className="pv-legal-nf-ghost" fill="none" stroke="currentColor" strokeWidth="2"><WireShapes /></g>
              <g className="pv-legal-nf-lines" fill="none" stroke="currentColor" strokeWidth="2"><WireShapes /></g>
            </svg>

            <div className="pv-legal-nf-num">
              {["4", "0", "4"].map((d, i) => (
                <svg key={i} viewBox="0 0 330 420">
                  <text x="165" y="374" textAnchor="middle" textLength="276" lengthAdjust="spacingAndGlyphs" filter="url(#pv-legal-nf-dry)">
                    {d}
                  </text>
                </svg>
              ))}
            </div>

            <picture>
              <source media="(prefers-reduced-motion: reduce)" srcSet={BLANK} />
              <img className="pv-legal-nf-shot" src="/preview/main-gieves.jpg" alt="" width={1600} height={1055} />
            </picture>
            <span className="pv-legal-nf-scan" />
          </div>
        </div>

        <div className="pv-legal-nf-caption">
          <p>This page no longer exists.</p>
          <button type="button" className="pv-textlink pv-legal-nf-replay" onClick={() => setRun((r) => r + 1)} data-cursor>
            Replay animation
          </button>
        </div>
      </div>
    </section>
  );
}
