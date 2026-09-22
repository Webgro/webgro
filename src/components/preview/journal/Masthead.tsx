"use client";

import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { BrushStroke } from "../Brush";
import { createGlPlanes } from "../glPlanes";
import { pv } from "../links";
import { SCENE_QUERY, useGsap } from "../useGsap";
import { SetTitle } from "./SetTitle";
import { tidy, type ArticleSummary } from "./lines";

/**
 * The opening scene. The masthead fills the first screen like the cover of a
 * magazine. As you scroll, the wordmark shrinks into a running head at the
 * top of the page, the cover story's picture comes up from below the fold as
 * a bendy WebGL plane, and its headline sets itself one line at a time.
 */
export function Masthead({ lead }: { lead: ArticleSummary }) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const href = pv(`/the-gro/${lead.slug}`);

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add(SCENE_QUERY, () => {
      el.classList.add("is-scene");
      const stage = q(".pv-jrnl-mast-stage")[0] as HTMLElement;
      const mark = q(".pv-jrnl-wordmark")[0] as HTMLElement;
      const media = q(".pv-jrnl-cover-media")[0] as HTMLElement;
      const lines = q(".pv-jrnl-cover-title .pv-line > span");
      const fades = q(".pv-jrnl-cover-fade");

      let geo = { s: 0.1, y: 0, rise: 1200 };
      const measure = () => {
        const narrow = window.innerWidth < 900;
        const size = parseFloat(getComputedStyle(mark).fontSize) || 300;
        geo = {
          s: (narrow ? 21 : 28) / size,
          y: (narrow ? 78 : 94) - mark.offsetTop,
          // Far enough down that the picture starts fully below the fold.
          rise: stage.offsetHeight + 140,
        };
      };
      measure();

      gsap.set(mark, { transformOrigin: "0 0" });
      gsap.set(media, { y: () => geo.rise });
      gsap.set(lines, { yPercent: 110 });
      gsap.set(fades, { autoAlpha: 0, y: 22 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: () => {
            measure();
            gsap.set(mark, { x: 0, y: 0, scale: 1 });
            gsap.set(media, { y: geo.rise });
          },
        },
      });

      tl.to(q(".pv-jrnl-mast-top"), { autoAlpha: 0, yPercent: -30, duration: 0.7, ease: "power2.in" }, 0)
        .to(mark, { y: () => geo.y, scale: () => geo.s, duration: 1.6 }, 0)
        .fromTo(media, { y: () => geo.rise }, { y: 0, duration: 1.7, ease: "power3.out" }, 0.45)
        .to(lines, { yPercent: 0, duration: 0.9, ease: "power3.out", stagger: 0.14 }, 1.25)
        .to(fades, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 }, 1.75)
        .to({}, { duration: 0.6 });

      let planes: ReturnType<typeof createGlPlanes> = null;
      let io: IntersectionObserver | undefined;
      if (canvas.current) {
        planes = createGlPlanes(canvas.current, [media]);
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

    // The brushed stroke under "Gro", once the wordmark has risen into place.
    gsap.fromTo(q(".pv-jrnl-mast-brush"), { clipPath: "inset(0% 100% 0% 0%)" }, {
      clipPath: "inset(0% 0% 0% 0%)", duration: 1, delay: 0.85, ease: "power3.out",
    });

    return () => mm.revert();
  });

  return (
    <section className="pv-jrnl-mast" ref={root} data-pv-theme="paper">
      <canvas className="pv-jrnl-canvas" ref={canvas} aria-hidden="true" />
      <div className="pv-jrnl-mast-stage">
        <div className="pv-jrnl-mast-head">
          <div className="pv-jrnl-mast-top">
            <div className="pv-jrnl-mast-row">
              <p className="pv-jrnl-mast-intro">
                Articles from the Webgro team on building websites, SEO and using AI in a business.
              </p>
            </div>
          </div>
          <h1 className="pv-jrnl-wordmark">
            <span className="pv-line" style={{ "--i": 0 } as CSSProperties}><span>The</span></span>
            <span className="pv-line" style={{ "--i": 1 } as CSSProperties}>
              <span>
                <span className="pv-brushed">
                  Gro
                  <BrushStroke className="pv-jrnl-mast-brush" />
                </span>
              </span>
            </span>
          </h1>
        </div>

        <article className="pv-jrnl-cover">
          <div className="pv-jrnl-cover-text">
            <p className="pv-jrnl-cover-meta pv-jrnl-cover-fade">
              <span>The latest</span>
              <span>{lead.category}</span>
              <span>{lead.date}</span>
              <span>{lead.readTime}</span>
            </p>
            <h2 className="pv-jrnl-cover-title">
              <Link href={href} data-cursor>
                <SetTitle text={tidy(lead.title)} wide={17} narrow={16} />
              </Link>
            </h2>
            <p className="pv-jrnl-cover-excerpt pv-jrnl-cover-fade">{tidy(lead.excerpt)}</p>
            <p className="pv-jrnl-cover-fade">
              <Link href={href} className="pv-textlink" data-cursor>Read the article</Link>
            </p>
          </div>
          <Link href={href} className="pv-jrnl-cover-media pv-jrnl-gl" data-cursor tabIndex={-1} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lead.heroImage} alt="" width={1240} height={692} />
          </Link>
        </article>
      </div>
    </section>
  );
}
