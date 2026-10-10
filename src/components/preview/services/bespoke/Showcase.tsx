"use client";

import Link from "next/link";
import { useRef } from "react";
import { pv } from "../../links";
import { SCENE_QUERY, useGsap } from "../../useGsap";
import { Screen } from "./Screen";
import { connections, possibleConnections, software } from "./software";

/**
 * The software itself: four blocks in one format. Each has who it was built
 * for, a short account, a few points, one redrawn screen and, where there is
 * one, a link to the case study.
 */
function Software() {
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
        <h2 className="pv-h2">Software we&rsquo;ve built</h2>
        <p className="pv-lede">
          Software that runs an online shop and its workshop, a helpdesk assistant, a quote desk and our own client
          portal.
        </p>
      </div>

      {software.map((s, i) => (
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
 * Two lists of plain names grouped by kind: the systems we have connected
 * software to, and widely used systems we could connect to but have not yet.
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
      q(".pv-bsp-con-head--more, .pv-bsp-con-foot").forEach((el) => {
        gsap.from(el.children.length ? el.children : el, {
          y: 30, duration: 0.9, ease: "power3.out", stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
    });
    return () => mm.revert();
  });

  const rows = (list: typeof connections) =>
    list.map((c) => (
      <div className="pv-bsp-con-row" key={c.group}>
        <span className="pv-bsp-con-rule" />
        <h3>{c.group}</h3>
        <ul>
          {c.items.map((item) => <li className="pv-bsp-chip" key={item}>{item}</li>)}
        </ul>
      </div>
    ));

  return (
    <section className="pv-bsp-con" id="connects" ref={root} data-pv-theme="ink">
      <div className="pv-bsp-con-head">
        <h2 className="pv-h2">Systems we&rsquo;ve connected</h2>
        <p className="pv-lede">Every system in this first list is one we&rsquo;ve already connected software to.</p>
      </div>
      <div className="pv-bsp-con-list">{rows(connections)}</div>

      <div className="pv-bsp-con-head pv-bsp-con-head--more">
        <h2 className="pv-h2">Systems we can connect to</h2>
        <p className="pv-lede">
          We haven&rsquo;t built these integrations yet. Each one has a public API or a documented import and
          export that we can work with.
        </p>
      </div>
      <div className="pv-bsp-con-list pv-bsp-con-list--more">{rows(possibleConnections)}</div>

      <p className="pv-bsp-con-foot">
        If a system has an API, or can export a file, we can usually connect to it. We check that during scoping,
        before we quote.
      </p>
    </section>
  );
}

export function Showcase() {
  return (
    <>
      <Software />
      <Connects />
    </>
  );
}
