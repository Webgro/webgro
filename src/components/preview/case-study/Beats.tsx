"use client";

import { useRef, type CSSProperties } from "react";
import { SCENE_QUERY, STATIC_QUERY, useGsap } from "../useGsap";
import { Media, PhoneShot, Shot, useHasImage } from "./Media";
import { animateMedia, counter, scrubCounters } from "./motion";
import { aspectOf, parseFigure, type Beat, type BlockOf, type Figure } from "./structure";

/** A figure's value, marked up so motion.ts can count it when it is a number. */
export function Count({ value, className }: { value: string; className?: string }) {
  const p = parseFigure(value);
  if (!p) return <span className={className}>{value}</span>;
  return (
    <span
      className={className}
      data-end={p.end}
      data-dec={p.decimals}
      data-prefix={p.prefix}
      data-suffix={p.suffix}
      data-grouped={p.grouped ? "1" : "0"}
    >
      {value}
    </span>
  );
}

/* ── Text, with the media that illustrates it ─────────────────────────── */

function TextBeat({ beat }: { beat: Extract<Beat, { kind: "text" }> }) {
  const root = useRef<HTMLElement>(null);
  const { section, media } = beat;
  const hasPhone = useHasImage(section.phone?.src ?? "");
  const paragraphs = Array.isArray(section.body) ? section.body : [section.body];

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      gsap.fromTo(q(".pv-cs-beat-rule"), { scaleX: 0 }, {
        scaleX: 1, duration: 1.3, ease: "power3.inOut",
        scrollTrigger: { trigger: el, start: "top 84%" },
      });
      gsap.from(q(".pv-cs-beat-head > *"), {
        y: 34, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 80%" },
      });
      gsap.from(q(".pv-cs-beat-body > p"), {
        y: 26, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: q(".pv-cs-beat-body")[0], start: "top 84%" },
      });
      animateMedia(gsap, el);
    });
    return () => mm.revert();
  });

  return (
    <article className={`pv-cs-beat${hasPhone ? " pv-cs-beat--phone" : ""}`} id={beat.id} ref={root}>
      <span className="pv-cs-beat-rule" aria-hidden="true" />
      <div className="pv-cs-beat-text">
        <div className="pv-cs-beat-head">
          {section.eyebrow && <p className="pv-label">{section.eyebrow}</p>}
          <h3 className="pv-h3">{section.heading}</h3>
        </div>
        <div className="pv-cs-beat-body">
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
      {section.phone && hasPhone && (
        <div className="pv-cs-beat-phone">
          <PhoneShot src={section.phone.src} alt={section.phone.alt} size={section.phone.width ?? "sm"} />
        </div>
      )}
      {media.length > 0 && (
        <div className="pv-cs-beat-media">
          {media.map((m, i) => <Media key={i} block={m} />)}
        </div>
      )}
    </article>
  );
}

function MediaBeat({ beat }: { beat: Extract<Beat, { kind: "media" }> }) {
  const root = useRef<HTMLDivElement>(null);
  useGsap(root, ({ gsap }) => {
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => animateMedia(gsap, root.current!));
    return () => mm.revert();
  });
  return (
    <div className="pv-cs-beat-media pv-cs-beat-media--alone" ref={root}>
      {beat.media.map((m, i) => <Media key={i} block={m} />)}
    </div>
  );
}

/* ── Results ──────────────────────────────────────────────────────────── */

export function FigureList({ figures, lead = false }: { figures: Figure[]; lead?: boolean }) {
  return (
    <ul className={`pv-cs-figs${lead ? " pv-cs-figs--lead" : ""}`} data-cols={Math.min(figures.length, 4)}>
      {figures.map((f, i) => (
        <li className="pv-cs-fig" key={i}>
          <span className="pv-cs-fig-rule" aria-hidden="true" />
          <Count value={f.value} className={`pv-cs-fig-value${f.value.length > 6 ? " is-long" : ""}`} />
          <p className="pv-cs-fig-name">
            {f.eyebrow && <strong>{f.eyebrow}</strong>}
            <span>{f.label}</span>
          </p>
          {f.footnote && <p className="pv-cs-fig-note">{f.footnote}</p>}
        </li>
      ))}
    </ul>
  );
}

