"use client";

import type { ReactNode } from "react";

/**
 * Shared form field primitives for the long-form brief pages.
 *
 * Design notes:
 *   - All dark-theme, matching the rest of the site (wg-ink background)
 *   - Inputs use an underline treatment rather than bordered boxes so
 *     filling in a 100-field brief feels like writing, not data entry
 *   - Pill groups (single/multi select) are the same treatment as on
 *     the main /contact form so form behaviour is consistent
 *   - Every primitive takes a `label` and `required` flag so the parent
 *     form doesn't have to hand-roll label markup per field
 */

// ---------------------------------------------------------------------------
// Label + helper text wrapper
// ---------------------------------------------------------------------------

function FieldLabel({
  label,
  required,
  help,
}: {
  label: string;
  required?: boolean;
  help?: string;
}) {
  return (
    <div className="mb-3">
      <div className="flex items-baseline gap-2">
        <label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/75">
          {label}
        </label>
        {required && (
          <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.22em] text-wg-blue">
            Required
          </span>
        )}
      </div>
      {help && (
        <p className="mt-1.5 text-sm leading-relaxed text-white/50">{help}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Text input
// ---------------------------------------------------------------------------

export function TextInput({
  label,
  value,
  onChange,
  required,
  help,
  placeholder,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  help?: string;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "url" | "number";
  autoComplete?: string;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} help={help} />
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full border-b border-white/20 bg-transparent pb-3 text-base text-white placeholder-white/30 transition-colors focus:border-wg-blue focus:outline-none"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Textarea (multiline)
// ---------------------------------------------------------------------------

export function TextArea({
  label,
  value,
  onChange,
  required,
  help,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  help?: string;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} help={help} />
      <textarea
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y border-b border-white/20 bg-transparent pb-3 text-base text-white placeholder-white/30 transition-colors focus:border-wg-blue focus:outline-none"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pill group: single-select (radio semantics)
// ---------------------------------------------------------------------------

export function PillRadio({
  label,
  value,
  onChange,
  options,
  required,
  help,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  required?: boolean;
  help?: string;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} help={help} />
      <div className="flex flex-wrap gap-2.5">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(selected ? "" : opt)}
              aria-pressed={selected}
              data-cursor="hover"
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                selected
                  ? "border-white/40 bg-white/10 text-white"
                  : "border-white/15 bg-white/[0.02] text-white/70 hover:border-white/30 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pill group: multi-select (checkbox semantics)
// ---------------------------------------------------------------------------

export function PillMulti({
  label,
  values,
  onToggle,
  options,
  required,
  help,
}: {
  label: string;
  values: string[];
  onToggle: (opt: string) => void;
  options: readonly string[];
  required?: boolean;
  help?: string;
}) {
  return (
    <div>
      <div className="mb-3">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/75">
              {label}
            </label>
            {required && (
              <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.22em] text-wg-blue">
                Required
              </span>
            )}
          </div>
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-white/40">
            Select all that apply
          </span>
        </div>
        {help && (
          <p className="mt-1.5 text-sm leading-relaxed text-white/50">{help}</p>
        )}
      </div>
      <div className="flex flex-wrap gap-2.5">
        {options.map((opt) => {
          const selected = values.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              aria-pressed={selected}
              data-cursor="hover"
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                selected
                  ? "border-white/40 bg-white/10 text-white"
                  : "border-white/15 bg-white/[0.02] text-white/70 hover:border-white/30 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {opt}
              {selected && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path
                    d="M2 6l3 3 5-6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Yes / No binary
// ---------------------------------------------------------------------------

export function YesNo({
  label,
  value,
  onChange,
  required,
  help,
}: {
  label: string;
  value: "" | "Yes" | "No";
  onChange: (v: "" | "Yes" | "No") => void;
  required?: boolean;
  help?: string;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} help={help} />
      <div className="flex gap-2.5">
        {(["Yes", "No"] as const).map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(selected ? "" : opt)}
              aria-pressed={selected}
              data-cursor="hover"
              className={`min-w-20 rounded-full border px-5 py-2 text-sm font-medium transition ${
                selected
                  ? "border-white/40 bg-white/10 text-white"
                  : "border-white/15 bg-white/[0.02] text-white/70 hover:border-white/30 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section wrapper: numbered heading + child fields
// ---------------------------------------------------------------------------

export function FormSection({
  num,
  title,
  intro,
  children,
}: {
  num: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-white/10 py-10 md:py-14">
      <div className="mb-8 flex items-baseline gap-4">
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-wg-blue">
          {num}
        </span>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-white md:text-3xl">
          {title}
        </h2>
      </div>
      {intro && (
        <p className="mb-8 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
          {intro}
        </p>
      )}
      <div className="flex flex-col gap-8 md:gap-10">{children}</div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Two-column helper for pairing inputs on wide screens
// ---------------------------------------------------------------------------

export function TwoCol({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
      {children}
    </div>
  );
}
