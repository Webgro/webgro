/**
 * Consent store for the cookie banner + analytics loader.
 *
 * We persist a single JSON blob in localStorage and broadcast changes
 * via a custom event so the GA loader, the banner itself, and any
 * future consent-gated script can react without coupling.
 *
 * Why not a context provider? Most consumers (the GA loader, legal
 * pages) need only to read/subscribe at mount, not via React
 * lifecycle. A small plain-JS store reads cleaner than a provider
 * tree for something this narrow.
 */

export type ConsentState = {
  /** Strictly-necessary cookies are always allowed and not listed here. */
  analytics: boolean;
  /** Freeze version so we can invalidate stored consent after legal updates. */
  v: number;
  /** Recorded at time of decision; useful for audit. */
  updatedAt: string;
};

const KEY = "webgro:consent:v1";
/** Bump when the legal policy materially changes so existing users
 *  get re-prompted. */
export const CONSENT_VERSION = 1;
const EVENT = "webgro:consent-change";

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed.v !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(state: { analytics: boolean }): ConsentState {
  const payload: ConsentState = {
    analytics: state.analytics,
    v: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // localStorage blocked — the banner will re-show next load, which
    // is the correct failure mode for PECR.
  }
  window.dispatchEvent(new CustomEvent<ConsentState>(EVENT, { detail: payload }));
  return payload;
}

export function subscribeConsent(fn: (s: ConsentState) => void): () => void {
  const handler = (e: Event) => {
    const ce = e as CustomEvent<ConsentState>;
    fn(ce.detail);
  };
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
