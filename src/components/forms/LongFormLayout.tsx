"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { submitLongForm, type LongFormField } from "@/app/actions/long-form";
import { TurnstileWidget } from "@/components/TurnstileWidget";

type FormType = "onboarding" | "ecommerce-brief" | "wordpress-brief";

export type LongFormValue = string | string[];
export type LongFormState = Record<string, LongFormValue>;

/**
 * Return the list of (section, label, value) triples for submission.
 * `state` is the flat record of all field values keyed by a stable ID;
 * `fieldMap` is a parallel map declaring which section/label each ID
 * belongs to.
 */
export type FieldMapEntry = {
  section: string;
  label: string;
  /** Always provided — used for ordering within a section. */
  order?: number;
};

/**
 * Helper: flatten the form state into the server action's expected
 * array shape. Arrays become comma-joined strings; booleans (which we
 * don't actually use) would become Yes/No.
 */
function flatten(
  state: LongFormState,
  fieldMap: Record<string, FieldMapEntry>,
  sectionOrder: readonly string[],
): LongFormField[] {
  // Preserve section order, then field order within a section.
  const bySection = new Map<string, LongFormField[]>();
  for (const [key, raw] of Object.entries(state)) {
    const meta = fieldMap[key];
    if (!meta) continue; // unknown key — skip
    const v = Array.isArray(raw) ? raw.join(", ") : String(raw ?? "");
    const arr = bySection.get(meta.section) ?? [];
    arr.push({ section: meta.section, label: meta.label, value: v });
    bySection.set(meta.section, arr);
  }
  const out: LongFormField[] = [];
  for (const section of sectionOrder) {
    const rows = bySection.get(section);
    if (!rows) continue;
    out.push(...rows);
  }
  return out;
}

// ---------------------------------------------------------------------------
// useLongFormState — field-aware state hook with localStorage draft-save.
// ---------------------------------------------------------------------------

export function useLongFormState(
  storageKey: string,
  initial: LongFormState,
) {
  const [state, setState] = useState<LongFormState>(initial);
  const loaded = useRef(false);

  // Restore draft from localStorage on mount so refreshes don't lose input.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as LongFormState;
        setState((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore parse / storage errors — fall through with defaults
    }
    loaded.current = true;
  }, [storageKey]);

  // Save draft on every change (debounce could be added if this ever
  // becomes expensive; for now localStorage is fast and these forms
  // are small JSON blobs).
  useEffect(() => {
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state, storageKey]);

  const update = useCallback(
    (key: string, value: LongFormValue) =>
      setState((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const toggle = useCallback((key: string, option: string) => {
    setState((prev) => {
      const existing = prev[key];
      const arr = Array.isArray(existing) ? existing : [];
      const next = arr.includes(option)
        ? arr.filter((v) => v !== option)
        : [...arr, option];
      return { ...prev, [key]: next };
    });
  }, []);

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    setState(initial);
  }, [storageKey, initial]);

  return { state, update, toggle, clear };
}

// ---------------------------------------------------------------------------
// LongFormLayout — hero header, optional-fields notice, submit wiring.
// ---------------------------------------------------------------------------

type Props = {
  /** e.g. "onboarding", "ecommerce-brief", "wordpress-brief" */
  formType: FormType;
  /** Hero eyebrow (small mono label above the title) */
  eyebrow: string;
  /** Hero title */
  title: string;
  /** Hero lead paragraph under the title */
  lead: string;
  /** The form's own state (from useLongFormState) */
  state: LongFormState;
  /** Lookup of field metadata (section + label) */
  fieldMap: Record<string, FieldMapEntry>;
  /** Section order so we can group the email in the intended order */
  sectionOrder: readonly string[];
  /** Which field holds the client/company name (used in the email subject) */
  clientNameKey: string;
  /** Which field holds the submitter's reply-to email */
  replyToKey: string;
  /** Callback to clear the form's persisted draft after a successful submit */
  onClearDraft: () => void;
  /** Children: the form's sections */
  children: ReactNode;
};

