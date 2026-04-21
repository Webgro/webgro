"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Accent } from "@/content/work";
import { contact } from "@/content/contact";
import { ContactForm } from "@/components/ContactForm";

const accentDot: Record<Accent, string> = {
  blue: "bg-wg-blue",
  violet: "bg-wg-violet",
  teal: "bg-wg-teal",
};

const accentText: Record<Accent, string> = {
  blue: "text-wg-blue",
  violet: "text-wg-violet",
  teal: "text-wg-teal",
};

const accentGradientFrom: Record<Accent, string> = {
  blue: "from-wg-blue/30",
  violet: "from-wg-violet/30",
  teal: "from-wg-teal/30",
};

// Three tiny icons for the contact method cards. Kept inline to avoid
// pulling in another component; each one is a 22x22 stroked SVG.
function IconMail() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M3 7l9 7 9-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function methodIcon(kind: "email" | "phone" | "visit") {
  if (kind === "email") return <IconMail />;
  if (kind === "phone") return <IconPhone />;
  return <IconPin />;
}

/**
 * Dedicated /contact page. Sits alongside the homepage ContactSection,
 * which handles low-friction briefs inline. This view gives the richer
 * context — methods, process, studio — for visitors who navigated here
 * intentionally.
 */
export function ContactView() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero mount reveal
      gsap.fromTo(
        "[data-contactpg-meta]",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.1,
        }
      );
      gsap.fromTo(
        "[data-contactpg-title]",
        { y: 40, opacity: 0, filter: "blur(12px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power4.out",
          delay: 0.2,
        }
      );
      gsap.fromTo(
        "[data-contactpg-lead]",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.7 }
      );

      // Scroll-triggered stagger reveals
      ScrollTrigger.batch("[data-contactpg-reveal]", {
        start: "top 85%",
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.08,
              overwrite: "auto",
            }
          ),
      });

      ScrollTrigger.batch("[data-contactpg-method]", {
        start: "top 88%",
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { y: 30, opacity: 0, scale: 0.96 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.1,
              overwrite: "auto",
            }
          ),
      });

      ScrollTrigger.batch("[data-contactpg-step]", {
        start: "top 88%",
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.08,
              overwrite: "auto",
            }
          ),
      });

      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <article ref={root} className="relative bg-wg-ink">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/10 bg-wg-ink-raised pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -top-[20%] left-[10%] h-[70vh] w-[60vw] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(45,141,255,0.14)_0%,_transparent_70%)] blur-3xl"
            style={{ animation: "wgDrift 20s ease-in-out infinite" }}
          />
          <div
            className="absolute bottom-[5%] right-[5%] h-[60vh] w-[50vw] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.12)_0%,_transparent_70%)] blur-3xl"
            style={{ animation: "wgDrift 24s ease-in-out infinite reverse" }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <Link
            href="/"
            data-cursor="hover"
            data-contactpg-meta
            className="group mb-12 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-white/85 backdrop-blur-md transition hover:border-white/35 hover:bg-white/[0.08] hover:text-white"
          >
            <span className="inline-block transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Home
          </Link>

          <p
            data-contactpg-meta
            className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.28em] text-wg-blue"
          >
            {contact.hero.eyebrow}
          </p>

          <h1
            data-contactpg-title
            className="mt-6 max-w-5xl font-[family-name:var(--font-display)] text-6xl font-bold leading-[0.95] tracking-tight text-white md:text-8xl lg:text-[10rem]"
          >
            {contact.hero.heading}{" "}
            <span className="bg-gradient-to-r from-wg-blue via-wg-violet to-wg-teal bg-clip-text pr-[0.35em] italic text-transparent">
              {contact.hero.headingAccent}
            </span>
          </h1>

          <p
            data-contactpg-lead
            className="mt-10 max-w-3xl text-lg leading-relaxed text-white/70 md:text-2xl md:leading-[1.4]"
          >
            {contact.hero.lead}
          </p>
        </div>
      </section>

      {/* ── Methods (Email / Phone / Visit) ───────────────────────────── */}
      <section className="relative overflow-hidden bg-wg-ink py-20 md:py-28">
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div data-contactpg-reveal className="flex items-center gap-4">
            <span className="h-[1px] w-12 bg-wg-blue" />
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] text-wg-blue">
              [ Ways in ]
            </p>
          </div>
          <h2
            data-contactpg-reveal
            className="mt-6 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl"
          >
            Three paths. Same reply time.
          </h2>

          <div
            data-contactpg-reveal
            className="mt-12 grid grid-cols-1 gap-5 md:mt-14 md:grid-cols-3 md:gap-6"
          >
            {contact.methods.map((m) => (
              <a
                key={m.kind}
                href={m.href}
                target={m.kind === "visit" ? "_blank" : undefined}
                rel={m.kind === "visit" ? "noopener noreferrer" : undefined}
                data-contactpg-method
                data-cursor="hover"
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-wg-ink-raised p-8 transition-all duration-500 hover:-translate-y-1 hover:border-white/25 md:p-10"
              >
                <div
                  className={`pointer-events-none absolute -right-1/4 -top-1/3 h-[140%] w-[70%] bg-gradient-to-br ${accentGradientFrom[m.accent]} via-transparent to-transparent opacity-25 blur-3xl`}
                />
                <div className={`relative ${accentText[m.accent]}`}>
                  {methodIcon(m.kind)}
                </div>
                <p
                  className={`relative mt-6 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.28em] ${accentText[m.accent]}`}
                >
                  {m.label}
                </p>
                <p className="relative mt-3 font-[family-name:var(--font-display)] text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
                  {m.value}
                </p>
                <p className="relative mt-4 text-sm leading-relaxed text-white/60">
                  {m.meta}
                </p>
                <div className="relative mt-auto flex items-center justify-between pt-8">
                  <span className="text-sm font-medium text-white">
                    {m.kind === "email"
                      ? "Send an email"
                      : m.kind === "phone"
                      ? "Call us"
                      : "Open in Maps"}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all duration-500 group-hover:border-white/40 group-hover:bg-white group-hover:text-wg-ink">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M3 9L9 3M9 3H4M9 3V8"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/10 bg-wg-ink-raised py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-[10%] right-[-5%] h-[55vh] w-[45vw] rounded-full bg-gradient-to-br from-wg-violet/25 via-transparent to-transparent opacity-[0.3] blur-3xl"
            style={{ animation: "wgDrift 28s ease-in-out infinite" }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-5">
              <div data-contactpg-reveal className="flex items-center gap-4">
                <span className="h-[1px] w-12 bg-wg-violet" />
                <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] text-wg-violet">
                  [ The brief ]
                </p>
              </div>
              <h2
                data-contactpg-reveal
                className="mt-6 font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl"
              >
                Tell us the problem.
              </h2>
              <p
                data-contactpg-reveal
                className="mt-8 max-w-md text-lg leading-relaxed text-white/65"
              >
                A few lines is plenty. Budget and service are optional, just
                useful context for the first reply. We won&rsquo;t need a full
                RFP or anything resembling one.
              </p>
              <div
                data-contactpg-reveal
                className="mt-10 rounded-3xl border border-white/10 bg-wg-ink p-6 md:p-7"
              >
                <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-wg-teal">
                  Not sure yet?
                </p>
                <p className="mt-3 text-base leading-relaxed text-white/80">
                  Email{" "}
                  <a
                    href="mailto:hello@webgro.co.uk"
                    className="text-white underline underline-offset-4 hover:text-wg-blue"
                    data-cursor="hover"
                  >
                    hello@webgro.co.uk
                  </a>{" "}
                  with a one-liner. We&rsquo;ll reply with a couple of
                  questions, no scoping expected.
                </p>
              </div>
            </div>
            <div className="md:col-span-7">
              <div data-contactpg-reveal>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What happens next ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/10 bg-wg-ink py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-[-10%] left-[-5%] h-[55vh] w-[45vw] rounded-full bg-gradient-to-br from-wg-teal/20 via-transparent to-transparent opacity-[0.3] blur-3xl"
            style={{ animation: "wgDrift 26s ease-in-out infinite" }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div data-contactpg-reveal className="flex items-center gap-4">
            <span className="h-[1px] w-12 bg-wg-teal" />
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] text-wg-teal">
              [ What happens next ]
            </p>
          </div>
          <h2
            data-contactpg-reveal
            className="mt-6 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl"
          >
            Four steps. One week.
          </h2>
          <p
            data-contactpg-reveal
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65"
          >
            Most briefs go from first email to signed proposal in about five
            working days. Kickoff usually lands the week after that.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
            {contact.nextSteps.map((s) => (
              <div
                key={s.num}
                data-contactpg-step
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-wg-ink-raised p-7 transition-colors hover:border-white/20 md:p-8"
              >
                <div
                  className={`pointer-events-none absolute -right-1/4 -top-1/3 h-[140%] w-[70%] bg-gradient-to-br ${accentGradientFrom[s.accent]} via-transparent to-transparent opacity-25 blur-3xl`}
                />
                <div className="relative flex items-center justify-between">
                  <span
                    className={`font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.28em] ${accentText[s.accent]}`}
                  >
                    {s.num}
                  </span>
                  <span className={`h-1.5 w-1.5 rounded-full ${accentDot[s.accent]}`} />
                </div>
                <h3 className="relative mt-5 font-[family-name:var(--font-display)] text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
                  {s.heading}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-white/70 md:text-[15px]">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/10 bg-wg-ink-raised py-20 md:py-28">
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center md:px-12 lg:px-16">
          <h2
            data-contactpg-reveal
            className="font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl"
          >
            {contact.closing.heading}
          </h2>
          <p
            data-contactpg-reveal
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/65 md:text-xl"
          >
            {contact.closing.body}
          </p>
          <div data-contactpg-reveal className="mt-10">
            <a
              href="mailto:hello@webgro.co.uk"
              data-cursor="hover"
              className="group inline-flex items-center gap-3 rounded-full bg-wg-blue px-7 py-4 text-base font-medium text-white transition hover:bg-white hover:text-wg-ink"
            >
              hello@webgro.co.uk
              <span className="inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}
