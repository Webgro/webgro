"use client";

import Link from "next/link";
import { useRef } from "react";
import { pv } from "../links";
import { SCENE_QUERY, useGsap } from "../useGsap";
import { room } from "./content";
import { Lines } from "./Lines";

const MID = 50;

/** One loop per message: a spring of thirty coils strung between the desks. */
const COIL = (() => {
  const loops = 30;
  const r = 15;
  const x0 = 112;
  const run = 488 - x0;
  const steps = loops * 16;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = t * loops * Math.PI * 2;
    const x = x0 + run * t + r * Math.sin(a);
    const y = MID - r * Math.cos(a);
    d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
})();

const WALK = `M100 ${MID} C 210 ${MID - 34}, 390 ${MID + 34}, 500 ${MID}`;

function Desks() {
  return (
    <g className="pv-about-sketch-desks" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
      <rect className="pv-about-sketch-desk" x="6" y="26" width="90" height="48" rx="6" />
      <rect className="pv-about-sketch-desk" x="504" y="26" width="90" height="48" rx="6" />
      <line className="pv-about-sketch-screen" x1="28" y1="40" x2="74" y2="40" strokeWidth="4" />
      <line className="pv-about-sketch-screen" x1="526" y1="40" x2="572" y2="40" strokeWidth="4" />
    </g>
  );
}

export function Room() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    // Reduced motion gets the CSS default: everything drawn and visible.
    mm.add(SCENE_QUERY, () => {
      gsap.from(q(".pv-about-room-title .pv-line > span"), {
        yPercent: 110, duration: 1.1, ease: "power3.out", stagger: 0.09,
        scrollTrigger: { trigger: q(".pv-about-room-title")[0], start: "top 82%" },
      });
      q(".pv-about-room-body p").forEach((p) => {
        gsap.from(p, {
          y: 32, autoAlpha: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: p, start: "top 88%" },
        });
      });

      // The sketch is one timeline on one trigger, played rather than scrubbed,
      // so it always runs in the same order: desks, then the lines left to
      // right, then the labels.
      const figure = q(".pv-about-sketch")[0] as HTMLElement;
      const [walkRow, typeRow] = q(".pv-about-sketch-row");
      const inRow = (row: Element, sel: string) => Array.from(row.querySelectorAll(sel));
      const desks = q(".pv-about-sketch-desk");
      const screens = q(".pv-about-sketch-screen");
      const walk = q(".pv-about-sketch-walk");
      const coil = q(".pv-about-sketch-coil");
      const walkLabels = inRow(walkRow, ".pv-about-sketch-time, .pv-about-sketch-ends > span");
      const typeLabels = inRow(typeRow, ".pv-about-sketch-time, .pv-about-sketch-ends > span");

      // Hide each stroke with one dash a little longer than the shape and a
      // gap longer still, measured in the shape's own units (no pathLength).
      // The hidden offset parks the dash a unit before the start point, so a
      // round cap can't leave a dot at either end. Drawing runs the offset
      // down to zero, from the path's start point to its end.
      [...desks, ...screens, ...walk, ...coil].forEach((shape) => {
        const len = (shape as unknown as SVGGeometryElement).getTotalLength();
        gsap.set(shape, { strokeDasharray: `${len + 1} ${len + 40}`, strokeDashoffset: len + 2 });
      });
      gsap.set([...walkLabels, ...typeLabels], { autoAlpha: 0, y: 10 });
      // The CSS hides the sketch until this class lands, so nothing shows fully
      // drawn for a frame before the hidden states above take over.
      figure.classList.add("is-ready");

      gsap.timeline({
        scrollTrigger: { trigger: figure, start: "top 62%", toggleActions: "play none none none" },
      })
        .to(desks, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, 0)
        .to(screens, { strokeDashoffset: 0, duration: 0.35, ease: "power2.out" }, 0.55)
        .to(walk, { strokeDashoffset: 0, duration: 0.55, ease: "power2.inOut" }, 1)
        .to(coil, { strokeDashoffset: 0, duration: 2.4, ease: "sine.inOut" }, 1)
        .to(walkLabels, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.06 }, 1.6)
        .to(typeLabels, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.06 }, 3.45);

      gsap.from(q(".pv-about-address > *"), {
        y: 24, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: q(".pv-about-address")[0], start: "top 88%" },
      });

      return () => figure.classList.remove("is-ready");
    });

    return () => mm.revert();
  });

  const { sketch } = room;

  return (
    <section className="pv-about-room" ref={root} data-pv-theme="paper">
      <div className="pv-about-room-top">
        <div>
          <p className="pv-label">{room.label}</p>
          <h2 className="pv-h2 pv-about-room-title">
            <Lines wide={room.headingLines} />
          </h2>
        </div>
        <div className="pv-about-room-body">
          {room.body.map((p) => <p key={p}>{p}</p>)}
        </div>
      </div>

      <figure className="pv-about-sketch">
        {[sketch.walk, sketch.type].map((row, i) => (
          <div className="pv-about-sketch-row" key={row.title}>
            <p className="pv-about-sketch-caption">
              <span>{row.title}</span>
              <strong className="pv-about-sketch-time">{row.time}</strong>
            </p>
            <svg viewBox="0 0 600 100" aria-hidden="true">
              <Desks />
              {i === 0 ? (
                <path className="pv-about-sketch-walk" d={WALK} />
              ) : (
                <path className="pv-about-sketch-coil" d={COIL} suppressHydrationWarning />
              )}
            </svg>
            <p className="pv-about-sketch-ends" aria-hidden="true">
              <span>{sketch.from}</span>
              <span>{sketch.to}</span>
            </p>
          </div>
        ))}
      </figure>

      <div className="pv-about-address">
        <p className="pv-label">{room.addressLabel}</p>
        <address>
          {room.address.map((l) => <span key={l}>{l}</span>)}
        </address>
        <Link href={pv("/contact")} className="pv-textlink" data-cursor>Get in touch</Link>
      </div>
    </section>
  );
}
