/**
 * Decorative animated map, subtle "live worldwide" feel like Shopify's
 * analytics view. A central UK dot pulses, with arcs drawing out to a
 * handful of destinations on a loop. Intended to sit small and low-
 * opacity behind the contact block in the footer.
 */
export function GlobalMap() {
  // viewBox 240 × 140, UK sits roughly top-centre-left.
  const UK = { x: 118, y: 46 };
  const destinations = [
    { x: 52, y: 68, delay: 0, name: "US" },
    { x: 158, y: 52, delay: 0.6, name: "EU" },
    { x: 188, y: 76, delay: 1.2, name: "ME" },
    { x: 212, y: 100, delay: 1.8, name: "APAC" },
    { x: 88, y: 112, delay: 2.4, name: "LATAM" },
  ];

  const arcPath = (d: { x: number; y: number }) => {
    const cx = (UK.x + d.x) / 2;
    // Arc height: larger when points are further apart.
    const dist = Math.hypot(d.x - UK.x, d.y - UK.y);
    const lift = Math.min(40, dist * 0.45);
    const cy = Math.min(UK.y, d.y) - lift;
    return `M ${UK.x} ${UK.y} Q ${cx} ${cy} ${d.x} ${d.y}`;
  };

  return (
    <svg
      viewBox="0 0 240 140"
      className="h-full w-full text-wg-blue"
      fill="none"
      aria-hidden="true"
    >
      {/* Very faint dotted ground plane, suggesting a globe / map */}
      <g opacity="0.18">
        {Array.from({ length: 40 }).map((_, i) => {
          // Deterministic pseudo-random dot field
          const seed = i * 9301 + 49297;
          const rx = (seed % 233) / 233;
          const ry = ((seed * 7) % 139) / 139;
          return (
            <circle
              key={i}
              cx={8 + rx * 224}
              cy={8 + ry * 124}
              r="0.6"
              fill="currentColor"
            />
          );
        })}
      </g>

      {/* Animated arcs, draw in then fade, staggered */}
      {destinations.map((d, i) => (
        <path
          key={`arc-${i}`}
          d={arcPath(d)}
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="120"
          strokeDashoffset="120"
          opacity="0"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="120;0;0"
            keyTimes="0;0.5;1"
            dur="5s"
            begin={`${d.delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0;0.8;0.8;0"
            keyTimes="0;0.2;0.7;1"
            dur="5s"
            begin={`${d.delay}s`}
            repeatCount="indefinite"
          />
        </path>
      ))}

      {/* Destination dots */}
      {destinations.map((d, i) => (
        <circle
          key={`d-${i}`}
          cx={d.x}
          cy={d.y}
          r="1.8"
          fill="currentColor"
          opacity="0.55"
        />
      ))}

      {/* UK marker: pulsing halo + solid core */}
      <circle cx={UK.x} cy={UK.y} r="3" fill="currentColor" opacity="0.5">
        <animate
          attributeName="r"
          values="3;16;3"
          dur="2.8s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.6;0;0.6"
          dur="2.8s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx={UK.x} cy={UK.y} r="2.2" fill="currentColor" />
    </svg>
  );
}
