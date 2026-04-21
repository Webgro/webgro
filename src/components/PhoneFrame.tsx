type Props = {
  src: string;
  alt: string;
  caption?: string;
  width?: "xs" | "sm" | "md" | "lg" | "full";
};

const widthClass: Record<NonNullable<Props["width"]>, string> = {
  xs: "w-[180px] md:w-[220px] lg:w-[240px]",
  sm: "w-[260px] md:w-[300px]",
  md: "w-[300px] md:w-[340px]",
  lg: "w-[340px] md:w-[380px]",
  // Full scales with its container, used for composed multi-device layouts
  full: "w-full",
};

function StatusIcons() {
  return (
    <svg width="40" height="10" viewBox="0 0 40 10" fill="none" aria-hidden="true" className="text-white">
      {/* Signal bars */}
      <rect x="0" y="6" width="1.6" height="3.5" rx="0.4" fill="currentColor" />
      <rect x="2.4" y="4.5" width="1.6" height="5" rx="0.4" fill="currentColor" />
      <rect x="4.8" y="3" width="1.6" height="6.5" rx="0.4" fill="currentColor" />
      <rect x="7.2" y="1.5" width="1.6" height="8" rx="0.4" fill="currentColor" />
      {/* Wifi */}
      <path
        d="M13.4 6.5 Q16 4.2 18.6 6.5 M14.4 7.5 Q16 6.3 17.6 7.5"
        stroke="currentColor"
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="16" cy="8.4" r="0.55" fill="currentColor" />
      {/* Battery */}
      <rect
        x="24"
        y="2.5"
        width="13"
        height="6"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="0.7"
        fill="none"
      />
      <rect x="25" y="3.5" width="9.5" height="4" rx="0.4" fill="currentColor" />
      <rect x="37.3" y="3.8" width="0.9" height="3.4" rx="0.3" fill="currentColor" />
    </svg>
  );
}

/**
 * Minimal iPhone-style device frame for mobile screenshots.
 * Includes a status bar with time, camera, and signal/wifi/battery icons.
 * The bar's black background matches the phone chrome, which both adds
 * realism and prevents the rounded-screen corners from visibly clipping
 * the top of the screenshot.
 */
export function PhoneFrame({ src, alt, caption, width = "md" }: Props) {
  return (
    <figure className="flex flex-col items-center">
      <div className={`relative mx-auto ${widthClass[width]}`}>
        {/* Phone body */}
        <div className="relative aspect-[9/19.5] rounded-[2.5rem] border border-white/15 bg-black p-[4px] shadow-2xl shadow-black/60">
          {/* Screen bezel */}
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[2.2rem] bg-black">
            {/* Status bar */}
            <div className="relative z-10 flex h-5 shrink-0 items-center justify-between bg-black px-4 md:h-6">
              <span className="font-[family-name:var(--font-mono),monospace] text-[9px] font-semibold tabular-nums text-white md:text-[10px]">
                9:41
              </span>
              {/* Dynamic island / camera pill */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 flex h-[9px] w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-end rounded-full bg-[#050505] pr-1 md:h-[11px] md:w-12"
              >
                <span className="h-[3px] w-[3px] rounded-full bg-[#1f1f1f]" />
              </span>
              <StatusIcons />
            </div>
            {/* Screenshot area */}
            <div className="relative flex-1 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            </div>
          </div>
          {/* Outer highlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/[0.06] via-transparent to-transparent"
          />
        </div>
      </div>
      {caption && (
        <figcaption className="mt-6 text-center font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/40">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
