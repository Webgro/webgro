"use client";

import { useRef, type CSSProperties } from "react";
import { BrushStroke } from "../Brush";
import { SCENE_QUERY, useGsap } from "../useGsap";
import { hero, team } from "./content";
import { Lines } from "./Lines";

/** Only the people with a portrait go in the hero. */
/** The fan runs the other way to the team list below, which is how the owner wants it. */
const faces = team.filter((m) => m.photo).slice().reverse();
const roleOf = (role: string) => role.split(",")[0];

export function AboutHero() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    gsap.fromTo(q(".pv-about-hero-brush"), { clipPath: "inset(0% 100% 0% 0%)" }, {
      clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, delay: 0.9, ease: "power3.out",
    });
    gsap.from(q(".pv-about-fact-rule"), {
      scaleX: 0, duration: 1.1, ease: "power3.out", stagger: 0.08, delay: 0.7,
    });
    gsap.from(q(".pv-about-fact-figure > span"), {
      yPercent: 108, duration: 1, ease: "power3.out", stagger: 0.08, delay: 0.8,
    });
    gsap.from(q(".pv-about-fact-label"), {
      autoAlpha: 0, y: 14, duration: 0.8, ease: "power2.out", stagger: 0.08, delay: 1.1,
    });

    // The cards and portraits deal in with CSS, so they are in place before
    // this script arrives. GSAP only adds the scroll spread and pointer tilt.
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      const deck = q(".pv-about-deck")[0] as HTMLElement;
      const moves = q(".pv-about-card-move") as HTMLElement[];
      const mid = (moves.length - 1) / 2;

      // As the hero scrolls away the fan opens out towards a row. The front
      // card stays put and the rest slide left, so nothing runs off the page.
      gsap.to(moves, {
        x: (i: number) => (i - (moves.length - 1)) * deck.offsetWidth * 0.085,
        y: (i: number) => Math.abs(i - mid) * deck.offsetWidth * 0.035,
        rotation: (i: number) => (i - mid) * 3.2,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom 35%", scrub: 0.6, invalidateOnRefresh: true },
      });

      // Phones and tablets: the portrait row loosens out the same way.
      gsap.to(q(".pv-about-face"), {
        x: (i: number) => i * 7,
        ease: "none",
        scrollTrigger: { trigger: q(".pv-about-faces")[0], start: "top 80%", end: "top 20%", scrub: 0.6 },
      });

      // Pointer tilt, only where there is a real pointer.
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      const tilt = q(".pv-about-deck-tilt")[0] as HTMLElement;
      gsap.set(tilt, { transformPerspective: 1100 });
      const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.9, ease: "power3.out" });
      const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.9, ease: "power3.out" });
      const pars = (q(".pv-about-card-par") as HTMLElement[]).map((p, i) => ({
        x: gsap.quickTo(p, "x", { duration: 1.1, ease: "power3.out" }),
        y: gsap.quickTo(p, "y", { duration: 1.1, ease: "power3.out" }),
        depth: 0.4 + i * 0.3,
      }));

      const onMove = (e: PointerEvent) => {
        const r = deck.getBoundingClientRect();
        const px = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.5)));
        const py = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight * 0.5)));
        ry(px * 9);
        rx(py * -7);
        for (const p of pars) { p.x(px * 10 * p.depth); p.y(py * 8 * p.depth); }
      };
      const onLeave = () => {
        rx(0); ry(0);
        for (const p of pars) { p.x(0); p.y(0); }
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    });

    return () => mm.revert();
  });

  const brushed = (
    <span className="pv-brushed">
      since 2012
      <BrushStroke className="pv-about-hero-brush" />
    </span>
  );

  return (
    <section className="pv-about-hero" ref={root} data-pv-theme="paper">
      <div className="pv-about-hero-copy">
        <p className="pv-about-hero-kicker">{hero.kicker}</p>
        <h1 className="pv-h1 pv-about-hero-title">
          <Lines
            wide={["A Shopify and WordPress", "studio in Bracknell,", <>in business {brushed}.</>]}
            narrow={["A Shopify and", "WordPress studio", "in Bracknell,", "in business", <>{brushed}.</>]}
          />
        </h1>
        <p className="pv-about-hero-lede">{hero.lede}</p>

        {/* Phones and tablets: a row of small overlapping portraits. */}
        <div className="pv-about-faces">
          <ul className="pv-about-faces-row" aria-hidden="true">
            {faces.map((m, i) => (
              <li className="pv-about-face" key={m.name} style={{ "--i": i } as CSSProperties}>
                <span className="pv-about-face-pop">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.photo} alt="" width={m.photoSize ?? 800} height={m.photoSize ?? 800} decoding="async" fetchPriority="low" />
                </span>
              </li>
            ))}
          </ul>
          <p className="pv-about-faces-names">
            {faces.map((m) => m.name).slice(0, -1).join(", ")} and {faces[faces.length - 1].name}
          </p>
        </div>
      </div>

      {/* Desktop: the team dealt in as a small fan of cards. */}
      <div className="pv-about-deck" role="list" aria-label="The team">
        <div className="pv-about-deck-tilt">
          {faces.map((m, i) => (
            <div className="pv-about-card" role="listitem" key={m.name} style={{ "--i": i } as CSSProperties}>
              <div className="pv-about-card-deal">
                <div className="pv-about-card-move">
                  <div className="pv-about-card-par">
                    <figure className="pv-about-card-face" tabIndex={0} data-cursor>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.photo}
                        alt={`Portrait of ${m.name}`}
                        width={m.photoSize ?? 800}
                        height={m.photoSize ?? 800}
                        decoding="async"
                        fetchPriority="low"
                      />
                      <figcaption className="pv-about-card-label">
                        <span className="pv-about-card-name">{m.name}</span>
                        <span className="pv-about-card-role">{roleOf(m.role)}</span>
                      </figcaption>
                    </figure>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ul className="pv-about-facts">
        {hero.facts.map((f) => (
          <li className="pv-about-fact" key={f.figure}>
            <span className="pv-about-fact-rule" aria-hidden="true" />
            <span className="pv-about-fact-figure"><span>{f.figure}</span></span>
            <span className="pv-about-fact-label">{f.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
