"use client";

import { useEffect, useRef } from "react";
import { BrushFilter } from "./Brush";
import { PreviewFooter } from "./PreviewFooter";
import { PreviewCookieBanner } from "./PreviewCookieBanner";
import { PreviewNav } from "./PreviewNav";
import { ScrollCue } from "./ScrollCue";
import "./preview.css";

/**
 * Wraps every page in the concept: nav, footer, the brush filter, and the page
 * colour, which follows whichever [data-pv-theme] section is crossing the
 * middle of the viewport. Reading the boxes directly keeps this independent of
 * pinned scenes, whose ScrollTriggers shift every section's position.
 */
export function PreviewShell({
  children,
  initialTheme = "paper",
}: {
  children: React.ReactNode;
  initialTheme?: "paper" | "ink";
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.55;
      const sections = el.querySelectorAll<HTMLElement>("[data-pv-theme]");
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) {
          if (el.dataset.theme !== s.dataset.pvTheme) el.dataset.theme = s.dataset.pvTheme;
          break;
        }
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="pv" ref={root} data-theme={initialTheme}>
      <BrushFilter />
      <PreviewNav />
      <main>{children}</main>
      <PreviewFooter />
      <PreviewCookieBanner />
      <ScrollCue />
    </div>
  );
}
