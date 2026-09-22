"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SCENE_QUERY, useGsap } from "../useGsap";
import { ArticleCard } from "./ArticleCard";
import { inWords, type ArticleSummary } from "./lines";

type Gsap = typeof import("gsap").default;
type ScrollTriggerStatic = typeof import("gsap/ScrollTrigger").ScrollTrigger;
type Motion = { gsap: Gsap; ScrollTrigger: ScrollTriggerStatic; reveals: ReturnType<Gsap["timeline"]>[] };

const VISIBLE = ".pv-jrnl-card:not([hidden])";

/**
 * The contents page: every article on paper as a picture-led grid. The newest
 * takes the wide slot, the next sits beside it, and the rest run in threes.
 * Pictures wipe up and titles rise out of masks as each card arrives. Picking
 * a subject fades the cards out, re-forms the grid around what is left and
 * brings them back in.
 */
export function Contents({ articles }: { articles: ArticleSummary[] }) {
  const root = useRef<HTMLElement>(null);
  const motion = useRef<Motion | null>(null);
  const settled = useRef(false);
  // `filter` drives the buttons and the announcement straight away. `shown`
  // drives the grid, and follows once the old cards have faded out.
  const [filter, setFilter] = useState<string | null>(null);
  const [shown, setShown] = useState<string | null>(null);
  // Counts grid swaps, so the cards come back in even when a quick double click lands on the subject already shown.
  const [swaps, setSwaps] = useState(0);

  const subjects = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of articles) counts.set(a.category, (counts.get(a.category) ?? 0) + 1);
    return [...counts.entries()].map(([name, count]) => ({ name, count }));
  }, [articles]);

  // With no filter the newest article is already the cover story in the
  // masthead above, so the grid starts from the second one.
  const slots = useMemo(() => {
    let n = 0;
    return articles.map((a, i) =>
      shown === null ? (i === 0 ? -1 : n++) : a.category === shown ? n++ : -1,
    );
  }, [articles, shown]);

  const count = filter ? articles.filter((a) => a.category === filter).length : articles.length;
  const status = filter
    ? `Showing ${inWords(count)} of ${inWords(articles.length)} articles in ${filter}.`
    : `Showing all ${inWords(articles.length)} articles, newest first.`;

  useGsap(root, ({ gsap, ScrollTrigger }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add(SCENE_QUERY, () => {
      gsap.from(q(".pv-jrnl-contents-head > *"), {
        y: 34, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: q(".pv-jrnl-contents-head")[0], start: "top 82%" },
      });

      const reveals = (q(".pv-jrnl-card") as HTMLElement[]).map((card) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 88%" } });
        tl.fromTo(card.querySelector(".pv-jrnl-card-media"),
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.15, ease: "power3.inOut" }, 0)
          .fromTo(card.querySelector(".pv-jrnl-card-zoom img"),
            { scale: 1.16 }, { scale: 1, duration: 1.5, ease: "power3.out" }, 0)
          .from(card.querySelector(".pv-jrnl-card-meta"), { autoAlpha: 0, y: 14, duration: 0.7, ease: "power3.out" }, 0.4)
          .from(card.querySelector(".pv-jrnl-card-rise"), { yPercent: 104, duration: 1, ease: "power3.out" }, 0.45)
          .from(card.querySelector(".pv-jrnl-card-excerpt"), { autoAlpha: 0, y: 14, duration: 0.8, ease: "power3.out" }, 0.62);
        return tl;
      });

      motion.current = { gsap, ScrollTrigger, reveals };
      return () => {
        motion.current = null;
      };
    });

    return () => mm.revert();
  });

  // Once the grid has re-formed, bring the cards back in and let ScrollTrigger re-measure the page.
  useEffect(() => {
    const m = motion.current;
    if (!settled.current || !m || !root.current) return;
    const cards = root.current.querySelectorAll<HTMLElement>(VISIBLE);
    m.gsap.fromTo(cards, { autoAlpha: 0, y: 28 }, {
      autoAlpha: 1, y: 0, duration: 0.75, ease: "power3.out", stagger: 0.07, overwrite: true,
    });
    m.ScrollTrigger.refresh();
  }, [swaps]);

  const pick = (name: string | null) => {
    if (name === filter) return;
    setFilter(name);
    const m = motion.current;
    if (!m || !root.current) {
      setShown(name);
      return;
    }
    // The first time the grid re-forms, finish any scroll reveals that haven't played,
    // so a card never turns up half built in a new position.
    if (!settled.current) {
      settled.current = true;
      m.reveals.forEach((tl) => {
        tl.scrollTrigger?.kill();
        tl.progress(1);
      });
    }
    const cards = root.current.querySelectorAll<HTMLElement>(VISIBLE);
    m.gsap.to(cards, {
      autoAlpha: 0, y: 18, duration: 0.28, ease: "power2.in", stagger: 0.03, overwrite: true,
      onComplete: () => {
        setShown(name);
        setSwaps((n) => n + 1);
      },
    });
  };

  return (
    <section className="pv-jrnl-contents" ref={root} data-pv-theme="paper">
      <div className="pv-jrnl-contents-head">
        <h2 className="pv-h2">All articles</h2>
        <div className="pv-jrnl-filter" role="group" aria-label="Filter articles by subject">
          <button
            type="button"
            className={`pv-jrnl-filter-btn${filter === null ? " is-active" : ""}`}
            aria-pressed={filter === null}
            onClick={() => pick(null)}
            data-cursor
          >
            All<sup>{articles.length}</sup>
          </button>
          {subjects.map((s) => (
            <button
              type="button"
              key={s.name}
              className={`pv-jrnl-filter-btn${filter === s.name ? " is-active" : ""}`}
              aria-pressed={filter === s.name}
              onClick={() => pick(s.name)}
              data-cursor
            >
              {s.name}<sup>{s.count}</sup>
            </button>
          ))}
        </div>
      </div>

      <p className="pv-jrnl-status" aria-live="polite">{status}</p>

      <ol className="pv-jrnl-grid">
        {articles.map((a, i) => <ArticleCard key={a.slug} article={a} slot={slots[i]} />)}
      </ol>
    </section>
  );
}
