"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";
import type { Category } from "@/content/work";
import { BrushStroke } from "../Brush";
import { pv } from "../links";
import { SCENE_QUERY, STATIC_QUERY, useGsap } from "../useGsap";
import { NARROW_QUERY, composeNarrow, composeWide, filterPhrase, workFocus, type FilterKey, type ViewKey, type WorkItem } from "./data";
import "./work.css";
import { NewTag } from "../NewTag";

type Engine = { filter: (f: FilterKey) => void; view: (v: ViewKey) => void };

const matches = (cats: readonly string[], f: FilterKey) => f === "all" || cats.includes(f);

/** In the details view every card is the same width, so one `sizes` value covers them all. */
const CARD_SIZES = "(max-width: 899px) 92vw, 46vw";

export function WorkIndex({ items, labels }: { items: WorkItem[]; labels: Record<Category, string> }) {
  const root = useRef<HTMLDivElement>(null);
  const engine = useRef<Engine | null>(null);
  const live = useRef<{ filter: FilterKey; view: ViewKey }>({ filter: "all", view: "index" });

  // `filter` and `view` are what the bar shows as pressed. `laid` and `laidView`
  // are what the page is laid out for: the motion engine moves them a beat
  // later, once the tiles that are leaving have gone.
  const [filter, setFilter] = useState<FilterKey>("all");
  const [laid, setLaid] = useState<FilterKey>("all");
  const [shown, setShown] = useState<FilterKey>("all");
  const [view, setView] = useState<ViewKey>("index");
  const [laidView, setLaidView] = useState<ViewKey>("index");
  const apply = useRef({
    filter: (f: FilterKey) => flushSync(() => setLaid(f)),
    view: (v: ViewKey) => flushSync(() => setLaidView(v)),
  });

  const filters = useMemo(() => {
    const count = (k: Category) => items.filter((it) => it.categories.includes(k)).length;
    const keys = Object.keys(labels) as Category[];
    return [
      { key: "all" as FilterKey, label: "All", count: items.length },
      ...keys.map((k) => ({ key: k as FilterKey, label: labels[k], count: count(k) })),
    ];
  }, [items, labels]);
  const countOf = (k: FilterKey) => filters.find((f) => f.key === k)?.count ?? 0;

  // The wall is composed for however many projects the filter leaves, once
  // for wide screens and once for phones. Each tile carries both placements
  // and the stylesheet picks one, so nothing is measured in the browser.
  const placed = useMemo(() => {
    const on = items.filter((it) => matches(it.categories, laid));
    const wide = composeWide(on.length);
    const narrow = composeNarrow(on.length);
    return new Map(on.map((it, k) => [it.slug, { k, wide: wide[k], narrow: narrow[k] }]));
  }, [items, laid]);

  const chooseFilter = (f: FilterKey) => {
    if (f === filter) return;
    live.current.filter = f;
    setFilter(f);
    if (engine.current) engine.current.filter(f);
    else {
      setLaid(f);
      setShown(f);
    }
  };

  const chooseView = (v: ViewKey) => {
    if (v === view) return;
    live.current.view = v;
    setView(v);
    if (engine.current) engine.current.view(v);
    else setLaidView(v);
  };

  // The blue thumb behind the pressed button in each half of the bar.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const place = () => {
      el.querySelectorAll<HTMLElement>(".pv-work-seg").forEach((seg) => {
        const on = seg.querySelector<HTMLElement>('[aria-pressed="true"]');
        if (!on) return;
        seg.style.setProperty("--x", `${on.offsetLeft}px`);
        seg.style.setProperty("--w", `${on.offsetWidth}px`);
      });
      el.querySelector(".pv-work-bar")?.classList.add("is-ready");
    };
    place();
    document.fonts?.ready.then(place).catch(() => {});
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [filter, view]);

  useGsap(root, ({ gsap, ScrollTrigger }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    gsap.fromTo(q(".pv-work-hero-brush"), { clipPath: "inset(0% 100% 0% 0%)" }, {
      clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, delay: 0.95, ease: "power3.out",
    });

    mm.add({ motion: SCENE_QUERY, reduced: STATIC_QUERY, narrow: NARROW_QUERY }, (ctx) => {
      const reduced = !!ctx.conditions?.reduced;
      const narrow = !!ctx.conditions?.narrow;
      const section = q(".pv-work-index")[0] as HTMLElement;
      const titleIn = q(".pv-work-count-in")[0] as HTMLElement;

      const rows = (q(".pv-work-item") as HTMLElement[]).map((item) => ({
        item,
        cats: (item.dataset.cats ?? "").split(" "),
        text: item.querySelector(".pv-work-text") as HTMLElement,
        name: item.querySelector(".pv-work-name") as HTMLElement,
        nameIn: item.querySelector(".pv-work-name-in") as HTMLElement,
        rule: item.querySelector(".pv-work-rule") as HTMLElement,
        sides: Array.from(item.querySelectorAll<HTMLElement>(".pv-work-side")),
        media: item.querySelector(".pv-work-media") as HTMLElement,
        img: item.querySelector("img") as HTMLImageElement,
        out: false,
      }));
      type Row = (typeof rows)[number];

      let mode: ViewKey = live.current.view;
      let busy: gsap.core.Timeline | null = null;
      let vh = window.innerHeight;
      // React owns which tiles are in the layout. Read it back after every change.
      const sync = () => {
        vh = window.innerHeight;
        for (const r of rows) r.out = r.item.classList.contains("is-out");
      };
      const near = (rc: DOMRect) => rc.bottom > -vh * 0.6 && rc.top < vh * 1.6;

      // ── A photo travelling from one box to another (FLIP) ────────────────
      // The frame is moved and stretched with a transform, and the photo
      // inside it is scaled back the other way, so the picture keeps its
      // proportions and only its crop changes on the way.
      const fly = (tl: gsap.core.Timeline, r: Row, from: DOMRect, to: DOMRect, at: number, duration: number) => {
        if (!to.width || !to.height || !from.width || !from.height) return;
        const p = { x: from.left - to.left, y: from.top - to.top, sx: from.width / to.width, sy: from.height / to.height };
        const put = () => {
          const k = Math.max(p.sx, p.sy);
          r.media.style.transform = `translate3d(${p.x.toFixed(2)}px,${p.y.toFixed(2)}px,0) scale(${p.sx.toFixed(4)},${p.sy.toFixed(4)})`;
          r.img.style.transform = `scale(${(k / p.sx).toFixed(4)},${(k / p.sy).toFixed(4)})`;
        };
        r.media.style.transformOrigin = "0 0";
        put();
        tl.to(p, { x: 0, y: 0, sx: 1, sy: 1, duration, ease: "power3.inOut", onUpdate: put }, at);
      };

      const hidden = (): gsap.TweenVars => ({ clipPath: "inset(100% 0% 0% 0%)" });
      const open = (): gsap.TweenVars => ({ clipPath: "inset(0% 0% 0% 0%)" });

      // ── Reveals: tiles below the fold arrive once, as they are reached ───
      let reveals: ScrollTrigger[] = [];
      const bits = (r: Row) => [r.item, r.text, r.name, r.nameIn, r.rule, r.media, r.img, ...r.sides];
      const resetRow = (r: Row) => {
        gsap.killTweensOf(bits(r));
        // Named properties only: the tiles and photos carry inline custom
        // properties from React (their place on the wall, the photo's focus)
        // that clearing "all" would wipe.
        gsap.set(bits(r), { clearProps: "transform,opacity,visibility,clipPath" });
        r.media.style.transform = "";
        r.media.style.transformOrigin = "";
        r.img.style.transform = "";
      };
      const disarm = () => {
        reveals.forEach((st) => st.kill());
        reveals = [];
      };
      const arm = () => {
        disarm();
        if (reduced) return;
        const vw = window.innerWidth;
        for (const r of rows) {
          if (r.out) continue;
          const box = r.item.getBoundingClientRect();
          if (box.top < vh) continue;
          const wall = mode === "index";
          // Tiles in the same row of the wall open left to right.
          const delay = wall ? (box.left / vw) * 0.3 : 0;
          gsap.set(r.media, hidden());
          gsap.set(r.img, { scale: 1.14 });
          if (wall) gsap.set(r.text, { autoAlpha: 0 });
          else {
            gsap.set(r.nameIn, { yPercent: 105 });
            gsap.set(r.sides, { autoAlpha: 0, y: 14 });
          }
          reveals.push(ScrollTrigger.create({
            trigger: r.item,
            // Phones start a touch later so the reveal isn't spent behind the docked bar.
            start: narrow ? "top 86%" : "top 94%",
            once: true,
            onEnter: () => {
              gsap.to(r.media, { ...open(), duration: 1, ease: "power3.inOut", delay });
              gsap.to(r.img, { scale: 1, duration: 1.4, ease: "power3.out", delay });
              if (wall) gsap.to(r.text, { autoAlpha: 1, duration: 0.6, ease: "none", delay: delay + 0.5 });
              else {
                gsap.to(r.nameIn, { yPercent: 0, duration: 1, ease: "power3.out", delay: 0.08 });
                gsap.to(r.sides, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.25, stagger: 0.06 });
              }
            },
          }));
        }
      };

      const finish = () => {
        let guard = 0;
        while (busy && guard++ < 4) {
          const b = busy;
          b.progress(1);
          if (busy === b) busy = null;
        }
      };

      const settle = () => {
        busy = null;
        rows.forEach(resetRow);
        sync();
        ScrollTrigger.refresh();
        arm();
      };

      const swapTitle = (f: FilterKey) => {
        if (reduced) { setShown(f); return; }
        gsap.to(titleIn, {
          yPercent: -105, duration: 0.4, ease: "power3.in", overwrite: true,
          onComplete: () => {
            setShown(f);
            gsap.fromTo(titleIn, { yPercent: 105 }, { yPercent: 0, duration: 0.9, delay: 0.04, ease: "power3.out" });
          },
        });
      };

      // ── Filter: leavers go, and the rest glide into a newly composed wall ─
      const runFilter = (f: FilterKey) => {
        finish();
        swapTitle(f);
        sync();

        const wall = mode === "index";
        const leaving = rows.filter((r) => !r.out && !matches(r.cats, f));
        const entering = rows.filter((r) => r.out && matches(r.cats, f));
        const staying = rows.filter((r) => !r.out && matches(r.cats, f));
        const boxOf = (r: Row) => (wall ? r.media : r.item).getBoundingClientRect();

        const swap = () => {
          const first = staying.map(boxOf);
          leaving.forEach(resetRow);
          apply.current.filter(f);
          sync();
          return first;
        };

        if (reduced) {
          swap();
          settle();
          return;
        }

        disarm();
        rows.forEach(resetRow);

        const close = () => {
          const first = swap();
          const tl = gsap.timeline({ onComplete: settle });
          busy = tl;
          staying.forEach((r, k) => {
            const last = boxOf(r);
            const f0 = first[k];
            const still = Math.abs(f0.left - last.left) < 0.5 && Math.abs(f0.top - last.top) < 0.5
              && Math.abs(f0.width - last.width) < 0.5 && Math.abs(f0.height - last.height) < 0.5;
            if (still || !(near(f0) || near(last))) return;
            const at = Math.min(k, 8) * 0.025;
            if (wall) {
              // The photo travels. Its caption steps out for the journey and
              // comes back once the tile has its new shape.
              fly(tl, r, f0, last, at, 0.95);
              tl.fromTo(r.text, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: "none" }, at + 0.7);
            } else {
              tl.fromTo(r.item, { x: f0.left - last.left, y: f0.top - last.top }, { x: 0, y: 0, duration: 0.95, ease: "power3.inOut" }, at);
            }
          });
          if (entering.length) {
            tl.fromTo(entering.map((r) => r.media), hidden(), { ...open(), duration: 0.95, ease: "power3.inOut", stagger: 0.04 }, 0.3)
              .fromTo(entering.map((r) => r.img), { scale: 1.14 }, { scale: 1, duration: 1.2, ease: "power3.out", stagger: 0.04 }, 0.3);
            if (wall) {
              tl.fromTo(entering.map((r) => r.text), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "none", stagger: 0.04 }, 0.85);
            } else {
              tl.fromTo(entering.map((r) => r.nameIn), { yPercent: 105 }, { yPercent: 0, duration: 0.95, ease: "power3.out", stagger: 0.05 }, 0.3)
                .fromTo(entering.flatMap((r) => r.sides), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7, stagger: 0.015 }, 0.55);
            }
          }
          if (!tl.getChildren().length) settle();
        };

        if (!leaving.length) {
          close();
          return;
        }
        const out = gsap.timeline({ onComplete: close });
        busy = out;
        out.to(leaving.map((r) => r.media), { clipPath: "inset(0% 0% 100% 0%)", duration: 0.5, ease: "power3.inOut", stagger: 0.025 }, 0);
        if (wall) out.to(leaving.map((r) => r.text), { autoAlpha: 0, duration: 0.2, ease: "none" }, 0);
        else {
          out.to(leaving.map((r) => r.nameIn), { yPercent: -105, duration: 0.5, ease: "power3.in", stagger: 0.035 }, 0)
            .to(leaving.flatMap((r) => r.sides), { autoAlpha: 0, duration: 0.3 }, 0);
        }
      };

      // ── View switch: every photo travels between its tile and its card ───
      const runView = (v: ViewKey) => {
        if (v === mode) return;
        finish();
        disarm();
        rows.forEach(resetRow);
        sync();

        const vis = rows.filter((r) => !r.out);
        const inList = section.getBoundingClientRect().top < vh * 0.5;
        const anchor = vis.find((r) => r.item.getBoundingClientRect().bottom > vh * 0.3);
        const first = vis.map((r) => r.media.getBoundingClientRect());

        mode = v;
        apply.current.view(v);

        // Keep the project the visitor was looking at in roughly the same place.
        if (inList && anchor) {
          window.scrollTo(0, Math.max(0, window.scrollY + anchor.item.getBoundingClientRect().top - vh * 0.16));
        }

        if (reduced) {
          settle();
          return;
        }

        const tl = gsap.timeline({ onComplete: settle });
        busy = tl;
        vis.forEach((r, k) => {
          const to = r.media.getBoundingClientRect();
          if (!(near(first[k]) || near(to))) return;
          const at = Math.min(k, 10) * 0.022;
          fly(tl, r, first[k], to, at, 1.1);
          tl.fromTo(r.text, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.55, ease: "none" }, at + 0.75);
        });
        if (!tl.getChildren().length) settle();
      };

      sync();
      arm();
      engine.current = { filter: runFilter, view: runView };
      // The tiles' own arrival is a CSS animation, so it runs without scripts.
      // Once it has played it is switched off, or a tile brought back by a
      // filter would play it again.
      const done = gsap.delayedCall(2.4, () => el.classList.add("is-settled"));

      return () => {
        engine.current = null;
        done.kill();
        busy?.kill();
        busy = null;
        disarm();
        gsap.killTweensOf(titleIn);
        gsap.set(titleIn, { clearProps: "all" });
        rows.forEach(resetRow);
      };
    });

    return () => mm.revert();
  });

  const phrase = filterPhrase(shown);
  const livePhrase = filterPhrase(filter);

  return (
    <div className="pv-work" ref={root}>
      <section className="pv-work-hero" data-pv-theme="ink">
        <div className="pv-work-hero-copy">
          <p className="pv-work-kicker">Shopify, WordPress and AI projects, 2012 to now</p>
          <h1 className="pv-h1 pv-work-title">
            <span className="pv-line">
              <span>
                Our{" "}
                <span className="pv-brushed">
                  work
                  <BrushStroke className="pv-work-hero-brush" />
                </span>
              </span>
            </span>
            <span className="pv-line"><span><span className="pv-work-count-in">{phrase}</span></span></span>
          </h1>
        </div>
        <p className="pv-lede pv-work-intro">
          We designed and built every project on this page, and we still look after many of them. Where a
          result has been measured, the figure is shown next to the project.
        </p>
      </section>

      <section className={`pv-work-index is-${laidView}`} data-pv-theme="ink" aria-label="Case studies">
        <div className={`pv-work-list is-${laidView}`}>
          {items.map((it) => {
            const at = placed.get(it.slug);
            const k = at?.k ?? 0;
            const wide = at?.wide;
            const small = at?.narrow;
            const style = {
              "--a": wide ? `${wide.r} / ${wide.c} / span ${wide.rs} / span ${wide.cs}` : undefined,
              "--am": small ? `${small.r} / ${small.c} / span ${small.rs} / span ${small.cs}` : undefined,
              "--k": Math.min(k, 9),
            } as CSSProperties;
            // A tile only asks for a file as wide as it is drawn.
            // A project the filter has hidden asks for nothing bigger than it already has.
            const sizes = laidView === "grid"
              ? CARD_SIZES
              : `(max-width: 699px) ${small?.cs === 2 ? 92 : 46}vw, ${Math.round(((wide?.cs ?? 3) / 12) * 92)}vw`;
            return (
              <article
                className={`pv-work-item${at ? "" : " is-out"}`}
                key={it.slug}
                data-cats={it.categories.join(" ")}
                data-col={k % 2}
                style={style}
              >
                <Link href={pv(`/work/${it.slug}`)} className="pv-work-link" data-cursor>
                  <div className="pv-work-media">
                    <span className="pv-work-ph">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={it.imgSm}
                        srcSet={it.imgLg !== it.imgSm ? `${it.imgSm.replace("-sm.jpg", "-xs.jpg")} 480w, ${it.imgSm} 800w, ${it.imgLg} ${it.w}w` : undefined}
                        sizes={sizes}
                        alt={`${it.client} project by Webgro`}
                        width={it.w}
                        height={it.h}
                        loading={k < 4 ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={k === 0 ? "high" : k < 4 ? "auto" : "low"}
                        style={{ "--pos": workFocus[it.slug] } as CSSProperties}
                      />
                    </span>
                  </div>
                  <div className="pv-work-text">
                    <span className="pv-work-rule" aria-hidden="true" />
                    <h2 className="pv-work-name">
                      <span className="pv-work-name-mask"><span className="pv-work-name-in">{it.client}</span></span>
                      <span className="pv-work-new"><NewTag slug={it.slug} /></span>
                    </h2>
                    {it.figure ? (
                      <p className="pv-work-figure pv-work-side">
                        <strong>{it.figure.value}</strong>
                        <span>{it.figure.label}</span>
                      </p>
                    ) : null}
                    <p className="pv-work-meta pv-work-side">
                      <span>{it.tag}</span>
                      <span>{it.year}</span>
                    </p>
                    <p className="pv-work-blurb pv-work-side">{it.blurb}</p>
                    <span className="pv-work-go pv-work-side" aria-hidden="true">
                      <span>Read the case study</span>
                      <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {countOf(filter) === 0 ? (
          <p className="pv-lede pv-work-empty">No projects in this category yet.</p>
        ) : null}
      </section>

      <div className="pv-work-bar">
        <div className="pv-work-seg" role="group" aria-label="Filter projects">
          <span className="pv-work-thumb" aria-hidden="true" />
          {filters.map((f) => {
            const [head, ...rest] = f.label.split(" & ");
            return (
              <button key={f.key} type="button" aria-pressed={filter === f.key} onClick={() => chooseFilter(f.key)} data-cursor>
                <span>
                  {head}
                  {rest.length ? <span className="pv-work-long"> &amp; {rest.join(" & ")}</span> : null}
                </span>
              </button>
            );
          })}
        </div>
        <div className="pv-work-seg" role="group" aria-label="Layout">
          <span className="pv-work-thumb" aria-hidden="true" />
          {(["index", "grid"] as ViewKey[]).map((v) => (
            <button key={v} type="button" aria-pressed={view === v} onClick={() => chooseView(v)} data-cursor>
              <span>{v === "index" ? "Wall" : "Details"}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="pv-work-sr" aria-live="polite">Showing {filter === "all" ? "all projects" : livePhrase}.</p>
    </div>
  );
}
