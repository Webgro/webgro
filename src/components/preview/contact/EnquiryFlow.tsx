"use client";

import Link from "next/link";
import { useCallback, useId, useRef, useState } from "react";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import {
  composeAnswer,
  EMAIL_PATTERN,
  FIXED_QUESTIONS,
  LIMITS,
  PROJECT_QUESTION,
  SERVICE_QUESTION,
  type EnquiryQuestion,
  type EnquiryStepIn,
  type NextResponse,
} from "@/lib/enquiry/shared";
import useIsomorphicLayoutEffect from "@/lib/useIsomorphicLayoutEffect";
import { BrushStroke } from "../Brush";
import { pv } from "../links";
import { SCENE_QUERY, STATIC_QUERY, useGsap } from "../useGsap";
import "./enquiry.css";

/**
 * The guided enquiry: one question at a time. Two fixed questions, then up
 * to five follow-ups from /api/enquiry/next (chosen by Claude, or a fixed
 * set per service when no API key is set), then contact details and a
 * summary before /api/enquiry/submit emails it to the team.
 *
 * Stateless on the server: this component holds every answered step and
 * posts the whole list each time. Spam protection matches the letter form:
 * honeypot, Turnstile and a privacy checkbox.
 */

type Answered = { q: EnquiryQuestion; answer: string; picked: string[]; text: string };
type Phase = "question" | "loading" | "contact" | "review";
type Draft = { picked: string[]; text: string };
type Contact = { name: string; email: string; phone: string; company: string };
type ContactErrors = Partial<Record<"name" | "email", string>>;

type Gsap = typeof import("gsap").default;

/** Fixed questions, the follow-ups and the contact step. The bar fills against this. */
const TOTAL = FIXED_QUESTIONS.length + LIMITS.followUps + 1;
const EMPTY: Draft = { picked: [], text: "" };
const GENERIC = "Something went wrong. Please try again, or email hello@webgro.co.uk.";

const toStepIn = ({ q, answer }: Answered): EnquiryStepIn => ({
  id: q.id,
  answer,
  question: q.question,
  inputType: q.inputType,
  ...(q.options ? { options: q.options } : {}),
  ...(q.hint ? { hint: q.hint } : {}),
  ...(q.sig ? { sig: q.sig } : {}),
});

async function post<T>(url: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 45_000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as { error?: string }).error ?? GENERIC);
    return data as T;
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw new Error("That took too long. Please try again.");
    if (e instanceof TypeError) throw new Error("We couldn't reach the server. Check your connection and try again.");
    throw e;
  } finally {
    window.clearTimeout(timer);
  }
}

function Chip({ label, selected, onToggle }: { label: string; selected: boolean; onToggle: () => void }) {
  return (
    <button type="button" className={`pv-contact-chip${selected ? " is-on" : ""}`} aria-pressed={selected} onClick={onToggle} data-cursor>
      <span className="pv-contact-chip-mark" aria-hidden="true">
        <svg viewBox="0 0 16 16"><path pathLength={1} d="M3.2 8.6l3.1 3.1 6.4-7.1" /></svg>
      </span>
      <span className="pv-contact-chip-label">{label}</span>
    </button>
  );
}

function ErrorBox({ error, title }: { error: string | null; title: string }) {
  return (
    <div className="pv-contact-error pv-enq-error" role="alert">
      {error && (
        <>
          <strong>{title}</strong>
          <span>{error}</span>
        </>
      )}
    </div>
  );
}

