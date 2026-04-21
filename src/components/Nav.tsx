"use client";

import { useEffect, useRef, useState } from "react";

type Accent = "blue" | "violet" | "teal";

type PrimaryService = {
  name: string;
  tagline: string;
  accent: Accent;
  href: string;
};

type SecondaryService = {
  name: string;
  tagline: string;
  accent: Accent;
  href: string;
};

type FeaturedWork = {
  name: string;
  tag: string;
  image: string;
  href: string;
};

const primaryServices: PrimaryService[] = [
  {
    name: "Websites",
    tagline: "Sites that sell, scale, and stay yours.",
    accent: "blue",
    href: "/services/websites",
  },
  {
    name: "Consultancy",
    tagline: "eCommerce strategy, without the fluff.",
    accent: "violet",
    href: "/services/consultancy",
  },
  {
    name: "Automation & AI",
    tagline: "AI that does the work, not the talking.",
    accent: "teal",
    href: "/services/automation-ai",
  },
];

const secondaryServices: SecondaryService[] = [
  {
    name: "SEO",
    tagline: "Traffic that compounds.",
    accent: "blue",
    href: "/services/seo",
  },
  {
    name: "Marketing",
    tagline: "Campaigns that land.",
    accent: "violet",
    href: "/services/marketing",
  },
  {
    name: "Design",
    tagline: "Systems, not decoration.",
    accent: "teal",
    href: "/services/design",
  },
];

const featuredWork: FeaturedWork[] = [
  {
    name: "Fun Cases",
    tag: "eCommerce",
    image: "/work/fun-cases.png",
    href: "/work/fun-cases",
  },
  {
    name: "Gieves & Hawkes",
    tag: "Luxury eCommerce",
    image: "/work/gieves-hawkes.webp",
    href: "/work/gieves-and-hawkes",
  },
  {
    name: "Sublishop",
    tag: "B2B eCommerce · AI",
    image: "/work/sublishop.jpg",
    href: "/work/sublishop",
  },
];

const accentDot: Record<Accent, string> = {
  blue: "bg-wg-blue",
  violet: "bg-wg-violet",
  teal: "bg-wg-teal",
};

const accentHover: Record<Accent, string> = {
  blue: "group-hover:text-wg-blue",
  violet: "group-hover:text-wg-violet",
  teal: "group-hover:text-wg-teal",
};

export function Nav() {
  const [visible, setVisible] = useState(true);
  const [scrolledPast, setScrolledPast] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"services" | "work" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastScrollY.current;

        if (y < 80) {
          setVisible((prev) => (prev ? prev : true));
        } else if (delta > 6) {
          setVisible((prev) => (prev ? false : prev));
          setOpenDropdown((prev) => (prev ? null : prev));
        } else if (delta < -6) {
          setVisible((prev) => (prev ? prev : true));
        }

        const nextScrolledPast = y > 24;
        setScrolledPast((prev) => (prev === nextScrolledPast ? prev : nextScrolledPast));

        lastScrollY.current = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const openNow = (name: "services" | "work") => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setOpenDropdown(name);
  };

  const closeLater = () => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    dropdownTimer.current = setTimeout(() => setOpenDropdown(null), 180);
  };

  const cancelClose = () => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
  };

  const closeDropdownImmediate = () => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setOpenDropdown(null);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Nav bar */}
        <div
          className={`transition-all duration-500 ${
            scrolledPast || openDropdown
              ? "border-b border-white/10 bg-wg-ink/75 backdrop-blur-xl"
              : "border-b border-transparent bg-transparent"
          }`}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12 md:py-5 lg:px-16">
            {/* Logo */}
            <a
              href="/"
              data-cursor="hover"
              aria-label="Webgro home"
              className="inline-flex items-center"
              onMouseEnter={closeLater}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/logo-white.png"
                alt="Webgro"
                className="h-7 w-auto md:h-8"
              />
            </a>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 md:flex">
              <DropdownTrigger
                label="Work"
                href="/work"
                isOpen={openDropdown === "work"}
                onEnter={() => openNow("work")}
                onLeave={closeLater}
              />
              <DropdownTrigger
                label="Services"
                href="/services"
                isOpen={openDropdown === "services"}
                onEnter={() => openNow("services")}
                onLeave={closeLater}
              />
              <a
                href="/about"
                data-cursor="hover"
                onMouseEnter={closeLater}
                className="px-4 py-2 text-sm text-white/70 transition hover:text-white"
              >
                About
              </a>
              <a
                href="/the-gro"
                data-cursor="hover"
                onMouseEnter={closeLater}
                className="px-4 py-2 text-sm text-white/70 transition hover:text-white"
              >
                The Gro
              </a>
              <a
                href="/contact"
                data-cursor="hover"
                onMouseEnter={closeLater}
                className="px-4 py-2 text-sm text-white/70 transition hover:text-white"
              >
                Contact
              </a>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Desktop CTA */}
              <a
                href="/contact"
                data-cursor="hover"
                onMouseEnter={closeLater}
                className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-medium text-wg-ink transition-colors hover:bg-wg-blue hover:text-white md:inline-flex"
              >
                Start a project
              </a>
              {/* Mobile compact CTA */}
              <a
                href="#contact"
                data-cursor="hover"
                className="group inline-flex items-center gap-1.5 rounded-full bg-wg-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white hover:text-wg-ink md:hidden"
              >
                Start a project
                <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
              </a>
              <button
                type="button"
                data-cursor="hover"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] md:hidden"
              >
                <span
                  className={`absolute block h-[1.5px] w-4 bg-white transition-all duration-300 ${
                    mobileOpen ? "rotate-45" : "-translate-y-[4px]"
                  }`}
                />
                <span
                  className={`absolute block h-[1.5px] w-4 bg-white transition-all duration-300 ${
                    mobileOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute block h-[1.5px] w-4 bg-white transition-all duration-300 ${
                    mobileOpen ? "-rotate-45" : "translate-y-[4px]"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown panels */}
        <div
          className={`absolute inset-x-0 top-full overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            openDropdown
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0"
          }`}
          onMouseEnter={cancelClose}
          onMouseLeave={closeLater}
        >
          <div className="border-b border-white/10 bg-wg-ink/95 backdrop-blur-xl">
            {openDropdown === "services" && (
              <ServicesDropdown onItemClick={closeDropdownImmediate} />
            )}
            {openDropdown === "work" && (
              <WorkDropdown onItemClick={closeDropdownImmediate} />
            )}
          </div>
        </div>
      </header>

      {/* Backdrop, glass-blurs the rest of the page when dropdown is open */}
      <div
        onClick={closeDropdownImmediate}
        onMouseEnter={closeLater}
        className={`fixed inset-0 z-40 hidden bg-wg-ink/40 backdrop-blur-lg transition-opacity duration-500 md:block ${
          openDropdown
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Mobile full-screen menu */}
      <div
        className={`fixed inset-0 z-40 bg-wg-ink transition-opacity duration-500 md:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full flex-col px-6 pb-10 pt-28">
          <nav className="flex flex-1 flex-col justify-center gap-2">
            {[
              { label: "Work", href: "/work" },
              { label: "Services", href: "/services" },
              { label: "About", href: "/about" },
              { label: "The Gro", href: "/the-gro" },
              { label: "Contact", href: "/contact" },
            ].map((item, i) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                data-cursor="hover"
                className="group flex items-center justify-between border-b border-white/10 py-5"
              >
                <span className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-white">
                  {item.label}
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-white/40">
                  0{i + 1}
                </span>
              </a>
            ))}

            {/* Quick services list on mobile */}
            <div className="mt-10">
              <p className="mb-4 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-white/40">
                All services
              </p>
              <div className="flex flex-wrap gap-2">
                {[...primaryServices, ...secondaryServices].map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    onClick={() => setMobileOpen(false)}
                    data-cursor="hover"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 text-sm text-white/80"
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${accentDot[s.accent]}`} />
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
          </nav>

          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            data-cursor="hover"
            className="group mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-wg-blue px-7 py-4 text-base font-medium text-white"
          >
            Start a project
            <span className="inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </div>
    </>
  );
}

