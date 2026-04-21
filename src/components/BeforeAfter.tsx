"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  before: { src: string; alt: string; label?: string };
  after: { src: string; alt: string; label?: string };
  aspect?: string;
  caption?: string;
};

/**
 * Interactive before/after comparison slider. Full-width image with a
 * draggable divider that clips the "before" image from the right. Auto-
 * animates a hint on first reveal so the reader notices the affordance.
 */
export function BeforeAfter({
  before,
  after,
  aspect = "aspect-[16/10]",
  caption,
}: Props) {
  const [pos, setPos] = useState(55);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const hintedRef = useRef(false);

  const applyX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el || hintedRef.current) return;

    const onEnter = () => {
      if (hintedRef.current) return;
      hintedRef.current = true;
      // One-time invitation: slide from 55 → 40 → 70 → 55 over ~1.6s.
      const start = performance.now();
      const frames: Array<[number, number]> = [
        [0, 55],
        [400, 40],
        [900, 70],
        [1400, 55],
      ];
      const tick = (now: number) => {
        if (draggingRef.current) return; // bail if user grabs control
        const t = now - start;
        let value = 55;
        for (let i = 0; i < frames.length - 1; i++) {
          const [t0, v0] = frames[i];
          const [t1, v1] = frames[i + 1];
          if (t >= t0 && t <= t1) {
            const p = (t - t0) / (t1 - t0);
            const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
            value = v0 + (v1 - v0) * eased;
            break;
          }
        }
        if (t < 1400) {
          setPos(value);
          requestAnimationFrame(tick);
        } else {
          setPos(55);
        }
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            onEnter();
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    applyX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    applyX(e.clientX);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    draggingRef.current = false;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  };

  return (
    <figure>
      <div
        ref={containerRef}
        className={`relative ${aspect} touch-none select-none overflow-hidden rounded-3xl border border-white/10 bg-wg-ink-raised shadow-2xl shadow-black/50`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* AFTER, full image behind */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={after.src}
          alt={after.alt}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        {/* BEFORE, clipped to the left side via the slider */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={before.src}
            alt={before.alt}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
        </div>

        {/* Before / After labels */}
        <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md md:left-6 md:top-6">
          {before.label ?? "Before"}
        </div>
        <div className="pointer-events-none absolute right-4 top-4 z-20 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md md:right-6 md:top-6">
          {after.label ?? "After"}
        </div>

        {/* Divider + handle */}
        <div
          className="pointer-events-none absolute inset-y-0 z-10 w-[2px] bg-white/80 shadow-[0_0_24px_rgba(255,255,255,0.35)]"
          style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
        >
          <div className="pointer-events-auto absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-white/30 bg-white text-wg-ink shadow-xl shadow-black/40">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M5 3L2 7l3 4 M9 3l3 4-3 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      {caption && (
        <figcaption className="mt-4 text-center font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/40">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
