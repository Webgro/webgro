"use client";

import { BespokeMock, type BespokeMockName } from "@/components/mockups/bespoke";
import "./bespoke.css";

/**
 * The frame for a redrawn app screen. The drawings are 16:10. The frame takes
 * its height from the drawing, so nothing is ever cropped.
 */
export function Screen({ name, decorative = false }: { name: BespokeMockName; decorative?: boolean }) {
  return (
    <div className="pv-bsp-screen" aria-hidden={decorative || undefined}>
      <BespokeMock name={name} />
    </div>
  );
}
