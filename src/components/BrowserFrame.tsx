import { PhoneFrame } from "@/components/PhoneFrame";

type Props = {
  src: string;
  alt: string;
  url: string;
  aspect?: string;
  caption?: string;
  phone?: { src: string; alt: string };
};

/**
 * Clean, macOS-style browser chrome (light). Wraps a website screenshot
 * so raw captures read as product shots rather than images floating in
 * a div. Optionally overlays a PhoneFrame at the bottom-right to pair
 * desktop and mobile in a single composition.
 */
export function BrowserFrame({
  src,
  alt,
  url,
  aspect = "aspect-[16/10]",
  caption,
  phone,
}: Props) {
  return (
    <figure className={phone ? "pb-20 md:pb-24" : ""}>
      <div className="relative">
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl shadow-black/40">
          {/* Chrome */}
          <div className="flex items-center gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
              <span className="h-3 w-3 rounded-full bg-[#28C840]" />
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true" className="text-zinc-400">
                <path d="M3 4V3a2 2 0 1 1 4 0v1 M2.5 4h5v4h-5z" stroke="currentColor" strokeWidth="0.8" fill="none" />
              </svg>
              <p
                className="text-[11px] tracking-wide text-zinc-600"
                style={{ fontFamily: "var(--font-poppins), Poppins, system-ui, sans-serif" }}
              >
                {url}
              </p>
            </div>
          </div>
          {/* Content */}
          <div className={`relative ${aspect} overflow-hidden bg-white`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          </div>
        </div>

        {/* Optional phone overlay, sits bottom-right, overlapping the browser. */}
        {phone && (
          <div className="pointer-events-none absolute -bottom-16 right-4 md:-bottom-20 md:right-10">
            <PhoneFrame src={phone.src} alt={phone.alt} width="xs" />
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-4 text-center font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/40">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
