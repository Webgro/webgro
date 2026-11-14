"use client";

import Link from "next/link";
import { useRef, ViewTransition } from "react";
import type { CaseStudy } from "@/content/work";
import { pv } from "../links";
import { SCENE_QUERY, useGsap } from "../useGsap";
import type { Asset } from "./assets";
import { Count } from "./Beats";
import { Placeholder } from "./Media";
import { counter } from "./motion";
import type { Figure, Segment } from "./structure";
import { NewTag } from "../NewTag";

const domainOf = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

/**
 * The cover is the hero photograph, full screen, with the client's name, one
 * line about the project and the project details on it. Case studies with
 * figures show them in a row underneath; the rest go straight into the story.
 */
export function Opening({ cs, hero, headline }: { cs: CaseStudy; hero: Asset | null; headline: Figure[]; segments: Segment[] }) {
  const root = useRef<HTMLElement>(null);
  // A case study without figures falls back to its timeline, which is already on the cover.
  const figures = headline.filter((f) => f.label !== "Timeline");

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add(SCENE_QUERY, () => {
      const restores: Array<() => void> = [];
      (q(".pv-cs-head-value[data-end]") as HTMLElement[]).forEach((node, i) => {
        const c = counter(node);
        c.render();
        restores.push(c.restore);
        gsap.to(c.state, {
          v: c.end, duration: 1.7, delay: i * 0.14, ease: "power2.out", onUpdate: c.render,
          scrollTrigger: { trigger: q(".pv-cs-heads")[0], start: "top 85%" },
        });
      });

      // The photograph drifts a little slower than the page as you scroll past it.
      const img = q(".pv-cs-cover-media img")[0];
      if (img) {
        gsap.fromTo(img, { yPercent: 0, scale: 1.04 }, {
          yPercent: 10, ease: "none",
          scrollTrigger: { trigger: q(".pv-cs-cover")[0], start: "top top", end: "bottom top", scrub: true },
        });
      }
      return () => restores.forEach((r) => r());
    });
    return () => mm.revert();
  });

  return (
    <section className="pv-cs-open" ref={root}>
      <div className="pv-cs-cover" data-pv-theme="ink">
        <div className="pv-cs-cover-media">
          {hero ? (
            <ViewTransition name={`case-${cs.slug}`} share="morph" default="none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hero.src} alt={cs.heroImageAlt} width={hero.w} height={hero.h} fetchPriority="high" draggable={false} />
            </ViewTransition>
          ) : (
            <Placeholder label={cs.heroImageAlt} />
          )}
        </div>
        <div className="pv-cs-cover-shade" aria-hidden="true" />
        <div className="pv-cs-cover-text">
          <p className="pv-cs-crumb">
            <Link href={pv("/work")} className="pv-textlink" data-cursor>All work</Link>
            <span>{cs.tag}</span>
            <span>{cs.year}</span>
            <NewTag slug={cs.slug} />
          </p>
          <h1 className={`pv-h1 pv-cs-title${cs.client.length > 14 ? " is-long" : ""}`}>
            <span className="pv-line"><span>{cs.client}</span></span>
          </h1>
          <p className="pv-cs-cover-lede">{cs.excerpt}</p>
          <dl className="pv-cs-meta">
            <div><dt>Services</dt><dd>{cs.services.join(", ")}</dd></div>
            <div><dt>Timeline</dt><dd>{cs.timeline}</dd></div>
            {cs.url && (
              <div>
                <dt>Live site</dt>
                <dd>
                  <a href={cs.url} target="_blank" rel="noopener noreferrer" className="pv-textlink" data-cursor>
                    {domainOf(cs.url)}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {figures.length > 0 && (
        <div className="pv-cs-open-inner" data-pv-theme="paper">
          <ul className="pv-cs-heads" aria-label="Key figures">
            {figures.map((f, i) => (
              <li className="pv-cs-head" key={i}>
                <Count value={f.value} className={`pv-cs-head-value${f.value.length > 6 ? " is-long" : ""}`} />
                <p>
                  {f.eyebrow && <strong>{f.eyebrow}</strong>}
                  <span>{f.label}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
