"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { readConsent, subscribeConsent } from "@/lib/consent";

/**
 * GA4 loader, consent-gated.
 *
 * We only inject the gtag script once the visitor has actively opted
 * in via the CookieBanner. Rejection (or no decision yet) means the
 * script never loads and nothing is tracked.
 *
 * On a change of decision we trigger a soft reload so any analytics
 * state is reset cleanly. That's cruder than a full Consent-Mode v2
 * integration but entirely correct under UK PECR, and well inside the
 * traffic ceiling where marginal-session accuracy matters.
 *
 * The GA4 measurement ID is hard-coded here because it is a public
 * identifier (it ends up in client-side script tags); gating it behind
 * an env var would just add a deploy step without any security value.
 */
const GA_ID = "G-5W34B106VM";

export function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    setEnabled(Boolean(existing?.analytics));

    const unsubscribe = subscribeConsent((state) => {
      const next = Boolean(state.analytics);
      // If consent just toggled, reload to cleanly load or unload GA.
      // Only fires when the state actually changes, so no loop.
      setEnabled((prev) => {
        if (prev !== next) {
          // tiny timeout so the banner's fade-out can finish first
          window.setTimeout(() => window.location.reload(), 150);
        }
        return next;
      });
    });

    return unsubscribe;
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
