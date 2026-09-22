"use client";

import Link from "next/link";
import { useRef } from "react";
import { reel } from "./content";
import { createGlPlanes } from "./glPlanes";
import { pv } from "./links";
import { SCENE_QUERY, STATIC_QUERY, useGsap } from "./useGsap";

export function WorkReel() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add(SCENE_QUERY, () => {
      el.classList.add("is-scene");
      const track = q(".pv-reel-track")[0] as HTMLElement;
      const distance = () => track.scrollWidth - window.innerWidth;

      const slide = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: q(".pv-reel-stage")[0],
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(q(".pv-reel-bar span"), {
        scaleX: 1, ease: "none",
        scrollTrigger: {
          trigger: q(".pv-reel-stage")[0], start: "top top", end: () => `+=${distance()}`, scrub: 0.6,
        },
      });

      q(".pv-reel-item").forEach((item) => {
        gsap.from(item.querySelectorAll(".pv-reel-text > *"), {
          x: () => Math.min(140, window.innerWidth * 0.12), autoAlpha: 0, ease: "power2.out", stagger: 0.06,
          scrollTrigger: { containerAnimation: slide, trigger: item, start: "left 92%", end: "left 38%", scrub: true },
        });
      });

      let planes: ReturnType<typeof createGlPlanes> = null;
      let io: IntersectionObserver | undefined;
      if (canvas.current) {
        planes = createGlPlanes(canvas.current, q(".pv-reel-media") as HTMLElement[]);
        if (planes) {
          io = new IntersectionObserver(([e]) => planes?.setRunning(e.isIntersecting), { rootMargin: "20% 0px" });
          io.observe(el);
        }
      }

      return () => {
        io?.disconnect();
        planes?.destroy();
        el.classList.remove("is-scene");
      };
    });

    mm.add(STATIC_QUERY, () => {
      q(".pv-reel-item").forEach((item) => {
        gsap.from(item.children, {
          y: 60, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.12,
          scrollTrigger: { trigger: item, start: "top 80%" },
        });
      });
    });

    return () => mm.revert();
  });

  return (
    <section className="pv-reel" ref={root} data-pv-theme="ink" id="work">
      <canvas className="pv-reel-canvas" ref={canvas} aria-hidden="true" />
      <div className="pv-reel-stage">
        <div className="pv-reel-track">
          <div className="pv-reel-intro">
            <h2 className="pv-h2">Recent work</h2>
            <p className="pv-lede">
              Five recent projects, with a result we measured for each one.
            </p>
          </div>

          {reel.map((r, i) => (
            <article className={`pv-reel-item${i % 2 ? " is-low" : ""}`} key={r.slug}>
              <Link href={pv(`/work/${r.slug}`)} className="pv-reel-media" data-cursor aria-label={`${r.client} case study`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.img} alt={`${r.client} project by Webgro`} width={1800} height={1200} loading="lazy" />
              </Link>
              <div className="pv-reel-text">
                <h3 className="pv-reel-client">{r.client}</h3>
                <p className="pv-reel-body">{r.body}</p>
                <p className="pv-reel-figure">
                  <strong>{r.figure}</strong>
                  <span>{r.figureLabel}</span>
                </p>
                <Link href={pv(`/work/${r.slug}`)} className="pv-textlink" data-cursor>Read the case study</Link>
              </div>
            </article>
          ))}

          <div className="pv-reel-outro">
            <p className="pv-h2">More case studies</p>
            <Link href={pv("/work")} className="pv-btn pv-btn--light" data-cursor><span>View all work</span></Link>
          </div>
        </div>
        <div className="pv-reel-bar" aria-hidden="true"><span /></div>
      </div>
    </section>
  );
}
