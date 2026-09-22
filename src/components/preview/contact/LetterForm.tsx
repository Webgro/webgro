"use client";

import Link from "next/link";
import { useCallback, useId, useRef, useState } from "react";
import { submitContact } from "@/app/actions/contact";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { BrushStroke } from "../Brush";
import { pv } from "../links";
import { budgetOptions, serviceOptions } from "./content";

/**
 * The enquiry form, written as a letter. It is wired exactly like the live
 * ContactForm: same state shape, same submitContact server action and payload
 * mapping, same honeypot, same TurnstileWidget, same success and error paths.
 * Only the presentation is new.
 */

type FieldKey = "firstName" | "lastName" | "email" | "agreed";
type Errors = Partial<Record<FieldKey, string>>;

type BlankProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel";
  required?: boolean;
  autoComplete?: string;
  error?: string;
};

/** One blank in the letter: an input that grows with what is typed into it. */
function Blank({ id, name, label, value, placeholder, onChange, type = "text", required, autoComplete, error }: BlankProps) {
  const errId = `${id}-err`;
  return (
    <span className={`pv-contact-blank${value ? " is-filled" : ""}${error ? " is-invalid" : ""}`}>
      <span className="pv-contact-blank-ghost" aria-hidden="true">{value || placeholder}</span>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      <BrushStroke className="pv-contact-blank-brush" />
      <span className="pv-contact-blank-cap">
        <label htmlFor={id} className={error ? "pv-contact-sr" : undefined}>{label}</label>
        {error && <span id={errId} className="pv-contact-blank-err">{error}</span>}
      </span>
    </span>
  );
}

function Chip({ label, selected, onToggle }: { label: string; selected: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className={`pv-contact-chip${selected ? " is-on" : ""}`}
      aria-pressed={selected}
      onClick={onToggle}
      data-cursor
    >
      <span className="pv-contact-chip-mark" aria-hidden="true">
        <svg viewBox="0 0 16 16"><path pathLength={1} d="M3.2 8.6l3.1 3.1 6.4-7.1" /></svg>
      </span>
      <span className="pv-contact-chip-label">{label}</span>
    </button>
  );
}

