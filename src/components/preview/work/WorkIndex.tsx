"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { Category } from "@/content/work";
import { BrushStroke } from "../Brush";
import { createGlPlanes } from "../glPlanes";
import { pv } from "../links";
import { SCENE_QUERY, STATIC_QUERY, useGsap } from "../useGsap";
import { NARROW_QUERY, filterPhrase, type FilterKey, type ViewKey, type WorkItem } from "./data";
import "./work.css";

type Engine = { filter: (f: FilterKey) => void; view: (v: ViewKey) => void };

const matches = (cats: string, f: FilterKey) => f === "all" || cats.split(" ").includes(f);

/** Re-deal the hero deck so the cards that match the filter close ranks. */
function layoutDeck(rootEl: HTMLElement, f: FilterKey, hideOthers: boolean) {
  const deck = rootEl.querySelector<HTMLElement>(".pv-work-deck");
  if (!deck) return;
  const cards = Array.from(deck.querySelectorAll<HTMLElement>(".pv-work-card")).reverse();
  let k = 0;
  for (const card of cards) {
    const on = matches(card.dataset.cats ?? "", f);
    if (on) card.style.setProperty("--i", String(k++));
    card.classList.toggle("is-out", hideOthers && !on);
  }
  deck.style.setProperty("--n", String(Math.max(k, 1)));
}

/** Column parity drives the staggered second column in the grid view. */
function markColumns(rootEl: HTMLElement) {
  let k = 0;
  rootEl.querySelectorAll<HTMLElement>(".pv-work-item").forEach((item) => {
    if (!item.classList.contains("is-out")) item.dataset.col = String(k++ % 2);
  });
}

function markFilter(rootEl: HTMLElement, f: FilterKey) {
  rootEl.querySelectorAll<HTMLElement>(".pv-work-item").forEach((item) => {
    item.classList.toggle("is-out", !matches(item.dataset.cats ?? "", f));
  });
  markColumns(rootEl);
}

function markView(rootEl: HTMLElement, v: ViewKey) {
  rootEl.querySelectorAll<HTMLElement>(".pv-work-index, .pv-work-list").forEach((n) => {
    n.classList.toggle("is-index", v === "index");
    n.classList.toggle("is-grid", v === "grid");
  });
}

