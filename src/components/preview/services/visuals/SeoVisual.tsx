"use client";

import { useRef } from "react";
import { BrushBand } from "../BrushBand";
import { useSceneOnly } from "./useSceneOnly";

const boards = [
  { query: "phone cases", client: "Fun Cases", note: "First on Google UK, for a term with more than 25,000 UK searches a month." },
  { query: "luxury suit", client: "Gieves & Hawkes", note: "First on Google UK, for a term with more than 16,000 searches a month." },
];
const OTHERS = 5;

/**
 * Two results pages. In each one the client's row starts at the bottom and
 * climbs to first place as you scroll, pushing the grey rows down as it
 * passes. Only the finishing positions are real, so nothing in between is
 * given a number.
 */
export function SeoVisual({ still = false }: { still?: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useSceneOnly(root, ({ inHero, timeline }) => {
    const el = root.current!;
    const gapB = inHero ? 1.4 : 0.18;
    const tl = timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el, start: "top 88%", end: "top 18%", scrub: 0.5 },
    }, 1.32);

    el.querySelectorAll<HTMLElement>(".pv-svc-seo-board").forEach((board, b) => {
      const at = b * gapB;
      const us = board.querySelector(".pv-svc-seo-row--us");
      const others = board.querySelectorAll(".pv-svc-seo-row:not(.pv-svc-seo-row--us)");
      const fill = board.querySelector(".pv-svc-seo-fill");
      const label = board.querySelector(".pv-svc-seo-row--us strong");

      tl.fromTo(us, { yPercent: OTHERS * 100 }, { yPercent: 0, duration: 1 }, at);
      others.forEach((row, k) => {
        tl.fromTo(row, { yPercent: -100 }, { yPercent: 0, duration: 1 / OTHERS, ease: "power1.inOut" }, at + (OTHERS - 1 - k) / OTHERS);
      });
      tl.fromTo(board.querySelector(".pv-svc-seo-climb"), { clipPath: "inset(100% -50% 0% -50%)" }, { clipPath: "inset(0% -50% 0% -50%)", duration: 1 }, at)
        .fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 0.22, ease: "power2.out" }, at + 1)
        .fromTo(label, { color: "#0d0d0f" }, { color: "#ffffff", duration: 0.15 }, at + 1.02)
        .fromTo(board.querySelector(".pv-svc-seo-note"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" }, at + 1.05);
    });
  }, still);

  return (
    <div className="pv-svc-seo" ref={root}>
      {boards.map((b, bi) => (
        <div className="pv-svc-seo-board" key={b.query}>
          <p className="pv-svc-seo-bar">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
            <span>{b.query}</span>
          </p>
          <div className="pv-svc-seo-list">
            <BrushBand className="pv-svc-seo-climb" vertical seed={bi + 6} />
            <ol className="pv-svc-seo-nums" aria-hidden="true">
              {Array.from({ length: OTHERS + 1 }, (_, i) => <li key={i}>{i + 1}</li>)}
            </ol>
            <ul className="pv-svc-seo-rows">
              <li className="pv-svc-seo-row pv-svc-seo-row--us">
                <span className="pv-svc-seo-fill" aria-hidden="true" />
                <strong>{b.client}</strong>
              </li>
              {Array.from({ length: OTHERS }, (_, i) => (
                <li className="pv-svc-seo-row" key={i} aria-hidden="true"><i style={{ width: `${62 - i * 7}%` }} /><i style={{ width: `${38 + ((i * 17) % 23)}%` }} /></li>
              ))}
            </ul>
          </div>
          <p className="pv-svc-seo-note">{b.note}</p>
        </div>
      ))}
    </div>
  );
}
