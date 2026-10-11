"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { pv } from "../links";
import { pvBespokeMenu, pvServices, pvSubServices } from "../services/content";

/** The branches listed under a service in the menu. */
const branchesOf = (slug: string) => (slug === "marketing" ? pvSubServices : slug === "bespoke-software" ? pvBespokeMenu : []);
import "./menu.css";

/**
 * The Services dropdown: a small panel under the nav link with the seven
 * services, with the branches of Marketing and Bespoke Software indented
 * beneath them. Nothing else.
 */
export function ServicesMenu({
  open,
  onOpen,
  onClose,
}: {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const closeTimer = useRef<number | undefined>(undefined);
  const panelId = useId();

  const hold = () => window.clearTimeout(closeTimer.current);
  const release = () => {
    hold();
    closeTimer.current = window.setTimeout(onClose, 140);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => () => hold(), []);

  return (
    <div
      className={`pv-menu-root${open ? " is-open" : ""}`}
      onMouseEnter={() => { hold(); onOpen(); }}
      onMouseLeave={release}
    >
      <span className="pv-menu-trigger">
        <Link href={pv("/services")} data-cursor onFocus={() => { hold(); onOpen(); }}>Services</Link>
        <button
          type="button"
          className="pv-menu-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Close the services menu" : "Open the services menu"}
          onClick={() => (open ? onClose() : onOpen())}
        >
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" /></svg>
        </button>
      </span>

      <div
        className="pv-menu"
        id={panelId}
        aria-hidden={!open}
        onFocus={hold}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) release(); }}
      >
        <ul className="pv-menu-list">
          {pvServices.map((s, i) => (
            <li key={s.slug} style={{ "--i": i } as React.CSSProperties}>
              <Link href={pv(s.path)} data-cursor tabIndex={open ? 0 : -1} onClick={onClose}>{s.name}</Link>
              {branchesOf(s.slug).length > 0 && (
                <ul className="pv-menu-subs">
                  {branchesOf(s.slug).map((sub) => (
                    <li key={sub.slug}>
                      <Link href={pv(sub.path)} data-cursor tabIndex={open ? 0 : -1} onClick={onClose}>{sub.name}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li style={{ "--i": pvServices.length } as React.CSSProperties}>
            <Link href={pv("/care-plans")} data-cursor tabIndex={open ? 0 : -1} onClick={onClose}>Care plans</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