export function EnquiryFlow({ onSent }: { onSent: (firstName: string) => void }) {
  const uid = useId();
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const gsapRef = useRef<Gsap | null>(null);
  const motion = useRef(false);
  // Guards against a double Enter or double click while a step is on its way out.
  const moving = useRef(false);

  const [done, setDone] = useState<Answered[]>([]);
  const [current, setCurrent] = useState<EnquiryQuestion>(SERVICE_QUESTION);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [phase, setPhase] = useState<Phase>("question");
  const [error, setError] = useState<string | null>(null);
  const [contact, setContact] = useState<Contact>({ name: "", email: "", phone: "", company: "" });
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
  const [agreed, setAgreed] = useState(false);
  const [agreeError, setAgreeError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  // Focus only moves once someone has started, so the page load doesn't jump to the form.
  const [started, setStarted] = useState(false);

  const onToken = useCallback((token: string) => setTurnstileToken(token), []);
  const onExpire = useCallback(() => setTurnstileToken(null), []);

  useGsap(root, ({ gsap }) => {
    gsapRef.current = gsap;
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      motion.current = true;
      return () => {
        motion.current = false;
      };
    });
    mm.add(STATIC_QUERY, () => {
      motion.current = false;
    });
    return () => {
      const el = root.current;
      if (el) gsap.killTweensOf(el.querySelectorAll("[data-enq-in]"));
      gsapRef.current = null;
    };
  });

  const inItems = () => (panel.current ? Array.from(panel.current.querySelectorAll<HTMLElement>("[data-enq-in]")) : []);

  const enter = useCallback(() => {
    const g = gsapRef.current;
    const items = panel.current ? Array.from(panel.current.querySelectorAll<HTMLElement>("[data-enq-in]")) : [];
    if (!g || !motion.current || !items.length) return;
    g.fromTo(
      items,
      { y: 26, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out", stagger: 0.055, overwrite: true, clearProps: "transform,opacity,visibility" },
    );
  }, []);

  const leave = () =>
    new Promise<void>((resolve) => {
      const g = gsapRef.current;
      const items = inItems();
      if (!g || !motion.current || !items.length) return resolve();
      g.to(items, { y: -16, autoAlpha: 0, duration: 0.24, ease: "power2.in", stagger: 0.02, overwrite: true, onComplete: () => resolve() });
    });

  const viewKey = phase === "question" ? `q:${current.id}` : phase;

  // Each new view animates in, then focus moves to it so keyboard and screen reader users follow along.
  useIsomorphicLayoutEffect(() => {
    if (!started) return;
    enter();
    const el = panel.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top < 72 || top > window.innerHeight * 0.6) {
      // Instant, like the sent state in ContactTop, so it doesn't fight Lenis.
      window.scrollTo({ top: Math.max(0, window.scrollY + top - 120), behavior: "instant" });
    }
    if (phase === "loading") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const field = el.querySelector<HTMLElement>("[data-enq-focus]");
    const heading = el.querySelector<HTMLElement>("[data-enq-heading]");
    (fine && field ? field : heading)?.focus({ preventScroll: true });
  }, [viewKey, phase, started, enter]);

  /* ── Moving between steps ─────────────────────────────────────────── */

  const answer = composeAnswer(draft.picked, draft.text);
  const isProject = current.id === PROJECT_QUESTION.id;
  const canContinue = isProject ? draft.text.trim().length >= 3 : Boolean(answer);

  async function advance(value: string, picked: string[], text: string) {
    if (moving.current) return;
    moving.current = true;
    try {
      await goForward(value, picked, text);
    } finally {
      moving.current = false;
    }
  }

  async function goForward(value: string, picked: string[], text: string) {
    setError(null);
    const steps: Answered[] = [...done, { q: current, answer: value, picked, text }];

    if (current.id === SERVICE_QUESTION.id) {
      await leave();
      setStarted(true);
      setDone(steps);
      setCurrent(PROJECT_QUESTION);
      setDraft(EMPTY);
      return;
    }

    const request = post<NextResponse>("/api/enquiry/next", { steps: steps.map(toStepIn) });
    // Handled below, after the exit animation. This stops an early failure counting as unhandled.
    request.catch(() => undefined);
    await leave();
    setStarted(true);
    setPhase("loading");
    try {
      const next = await request;
      setDone(steps);
      if (next.done) {
        setPhase("contact");
      } else {
        setCurrent(next.step);
        setDraft(EMPTY);
        setPhase("question");
      }
    } catch (e) {
      setPhase("question");
      setError(e instanceof Error ? e.message : GENERIC);
    }
  }

  function back() {
    setStarted(true);
    setError(null);
    if (phase === "review") return setPhase("contact");
    const prev = done[done.length - 1];
    if (!prev) return;
    setDone(done.slice(0, -1));
    setCurrent(prev.q);
    setDraft({ picked: prev.picked, text: prev.text });
    setPhase("question");
  }

  const toggle = (option: string) => {
    setDraft((d) => {
      const on = d.picked.includes(option);
      if (current.multi) return { ...d, picked: on ? d.picked.filter((p) => p !== option) : [...d.picked, option] };
      return { ...d, picked: on ? [] : [option] };
    });
    if (error) setError(null);
  };

  /* ── Contact and send ─────────────────────────────────────────────── */

  const setField = (key: keyof Contact, value: string) => {
    setContact((c) => ({ ...c, [key]: value }));
    if (key in contactErrors) setContactErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function toReview() {
    const found: ContactErrors = {};
    if (!contact.name.trim()) found.name = "Enter your name";
    if (!contact.email.trim()) found.email = "Enter your email address";
    else if (!EMAIL_PATTERN.test(contact.email.trim())) found.email = "Enter a valid email address";
    setContactErrors(found);
    const first = (["name", "email"] as const).find((k) => found[k]);
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    if (moving.current) return;
    moving.current = true;
    await leave();
    moving.current = false;
    setStarted(true);
    setPhase("review");
  }

  async function send() {
    if (sending) return;
    if (!agreed) {
      setAgreeError("Tick this box to agree to the Privacy Policy.");
      document.getElementById(`${uid}-agreed`)?.focus();
      return;
    }
    setError(null);
    setSending(true);
    try {
      const result = await post<{ ok: boolean; error?: string }>("/api/enquiry/submit", {
        steps: done.map(toStepIn),
        contact: {
          name: contact.name.trim(),
          email: contact.email.trim(),
          ...(contact.phone.trim() ? { phone: contact.phone.trim() } : {}),
          ...(contact.company.trim() ? { company: contact.company.trim() } : {}),
        },
        agreed,
        website: honeypot,
        turnstileToken: turnstileToken ?? undefined,
      });
      if (result.ok) onSent(contact.name.trim().split(/\s+/)[0] ?? "");
      else setError(result.error ?? GENERIC);
    } catch (e) {
      setError(e instanceof Error ? e.message : GENERIC);
    } finally {
      setSending(false);
    }
  }

  /* ── Progress ─────────────────────────────────────────────────────── */

  const number = done.length + 1;
  const progress = phase === "review" ? 1 : phase === "contact" ? (TOTAL - 1) / TOTAL : done.length / TOTAL;
  const stageLabel = phase === "review" ? "Check and send" : phase === "contact" ? "Your details" : `Question ${Math.min(number, TOTAL - 1)}`;
  const live =
    phase === "loading" ? "Loading the next question." : phase === "question" ? `Question ${number}.` : `${stageLabel}.`;

  /* ── Views ────────────────────────────────────────────────────────── */

  const qId = `${uid}-q`;
  const hintId = `${uid}-hint`;
  const fieldId = `${uid}-answer`;
  const options = current.inputType === "yesno" ? ["Yes", "No", "Not sure"] : (current.options ?? []);
  const canSkip = !current.required;

  const questionView = (
    <form
      ref={formRef}
      className="pv-enq-panel"
      aria-labelledby={qId}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (canContinue) advance(answer, draft.picked, draft.text);
        else setError(isProject ? "Please tell us a little about the project." : current.id === SERVICE_QUESTION.id ? "Choose a service or describe what you need." : "Type an answer, or skip this question.");
      }}
    >
      <h2 className="pv-enq-q" id={qId} tabIndex={-1} data-enq-heading data-enq-in>
        {current.question}
      </h2>
      {current.hint && (
        <p className="pv-enq-hint" id={hintId} data-enq-in>
          {current.hint}
        </p>
      )}

      {options.length > 0 && (
        <div className="pv-enq-chips" role="group" aria-labelledby={qId} data-enq-in>
          {options.map((o) => (
            <Chip key={o} label={o} selected={draft.picked.includes(o)} onToggle={() => toggle(o)} />
          ))}
        </div>
      )}

      <div className="pv-enq-box" data-enq-in>
        {options.length > 0 && (
          <label className="pv-enq-sub" htmlFor={fieldId}>
            {current.multi ? "Or tell us in your own words (optional)" : "Anything to add? (optional)"}
          </label>
        )}
        <textarea
          id={fieldId}
          className={`pv-enq-field${options.length ? " is-short" : ""}`}
          rows={options.length ? 1 : 3}
          maxLength={LIMITS.answer}
          value={draft.text}
          placeholder={isProject ? "For example: we sell handmade furniture and our WordPress site is slow and hard to update." : options.length ? "" : "Type your answer"}
          aria-labelledby={options.length ? undefined : qId}
          aria-describedby={[current.hint ? hintId : "", `${uid}-keys`].filter(Boolean).join(" ")}
          aria-required={current.required || undefined}
          data-enq-focus={options.length ? undefined : ""}
          onChange={(e) => {
            setDraft((d) => ({ ...d, text: e.target.value }));
            if (error) setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
        />
        <BrushStroke className="pv-enq-brush" />
        {draft.text.length > LIMITS.answer * 0.8 && (
          <p className="pv-enq-count">{(LIMITS.answer - draft.text.length).toLocaleString("en-GB")} characters left</p>
        )}
      </div>

      <p className="pv-enq-keys" id={`${uid}-keys`} data-enq-in>
        Press Enter to continue, or Shift and Enter for a new line.
      </p>

      <ErrorBox error={error} title="That didn't go through." />

      <div className="pv-enq-actions" data-enq-in>
        <button type="submit" className="pv-btn pv-enq-next" aria-disabled={!canContinue || undefined} data-cursor>
          <span>Continue</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
        {canSkip && (
          <button type="button" className="pv-enq-link" onClick={() => advance("", [], "")} data-cursor>
            Skip this question
          </button>
        )}
        {done.length > 0 && (
          <button type="button" className="pv-enq-link pv-enq-back" onClick={back} data-cursor>
            Back
          </button>
        )}
      </div>
    </form>
  );

  const loadingView = (
    <div className="pv-enq-panel pv-enq-wait" aria-hidden="true">
      <span className="pv-enq-dots"><i /><i /><i /></span>
      <p>Loading the next question</p>
    </div>
  );

  const contactField = (key: keyof Contact, label: string, opts: { type?: string; autoComplete: string; required?: boolean; placeholder?: string }) => {
    const id = `${uid}-${key}`;
    const err = key === "name" || key === "email" ? contactErrors[key] : undefined;
    return (
      <div className={`pv-enq-input${err ? " is-invalid" : ""}`} data-enq-in>
        <label htmlFor={id}>{label}</label>
        <span className="pv-enq-input-line">
        <input
          id={id}
          type={opts.type ?? "text"}
          value={contact[key]}
          autoComplete={opts.autoComplete}
          placeholder={opts.placeholder}
          required={opts.required}
          maxLength={LIMITS[key]}
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? `${id}-err` : undefined}
          data-enq-focus={key === "name" ? "" : undefined}
          onChange={(e) => setField(key, e.target.value)}
        />
        <BrushStroke className="pv-enq-brush" />
        </span>
        {err && <span className="pv-enq-input-err" id={`${id}-err`}>{err}</span>}
      </div>
    );
  };

  const contactView = (
    <form
      className="pv-enq-panel"
      aria-labelledby={`${uid}-contact`}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        toReview();
      }}
    >
      <h2 className="pv-enq-q" id={`${uid}-contact`} tabIndex={-1} data-enq-heading data-enq-in>
        Where should we send our reply?
      </h2>
      <p className="pv-enq-hint" data-enq-in>You can check everything on the next screen before it&rsquo;s sent.</p>
      <div className="pv-enq-fields">
        {contactField("name", "Your name", { autoComplete: "name", required: true, placeholder: "Alex Morgan" })}
        {contactField("email", "Email", { type: "email", autoComplete: "email", required: true, placeholder: "you@yourcompany.com" })}
        {contactField("phone", "Phone (optional)", { type: "tel", autoComplete: "tel", placeholder: "+44 ..." })}
        {contactField("company", "Company (optional)", { autoComplete: "organization" })}
      </div>
      <div className="pv-enq-actions" data-enq-in>
        <button type="submit" className="pv-btn pv-enq-next" data-cursor>
          <span>Check your answers</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
        <button type="button" className="pv-enq-link pv-enq-back" onClick={back} data-cursor>
          Back
        </button>
      </div>
    </form>
  );

  const details = [
    ["Name", contact.name],
    ["Email", contact.email],
    ["Phone", contact.phone],
    ["Company", contact.company],
  ].filter(([, v]) => v.trim());

  const reviewView = (
    <form
      className="pv-enq-panel"
      aria-labelledby={`${uid}-review`}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
    >
      <h2 className="pv-enq-q" id={`${uid}-review`} tabIndex={-1} data-enq-heading data-enq-in>
        Check your answers
      </h2>

      <dl className="pv-enq-summary" data-enq-in>
        {done.map((s) => (
          <div className="pv-enq-summary-row" key={s.q.id}>
            <dt>{s.q.question}</dt>
            <dd className={s.answer ? undefined : "is-skipped"}>{s.answer || "Skipped"}</dd>
          </div>
        ))}
        <div className="pv-enq-summary-row">
          <dt>
            Your details{" "}
            <button type="button" className="pv-enq-link pv-enq-change" onClick={() => setPhase("contact")} data-cursor>
              Change
            </button>
          </dt>
          <dd>
            {details.map(([k, v]) => (
              <span key={k} className="pv-enq-summary-detail">{v}</span>
            ))}
          </dd>
        </div>
      </dl>

      {/* Honeypot: offscreen and empty for people, filled in by bots. */}
      <div className="pv-contact-pot" aria-hidden="true">
        <label>
          Website (leave blank)
          <input type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </label>
      </div>

      <div className="pv-enq-foot" data-enq-in>
        <TurnstileWidget onToken={onToken} onExpire={onExpire} />

        <div className={`pv-contact-agree${agreeError ? " is-invalid" : ""}`}>
          <span className="pv-contact-agree-box">
            <input
              id={`${uid}-agreed`}
              type="checkbox"
              checked={agreed}
              aria-invalid={agreeError ? true : undefined}
              aria-describedby={agreeError ? `${uid}-agreed-err` : undefined}
              onChange={(e) => {
                setAgreed(e.target.checked);
                setAgreeError(null);
              }}
            />
            <svg viewBox="0 0 16 16" aria-hidden="true"><path pathLength={1} d="M2.5 8.6l3.6 3.6 7.4-8.2" /></svg>
          </span>
          <label htmlFor={`${uid}-agreed`} data-cursor="hover">
            I agree to Webgro&rsquo;s{" "}
            <Link href={pv("/privacy")} target="_blank" rel="noopener noreferrer" data-cursor>Privacy Policy</Link>.
          </label>
          {agreeError && <span id={`${uid}-agreed-err`} className="pv-contact-agree-err">{agreeError}</span>}
        </div>

        <ErrorBox error={error} title="Your enquiry wasn't sent." />

        <div className="pv-enq-actions">
          <button type="submit" className="pv-btn pv-enq-next" disabled={sending} aria-busy={sending} data-cursor>
            <span>{sending ? "Sending…" : "Send enquiry"}</span>
          </button>
          <button type="button" className="pv-enq-link pv-enq-back" onClick={back} disabled={sending} data-cursor>
            Back
          </button>
        </div>
        <p className="pv-enq-note">We reply within one working day.</p>
      </div>
    </form>
  );

  const view = phase === "question" ? questionView : phase === "loading" ? loadingView : phase === "contact" ? contactView : reviewView;

  return (
    <div className="pv-enq" ref={root}>
      <div className="pv-enq-progress">
        <div className="pv-enq-progress-head">
          <span className="pv-label">{stageLabel}</span>
          {phase !== "review" && <span className="pv-enq-progress-meta">A few short questions, then your details</span>}
        </div>
        <div
          className="pv-enq-bar"
          role="progressbar"
          aria-label="Enquiry progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          aria-valuetext={stageLabel}
        >
          <span style={{ transform: `scaleX(${Math.max(progress, 0.04)})` }} />
        </div>
      </div>

      <p className="pv-contact-sr" aria-live="polite">{started ? live : ""}</p>

      <div className="pv-enq-stage" aria-busy={phase === "loading"}>
        <div key={viewKey} ref={panel}>
          {view}
        </div>
      </div>
    </div>
  );
}
