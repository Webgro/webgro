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
import { summaries } from "./summaries";

const domainOf = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

/**
 * The whole story on one screen: who the client is, what they needed, what we
 * did, what changed, and the two or three figures that matter most. The hero
 * image waits at the bottom edge and grows to full width as the reader moves on.
 */
export function Opening({ cs, hero, headline, segments }: { cs: CaseStudy; hero: Asset | null; headline: Figure[]; segments: Segment[] }) {
  const root = useRef<HTMLElement>(null);
  const summary = summaries[cs.slug];
  const rows = summary
    ? [
        { term: "The brief", text: summary.ask },
        { term: "What we did", text: summary.did },
        { term: "Results", text: summary.changed },
      ]
    : [{ term: "Summary", text: cs.excerpt }];

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add(SCENE_QUERY, () => {
      // Headline figures count up once, shortly after the page settles.
      const restores: Array<() => void> = [];
      (q(".pv-cs-head-value[data-end]") as HTMLElement[]).forEach((node, i) => {
        const c = counter(node);
        c.render();
        restores.push(c.restore);
        gsap.to(c.state, { v: c.end, duration: 1.7, delay: 0.55 + i * 0.14, ease: "power2.out", onUpdate: c.render });
      });

      // The hero image starts as a card and grows to the full width of the page.
      const media = q(".pv-cs-hero-media")[0];
      if (media) {
        gsap.fromTo(media, { scale: () => (window.innerWidth < 900 ? 0.88 : 0.76) }, {
          scale: 1, ease: "none",
          scrollTrigger: {
            trigger: q(".pv-cs-hero")[0], start: "top bottom", end: "top 14%", scrub: 0.5, invalidateOnRefresh: true,
          },
        });
      }
      return () => restores.forEach((r) => r());
    });
    return () => mm.revert();
  });

  return (
    <section className="pv-cs-open" data-pv-theme="paper" ref={root}>
      <div className="pv-cs-open-inner">
        <p className="pv-cs-crumb">
          <Link href={pv("/work")} className="pv-textlink" data-cursor>All work</Link>
          <span>{cs.tag}</span>
          <span>{cs.year}</span>
        </p>

        <h1 className={`pv-h1 pv-cs-title${cs.client.length > 14 ? " is-long" : ""}`}>
          <span className="pv-line"><span>{cs.client}</span></span>
        </h1>

        {segments.length > 2 && (
          <nav className="pv-cs-jump" aria-label="Case study sections">
            <span className="pv-cs-jump-label">Jump to</span>
            {segments.map((seg) => (
              <a
                key={seg.id}
                href={`#${seg.id}`}
                data-cursor
                onClick={(e) => {
                  const target = document.getElementById(seg.id);
                  if (!target) return;
                  e.preventDefault();
                  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                  window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + 2, behavior: reduce ? "auto" : "smooth" });
                }}
              >
                {seg.label}
              </a>
            ))}
          </nav>
        )}

        <div className="pv-cs-open-grid">
          <dl className="pv-cs-ledger">
            {rows.map((r) => (
              <div className="pv-cs-ledger-row" key={r.term}>
                <dt>{r.term}</dt>
                <dd>{r.text}</dd>
              </div>
            ))}
          </dl>

          {headline.length > 0 && (
            <ul className="pv-cs-heads" aria-label="Key figures">
              {headline.map((f, i) => (
                <li className="pv-cs-head" key={i}>
                  <Count value={f.value} className={`pv-cs-head-value${f.value.length > 6 ? " is-long" : ""}`} />
                  <p>
                    {f.eyebrow && <strong>{f.eyebrow}</strong>}
                    <span>{f.label}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <dl className="pv-cs-meta">
          <div><dt>Services</dt><dd>{cs.services.join(", ")}</dd></div>
          <div><dt>Built with</dt><dd>{cs.stack.join(", ")}</dd></div>
          {headline[0]?.label !== "Timeline" && <div><dt>Timeline</dt><dd>{cs.timeline}</dd></div>}
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

      <div className="pv-cs-hero">
        <div className="pv-cs-hero-media" {...(hero ? { "data-pv-gl": "" } : {})}>
          {hero ? (
            <ViewTransition name={`case-${cs.slug}`} share="morph" default="none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hero.src} alt={cs.heroImageAlt} width={hero.w} height={hero.h} fetchPriority="high" draggable={false} />
            </ViewTransition>
          ) : (
            <Placeholder label={cs.heroImageAlt} />
          )}
        </div>
      </div>
    </section>
  );
}
