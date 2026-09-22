"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { BrushStroke } from "../Brush";
import { pv } from "../links";
import { pvServices, pvSubServices } from "../services/content";
import "./mobile.css";

type Item = { href: string; label: string; services?: boolean };

const items: Item[] = [
  { href: pv("/work"), label: "Work" },
  { href: pv("/services"), label: "Services", services: true },
  { href: pv("/about"), label: "About" },
  { href: pv("/the-gro"), label: "The Gro" },
];

/** Services in sheet order, each with its stagger index (0 is "All services"). */
let order = 1;
const serviceRows = pvServices.map((s) => ({
  s,
  i: order++,
  branches: s.slug === "marketing" ? pvSubServices.map((b) => ({ b, i: order++ })) : [],
}));
const careIndex = order++;

const isCurrent = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);
const idx = (i: number) => ({ "--i": i }) as CSSProperties;

/** Centre the reveal circle on the toggle and size it to reach the farthest corner. */
function measure(b: HTMLElement | null, s: HTMLElement | null) {
  if (!b || !s) return;
  const r = b.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const w = window.innerWidth;
  const h = Math.max(window.innerHeight, document.documentElement.clientHeight);
  const radius = Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) + 40;
  s.style.setProperty("--pv-sheet-x", `${x}px`);
  s.style.setProperty("--pv-sheet-y", `${y}px`);
  s.style.setProperty("--pv-sheet-r", `${radius}px`);
}

/** The label, with the brushed stroke under it when it's the page you're on. */
function Label({ text, current }: { text: string; current: boolean }): ReactNode {
  if (!current) return text;
  return (
    <span className="pv-brushed">
      {text}
      <BrushStroke className="pv-nav-sheet-brush" />
    </span>
  );
}

/**
 * The phone menu (below 900px): a toggle whose two lines fold into a cross,
 * and an ink sheet that opens as a circle growing out of the toggle. The main
 * links rise out of masks, Services expands in place to show the six services
 * and Marketing's three branches, and the foot holds the enquiry button, the
 * email address and the phone number.
 */
export function MobileMenu({
  open,
  onOpen,
  onClose,
}: {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const pathname = usePathname() ?? "";
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLAnchorElement>(null);
  const wasOpen = useRef(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const sheetId = useId();
  const subId = useId();
  const inServices = isCurrent(pathname, pv("/services")) || isCurrent(pathname, pv("/care-plans"));

  const toggle = () => {
    if (open) {
      onClose();
      return;
    }
    measure(toggleRef.current, sheetRef.current);
    setServicesOpen(inServices);
    onOpen();
  };

  // While open: lock the page, trap focus, close on Escape or when the
  // viewport grows into the desktop nav.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    const prev = [html.style.overflow, body.style.overflow];
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const header = toggleRef.current?.closest("header") ?? null;
    const focusables = () =>
      Array.from(header?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []).filter(
        (el) => el.getClientRects().length > 0 && !el.closest("[inert]"),
      );

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement;
      const outside = !header || !active || !header.contains(active);
      if (e.shiftKey && (active === first || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    const mq = window.matchMedia("(min-width: 900px)");
    const onMq = () => { if (mq.matches) onClose(); };
    mq.addEventListener("change", onMq);

    const onResize = () => measure(toggleRef.current, sheetRef.current);
    window.addEventListener("resize", onResize);

    const raf = requestAnimationFrame(() => firstRef.current?.focus({ preventScroll: true }));

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      window.removeEventListener("resize", onResize);
      html.style.overflow = prev[0];
      body.style.overflow = prev[1];
    };
  }, [open, onClose]);

  // On close, hand focus back to the toggle if it was inside the sheet.
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    const active = document.activeElement;
    if (!active || active === document.body || sheetRef.current?.contains(active)) {
      toggleRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="pv-nav-toggle"
        aria-expanded={open}
        aria-controls={sheetId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={toggle}
        data-cursor
      >
        <span className="pv-nav-toggle-lines" aria-hidden="true">
          <i />
          <i />
        </span>
      </button>

      <div
        ref={sheetRef}
        id={sheetId}
        className="pv-nav-sheet"
        inert={!open}
        data-lenis-prevent
      >
        <nav className="pv-nav-sheet-nav" aria-label="Menu">
          <ul className="pv-nav-sheet-list">
            {items.map((l, i) => {
              const current = isCurrent(pathname, l.href);
              if (l.services) {
                return (
                  <li key={l.href} className="pv-nav-sheet-item" style={idx(i)}>
                    <button
                      type="button"
                      className={`pv-nav-sheet-row${servicesOpen ? " is-open" : ""}`}
                      aria-expanded={servicesOpen}
                      aria-controls={subId}
                      onClick={() => setServicesOpen((o) => !o)}
                    >
                      <span className="pv-nav-sheet-mask">
                        <span className="pv-nav-sheet-rise"><Label text={l.label} current={current} /></span>
                      </span>
                      <span className="pv-nav-sheet-sign" aria-hidden="true"><i /><i /></span>
                    </button>
                    <div id={subId} className={`pv-nav-sheet-sub${servicesOpen ? " is-open" : ""}`} inert={!servicesOpen}>
                      <div className="pv-nav-sheet-sub-inner">
                        <ul className="pv-nav-sheet-subs">
                          <li style={idx(0)}>
                            <Link
                              href={l.href}
                              className="pv-nav-sheet-all"
                              aria-current={pathname === l.href ? "page" : undefined}
                              onClick={onClose}
                            >
                              All services
                              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
                            </Link>
                          </li>
                          {serviceRows.map(({ s, i: si, branches }) => (
                            <li key={s.slug} style={idx(si)}>
                              <Link
                                href={pv(s.path)}
                                aria-current={pathname === pv(s.path) ? "page" : undefined}
                                onClick={onClose}
                              >
                                {s.name}
                              </Link>
                              {branches.length > 0 && (
                                <ul className="pv-nav-sheet-branches">
                                  {branches.map(({ b, i: bi }) => (
                                    <li key={b.slug} style={idx(bi)}>
                                      <Link
                                        href={pv(b.path)}
                                        aria-current={pathname === pv(b.path) ? "page" : undefined}
                                        onClick={onClose}
                                      >
                                        {b.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                          <li style={idx(careIndex)}>
                            <Link
                              href={pv("/care-plans")}
                              aria-current={pathname === pv("/care-plans") ? "page" : undefined}
                              onClick={onClose}
                            >
                              Care plans
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              }
              return (
                <li key={l.href} className="pv-nav-sheet-item" style={idx(i)}>
                  <Link
                    ref={i === 0 ? firstRef : undefined}
                    href={l.href}
                    className="pv-nav-sheet-row"
                    aria-current={current ? "page" : undefined}
                    onClick={onClose}
                  >
                    <span className="pv-nav-sheet-mask">
                      <span className="pv-nav-sheet-rise"><Label text={l.label} current={current} /></span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="pv-nav-sheet-foot">
          <Link href={pv("/contact")} className="pv-btn pv-btn--light pv-nav-sheet-cta" onClick={onClose}>
            <span>Start a project</span>
          </Link>
          <div className="pv-nav-sheet-contact">
            <a href="mailto:hello@webgro.co.uk">hello@webgro.co.uk</a>
            <a href="tel:+441344231119">01344 231 119</a>
          </div>
        </div>
      </div>
    </>
  );
}
