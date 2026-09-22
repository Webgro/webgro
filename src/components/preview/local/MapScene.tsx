"use client";

import { useId, useRef } from "react";
import { SCENE_QUERY, STATIC_QUERY, useGsap } from "../useGsap";
import type { TownSlug } from "./content";

/**
 * A plain map of east Berkshire, drawn to scale from real coordinates
 * (equirectangular, 1 mile = 43.9 units). No county outline, because a rough
 * one would be wrong. The rings are straight-line distances from the office.
 *
 * It sits in the page hero. When it first comes into view (straight away on
 * desktop, under the intro on smaller screens) the rings open out from the
 * office, then a line is drawn from the office to the town the page is about
 * (or to every town on the Bracknell page and the hub) with a dot riding the
 * end of it, and the town labels settle in. On wide screens the map then
 * drifts and zooms a little as the hero scrolls away.
 *
 * The SVG has a fixed aspect ratio from the first paint, so nothing moves when
 * the scene starts. The `is-scene` class is in the markup and only hides the
 * parts GSAP places first. Reduced motion drops the class and shows the
 * finished map, and a CSS fallback reveals it if the script never runs.
 */

const W = 1000;
const H = 700;
const MILE = 43.9;

const OFFICE = { x: 513, y: 400 };

type Anchor = "right" | "left" | "above" | "below";
/** `narrow` swaps the label side on phones, where labels are larger than the map. */
type Place = { x: number; y: number; name: string; anchor: Anchor; narrow?: Anchor };

const TOWNS: Record<Exclude<TownSlug, "bracknell">, Place> = {
  reading: { x: 136, y: 290, name: "Reading", anchor: "above" },
  wokingham: { x: 408, y: 420, name: "Wokingham", anchor: "left" },
  windsor: { x: 841, y: 200, name: "Windsor", anchor: "right", narrow: "above" },
  maidenhead: { x: 627, y: 85, name: "Maidenhead", anchor: "right", narrow: "left" },
};

/** Faint context towns, labelled on wider screens only. */
const CONTEXT: Place[] = [
  { x: 706, y: 424, name: "Ascot", anchor: "right" },
  { x: 859, y: 120, name: "Slough", anchor: "right" },
  { x: 464, y: 610, name: "Sandhurst", anchor: "below" },
  { x: 487, y: 543, name: "Crowthorne", anchor: "right" },
  { x: 352, y: 222, name: "Twyford", anchor: "above" },
];

const RINGS = [5, 10];

/** Curves the route slightly, so it doesn't look ruled. */
function routePath(to: { x: number; y: number }) {
  const dx = to.x - OFFICE.x;
  const dy = to.y - OFFICE.y;
  const mx = OFFICE.x + dx / 2 - dy * 0.14;
  const my = OFFICE.y + dy / 2 + dx * 0.14;
  return `M${OFFICE.x} ${OFFICE.y} Q${mx.toFixed(1)} ${my.toFixed(1)} ${to.x} ${to.y}`;
}

const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;

/** Wide screens get the load-in scene plus the scroll drift. */
export const MAP_WIDE = "(min-width: 1100px)";

