"use client";

import { useRef } from "react";
import { GOOGLE_PROFILE_URL, GOOGLE_RATING, reviews } from "./reviewData";
import { SCENE_QUERY, STATIC_QUERY, useGsap } from "./useGsap";

const STAR = "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z";

/**
 * Google reviews, word for word. Each quote starts dim and brightens one word
 * at a time as it scrolls up the screen, so it reads at the pace you scroll.
 */
export function Reviews({ limit = 5, theme = "ink" }: { limit?: number; theme?: "ink" | "paper" }) {
  const root = useRef<HTMLElement>(null);
  const shown = reviews.filter((r) => r.featured).slice(0, limit);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    const mm = gsap.matchMedia();

    mm.add(SCENE_QUERY, () => {
      gsap.fromTo(q(".pv-rev-star"), { scale: 0, rotation: -40, transformOrigin: "50% 50%" }, {
        scale: 1, rotation: 0, duration: 0.7, ease: "back.out(2.2)", stagger: 0.08,
        scrollTrigger: { trigger: q(".pv-rev-head")[0], start: "top 82%" },
      });
      gsap.from(q(".pv-rev-head .pv-line > span"), {
        yPercent: 110, duration: 0.9, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: q(".pv-rev-head")[0], start: "top 82%" },
      });
      q(".pv-rev").forEach((card) => {
        const words = card.querySelectorAll(".pv-rev-w");
        gsap.fromTo(words, { opacity: 0.16 }, {
          opacity: 1, ease: "none", stagger: 0.05,
          scrollTrigger: { trigger: card, start: "top 85%", end: "bottom 55%", scrub: 0.4 },
        });
        gsap.from(card.querySelector(".pv-rev-who"), {
          autoAlpha: 0, x: -20, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 60%" },
        });
        gsap.from(card.querySelector(".pv-rev-rule"), {
          scaleX: 0, transformOrigin: "0 50%", duration: 1.2, ease: "power3.inOut",
          scrollTrigger: { trigger: card, start: "top 88%" },
        });
      });
    });

    mm.add(STATIC_QUERY, () => {
      gsap.set(q(".pv-rev-w"), { opacity: 1 });
    });

    return () => mm.revert();
  });

  return (
    <section className="pv-rev-sec" ref={root} data-pv-theme={theme}>
      <div className="pv-rev-head">
        <p className="pv-label">Reviews</p>
        <h2 className="pv-h2">
          <span className="pv-line"><span>{GOOGLE_RATING.score} on Google</span></span>
          <span className="pv-line"><span>from {GOOGLE_RATING.count} reviews</span></span>
        </h2>
        <p className="pv-rev-stars" aria-label={`Rated ${GOOGLE_RATING.score} out of 5`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <svg className="pv-rev-star" viewBox="0 0 24 24" key={i} aria-hidden="true"><path d={STAR} /></svg>
          ))}
        </p>
      </div>

      <ul className="pv-rev-list">
        {shown.map((r) => (
          <li className="pv-rev" key={r.name}>
            <span className="pv-rev-rule" aria-hidden="true" />
            <blockquote className="pv-rev-text">
              <p>
                {r.text.split(" ").map((w, i) => (
                  <span className="pv-rev-w" key={i}>{w} </span>
                ))}
              </p>
            </blockquote>
            <p className="pv-rev-who">{r.name}, on Google</p>
          </li>
        ))}
      </ul>

      <p className="pv-rev-more">
        <a href={GOOGLE_PROFILE_URL} className="pv-textlink" target="_blank" rel="noopener noreferrer" data-cursor>
          Read all {GOOGLE_RATING.count} reviews on Google
        </a>
      </p>
    </section>
  );
}
