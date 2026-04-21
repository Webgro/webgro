"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const d = dot.current;
    const r = ring.current;
    if (!d || !r) return;

    // Ring is rendered at its MAXIMUM visual size and scaled DOWN for the
    // default state. Scaling a rasterized layer up looks blurry; scaling
    // it down stays crisp.
    const RING_SIZE = 96; // px, matches h-24 w-24 on the ring element
    const REST_SCALE = 40 / RING_SIZE; // visual 40px ring at rest
    const HOVER_SCALE = 1; // visual 96px ring on hover

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let dx = mx;
    let dy = my;
    let rx = mx;
    let ry = my;
    let ringScale = REST_SCALE;
    let ringTargetScale = REST_SCALE;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest("a, button, [data-cursor='hover']");
      ringTargetScale = interactive ? HOVER_SCALE : REST_SCALE;
    };

    const tick = () => {
      dx += (mx - dx) * 0.4;
      dy += (my - dy) * 0.4;
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ringScale += (ringTargetScale - ringScale) * 0.18;

      const offset = RING_SIZE / 2;
      d.style.transform = `translate3d(${dx - 4}px, ${dy - 4}px, 0)`;
      r.style.transform = `translate3d(${rx - offset}px, ${ry - offset}px, 0) scale(${ringScale})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-2 w-2 rounded-full bg-white mix-blend-difference will-change-transform"
      />
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[99] h-24 w-24 rounded-full border-[1.5px] border-white/40 mix-blend-difference will-change-transform"
      />
    </>
  );
}
