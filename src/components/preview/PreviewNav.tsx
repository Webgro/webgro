"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { pv } from "./links";
import { MobileMenu } from "./menu/MobileMenu";
import { ServicesMenu } from "./menu/ServicesMenu";

/** How long the phone sheet takes to close back into its toggle (see menu/mobile.css). */
const SHEET_CLOSE_MS = 640;

const links = [
  { href: pv("/work"), label: "Work" },
  { href: pv("/services"), label: "Services" },
  { href: pv("/about"), label: "About" },
  { href: pv("/the-gro"), label: "The Gro" },
];

export function PreviewNav() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const closingTimer = useRef<number | undefined>(undefined);
  const [menu, setMenu] = useState(false);
  const openMenu = useCallback(() => setMenu(true), []);
  const closeMenu = useCallback(() => setMenu(false), []);

  const openSheet = useCallback(() => {
    window.clearTimeout(closingTimer.current);
    setClosing(false);
    setOpen(true);
  }, []);
  // Keeps the bar on ink while the circle closes, so the logo and toggle
  // don't flip to dark over the still-visible sheet.
  const closeSheet = useCallback(() => {
    setOpen(false);
    window.clearTimeout(closingTimer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setClosing(true);
    closingTimer.current = window.setTimeout(() => setClosing(false), SHEET_CLOSE_MS);
  }, []);
  useEffect(() => () => window.clearTimeout(closingTimer.current), []);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setHidden(y > last && y > 160);
      last = y;
      setMenu(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`pv-nav${hidden && !open && !closing && !menu ? " is-hidden" : ""}${open ? " is-open" : ""}${closing ? " is-closing" : ""}${menu ? " has-menu" : ""}`}
      data-lenis-prevent={open ? "" : undefined}
    >
      <Link href={pv("/")} className="pv-nav-logo" aria-label="Webgro home" data-cursor onClick={open ? closeSheet : undefined}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="pv-logo-dark" src="/brand/logo.png" alt="Webgro" width={450} height={146} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="pv-logo-light" src="/brand/logo-white.png" alt="" width={450} height={146} />
      </Link>
      <nav className="pv-nav-links" aria-label="Main">
        {links.map((l) => (
          l.label === "Services" ? (
            <span key={l.href} style={{ display: "contents" }}>
              <ServicesMenu open={menu} onOpen={openMenu} onClose={closeMenu} />
              <Link href={l.href} className="pv-nav-services-plain" data-cursor>{l.label}</Link>
            </span>
          ) : (
            <Link key={l.href} href={l.href} data-cursor>{l.label}</Link>
          )
        ))}
      </nav>
      <Link href={pv("/contact")} className="pv-nav-cta" data-cursor>Start a project</Link>
      <MobileMenu open={open} onOpen={openSheet} onClose={closeSheet} />
    </header>
  );
}