function ResultsBeat({ beat }: { beat: Extract<Beat, { kind: "results" }> }) {
  const root = useRef<HTMLDivElement>(null);

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      q(".pv-cs-fig").forEach((fig, i) => {
        gsap.fromTo(fig.querySelector(".pv-cs-fig-rule"), { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: fig, start: "top 94%", end: "top 62%", scrub: 0.4 },
        });
        gsap.from(fig.querySelectorAll(".pv-cs-fig-name, .pv-cs-fig-note"), {
          y: 18, autoAlpha: 0, duration: 0.9, ease: "power3.out", delay: (i % 4) * 0.06,
          scrollTrigger: { trigger: fig, start: "top 82%" },
        });
        const value = fig.querySelector<HTMLElement>(".pv-cs-fig-value");
        if (value && !value.dataset.end) {
          gsap.from(value, {
            yPercent: 40, autoAlpha: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: fig, start: "top 86%" },
          });
        }
      });
      return scrubCounters(gsap, el);
    });
    return () => mm.revert();
  });

  return (
    <div className="pv-cs-results" ref={root}>
      <p className="pv-label">{beat.lead ? "Key figure" : "Results"}</p>
      <FigureList figures={beat.figures} lead={beat.lead} />
    </div>
  );
}

/* ── Lighthouse: a pinned before-and-after ────────────────────────────── */

