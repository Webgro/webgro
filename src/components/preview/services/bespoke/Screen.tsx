"use client";

import { BESPOKE_MOCK_NAMES, BespokeMock, type BespokeMockName } from "@/components/mockups/bespoke";
import "./bespoke.css";

/**
 * Screens the pages refer to before their drawings exist. Once a name is added
 * to the mockup registry the drawing is used and its entry here is ignored.
 */
export const PENDING_SCREENS = ["case-club", "pw-vp-bridge", "tt-tryon", "afx-configurator", "equivo-kyc"] as const;

export type ScreenName = BespokeMockName | (typeof PENDING_SCREENS)[number];

const isDrawn = (name: string): name is BespokeMockName => (BESPOKE_MOCK_NAMES as readonly string[]).includes(name);

/** True for any name this frame can show, drawn or still pending. */
export const isScreenName = (name: string): name is ScreenName =>
  isDrawn(name) || (PENDING_SCREENS as readonly string[]).includes(name);

/**
 * The frame for a redrawn app screen. The drawings are 16:10. The frame takes
 * its height from the drawing, so nothing is ever cropped. A name with no
 * drawing yet gets a plain 16:10 panel in its place.
 */
export function Screen({ name, decorative = false }: { name: ScreenName; decorative?: boolean }) {
  return (
    <div className="pv-bsp-screen" aria-hidden={decorative || undefined}>
      {isDrawn(name) ? <BespokeMock name={name} /> : <div className="pv-bsp-screen-pending" aria-hidden="true" />}
    </div>
  );
}
