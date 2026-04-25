"use client";

import type LenisType from "lenis";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Lenis smooth-scroll provider.
 *
 * Lenis (~30KB) and the GSAP ScrollTrigger plugin are dynamically
 * imported and only initialised after the page is interactive
 * (requestIdleCallback, falling back to a small setTimeout). That
 * keeps both libraries off the critical path so they don't delay LCP
 * or first paint. The native scroll experience is fine during the
 * ~100ms before Lenis kicks in; users on slow networks don't notice.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisType | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const init = async () => {
      const [{ default: Lenis }, gsapMod, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      const gsap = gsapMod.default;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenisRef.current = lenis;

      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const syncSizes = () => {
        lenis.resize();
        ScrollTrigger.refresh();
      };
      const resizeObserver = new ResizeObserver(syncSizes);
      resizeObserver.observe(document.body);

      const refreshTimers = [
        window.setTimeout(syncSizes, 100),
        window.setTimeout(syncSizes, 800),
      ];
      const onLoad = () => syncSizes();
      window.addEventListener("load", onLoad);

      cleanup = () => {
        refreshTimers.forEach(clearTimeout);
        resizeObserver.disconnect();
        window.removeEventListener("load", onLoad);
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
      };
    };

    // Defer init until the browser is idle. Falls back to setTimeout
    // for browsers (or polyfilled environments) without rIC.
    type RICWindow = typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const w = window as RICWindow;
    let idleHandle: number | undefined;
    let timeoutHandle: number | undefined;
    if (w.requestIdleCallback) {
      idleHandle = w.requestIdleCallback(() => init(), { timeout: 1200 });
    } else {
      timeoutHandle = window.setTimeout(init, 200);
    }

    return () => {
      cancelled = true;
      if (idleHandle !== undefined && w.cancelIdleCallback) w.cancelIdleCallback(idleHandle);
      if (timeoutHandle !== undefined) clearTimeout(timeoutHandle);
      cleanup?.();
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    lenis.scrollTo(0, { immediate: true });
    const t = window.setTimeout(() => {
      lenis.resize();
    }, 120);
    return () => clearTimeout(t);
  }, [pathname]);

  return <>{children}</>;
}
