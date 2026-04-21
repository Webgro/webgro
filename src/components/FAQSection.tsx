"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type FAQ = {
  num: string;
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    num: "01",
    question: "How much does a website cost?",
    answer:
      "Scope drives price. Most Shopify rebuilds sit between £5k and £25k. WordPress builds typically land between £4k and £15k. Heavier custom work scales from there. We scope honestly before quoting. No paid discovery call required.",
  },
  {
    num: "02",
    question: "How long does a build take?",
    answer:
      "4–12 weeks depending on scope. WordPress builds typically land at 4–6 weeks. Shopify rebuilds at 6–10. Heavier custom work sits at 10–12. Timelines get locked after discovery, and we hit them.",
  },
  {
    num: "03",
    question: "Do you build standard WordPress sites, or only eCommerce?",
    answer:
      "Both. Brochure sites, service businesses, portfolios, company blogs. WordPress is our go-to for anything content-led. Fast when built properly, editable by the client without calling us, and the plugin ecosystem still has no real rival. Same build standards as our eCommerce work: speed, SEO, clean architecture, no bloat.",
  },
  {
    num: "04",
    question: "Is WordPress still the right choice in 2026?",
    answer:
      "For content-led sites, yes. Modern block themes are genuinely fast when built by people who know what they're doing, every marketer already knows how to edit it, and nothing else comes close on plugin depth. For eCommerce we usually recommend Shopify. We'll pick the stack that fits the job, not our comfort zone.",
  },
  {
    num: "05",
    question: "Do we need to rebuild, or can you improve what we have?",
    answer:
      "Often neither. We start with an audit and tell you straight: rebuild, targeted fixes, or leave it alone. We don't oversell.",
  },
  {
    num: "06",
    question: "Do you offer ongoing support?",
    answer:
      "Yes. Retainers are scoped per client to cover updates, performance monitoring, CRO tests, content ops, and AI integrations. Shape and price to what you actually need. Flexible, no lock-in.",
  },
  {
    num: "07",
    question: "How does AI actually help my business?",
    answer:
      "Smart product recommendations, automated content pipelines, internal workflow systems, and customer-service agents that hand off cleanly to humans. All measurable. We build AI that earns its keep, not AI for the buzzword.",
  },
  {
    num: "08",
    question: "How do we start?",
    answer:
      "A 30-minute call. You tell us the problem, we tell you if we're the right fit. No decks, no fluff. If it's a yes, we scope the same week.",
  },
];

export function FAQSection() {
  const root = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-faq-eyebrow]",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          immediateRender: false,
          overwrite: "auto",
          scrollTrigger: { trigger: "[data-faq-header]", start: "top 85%" },
        }
      );

      gsap.set("[data-faq-h2-word]", {
        y: 40,
        opacity: 0,
        filter: "blur(12px)",
      });
      gsap.to("[data-faq-h2-word]", {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.1,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: { trigger: "[data-faq-header]", start: "top 80%" },
      });

      gsap.fromTo(
        "[data-faq-intro]",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          immediateRender: false,
          overwrite: "auto",
          scrollTrigger: { trigger: "[data-faq-header]", start: "top 75%" },
        }
      );

      gsap.fromTo(
        "[data-faq-row]",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          immediateRender: false,
          overwrite: "auto",
          scrollTrigger: { trigger: "[data-faq-list]", start: "top 80%" },
        }
      );

      gsap.fromTo(
        "[data-faq-cta]",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          immediateRender: false,
          overwrite: "auto",
          scrollTrigger: { trigger: "[data-faq-cta]", start: "top 92%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="faq"
      className="relative overflow-hidden bg-wg-ink-raised py-32 md:py-40"
    >
      {/* Subtle ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-[10%] right-[15%] h-[50vh] w-[50vw] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(0,201,167,0.08)_0%,_transparent_70%)] blur-3xl"
          style={{ animation: "wgDrift 24s ease-in-out infinite" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        {/* Header */}
        <div
          className="mb-16 grid grid-cols-1 gap-10 md:mb-24 md:grid-cols-12 md:gap-16"
          data-faq-header
        >
          <div className="md:col-span-7">
            <div className="flex items-center gap-4" data-faq-eyebrow>
              <span className="h-[1px] w-12 bg-wg-teal"></span>
              <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] text-wg-teal">
                [ 05 ] FAQ
              </p>
            </div>
            <h2 className="mt-8 font-[family-name:var(--font-display)] text-5xl font-bold leading-[0.95] tracking-tight text-white md:text-7xl lg:text-[7.5rem]">
              <span className="block pb-3">
                <span data-faq-h2-word className="inline-block will-change-transform">
                  Asked and
                </span>
              </span>
              <span className="block pb-3">
                <span
                  data-faq-h2-word
                  className="inline-block bg-gradient-to-r from-wg-blue via-wg-violet to-wg-teal bg-clip-text pr-[0.35em] italic text-transparent will-change-transform"
                >
                  answered.
                </span>
              </span>
            </h2>
          </div>
          <div className="md:col-span-5 md:pt-40">
            <p
              data-faq-intro
              className="max-w-md text-lg leading-relaxed text-white/60"
            >
              Common questions from brands considering a rebuild, an AI integration, or a retainer. Can&rsquo;t see yours? Ask us directly.
            </p>
          </div>
        </div>

        {/* FAQ list */}
        <div
          data-faq-list
          className="border-t border-white/10"
          role="list"
        >
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.num}
                data-faq-row
                className="border-b border-white/10"
                role="listitem"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  data-cursor="hover"
                  aria-expanded={isOpen}
                  className="group flex w-full items-center gap-4 py-7 text-left transition-colors md:gap-8 md:py-9"
                >
                  <span
                    className={`font-[family-name:var(--font-mono)] text-sm transition-colors duration-300 md:text-base ${
                      isOpen
                        ? "text-wg-teal"
                        : "text-white/40 group-hover:text-wg-teal"
                    }`}
                  >
                    {faq.num}
                  </span>
                  <span
                    className={`flex-1 font-[family-name:var(--font-display)] text-xl font-bold leading-tight tracking-tight transition-colors duration-300 md:text-3xl lg:text-4xl ${
                      isOpen
                        ? "text-white"
                        : "text-white/85 group-hover:text-white"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 md:h-12 md:w-12 ${
                      isOpen
                        ? "border-wg-teal bg-wg-teal text-wg-ink"
                        : "border-white/20 bg-white/[0.03] text-white/70 group-hover:border-white/40 group-hover:bg-white/[0.08]"
                    }`}
                    aria-hidden="true"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className={`transition-transform duration-500 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      <path
                        d="M7 1v12M1 7h12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>

                {/* Expandable answer */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-1 gap-6 pb-9 md:grid-cols-12 md:gap-8 md:pb-10">
                      <div className="md:col-span-1" aria-hidden="true" />
                      <p className="max-w-2xl text-base leading-relaxed text-white/70 md:col-span-10 md:text-lg">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div
          data-faq-cta
          className="mt-16 flex flex-col items-start gap-6 md:mt-20 md:flex-row md:items-center md:justify-between"
        >
          <p className="max-w-lg text-white/60 md:text-lg">
            Still curious? Most conversations start with a 30-minute call.
          </p>
          <a
            href="#contact"
            data-cursor="hover"
            className="group inline-flex items-center gap-3 rounded-full bg-wg-teal px-7 py-4 text-base font-medium text-wg-ink transition hover:bg-white"
          >
            Book a call
            <span className="inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
