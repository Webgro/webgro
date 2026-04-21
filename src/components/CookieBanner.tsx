"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readConsent, writeConsent } from "@/lib/consent";

/**
 * Cookie consent banner (bottom-left, on-brand).
 *
 * Now a full consent UI rather than a notice: with GA4 added to the
 * site, UK PECR requires active opt-in before any non-essential cookie
 * can be set. Two buttons — Accept and Reject — with equal prominence.
 *
 * The GA loader (<GoogleAnalytics />) subscribes to the consent store
 * so it only injects the gtag script after the user has accepted. If
 * the user rejects, GA stays un-loaded; if they later change their
 * mind from the footer link, the page soft-reloads to pick up the
 * script.
 *
 * Accessibility: role="region", aria-label, focusable buttons. We also
 * respect `prefers-reduced-motion` — currently only used for the slight
 * mount delay.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const existing = readConsent();
    if (!existing) {
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    writeConsent({ analytics: true });
    setVisible(false);
  };

  const reject = () => {
    writeConsent({ analytics: false });
    setVisible(false);
  };

  if (!mounted || !visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex px-4 pb-4 md:inset-auto md:bottom-6 md:left-6 md:max-w-md md:px-0 md:pb-0"
    >
      <div className="pointer-events-auto w-full overflow-hidden rounded-2xl border border-white/12 bg-wg-ink-raised/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
        {/* Gradient hairline */}
        <div
          aria-hidden="true"
          className="h-[2px] w-full bg-gradient-to-r from-wg-blue via-wg-violet to-wg-teal"
        />

        <div className="relative p-5 md:p-6">
          {/* Ambient corner glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-wg-violet/30 via-transparent to-transparent opacity-40 blur-3xl"
          />

          <div className="relative">
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-wg-blue">
              [ Cookies ]
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-lg font-bold leading-tight tracking-tight text-white">
              Quick one on cookies.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              We use strictly-necessary cookies to keep the site running.
              We&rsquo;d also like your consent to use anonymous analytics
              (Google Analytics) to see which pages land and which don&rsquo;t.
              You can change your mind any time.{" "}
              <Link
                href="/cookies"
                data-cursor="hover"
                className="text-white underline underline-offset-4 hover:text-wg-blue"
              >
                Cookie policy
              </Link>
              .
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={accept}
                data-cursor="hover"
                className="inline-flex items-center gap-2 rounded-full bg-wg-blue px-4 py-2 text-xs font-medium text-white transition hover:bg-white hover:text-wg-ink"
              >
                Accept all
                <span className="inline-block">→</span>
              </button>
              <button
                type="button"
                onClick={reject}
                data-cursor="hover"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/85 transition hover:border-white/40 hover:bg-white/[0.08] hover:text-white"
              >
                Reject non-essential
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
