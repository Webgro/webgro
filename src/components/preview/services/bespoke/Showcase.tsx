"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { pv } from "../../links";
import { SCENE_QUERY, useGsap } from "../../useGsap";
import { Screen } from "./Screen";
import { BESPOKE_PATH, bespokeTools, otherTools } from "./tools";

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * The Fun Cases hub: ten tools in a list, each linking to its own page, beside
 * one screen that stays in view. The screen shows whichever tool is crossing
 * the reading line as the list scrolls, or the one under the pointer.
 */
function Hub() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const pointed = useRef(false);

  useGsap(root, ({ gsap, ScrollTrigger }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);

    // Which tool the screen shows follows the scroll. This is state, not
    // animation, so it runs with reduced motion too.
    q(".pv-bsp-tool").forEach((row, i) => {
      ScrollTrigger.create({
        trigger: row, start: "top 58%", end: "bottom 58%",
        onToggle: (self) => { if (self.isActive && !pointed.current) setActive(i); },
      });
    });

    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      const head = q(".pv-bsp-hub-head")[0];
      gsap.from(head.children, {
        y: 36, duration: 1, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: head, start: "top 88%", once: true },
      });
      q(".pv-bsp-tool").forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 94%", once: true } });
        tl.from(row.querySelector(".pv-bsp-tool-rule"), { scaleX: 0, duration: 1, ease: "power3.inOut" })
          .from(row.querySelector(".pv-bsp-tool-in"), { y: 24, duration: 0.8, ease: "power3.out" }, 0.05);
      });
      const stage = q(".pv-bsp-hub-stage")[0];
      gsap.fromTo(q(".pv-bsp-hub .pv-bsp-tilt"), { rotationX: 14, scale: 0.95 }, {
        rotationX: 0, scale: 1, ease: "none",
        scrollTrigger: { trigger: stage, start: "top 96%", end: "top 40%", scrub: 0.5 },
      });
    });
    return () => mm.revert();
  });

  const current = bespokeTools[active] ?? bespokeTools[0];

  return (
    <section className="pv-bsp-hub" id="fun-cases" ref={root} data-pv-theme="paper">
      <div className="pv-bsp-hub-head">
        <p className="pv-label">Fun Cases</p>
        <h2 className="pv-h2">Ten tools in one hub</h2>
        <p className="pv-lede">
          Fun Cases sell phone cases online and print them in their own workshop. These are the tools they run
          the business on, all behind one login. Each tool has its own page.
        </p>
        <p className="pv-bsp-note">
          The screen changes with the tool in the list. Each one is an example screen, redrawn with sample
          data.
        </p>
      </div>

      <div className="pv-bsp-hub-stage">
        <div className="pv-bsp-persp">
          <div className="pv-bsp-tilt">
            <div className="pv-bsp-swap" key={current.mock}>
              <Screen name={current.mock} decorative />
            </div>
          </div>
        </div>
        <p className="pv-bsp-hub-now" aria-hidden="true">{current.name}</p>
      </div>

      <ul className="pv-bsp-tools">
        {bespokeTools.map((t, i) => (
          <li key={t.slug}>
            <Link
              href={pv(`${BESPOKE_PATH}/${t.slug}`)}
              className={`pv-bsp-tool${i === active ? " is-active" : ""}`}
              data-cursor
              onPointerEnter={(e) => {
                if (e.pointerType !== "mouse") return;
                pointed.current = true;
                setActive(i);
              }}
              onPointerLeave={() => { pointed.current = false; }}
              onFocus={() => setActive(i)}
            >
              <span className="pv-bsp-tool-rule" />
              <span className="pv-bsp-tool-in">
                <span className="pv-bsp-tool-text">
                  <span className="pv-bsp-tool-name">{t.name}</span>
                  <span className="pv-bsp-tool-card">{t.card}</span>
                </span>
                <Arrow />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The three other tools, each with its screen. */
function Others() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      const head = q(".pv-bsp-others-head")[0];
      gsap.from(head.children, {
        y: 36, duration: 1, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: head, start: "top 88%", once: true },
      });
      q(".pv-bsp-other").forEach((item) => {
        const text = item.querySelector(".pv-bsp-other-text");
        if (text) {
          gsap.from(text.children, {
            y: 30, duration: 0.9, ease: "power3.out", stagger: 0.07,
            scrollTrigger: { trigger: text, start: "top 86%", once: true },
          });
        }
        const shot = item.querySelector(".pv-bsp-other-screen");
        gsap.fromTo(item.querySelector(".pv-bsp-tilt"), { rotationX: 14, scale: 0.95 }, {
          rotationX: 0, scale: 1, ease: "none",
          scrollTrigger: { trigger: shot, start: "top 96%", end: "top 40%", scrub: 0.5 },
        });
      });
    });
    return () => mm.revert();
  });

  return (
    <section className="pv-bsp-others" ref={root} data-pv-theme="ink">
      <div className="pv-bsp-others-head">
        <h2 className="pv-h2">Other software we&rsquo;ve built</h2>
        <p className="pv-lede">A helpdesk assistant, a quote desk and our own client portal.</p>
      </div>

      {otherTools.map((t, i) => (
        <article className={`pv-bsp-other${i % 2 ? " is-flip" : ""}`} id={t.id} key={t.id}>
          <div className="pv-bsp-other-text">
            <p className="pv-label">{t.label}</p>
            <h3 className="pv-h3">{t.title}</h3>
            {t.body.map((p) => <p className="pv-bsp-other-body" key={p}>{p}</p>)}
            <ul className="pv-bsp-points">
              {t.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
            {t.link && (
              <p><Link href={pv(t.link.path)} className="pv-textlink pv-bsp-hit" data-cursor>{t.link.label}</Link></p>
            )}
          </div>
          <div className="pv-bsp-other-screen">
            <div className="pv-bsp-persp">
              <div className="pv-bsp-tilt">
                <Screen name={t.mock} decorative />
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

export function Showcase() {
  return (
    <>
      <Hub />
      <Others />
    </>
  );
}
