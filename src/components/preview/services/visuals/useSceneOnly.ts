"use client";

import type { RefObject } from "react";
import { SCENE_QUERY, useGsap } from "../../useGsap";

type Ctx = Parameters<Parameters<typeof useGsap>[1]>[0];
type TlVars = NonNullable<Parameters<Ctx["gsap"]["timeline"]>[0]>;
type Tl = ReturnType<Ctx["gsap"]["timeline"]>;

/** Wide enough for a service hero to hold its drawing beside the headline. Keep in step with services.css. */
export const HERO_SPLIT_QUERY = "(min-width: 1200px)";

export type SceneCtx = Ctx & {
  /** True when the drawing sits in the right-hand column of a wide service hero. */
  inHero: boolean;
  /**
   * Makes the drawing's timeline. Below the hero this is a plain timeline with
   * the ScrollTrigger it is given. In the hero the drawing is on screen from the
   * first frame, so the ScrollTrigger is dropped: the timeline plays by itself
   * after load up to `introAt` (in timeline units, the whole thing if left out),
   * and the rest is scrubbed over the first half screen of scroll.
   */
  timeline: (vars: TlVars, introAt?: number) => Tl;
};

/**
 * For the small scrubbed drawings. Their CSS default is the finished picture,
 * so with reduced motion nothing is set up at all and the drawing just sits
 * there complete. `still` does the same on purpose, for the miniatures on the
 * services index.
 */
export function useSceneOnly(scope: RefObject<HTMLElement | null>, setup: (ctx: SceneCtx) => void, still = false) {
  useGsap(scope, (ctx) => {
    if (still) return;
    const { gsap } = ctx;
    const mm = gsap.matchMedia();
    mm.add({ motion: SCENE_QUERY, split: HERO_SPLIT_QUERY }, (m) => {
      if (!m.conditions?.motion) return;
      const holder = scope.current?.closest<HTMLElement>(".pv-svc-hero-visual") ?? null;
      const inHero = Boolean(m.conditions.split && holder);
      const driven: Array<{ tl: Tl; introAt?: number }> = [];

      const timeline = (vars: TlVars, introAt?: number) => {
        if (!inHero) return gsap.timeline(vars);
        const rest = { ...vars };
        delete rest.scrollTrigger;
        const tl = gsap.timeline({ ...rest, paused: true });
        driven.push({ tl, introAt });
        return tl;
      };

      setup({ ...ctx, inHero, timeline });
      if (!inHero || !holder) return;

      // The column is hidden by CSS until this point, so nothing flashes finished first.
      gsap.fromTo(holder, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1, delay: 0.45, ease: "power3.out" });
      const hero = holder.closest<HTMLElement>(".pv-svc-hero") ?? holder;

      driven.forEach(({ tl, introAt }) => {
        const total = tl.duration() || 1;
        const share = Math.min(1, Math.max(0, (introAt ?? total) / total));
        const s = { a: 0, b: 0 };
        const apply = () => { tl.progress(s.a * share + s.b * (1 - share)); };
        apply();
        gsap.to(s, {
          a: 1, duration: Math.min(3.2, Math.max(1.4, total * share * 0.72)), delay: 0.65,
          ease: "power1.inOut", onUpdate: apply,
        });
        if (share < 1) {
          gsap.to(s, {
            b: 1, ease: "none", onUpdate: apply,
            scrollTrigger: {
              trigger: hero, start: "top top", end: () => `+=${Math.round(window.innerHeight * 0.5)}`,
              scrub: 0.6, invalidateOnRefresh: true,
            },
          });
        }
      });
    });
    return () => mm.revert();
  });
}
