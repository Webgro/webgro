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
import { NewTag } from "../NewTag";

type Engine = { filter: (f: FilterKey) => void; view: (v: ViewKey) => void };

/** The stage and the grid cards ask for the same file, so a photo fetched for one is cached for the other. */
const STAGE_SIZES = "(max-width: 899px) 92vw, 46vw";

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

    // The list view is a photo stage that sticks while the names scroll past it.
    // Whichever row sits on the reading line is the active one and the stage
    // shows its photo. Wide screens put the stage beside the list and read
    // the line at mid-screen. Below 900px the stage is a band under the nav
    // and the line is the foot of that band. Crossing 900px reverts this block
    // and runs it again for the new width.
    mm.add({ motion: SCENE_QUERY, reduced: STATIC_QUERY, narrow: NARROW_QUERY }, (ctx) => {
      const reduced = !!ctx.conditions?.reduced;
      const narrow = !!ctx.conditions?.narrow;
      const hero = q(".pv-work-hero")[0] as HTMLElement;
      const section = q(".pv-work-index")[0] as HTMLElement;
      const list = q(".pv-work-list")[0] as HTMLElement;
      const stage = q(".pv-work-stage")[0] as HTMLElement;
      const frame = q(".pv-work-frame")[0] as HTMLElement;
      const countN = q(".pv-work-count-n")[0] as HTMLElement;
      const countT = q(".pv-work-count-t")[0] as HTMLElement;
      const titleIn = q(".pv-work-count-in")[0] as HTMLElement;
      const nav = document.querySelector<HTMLElement>(".pv-nav");

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
      }));
      type Row = (typeof rows)[number];

      // One layer per project in the stage, in the same order as the rows.
      const shots = (q(".pv-work-shot") as HTMLElement[]).map((shot) => ({
        el: shot,
        img: shot.querySelector("img") as HTMLImageElement,
        value: shot.querySelector<HTMLElement>(".pv-work-plate-in"),
        label: shot.querySelector<HTMLElement>(".pv-work-plate-label"),
        // Everything in the layer that a transition touches.
        bits: [shot, ...Array.from(shot.querySelectorAll<HTMLElement>("img, .pv-work-plate-in, .pv-work-plate-label"))],
        ready: null as Promise<void> | null,
      }));

      let mode: ViewKey = live.current.view;
      let busy: gsap.core.Timeline | null = null;
      let switching = false;
      let alive = true;
      let active = -1;
      let shown = Math.max(0, shots.findIndex((s) => s.el.classList.contains("is-on")));
      let want = shown;
      let z = 1;
      let hold: gsap.core.Tween | null = null;
      let awake = false; // no stage photo is fetched until the page has loaded or the list is near
      let focusIdx = -1;
      let vh = window.innerHeight;
      let listTop = 0;
      let listLeft = 0;
      let listRight = 0;
      let line = vh * 0.5;
      let navLift = 0;
      const ptr = { x: 0, y: 0, live: false, bar: false };
      const hoverable = !narrow && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const pad2 = (n: number) => String(n).padStart(2, "0");

      // Everything pick() needs is read here, so scrolling itself does no layout work.
      const measure = () => {
        vh = window.innerHeight;
        for (const r of rows) {
          r.top = r.item.offsetTop;
          r.h = r.item.offsetHeight;
        }
        if (mode !== "index") return;
        const lr = list.getBoundingClientRect();
        listTop = lr.top + window.scrollY;
        listLeft = lr.left;
        listRight = lr.right;
        if (narrow) {
          const cs = getComputedStyle(stage);
          navLift = parseFloat(cs.getPropertyValue("--pv-work-lift")) || 0;
          // The foot of the band while it is stuck.
          line = (parseFloat(cs.top) || 0) + stage.offsetHeight;
        } else {
          navLift = 0;
          line = vh * 0.5;
        }
      };

      // ── The stage ────────────────────────────────────────────────────────
      const visible = () => rows.filter((r) => !r.out);

      /** Fetch and decode a project's photo. Resolves when it can be shown without a blank frame. */
      const load = (i: number) => {
        const s = shots[i];
        if (!s) return Promise.resolve();
        if (!s.ready) {
          const { img } = s;
          img.loading = "eager";
          if (img.dataset.src) {
            if (img.dataset.srcset) img.srcset = img.dataset.srcset;
            img.src = img.dataset.src;
          }
          s.ready = (typeof img.decode === "function" ? img.decode() : Promise.resolve()).catch(() => {});
        }
        return s.ready;
      };

      /** Warm the photos either side of a project, further ahead in the direction of travel. */
      const warm = (i: number, dir: number) => {
        const vis = visible();
        const k = vis.findIndex((r) => r.i === i);
        if (k < 0) return;
        for (const step of [dir, dir * 2, -dir, dir * 3]) {
          const r = vis[k + step];
          if (r) load(r.i);
        }
      };

      const setCount = () => {
        const vis = visible();
        const k = vis.findIndex((r) => r.i === shown);
        countN.textContent = pad2(Math.max(k, 0) + 1);
        countT.textContent = pad2(Math.max(vis.length, 1));
      };

      const stageBits = () => shots.flatMap((s) => s.bits);

      /** Put a project's photo on the stage. `dir` is 1 when moving down the list, -1 when moving up. */
      const show = (i: number, instant: boolean) => {
        if (i === shown || !shots[i]) return;
        const dir = i > shown ? 1 : -1;
        const prev = shots[shown];
        const s = shots[i];
        shown = i;
        setCount();

        if (reduced || instant) {
          gsap.killTweensOf([...stageBits(), countN]);
          gsap.set([...stageBits(), countN], { clearProps: "all" });
          z = 1;
          shots.forEach((o) => {
            o.el.style.zIndex = "";
            o.el.classList.toggle("is-on", o === s);
          });
          return;
        }

        // The new photo is wiped in over the old one from the edge it is
        // arriving from, and settles back from a slight zoom as it lands. The
        // old photo is nudged the other way so the two read as one movement.
        gsap.killTweensOf(s.bits);
        s.el.style.zIndex = String(++z);
        s.el.classList.add("is-on");
        gsap.fromTo(s.el, { clipPath: dir > 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }, {
          clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.inOut",
          onComplete: () => {
            if (shown !== i) return;
            shots.forEach((o) => {
              if (o === s) return;
              gsap.killTweensOf(o.bits);
              gsap.set(o.bits, { clearProps: "all" });
              o.el.style.zIndex = "";
              o.el.classList.remove("is-on");
            });
            gsap.set(s.el, { clearProps: "clipPath" });
            s.el.style.zIndex = "1";
            z = 1;
          },
        });
        gsap.fromTo(s.img, { scale: 1.16, yPercent: dir * 6 }, { scale: 1, yPercent: 0, duration: 1.3, ease: "power3.out" });
        if (prev && prev !== s) gsap.to(prev.img, { yPercent: -dir * 7, duration: 0.9, ease: "power3.inOut", overwrite: "auto" });
        if (s.value) gsap.fromTo(s.value, { yPercent: dir * 110 }, { yPercent: 0, duration: 0.85, delay: 0.3, ease: "power3.out" });
        if (s.label) gsap.fromTo(s.label, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.5, ease: "none" });
        gsap.fromTo(countN, { yPercent: dir * 105 }, { yPercent: 0, duration: 0.6, ease: "power3.out", overwrite: true });
      };

      const setActive = (next: number, instant = false) => {
        if (next === active && !instant) return;
        const dir = next >= active ? 1 : -1;
        active = next;
        list.classList.toggle("has-active", next >= 0);
        for (const r of rows) r.item.classList.toggle("is-active", r.i === next);
        if (next < 0) return;
        want = next;
        hold?.kill();
        const go = () => {
          hold = null;
          if (!awake) return;
          warm(next, dir);
          load(next).then(() => {
            if (alive && want === next && mode === "index") show(next, instant);
          });
        };
        // A short pause before the photo follows, so a fast scroll through
        // several rows does not stack a wipe for every one of them.
        if (instant || reduced) go();
        else hold = gsap.delayedCall(0.09, go);
      };

      /** Start fetching photos: the active project's, then its neighbours. */
      const wake = () => {
        if (awake || !alive) return;
        awake = true;
        if (mode !== "index" || want < 0) return;
        const i = want;
        warm(i, 1);
        load(i).then(() => {
          if (alive && want === i && mode === "index") show(i, true);
        });
      };

      /** Work out which row is on the reading line. Arithmetic on cached numbers only. */
      const pick = (instant = false) => {
        if (mode !== "index" || switching) return;
        let next = -1;
        if (focusIdx >= 0 && !rows[focusIdx].out) next = focusIdx;
        else {
          const scroll = window.scrollY;
          let y = line - (navLift && nav?.classList.contains("is-hidden") ? navLift : 0);
          if (hoverable && ptr.live && !ptr.bar && ptr.x >= listLeft && ptr.x <= listRight) {
            const top = listTop - scroll;
            const last = rows[rows.length - 1];
            if (ptr.y >= top && ptr.y <= top + last.top + last.h) y = ptr.y;
          }
          const ly = y + scroll - listTop;
          for (const r of rows) {
            if (r.out) continue;
            next = r.i;
            // Phones: the first row whose name is clear of the band. Wide
            // screens: the row the line runs through.
            if (narrow ? r.top >= ly - 18 : ly < r.top + r.h) break;
          }
        }
        if (next !== active || instant) setActive(next, instant);
      };

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") { ptr.live = false; return; }
        ptr.x = e.clientX;
        ptr.y = e.clientY;
        ptr.live = true;
        ptr.bar = e.target instanceof Element && !!e.target.closest(".pv-work-bar");
        pick();
      };
      const onLeave = () => { ptr.live = false; pick(); };
      const onFocusIn = (e: FocusEvent) => {
        const item = e.target instanceof Element ? e.target.closest(".pv-work-item") : null;
        focusIdx = item ? rows.findIndex((r) => r.item === item) : -1;
        pick();
      };
      const onFocusOut = () => { focusIdx = -1; pick(); };
      const onRefresh = () => { measure(); pick(); };
      if (hoverable) {
        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("mouseleave", onLeave);
      }
      list.addEventListener("focusin", onFocusIn);
      list.addEventListener("focusout", onFocusOut);
      ScrollTrigger.addEventListener("refresh", onRefresh);
      ScrollTrigger.create({ trigger: section, start: "top bottom", end: "bottom top", onUpdate: () => pick() });
      ScrollTrigger.create({ trigger: section, start: "top 250%", onEnter: wake });
      // On phones the band rides up when the nav hides, and the line goes with it.
      const navWatch = narrow && nav ? new MutationObserver(() => pick()) : null;
      if (navWatch && nav) navWatch.observe(nav, { attributes: true, attributeFilter: ["class"] });

      // ── WebGL: deck cards and the grid's project images share one canvas ──
      let planes: ReturnType<typeof createGlPlanes> = null;
      let io: IntersectionObserver | undefined;
      if (!reduced && canvas.current) {
        el.classList.add("is-glon");
        const deckEls = cards.map((c) => c.inner).reverse();
        planes = createGlPlanes(canvas.current, narrow ? deckEls : [...deckEls, ...rows.map((r) => r.media)]);
        if (planes) {
          io = new IntersectionObserver(([e]) => planes?.setRunning(e.isIntersecting), { rootMargin: "20% 0px" });
          io.observe(el);
        } else {
          el.classList.remove("is-glon");
        }
      }

      // ── Row images that sit in the page (grid view) ──────────────────────
      // Desktop grid keeps its scaleY wipe (the WebGL plane follows the box).
      // Phones draw plain photos, so they wipe up through a clip-path mask
      // instead, which never squashes the picture.
      const inlineMedia = () => mode === "grid";
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
        gsap.killTweensOf([r.media, r.img]);
        gsap.set(r.media, { clearProps: "all" });
        if (narrow) gsap.set(r.img, { clearProps: "all" });
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
          if (inlineMedia() && narrow) gsap.set(r.img, { scale: 1.14 });
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
              if (inlineMedia() && narrow) gsap.to(r.img, { scale: 1, duration: 1.4, ease: "power3.out" });
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
        rows.forEach(resetRow);
        gsap.set(frame, { clearProps: "all" });
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

        const swap = () => {
          const first = staying.map((r) => r.item.getBoundingClientRect());
          leaving.forEach((r) => {
            resetRow(r);
            r.out = true;
            r.item.classList.add("is-out");
          });
          entering.forEach((r) => { r.out = false; r.item.classList.remove("is-out"); });
          markColumns(el);
          measure();
          // The stage follows the new list: a fresh count, and a new active
          // project if the old one has just been filtered out.
          setCount();
          pick();
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
            const last = r.item.getBoundingClientRect();
            const dx = first[k].left - last.left;
            const dy = first[k].top - last.top;
            if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
            tl.fromTo(r.item, { x: dx, y: dy }, { x: 0, y: 0, duration: 0.95, ease: "power3.inOut" }, Math.min(k, 8) * 0.025);
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

      // ── View toggle: names travel to their new places, and the active ────
      // photo flies between the stage and its card in the grid (FLIP).
      const runView = (v: ViewKey) => {
        if (v === mode) return;
        finish();
        disarm();
        rows.forEach(resetRow);

        const vis = rows.filter((r) => !r.out);
        const inList = section.getBoundingClientRect().top < vh * 0.5;
        const wasActive = active;
        const anchor = vis.find((r) => r.i === active) ?? vis.find((r) => r.item.getBoundingClientRect().bottom > vh * 0.3);
        const stageBox = mode === "index" ? frame.getBoundingClientRect() : null;
        const first = vis.map((r) => ({
          n: r.name.getBoundingClientRect(),
          fs: parseFloat(getComputedStyle(r.name).fontSize) || 1,
          m: r.media.getBoundingClientRect(),
        }));

        mode = v;
        markView(el, v);
        hold?.kill();
        hold = null;
        active = -1;
        list.classList.remove("has-active");
        for (const r of rows) r.item.classList.remove("is-active");
        markColumns(el);
        measure();

        // Keep the project the visitor was looking at in roughly the same place.
        if (inList && anchor) {
          const wantY = v === "grid" ? vh * 0.16 : line - Math.min(anchor.item.offsetHeight / 2, 60);
          window.scrollTo(0, Math.max(0, window.scrollY + anchor.item.getBoundingClientRect().top - wantY));
        }
        measure();
        if (v === "index") {
          setCount();
          pick(true);
        }

        if (reduced) {
          settle();
          return;
        }

        const near = (rc: DOMRect) => rc.bottom > -vh * 0.6 && rc.top < vh * 1.6;
        const tl = gsap.timeline({ onComplete: settle });
        busy = tl;
        switching = true;

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
          if (v !== "grid") return;
          const m = r.media.getBoundingClientRect();
          if (!near(m) || !m.width || !m.height) return;
          if (r.i === wasActive && stageBox && stageBox.width && near(stageBox)) {
            // The photo on the stage becomes this project's card.
            tl.fromTo(r.media, {
              x: stageBox.left - m.left, y: stageBox.top - m.top,
              scaleX: stageBox.width / m.width, scaleY: stageBox.height / m.height,
              transformOrigin: "0 0",
            }, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 1.15, ease: "power3.inOut" }, 0);
          } else {
            tl.fromTo(r.media, mediaHidden(), { ...mediaShown(), duration: 1, ease: "power3.inOut" }, 0.15 + at);
          }
        });

        if (v === "index") {
          // The other way round: the card of the project on the reading line
          // grows into the stage. If it was off screen, the stage wipes in.
          const k = vis.findIndex((r) => r.i === active);
          const from = k >= 0 ? first[k].m : null;
          const to = frame.getBoundingClientRect();
          if (from && from.width && near(from) && to.width) {
            tl.fromTo(frame, {
              x: from.left - to.left, y: from.top - to.top, scale: from.width / to.width, transformOrigin: "0 0",
            }, { x: 0, y: 0, scale: 1, duration: 1.15, ease: "power3.inOut" }, 0);
          } else {
            tl.fromTo(frame, { clipPath: "inset(100% 0% 0% 0%)" }, {
              clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power3.inOut",
            }, 0.1);
          }
        }
        tl.fromTo(vis.flatMap((r) => [r.rule, ...r.sides]), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7, stagger: 0.008 }, 0.6);
      };

      // ── Scroll-linked extras ─────────────────────────────────────────────
      if (!reduced) {
        gsap.to(cards.map((c) => c.inner), {
          y: (i: number) => -i * window.innerHeight * 0.042,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.5, invalidateOnRefresh: true },
        });
      }

      // Pick up anything chosen before the scripts arrived.
      cards.forEach((c) => c.card.classList.remove("is-out"));
      dealDeck(live.current.filter, true);
      markColumns(el);
      measure();
      setCount();
      pick(true);
      arm();
      engine.current = { filter: runFilter, view: runView };

      // Fetch the first few stage photos once the page itself has finished
      // loading, so they never compete with the hero.
      if (document.readyState === "complete") gsap.delayedCall(0.4, wake);
      else window.addEventListener("load", wake, { once: true });

      return () => {
        alive = false;
        engine.current = null;
        busy?.kill();
        busy = null;
        hold?.kill();
        disarm();
        navWatch?.disconnect();
        window.removeEventListener("load", wake);
        ScrollTrigger.removeEventListener("refresh", onRefresh);
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("mouseleave", onLeave);
        list.removeEventListener("focusin", onFocusIn);
        list.removeEventListener("focusout", onFocusOut);
        io?.disconnect();
        planes?.destroy();
        el.classList.remove("is-glon");
        list.classList.remove("has-active");
        gsap.killTweensOf([titleIn, frame, countN, ...stageBits()]);
        gsap.set([titleIn, frame, countN, ...stageBits()], { clearProps: "all" });
        shots.forEach((s, i) => {
          s.el.style.zIndex = "";
          s.el.classList.toggle("is-on", i === shown);
        });
        cards.forEach((c) => {
          gsap.killTweensOf(c.inner);
          gsap.set(c.inner, { clearProps: "all" });
          c.card.classList.remove("is-off");
          c.card.style.transitionDelay = "";
        });
        layoutDeck(el, live.current.filter, true);
        for (const r of rows) {
          resetRow(r);
          gsap.set(r.img, { clearProps: "all" });
          r.item.classList.remove("is-active");
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
        {/* The photo stage. It repeats what the list says (the names, links and
            figures all live in the list), so it is hidden from assistive tech.
            Only the first photo has a src in the markup. Scripts fetch and
            decode the rest shortly before each one is needed. */}
        <div className="pv-work-stage" aria-hidden="true">
          <div className="pv-work-frame">
            {items.map((it, i) => {
              const xs = it.imgSm.replace("-sm.jpg", "-xs.jpg");
              const srcSet = it.imgLg !== it.imgSm ? `${xs} 480w, ${it.imgSm} 800w, ${it.imgLg} ${it.w}w` : undefined;
              return (
                <div className={`pv-work-shot${i === 0 ? " is-on" : ""}`} key={it.slug}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={i === 0 ? it.imgSm : undefined}
                    srcSet={i === 0 ? srcSet : undefined}
                    data-src={i === 0 ? undefined : it.imgSm}
                    data-srcset={i === 0 ? undefined : srcSet}
                    sizes={STAGE_SIZES}
                    alt=""
                    width={it.w}
                    height={it.h}
                    loading={i === 0 ? "lazy" : undefined}
                    decoding="async"
                  />
                  {it.figure ? (
                    <p className="pv-work-plate">
                      <strong><span className="pv-work-plate-in">{it.figure.value}</span></strong>
                      <span className="pv-work-plate-label">{it.figure.label}</span>
                    </p>
                  ) : null}
                </div>
              );
            })}
            <p className="pv-work-count">
              <span className="pv-work-count-mask"><span className="pv-work-count-n">01</span></span>
              <span className="pv-work-count-of"> / </span>
              <span className="pv-work-count-t">{String(items.length).padStart(2, "0")}</span>
            </p>
          </div>
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
                    sizes={STAGE_SIZES}
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
                    <svg className="pv-work-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
                    <span className="pv-work-name-wrap">
                      <span className="pv-work-name-mask"><span className="pv-work-name-in">{it.client}</span></span>
                      <BrushStroke className="pv-work-name-brush" />
                    </span>
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
              <span>{v === "index" ? "List" : "Grid"}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="pv-work-sr" aria-live="polite">Showing {filter === "all" ? "all projects" : livePhrase}.</p>
    </div>
  );
}
