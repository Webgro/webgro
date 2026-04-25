"use client";

import { useEffect, useRef, useState } from "react";

type Score = {
  label: string;
  before: number;
  after: number;
};

type Props = {
  scores: Score[];
};

/**
 * Lighthouse-style score wheels for case studies. Each metric gets its
 * own card with a heading, a "Before" wheel and an "After" wheel, and
 * an arrow between them.
 *
 * Animation:
 *  - Ring fill: pure CSS transition on stroke-dashoffset, triggered by
 *    a class flip when the section enters the viewport. Reliable across
 *    every device and resilient to scroll speed (the previous RAF-only
 *    version could land mid-animation on fast scroll, leaving some
 *    rings appearing to snap).
 *  - Centre number: rAF count-up, with a setTimeout for the per-pair
 *    delay so it can never land in the past.
 *  - Colours follow Lighthouse buckets: red 0-49, amber 50-89, green 90+.
 */
export function LighthouseScores({ scores }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
      {scores.map((s, i) => (
        <ScoreCard key={s.label} score={s} delayMs={i * 140} active={active} />
      ))}
    </div>
  );
}

/** A single metric card: label at top, before -> after wheels below. */
function ScoreCard({
  score,
  delayMs,
  active,
}: {
  score: Score;
  delayMs: number;
  active: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-wg-ink/40 p-6 text-center backdrop-blur-sm transition-colors duration-500 hover:border-white/20">
      <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-white/55">
        {score.label}
      </p>
      <div className="mt-5 flex items-center justify-center gap-3 sm:gap-4">
        <ScoreWheel value={score.before} muted active={active} delayMs={delayMs} />
        <Arrow />
        <ScoreWheel value={score.after} active={active} delayMs={delayMs + 220} />
      </div>
      <div className="mt-4 flex items-center justify-center gap-8 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.22em] text-white/40">
        <span>Before</span>
        <span>After</span>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg
      width="18"
      height="12"
      viewBox="0 0 22 14"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-white/30"
    >
      <path
        d="M1 7H20M20 7L14 1M20 7L14 13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Bucket → Lighthouse-style colour. */
function bucket(value: number): "red" | "amber" | "green" {
  if (value >= 90) return "green";
  if (value >= 50) return "amber";
  return "red";
}

const tone = {
  green: { stroke: "#00C9A7", text: "text-wg-teal", glow: "rgba(0,201,167,0.25)" },
  amber: { stroke: "#F0B429", text: "text-[#F0B429]", glow: "rgba(240,180,41,0.20)" },
  red: { stroke: "#E5484D", text: "text-[#E5484D]", glow: "rgba(229,72,77,0.20)" },
};

const RADIUS = 38;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const DURATION_MS = 1100;

/** A single animated Lighthouse-style score wheel.
 *
 *  Ring uses a pure CSS transition (no RAF), so it's bulletproof.
 *  Number uses rAF for a count-up effect; if rAF skips, the value
 *  will simply land at its final state which still reads correctly. */
function ScoreWheel({
  value,
  muted = false,
  active,
  delayMs,
}: {
  value: number;
  muted?: boolean;
  active: boolean;
  delayMs: number;
}) {
  const [shown, setShown] = useState(0);
  const colour = tone[bucket(value)];

  // Ring is driven by `active`. While inactive the ring is empty
  // (offset = full circumference). When active flips true, CSS
  // transitions the offset to the target over DURATION_MS.
  const targetOffset = CIRCUMFERENCE * (1 - value / 100);
  const dashOffset = active ? targetOffset : CIRCUMFERENCE;

  useEffect(() => {
    if (!active) return;

    let raf = 0;
    let cancelled = false;

    const startTimer = window.setTimeout(() => {
      if (cancelled) return;
      const startedAt = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const elapsed = now - startedAt;
        const t = Math.min(Math.max(elapsed / DURATION_MS, 0), 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setShown(Math.round(value * eased));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      cancelled = true;
      window.clearTimeout(startTimer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active, value, delayMs]);

  const opacity = muted ? 0.5 : 1;

  return (
    <div
      className="relative flex h-20 w-20 shrink-0 items-center justify-center sm:h-24 sm:w-24"
      style={{ filter: muted ? undefined : `drop-shadow(0 0 14px ${colour.glow})` }}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        aria-hidden="true"
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Track */}
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="6"
        />
        {/* Score ring (CSS transition drives the sweep) */}
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke={colour.stroke}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          opacity={opacity}
          style={{
            transition: `stroke-dashoffset ${DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms`,
          }}
        />
      </svg>
      <div
        className={`pointer-events-none absolute inset-0 flex items-center justify-center font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl ${
          muted ? "text-white/55" : colour.text
        }`}
      >
        {shown}
      </div>
    </div>
  );
}
