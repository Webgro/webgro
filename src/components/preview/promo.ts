import { useSyncExternalStore } from "react";
import { pv } from "./links";

/**
 * A temporary link in the header, for something time-sensitive. It switches
 * itself off after `until` in the visitor's browser, so it disappears on time
 * without a deploy. Delete the entry (and this note) once it has expired.
 */
export const HEADER_PROMO = {
  href: pv("/php2shell-checker"),
  label: "PHP2Shell check",
  /** Shorter, for the phone menu's large type. */
  shortLabel: "PHP2Shell",
  /** End of Thursday 29 October 2026, UK time. */
  until: Date.parse("2026-10-30T00:00:00Z"),
};

const noop = () => () => {};

/**
 * True while the promo should show. The server always renders it; after the
 * end date the browser drops it straight after hydration, without a mismatch.
 */
export function usePromoLive() {
  return useSyncExternalStore(noop, () => Date.now() < HEADER_PROMO.until, () => true);
}
