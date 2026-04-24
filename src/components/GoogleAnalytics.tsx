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
 * On accept, flipping `enabled` mounts the <Script> tag and GA loads
 * cleanly, no reload needed. On reject, GA was never loaded in the
 * first place, so there is also nothing to unload: the Script tag
 * simply never mounts. This keeps the accept flow seamless (no jarring
 * page refresh the instant a visitor clicks Accept).
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
      setEnabled(Boolean(state.analytics));
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
