"use client";

import Link from "next/link";
import { useRef } from "react";
import { getCaseBySlug } from "@/content/work";
import { Closing } from "../Closing";
import { pv } from "../links";
import { PreviewShell } from "../PreviewShell";
import { BrushedTitle } from "../services/sections";
import { SCENE_QUERY, useGsap } from "../useGsap";
import { workExtras, workImage } from "../work/data";
import { industries } from "./content";
import "../services/services.css";
import "./industries.css";

/** The list of industry pages. Each row names the clients behind it. */
export function IndustriesIndexView() {
  const root = useRef<HTMLDivElement>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    gsap.fromTo(q(".pv-ind-hero-brush"), { clipPath: "inset(0% 100% 0% 0%)" }, {
      clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, delay: 0.9, ease: "power3.out",
    });
    q(".pv-ind-row").forEach((row) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 88%" } });
      tl.from(row.querySelector(".pv-ind-row-rule"), { scaleX: 0, duration: 1.1, ease: "power3.inOut" })
        .from(row.querySelectorAll(".pv-ind-row-text > *"), { y: 24, autoAlpha: 0, duration: 0.85, ease: "power3.out", stagger: 0.07 }, 0.1);
    });
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      q(".pv-ind-row-media").forEach((m) => {
        gsap.fromTo(m, { clipPath: "inset(0% 0% 100% 0% round 14px)" }, {
          clipPath: "inset(0% 0% 0% 0% round 14px)", duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: m, start: "top 88%" },
        });
      });
    });
    return () => mm.revert();
  });

  return (
    <PreviewShell initialTheme="paper">
      <div ref={root}>
        <section className="pv-ind-hero pv-ind-hero--index" data-pv-theme="paper">
          <div className="pv-ind-hero-copy">
            <p className="pv-ind-crumbs">
              <Link href={pv("/")} data-cursor>Home</Link>
              <span aria-hidden="true">/</span>
              <span>Industries</span>
            </p>
            <h1 className="pv-h1 pv-ind-h1">
              <BrushedTitle lines={["Industries", "we work in"]} brush="Industries" brushClass="pv-ind-hero-brush" />
            </h1>
            <p className="pv-ind-hero-intro">
              Each page covers the websites we&rsquo;ve built in that industry, the projects and their results,
              and the services and prices that apply. The charities page also has an application form for a
              free charity website.
            </p>
          </div>
        </section>

        <section className="pv-ind-index" data-pv-theme="paper" aria-label="Industries">
          {industries.map((ind) => {
            const lead = ind.cases[0].slug;
            const extra = workExtras[lead];
            const clients = ind.cases.map((c) => getCaseBySlug(c.slug)?.client).filter(Boolean).join(", ");
            return (
              <Link href={pv(`/industries/${ind.slug}`)} className="pv-ind-row" key={ind.slug} data-cursor>
                <span className="pv-ind-row-rule" aria-hidden="true" />
                <span className="pv-ind-row-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={workImage(lead, "sm")}
                    alt=""
                    width={extra?.w ?? 800}
                    height={extra?.h ?? 533}
                    loading="lazy"
                  />
                </span>
                <span className="pv-ind-row-text">
                  <span className="pv-ind-row-name">{ind.name}</span>
                  <span className="pv-ind-row-short">{ind.short}</span>
                  <span className="pv-ind-row-clients">{clients}</span>
                </span>
              </Link>
            );
          })}
        </section>
      </div>
      <Closing />
    </PreviewShell>
  );
}