export function MapScene({
  focus,
  drives,
  label,
}: {
  /** The town the page is about. Bracknell and the hub draw every route. */
  focus: TownSlug | "all";
  drives: Partial<Record<TownSlug, string>>;
  label: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const gridId = `pv-local-grid-${useId().replace(/:/g, "")}`;
  const keys = Object.keys(TOWNS) as Array<keyof typeof TOWNS>;
  const routes = keys.filter((t) => focus === "all" || focus === "bracknell" || t === focus);
  const single = routes.length === 1;
  // The focus town is drawn last so its label sits on top.
  const order = [...keys.filter((t) => !routes.includes(t)), ...routes];

  useGsap(root, ({ gsap, ScrollTrigger }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add(SCENE_QUERY, () => {
      const paths = q(".pv-local-route") as unknown as SVGPathElement[];
      const riders = q(".pv-local-traveller") as unknown as SVGCircleElement[];
      const office = `${OFFICE.x} ${OFFICE.y}`;
      const at = (n: Element) => `${n.getAttribute("cx")} ${n.getAttribute("cy")}`;

      // Starting states, then the parts can be shown.
      gsap.set(q(".pv-local-grid"), { opacity: 0 });
      gsap.set(q(".pv-local-ring"), { scale: 0.15, opacity: 0, svgOrigin: office });
      gsap.set(q(".pv-local-office, .pv-local-office-halo"), { scale: 0, svgOrigin: office });
      gsap.set(q(".pv-local-ctx, .pv-local-ctxlabel, .pv-local-ringlabel"), { opacity: 0 });
      gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(riders, { opacity: 0 });
      q(".pv-local-town, .pv-local-ripple").forEach((d) => gsap.set(d, { scale: 0, svgOrigin: at(d) }));
      gsap.set(q(".pv-local-tag"), { opacity: 0, y: 12 });
      el.classList.add("is-ready");

      const DRAW = single ? 1.3 : 1.1;
      const GAP = 0.12;
      const START = 0.7;
      const tl = gsap.timeline({ paused: true, delay: 0.3 });

      tl.to(q(".pv-local-grid"), { opacity: 1, duration: 1.2, ease: "power1.out" }, 0)
        .to(q(".pv-local-office"), { scale: 1, duration: 0.55, ease: "back.out(2.4)" }, 0)
        .to(q(".pv-local-office-halo"), { scale: 1, duration: 0.9, ease: "power3.out" }, 0.1)
        .to(q(".pv-local-tag--office"), { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.2)
        .to(q(".pv-local-ring"), { scale: 1, opacity: 1, duration: 1.3, ease: "power3.out", stagger: 0.16 }, 0.15)
        .to(q(".pv-local-ringlabel"), { opacity: 1, duration: 0.5, stagger: 0.16 }, 0.7)
        .to(q(".pv-local-ctx, .pv-local-ctxlabel"), { opacity: 1, duration: 0.5, stagger: 0.04 }, 0.5);

      paths.forEach((path, i) => {
        const rider = riders[i];
        const len = path.getTotalLength();
        const t0 = START + i * GAP;
        const pos = { t: 0 };
        tl.to(pos, {
          t: 1, duration: DRAW, ease: "power2.inOut",
          onUpdate: () => {
            path.style.strokeDashoffset = String(1 - pos.t);
            if (!rider) return;
            const p = path.getPointAtLength(len * pos.t);
            rider.setAttribute("cx", p.x.toFixed(1));
            rider.setAttribute("cy", p.y.toFixed(1));
          },
        }, t0);
        if (rider) {
          tl.to(rider, { opacity: 1, duration: 0.2 }, t0)
            .to(rider, { opacity: 0, duration: 0.3 }, t0 + DRAW);
        }
      });

      // Every town dot pops in; the routed ones as their line arrives.
      order.forEach((t) => {
        const i = routes.indexOf(t);
        const arrive = i < 0 ? START + 0.3 : START + i * GAP + DRAW - 0.08;
        tl.to(q(`.pv-local-town[data-t="${t}"]`), { scale: 1, duration: 0.5, ease: "back.out(2.6)" }, arrive)
          .to(q(`.pv-local-pin[data-t="${t}"] .pv-local-tag`), { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, arrive + 0.08);
        if (i >= 0) {
          tl.fromTo(q(`.pv-local-ripple[data-t="${t}"]`), { scale: 0.6, opacity: 0.55 }, {
            scale: 3.2, opacity: 0, duration: 1.1, ease: "power2.out", immediateRender: false,
          }, arrive);
        }
      });

      // Plays when the map is in view: straight away on desktop, and when it
      // scrolls up on phones, where it sits under the intro.
      const st = ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: () => tl.play() });

      return () => {
        st.kill();
        el.classList.remove("is-ready");
      };
    });

    mm.add(`${SCENE_QUERY} and ${MAP_WIDE}`, () => {
      const hero = el.closest("section") ?? el;
      gsap.fromTo(q(".pv-local-drift"), { yPercent: 0, scale: 1 }, {
        yPercent: 9, scale: 1.1, ease: "none",
        transformOrigin: `${pct(OFFICE.x, W)} ${pct(OFFICE.y, H)}`,
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.5 },
      });
    });

    mm.add(STATIC_QUERY, () => {
      el.classList.remove("is-scene");
    });

    return () => mm.revert();
  });

  return (
    <div className="pv-local-mapbox is-scene" ref={root}>
      <div className="pv-local-mapclip">
        <div className="pv-local-drift">
          <svg className="pv-local-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
            {/* A faint dot every mile, lined up on the office. */}
            <defs>
              <pattern
                id={gridId}
                width={MILE}
                height={MILE}
                patternUnits="userSpaceOnUse"
                x={OFFICE.x - MILE / 2}
                y={OFFICE.y - MILE / 2}
              >
                <circle cx={MILE / 2} cy={MILE / 2} r={1.8} />
              </pattern>
            </defs>
            <rect className="pv-local-grid" width={W} height={H} fill={`url(#${gridId})`} />
            {RINGS.map((m) => (
              <circle key={m} className="pv-local-ring" cx={OFFICE.x} cy={OFFICE.y} r={m * MILE} />
            ))}
            {CONTEXT.map((c) => (
              <circle key={c.name} className="pv-local-ctx" cx={c.x} cy={c.y} r={6} />
            ))}
            {routes.map((t) => (
              <path key={t} className="pv-local-route" d={routePath(TOWNS[t])} pathLength={1} />
            ))}
            {routes.map((t) => (
              <circle key={t} className="pv-local-ripple" data-t={t} cx={TOWNS[t].x} cy={TOWNS[t].y} r={14} />
            ))}
            {order.map((t) => (
              <circle
                key={t}
                data-t={t}
                className={`pv-local-town${routes.includes(t) ? " is-on" : ""}`}
                cx={TOWNS[t].x}
                cy={TOWNS[t].y}
                r={routes.includes(t) ? 13 : 9}
              />
            ))}
            {routes.map((t) => (
              <circle key={t} className="pv-local-traveller" cx={OFFICE.x} cy={OFFICE.y} r={single ? 10 : 8} />
            ))}
            <circle className="pv-local-office-halo" cx={OFFICE.x} cy={OFFICE.y} r={30} />
            <circle className="pv-local-office" cx={OFFICE.x} cy={OFFICE.y} r={15} />
          </svg>

          <div className="pv-local-labels" aria-hidden="true">
            {RINGS.map((m) => (
              <span
                key={m}
                className="pv-local-ringlabel"
                style={{ left: pct(OFFICE.x - m * MILE * 0.94, W), top: pct(OFFICE.y + m * MILE * 0.34, H) }}
              >
                {m} miles
              </span>
            ))}
            {CONTEXT.map((c) => (
              <span
                key={c.name}
                className={`pv-local-ctxlabel pv-local-at--${c.anchor}`}
                style={{ left: pct(c.x, W), top: pct(c.y, H) }}
              >
                {c.name}
              </span>
            ))}
            <span className="pv-local-pin pv-local-at--right" style={{ left: pct(OFFICE.x, W), top: pct(OFFICE.y, H) }}>
              <span className="pv-local-tag pv-local-tag--office">
                <strong>Bracknell</strong>
                <small>Our office</small>
              </span>
            </span>
            {order.map((t) => {
              const p = TOWNS[t];
              return (
                <span
                  key={t}
                  data-t={t}
                  className={`pv-local-pin pv-local-at--${p.anchor}${p.narrow ? ` pv-local-atn--${p.narrow}` : ""}${routes.includes(t) ? " is-on" : ""}`}
                  style={{ left: pct(p.x, W), top: pct(p.y, H) }}
                >
                  <span className="pv-local-tag">
                    <strong>{p.name}</strong>
                    {drives[t] && <small>{drives[t]}</small>}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <p className="pv-local-mapnote">Rings show straight-line distance from our office. Times are by car and depend on traffic.</p>
    </div>
  );
}
