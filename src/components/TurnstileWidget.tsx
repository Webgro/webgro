"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

type Props = {
  /** Called with the token once Turnstile has verified the visitor. */
  onToken: (token: string) => void;
  /** Called if the challenge expires or errors out. */
  onExpire?: () => void;
};

/**
 * Cloudflare Turnstile widget. Renders "invisible" for legitimate users
 * most of the time; shows a visible challenge only when Cloudflare's
 * heuristics think a request looks suspicious.
 *
 * We render the widget as a plain div and let the Turnstile script
 * attach to it. The script handles all the challenge UI itself.
 *
 * No site key → render nothing and no-op. This keeps the form usable
 * during local dev and during the brief window before the Cloudflare
 * account is provisioned. The server-side verifier (submitContact)
 * mirrors this behaviour in `NODE_ENV !== 'production'`.
 */
export function TurnstileWidget({ onToken, onExpire }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !ref.current) return;
    // Keep the callbacks on a window-scoped name that the Turnstile script
    // can look up. IDs are suffixed with a random token so multiple
    // widgets on the same page don't collide.
    const id = `ts-cb-${Math.random().toString(36).slice(2)}`;
    const w = window as unknown as Record<string, unknown>;
    w[`${id}:token`] = onToken;
    w[`${id}:expire`] = onExpire ?? (() => undefined);

    // Turnstile exposes itself as window.turnstile.render once loaded.
    // Poll briefly for it to show up; the <Script /> below injects it.
    let handle: number | undefined;
    const tryRender = () => {
      const ts = (window as unknown as { turnstile?: { render: (el: HTMLElement, opts: unknown) => string } }).turnstile;
      if (ts && ref.current) {
        ts.render(ref.current, {
          sitekey: siteKey,
          theme: "dark",
          appearance: "interaction-only",
          callback: (token: string) => onToken(token),
          "expired-callback": () => onExpire?.(),
        });
      } else {
        handle = window.setTimeout(tryRender, 150);
      }
    };
    tryRender();

    return () => {
      if (handle) window.clearTimeout(handle);
      delete w[`${id}:token`];
      delete w[`${id}:expire`];
    };
  }, [siteKey, onToken, onExpire]);

  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        async
        defer
      />
      <div ref={ref} className="mt-6" />
    </>
  );
}
