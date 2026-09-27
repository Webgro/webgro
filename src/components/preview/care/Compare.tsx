"use client";

import { useEffect, useRef } from "react";
import { SCENE_QUERY, useGsap } from "../useGsap";
import {
  carePlansByPlatform,
  carePlatforms,
  compareGroupsByPlatform,
  type CarePlatform,
  type CompareCell,
} from "./content";
import { Tick } from "./Plans";

function Cell({ value }: { value: CompareCell }) {
  if (value === true) {
    return (
      <>
        <Tick className="pv-care-tick pv-care-cmp-tick" />
        <span className="pv-care-sr">Included</span>
      </>
    );
  }
  if (value === false) {
    return (
      <>
        <span className="pv-care-cmp-none" aria-hidden="true" />
        <span className="pv-care-sr">Not included</span>
      </>
    );
  }
  return <span className="pv-care-cmp-val">{value}</span>;
}

/**
 * The full comparison. On a wide screen it is a four-column table with the
 * Growth column tinted blue. On a phone each row stacks: the feature on its own
 * line, then the three plans side by side, each cell carrying its plan name, so
 * nothing ever scrolls sideways.
 *
 * It follows the switch above the cards: one control drives both. Switching
 * crossfades the table, which is not a target of the row entrance scenes, so
 * nothing can be left hidden.
 */
export function Compare({ platform }: { platform: CarePlatform }) {
  const root = useRef<HTMLElement>(null);
  const gsapRef = useRef<typeof import("gsap").default | null>(null);
  const first = useRef(true);
  const plans = carePlansByPlatform[platform];
  const groups = compareGroupsByPlatform[platform];
  const platformName = carePlatforms.find((p) => p.id === platform)!.name;

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    gsapRef.current = gsap;

    mm.add(SCENE_QUERY, () => {
      gsap.from(q(".pv-care-cmp-head > *"), {
        yPercent: 40, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 75%" },
      });
      q(".pv-care-cmp-row").forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 92%" } });
        tl.from(row.querySelector(".pv-care-cmp-rule"), { scaleX: 0, duration: 1, ease: "power3.inOut" })
          .from(row.querySelectorAll(".pv-care-cmp-mask > span"), { yPercent: 110, duration: 0.8, ease: "power3.out" }, 0.1)
          .from(row.querySelectorAll(".pv-care-cmp-cell"), {
            y: 12, autoAlpha: 0, duration: 0.6, ease: "power3.out", stagger: 0.07,
          }, 0.2)
          .fromTo(row.querySelectorAll(".pv-care-cmp-tick path"), { strokeDasharray: 1, strokeDashoffset: 1 }, {
            strokeDashoffset: 0, duration: 0.5, ease: "power2.out", stagger: 0.07,
          }, 0.35);
      });
    });

    return () => {
      gsapRef.current = null;
      mm.revert();
    };
  });

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const gsap = gsapRef.current;
    const el = root.current;
    if (!gsap || !el || !window.matchMedia(SCENE_QUERY).matches) return;
    const table = el.querySelector(".pv-care-cmp-table");
    if (!table) return;
    gsap.fromTo(table, { autoAlpha: 0.2 }, {
      autoAlpha: 1, duration: 0.42, ease: "power2.out", overwrite: true, clearProps: "opacity,visibility",
    });
  }, [platform]);

  return (
    <section className="pv-care-cmp" ref={root} data-pv-theme="paper">
      <div className="pv-care-cmp-head">
        <p className="pv-label">Side by side</p>
        <h2 className="pv-h2">Compare the plans</h2>
        <p className="pv-care-cmp-plat">{platformName} plans</p>
      </div>

      <div className="pv-care-cmp-table" role="table" aria-label={`${platformName} care plans compared`}>
        <div className="pv-care-cmp-cols" role="rowgroup">
          <div className="pv-care-cmp-colrow" role="row">
            <span className="pv-care-cmp-corner" role="columnheader">
              <span className="pv-care-sr">Feature</span>
            </span>
            {plans.map((p) => (
              <span
                className={`pv-care-cmp-colhead${p.featured ? " is-featured" : ""}`}
                role="columnheader"
                key={p.id}
              >
                <strong>{p.name}</strong>
                <span>£{p.price} a month</span>
              </span>
            ))}
          </div>
        </div>

        {groups.map((g) => (
          <div className="pv-care-cmp-group" role="rowgroup" key={g.name}>
            <div className="pv-care-cmp-grouprow" role="row">
              <div className="pv-care-cmp-groupcell" role="cell">
                <h3 className="pv-care-cmp-groupname">{g.name}</h3>
              </div>
            </div>
            {g.rows.map((r) => (
              <div className="pv-care-cmp-row" role="row" key={r.label}>
                <span className="pv-care-cmp-rule" aria-hidden="true" />
                <span className="pv-care-cmp-feature" role="rowheader">
                  <span className="pv-care-cmp-mask">
                    <span>
                      {r.label}
                      {r.note && <em>{r.note}</em>}
                    </span>
                  </span>
                </span>
                {r.cells.map((c, i) => (
                  <span
                    className={`pv-care-cmp-cell${plans[i].featured ? " is-featured" : ""}`}
                    role="cell"
                    key={plans[i].id}
                  >
                    <span className="pv-care-cmp-plan" aria-hidden="true">{plans[i].name}</span>
                    <Cell value={c} />
                  </span>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
