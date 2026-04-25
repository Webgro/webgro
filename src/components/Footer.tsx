"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlobalMap } from "@/components/GlobalMap";

const footerNav = {
  services: [
    "Websites",
    "Consultancy",
    "Automation & AI",
    "SEO",
    "Marketing",
    "Design",
  ],
  agency: ["Work", "Services", "About", "Contact"],
  legal: ["Privacy Policy", "Cookie Policy", "Accessibility"],
};

export function Footer() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-footer-col]",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          immediateRender: false,
          overwrite: "auto",
          scrollTrigger: { trigger: "[data-footer-nav]", start: "top 90%" },
        }
      );

      gsap.set("[data-wordmark-char]", {
        yPercent: 100,
        opacity: 0,
      });
      gsap.to("[data-wordmark-char]", {
        yPercent: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.05,
        ease: "power4.out",
        scrollTrigger: { trigger: "[data-wordmark]", start: "top 92%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={root}
      className="relative overflow-hidden border-t border-white/10 bg-wg-ink"
    >
      {/* Navigation columns */}
      <div
        data-footer-nav
        className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-24 lg:px-16"
      >
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12 md:gap-8">
          {/* Brand + contact */}
          <div data-footer-col className="relative col-span-2 md:col-span-4">
            {/* Quirky animated map, sits behind the contact block */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-6 -z-10 h-[200px] w-[320px] opacity-[0.35] md:right-4 md:h-[260px] md:w-[360px]"
            >
              <GlobalMap />
            </div>

            <a href="/" aria-label="Webgro home" className="relative inline-flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/logo-white.png"
                alt="Webgro"
                width={450}
                height={146}
                className="h-8 w-auto md:h-10"
              />
            </a>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              Websites that earn their keep today. Built to grow with AI tomorrow.
            </p>
            <div className="mt-8 space-y-3 text-sm">
              <a
                href="mailto:hello@webgro.co.uk"
                data-cursor="hover"
                className="block text-white/80 transition hover:text-white"
              >
                hello@webgro.co.uk
              </a>
              <a
                href="tel:+441344231119"
                data-cursor="hover"
                className="block text-white/80 transition hover:text-white"
              >
                +44 (0)1344 231119
              </a>
              <address className="not-italic leading-relaxed text-white/60">
                12 Longshot Lane,<br />
                Bracknell, Berkshire,<br />
                RG12 1RL, UK
              </address>
              <p className="text-white/50">UK · Working worldwide</p>
            </div>
          </div>

          {/* Services — each label maps to its dedicated /services/[slug] */}
          <div data-footer-col className="md:col-span-3">
            <p className="mb-6 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/40">
              Services
            </p>
            <ul className="space-y-3 text-sm text-white/70">
              {footerNav.services.map((item) => {
                const slug: Record<string, string> = {
                  Websites: "websites",
                  Consultancy: "consultancy",
                  "Automation & AI": "automation-ai",
                  SEO: "seo",
                  Marketing: "marketing",
                  Design: "design",
                };
                const href = slug[item] ? `/services/${slug[item]}` : "/services";
                return (
                  <li key={item}>
                    <a
                      href={href}
                      data-cursor="hover"
                      className="inline-block transition hover:text-white"
                    >
                      {item}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Agency */}
          <div data-footer-col className="md:col-span-2">
            <p className="mb-6 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/40">
              Agency
            </p>
            <ul className="space-y-3 text-sm text-white/70">
              {footerNav.agency.map((item) => (
                <li key={item}>
                  <a
                    href={item === "Contact" ? "/contact" : item === "Work" ? "/work" : item === "Services" ? "/services" : item === "About" ? "/about" : "#"}
                    data-cursor="hover"
                    className="inline-block transition hover:text-white"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div data-footer-col className="md:col-span-3">
            <p className="mb-6 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/40">
              Legal
            </p>
            <ul className="space-y-3 text-sm text-white/70">
              {footerNav.legal.map((item) => (
                <li key={item}>
                  <a
                    href={
                      item === "Privacy Policy"
                        ? "/privacy"
                        : item === "Cookie Policy"
                        ? "/cookies"
                        : item === "Accessibility"
                        ? "/accessibility"
                        : "#"
                    }
                    data-cursor="hover"
                    className="inline-block transition hover:text-white"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Huge wordmark */}
      <div
        data-wordmark
        className="relative overflow-hidden border-t border-white/10"
      >
        <div className="pointer-events-none select-none pt-10 pb-6 md:pt-14 md:pb-8">
          <h2
            aria-hidden="true"
            className="whitespace-nowrap text-center font-[family-name:var(--font-display)] text-[24vw] font-black leading-[0.8] tracking-[-0.04em] text-white/[0.06]"
          >
            {[..."webgro."].map((c, i) => (
              <span
                key={i}
                data-wordmark-char
                className={`inline-block will-change-transform ${
                  c === "." ? "text-wg-blue/30" : ""
                }`}
              >
                {c}
              </span>
            ))}
          </h2>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-center font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/40 md:flex-row md:text-left md:px-12 lg:px-16">
          <p>
            © 2026 Webgro Ltd · Reg. 10889889 · Part of{" "}
            <a
              href="https://broadbridge.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="text-white/60 underline underline-offset-4 transition hover:text-white"
            >
              Broadbridge Group
            </a>
          </p>
          <p>Built with care.</p>
        </div>
      </div>
    </footer>
  );
}
