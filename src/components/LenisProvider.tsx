"use client";

import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Disable automatic browser scroll restoration so we fully own the
    // scroll position on client-side route changes. Without this, the
    // browser may restore an old scroll position before we can reset.
    if (typeof window !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Keep Lenis's cached dimensions in sync when the document height
    // changes (images loading, fonts settling, reveal animations, etc.).
    // Without this, Lenis can think the page ends before it actually
    // does, which shows up as scroll "stopping" mid-page.
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

    return () => {
      refreshTimers.forEach(clearTimeout);
      resizeObserver.disconnect();
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll to top on route change. Lenis manages its own internal
  // scroll state, so plain window.scrollTo doesn't always sync.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    lenis.scrollTo(0, { immediate: true });
    // Re-measure Lenis + ScrollTrigger for the new page's DOM.
    const t = window.setTimeout(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    }, 120);
    return () => clearTimeout(t);
  }, [pathname]);

  return <>{children}</>;
}
