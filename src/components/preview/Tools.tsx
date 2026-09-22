"use client";

import Link from "next/link";
import { useRef } from "react";
import { Mockup } from "@/components/mockups";
import { tools } from "./content";
import { SCENE_QUERY, useGsap } from "./useGsap";

export function Tools() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    gsap.from(q(".pv-tools-head > *"), {
      yPercent: 40, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: root.current, start: "top 72%" },
    });

    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      const cards = q(".pv-tool");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.fromTo(card.querySelector(".pv-tool-inner"), { scale: 1, yPercent: 0, filter: "brightness(1)" }, {
          scale: 0.9, yPercent: -4, filter: "brightness(0.4)", ease: "none",
          scrollTrigger: { trigger: next, start: "top bottom", end: "top 14%", scrub: true },
        });
      });
    });
    return () => mm.revert();
  });

  return (
    <section className="pv-tools" ref={root} data-pv-theme="ink">
      <div className="pv-tools-head">
        <h2 className="pv-h2">Custom software and AI tools</h2>
        <p className="pv-lede">
          The AI tools we&rsquo;ve built save more than £30,000 a year. We can&rsquo;t talk about most of them,
          but these three are used by our clients every day.
        </p>
      </div>
      <div className="pv-tools-stack">
        {tools.map((t) => (
          <article className="pv-tool" key={t.client}>
            <div className="pv-tool-inner">
              <div className="pv-tool-copy">
                <p className="pv-label">{t.client}</p>
                <h3 className="pv-h3">{t.title}</h3>
                <p>{t.body}</p>
                <Link href={t.href} className="pv-textlink" data-cursor>Read the case study</Link>
              </div>
              <div className="pv-tool-demo" aria-hidden="true" inert>
                <div className="pv-tool-demo-scale"><Mockup name={t.mockup} /></div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
