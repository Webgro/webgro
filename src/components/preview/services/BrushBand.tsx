/**
 * A long brushed line in the same hand as the underline strokes: a tapered,
 * slightly wandering filled band, roughened by a displacement filter. It is
 * stretched to whatever box it is given and revealed with a clip-path wipe,
 * which keeps the filter result cached while the line "draws".
 */

const LEN = 1000;
const MID = 20;

function bandPath(seed: number) {
  const top: string[] = [];
  const bottom: string[] = [];
  const steps = 36;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = 6 + t * (LEN - 12);
    const wander = Math.sin(t * 5.1 + seed) * 2.6 + Math.sin(t * 13.7 + seed * 2.3) * 1.1;
    // Heavier where the brush lands, drier towards the end of the stroke.
    const taper = Math.min(1, t * 9) * Math.min(1, (1 - t) * 14);
    const body = 4.4 + Math.sin(t * 8.3 + seed * 1.7) * 1.3 - t * 1.6;
    const half = Math.max(0.8, body * taper);
    top.push(`${x.toFixed(1)} ${(MID + wander - half).toFixed(2)}`);
    bottom.unshift(`${x.toFixed(1)} ${(MID + wander + half).toFixed(2)}`);
  }
  return `M${top.join(" L")} L${bottom.join(" L")} Z`;
}

const swap = (d: string) => d.replace(/(-?[\d.]+) (-?[\d.]+)/g, "$2 $1");

export function BrushBandDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <defs>
        <filter id="pv-svc-rough-h" x="-2%" y="-60%" width="104%" height="220%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03 0.5" numOctaves="2" seed="11" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="pv-svc-rough-v" x="-60%" y="-2%" width="220%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.5 0.03" numOctaves="2" seed="5" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

export function BrushBand({
  className = "",
  vertical = false,
  seed = 1,
}: {
  className?: string;
  vertical?: boolean;
  seed?: number;
}) {
  const d = bandPath(seed);
  return (
    <svg
      className={`pv-svc-band ${vertical ? "pv-svc-band--v" : "pv-svc-band--h"} ${className}`}
      viewBox={vertical ? `0 0 ${MID * 2} ${LEN}` : `0 0 ${LEN} ${MID * 2}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path suppressHydrationWarning d={vertical ? swap(d) : d} filter={`url(#pv-svc-rough-${vertical ? "v" : "h"})`} fill="currentColor" />
    </svg>
  );
}