function LighthouseBeat({ block }: { block: BlockOf<"lighthouseScores"> }) {
  const root = useRef<HTMLDivElement>(null);
  // The source caption describes the old left/right layout; keep only its first sentence.
  const note = block.caption?.split(". ")[0]?.replace(/\.$/, "");

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add(SCENE_QUERY, () => {
      el.classList.add("is-scene");
      const rows = q(".pv-cs-lh-row");
      const restores: Array<() => void> = [];
      gsap.set(rows, { autoAlpha: 0.28 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: q(".pv-cs-lh-stage")[0], start: "top top", end: () => `+=${rows.length * 34 + 40}%`,
          pin: true, scrub: 0.5, anticipatePin: 1, invalidateOnRefresh: true,
        },
      });
      rows.forEach((row, i) => {
        const before = Number(row.dataset.before) / 100;
        const after = Number(row.dataset.after) / 100;
        const c = counter(row.querySelector<HTMLElement>(".pv-cs-lh-now")!);
        c.render();
        restores.push(c.restore);
        tl.to(row, { autoAlpha: 1, duration: 0.3 }, i)
          .fromTo(row.querySelector(".pv-cs-lh-after"), { scaleX: before }, { scaleX: after, duration: 0.9 }, i + 0.05)
          .to(c.state, { v: c.end, duration: 0.9, onUpdate: c.render }, i + 0.05);
      });
      tl.to({}, { duration: 0.7 });

      return () => {
        restores.forEach((r) => r());
        el.classList.remove("is-scene");
      };
    });

    mm.add(STATIC_QUERY, () => {
      gsap.from(q(".pv-cs-lh-row"), {
        autoAlpha: 0, duration: 0.8, stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 75%" },
      });
    });
    return () => mm.revert();
  });

  return (
    <div className="pv-cs-lh" ref={root}>
      <div className="pv-cs-lh-stage">
        <div className="pv-cs-lh-head">
          <h3 className="pv-h3">Lighthouse scores, before and after</h3>
          <p>
            {note ? `${note}. ` : ""}The grey bar is the old site and the blue bar is the new one.
          </p>
        </div>
        <ul className="pv-cs-lh-rows">
          {block.scores.map((s) => (
            <li className="pv-cs-lh-row" key={s.label} data-before={s.before} data-after={s.after}>
              <p className="pv-cs-lh-label">{s.label}</p>
              <div className="pv-cs-lh-track" aria-hidden="true">
                <span className="pv-cs-lh-before" style={{ transform: `scaleX(${s.before / 100})` }} />
                <span className="pv-cs-lh-after" style={{ transform: `scaleX(${s.after / 100})` }} />
              </div>
              <p className="pv-cs-lh-nums">
                <span className="pv-cs-lh-was">{s.before}</span>
                <span className="pv-cs-lh-now" data-from={s.before} data-end={s.after}>{s.after}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── Before / after: a pinned wipe driven by scroll ───────────────────── */

function WipeBeat({ block }: { block: BlockOf<"beforeAfter"> }) {
  const root = useRef<HTMLElement>(null);
  const ready = [useHasImage(block.before.src), useHasImage(block.after.src)].every(Boolean);
  const beforeLabel = block.before.label ?? "Before";
  const afterLabel = block.after.label ?? "After";

  useGsap(root, ({ gsap }) => {
    if (!ready) return;
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add(SCENE_QUERY, () => {
      el.classList.add("is-scene");
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: q(".pv-cs-wipe-stage")[0], start: "top top", end: "+=150%",
          pin: true, scrub: 0.5, anticipatePin: 1, invalidateOnRefresh: true,
        },
      });
      tl.to({}, { duration: 0.25 })
        .fromTo(q(".pv-cs-wipe-pane--before"), { clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 100%)", duration: 2 }, 0.25)
        .fromTo(q(".pv-cs-wipe-line"), { autoAlpha: 1, xPercent: 0 }, { xPercent: 100, duration: 2 }, 0.25)
        .to({}, { duration: 0.4 });
      return () => el.classList.remove("is-scene");
    });
    return () => mm.revert();
  });

  return (
    <figure className="pv-cs-wipe" ref={root}>
      <div className="pv-cs-wipe-stage">
        <div className="pv-cs-wipe-frame" style={{ "--cs-ar": aspectOf(block.aspect, "16 / 10") } as CSSProperties}>
          <div className="pv-cs-wipe-pane pv-cs-wipe-pane--after">
            <Shot src={block.after.src} alt={block.after.alt} />
            <span className="pv-cs-wipe-tag">{afterLabel}</span>
          </div>
          <div className="pv-cs-wipe-pane pv-cs-wipe-pane--before">
            <Shot src={block.before.src} alt={block.before.alt} />
            <span className="pv-cs-wipe-tag">{beforeLabel}</span>
          </div>
          <span className="pv-cs-wipe-line" aria-hidden="true" />
        </div>
        <p className="pv-cs-wipe-hint">Scroll to compare.</p>
      </div>
    </figure>
  );
}

/* ── Tall before / after pages that scroll together ───────────────────── */

function SideBySideBeat({ block }: { block: BlockOf<"beforeAfterStacked"> }) {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap, ScrollTrigger }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    // Side by side on a wide screen. On a phone the two pages share one window:
    // the old page scrolls past, the new one wipes over it, then scrolls too.
    const conditions = {
      wide: `(min-width: 900px) and ${SCENE_QUERY}`,
      narrow: `(max-width: 899px) and ${SCENE_QUERY}`,
    };
    mm.add(conditions, (ctx) => {
      const narrow = Boolean(ctx.conditions?.narrow);
      el.classList.add("is-scene");
      const windows = q(".pv-cs-sbs-window") as HTMLElement[];
      const travel = (win: HTMLElement) => {
        const img = win.querySelector("img");
        return img ? -Math.max(0, img.offsetHeight - win.offsetHeight) : 0;
      };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: q(".pv-cs-sbs-stage")[0], start: "top top", end: narrow ? "+=300%" : "+=220%",
          pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true,
        },
      });
      tl.to({}, { duration: 0.15 });
      if (narrow) {
        const [before, after] = windows.map((w) => w.querySelector("img"));
        if (before) tl.fromTo(before, { y: 0 }, { y: () => travel(windows[0]), duration: 1.4 });
        tl.fromTo(q(".pv-cs-sbs-pane--after"), { clipPath: "inset(0% 0% 0% 100%)" }, {
          clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power2.inOut",
        });
        if (after) tl.fromTo(after, { y: 0 }, { y: () => travel(windows[1]), duration: 1.4 });
      } else {
        windows.forEach((win) => {
          const img = win.querySelector("img");
          if (img) tl.fromTo(img, { y: 0 }, { y: () => travel(win), duration: 2 }, 0.15);
        });
        tl.fromTo(q(".pv-cs-sbs-bar span"), { scaleY: 0 }, { scaleY: 1, duration: 2 }, 0.15);
      }
      tl.to({}, { duration: 0.25 });

      // If a screenshot arrives after the first measure, measure again.
      let timer = 0;
      const onLoad = () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
      };
      const imgs = q(".pv-cs-sbs-window img") as HTMLImageElement[];
      imgs.forEach((img) => { if (!img.complete) img.addEventListener("load", onLoad, { once: true }); });

      return () => {
        window.clearTimeout(timer);
        imgs.forEach((img) => img.removeEventListener("load", onLoad));
        el.classList.remove("is-scene");
      };
    });
    return () => mm.revert();
  });

  return (
    <figure className="pv-cs-sbs" ref={root}>
      <div className="pv-cs-sbs-stage">
        <div className="pv-cs-sbs-head">
          <h3 className="pv-h3">Before and after</h3>
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </div>
        <div className="pv-cs-sbs-panes">
          <div className="pv-cs-sbs-pane">
            <p className="pv-cs-sbs-tag">Before</p>
            <div className="pv-cs-sbs-window"><Shot src={block.before.src} alt={block.before.alt} /></div>
          </div>
          <div className="pv-cs-sbs-bar" aria-hidden="true"><span /></div>
          <div className="pv-cs-sbs-pane pv-cs-sbs-pane--after">
            <p className="pv-cs-sbs-tag">After</p>
            <div className="pv-cs-sbs-window"><Shot src={block.after.src} alt={block.after.alt} /></div>
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ── Quote and aside ──────────────────────────────────────────────────── */

function QuoteBeat({ block }: { block: BlockOf<"quote"> }) {
  const root = useRef<HTMLElement>(null);
  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    const words = q(".pv-cs-quote-word");
    gsap.fromTo(words, { opacity: 0.14 }, {
      opacity: 1, ease: "none", stagger: 0.1,
      scrollTrigger: { trigger: root.current, start: "top 80%", end: "bottom 55%", scrub: 0.4 },
    });
  });
  return (
    <figure className="pv-cs-quote" ref={root}>
      <blockquote>
        {`“${block.text}”`.split(" ").map((w, i) => (
          <span className="pv-cs-quote-word" key={i}>{w} </span>
        ))}
      </blockquote>
      {block.attribution && <figcaption>{block.attribution}</figcaption>}
    </figure>
  );
}

function AsideBeat({ text }: { text: string }) {
  return <p className="pv-cs-aside">{text}</p>;
}

export function BeatView({ beat }: { beat: Beat }) {
  switch (beat.kind) {
    case "text":
      return <TextBeat beat={beat} />;
    case "media":
      return <MediaBeat beat={beat} />;
    case "results":
      return <ResultsBeat beat={beat} />;
    case "lighthouse":
      return <LighthouseBeat block={beat.block} />;
    case "wipe":
      return <WipeBeat block={beat.block} />;
    case "sideBySide":
      return <SideBySideBeat block={beat.block} />;
    case "quote":
      return <QuoteBeat block={beat.block} />;
    case "aside":
      return <AsideBeat text={beat.text} />;
  }
}
