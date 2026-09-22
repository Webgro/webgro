"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { pv } from "../links";

/**
 * Newsletter signup: Webgro news, releases and articles from The Gro. Sends to Klaviyo once the keys are set
 * (see actions/newsletter.ts). Shown in the footer, so it's on every page.
 */
export function NewsletterForm({ className = "" }: { className?: string }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    setError("");
    const r = await subscribeToNewsletter({ email, website: trap });
    if (r.ok) setState("done");
    else { setState("error"); setError(r.error); }
  };

  if (state === "done") {
    return (
      <p className={`pv-news-done ${className}`.trim()} role="status">
        Thanks for subscribing. If we need you to confirm your address, you&rsquo;ll get an email from us shortly.
      </p>
    );
  }

  return (
    <form className={`pv-news-form ${className}`.trim()} onSubmit={submit} noValidate>
      <label className="pv-news-label" htmlFor={`${id}-email`}>Email address</label>
      <div className="pv-news-row">
        <input
          id={`${id}-email`}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder="you@company.co.uk"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={state === "error" || undefined}
          aria-describedby={`${id}-note`}
        />
        <button type="submit" className="pv-news-btn" disabled={state === "sending"} data-cursor>
          {state === "sending" ? "Subscribing" : "Subscribe"}
        </button>
      </div>
      <input
        className="pv-news-trap" tabIndex={-1} autoComplete="off" aria-hidden="true"
        name="website" value={trap} onChange={(e) => setTrap(e.target.value)}
      />
      <p className="pv-news-note" id={`${id}-note`} role={state === "error" ? "alert" : undefined}>
        {state === "error" ? error : (
          <>
            You can unsubscribe at any time. See our{" "}
            <Link href={pv("/privacy")} className="pv-textlink" data-cursor>privacy policy</Link>.
          </>
        )}
      </p>
    </form>
  );
}
