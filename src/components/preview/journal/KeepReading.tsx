"use client";

import Link from "next/link";
import { useRef } from "react";
import { pv } from "../links";
import { SCENE_QUERY, useGsap } from "../useGsap";
import { ArticleRow } from "./ArticleRow";
import { lightRows, revealRows } from "./rowMotion";
import type { ArticleSummary } from "./lines";

/** The next articles in the run, set as typeset rows. */
export function KeepReading({ articles }: { articles: ArticleSummary[] }) {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap, ScrollTrigger }) => {
    const q = gsap.utils.selector(root.current!);
    const mm = gsap.matchMedia();

    mm.add(SCENE_QUERY, () => {
      gsap.from(q(".pv-jrnl-next-head > *"), {
        y: 34, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: q(".pv-jrnl-next-head")[0], start: "top 84%" },
      });
      revealRows(gsap, q(".pv-jrnl-row-link") as HTMLElement[]);
    });

    mm.add(`${SCENE_QUERY} and (hover: none)`, () => {
      lightRows(ScrollTrigger, q(".pv-jrnl-row-link") as HTMLElement[]);
    });

    return () => mm.revert();
  });

  if (!articles.length) return null;

  return (
    <section className="pv-jrnl-next" ref={root} data-pv-theme="ink">
      <div className="pv-jrnl-next-head">
        <h2 className="pv-h2">More articles</h2>
        <Link href={pv("/the-gro")} className="pv-textlink" data-cursor>View all articles</Link>
      </div>
      <ol className="pv-jrnl-list">
        {articles.map((a) => <ArticleRow key={a.slug} article={a} />)}
      </ol>
    </section>
  );
}
