"use client";

import { useRef } from "react";
import { Closing } from "../Closing";
import { PreviewShell } from "../PreviewShell";
import { useGsap } from "../useGsap";
import { BrushBandDefs } from "./BrushBand";
import { Desk } from "./Desk";
import { Reasons } from "./Reasons";
import { ServiceDeck } from "./ServiceDeck";
import { BrushedTitle } from "./sections";
import "./services.css";

function IndexHero() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    gsap.fromTo(q(".pv-svc-hero-brush"), { clipPath: "inset(0% 100% 0% 0%)" }, {
      clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, delay: 0.9, ease: "power3.out",
    });
  });

  return (
    <section className="pv-svc-hero pv-svc-hero--index" ref={root} data-pv-theme="paper">
      <div className="pv-svc-hero-copy">
        <p className="pv-svc-crumbs"><span>Services</span></p>
        <h1 className="pv-h1 pv-svc-h1">
          <BrushedTitle
            lines={["Services"]}
            brush="Services"
            brushClass="pv-svc-hero-brush"
          />
        </h1>
        <div className="pv-svc-hero-row">
          <p className="pv-svc-hero-intro">
            Webgro is a small studio in Bracknell offering six services: websites, consultancy, automation and
            AI, SEO, marketing and design. Clients can take one on its own or combine several.
          </p>
        </div>
      </div>
      <ServiceDeck />
    </section>
  );
}

export function ServicesIndexView() {
  return (
    <PreviewShell initialTheme="paper">
      <BrushBandDefs />
      <IndexHero />
      <Desk />
      <Reasons />
      <Closing />
    </PreviewShell>
  );
}
