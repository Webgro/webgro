type Props = {
  src: string;
  alt: string;
  aspect?: string;
};

/**
 * Minimal iPad-style tablet frame. Scales to fill its container (no
 * fixed widths) so it composes cleanly inside multi-device showcases.
 * Landscape 4:3 by default.
 */
export function TabletFrame({ src, alt, aspect = "aspect-[4/3]" }: Props) {
  return (
    <div
      className={`relative ${aspect} rounded-[1.8rem] border border-white/15 bg-black p-[4px] shadow-2xl shadow-black/60`}
    >
      {/* Screen bezel */}
      <div className="relative h-full w-full overflow-hidden rounded-[1.55rem] bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </div>
      {/* Outer highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[1.8rem] bg-gradient-to-br from-white/[0.06] via-transparent to-transparent"
      />
    </div>
  );
}
