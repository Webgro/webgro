"use client";

import { Fragment, useRef } from "react";
import { createGlPlanes } from "../glPlanes";
import { SCENE_QUERY, useGsap } from "../useGsap";
import { network, team, teamIntro } from "./content";

export function Team() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);

    gsap.from(q(".pv-about-team-head > *"), {
      yPercent: 40, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: el, start: "top 72%" },
    });

    q(".pv-about-person").forEach((row) => {
      gsap.from(row.querySelector(".pv-about-person-rule"), {
        scaleX: 0, duration: 1.3, ease: "power3.out",
        scrollTrigger: { trigger: row, start: "top 86%" },
      });
      gsap.from(row.querySelector(".pv-about-person-name > span"), {
        yPercent: 108, duration: 1.15, ease: "power3.out",
        scrollTrigger: { trigger: row.querySelector(".pv-about-person-name"), start: "top 90%" },
      });
      gsap.from(row.querySelectorAll(".pv-about-person-role, .pv-about-person-bio"), {
        y: 24, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: row.querySelector(".pv-about-person-text"), start: "top 84%" },
      });
    });

    gsap.from(q(".pv-about-specialist"), {
      yPercent: 100, duration: 0.9, ease: "power3.out", stagger: 0.06,
      scrollTrigger: { trigger: q(".pv-about-specialists")[0], start: "top 82%" },
    });
    gsap.from(q(".pv-about-network-body"), {
      y: 28, autoAlpha: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: q(".pv-about-network-body")[0], start: "top 88%" },
    });

    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      // Portraits and copy travel at slightly different speeds, so the WebGL
      // planes always have some movement to bend with.
      q(".pv-about-person").forEach((row) => {
        const media = row.querySelector(".pv-about-person-drift");
        if (!media) return;
        gsap.fromTo(media, { y: () => window.innerHeight * 0.07 }, {
          y: () => window.innerHeight * -0.07, ease: "none",
          scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
        });
      });

      let planes: ReturnType<typeof createGlPlanes> = null;
      let io: IntersectionObserver | undefined;
      if (canvas.current) {
        el.classList.add("is-gl-ready");
        planes = createGlPlanes(canvas.current, q(".pv-about-person-media") as HTMLElement[]);
        if (!planes) el.classList.remove("is-gl-ready");
        if (planes) {
          io = new IntersectionObserver(([e]) => planes?.setRunning(e.isIntersecting), { rootMargin: "20% 0px" });
          io.observe(el);
        }
      }

      return () => {
        io?.disconnect();
        planes?.destroy();
        el.classList.remove("is-gl-ready");
      };
    });

    return () => mm.revert();
  });

  return (
    <section className="pv-about-team" ref={root} data-pv-theme="ink">
      <canvas className="pv-about-team-canvas" ref={canvas} aria-hidden="true" />

      <div className="pv-about-team-head">
        <h2 className="pv-h2">{teamIntro.heading}</h2>
        <p className="pv-lede">{teamIntro.lede}</p>
      </div>

      <div className="pv-about-people">
        {team.map((m, i) => (
          <article
            className={`pv-about-person${i % 2 ? " is-flipped" : ""}${m.photo ? "" : " is-type-only"}`}
            key={m.name}
          >
            <span className="pv-about-person-rule" aria-hidden="true" />
            {m.photo ? (
              <div className="pv-about-person-drift">
                <div className="pv-about-person-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.photo}
                    alt={`Portrait of ${m.name}, ${m.role.split(",")[0]} at Webgro`}
                    width={m.photoSize ?? 800}
                    height={m.photoSize ?? 800}
                    loading="lazy"
                  />
                </div>
              </div>
            ) : null}
            <div className="pv-about-person-text">
              <p className="pv-label pv-about-person-role">{m.role}</p>
              <h3 className="pv-about-person-name"><span>{m.name}</span></h3>
              <p className="pv-about-person-bio">{m.bio}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="pv-about-network">
        <p className="pv-label">{network.label}</p>
        <p className="pv-about-specialists">
          {network.specialists.map((s, i) => (
            <Fragment key={s}>
              <span className="pv-about-specialist-mask">
                <span className="pv-about-specialist">
                  {s}{i < network.specialists.length - 1 ? "," : "."}
                </span>
              </span>{" "}
            </Fragment>
          ))}
        </p>
        <p className="pv-about-network-body">{network.body}</p>
      </div>
    </section>
  );
}
