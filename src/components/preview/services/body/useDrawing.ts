"use client";

import type { RefObject } from "react";
import { SCENE_QUERY, useGsap } from "../../useGsap";

type Ctx = Parameters<Parameters<typeof useGsap>[1]>[0];

export type DrawCtx = Ctx & {
  /** Scoped selector for the drawing's root. */
  q: (selector: string) => Element[];
  /** True at 900px and up, where some drawings lay out differently. */
  wide: boolean;
  /** The drawing's root element. */
  el: HTMLElement;
};

/**
 * For the drawings further down a service page. Their CSS default is the
 * finished picture, so with reduced motion nothing is set up at all and the
 * drawing sits there complete. With motion allowed (on every screen size) the
 * setup builds its timelines, and they are rebuilt when the layout crosses
 * 900px so each layout gets the right geometry.
 */
export function useDrawing(scope: RefObject<HTMLElement | null>, setup: (ctx: DrawCtx) => void) {
  useGsap(scope, (ctx) => {
    const { gsap } = ctx;
    const mm = gsap.matchMedia();
    mm.add({ motion: SCENE_QUERY, wide: "(min-width: 900px)" }, (m) => {
      const el = scope.current;
      if (!m.conditions?.motion || !el) return;
      const q = gsap.utils.selector(el) as (s: string) => Element[];
      setup({ ...ctx, q, el, wide: Boolean(m.conditions.wide) });
    });
    return () => mm.revert();
  });
}
