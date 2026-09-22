"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { inWords } from "./lines";
import type { TocItem } from "./Blocks";

/**
 * The table of contents, set twice: a list that follows down the left of the
 * text on a wide screen, and a fold-away version above the text on a narrow
 * one. CSS shows whichever suits. The wide one marks the section being read.
 */
export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const heads = items
      .map((item) => document.getElementById(item.id))
      .filter((h): h is HTMLElement => h !== null);
    if (!heads.length) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let current = -1;
      heads.forEach((h, i) => {
        if (h.getBoundingClientRect().top <= line) current = i;
      });
      setActive((prev) => (prev === current ? prev : current));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  if (items.length < 2) return null;

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = target.getBoundingClientRect().top + window.scrollY - 104;
    window.scrollTo({ top, behavior: calm ? "auto" : "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  const list = (follow: boolean) => (
    <ol>
      {items.map((item, i) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={follow && i === active ? "is-active" : undefined}
            aria-current={follow && i === active ? "location" : undefined}
            onClick={(e) => go(e, item.id)}
            data-cursor
          >
            <span>{item.text}</span>
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <nav className="pv-jrnl-toc" aria-label="In this article">
        <p className="pv-label">In this article</p>
        {list(true)}
      </nav>
      <details className="pv-jrnl-toc-fold">
        <summary data-cursor>
          <span>In this article</span>
          <span className="pv-jrnl-toc-count">{inWords(items.length)} sections</span>
        </summary>
        {list(false)}
      </details>
    </>
  );
}
