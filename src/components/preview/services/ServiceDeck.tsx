"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { pv } from "../links";
import { SCENE_QUERY, STATIC_QUERY, useGsap } from "../useGsap";
import { pvServices } from "./content";
import { MiniVisual } from "./visuals";

/** Keep in step with the .pv-svc-deck media queries in services.css. */
const DECK_QUERY = "(min-width: 1100px)";

/**
 * Where each card lies in the fan, as a share of the deck (x, y in %), its turn
 * in degrees, and how far it drifts with the mouse (d).
 */
const FAN = [
  { x: 18, y: 27, r: -5, d: 1.2 },
  { x: 50, y: 22, r: 2, d: 0.8 },
  { x: 82, y: 30, r: 6, d: 1 },
  { x: 21, y: 73, r: 3.5, d: 0.9 },
  { x: 52, y: 77, r: -3, d: 1.3 },
  { x: 82, y: 71, r: -6.5, d: 0.7 },
];
/** How the cards lie once they are gathered up: turn, and a nudge as a share of the card width. */
const PILE = [
  { r: -6, x: -0.03 },
  { r: 4, x: 0.03 },
  { r: -2.5, x: -0.015 },
  { r: 5.5, x: 0.02 },
  { r: -4, x: -0.03 },
  { r: 2.5, x: 0.015 },
];

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * Six small cards beside the services headline, one per service, each showing
 * that service page's own picture in its finished state. They are dealt out on
 * load, lean towards the mouse, and are gathered up into a pile that sinks
 * towards the desk below as the page scrolls.
 */
export function ServiceDeck() {
  const root = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  // The miniatures are heavy, so they mount after first paint and only on screens wide enough to show them.
  useEffect(() => {
    const mq = window.matchMedia(DECK_QUERY);
    let idle = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      if (!mq.matches) return;
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(() => setReady(true), { timeout: 900 });
      else timer = setTimeout(() => setReady(true), 300);
    };
    schedule();
    mq.addEventListener("change", schedule);
    return () => {
      mq.removeEventListener("change", schedule);
      if (idle) window.cancelIdleCallback(idle);
      if (timer) clearTimeout(timer);
    };
  }, []);

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const hero = (el.closest(".pv-svc-hero") as HTMLElement | null) ?? el;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add(STATIC_QUERY, () => {
      el.classList.add("is-ready");
    });

    mm.add(`${SCENE_QUERY} and ${DECK_QUERY}`, () => {
      const cards = q(".pv-svc-deck-card") as HTMLElement[];
      const deals = q(".pv-svc-deck-deal") as HTMLElement[];
      const floats = q(".pv-svc-deck-float") as HTMLElement[];

      const geo = { w: 1, h: 1, cw: 1, cx: cards.map(() => 0), cy: cards.map(() => 0) };
      const measure = () => {
        geo.w = el.offsetWidth;
        geo.h = el.offsetHeight;
        geo.cw = cards[0]?.offsetWidth ?? 1;
        cards.forEach((c, i) => {
          geo.cx[i] = c.offsetLeft;
          geo.cy[i] = c.offsetTop;
        });
      };
      measure();

      gsap.set(cards, { xPercent: -50, yPercent: -50, x: 0, y: 0, rotation: (i: number) => FAN[i].r });
      gsap.set(floats, { transformPerspective: 900 });

      // Dealt out from a pile at the bottom of the deck.
      el.classList.add("is-ready");
      gsap.from(deals, {
        x: (i: number) => geo.w * 0.5 - geo.cx[i],
        y: (i: number) => geo.h * 0.85 - geo.cy[i],
        rotation: (i: number) => PILE[i].r - FAN[i].r,
        scale: 0.86, autoAlpha: 0, duration: 1.15, ease: "power3.out",
        stagger: 0.07, delay: 0.35,
      });

      // Scrolling towards the desk gathers them up and carries the pile down into it.
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hero, start: "top top", end: "bottom top", scrub: 0.6,
          invalidateOnRefresh: true, onRefreshInit: measure,
        },
      });
      cards.forEach((card, i) => {
        tl.to(card, {
          x: () => geo.w * 0.5 - geo.cx[i] + PILE[i].x * geo.cw,
          y: () => geo.h * 0.5 - geo.cy[i],
          rotation: PILE[i].r, duration: 0.45, ease: "power2.inOut",
        }, i * 0.025);
      });
      tl.fromTo(el, { y: 0 }, { y: () => hero.offsetHeight * 1.35, duration: 1, ease: "power1.in" }, 0)
        .fromTo(el, { scale: 1 }, { scale: 0.72, duration: 0.55, ease: "power1.in" }, 0.35)
        .fromTo(el, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.22, ease: "power1.in" }, 0.66);

      // A little lean towards the mouse, deeper cards moving further.
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      const to = floats.map((f) => ({
        x: gsap.quickTo(f, "x", { duration: 0.9, ease: "power3" }),
        y: gsap.quickTo(f, "y", { duration: 0.9, ease: "power3" }),
        rx: gsap.quickTo(f, "rotationX", { duration: 0.9, ease: "power3" }),
        ry: gsap.quickTo(f, "rotationY", { duration: 0.9, ease: "power3" }),
      }));
      const lean = (mx: number, my: number) => {
        to.forEach((t, i) => {
          const d = FAN[i].d;
          t.x(mx * 16 * d);
          t.y(my * 12 * d);
          t.ry(mx * 7);
          t.rx(my * -6);
        });
      };
      const onMove = (e: PointerEvent) => {
        const r = hero.getBoundingClientRect();
        lean((e.clientX / window.innerWidth - 0.5) * 2, ((e.clientY - r.top) / r.height - 0.5) * 2);
      };
      const onLeave = () => lean(0, 0);
      hero.addEventListener("pointermove", onMove);
      hero.addEventListener("pointerleave", onLeave);
      return () => {
        hero.removeEventListener("pointermove", onMove);
        hero.removeEventListener("pointerleave", onLeave);
      };
    });

    return () => {
      mm.revert();
      el.classList.remove("is-ready");
    };
  });

  return (
    <div className="pv-svc-deck" ref={root}>
      <ul className="pv-svc-deck-list">
        {pvServices.map((s, i) => {
          const f = FAN[i % FAN.length];
          return (
            <li
              className="pv-svc-deck-card"
              key={s.slug}
              style={{ left: `${f.x}%`, top: `${f.y}%`, zIndex: i < 3 ? 1 + i : 5 + i, ["--pv-svc-r" as string]: `${f.r}deg` }}
            >
              <div className="pv-svc-deck-deal">
                <div className="pv-svc-deck-float">
                  <div className="pv-svc-deck-face">
                    <Link href={pv(s.path)} className="pv-svc-deck-hit" aria-label={s.name} data-cursor />
                    <span className="pv-svc-deck-view" aria-hidden="true">
                      {ready && (
                        <span className="pv-svc-deck-stage" inert>
                          <MiniVisual service={s} />
                        </span>
                      )}
                    </span>
                    <p className="pv-svc-deck-label">
                      <span>{s.name}</span>
                      <Arrow />
                    </p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