export function WorkIndex({ items, labels }: { items: WorkItem[]; labels: Record<Category, string> }) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const engine = useRef<Engine | null>(null);
  const live = useRef<{ filter: FilterKey; view: ViewKey }>({ filter: "all", view: "index" });

  const [filter, setFilter] = useState<FilterKey>("all");
  const [shown, setShown] = useState<FilterKey>("all");
  const [view, setView] = useState<ViewKey>("index");

  const filters = useMemo(() => {
    const count = (k: Category) => items.filter((it) => it.categories.includes(k)).length;
    const keys = Object.keys(labels) as Category[];
    return [
      { key: "all" as FilterKey, label: "All", count: items.length },
      ...keys.map((k) => ({ key: k as FilterKey, label: labels[k], count: count(k) })),
    ];
  }, [items, labels]);
  const countOf = (k: FilterKey) => filters.find((f) => f.key === k)?.count ?? 0;

  const chooseFilter = (f: FilterKey) => {
    if (f === filter) return;
    live.current.filter = f;
    setFilter(f);
    if (engine.current) engine.current.filter(f);
    else if (root.current) {
      markFilter(root.current, f);
      layoutDeck(root.current, f, true);
      setShown(f);
    }
  };

  const chooseView = (v: ViewKey) => {
    if (v === view) return;
    live.current.view = v;
    setView(v);
    if (engine.current) engine.current.view(v);
    else if (root.current) markView(root.current, v);
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

    // Phones (below 900px) get no travelling viewer: every row carries its own
    // plain <img>, and WebGL is kept for the hero deck only. Crossing 900px
    // reverts this block and runs it again for the new width.
    mm.add({ motion: SCENE_QUERY, reduced: STATIC_QUERY, narrow: NARROW_QUERY }, (ctx) => {
      const reduced = !!ctx.conditions?.reduced;
      const narrow = !!ctx.conditions?.narrow;
      const hero = q(".pv-work-hero")[0] as HTMLElement;
      const section = q(".pv-work-index")[0] as HTMLElement;
      const list = q(".pv-work-list")[0] as HTMLElement;
      const titleIn = q(".pv-work-count-in")[0] as HTMLElement;

      // Front card first, which is the reverse of DOM (and WebGL draw) order.
      const cards = (q(".pv-work-card") as HTMLElement[])
        .map((card) => ({ card, inner: card.querySelector(".pv-work-card-in") as HTMLElement }))
        .reverse();

      const rows = (q(".pv-work-item") as HTMLElement[]).map((item, i) => ({
        i,
        item,
        cats: item.dataset.cats ?? "",
        text: item.querySelector(".pv-work-text") as HTMLElement,
        name: item.querySelector(".pv-work-name") as HTMLElement,
        nameIn: item.querySelector(".pv-work-name-in") as HTMLElement,
        rule: item.querySelector(".pv-work-rule") as HTMLElement,
        sides: Array.from(item.querySelectorAll<HTMLElement>(".pv-work-side")),
        media: item.querySelector(".pv-work-media") as HTMLElement,
        img: item.querySelector("img") as HTMLImageElement,
        out: item.classList.contains("is-out"),
        top: 0,
        h: 0,
        s: 0, // how far this row's image is open in the travelling viewer, 0 to 1
        bottom: false, // which edge of the viewer it is anchored to while it opens or closes
        fx: null as null | { dx: number; dy: number; sx: number; sy: number },
      }));
      type Row = (typeof rows)[number];

      let mode: ViewKey = live.current.view;
      let busy: gsap.core.Timeline | null = null;
      let switching = false;
      let active = -1;
      let pending = -1;
      let pendingSince = 0;
      let focusIdx = -1;
      let vw = window.innerWidth;
      let vh = window.innerHeight;
      let W = 0;
      let H = 0;
      let glOn = false;
      const cur = { x: vw, y: vh * 0.3, set: false };
      const ptr = { x: 0, y: 0, live: false, bar: false };
      const hoverable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const pad = () => Math.max(20, Math.min(72, vw * 0.042));

      const measure = () => {
        vw = window.innerWidth;
        vh = window.innerHeight;
        for (const r of rows) {
          r.top = r.item.offsetTop;
          r.h = r.item.offsetHeight;
        }
        const sample = rows.find((r) => !r.out);
        if (!narrow && mode === "index" && sample) {
          W = sample.media.offsetWidth;
          H = sample.media.offsetHeight;
        }
      };

      // ── WebGL: deck cards and project images share one canvas ────────────
      let planes: ReturnType<typeof createGlPlanes> = null;
      let io: IntersectionObserver | undefined;
      if (!reduced && canvas.current) {
        el.classList.add("is-glon");
        const deckEls = cards.map((c) => c.inner).reverse();
        planes = createGlPlanes(canvas.current, narrow ? deckEls : [...deckEls, ...rows.map((r) => r.media)]);
        if (planes) {
          glOn = true;
          io = new IntersectionObserver(([e]) => planes?.setRunning(e.isIntersecting), { rootMargin: "20% 0px" });
          io.observe(el);
        } else {
          el.classList.remove("is-glon");
        }
      }

      // ── The travelling viewer (index view) ───────────────────────────────
      const setActive = (next: number) => {
        const prev = active;
        active = next;
        list.classList.toggle("has-active", next >= 0);
        const down = prev < 0 || next < 0 ? true : next > prev;
        for (const r of rows) {
          r.item.classList.toggle("is-active", r.i === next);
          if (r.i === next) {
            if (r.s < 0.02) r.bottom = down;
            gsap.to(r, { s: 1, duration: reduced ? 0 : 0.5, ease: "power2.inOut", overwrite: true });
          } else if (r.s > 0) {
            if (r.i === prev && r.s > 0.98) r.bottom = !down;
            gsap.to(r, { s: 0, duration: reduced ? 0 : 0.5, ease: "power2.inOut", overwrite: true });
          }
        }
      };

      const tick = () => {
        if (narrow || mode !== "index" || !W) return;
        const lr = list.getBoundingClientRect();
        const usePtr = hoverable && ptr.live && !ptr.bar
          && ptr.y >= lr.top && ptr.y <= lr.bottom && ptr.x >= lr.left && ptr.x <= lr.right;

        if (!switching) {
          let next = -1;
          if (focusIdx >= 0 && !rows[focusIdx].out) next = focusIdx;
          else {
            const ly = (usePtr ? ptr.y : vh * 0.5) - lr.top;
            for (const r of rows) {
              if (!r.out && ly >= r.top && ly < r.top + r.h) { next = r.i; break; }
            }
          }
          if (next !== pending) { pending = next; pendingSince = performance.now(); }
          const settle = focusIdx >= 0 || active < 0 ? 0 : 110;
          if (next !== active && performance.now() - pendingSince >= settle) setActive(next);
        }

        if (active >= 0) {
          const row = rows[active];
          const narrow = vw < 900;
          const tx = vw - W - pad();
          let ty = narrow
            ? vh - H - 132
            : (usePtr ? ptr.y : lr.top + row.top + row.h / 2) - H / 2;
          ty = Math.max(84, Math.min(vh - H - (narrow ? 132 : 96), ty));
          if (!cur.set) { cur.x = tx; cur.y = ty; cur.set = true; }
          const k = reduced ? 1 : 1 - Math.pow(1 - 0.1, gsap.ticker.deltaRatio());
          cur.x += (tx - cur.x) * k;
          cur.y += (ty - cur.y) * k;
        } else if (!switching && rows.every((r) => r.s === 0)) {
          cur.set = false; // closed: the next project opens in place rather than flying in
        }

        for (const r of rows) {
          if (r.out) continue;
          let x = cur.x;
          let y = cur.y;
          let sx = 1;
          let sy = r.s;
          if (r.fx) {
            x += r.fx.dx; y += r.fx.dy; sx = r.fx.sx; sy = r.fx.sy;
          } else if (r.bottom) {
            y += H * (1 - r.s);
          }
          r.media.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
          if (!glOn) {
            // Without WebGL the photo is counter-scaled so it wipes instead of squashing.
            r.img.style.transformOrigin = r.bottom ? "50% 100%" : "50% 0%";
            r.img.style.transform = !r.fx && sy > 0.001 && sy < 1 ? `scaleY(${(1 / sy).toFixed(4)})` : "";
          }
        }
      };

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") { ptr.live = false; return; }
        ptr.x = e.clientX;
        ptr.y = e.clientY;
        ptr.live = true;
        ptr.bar = e.target instanceof Element && !!e.target.closest(".pv-work-bar");
      };
      const onLeave = () => { ptr.live = false; };
      const onFocusIn = (e: FocusEvent) => {
        const item = e.target instanceof Element ? e.target.closest(".pv-work-item") : null;
        focusIdx = item ? rows.findIndex((r) => r.item === item) : -1;
      };
      const onFocusOut = () => { focusIdx = -1; };
      if (!narrow) {
        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("mouseleave", onLeave);
        list.addEventListener("focusin", onFocusIn);
        list.addEventListener("focusout", onFocusOut);
        gsap.ticker.add(tick);
      }
      ScrollTrigger.addEventListener("refresh", measure);

      // ── Row images that sit in the page (grid view, and every view on phones) ─
      // Desktop grid keeps its scaleY wipe (the WebGL plane follows the box).
      // Phones draw plain photos, so they wipe up through a clip-path mask
      // instead, which never squashes the picture.
      const inlineMedia = () => narrow || mode === "grid";
      const mediaHidden = (): gsap.TweenVars => (narrow
        ? { clipPath: "inset(100% 0% 0% 0%)" }
        : { scaleY: 0, transformOrigin: "50% 100%" });
      const mediaShown = (): gsap.TweenVars => (narrow ? { clipPath: "inset(0% 0% 0% 0%)" } : { scaleY: 1 });
      const mediaGone = (): gsap.TweenVars => (narrow
        ? { clipPath: "inset(0% 0% 100% 0%)" }
        : { scaleY: 0, transformOrigin: "50% 0%" });

      // ── Row reveals, re-armed after every change of layout ───────────────
      let reveals: ScrollTrigger[] = [];
      const rowBits = (r: Row) => [r.nameIn, r.rule, ...r.sides];
      const resetRow = (r: Row) => {
        gsap.killTweensOf([...rowBits(r), r.name, r.text, r.item]);
        gsap.set([...rowBits(r), r.name, r.text, r.item], { clearProps: "all" });
        if (inlineMedia()) {
          gsap.killTweensOf([r.media, r.img]);
          gsap.set(r.media, { clearProps: "all" });
          if (narrow) gsap.set(r.img, { clearProps: "all" });
        }
      };
      const disarm = () => {
        reveals.forEach((st) => st.kill());
        reveals = [];
      };
      const arm = () => {
        disarm();
        if (reduced) return;
        for (const r of rows) {
          if (r.out || r.item.getBoundingClientRect().top < vh) continue;
          gsap.set(r.nameIn, { yPercent: 105 });
          gsap.set(r.rule, { scaleX: 0 });
          gsap.set(r.sides, { autoAlpha: 0, y: 14 });
          if (inlineMedia()) gsap.set(r.media, mediaHidden());
          if (narrow) gsap.set(r.img, { scale: 1.14 });
          reveals.push(ScrollTrigger.create({
            trigger: r.item,
            // Phones start a touch later so the reveal isn't spent behind the docked bar.
            start: narrow ? "top 84%" : "top 92%",
            once: true,
            onEnter: () => {
              gsap.to(r.rule, { scaleX: 1, duration: 1.1, ease: "power3.inOut" });
              gsap.to(r.nameIn, { yPercent: 0, duration: 1, ease: "power3.out", delay: 0.08 });
              gsap.to(r.sides, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.25, stagger: 0.06 });
              if (inlineMedia()) gsap.to(r.media, { ...mediaShown(), duration: 1.1, ease: "power3.inOut" });
              if (narrow) gsap.to(r.img, { scale: 1, duration: 1.4, ease: "power3.out" });
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
        switching = false;
        rows.forEach((r) => { resetRow(r); r.fx = null; });
        measure();
        ScrollTrigger.refresh();
        arm();
      };

      // ── Hero: the deck and the headline count ────────────────────────────
      const dealDeck = (f: FilterKey, instant: boolean) => {
        layoutDeck(el, f, false);
        // Cards leave by the outer element's `translate`, so this can't be undone
        // by the scroll-scrubbed fan-out, which owns the inner element's transform
        // and resets it on every ScrollTrigger refresh.
        cards.forEach((c, k) => {
          const on = matches(c.card.dataset.cats ?? "", f);
          c.card.style.transitionDelay = instant ? "0s" : `${(k * 0.035 + (on ? 0.15 : 0)).toFixed(3)}s`;
          c.card.classList.toggle("is-off", !on);
        });
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

      // ── Filter: leavers slide out of their masks, the rest close ranks ───
      const runFilter = (f: FilterKey) => {
        finish();
        swapTitle(f);
        dealDeck(f, reduced);

        const leaving = rows.filter((r) => !r.out && !matches(r.cats, f));
        const entering = rows.filter((r) => r.out && matches(r.cats, f));
        const staying = rows.filter((r) => !r.out && matches(r.cats, f));
        // On phones the index row's text box is display: contents, so the whole row moves.
        const flipEl = (r: Row) => (mode === "index" && !narrow ? r.text : r.item);

        const swap = () => {
          const first = staying.map((r) => flipEl(r).getBoundingClientRect());
          leaving.forEach((r) => {
            gsap.killTweensOf(r);
            resetRow(r);
            r.out = true;
            r.s = 0;
            r.item.classList.add("is-out");
          });
          entering.forEach((r) => { r.out = false; r.item.classList.remove("is-out"); });
          markColumns(el);
          measure();
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
            const last = flipEl(r).getBoundingClientRect();
            const dx = first[k].left - last.left;
            const dy = first[k].top - last.top;
            if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
            tl.fromTo(flipEl(r), { x: dx, y: dy }, { x: 0, y: 0, duration: 0.95, ease: "power3.inOut" }, Math.min(k, 8) * 0.025);
          });
          if (entering.length) {
            tl.fromTo(entering.map((r) => r.rule), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "power3.inOut", stagger: 0.05 }, 0.2)
              .fromTo(entering.map((r) => r.nameIn), { yPercent: 105 }, { yPercent: 0, duration: 0.95, ease: "power3.out", stagger: 0.05 }, 0.3)
              .fromTo(entering.flatMap((r) => r.sides), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7, stagger: 0.015 }, 0.55);
            if (inlineMedia()) {
              tl.fromTo(entering.map((r) => r.media), mediaHidden(), {
                ...mediaShown(), duration: 1, ease: "power3.inOut", stagger: 0.05,
              }, 0.2);
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
        out.to(leaving.map((r) => r.nameIn), { yPercent: -105, duration: 0.5, ease: "power3.in", stagger: 0.035 }, 0)
          .to(leaving.flatMap((r) => r.sides), { autoAlpha: 0, duration: 0.3 }, 0)
          .to(leaving.map((r) => r.rule), { scaleX: 0, duration: 0.5, ease: "power3.inOut" }, 0);
        if (inlineMedia()) {
          out.to(leaving.map((r) => r.media), {
            ...mediaGone(), duration: 0.55, ease: "power3.inOut", stagger: 0.035,
          }, 0);
        }
      };

      // ── View toggle: names and images travel to their new places (FLIP) ──
      const runView = (v: ViewKey) => {
        if (v === mode) return;
        finish();
        disarm();
        rows.forEach(resetRow);

        const vis = rows.filter((r) => !r.out);
        const inList = section.getBoundingClientRect().top < vh * 0.5;
        const anchor = vis.find((r) => r.i === active) ?? vis.find((r) => r.item.getBoundingClientRect().bottom > vh * 0.3);
        const first = vis.map((r) => ({
          n: r.name.getBoundingClientRect(),
          fs: parseFloat(getComputedStyle(r.name).fontSize) || 1,
          m: r.media.getBoundingClientRect(),
        }));

        mode = v;
        markView(el, v);
        active = -1;
        list.classList.remove("has-active");
        for (const r of rows) {
          gsap.killTweensOf(r);
          r.s = 0;
          r.bottom = false;
          r.item.classList.remove("is-active");
          r.media.style.transform = "";
          r.img.style.transform = "";
        }
        markColumns(el);

        // Keep the project the visitor was looking at in roughly the same place.
        if (inList && anchor) {
          const want = v === "grid" ? vh * 0.16 : vh * 0.42;
          window.scrollTo(0, Math.max(0, window.scrollY + anchor.item.getBoundingClientRect().top - want));
        }
        measure();

        if (reduced) {
          settle();
          return;
        }

        const near = (rc: DOMRect) => rc.bottom > -vh * 0.6 && rc.top < vh * 1.6;
        const tl = gsap.timeline({ onComplete: settle });
        busy = tl;
        switching = true;

        if (v === "index" && !narrow) {
          // Decide where the viewer will be before anything moves, then fly every image into it.
          const lr = list.getBoundingClientRect();
          const hit = vis.find((r) => vh * 0.5 - lr.top >= r.top && vh * 0.5 - lr.top < r.top + r.h);
          if (hit) {
            active = hit.i;
            hit.s = 1;
            hit.item.classList.add("is-active");
            list.classList.add("has-active");
            cur.x = vw - W - pad();
            cur.y = Math.max(70, Math.min(vh - H - 14, lr.top + hit.top + hit.h / 2 - H / 2));
            cur.set = true;
          } else {
            cur.x = vw - W - pad();
            cur.y = vh * 0.5 - H / 2;
          }
        }

        vis.forEach((r, k) => {
          const f = first[k];
          const at = Math.min(k, 10) * 0.028;
          const n = r.name.getBoundingClientRect();
          if (near(f.n) || near(n)) {
            const fs = parseFloat(getComputedStyle(r.name).fontSize) || 1;
            tl.fromTo(r.name, { x: f.n.left - n.left, y: f.n.top - n.top, scale: f.fs / fs, transformOrigin: "0 0" }, {
              x: 0, y: 0, scale: 1, duration: 1.15, ease: "power3.inOut",
            }, at);
          }
          if (v === "grid" || narrow) {
            // Phones: the photo is in the row in both views, so it moves like a grid card.
            const m = r.media.getBoundingClientRect();
            if (!(near(f.m) || near(m)) || !m.width || !m.height) return;
            tl.fromTo(r.media, {
              x: f.m.left - m.left, y: f.m.top - m.top,
              scaleX: Math.max(f.m.width, 1) / m.width, scaleY: Math.max(f.m.height, 0.5) / m.height,
              transformOrigin: "0 0",
            }, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 1.15, ease: "power3.inOut" }, at);
          } else if (W && H && near(f.m)) {
            r.fx = { dx: f.m.left - cur.x, dy: f.m.top - cur.y, sx: f.m.width / W, sy: f.m.height / H };
            tl.to(r.fx, { dx: 0, dy: 0, sx: 1, sy: r.s, duration: 1.15, ease: "power3.inOut" }, at);
          }
        });
        tl.fromTo(vis.flatMap((r) => [r.rule, ...r.sides]), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7, stagger: 0.008 }, 0.6);
        tick();
      };

      // ── Scroll-linked extras ─────────────────────────────────────────────
      if (!reduced) {
        gsap.to(cards.map((c) => c.inner), {
          y: (i: number) => -i * window.innerHeight * 0.042,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.5, invalidateOnRefresh: true },
        });
        gsap.from(q(".pv-work-cols > *"), {
          autoAlpha: 0, y: 16, duration: 0.8, ease: "power3.out", stagger: 0.08,
          scrollTrigger: { trigger: section, start: "top 85%" },
        });
      }

      // Pick up anything chosen before the scripts arrived.
      cards.forEach((c) => c.card.classList.remove("is-out"));
      dealDeck(live.current.filter, true);
      markColumns(el);
      measure();
      arm();
      engine.current = { filter: runFilter, view: runView };

      return () => {
        engine.current = null;
        busy?.kill();
        busy = null;
        disarm();
        gsap.ticker.remove(tick);
        ScrollTrigger.removeEventListener("refresh", measure);
        gsap.killTweensOf(rows.map((r) => r.img));
        if (narrow) gsap.set(rows.map((r) => [r.media, r.img]).flat(), { clearProps: "all" });
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("mouseleave", onLeave);
        list.removeEventListener("focusin", onFocusIn);
        list.removeEventListener("focusout", onFocusOut);
        io?.disconnect();
        planes?.destroy();
        el.classList.remove("is-glon");
        list.classList.remove("has-active");
        gsap.killTweensOf(titleIn);
        gsap.set(titleIn, { clearProps: "all" });
        cards.forEach((c) => {
          gsap.killTweensOf(c.inner);
          gsap.set(c.inner, { clearProps: "all" });
          c.card.classList.remove("is-off");
          c.card.style.transitionDelay = "";
        });
        layoutDeck(el, live.current.filter, true);
        for (const r of rows) {
          gsap.killTweensOf(r);
          resetRow(r);
          r.item.classList.remove("is-active");
          r.media.style.transform = "";
          r.img.style.transform = "";
        }
      };
    });

    return () => mm.revert();
  });

  const phrase = filterPhrase(shown);
  const livePhrase = filterPhrase(filter);

  return (
    <div className="pv-work" ref={root}>
      <canvas className="pv-work-canvas" ref={canvas} aria-hidden="true" />

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
          <p className="pv-lede pv-work-intro">
            We designed and built every project on this page, and we still look after many of them. Where a
            result has been measured, the figure is shown next to the project.
          </p>
        </div>

        <div className="pv-work-deck" aria-hidden="true" style={{ "--n": items.length } as CSSProperties}>
          {[...items].reverse().map((it, k) => (
            <div
              className="pv-work-card"
              key={it.slug}
              data-cats={it.categories.join(" ")}
              style={{ "--i": items.length - 1 - k, "--d": k } as CSSProperties}
            >
              <div className="pv-work-card-deal">
                <div className="pv-work-card-in">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.imgSm} srcSet={`${it.imgSm.replace("-sm.jpg", "-xs.jpg")} 480w, ${it.imgSm} 800w`} sizes="(max-width: 899px) 48vw, 46vw" alt="" width={800} height={Math.round((800 * it.h) / it.w)} decoding="async" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pv-work-index is-index" data-pv-theme="paper" aria-label="Case studies">
        <div className="pv-work-cols" aria-hidden="true">
          <p className="pv-label">Client</p>
          <p className="pv-label">Result</p>
          <p className="pv-label">Type and year</p>
        </div>

        <div className="pv-work-list is-index">
          {items.map((it) => (
            <article className="pv-work-item" key={it.slug} data-cats={it.categories.join(" ")}>
              <Link href={pv(`/work/${it.slug}`)} className="pv-work-link" data-cursor>
                <div className="pv-work-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.imgSm}
                    srcSet={it.imgLg !== it.imgSm ? `${it.imgSm.replace("-sm.jpg", "-xs.jpg")} 480w, ${it.imgSm} 800w, ${it.imgLg} ${it.w}w` : undefined}
                    sizes="(max-width: 899px) 92vw, 46vw"
                    alt={`${it.client} project by Webgro`}
                    width={it.w}
                    height={it.h}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                  />
                </div>
                <div className="pv-work-text">
                  <span className="pv-work-rule" aria-hidden="true" />
                  <h2 className="pv-work-name">
                    <span className="pv-work-name-mask"><span className="pv-work-name-in">{it.client}</span></span>
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
                    Read the case study
                    <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                </div>
              </Link>
            </article>
          ))}
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
              <span>{v === "index" ? "Index" : "Grid"}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="pv-work-sr" aria-live="polite">Showing {filter === "all" ? "all projects" : livePhrase}.</p>
    </div>
  );
}
