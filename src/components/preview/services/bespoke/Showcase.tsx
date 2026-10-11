"use client";

import Link from "next/link";
import { useRef } from "react";
import { pv } from "../../links";
import { SCENE_QUERY, useGsap } from "../../useGsap";
import { Screen } from "./Screen";
import { connections, shopifyApps, software, wordpressPlugins, type Software as SoftwareItem } from "./software";
import { getAnyPvService, type PvService } from "../content";

/**
 * The software itself: four blocks in one format. Each has who it was built
 * for, a short account, a few points, one redrawn screen and, where there is
 * one, a link to the case study.
 */
function Software({ heading, lede, list }: { heading: string; lede: string; list: SoftwareItem[] }) {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      const head = q(".pv-bsp-head")[0];
      gsap.from(head.children, {
        y: 36, duration: 1, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: head, start: "top 88%", once: true },
      });
      q(".pv-bsp-item").forEach((item) => {
        const text = item.querySelector(".pv-bsp-item-text");
        if (text) {
          gsap.from(text.children, {
            y: 30, duration: 0.9, ease: "power3.out", stagger: 0.07,
            scrollTrigger: { trigger: text, start: "top 86%", once: true },
          });
        }
        const shot = item.querySelector(".pv-bsp-item-screen");
        gsap.fromTo(item.querySelector(".pv-bsp-tilt"), { rotationX: 14, scale: 0.95 }, {
          rotationX: 0, scale: 1, ease: "none",
          scrollTrigger: { trigger: shot, start: "top 96%", end: "top 40%", scrub: 0.5 },
        });
      });
    });
    return () => mm.revert();
  });

  return (
    <section className="pv-bsp" id="software" ref={root} data-pv-theme="paper">
      <div className="pv-bsp-head">
        <h2 className="pv-h2">{heading}</h2>
        <p className="pv-lede">{lede}</p>
      </div>

      {list.map((s, i) => (
        <article className={`pv-bsp-item${i % 2 ? " is-flip" : ""}`} id={s.id} key={s.id}>
          <div className="pv-bsp-item-text">
            <p className="pv-label">{s.label}</p>
            <h3 className="pv-h3">{s.title}</h3>
            {s.body.map((p) => <p className="pv-bsp-item-body" key={p}>{p}</p>)}
            <ul className="pv-bsp-points">
              {s.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
            {s.link && (
              <p><Link href={pv(s.link.path)} className="pv-textlink pv-bsp-hit" data-cursor>{s.link.label}</Link></p>
            )}
          </div>
          <div className="pv-bsp-item-screen">
            <div className="pv-bsp-persp">
              <div className="pv-bsp-tilt">
                <Screen name={s.mock} decorative />
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

/**
 * Systems the software can connect to, as plain names grouped by kind. One
 * list and one style for every name.
 */
function Connects() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      const head = q(".pv-bsp-con-head")[0];
      gsap.from(head.children, {
        y: 36, duration: 1, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: head, start: "top 88%", once: true },
      });
      // Movement only, so a row whose trigger never fires is still readable.
      q(".pv-bsp-con-row").forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 94%", once: true } });
        tl.from(row.querySelector(".pv-bsp-con-rule"), { scaleX: 0, duration: 1.1, ease: "power3.inOut" })
          .from(row.querySelector("h3"), { y: 22, duration: 0.8, ease: "power3.out" }, 0.05)
          .from(row.querySelectorAll(".pv-bsp-chip"), { y: 22, scale: 0.9, duration: 0.6, ease: "back.out(1.6)", stagger: 0.05 }, 0.12);
      });
      const foot = q(".pv-bsp-con-foot")[0];
      gsap.from(foot, { y: 26, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: foot, start: "top 94%", once: true } });
    });
    return () => mm.revert();
  });

  return (
    <section className="pv-bsp-con" id="connects" ref={root} data-pv-theme="ink">
      <div className="pv-bsp-con-head">
        <h2 className="pv-h2">What it can connect to</h2>
        <p className="pv-lede">
          We connect bespoke software to the systems a business already uses. These are some of the ones we can
          connect to.
        </p>
      </div>
      <div className="pv-bsp-con-list">
        {connections.map((c) => (
          <div className="pv-bsp-con-row" key={c.group}>
            <span className="pv-bsp-con-rule" />
            <h3>{c.group}</h3>
            <ul>
              {c.items.map((item) => <li className="pv-bsp-chip" key={item}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <p className="pv-bsp-con-foot">
        If a system has an API, or can export a file, we can usually connect to it. We check that during scoping,
        before we quote.
      </p>
    </section>
  );
}

/** Two rows linking to the Shopify apps and WordPress plugins pages. */
function More() {
  const root = useRef<HTMLElement>(null);
  const pages = ["shopify-apps", "wordpress-plugins"].map(getAnyPvService).filter((p): p is PvService => Boolean(p));

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      const head = q(".pv-bsp-more-head")[0];
      gsap.from(head.children, {
        y: 36, duration: 1, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: head, start: "top 88%", once: true },
      });
      q(".pv-bsp-more-row").forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 94%", once: true } });
        tl.from(row.querySelector(".pv-bsp-more-rule"), { scaleX: 0, duration: 1.1, ease: "power3.inOut" })
          .from(row.querySelector(".pv-bsp-more-in"), { y: 24, duration: 0.8, ease: "power3.out" }, 0.08);
      });
    });
    return () => mm.revert();
  });

  return (
    <section className="pv-bsp-more" ref={root} data-pv-theme="paper">
      <div className="pv-bsp-more-head">
        <h2 className="pv-h3">Shopify apps and WordPress plugins</h2>
        <p className="pv-lede">When the software belongs inside Shopify or WordPress, we build it as an app or a plugin.</p>
      </div>
      <div className="pv-bsp-more-list">
        {pages.map((p) => (
          <Link href={pv(p.path)} className="pv-bsp-more-row" key={p.slug} data-cursor>
            <span className="pv-bsp-more-rule" />
            <span className="pv-bsp-more-in">
              <span className="pv-bsp-more-name">{p.name}</span>
              <span className="pv-bsp-more-text">{p.say}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function Showcase({ kind }: { kind: NonNullable<PvService["showcase"]> }) {
  if (kind === "shopify-apps") {
    return (
      <Software
        heading="Shopify apps we’ve built"
        lede="A loyalty app, a sync between two shops and an AI try-on that is in beta."
        list={shopifyApps}
      />
    );
  }
  if (kind === "wordpress-plugins") {
    return (
      <Software
        heading="WordPress plugins we’ve built"
        lede="A product catalogue with a configurator, and identity checks run from a form."
        list={wordpressPlugins}
      />
    );
  }
  return (
    <>
      <Software
        heading="Software we’ve built"
        lede="Software that runs an online shop and its workshop, a helpdesk assistant, a quote desk and our own client portal."
        list={software}
      />
      <More />
      <Connects />
    </>
  );
}
