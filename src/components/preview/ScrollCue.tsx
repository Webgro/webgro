"use client";

import { useEffect, useRef, useState } from "react";
import { readConsent, subscribeConsent } from "@/lib/consent";
import "./scroll-cue.css";

/** Ignore pages with barely anything under the fold. */
const MIN_SCROLLABLE = 600;
/** How long the page has to sit still before the hint appears. */
const IDLE_MS = 4200;
/** A flick of the thumb counts as a scroll; a pixel of rubber-banding does not. */
const MOVED = 14;
const SEEN_KEY = "webgro:scroll-hint";

/**
 * Two quiet marks that tell a reader there is more page below.
 *
 * The rail is a hairline at the right edge that fills with blue as you read,
 * so how far through you are is always on screen. The hint is a short line
 * under the first screen that draws itself twice, and only if the page has
 * been sitting still for a few seconds. It goes for good on the first scroll,
 * and does not come back for the rest of the visit.
 *
 * Both are decorative: no text, no focus, aria-hidden. The rail is written
 * with a transform from a single rAF-throttled passive scroll listener, and
 * the page height is only re-measured when something actually resizes.
 */
export function ScrollCue() {
  const fill = useRef<HTMLSpanElement>(null);
  const [live, setLive] = useState(false);
  const [hint, setHint] = useState<"in" | "out" | null>(null);

  useEffect(() => {
    // The 404 is a dead end, not something to read down. It is the one page
    // in the shell that should not be inviting anyone further.
    if (document.querySelector(".pv-legal-nf")) return;

    const el = fill.current;
    if (!el) return;

    let raf = 0;
    let max = 0;
    let shown = false;
    let idle: number | undefined;
    let fade: number | undefined;
    let done = false;

    const markSeen = () => {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // Private mode. The hint simply gets one more chance on the next page.
      }
    };

    const measure = () => {
      max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      setLive(max > MIN_SCROLLABLE);
    };

    const draw = () => {
      raf = 0;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.transform = `scaleY(${p})`;
    };

    const stopHint = () => {
      window.clearTimeout(idle);
      idle = undefined;
      if (done) return;
      done = true;
      // Anyone who has scrolled once knows the page scrolls, so the hint is
      // finished for the visit, not just for this page.
      markSeen();
      if (!shown) return;
      setHint("out");
      fade = window.setTimeout(() => setHint(null), 600);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw);
      if (!done && window.scrollY > MOVED) stopHint();
    };

    const onResize = () => {
      measure();
      if (!raf) raf = requestAnimationFrame(draw);
    };

    measure();
    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // Pinned scenes, filters and accordions all change the page height.
    let settle: number | undefined;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(settle);
      settle = window.setTimeout(onResize, 180);
    });
    ro.observe(document.body);

    // The hint. Skipped for reduced motion, on a short page, once it has been
    // seen, while the cookie banner is still waiting for an answer, and while
    // someone is typing.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    const focused = () => {
      const a = document.activeElement;
      return !!a && (a.matches("input, textarea, select") || a.closest("form") !== null);
    };
    // The hint sits low and centred, so it stays away from a form that reaches
    // into the bottom of the first screen.
    const formInTheWay = () => {
      for (const f of document.querySelectorAll("form")) {
        const r = f.getBoundingClientRect();
        if (r.bottom > window.innerHeight * 0.55 && r.top < window.innerHeight) return true;
      }
      return false;
    };
    const arm = () => {
      if (done || shown || idle !== undefined) return;
      idle = window.setTimeout(() => {
        idle = undefined;
        if (done || window.scrollY > MOVED || max <= MIN_SCROLLABLE || focused() || formInTheWay()) {
          done = true;
          return;
        }
        shown = true;
        markSeen();
        setHint("in");
      }, IDLE_MS);
    };
    let unsubscribe: (() => void) | undefined;
    if (reduce || seen) {
      done = true;
    } else if (readConsent() !== null) {
      arm();
    } else {
      // Wait for the banner to go: the hint sits where the banner sits.
      unsubscribe = subscribeConsent(() => arm());
    }

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(idle);
      window.clearTimeout(fade);
      window.clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      unsubscribe?.();
    };
  }, []);

  return (
    <>
      <div className={`pv-cue-rail${live ? " is-live" : ""}`} aria-hidden="true">
        <span className="pv-cue-fill" ref={fill} />
      </div>
      {hint && (
        <div className="pv-cue-hint" data-state={hint} aria-hidden="true">
          <span className="pv-cue-hint-line">
            <span />
          </span>
        </div>
      )}
    </>
  );
}
