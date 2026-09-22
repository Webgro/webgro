"use client";

// The site footer. Every link goes through pv() from ./links, which is now the
// identity function.

import Link from "next/link";
import { useEffect, useRef } from "react";
import { GlobalMap } from "@/components/GlobalMap";
import { pv } from "./links";
import { ShopifyPartner } from "./ShopifyPartner";
import { NewsletterForm } from "./journal/Newsletter";

const SOCIAL = [
  { label: "Webgro on LinkedIn", href: "https://www.linkedin.com/company/webgroltd", d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
  { label: "Webgro on Facebook", href: "https://www.facebook.com/webgroltd", d: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" },
];

const TOWNS = [
  ["bracknell", "Bracknell"],
  ["reading", "Reading"],
  ["wokingham", "Wokingham"],
  ["windsor", "Windsor"],
  ["maidenhead", "Maidenhead"],
] as const;

const columns = [
  {
    title: "Services",
    links: [
      { label: "Websites", href: pv("/services/websites") },
      { label: "Consultancy", href: pv("/services/consultancy") },
      { label: "Automation and AI", href: pv("/services/automation-ai") },
      { label: "SEO", href: pv("/services/seo") },
      { label: "Marketing", href: pv("/services/marketing") },
      { label: "Email marketing", href: pv("/services/marketing/email-marketing"), sub: true },
      { label: "PPC", href: pv("/services/marketing/ppc"), sub: true },
      { label: "Social media", href: pv("/services/marketing/social-media"), sub: true },
      { label: "Design", href: pv("/services/design") },
      { label: "Care plans", href: pv("/care-plans") },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "Work", href: pv("/work") },
      { label: "Industries", href: pv("/industries") },
      { label: "About", href: pv("/about") },
      { label: "The Gro", href: pv("/the-gro") },
      { label: "Contact", href: pv("/contact") },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: pv("/privacy") },
      { label: "Cookie policy", href: pv("/cookies") },
      { label: "Accessibility", href: pv("/accessibility") },
    ],
  },
];

export function PreviewFooter() {
  const root = useRef<HTMLElement>(null);

  // Plain IntersectionObserver rather than ScrollTrigger: the footer sits below
  // pinned scenes that change the page height after load, which left a
  // ScrollTrigger here with a stale start position that never fired.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const parts = Array.from(el.querySelectorAll<HTMLElement>("[data-footer-reveal]"));
    parts.forEach((p) => p.classList.add("is-armed"));
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    }, { rootMargin: "0px 0px -8% 0px" });
    parts.forEach((p) => io.observe(p));
    return () => {
      io.disconnect();
      parts.forEach((p) => p.classList.remove("is-armed", "is-in"));
    };
  }, []);

  return (
    <footer ref={root} className="pv-foot" data-pv-theme="ink">
      <div className="pv-foot-news">
        <div className="pv-foot-news-copy">
          <p className="pv-label">Newsletter</p>
          <p className="pv-foot-news-h">Webgro news, new releases and articles from The Gro, by email.</p>
        </div>
        <NewsletterForm className="pv-foot-news-form" />
      </div>
      <div className="pv-foot-top" data-footer-reveal>
        <div className="pv-foot-brand">
          <div className="pv-foot-map" aria-hidden="true"><GlobalMap /></div>
          <Link href={pv("/")} aria-label="Webgro home" className="pv-foot-logo" data-cursor>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-white.png" alt="Webgro" width={450} height={146} />
          </Link>
          <p className="pv-foot-lede">Shopify and WordPress websites, SEO, marketing and custom software.</p>
          <p className="pv-foot-contact">
            <a href="mailto:hello@webgro.co.uk" data-cursor>hello@webgro.co.uk</a>
            <a href="tel:+441344231119" data-cursor>01344 231 119</a>
          </p>
          <p className="pv-foot-social">
            {SOCIAL.map((x) => (
              <a key={x.href} href={x.href} target="_blank" rel="noopener noreferrer" aria-label={x.label} data-cursor>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={x.d} /></svg>
              </a>
            ))}
          </p>
          <address className="pv-foot-address">12 Longshot Lane, Bracknell, Berkshire, RG12 1RL</address>
          <p className="pv-foot-towns">
            Web design in{" "}
            {TOWNS.map(([slug, name], i) => (
              <span key={slug}>
                <Link href={pv(`/web-design/${slug}`)} data-cursor>{name}</Link>
                {i < TOWNS.length - 2 ? ", " : i === TOWNS.length - 2 ? " and " : ""}
              </span>
            ))}
            , and across{" "}
            <Link href={pv("/web-design/berkshire")} data-cursor>Berkshire</Link>.
          </p>
          <ShopifyPartner className="pv-foot-partner" />
        </div>
        {columns.map((c) => (
          <nav className="pv-foot-col" key={c.title} aria-label={c.title}>
            <p className="pv-label">{c.title}</p>
            <ul>
              {c.links.map((l) => (
                <li key={l.href} className={"sub" in l && l.sub ? "is-sub" : undefined}>
                  <Link href={l.href} data-cursor>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="pv-foot-mark" aria-hidden="true" data-footer-reveal>
        {[..."webgro."].map((c, i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties} className={c === "." ? "is-dot" : undefined}>{c}</span>
        ))}
      </div>

      <div className="pv-foot-legal">
        <p>
          © {new Date().getFullYear()} Webgro Ltd. Registered in England, number 10889889. Part of{" "}
          <a href="https://broadbridge.co.uk" target="_blank" rel="noopener noreferrer" data-cursor>Broadbridge Group</a>.
        </p>
      </div>
    </footer>
  );
}
