"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { readConsent, subscribeConsent, writeConsent } from "@/lib/consent";
import { pv } from "./links";

// Server render assumes consent is given, so nothing flashes before hydration.
const hasDecided = () => readConsent() !== null;
const subscribe = (onChange: () => void) => subscribeConsent(() => onChange());

/**
 * The concept's cookie banner. Same consent store as the live banner, so the
 * analytics loader behaves identically. Kept to one short line: a long
 * paragraph that appears after hydration becomes the page's Largest
 * Contentful Paint on phones.
 */
export function PreviewCookieBanner() {
  const decided = useSyncExternalStore(subscribe, hasDecided, () => true);
  if (decided) return null;

  return (
    <div className="pv-cookie" role="region" aria-label="Cookie consent">
      <p>
        Can we use analytics cookies to see how the site is used?{" "}
        <Link href={pv("/cookies")} data-cursor>Cookie policy</Link>
      </p>
      <div className="pv-cookie-actions">
        <button type="button" onClick={() => writeConsent({ analytics: false })} data-cursor>Reject</button>
        <button type="button" onClick={() => writeConsent({ analytics: true })} data-cursor className="is-primary">Accept</button>
      </div>
    </div>
  );
}
