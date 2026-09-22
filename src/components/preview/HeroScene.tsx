"use client";

import Link from "next/link";
import { useRef } from "react";
import { BrushStroke } from "./Brush";
import { sceneCaptions, sceneFinalCaption, wallTiles } from "./content";
import { pv } from "./links";
import { SCENE_QUERY, STATIC_QUERY, useGsap } from "./useGsap";

/**
 * The wireframe is traced over the real Gieves & Hawkes collection page, so
 * when the photograph wipes in, every block lands exactly where it was drawn.
 */
function Wireframe() {
  const products = [62, 558, 1054];
  return (
    <svg className="pv-wire" viewBox="0 0 1600 1055" aria-hidden="true">
      <g className="pv-wire-lines" fill="none" stroke="currentColor" strokeWidth="2">
        <rect pathLength={1} x="62" y="18" width="254" height="58" rx="3" />
        {[348, 469, 608, 687, 765].map((x, i) => (
          <line pathLength={1} key={x} x1={x} y1="44" x2={x + [94, 112, 52, 51, 56][i]} y2="44" strokeWidth="9" />
        ))}
        {[1128, 1212, 1292, 1388, 1462].map((x) => (
          <line pathLength={1} key={x} x1={x} y1="45" x2={x + 62} y2="45" strokeWidth="9" />
        ))}
        <line pathLength={1} x1="0" y1="93" x2="1600" y2="93" />
        <rect pathLength={1} x="512" y="166" width="578" height="52" rx="3" />
        <line pathLength={1} x1="412" y1="251" x2="1188" y2="251" strokeWidth="9" />
        <line pathLength={1} x1="406" y1="280" x2="1194" y2="280" strokeWidth="9" />
        <line pathLength={1} x1="518" y1="310" x2="1082" y2="310" strokeWidth="9" />
        <line pathLength={1} x1="62" y1="361" x2="1538" y2="361" />
        {[62, 148, 253, 396, 476, 566, 699, 841, 992].map((x, i) => (
          <line pathLength={1} key={x} x1={x} y1="393" x2={x + [44, 64, 102, 38, 48, 92, 102, 108, 104][i]} y2="393" strokeWidth="9" />
        ))}
        <line pathLength={1} x1="62" y1="427" x2="1538" y2="427" />
        {products.map((x) => (
          <g key={x}>
            <rect pathLength={1} x={x} y="455" width="484" height="640" />
            <line pathLength={1} x1={x} y1="455" x2={x + 484} y2="1095" strokeWidth="1.2" />
            <line pathLength={1} x1={x + 484} y1="455" x2={x} y2="1095" strokeWidth="1.2" />
          </g>
        ))}
      </g>
      <g className="pv-wire-notes">
        <path d="M1104 192 H1176" />
        <text x="1188" y="200">Title in the brand serif</text>
        <path d="M1108 393 H1176" />
        <text x="1188" y="401">Filters stay in view</text>
        <text x="800" y="500" textAnchor="middle">Three columns here, two on a phone</text>
      </g>
    </svg>
  );
}

function TileChrome() {
  return (
    <span className="pv-tile-chrome" aria-hidden="true">
      <i /><i /><i />
    </span>
  );
}

