"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { BrushStroke } from "@/components/preview/Brush";
import { pv } from "@/components/preview/links";
import { SCENE_QUERY, STATIC_QUERY, useGsap } from "@/components/preview/useGsap";
import "./legal.css";

export type LegalPath = "/privacy" | "/cookies" | "/accessibility";
type IndexItem = { id: string; label: string };

const DOCS: { path: LegalPath; label: string }[] = [
  { path: "/privacy", label: "Privacy" },
  { path: "/cookies", label: "Cookies" },
  { path: "/accessibility", label: "Accessibility" },
];

/** Room left above a heading after a jump, so the returning nav never sits on it. */
const JUMP_OFFSET = 104;

export function LegalView({
  title,
  intro,
  lastReviewed,
  current,
  index,
  children,
}: {
  title: string;
  intro: string;
  lastReviewed: string;
  current: LegalPath;
  index: IndexItem[];
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(index[0]?.id ?? "");
  const [open, setOpen] = useState(false);

  // Which section is being read: the last heading to pass the upper third of the screen.
  useEffect(() => {
    const els = index
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.36;
      let cur = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) cur = el.id;
        else break;
      }
      setActive((prev) => (prev === cur ? prev : cur));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [index]);

  // Slide the blue marker alongside the current entry in the desktop index.
  useEffect(() => {
    const place = () => {
      const link = list.current?.querySelector<HTMLElement>('[aria-current="location"]');
      const item = link?.parentElement;
      if (!item || !marker.current) return;
      marker.current.style.transform = `translate3d(0, ${item.offsetTop}px, 0)`;
      marker.current.style.height = `${item.offsetHeight}px`;
      marker.current.style.opacity = "1";
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  // Arriving with a #section in the address: go straight there once layout has settled.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id || !index.some((s) => s.id === id)) return;
    const t = window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - JUMP_OFFSET, behavior: "auto" });
    }, 350);
    return () => clearTimeout(t);
  }, [index]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const jump = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const calm = window.matchMedia(STATIC_QUERY).matches;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - JUMP_OFFSET,
      behavior: calm ? "auto" : "smooth",
    });
    window.history.replaceState(null, "", `#${id}`);
    setOpen(false);
  };

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    // Reading progress: the stroke slides in from the left, so its dry tip is always the leading edge.
    gsap.set(q(".pv-legal-progress"), { autoAlpha: 1 });
    gsap.fromTo(q(".pv-legal-progress-stroke"), { xPercent: -100 }, {
      xPercent: 0, ease: "none",
      scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.3 },
    });

    mm.add(SCENE_QUERY, () => {
      // The first section is set by CSS with the title, so it never flashes while GSAP loads.
      q(".pv-legal-section:not(:first-child), .pv-legal-end").forEach((section) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: "top 86%" } });
        tl.from(section.querySelector(".pv-legal-rule"), { scaleX: 0, duration: 1.2, ease: "power3.inOut" })
          .from(section.querySelectorAll(".pv-line > span"), { yPercent: 112, duration: 0.95, ease: "power3.out" }, 0.18);
      });
      gsap.fromTo(q(".pv-legal-ask-brush"), { clipPath: "inset(0% 100% 0% 0%)" }, {
        clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: q(".pv-legal-end")[0], start: "top 72%" },
      });
      gsap.from(q(".pv-legal-end-body, .pv-legal-also"), {
        y: 18, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: q(".pv-legal-end")[0], start: "top 80%" },
      });
    });

    return () => mm.revert();
  });

  const words = title.split(" ");
  const activeLabel = index.find((s) => s.id === active)?.label ?? index[0]?.label ?? "";
  const others = DOCS.filter((d) => d.path !== current);

  return (
    <section className="pv-legal" ref={root} data-pv-theme="paper">
      <div className="pv-legal-progress" aria-hidden="true">
        <div className="pv-legal-progress-stroke"><BrushStroke /></div>
      </div>

      <header className="pv-legal-head">
        <nav className="pv-legal-docs" aria-label="Legal pages">
          <span className="pv-label">Legal pages</span>
          {DOCS.map((d) => (
            <Link key={d.path} href={pv(d.path)} aria-current={d.path === current ? "page" : undefined} data-cursor>
              {d.label}
            </Link>
          ))}
        </nav>

        <h1 className="pv-h1 pv-legal-title">
          {words.map((w, i) => (
            <span className="pv-line" key={`${w}-${i}`}>
              <span>
                {i === 0 ? (
                  <span className="pv-brushed">{w}<BrushStroke className="pv-legal-title-brush" /></span>
                ) : w}
              </span>
            </span>
          ))}
        </h1>

        <div className="pv-legal-head-row">
          <p className="pv-legal-intro">{intro}</p>
          <p className="pv-legal-meta">Last reviewed {lastReviewed}</p>
        </div>
      </header>

      <div className="pv-legal-body">
        <nav className="pv-legal-index" aria-label="On this page">
          <p className="pv-label">On this page</p>
          <div className="pv-legal-index-list" ref={list}>
            <span className="pv-legal-index-marker" ref={marker} aria-hidden="true" />
            <ol>
              {index.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={s.id === active ? "location" : undefined}
                    onClick={(e) => jump(e, s.id)}
                    data-cursor
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="pv-legal-content">
          {children}

          <div className="pv-legal-end">
            <span className="pv-legal-rule" aria-hidden="true" />
            <p className="pv-legal-ask">
              <span className="pv-line">
                <span>
                  Questions about{" "}
                  <span className="pv-brushed">any of this?<BrushStroke className="pv-legal-ask-brush" /></span>
                </span>
              </span>
            </p>
            <p className="pv-legal-end-body">
              Email or call us and we&rsquo;ll explain it. We reply within one working day.{" "}
              <Link href={pv("/contact")} className="pv-textlink" data-cursor>Get in touch</Link>
            </p>
            <p className="pv-legal-also">
              Other legal pages:{" "}
              {others.map((d, i) => (
                <span key={d.path}>
                  {i > 0 ? " and " : ""}
                  <Link href={pv(d.path)} className="pv-legal-a" data-cursor>{d.label}</Link>
                </span>
              ))}
              .
            </p>
          </div>
        </div>

        <div className={`pv-legal-jump${open ? " is-open" : ""}`}>
          <nav className="pv-legal-jump-sheet" id="pv-legal-jump-sheet" aria-label="On this page" data-lenis-prevent>
            <ol>
              {index.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={s.id === active ? "location" : undefined}
                    onClick={(e) => jump(e, s.id)}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <button
            type="button"
            className="pv-legal-jump-bar"
            aria-expanded={open}
            aria-controls="pv-legal-jump-sheet"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="pv-legal-jump-label">On this page</span>
            <span className="pv-legal-jump-current">{activeLabel}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 14l6-6 6 6" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
