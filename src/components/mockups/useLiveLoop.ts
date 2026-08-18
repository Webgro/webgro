"use client";

import { useEffect, useRef } from "react";

/**
 * Drives a mockup's "live" behaviour: calls `tick` every `ms` milliseconds,
 * but only while the mockup is actually on screen, and never for users who
 * prefer reduced motion. Attach the returned ref to the mockup's root.
 */
export function useLiveLoop(tick: () => void, ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const tickRef = useRef(tick);

  useEffect(() => {
    tickRef.current = tick;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let interval: ReturnType<typeof setInterval> | null = null;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && interval === null) {
          interval = setInterval(() => tickRef.current(), ms);
        } else if (!entry.isIntersecting && interval !== null) {
          clearInterval(interval);
          interval = null;
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (interval !== null) clearInterval(interval);
    };
  }, [ms]);

  return ref;
}
