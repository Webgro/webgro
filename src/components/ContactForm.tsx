"use client";

import { useCallback, useState } from "react";
import { submitContact } from "@/app/actions/contact";
import { TurnstileWidget } from "@/components/TurnstileWidget";

type ServiceOption = {
  name: string;
  accent: "blue" | "violet" | "teal" | "white";
};

const services: ServiceOption[] = [
  { name: "Websites", accent: "blue" },
  { name: "Consultancy", accent: "violet" },
  { name: "Automation & AI", accent: "teal" },
  { name: "SEO", accent: "blue" },
  { name: "Marketing", accent: "violet" },
  { name: "Design", accent: "teal" },
  { name: "Something else", accent: "white" },
];

const budgets = [
  "£1–5k",
  "£5–10k",
  "£10–25k",
  "£25k+",
  "Retainer",
  "Not sure yet",
];

const accentDot: Record<ServiceOption["accent"], string> = {
  blue: "bg-wg-blue",
  violet: "bg-wg-violet",
  teal: "bg-wg-teal",
  white: "bg-white/70",
};

type Props = {
  /** When true, a service pre-selects on mount (e.g. deep-link from a
   *  service page CTA). */
  initialService?: string;
};

/**
 * Shared contact form used both on the homepage ContactSection and on
 * the dedicated /contact page. Submits via the `submitContact` server
 * action (src/app/actions/contact.ts) which handles Turnstile verify,
 * honeypot, and Resend delivery.
 *
 * Honeypot: the `website` field is rendered but hidden from users; bots
 * fill it and the server action short-circuits. See the action for why
 * this silently "succeeds" rather than erroring.
 */
