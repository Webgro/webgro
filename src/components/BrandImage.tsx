import type { Accent } from "@/content/work";

type Props = {
  src: string;
  alt: string;
  accent?: Accent;
  aspect?: string;
  fit?: "contain" | "cover";
  padded?: boolean;
  caption?: string;
};

const accentTint: Record<Accent, string> = {
  blue: "from-wg-blue/18 via-wg-ink-raised to-wg-ink",
  violet: "from-wg-violet/18 via-wg-ink-raised to-wg-ink",
  teal: "from-wg-teal/18 via-wg-ink-raised to-wg-ink",
};

/**
 * Consistent, brand-aligned frame for real photos (products, lifestyle,
 * portraits). Places the subject on a dark ink backdrop with a subtle
 * accent-coloured gradient so every image in the case studies feels like
 * part of the same shoot.
 */
export function BrandImage({
  src,
  alt,
  accent = "blue",
  aspect = "aspect-[4/3]",
  fit = "contain",
  padded = true,
  caption,
}: Props) {
  return (
    <figure>
      <div
        className={`relative ${aspect} overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${accentTint[accent]}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} ${padded && fit === "contain" ? "p-8 md:p-14" : ""}`}
        />
        {/* Inner vignette to settle the subject */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_55%,_rgba(0,0,0,0.35)_100%)]" />
      </div>
      {caption && (
        <figcaption className="mt-4 text-center font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/40">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
