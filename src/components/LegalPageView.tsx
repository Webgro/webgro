import Link from "next/link";
import type { ReactNode } from "react";

// ---- Section helpers ---------------------------------------------------
// Small wrappers used inside legal-page children so every page renders
// headings, paragraphs, and lists with consistent spacing and colour.

export function LegalH2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-16 font-[family-name:var(--font-display)] text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl">
      {children}
    </h2>
  );
}

export function LegalH3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-10 font-[family-name:var(--font-display)] text-lg font-bold leading-snug tracking-tight text-white md:text-xl">
      {children}
    </h3>
  );
}

export function LegalP({ children }: { children: ReactNode }) {
  return (
    <p className="text-base leading-[1.7] text-white/75 md:text-lg md:leading-[1.65]">
      {children}
    </p>
  );
}

export function LegalUl({ children }: { children: ReactNode }) {
  return (
    <ul className="ml-5 list-disc space-y-2 text-base leading-[1.7] text-white/75 md:text-lg md:leading-[1.65]">
      {children}
    </ul>
  );
}

export function LegalA({
  href,
  children,
  external,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const extraProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <a
      href={href}
      className="text-white underline underline-offset-4 transition hover:text-wg-blue"
      data-cursor="hover"
      {...extraProps}
    >
      {children}
    </a>
  );
}

type Props = {
  /** Eyebrow above the title, e.g. `[ Legal ] Privacy` */
  eyebrow: string;
  title: string;
  /** Short sub-line under the title */
  intro: string;
  /** Human-readable last-reviewed date, e.g. "April 2026" */
  lastReviewed: string;
  children: ReactNode;
};

/**
 * Shared layout for the legal pages (/privacy, /cookies, /accessibility).
 *
 * Kept intentionally plain: dark hero + readable body column.
 * Body content is rendered as standard HTML inside a `.prose` block that
 * provides typography defaults tuned to match the rest of the site.
 *
 * These pages are intentionally server components. No animation pomp —
 * they're reference documents, and readability beats choreography.
 */
export function LegalPageView({
  eyebrow,
  title,
  intro,
  lastReviewed,
  children,
}: Props) {
  return (
    <article className="relative bg-wg-ink">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-wg-ink-raised pb-16 pt-32 md:pb-20 md:pt-40">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-[30%] left-1/2 h-[50vh] w-[60vw] -translate-x-1/2 rounded-full bg-gradient-to-br from-wg-blue/20 via-wg-violet/10 to-wg-teal/10 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12 lg:px-16">
          <Link
            href="/"
            data-cursor="hover"
            className="group mb-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-white/85 backdrop-blur-md transition hover:border-white/35 hover:bg-white/[0.08] hover:text-white"
          >
            <span className="inline-block transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Home
          </Link>

          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.28em] text-wg-blue">
            {eyebrow}
          </p>
          <h1 className="mt-6 max-w-4xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">
            {title}
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-white/70 md:text-xl md:leading-[1.5]">
            {intro}
          </p>
          <p className="mt-10 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] text-white/40">
            Last reviewed · {lastReviewed}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="relative bg-wg-ink py-20 md:py-28">
        <div className="relative z-10 mx-auto max-w-3xl px-6 md:px-12 lg:px-16">
          <div className="prose-legal space-y-8 text-white/75">{children}</div>
        </div>
      </section>
    </article>
  );
}