export function LetterForm({ onSent }: { onSent: (firstName: string) => void }) {
  const uid = useId();
  const ids = {
    firstName: `${uid}-first`,
    lastName: `${uid}-last`,
    email: `${uid}-email`,
    phone: `${uid}-phone`,
    message: `${uid}-message`,
    agreed: `${uid}-agreed`,
    services: `${uid}-services`,
    budget: `${uid}-budget`,
  };

  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    services: [] as string[],
    budget: "",
    message: "",
    website: "", // honeypot
    agreed: false,
  });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const toggleService = (name: string) =>
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(name) ? prev.services.filter((s) => s !== name) : [...prev.services, name],
    }));

  const onToken = useCallback((token: string) => setTurnstileToken(token), []);
  const onExpire = useCallback(() => setTurnstileToken(null), []);

  /**
   * The rules are the browser's own (required, type="email"), read from each
   * input's ValidityState, so they match the live form. Only the messaging is
   * ours: it sits under the blank instead of in a browser bubble.
   */
  const validate = (): Errors => {
    const next: Errors = {};
    const field = (id: string) => document.getElementById(id) as HTMLInputElement | null;
    if (field(ids.firstName)?.validity.valid === false) next.firstName = "Enter your first name";
    if (field(ids.lastName)?.validity.valid === false) next.lastName = "Enter your last name";
    const email = field(ids.email);
    if (email && !email.validity.valid) {
      next.email = email.validity.valueMissing ? "Enter your email address" : "Enter a valid email address";
    }
    if (field(ids.agreed)?.validity.valid === false) next.agreed = "Tick this box to agree to the Privacy Policy.";
    return next;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const found = validate();
    setErrors(found);
    const firstBad = (["firstName", "lastName", "email", "agreed"] as FieldKey[]).find((k) => found[k]);
    if (firstBad) {
      document.getElementById(ids[firstBad])?.focus();
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const result = await submitContact({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || undefined,
        // The action takes one string, so the array is joined the same way
        // the live form joins it ("Websites, SEO, Marketing").
        service: form.services.length ? form.services.join(", ") : undefined,
        budget: form.budget || undefined,
        message: form.message || undefined,
        website: form.website,
        turnstileToken: turnstileToken ?? undefined,
      });
      if (result.ok) {
        onSent(form.firstName.trim());
      } else {
        setError(result.error);
      }
    } catch {
      setError("Something went wrong. Please email hello@webgro.co.uk directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const growMessage = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const problemCount = Object.values(errors).filter(Boolean).length;
  const signature = `${form.firstName} ${form.lastName}`.trim();

  return (
    <form className="pv-contact-form" ref={formRef} onSubmit={handleSubmit} noValidate aria-label="Enquiry form">
      <p className="pv-contact-line" style={{ "--i": 0 } as React.CSSProperties}>
        Hello, my name&rsquo;s{" "}
        <Blank
          id={ids.firstName} name="firstName" label="First name" placeholder="Alex" required autoComplete="given-name"
          value={form.firstName} onChange={(v) => set("firstName", v)} error={errors.firstName}
        />{" "}
        <Blank
          id={ids.lastName} name="lastName" label="Last name" placeholder="Morgan" required autoComplete="family-name"
          value={form.lastName} onChange={(v) => set("lastName", v)} error={errors.lastName}
        />
        .
      </p>

      <p className="pv-contact-line" style={{ "--i": 1 } as React.CSSProperties}>
        My email is{" "}
        <Blank
          id={ids.email} name="email" type="email" label="Work email" placeholder="you@yourcompany.com" required
          autoComplete="email" value={form.email} onChange={(v) => set("email", v)} error={errors.email}
        />{" "}
        and my phone number is{" "}
        <Blank
          id={ids.phone} name="phone" type="tel" label="Phone (optional)" placeholder="+44 ..." autoComplete="tel"
          value={form.phone} onChange={(v) => set("phone", v)}
        />
        .
      </p>

      <div className="pv-contact-pick" role="group" aria-labelledby={ids.services} style={{ "--i": 2 } as React.CSSProperties}>
        <p className="pv-contact-line" id={ids.services}>I need help with</p>
        <div className="pv-contact-chips">
          {serviceOptions.map((s) => (
            <Chip key={s} label={s} selected={form.services.includes(s)} onToggle={() => toggleService(s)} />
          ))}
        </div>
        <p className="pv-contact-hint">Choose any that apply. This is optional.</p>
      </div>

      <div className="pv-contact-pick" role="group" aria-labelledby={ids.budget} style={{ "--i": 3 } as React.CSSProperties}>
        <p className="pv-contact-line" id={ids.budget}>and my budget is about</p>
        <div className="pv-contact-chips">
          {budgetOptions.map((b) => (
            <Chip key={b} label={b} selected={form.budget === b} onToggle={() => set("budget", form.budget === b ? "" : b)} />
          ))}
        </div>
        <p className="pv-contact-hint">An estimate is fine. This is optional.</p>
      </div>

      <div className="pv-contact-message" style={{ "--i": 4 } as React.CSSProperties}>
        <label className="pv-contact-line" htmlFor={ids.message}>About the project:</label>
        <div className="pv-contact-message-box">
          <textarea
            id={ids.message}
            name="message"
            rows={4}
            value={form.message}
            placeholder="A few lines on what you need."
            onChange={(e) => {
              set("message", e.target.value);
              growMessage(e.target);
            }}
          />
          <BrushStroke className="pv-contact-blank-brush" />
        </div>
      </div>

      <p className="pv-contact-signoff" aria-hidden="true" style={{ "--i": 5 } as React.CSSProperties}>
        Thanks,
        <span className={`pv-contact-signature${signature ? " is-signed" : ""}`}>{signature || "Your name"}</span>
      </p>

      {/* Honeypot: offscreen and empty for people, filled in by bots. */}
      <div className="pv-contact-pot" aria-hidden="true">
        <label>
          Website (leave blank)
          <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} />
        </label>
      </div>

      <div className="pv-contact-foot" style={{ "--i": 6 } as React.CSSProperties}>
        {/* Turnstile challenge (renders nothing if the site key is missing). */}
        <TurnstileWidget onToken={onToken} onExpire={onExpire} />

        <div className={`pv-contact-agree${errors.agreed ? " is-invalid" : ""}`}>
          <span className="pv-contact-agree-box">
            <input
              id={ids.agreed}
              name="agreed"
              type="checkbox"
              required
              checked={form.agreed}
              aria-invalid={errors.agreed ? true : undefined}
              aria-describedby={errors.agreed ? `${ids.agreed}-err` : undefined}
              onChange={(e) => set("agreed", e.target.checked)}
            />
            <svg viewBox="0 0 16 16" aria-hidden="true"><path pathLength={1} d="M2.5 8.6l3.6 3.6 7.4-8.2" /></svg>
          </span>
          <label htmlFor={ids.agreed} data-cursor="hover">
            I agree to Webgro&rsquo;s{" "}
            <Link href={pv("/privacy")} target="_blank" rel="noopener noreferrer" data-cursor>Privacy Policy</Link>.
          </label>
          {errors.agreed && <span id={`${ids.agreed}-err`} className="pv-contact-agree-err">{errors.agreed}</span>}
        </div>

        <p className="pv-contact-sr" aria-live="polite">
          {problemCount > 0 ? `${problemCount} ${problemCount === 1 ? "field needs" : "fields need"} fixing before you can send.` : ""}
        </p>

        {/* Server-side failures. Always mounted so screen readers announce it. */}
        <div className="pv-contact-error" role="alert">
          {error && (
            <>
              <strong>Your message wasn&rsquo;t sent.</strong>
              <span>{error}</span>
            </>
          )}
        </div>

        <div className="pv-contact-send-row">
          <button type="submit" className="pv-btn pv-contact-send" disabled={submitting} aria-busy={submitting} data-cursor>
            <span>{submitting ? "Sending…" : "Send enquiry"}</span>
          </button>
          <p className="pv-contact-send-note">We reply within one working day.</p>
        </div>
      </div>
    </form>
  );
}