export function ContactForm({ initialService = "" }: Props) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: initialService,
    budget: "",
    message: "",
    website: "", // honeypot
    agreed: false,
  });

  const onToken = useCallback((token: string) => setTurnstileToken(token), []);
  const onExpire = useCallback(() => setTurnstileToken(null), []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const result = await submitContact({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || undefined,
        service: form.service || undefined,
        budget: form.budget || undefined,
        message: form.message || undefined,
        website: form.website,
        turnstileToken: turnstileToken ?? undefined,
      });
      if (result.ok) {
        setSent(true);
      } else {
        setError(result.error);
      }
    } catch {
      setError(
        "Something went wrong. Please email hello@webgro.co.uk directly.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-[500px] flex-col items-start justify-center rounded-3xl border border-white/10 bg-white/[0.02] p-10 backdrop-blur-md md:p-12">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wg-teal">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 10l4 4 8-8"
              stroke="#07080C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="mt-8 font-[family-name:var(--font-display)] text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
          Got it. We&rsquo;ll be in touch.
        </h3>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
          Your brief landed. We reply within one working day. In the meantime,
          if anything urgent comes up, just hit{" "}
          <a
            href="mailto:hello@webgro.co.uk"
            className="text-white underline underline-offset-4 hover:text-wg-blue"
          >
            hello@webgro.co.uk
          </a>{" "}
          directly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md md:p-10"
    >
      {/* Names */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/70">
            First name
          </label>
          <input
            type="text"
            required
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="w-full border-b border-white/20 bg-transparent pb-3 text-base text-white placeholder-white/50 transition-colors focus:border-wg-blue focus:outline-none"
            placeholder="Michael"
          />
        </div>
        <div>
          <label className="mb-2 block font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/70">
            Last name
          </label>
          <input
            type="text"
            required
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className="w-full border-b border-white/20 bg-transparent pb-3 text-base text-white placeholder-white/50 transition-colors focus:border-wg-blue focus:outline-none"
            placeholder="Broadbridge"
          />
        </div>
      </div>

      {/* Email */}
      <div className="mt-8">
        <label className="mb-2 block font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/70">
          Work email
        </label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border-b border-white/20 bg-transparent pb-3 text-base text-white placeholder-white/50 transition-colors focus:border-wg-blue focus:outline-none"
          placeholder="you@yourcompany.com"
        />
      </div>

      {/* Phone */}
      <div className="mt-8">
        <label className="mb-2 block font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/70">
          Phone (optional)
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border-b border-white/20 bg-transparent pb-3 text-base text-white placeholder-white/50 transition-colors focus:border-wg-blue focus:outline-none"
          placeholder="+44 ..."
        />
      </div>

      {/* Service pills */}
      <div className="mt-10">
        <label className="mb-4 block font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/70">
          Which service interests you?
        </label>
        <div className="flex flex-wrap gap-3">
          {services.map((s) => {
            const selected = form.service === s.name;
            return (
              <button
                key={s.name}
                type="button"
                onClick={() => setForm({ ...form, service: s.name })}
                data-cursor="hover"
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  selected
                    ? "border-white/40 bg-white/10 text-white"
                    : "border-white/15 bg-white/[0.02] text-white/70 hover:border-white/30 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${accentDot[s.accent]}`} />
                {s.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget */}
      <div className="mt-10">
        <label className="mb-4 block font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/70">
          Ballpark budget
        </label>
        <div className="flex flex-wrap gap-3">
          {budgets.map((b) => {
            const selected = form.budget === b;
            return (
              <button
                key={b}
                type="button"
                onClick={() => setForm({ ...form, budget: b })}
                data-cursor="hover"
                className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition ${
                  selected
                    ? "border-white/40 bg-white/10 text-white"
                    : "border-white/15 bg-white/[0.02] text-white/70 hover:border-white/30 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {b}
              </button>
            );
          })}
        </div>
      </div>

      {/* Message */}
      <div className="mt-10">
        <label className="mb-2 block font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/70">
          Tell us the problem
        </label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={4}
          className="w-full resize-none border-b border-white/20 bg-transparent pb-3 text-base text-white placeholder-white/50 transition-colors focus:border-wg-blue focus:outline-none"
          placeholder="A couple of lines on what you're trying to build, fix, or rethink."
        />
      </div>

      {/* Honeypot — offscreen, empty, ignored by users, filled by bots */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden opacity-0"
      >
        <label>
          Website (leave blank)
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
        </label>
      </div>

      {/* Turnstile challenge (renders nothing if the site key is missing) */}
      <TurnstileWidget onToken={onToken} onExpire={onExpire} />

      {/* Privacy */}
      <label className="mt-10 flex cursor-pointer items-start gap-3" data-cursor="hover">
        <input
          type="checkbox"
          required
          checked={form.agreed}
          onChange={(e) => setForm({ ...form, agreed: e.target.checked })}
          className="mt-1 h-4 w-4 shrink-0 rounded border-white/30 bg-transparent"
          style={{ accentColor: "#2D8DFF" }}
        />
        <span className="text-sm leading-relaxed text-white/60">
          I agree to Webgro&rsquo;s{" "}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/90 underline underline-offset-2 transition hover:text-wg-blue"
          >
            Privacy Policy
          </a>
          .
        </span>
      </label>

      {/* Error banner (only when the server action returned !ok) */}
      {error && (
        <div
          role="alert"
          className="mt-8 rounded-2xl border border-red-400/30 bg-red-500/5 p-5 text-sm leading-relaxed text-red-200"
        >
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        data-cursor="hover"
        className="group mt-10 inline-flex items-center gap-3 rounded-full bg-wg-blue px-7 py-4 text-base font-medium text-white transition hover:bg-white hover:text-wg-ink disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-wg-blue disabled:hover:text-white"
      >
        {submitting ? "Sending…" : "Send the brief"}
        <span
          className={`inline-block transition-transform ${
            submitting ? "" : "group-hover:translate-x-1"
          }`}
        >
          {submitting ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="animate-spin"
              aria-hidden="true"
            >
              <circle
                cx="7"
                cy="7"
                r="5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeOpacity="0.35"
              />
              <path
                d="M12 7A5 5 0 0 0 7 2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            "→"
          )}
        </span>
      </button>
    </form>
  );
}
