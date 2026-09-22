"use client";

import { useRef } from "react";
import { useSceneOnly } from "./useSceneOnly";

/**
 * The homepage idea at a smaller scale. The wireframe is traced over the real
 * ANYPRINT homepage, so the photograph lands exactly on the drawing, and then a
 * tablet and a phone showing two other builds arrive either side of it.
 */
function Wire() {
  return (
    <svg className="pv-svc-web-wire" viewBox="0 0 1582 1055" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <line pathLength={1} x1="0" y1="34" x2="1582" y2="34" />
        <rect pathLength={1} x="40" y="58" width="156" height="34" rx="3" />
        {[[240, 318], [352, 437], [471, 546], [580, 647], [683, 765]].map(([a, b]) => (
          <line pathLength={1} key={a} x1={a} y1="75" x2={b} y2="75" strokeWidth="9" />
        ))}
        <rect pathLength={1} x="1114" y="53" width="244" height="44" rx="22" />
        <rect pathLength={1} x="1403" y="55" width="139" height="40" rx="4" />
        <line pathLength={1} x1="0" y1="115" x2="1582" y2="115" />
        <line pathLength={1} x1="40" y1="193" x2="370" y2="193" strokeWidth="7" />
        <rect pathLength={1} x="40" y="238" width="456" height="70" rx="3" />
        <rect pathLength={1} x="40" y="326" width="320" height="70" rx="3" />
        <rect pathLength={1} x="40" y="414" width="510" height="70" rx="3" />
        <rect pathLength={1} x="40" y="502" width="462" height="70" rx="3" />
        <line pathLength={1} x1="40" y1="618" x2="708" y2="618" strokeWidth="9" />
        <line pathLength={1} x1="40" y1="649" x2="694" y2="649" strokeWidth="9" />
        <line pathLength={1} x1="40" y1="679" x2="341" y2="679" strokeWidth="9" />
        <rect pathLength={1} x="40" y="726" width="182" height="48" rx="4" />
        <rect pathLength={1} x="236" y="726" width="211" height="48" rx="4" />
        <line pathLength={1} x1="40" y1="810" x2="782" y2="810" />
        {[40, 310, 519].map((x) => (
          <g key={x}>
            <rect pathLength={1} x={x} y="840" width="58" height="28" rx="2" />
            <line pathLength={1} x1={x} y1="881" x2={x + 200} y2="881" strokeWidth="7" />
          </g>
        ))}
        <rect pathLength={1} x="831" y="115" width="751" height="849" />
        <line pathLength={1} x1="831" y1="115" x2="1582" y2="964" strokeWidth="1.2" />
        <line pathLength={1} x1="1582" y1="115" x2="831" y2="964" strokeWidth="1.2" />
        <line pathLength={1} x1="0" y1="964" x2="1582" y2="964" />
      </g>
      <g className="pv-svc-web-notes">
        <path d="M566 449 H640" />
        <text x="652" y="457">One clear headline</text>
        <path d="M462 750 H536" />
        <text x="548" y="758">Quote button up top</text>
      </g>
    </svg>
  );
}

export function WebsitesVisual({ still = false }: { still?: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useSceneOnly(root, ({ gsap, inHero, timeline }) => {
    const q = gsap.utils.selector(root.current!);
    const lines = q(".pv-svc-web-wire > g:first-child *");
    gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(q(".pv-svc-web-scan"), { autoAlpha: 0, top: "0%" });

    // In the hero the devices wait until the photo has landed, so the intro can rest there.
    const d = inHero ? 0.55 : 0;
    const tl = timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: root.current, start: "top 92%", end: "top 12%", scrub: 0.5 },
    }, 3.5);
    tl.to(lines, { strokeDashoffset: 0, duration: 1.2, stagger: 0.03, ease: "power1.inOut" }, 0)
      .fromTo(q(".pv-svc-web-notes"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 1.3)
      .fromTo(q(".pv-svc-web-shot"), { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5 }, 1.9)
      .to(q(".pv-svc-web-scan"), { autoAlpha: 1, duration: 0.1 }, 1.9)
      .to(q(".pv-svc-web-scan"), { top: "100%", duration: 1.5 }, 1.9)
      .to(q(".pv-svc-web-scan"), { autoAlpha: 0, duration: 0.1 }, 3.4)
      .fromTo(q(".pv-svc-web-tablet"), { autoAlpha: 0, xPercent: -30, yPercent: 18, rotation: -7 },
        { autoAlpha: 1, xPercent: 0, yPercent: 0, rotation: 0, duration: 1.1, ease: "power3.out" }, 3 + d)
      .fromTo(q(".pv-svc-web-phone"), { autoAlpha: 0, xPercent: 40, yPercent: 24, rotation: 8 },
        { autoAlpha: 1, xPercent: 0, yPercent: 0, rotation: 0, duration: 1.1, ease: "power3.out" }, 3.3 + d);
  }, still);

  return (
    <div className="pv-svc-web" ref={root}>
      <div className="pv-svc-web-devices">
        <div className="pv-svc-web-browser">
          <span className="pv-svc-web-chrome" aria-hidden="true"><i /><i /><i /></span>
          <div className="pv-svc-web-frame">
            <Wire />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="pv-svc-web-shot" src="/preview/svc-web-browser.jpg" alt="The ANYPRINT homepage, a WordPress site built by Webgro" width={1582} height={1055} loading={still ? "lazy" : undefined} decoding="async" />
            <span className="pv-svc-web-scan" aria-hidden="true" />
          </div>
        </div>
        <div className="pv-svc-web-tablet">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/preview/svc-web-tablet.jpg" alt="The Origin Architectural Shopify store on a tablet" width={420} height={604} loading="lazy" decoding="async" />
        </div>
        <div className="pv-svc-web-phone">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/preview/svc-web-phone.jpg?v=2" alt="A Gieves &amp; Hawkes product page on a phone" width={300} height={649} loading="lazy" decoding="async" />
        </div>
      </div>
    </div>
  );
}