export function LongFormLayout({
  formType,
  eyebrow,
  title,
  lead,
  state,
  fieldMap,
  sectionOrder,
  clientNameKey,
  replyToKey,
  onClearDraft,
  children,
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [agreed, setAgreed] = useState(false);

  const onToken = useCallback((t: string) => setTurnstileToken(t), []);
  const onExpire = useCallback(() => setTurnstileToken(null), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const fields = flatten(state, fieldMap, sectionOrder);
      const clientNameRaw = state[clientNameKey];
      const clientName = Array.isArray(clientNameRaw)
        ? clientNameRaw.join(", ")
        : String(clientNameRaw ?? "");
      const replyRaw = state[replyToKey];
      const replyTo = Array.isArray(replyRaw)
        ? replyRaw[0]
        : String(replyRaw ?? "");

      const result = await submitLongForm({
        formType,
        clientName: clientName.trim() || "(no company name provided)",
        replyTo: replyTo?.trim() || undefined,
        fields,
        website: honeypot,
        turnstileToken: turnstileToken ?? undefined,
      });
      if (result.ok) {
        onClearDraft();
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

  return (
    <article className="relative bg-wg-ink">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-wg-ink-raised pb-16 pt-28 md:pb-20 md:pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-[30%] left-1/2 h-[50vh] w-[60vw] -translate-x-1/2 rounded-full bg-gradient-to-br from-wg-blue/25 via-wg-violet/15 to-wg-teal/10 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-12 lg:px-16">
          <Link
            href="/"
            data-cursor="hover"
            className="group mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-white/85 backdrop-blur-md transition hover:border-white/35 hover:bg-white/[0.08] hover:text-white"
          >
            <span className="inline-block transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Home
          </Link>

          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.28em] text-wg-blue">
            {eyebrow}
          </p>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">
            {title}
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-white/70 md:text-xl md:leading-[1.5]">
            {lead}
          </p>

          {/* Optional-fields + kickoff-context notice */}
          <div className="mt-10 flex items-start gap-3 rounded-2xl border border-wg-teal/25 bg-wg-teal/[0.04] p-4 md:p-5">
            <span className="mt-[5px] inline-flex h-2 w-2 shrink-0 rounded-full bg-wg-teal" />
            <p className="text-sm leading-relaxed text-white/80 md:text-base">
              <span className="font-semibold text-white">
                Every question here is optional.
              </span>{" "}
              This is our kickoff pack now that we&rsquo;ve agreed to work
              together, not a pitch document, so skip anything that
              isn&rsquo;t relevant. Your answers auto-save as you type.
            </p>
          </div>
        </div>
      </section>

      {/* Success state */}
      {sent ? (
        <section className="bg-wg-ink py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-6 md:px-12 lg:px-16">
            <div className="rounded-3xl border border-white/10 bg-wg-ink-raised p-10 md:p-14">
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
              <h2 className="mt-8 font-[family-name:var(--font-display)] text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
                Got it. Cheers.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
                That&rsquo;s everything we need to kick off. One of us will be
                in touch within a working day to confirm next steps and book
                you in. If anything changes in the meantime, email{" "}
                <a
                  href="mailto:hello@webgro.co.uk"
                  className="text-white underline underline-offset-4 hover:text-wg-blue"
                >
                  hello@webgro.co.uk
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      ) : (
        /* Form body */
        <form onSubmit={handleSubmit} className="bg-wg-ink pb-24 md:pb-32">
          <div className="mx-auto max-w-4xl px-6 md:px-12 lg:px-16">
            {children}

            {/* Honeypot: hidden from users + screen readers */}
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
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </label>
            </div>

            {/* Turnstile + consent + submit */}
            <section className="border-t border-white/10 py-10 md:py-14">
              <TurnstileWidget onToken={onToken} onExpire={onExpire} />

              <label
                className="mt-8 flex cursor-pointer items-start gap-3"
                data-cursor="hover"
              >
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
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

              {error && (
                <div
                  role="alert"
                  className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/5 p-5 text-sm leading-relaxed text-red-200"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !agreed}
                data-cursor="hover"
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-wg-blue px-7 py-4 text-base font-medium text-white transition hover:bg-white hover:text-wg-ink disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-wg-blue disabled:hover:text-white"
              >
                {submitting ? "Sending\u2026" : "Send the brief"}
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
            </section>
          </div>
        </form>
      )}
    </article>
  );
}
