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
 * Lighthouse-style score wheels for case studies. Each metric shows two
 * circular score gauges side by side: a muted "before" gauge and a
 * vibrant "after" gauge with an arrow between them.
 *
 * On viewport entry the rings sweep from 0 to their final value while
 * the centred number counts up. Colour follows Lighthouse conventions:
 * red 0–49, yellow 50–89, green 90–100.
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
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="my-16 md:my-24">
      <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-y-16 lg:grid-cols-4 lg:gap-y-0 lg:gap-x-6">
        {scores.map((s, i) => (
          <ScorePair key={s.label} score={s} delayMs={i * 120} active={active} />
        ))}
      </div>
    </div>
  );
}

/** A pair of circles for one metric: before -> after with an arrow. */
function ScorePair({
  score,
  delayMs,
  active,
}: {
  score: Score;
  delayMs: number;
  active: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-3 sm:gap-4">
        <ScoreCircle value={score.before} muted active={active} delayMs={delayMs} />
        <Arrow />
        <ScoreCircle value={score.after} active={active} delayMs={delayMs + 200} />
      </div>
      <p className="mt-5 text-center font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/55">
        {score.label}
      </p>
    </div>
  );
}

function Arrow() {
  return (
    <svg
      width="22"
      height="14"
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
  green: { stroke: "#00C9A7", text: "text-wg-teal", glow: "rgba(0,201,167,0.30)" },
  amber: { stroke: "#F0B429", text: "text-[#F0B429]", glow: "rgba(240,180,41,0.25)" },
  red: { stroke: "#E5484D", text: "text-[#E5484D]", glow: "rgba(229,72,77,0.25)" },
};

/** A single animated Lighthouse-style score circle. */
function ScoreCircle({
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
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  // pct of ring filled, 0..1
  const pct = shown / 100;
  const dashOffset = circumference * (1 - pct);

  useEffect(() => {
    if (!active) return;
    const start = performance.now() + delayMs;
    let raf = 0;
    const duration = 1100;
    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(elapsed / duration, 1);
      // ease-out cubic for the count-up
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value, delayMs]);

  // Muted "before" gauge: desaturated, lower opacity ring & text
  const opacity = muted ? 0.45 : 1;

  return (
    <div
      className="relative flex h-24 w-24 shrink-0 items-center justify-center sm:h-28 sm:w-28"
      style={{
        // Soft halo behind the "after" circle to make it pop
        filter: muted ? undefined : `drop-shadow(0 0 18px ${colour.glow})`,
      }}
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
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="6"
        />
        {/* Score ring */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={colour.stroke}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          opacity={opacity}
          style={{ transition: "stroke-dashoffset 60ms linear" }}
        />
      </svg>
      <div
        className={`pointer-events-none absolute inset-0 flex items-center justify-center font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight ${muted ? "text-white/55" : colour.text}`}
      >
        {shown}
      </div>
    </div>
  );
}
