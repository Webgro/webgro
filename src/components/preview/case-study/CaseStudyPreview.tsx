"use client";

import { useCallback, useMemo, useRef } from "react";
import type { CaseStudy } from "@/content/work";
import { Closing } from "../Closing";
import { createGlPlanes } from "../glPlanes";
import { PreviewShell } from "../PreviewShell";
import { SCENE_QUERY, useGsap } from "../useGsap";
import { ActOpener, BackgroundIntro } from "./Acts";
import type { Asset, AssetMap } from "./assets";
import { BeatView } from "./Beats";
import { NextProject, Outcome, type NextCase } from "./Ending";
import { CaseContext } from "./Media";
import { Opening } from "./Opening";
import { Spine } from "./Spine";
import { buildJourney } from "./structure";
import "./case-study.css";

/**
 * The redesigned case study. Instead of one long column of mixed blocks, the
 * page has a spine: a one-screen summary, the background, one act per chapter
 * (each opening with what it covers), results and comparisons staged as their
 * own moments, then the outcome and a handoff into the next project.
 */
export function CaseStudyPreview({
  caseStudy,
  hero,
  assets,
  next,
}: {
  caseStudy: CaseStudy;
  hero: Asset | null;
  assets: AssetMap;
  next: NextCase | null;
}) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const gl = useRef<{ stop: () => void } | null>(null);
  const journey = useMemo(() => buildJourney(caseStudy), [caseStudy]);
  const context = useMemo(() => ({ assets, client: caseStudy.client }), [assets, caseStudy.client]);

  useGsap(root, ({ gsap, ScrollTrigger }) => {
    const el = root.current!;
    const mm = gsap.matchMedia();

    mm.add(SCENE_QUERY, () => {
      // One WebGL layer for every photograph on the page. It only runs while
      // at least one of them is near the viewport.
      const targets = Array.from(el.querySelectorAll<HTMLElement>("[data-pv-gl]"));
      const planes = canvas.current && targets.length ? createGlPlanes(canvas.current, targets) : null;
      if (!planes) return;

      el.classList.add("has-gl");
      let stopped = false;
      const near = new Set<Element>();
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) near.add(e.target);
          else near.delete(e.target);
        }
        if (!stopped) planes.setRunning(near.size > 0);
      }, { rootMargin: "30% 0px" });
      targets.forEach((t) => io.observe(t));

      // Before a view transition, hand the picture back to the DOM so the
      // browser has a real image to morph.
      gl.current = {
        stop: () => {
          stopped = true;
          el.classList.add("is-leaving");
          planes.setRunning(false);
          targets.forEach((t) => t.classList.remove("is-gl"));
        },
      };

      return () => {
        gl.current = null;
        io.disconnect();
        planes.destroy();
        el.classList.remove("has-gl", "is-leaving");
      };
    });

    // Every scene below has registered by now. Put them in page order and measure once more.
    const settle = window.setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, 60);

    return () => {
      window.clearTimeout(settle);
      mm.revert();
    };
  });

  const onLeave = useCallback(() => gl.current?.stop(), []);

  return (
    <PreviewShell initialTheme="paper">
      <CaseContext.Provider value={context}>
        <article className="pv-cs" ref={root}>
          <canvas className="pv-cs-canvas" ref={canvas} aria-hidden="true" />

          <Opening cs={caseStudy} hero={hero} headline={journey.headline} segments={journey.segments} />

          <section className="pv-cs-sec pv-cs-sec--bg" id="background" data-pv-theme={journey.backgroundTheme}>
            <BackgroundIntro
              label="Background"
              text={journey.intro ?? caseStudy.excerpt}
            />
            {journey.prelude.length > 0 && (
              <div className="pv-cs-beats">
                {journey.prelude.map((b, i) => <BeatView key={i} beat={b} />)}
              </div>
            )}
          </section>

          {journey.acts.map((act, i) => (
            <section className="pv-cs-sec pv-cs-act" id={act.id} key={act.id} data-pv-theme={act.theme}>
              <ActOpener act={act} index={i} total={journey.acts.length} />
              <div className="pv-cs-beats">
                {act.beats.map((b, j) => <BeatView key={j} beat={b} />)}
              </div>
            </section>
          ))}

          <section className="pv-cs-sec pv-cs-sec--out" id="outcome" data-pv-theme="ink">
            <Outcome cs={caseStudy} journey={journey} />
          </section>

          {next && <NextProject next={next} onLeave={onLeave} />}
        </article>
        <Spine segments={journey.segments} />
      </CaseContext.Provider>
      <Closing />
    </PreviewShell>
  );
}