function DropdownTrigger({
  label,
  href,
  isOpen,
  onEnter,
  onLeave,
}: {
  label: string;
  href: string;
  isOpen: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <a
        href={href}
        data-cursor="hover"
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm transition ${
          isOpen ? "text-white" : "text-white/70 hover:text-white"
        }`}
      >
        {label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path
            d="M2 3.5l3 3 3-3"
            stroke="currentColor"
            strokeWidth="1.3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}

function ServicesDropdown({ onItemClick }: { onItemClick: () => void }) {
  const allServices = [...primaryServices, ...secondaryServices];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-14 lg:px-16">
      <div className="grid grid-cols-3 gap-x-12 gap-y-10">
        {allServices.map((s) => (
          <a
            key={s.name}
            href={s.href}
            onClick={onItemClick}
            data-cursor="hover"
            className="group block"
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-[10px] h-2 w-2 shrink-0 rounded-full ${accentDot[s.accent]}`}
              />
              <div>
                <h4
                  className={`font-[family-name:var(--font-display)] text-2xl font-bold text-white transition-colors duration-300 ${accentHover[s.accent]}`}
                >
                  {s.name}
                </h4>
                <p className="mt-1 text-sm leading-relaxed text-white/60">
                  {s.tagline}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function WorkDropdown({ onItemClick }: { onItemClick: () => void }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-14 lg:px-16">
      <div className="mb-8 flex items-center gap-4">
        <span className="h-[1px] w-12 bg-wg-blue" />
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-wg-blue">
          Selected work
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {featuredWork.map((w) => (
          <a
            key={w.name}
            href={w.href}
            onClick={onItemClick}
            data-cursor="hover"
            className="group block"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-wg-ink-raised">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={w.image}
                alt={w.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wg-ink/70 via-transparent to-transparent" />
            </div>
            <div className="mt-4">
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-white/40">
                {w.tag}
              </p>
              <h4 className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold text-white transition-colors duration-300 group-hover:text-wg-blue">
                {w.name}
              </h4>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
        <p className="text-sm text-white/60">
          Three featured from 100+ shipped projects.
        </p>
        <a
          href="/work"
          onClick={onItemClick}
          data-cursor="hover"
          className="group inline-flex items-center gap-2 text-sm font-medium text-white transition hover:text-wg-blue"
        >
          View all projects
          <span className="inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>
    </div>
  );
}
