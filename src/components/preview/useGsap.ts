"use client";

import { useEffect, type RefObject } from "react";

type GsapCtx = {
  gsap: typeof import("gsap").default;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

export const SCENE_QUERY = "(prefers-reduced-motion: no-preference)";
export const STATIC_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Loads GSAP + ScrollTrigger off the critical path and runs `setup` inside a
 * gsap.context scoped to `scope`, so everything it creates is reverted on
 * unmount. `setup` may return extra cleanup.
 */
export function useGsap(
  scope: RefObject<HTMLElement | null>,
  setup: (ctx: GsapCtx) => void | (() => void),
) {
  useEffect(() => {
    let cancelled = false;
    let revert: (() => void) | undefined;

    (async () => {
      const [g, st] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      const gsap = g.default;
      gsap.registerPlugin(st.ScrollTrigger);
      // CSSPlugin rounds px values by default. The line drawings animate
      // stroke-dashoffset from 1 to 0 on paths with pathLength="1", so rounding
      // made them pop in whole instead of drawing. Turn it off everywhere.
      gsap.defaults({ autoRound: false } as gsap.TweenVars);
      let extra: void | (() => void);
      const ctx = gsap.context(() => {
        extra = setup({ gsap, ScrollTrigger: st.ScrollTrigger });
      }, scope.current ?? undefined);
      revert = () => {
        if (typeof extra === "function") extra();
        ctx.revert();
      };
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
    // setup is intentionally captured once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
