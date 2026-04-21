"use client";

import { useEffect, useState } from "react";

type Chapter = { id: string; num: string; label: string };

export function CaseStudyNav({ chapters }: { chapters: Chapter[] }) {
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? "");

  useEffect(() => {
    if (chapters.length === 0) return;
    const ids = chapters.map((c) => c.id);
    let ticking = false;
    const getActive = () => {
      const offset = 120;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - offset <= 0) current = id;
        else break;
      }
      setActiveId((prev) => (prev === current ? prev : current));
    };
    getActive();
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        getActive();
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [chapters]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div className="sticky top-0 z-40 border-y border-white/10 bg-wg-ink/95">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <div className="flex gap-1 overflow-x-auto py-3 md:py-4">
          {chapters.map((c) => {
            const active = c.id === activeId;
            return (
              <a
                key={c.id}
                href={`#${c.id}`}
                onClick={(e) => handleClick(e, c.id)}
                data-cursor="hover"
                className={`group inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                  active
                    ? "border-white/25 bg-white/10 text-white"
                    : "border-transparent text-white/55 hover:text-white"
                }`}
              >
                <span
                  className={`font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] ${
                    active ? "text-white/60" : "text-white/35"
                  }`}
                >
                  {c.num}
                </span>
                {c.label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
