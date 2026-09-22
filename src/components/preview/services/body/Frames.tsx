"use client";

import { useRef } from "react";
import { useDrawing } from "./useDrawing";

export type Shot = { src: string; alt: string; url?: string; w?: number; h?: number };

/** A real screenshot in a plain browser window, the same frame the case studies use. */
function Browser({ shot, className = "" }: { shot: Shot; className?: string }) {
  return (
    <div className={`pv-svc-b-browser ${className}`}>
      <div className="pv-svc-b-bar" aria-hidden="true">
        <i /><i /><i />
        {shot.url && <span>{shot.url}</span>}
      </div>
      <div className="pv-svc-b-view">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shot.src} alt={shot.alt} width={shot.w ?? 1440} height={shot.h ?? 950} loading="lazy" decoding="async" draggable={false} />
      </div>
    </div>
  );
}

/** A real phone screenshot in a handset. */
function Phone({ shot, className = "" }: { shot: Shot; className?: string }) {
  return (
    <div className={`pv-svc-b-phone ${className}`}>
      <div className="pv-svc-b-phone-screen">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shot.src} alt={shot.alt} width={shot.w ?? 700} height={shot.h ?? 1515} loading="lazy" decoding="async" draggable={false} />
      </div>
    </div>
  );
}

/**
 * A site on a desktop with the same site on a phone in front of it. As it
 * scrolls through, the window rises into place and the phone overtakes it.
 */
export function ShotDuo({ desktop, phone }: { desktop: Shot; phone: Shot }) {
  const root = useRef<HTMLElement>(null);

  useDrawing(root, ({ gsap, q, el }) => {
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom 40%", scrub: 0.6 },
    });
    tl.fromTo(q(".pv-svc-b-duo-desk"), { yPercent: 10, rotationX: 10 }, { yPercent: 0, rotationX: 0, duration: 1 }, 0)
      .fromTo(q(".pv-svc-b-duo-phone"), { yPercent: 34 }, { yPercent: 0, duration: 1 }, 0);
  });

  return (
    <figure className="pv-svc-b-duo" ref={root}>
      <div className="pv-svc-b-duo-stage">
        <Browser shot={desktop} className="pv-svc-b-duo-desk" />
        <Phone shot={phone} className="pv-svc-b-duo-phone" />
      </div>
    </figure>
  );
}

/**
 * Several real sites dealt out like cards. They start stacked in the middle
 * and fan out to their places as the row scrolls up the screen.
 */
export function ShotFan({ shots }: { shots: Shot[] }) {
  const root = useRef<HTMLElement>(null);

  useDrawing(root, ({ gsap, q, el, wide }) => {
    const cards = q(".pv-svc-b-fan-card") as HTMLElement[];
    const n = cards.length;
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el, start: "top 92%", end: "center 45%", scrub: 0.6 },
    });
    cards.forEach((card, i) => {
      const off = i - (n - 1) / 2;
      if (wide) {
        // Every card starts on top of the middle one and slides out to its slot.
        tl.fromTo(card, { xPercent: -off * 100 * 0.78, yPercent: 8, rotation: off * -3 }, { xPercent: 0, yPercent: 0, rotation: 0, duration: 1 }, 0);
      } else {
        tl.fromTo(card, { yPercent: 18 + i * 10, autoAlpha: 0.2 }, { yPercent: 0, autoAlpha: 1, duration: 0.6 }, i * 0.2);
      }
    });
  });

  return (
    <figure className="pv-svc-b-fan" ref={root} style={{ ["--n" as string]: shots.length }}>
      <div className="pv-svc-b-fan-row">
        {shots.map((s, i) => (
          <div className="pv-svc-b-fan-card" key={s.src} style={{ zIndex: i === Math.floor(shots.length / 2) ? 3 : 1 }}>
            <Browser shot={s} />
          </div>
        ))}
      </div>
    </figure>
  );
}

/** Two phones side by side, one a little lower, drifting at different rates. */
export function PhonePair({ shots }: { shots: [Shot, Shot] }) {
  const root = useRef<HTMLElement>(null);

  useDrawing(root, ({ gsap, q, el }) => {
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
    });
    const [a, b] = q(".pv-svc-b-phone");
    tl.fromTo(a, { yPercent: 8, rotation: -4 }, { yPercent: -6, rotation: -1, duration: 1 }, 0)
      .fromTo(b, { yPercent: 22, rotation: 5 }, { yPercent: -4, rotation: 2, duration: 1 }, 0);
  });

  return (
    <figure className="pv-svc-b-pair" ref={root}>
      <div className="pv-svc-b-pair-row">
        <Phone shot={shots[0]} />
        <Phone shot={shots[1]} />
      </div>
    </figure>
  );
}
