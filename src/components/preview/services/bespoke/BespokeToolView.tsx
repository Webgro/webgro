"use client";

import Link from "next/link";
import { useRef } from "react";
import { Closing } from "../../Closing";
import { pv } from "../../links";
import { PreviewShell } from "../../PreviewShell";
import { SCENE_QUERY, useGsap } from "../../useGsap";
import { BrushBand, BrushBandDefs } from "../BrushBand";
import { BrushedTitle } from "../sections";
import { Screen } from "./Screen";
import { BESPOKE_PATH, BESPOKE_PRICE, bespokeTools, type BespokeTool } from "./tools";
import "../services.css";
import "./bespoke.css";

function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={back ? "M19 12H5M11 6l-6 6 6 6" : "M5 12h14M13 6l6 6-6 6"} />
    </svg>
  );
}

function Hero({ tool }: { tool: BespokeTool }) {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    gsap.fromTo(q(".pv-svc-hero-brush"), { clipPath: "inset(0% 100% 0% 0%)" }, {
      clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, delay: 0.9, ease: "power3.out",
    });
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      gsap.fromTo(q(".pv-bsp-tilt"), { rotationX: 12, scale: 0.96 }, {
        rotationX: 0, scale: 1, ease: "none",
        scrollTrigger: { trigger: q(".pv-bsp-thero-screen")[0], start: "top 100%", end: "top 35%", scrub: 0.5 },
      });
    });
    return () => mm.revert();
  });

  return (
    <section className="pv-svc-hero pv-bsp-thero" ref={root} data-pv-theme="paper">
      <div className="pv-svc-hero-copy">
        <p className="pv-svc-crumbs">
          <Link href={pv("/services")} data-cursor>All services</Link>
          <span aria-hidden="true">/</span>
          <Link href={pv(BESPOKE_PATH)} data-cursor>Bespoke Software</Link>
          <span aria-hidden="true">/</span>
          <span>{tool.name}</span>
        </p>
        <h1 className="pv-h1 pv-svc-h1">
          <BrushedTitle lines={tool.title} brush={tool.brush} brushClass="pv-svc-hero-brush" />
        </h1>
        <div className="pv-svc-hero-row">
          <div className="pv-bsp-thero-intro">
            <p className="pv-svc-hero-intro">{tool.intro}</p>
            <p className="pv-bsp-note">
              It&rsquo;s one of the ten tools Fun Cases run their business on. The picture below is an example
              screen, redrawn with sample data.
            </p>
          </div>
          <div className="pv-svc-hero-actions">
            <Link href={pv("/contact")} className="pv-btn" data-cursor><span>Get in touch</span></Link>
            <a href="#how" className="pv-textlink pv-bsp-hit" data-cursor>How it works</a>
          </div>
        </div>
      </div>
      <div className="pv-bsp-thero-screen">
        <div className="pv-bsp-persp">
          <div className="pv-bsp-tilt">
            <Screen name={tool.mock} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Does({ tool }: { tool: BespokeTool }) {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      const head = q(".pv-bsp-does-head")[0];
      gsap.from(head.children, {
        y: 36, duration: 1, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: head, start: "top 88%", once: true },
      });
      q(".pv-bsp-does-body > p, .pv-bsp-fact").forEach((p) => {
        gsap.from(p, { y: 28, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: p, start: "top 92%", once: true } });
      });
      q(".pv-bsp-fact-rule").forEach((rule) => {
        gsap.from(rule, { scaleX: 0, duration: 1.1, ease: "power3.inOut", scrollTrigger: { trigger: rule, start: "top 94%", once: true } });
      });
    });
    return () => mm.revert();
  });

  return (
    <section className="pv-bsp-does" ref={root} data-pv-theme="paper">
      <div className="pv-bsp-does-head">
        <h2 className="pv-h2">What it does</h2>
      </div>
      <div className="pv-bsp-does-body">
        {tool.does.map((p) => <p key={p}>{p}</p>)}
        <div className="pv-bsp-facts">
          <div className="pv-bsp-fact">
            <span className="pv-bsp-fact-rule" />
            <h3 className="pv-label">Who uses it</h3>
            <p>{tool.users}</p>
          </div>
          {tool.replaced && (
            <div className="pv-bsp-fact">
              <span className="pv-bsp-fact-rule" />
              <h3 className="pv-label">What it replaced</h3>
              <p>{tool.replaced}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * The steps, with a brushed line that draws down the side as the list scrolls
 * through and each step lighting up as it reaches the reading line.
 */
function Steps({ tool }: { tool: BespokeTool }) {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      const head = q(".pv-bsp-steps-head")[0];
      gsap.from(head.children, {
        y: 36, duration: 1, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: head, start: "top 88%", once: true },
      });
      const list = q(".pv-bsp-steps")[0];
      gsap.fromTo(q(".pv-bsp-steps-line"), { clipPath: "inset(0% -50% 100% -50%)" }, {
        clipPath: "inset(0% -50% 0% -50%)", ease: "none",
        scrollTrigger: { trigger: list, start: "top 70%", end: "bottom 55%", scrub: 0.5 },
      });
      q(".pv-bsp-step").forEach((step) => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: step, start: "top 82%", end: "top 56%", scrub: 0.4 },
        });
        tl.fromTo(step.querySelector(".pv-bsp-step-text"), { opacity: 0.35, x: 14 }, { opacity: 1, x: 0, duration: 1 }, 0)
          .fromTo(step.querySelector(".pv-bsp-step-node i"), { scale: 0 }, { scale: 1, duration: 0.6, ease: "back.out(2.4)" }, 0.3);
      });
    });
    return () => mm.revert();
  });

  return (
    <section className="pv-bsp-how" id="how" ref={root} data-pv-theme="ink">
      <div className="pv-bsp-steps-head">
        <h2 className="pv-h2">How it works</h2>
        <p className="pv-lede">{tool.steps.length} steps, in the order they happen.</p>
      </div>
      <div className="pv-bsp-steps-wrap">
        <BrushBand className="pv-bsp-steps-line" vertical seed={4} />
        <ol className="pv-bsp-steps">
          {tool.steps.map((s, i) => (
            <li className="pv-bsp-step" key={s.name}>
              <span className="pv-bsp-step-node" aria-hidden="true"><i /></span>
              <div className="pv-bsp-step-text">
                <p className="pv-bsp-step-count">Step {i + 1}</p>
                <h3>{s.name}</h3>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Connects({ tool }: { tool: BespokeTool }) {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      const head = q(".pv-bsp-links-head")[0];
      gsap.from(head.children, {
        y: 36, duration: 1, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: head, start: "top 88%", once: true },
      });
      q(".pv-bsp-link").forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 92%", once: true } });
        tl.from(row.querySelector(".pv-bsp-link-rule"), { scaleX: 0, duration: 1.1, ease: "power3.inOut" })
          .from(row.querySelectorAll("h3, p"), { y: 22, duration: 0.8, ease: "power3.out", stagger: 0.06 }, 0.08);
      });
      q(".pv-bsp-also").forEach((box) => {
        gsap.from(box.children, {
          y: 26, duration: 0.9, ease: "power3.out", stagger: 0.07,
          scrollTrigger: { trigger: box, start: "top 90%", once: true },
        });
      });
    });
    return () => mm.revert();
  });

  return (
    <section className="pv-bsp-links" ref={root} data-pv-theme="paper">
      <div className="pv-bsp-links-head">
        <h2 className="pv-h2">What it connects to</h2>
      </div>
      <div className="pv-bsp-links-body">
        <div className="pv-bsp-links-list">
          {tool.connects.map((c) => (
            <div className="pv-bsp-link" key={c.name}>
              <span className="pv-bsp-link-rule" />
              <h3>{c.name}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
        {tool.also && (
          <div className="pv-bsp-also">
            <h3 className="pv-h3">{tool.also.heading}</h3>
            <ul className="pv-bsp-points">
              {tool.also.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function Next({ tool }: { tool: BespokeTool }) {
  const root = useRef<HTMLElement>(null);
  const at = bespokeTools.findIndex((t) => t.slug === tool.slug);
  const prev = bespokeTools[(at - 1 + bespokeTools.length) % bespokeTools.length];
  const next = bespokeTools[(at + 1) % bespokeTools.length];

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      const main = q(".pv-bsp-next-main")[0];
      gsap.from(main.children, {
        y: 32, duration: 0.9, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: main, start: "top 88%", once: true },
      });
      q(".pv-bsp-step-link").forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 94%", once: true } });
        tl.from(row.querySelector(".pv-bsp-step-link-rule"), { scaleX: 0, duration: 1.1, ease: "power3.inOut" })
          .from(row.querySelector(".pv-bsp-step-link-in"), { y: 22, duration: 0.8, ease: "power3.out" }, 0.08);
      });
    });
    return () => mm.revert();
  });

  return (
    <section className="pv-bsp-next" ref={root} data-pv-theme="ink">
      <div className="pv-bsp-next-main">
        <p className="pv-label">Bespoke Software</p>
        <h2 className="pv-h2">Software like this for your business</h2>
        <p className="pv-lede">{BESPOKE_PRICE}</p>
        <div className="pv-bsp-next-actions">
          <Link href={pv("/contact")} className="pv-btn pv-btn--light" data-cursor><span>Get in touch</span></Link>
          <Link href={pv(BESPOKE_PATH)} className="pv-textlink pv-bsp-hit" data-cursor>See the Bespoke Software service</Link>
        </div>
      </div>

      <nav className="pv-bsp-next-nav" aria-label="More Fun Cases tools">
        <p className="pv-label">More Fun Cases tools</p>
        <Link href={pv(`${BESPOKE_PATH}/${prev.slug}`)} className="pv-bsp-step-link" data-cursor>
          <span className="pv-bsp-step-link-rule" />
          <span className="pv-bsp-step-link-in">
            <Arrow back />
            <span>
              <small>Previous tool</small>
              <strong>{prev.name}</strong>
            </span>
          </span>
        </Link>
        <Link href={pv(`${BESPOKE_PATH}/${next.slug}`)} className="pv-bsp-step-link is-next" data-cursor>
          <span className="pv-bsp-step-link-rule" />
          <span className="pv-bsp-step-link-in">
            <span>
              <small>Next tool</small>
              <strong>{next.name}</strong>
            </span>
            <Arrow />
          </span>
        </Link>
        <Link href={pv(`${BESPOKE_PATH}#fun-cases`)} className="pv-textlink pv-bsp-hit pv-bsp-next-all" data-cursor>
          All ten tools
        </Link>
      </nav>
    </section>
  );
}

/** One page per Fun Cases tool: what it does, how it works, what it connects to, and its screen. */
export function BespokeToolView({ slug }: { slug: string }) {
  const tool = bespokeTools.find((t) => t.slug === slug);
  if (!tool) return null;

  return (
    <PreviewShell initialTheme="paper">
      <BrushBandDefs />
      <Hero tool={tool} />
      <Does tool={tool} />
      <Steps tool={tool} />
      <Connects tool={tool} />
      <Next tool={tool} />
      <Closing />
    </PreviewShell>
  );
}
