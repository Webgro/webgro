"use client";

import Link from "next/link";
import { useRef } from "react";
import { pv } from "../links";
import { SCENE_QUERY, useGsap } from "../useGsap";
import { BrushBand } from "./BrushBand";
import { pvServices, pvSubServices, type PvService } from "./content";

/** How each sheet lies in the pile: degrees of turn, and a nudge as a fraction of its size. */
const PILE = [
  { r: -6, x: -0.02, y: 0.015 },
  { r: 4, x: 0.03, y: -0.01 },
  { r: -2.5, x: -0.012, y: -0.02 },
  { r: 5.5, x: 0.02, y: 0.018 },
  { r: -4, x: -0.03, y: 0 },
  { r: 2.5, x: 0.012, y: -0.012 },
];
/** A degree or so of turn once they are laid out, so the grid looks placed by hand. */
const SETTLE = [-1.2, 0.8, -0.6, 1, -0.9, 0.5];
/** Timeline units per sheet, and the point within them at which the sheet is shuffled away. */
const STEP = 1.25;
const OUT_AT = 0.95;

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Sheet({ s, i, total }: { s: PvService; i: number; total: number }) {
  const subs = s.slug === "marketing" ? pvSubServices : [];
  return (
    <article className="pv-svc-sheet">
      <div className="pv-svc-sheet-inner">
        <Link href={pv(s.path)} className="pv-svc-sheet-hit" aria-label={`${s.name}: see the service`} data-cursor />
        <div className="pv-svc-sheet-detail">
          <p className="pv-svc-sheet-top">
            <span>Webgro services</span>
            <span>{i + 1} of {total}</span>
          </p>
          <h3 className="pv-svc-sheet-name">{s.name}</h3>
          <p className="pv-svc-sheet-short">{s.short}</p>
          <dl className="pv-svc-sheet-facts">
            {s.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
          {subs.length > 0 ? (
            <p className="pv-svc-sheet-subs">
              <span>Includes</span>
              {subs.map((sub) => (
                <Link key={sub.slug} href={pv(sub.path)} data-cursor>{sub.name}</Link>
              ))}
            </p>
          ) : (
            <p className="pv-svc-sheet-recent">
              <span>Recent work</span>
              {s.recent}
            </p>
          )}
          <p className="pv-svc-sheet-open">
            See the service <Arrow />
          </p>
        </div>
        <div className="pv-svc-sheet-index" aria-hidden="true">
          <p className="pv-svc-sheet-index-name">{s.name}</p>
          {subs.length > 0 && <p className="pv-svc-sheet-index-subs">{subs.map((sub) => sub.name).join(", ")}</p>}
          <Arrow />
        </div>
      </div>
    </article>
  );
}

export function Desk() {
  const root = useRef<HTMLElement>(null);
  const total = pvServices.length;

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);

    gsap.from(q(".pv-svc-desk-head > *"), {
      yPercent: 40, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: el, start: "top 75%" },
    });

    const mm = gsap.matchMedia();
    mm.add(
      { wide: `${SCENE_QUERY} and (min-width: 900px)`, narrow: `${SCENE_QUERY} and (max-width: 899px)` },
      (ctx) => {
        const narrow = Boolean(ctx.conditions?.narrow);
        el.classList.add("is-scene");

        const stage = q(".pv-svc-desk-stage")[0] as HTMLElement;
        const sheets = q(".pv-svc-sheet") as HTMLElement[];
        const says = q(".pv-svc-say") as HTMLElement[];
        const mark = q(".pv-svc-say-mark")[0] as HTMLElement;
        const final = q(".pv-svc-desk-final")[0] as HTMLElement;
        const n = sheets.length;

        let geo = {
          w: 1, h: 1, out: 0, fs: 0.6, s: 0.5,
          fan: sheets.map(() => ({ x: 0, y: 0 })),
          slots: sheets.map(() => ({ x: 0, y: 0 })),
          marks: says.map(() => 0),
        };

        const measure = () => {
          const vw = window.innerWidth;
          const vh = stage.offsetHeight;
          const pad = Math.min(72, Math.max(20, vw * 0.042));
          const w = sheets[0].offsetWidth;
          const h = sheets[0].offsetHeight;
          const cx = sheets[0].offsetLeft;
          const cy = sheets[0].offsetTop;

          const cols = narrow ? 2 : 3;
          const rows = Math.ceil(n / cols);
          const gap = narrow ? 10 : Math.max(14, vw * 0.012);
          const rl = narrow ? pad : vw * 0.4;
          const rr = vw - pad;
          const rt = narrow ? final.offsetTop + final.offsetHeight + 18 : vh * 0.14;
          const rb = vh * (narrow ? 0.975 : 0.94);
          const s = Math.min(
            (rr - rl - (cols - 1) * gap) / (cols * w),
            (rb - rt - (rows - 1) * gap) / (rows * h),
          );
          const gw = cols * w * s + (cols - 1) * gap;
          const gh = rows * h * s + (rows - 1) * gap;
          const gl = rl + (rr - rl - gw) / 2;
          const gt = rt + (rb - rt - gh) / 2;

          const fs = narrow ? 0.5 : 0.6;
          const fanLeft = (narrow ? pad : vw * 0.36) + (w * fs) / 2;
          const fanRight = vw - pad - (w * fs) / 2;
          const mid = (n - 1) / 2;

          geo = {
            w, h, s, fs,
            out: vw - cx + w * 0.62,
            fan: sheets.map((_, i) => ({
              x: fanLeft + ((fanRight - fanLeft) * i) / (n - 1) - cx,
              y: (i - mid) * (i - mid) * h * 0.012 + (narrow ? -h * 0.04 : 0),
            })),
            slots: sheets.map((_, i) => ({
              x: gl + (w * s) / 2 + (i % cols) * (w * s + gap) - cx,
              y: gt + (h * s) / 2 + Math.floor(i / cols) * (h * s + gap) - cy,
            })),
            marks: says.map((say) => say.offsetTop),
          };
        };

        const place = () => {
          sheets.forEach((sheet, i) => {
            const p = PILE[i % PILE.length];
            gsap.set(sheet, {
              xPercent: -50, yPercent: -50, zIndex: (n - i) * 10,
              x: p.x * geo.w, y: p.y * geo.h, rotation: p.r, scale: 0.9,
            });
          });
          if (!narrow) gsap.set(mark, { y: geo.marks[0] });
        };

        measure();
        place();
        gsap.set(q(".pv-svc-sheet-index"), { autoAlpha: 0 });
        gsap.set(final, { autoAlpha: 0, y: 24 });
        if (narrow) gsap.set(says, { autoAlpha: 0, y: 24 });
        else {
          gsap.set(says, { opacity: 0.32 });
          gsap.set(mark, { autoAlpha: 0 });
        }

        // The pile is carried onto the desk as the stage scrolls into view.
        gsap.fromTo(q(".pv-svc-desk-sheets"), { yPercent: 22, rotation: 5 }, {
          yPercent: 0, rotation: 0, ease: "none",
          scrollTrigger: { trigger: stage, start: "top bottom", end: "top top", scrub: 0.5 },
        });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=640%",
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefreshInit: () => {
              measure();
              place();
            },
          },
        });

        sheets.forEach((sheet, i) => {
          const t = i * STEP;
          const p = PILE[i % PILE.length];
          // Straighten the top sheet and bring it up to reading size.
          tl.to(sheet, { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.4, ease: "power3.out" }, t);
          if (narrow) {
            tl.to(says[i], { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, t + 0.05)
              .to(says[i], { autoAlpha: 0, y: -24, duration: 0.25, ease: "power2.in" }, t + OUT_AT);
          } else {
            tl.to(says[i], { opacity: 1, duration: 0.25 }, t)
              .to(mark, { autoAlpha: 1, y: () => geo.marks[i], duration: 0.35 }, t)
              .to(says[i], { opacity: 0.32, duration: 0.25 }, t + OUT_AT + 0.05);
          }
          // Shuffle it out to the side, then back in underneath the pile.
          tl.to(sheet, { x: () => geo.out, rotation: 9, scale: 0.92, duration: 0.3, ease: "power2.in" }, t + OUT_AT)
            .set(sheet, { zIndex: -10 * (i + 1) }, t + STEP)
            .to(sheet, {
              x: () => p.x * geo.w, y: () => p.y * geo.h, rotation: p.r, scale: 0.9,
              duration: 0.35, ease: "power2.out",
            }, t + STEP);
        });

        // Fan the pile out, turn every sheet over to its cover, and lay them in a grid.
        const T = n * STEP + 0.4;
        const mid = (n - 1) / 2;
        tl.to(q(".pv-svc-says"), { autoAlpha: 0, duration: 0.3 }, T);
        sheets.forEach((sheet, i) => {
          tl.to(sheet, {
            x: () => geo.fan[i].x, y: () => geo.fan[i].y, rotation: (i - mid) * 7, scale: () => geo.fs,
            duration: 0.7,
          }, T + i * 0.03);
        });
        tl.to(q(".pv-svc-sheet-detail"), { autoAlpha: 0, duration: 0.3 }, T + 0.35)
          .to(q(".pv-svc-sheet-index"), { autoAlpha: 1, duration: 0.3 }, T + 0.5);
        sheets.forEach((sheet, i) => {
          tl.to(sheet, {
            x: () => geo.slots[i].x, y: () => geo.slots[i].y, rotation: SETTLE[i % SETTLE.length], scale: () => geo.s,
            duration: 0.8, ease: "power3.inOut",
          }, T + 0.85 + i * 0.05);
        });
        tl.to(final, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, T + 1.3)
          .to({}, { duration: 0.7 });

        return () => el.classList.remove("is-scene");
      },
    );

    return () => mm.revert();
  });

  return (
    <section className="pv-svc-desk" ref={root} data-pv-theme="ink">
      <div className="pv-svc-desk-head">
        <h2 className="pv-h2">What we offer</h2>
        <p className="pv-lede">
          Each service, with who it&rsquo;s for, what it covers, roughly what it costs and how long it
          usually takes.
        </p>
      </div>

      <div className="pv-svc-desk-stage">
        <div className="pv-svc-says">
          <p className="pv-label pv-svc-says-label">What each service covers</p>
          <span className="pv-svc-say-mark" aria-hidden="true"><BrushBand seed={3} /></span>
          {pvServices.map((s) => (
            <Link href={pv(s.path)} className="pv-svc-say" key={s.slug} data-cursor>
              <span className="pv-svc-say-q">{s.say}</span>
              <span className="pv-svc-say-a">
                {s.name}
                {s.slug === "marketing" && <em> (email, PPC and social media)</em>}
                <Arrow />
              </span>
            </Link>
          ))}
        </div>

        <div className="pv-svc-desk-sheets">
          {pvServices.map((s, i) => (
            <Sheet s={s} i={i} total={total} key={s.slug} />
          ))}
        </div>

        <div className="pv-svc-desk-final">
          <h3 className="pv-h3">Using more than one service</h3>
          <p>Most clients use two or three of these services together.</p>
          <div className="pv-svc-desk-final-more">
            <p>
              If you&rsquo;re not sure which service you need, get in touch and we&rsquo;ll talk it
              through before you commit to anything.
            </p>
            <Link href={pv("/contact")} className="pv-btn pv-btn--light" data-cursor><span>Get in touch</span></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
