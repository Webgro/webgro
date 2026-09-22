"use client";

import Link from "next/link";
import { useRef, ViewTransition } from "react";
import type { CaseStudy } from "@/content/work";
import { BrushStroke } from "../Brush";
import { pv } from "../links";
import { SCENE_QUERY, STATIC_QUERY, useGsap } from "../useGsap";
import type { Asset } from "./assets";
import { BeatView } from "./Beats";
import { Placeholder } from "./Media";
import type { Journey } from "./structure";
import { summaries } from "./summaries";

const domainOf = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

/** What it all meant: the change in one sentence, every figure in one place, what we delivered, and the live site. */
export function Outcome({ cs, journey }: { cs: CaseStudy; journey: Journey }) {
  const root = useRef<HTMLDivElement>(null);
  const statement = summaries[cs.slug]?.changed ?? cs.excerpt;
  const deliverables = journey.deliverables.flatMap((d) => d.items);

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);

    gsap.fromTo(q(".pv-cs-out-word"), { opacity: 0.13 }, {
      opacity: 1, ease: "none", stagger: 0.1,
      scrollTrigger: { trigger: q(".pv-cs-out-text")[0], start: "top 80%", end: "bottom 58%", scrub: 0.4 },
    });
    gsap.fromTo(q(".pv-cs-out-brush"), { clipPath: "inset(0% 100% 0% 0%)" }, {
      clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: q(".pv-cs-out-head")[0], start: "top 66%" },
    });

    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      gsap.from(q(".pv-cs-out-head .pv-line > span"), {
        yPercent: 110, duration: 1.1, ease: "power3.out", stagger: 0.09,
        scrollTrigger: { trigger: q(".pv-cs-out-head")[0], start: "top 76%" },
      });
      q(".pv-cs-tally li, .pv-cs-deliver li").forEach((row) => {
        gsap.from(row, {
          y: 22, autoAlpha: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 92%" },
        });
      });
      gsap.from(q(".pv-cs-live > *"), {
        y: 40, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: q(".pv-cs-live")[0], start: "top 86%" },
      });
    });
    return () => mm.revert();
  });

  return (
    <div className="pv-cs-out" ref={root}>
      <div className="pv-cs-out-head">
        <p className="pv-label">Results</p>
        <h2 className="pv-h2">
          <span className="pv-line"><span>What{" "}
            <span className="pv-brushed">changed<BrushStroke className="pv-cs-out-brush" /></span>
          </span></span>
          <span className="pv-line"><span>for {cs.client}</span></span>
        </h2>
      </div>

      <p className="pv-cs-out-text">
        {statement.split(" ").map((w, i) => (
          <span className="pv-cs-out-word" key={i}>{w} </span>
        ))}
      </p>

      {journey.outcomeBeats.length > 0 && (
        <div className="pv-cs-beats">
          {journey.outcomeBeats.map((b, i) => <BeatView key={i} beat={b} />)}
        </div>
      )}

      {journey.figures.length > 0 && journey.outcomeBeats.length === 0 && (
        <div className="pv-cs-out-block">
          <h3 className="pv-h3">Figures</h3>
          <ul className="pv-cs-tally">
            {journey.figures.map((f, i) => (
              <li key={i}>
                <strong>{f.value}</strong>
                <span>{[f.eyebrow, f.label].filter(Boolean).join(", ")}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {deliverables.length > 0 && (
        <div className="pv-cs-out-block">
          <h3 className="pv-h3">Deliverables</h3>
          <ol className="pv-cs-deliver">
            {deliverables.map((d) => <li key={d}>{d}</li>)}
          </ol>
        </div>
      )}

      {cs.url && (
        <a className="pv-cs-live" href={cs.url} target="_blank" rel="noopener noreferrer" data-cursor>
          <span className="pv-label">Visit the live site</span>
          <span className="pv-cs-live-url">
            <span>{domainOf(cs.url)}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M8 6h10v10" /></svg>
          </span>
        </a>
      )}
    </div>
  );
}

export type NextCase = {
  slug: string;
  client: string;
  tag: string;
  excerpt: string;
  heroImageAlt: string;
  hero: Asset | null;
};

/**
 * The handoff. The next project's image starts as a small card and grows until
 * it fills the stage; clicking through morphs it into that case study's hero.
 */
export function NextProject({ next, onLeave }: { next: NextCase; onLeave: () => void }) {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add(SCENE_QUERY, () => {
      el.classList.add("is-scene");
      const media = q(".pv-cs-next-media")[0];
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: q(".pv-cs-next-stage")[0], start: "top top", end: "+=130%",
          pin: true, scrub: 0.5, anticipatePin: 1, invalidateOnRefresh: true,
        },
      });
      tl.fromTo(media, { scale: 0.34 }, { scale: 1, duration: 2 }, 0)
        .fromTo(q(".pv-cs-next-bar span"), { scaleX: 0 }, { scaleX: 1, duration: 2, ease: "none" }, 0)
        .to({}, { duration: 0.35 });

      gsap.from(q(".pv-cs-next-copy .pv-line > span"), {
        yPercent: 110, duration: 1.1, ease: "power3.out", stagger: 0.09,
        scrollTrigger: { trigger: el, start: "top 55%" },
      });
      gsap.from(q(".pv-cs-next-kicker, .pv-cs-next-side > *"), {
        y: 26, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 50%" },
      });
      return () => el.classList.remove("is-scene");
    });

    mm.add(STATIC_QUERY, () => {
      gsap.from(q(".pv-cs-next-stage > *"), {
        autoAlpha: 0, duration: 0.9, stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 75%" },
      });
    });
    return () => mm.revert();
  });

  return (
    <section className="pv-cs-next" data-pv-theme="paper" ref={root}>
      <Link
        href={pv(`/work/${next.slug}`)}
        className="pv-cs-next-stage"
        onClick={onLeave}
        data-cursor
        aria-label={`Next project: ${next.client}`}
      >
        <div className="pv-cs-next-copy">
          <div>
            <p className="pv-label pv-cs-next-kicker">Next project</p>
            <h2 className={`pv-cs-next-name${next.client.length > 14 ? " is-long" : ""}`}>
              <span className="pv-line"><span>{next.client}</span></span>
            </h2>
          </div>
          <div className="pv-cs-next-side">
            <p>{next.excerpt}</p>
            <span className="pv-textlink">Read the case study</span>
          </div>
        </div>
        <div className="pv-cs-next-media" {...(next.hero ? { "data-pv-gl": "" } : {})}>
          {next.hero ? (
            <ViewTransition name={`case-${next.slug}`} share="morph" default="none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={next.hero.src} alt={next.heroImageAlt} width={next.hero.w} height={next.hero.h} loading="lazy" draggable={false} />
            </ViewTransition>
          ) : (
            <Placeholder label={next.heroImageAlt} name={next.client} />
          )}
        </div>
        <div className="pv-cs-next-bar" aria-hidden="true"><span /></div>
      </Link>
    </section>
  );
}
