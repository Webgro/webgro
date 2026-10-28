/**
 * Sends a GA4 event when GA is loaded. GA only loads after the visitor accepts
 * analytics cookies (components/GoogleAnalytics.tsx), so without consent
 * there is no gtag and this does nothing.
 *
 * generate_lead and sign_up are GA4's recommended event names. Mark them as
 * key events in GA4 so enquiries can be counted by channel.
 */
type Gtag = (command: "event", name: string, params?: Record<string, string>) => void;

export function track(name: "generate_lead" | "sign_up", params?: Record<string, string>) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag === "function") gtag("event", name, params);
}