export function HeroScene({ dark = false }: { dark?: boolean }) {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap, ScrollTrigger }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add(SCENE_QUERY, () => {
      const stage = q(".pv-hero-stage")[0] as HTMLElement;
      const wall = q(".pv-wall")[0] as HTMLElement;
      const main = q(".pv-tile--main")[0] as HTMLElement;
      const others = q(".pv-tile:not(.pv-tile--main)");
      const copy = q(".pv-hero-copy")[0] as HTMLElement;
      const captions = q(".pv-caption");

      let geo = { s0: 1, x0: 0, y0: 0, sf: 1, xf: 0, yf: 0 };
      const measure = () => {
        const vw = window.innerWidth;
        const vh = stage.offsetHeight;
        const narrow = vw < 900;
        const tw = main.offsetWidth;
        const th = main.offsetHeight;
        const ox = main.offsetLeft + tw / 2;
        const oy = main.offsetTop + th / 2;
        const cx = vw / 2 + (ox - wall.offsetWidth / 2);
        const cy = wall.offsetTop + (oy - wall.offsetHeight / 2);
        const startW = Math.min(vw * 0.92, 1500);
        const focusW = narrow ? vw * 0.92 : Math.min(vw * 0.58, (vh - 210) * (tw / th));
        const s0 = startW / tw;
        const sf = focusW / tw;
        geo = {
          s0, sf,
          x0: vw / 2 - cx,
          y0: Math.max(vh * 0.7, copy.offsetTop + copy.offsetHeight + 44) + (th * s0) / 2 - cy,
          xf: (narrow ? vw * 0.5 : vw * 0.665) - cx,
          yf: (narrow ? vh * 0.3 : vh * 0.53) - cy,
        };
        gsap.set(wall, { transformOrigin: `${ox}px ${oy}px` });
      };
      measure();

      gsap.set(wall, { xPercent: -50, yPercent: -50, x: () => geo.x0, y: () => geo.y0, scale: () => geo.s0 });
      gsap.set(others, { autoAlpha: 0, scale: 1.18 });
      gsap.set(q(".pv-wire-lines > *, .pv-wire-lines g > *"), { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(q(".pv-wire-notes"), { autoAlpha: 0 });
      gsap.set(q(".pv-main-shot"), { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(q(".pv-scan"), { autoAlpha: 0, top: "0%" });
      gsap.set(captions, { autoAlpha: 0, y: 28 });
      gsap.set(q(".pv-phone"), { autoAlpha: 0, yPercent: 60, rotate: 7 });
      gsap.set(q(".pv-phone-bag"), { xPercent: 101 });
      gsap.set(q(".pv-caption-final"), { autoAlpha: 0, y: 20 });
      gsap.set(q(".pv-tile--main .pv-tile-name"), { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        // No `pin`: pinning wraps the stage in a new element after load, and
        // moving it restarts the headline's CSS entrance (the load flash). The
        // section is tall and the stage is `position: sticky` instead (CSS).
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onRefreshInit: () => {
            measure();
            gsap.set(wall, { x: geo.x0, y: geo.y0, scale: geo.s0 });
          },
        },
      });

      tl.to(q(".pv-hero-copy"), { yPercent: -18, autoAlpha: 0, duration: 1.3, ease: "power2.in" }, 0)
        .to(wall, { x: () => geo.xf, y: () => geo.yf, scale: () => geo.sf, duration: 2 }, 0)
        .to(q(".pv-wire-lines > *, .pv-wire-lines g > *"), { strokeDashoffset: 0, duration: 1.4, stagger: 0.035, ease: "power1.inOut" }, 0.1)
        .to(q(".pv-wire-notes"), { autoAlpha: 1, duration: 0.5 }, 1.7)
        .to(captions[0], { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, 1.3)
        .to(captions[0], { autoAlpha: 0, y: -28, duration: 0.5, ease: "power2.in" }, 3)

        .to(q(".pv-scan"), { autoAlpha: 1, duration: 0.15 }, 3.2)
        .to(q(".pv-main-shot"), { clipPath: "inset(0% 0% 0% 0%)", duration: 1.9, ease: "none" }, 3.2)
        .to(q(".pv-scan"), { top: "100%", duration: 1.9, ease: "none" }, 3.2)
        .to(q(".pv-scan"), { autoAlpha: 0, duration: 0.15 }, 5.05)
        .to(captions[1], { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, 3.5)
        .to(captions[1], { autoAlpha: 0, y: -28, duration: 0.5, ease: "power2.in" }, 5.3)

        .to(q(".pv-phone"), { autoAlpha: 1, yPercent: 0, rotate: 0, duration: 1, ease: "power3.out" }, 5.5)
        .to(q(".pv-phone-bag"), { xPercent: 0, duration: 0.9, ease: "power3.inOut" }, 6.5)
        .to(captions[2], { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, 5.8)
        .to(captions[2], { autoAlpha: 0, y: -28, duration: 0.5, ease: "power2.in" }, 7.5)
        .to(q(".pv-phone"), { autoAlpha: 0, yPercent: 30, scale: 0.8, duration: 0.7, ease: "power2.in" }, 7.5)

        .to(wall, { x: 0, y: 0, scale: 1, duration: 2.3, ease: "power3.inOut" }, 7.9)
        .to(others, {
          autoAlpha: 1, scale: 1, duration: 1.5, ease: "power3.out",
          stagger: { each: 0.06, from: "center", grid: "auto" },
        }, 8.6)
        .to(q(".pv-tile--main .pv-tile-name"), { autoAlpha: 1, duration: 0.4 }, 10)
        .to(q(".pv-caption-final"), { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, 9.7)
        .to({}, { duration: 0.8 });

      // The scene layout is server-rendered, so nothing reflows when the script
      // arrives. The wall stays hidden until it has been placed, then eases in.
      el.classList.add("is-ready");
      gsap.fromTo(wall, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9, ease: "power2.out" });

      return () => el.classList.remove("is-ready");
    });

    mm.add(STATIC_QUERY, () => {
      el.classList.remove("is-scene");
      const shot = q(".pv-main-shot");
      gsap.fromTo(shot, { clipPath: "inset(0% 0% 100% 0%)" }, {
        clipPath: "inset(0% 0% 0% 0%)", ease: "none",
        scrollTrigger: { trigger: q(".pv-tile--main")[0], start: "top 70%", end: "top 15%", scrub: 0.4 },
      });
    });

    // Brushed underline beneath the headline, once the fonts have settled.
    gsap.fromTo(q(".pv-hero-brush"), { clipPath: "inset(0% 100% 0% 0%)" }, {
      clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, delay: 0.9, ease: "power3.out",
    });

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  });

  return (
    <section className={`pv-hero is-scene${dark ? " pv-hero--dark" : ""}`} ref={root} data-pv-theme={dark ? "ink" : "paper"}>
      <div className="pv-hero-stage">
        <div className="pv-hero-copy">
          <p className="pv-hero-kicker">A Shopify and WordPress studio in Bracknell, Berkshire.</p>
          <h1 className="pv-h1">
            <span className="pv-line"><span>Websites designed and built</span></span>
            <span className="pv-line"><span>by the people you</span></span>
            <span className="pv-line">
              <span>
                <span className="pv-brushed">
                  actually speak to.
                  <BrushStroke className="pv-hero-brush" />
                </span>
              </span>
            </span>
          </h1>
          <div className="pv-hero-row">
            <p className="pv-hero-intro">
              We design, build and look after Shopify and WordPress websites for businesses such as Gieves
              &amp; Hawkes, Twisted Tailor and Fun Cases. We&rsquo;re a small team, so you&rsquo;ll work
              directly with the people designing and building your site.
            </p>
            <div className="pv-hero-actions">
              <Link href={pv("/contact")} className="pv-btn" data-cursor>
                <span>Start a project</span>
              </Link>
              <Link href={pv("/work")} className="pv-textlink" data-cursor>
                View our work
              </Link>
            </div>
          </div>
        </div>

        <div className="pv-captions" aria-hidden="true">
          {sceneCaptions.map((c) => (
            <p className="pv-caption" key={c}>{c}</p>
          ))}
        </div>

        <div className="pv-wall">
          <div className="pv-tile pv-tile--main">
            <TileChrome />
            <Link href={pv("/work/gieves-and-hawkes")} className="pv-tile-frame" data-cursor>
              <Wireframe />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="pv-main-shot" src="/preview/main-gieves.jpg" alt="The Gieves & Hawkes suit collection page, built by Webgro on Shopify" width={1600} height={1055} />
              <span className="pv-scan" />
              <span className="pv-tile-name">Gieves &amp; Hawkes</span>
            </Link>
          </div>
          {wallTiles.map((t) => (
            <div className="pv-tile" key={t.slug}>
              <TileChrome />
              <Link href={pv(`/work/${t.slug}`)} className="pv-tile-frame" data-cursor>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.img} srcSet={`${t.img.replace(".jpg", "-480.jpg")} 480w, ${t.img} 960w`} sizes="(max-width: 899px) 32vw, 24vw" alt={`${t.client} website by Webgro`} width={960} height={633} loading="lazy" decoding="async" />
                <span className="pv-tile-name">{t.client}</span>
              </Link>
            </div>
          ))}
        </div>

        <div className="pv-phone" aria-hidden="true">
          <div className="pv-phone-screen">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/preview/main-gieves-mobile.jpg" alt="" width={460} height={997} loading="lazy" decoding="async" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="pv-phone-bag" src="/preview/main-gieves-mobile-2.jpg" alt="" width={460} height={997} loading="lazy" decoding="async" />
          </div>
        </div>

        <p className="pv-caption-final">{sceneFinalCaption}</p>
      </div>
    </section>
  );
}
