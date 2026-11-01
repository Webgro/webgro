"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import { captureLeadSource } from "@/lib/lead-source";

/**
 * Notes where the visit came from, and sends a GA4 event when someone clicks a
 * phone number or email address anywhere on the site. Without analytics consent
 * there is no gtag, so the click event does nothing.
 */
export function LeadTracking() {
  useEffect(() => {
    captureLeadSource();

    const onClick = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return;
      const href = e.target.closest('a[href^="tel:"], a[href^="mailto:"]')?.getAttribute("href");
      if (href) track("contact_click", { method: href.startsWith("tel:") ? "phone" : "email" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
