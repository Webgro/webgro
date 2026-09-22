/**
 * A tapered, dry-edged stroke in the same hand as the brushed W in the logo.
 * Drawn as a filled shape and roughened with a displacement filter, then
 * wiped in from the left by whichever section owns it.
 */
export function BrushFilter() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <defs>
        <filter id="pv-rough" x="-5%" y="-40%" width="110%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035 0.4" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

export function BrushStroke({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pv-brush-svg ${className}`}
      viewBox="0 0 300 30"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        filter="url(#pv-rough)"
        d="M4 19 C 52 8, 150 3, 292 9 C 298 9.5, 298 15, 291 15.5 C 200 12, 96 15, 9 26 C 2 27, -1 21, 4 19 Z"
        fill="currentColor"
      />
    </svg>
  );
}
