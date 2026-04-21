"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Global error boundary. Catches anything that throws during rendering
 * of a page under /. A nicer failure mode than the default Next screen,
 * matching the rest of the site chrome.
 *
 * Must be a Client Component (required by Next for error boundaries).
 * Does NOT render Nav or Footer on purpose — they may themselves be
 * what threw, and we don't want a recursive failure.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Send to error reporting here when a provider is wired (Sentry etc.)
    console.error("[webgro] Runtime error:", error);
  }, [error]);

  return (
    <main className="relative min-h-screen bg-wg-ink">
      <section className="relative overflow-hidden pb-32 pt-32 md:pb-40 md:pt-40">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -top-[20%] left-[10%] h-[70vh] w-[60vw] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.16)_0%,_transparent_70%)] blur-3xl"
            style={{ animation: "wgDrift 22s ease-in-out infinite" }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center md:px-12 lg:px-16">
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.28em] text-wg-violet">
            [ 500 ] Something broke
          </p>

          <h1 className="mt-8 font-[family-name:var(--font-display)] text-6xl font-bold leading-[0.95] tracking-tight text-white md:text-8xl">
            Hit a{" "}
            <span className="bg-gradient-to-r from-wg-blue via-wg-violet to-wg-teal bg-clip-text pr-[0.35em] italic text-transparent">
              snag.
            </span>
          </h1>

          <p className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl md:leading-[1.5]">
            Something on our end didn&rsquo;t respond the way it should.
            It&rsquo;s been logged. Try again, or head home.
          </p>

          {error.digest && (
            <p className="mt-8 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/40">
              Ref · {error.digest}
            </p>
          )}

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <button
              type="button"
              onClick={reset}
              data-cursor="hover"
              className="group inline-flex items-center gap-3 rounded-full bg-wg-blue px-6 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-wg-ink"
            >
              Try again
              <span className="inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
            <Link
              href="/"
              data-cursor="hover"
              className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition hover:border-white/40 hover:bg-white/10"
            >
              Home
            </Link>
            <Link
              href="/contact"
              data-cursor="hover"
              className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition hover:border-white/40 hover:bg-white/10"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
