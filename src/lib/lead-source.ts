/**
 * Where this visit came from, so a lead email can say how the person found us.
 *
 * Held in memory only: no cookie, no localStorage, nothing stored on the
 * device. It lasts until the page is reloaded and works the same for visitors
 * who reject analytics cookies, which GA4 can't see.
 *
 * Only the referring site's name and the landing page's path and campaign tags
 * are kept. Any other query string is dropped.
 */
export type LeadSource = { referrer?: string; landing?: string };

const CAMPAIGN_PARAM = /^(utm_(source|medium|campaign|term|content)|gclid|gbraid|wbraid|msclkid|fbclid)$/;

let captured: LeadSource | null = null;

/** Runs once, on the first page of the visit (components/LeadTracking.tsx). */
export function captureLeadSource() {
  if (captured) return;
  const params = new URLSearchParams();
  new URLSearchParams(window.location.search).forEach((value, key) => {
    if (CAMPAIGN_PARAM.test(key)) params.set(key, value.slice(0, 100));
  });
  const query = params.toString();

  let referrer: string | undefined;
  try {
    const host = new URL(document.referrer).hostname.replace(/^www\./, "");
    if (host !== window.location.hostname.replace(/^www\./, "")) referrer = host;
  } catch {
    // No referrer, or not a URL: the visit counts as direct.
  }

  captured = {
    ...(referrer ? { referrer } : {}),
    landing: `${window.location.pathname}${query ? `?${query}` : ""}`.slice(0, 500),
  };
}

export function leadSource(): LeadSource | undefined {
  return captured ?? undefined;
}
