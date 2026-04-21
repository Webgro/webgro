import { BrowserFrame } from "@/components/BrowserFrame";
import { TabletFrame } from "@/components/TabletFrame";
import { PhoneFrame } from "@/components/PhoneFrame";

type Props = {
  desktop: { src: string; alt: string; url: string; label?: string };
  tablet: { src: string; alt: string; label?: string };
  phone: { src: string; alt: string; label?: string };
  caption?: string;
};

/**
 * Classic agency-style triptych: desktop + tablet + phone, each showing
 * a different client site. Bottom-aligned on desktop so all three sit
 * on a common baseline. Stacks on mobile.
 */
export function TripleDeviceShowcase({ desktop, tablet, phone, caption }: Props) {
  return (
    <figure>
      {/* Mobile: stacked. Desktop (md+): bottom-aligned row with the devices
          overlapping, tablet tucked behind the desktop on the left, phone
          popping forward in front on the right. Shadows carry the depth. */}
      <div className="flex flex-col items-center gap-10 md:flex-row md:items-end md:justify-center md:gap-0">
        {/* Tablet, in front of the desktop on the left, just kissing */}
        <div
          data-triple-tablet
          className="w-full max-w-sm md:relative md:z-20 md:w-[38%] md:max-w-none md:-mr-[3%]"
        >
          <TabletFrame src={tablet.src} alt={tablet.alt} />
          {tablet.label && (
            <p className="mt-4 text-center font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-white/40">
              {tablet.label}
            </p>
          )}
        </div>

        {/* Desktop, behind the others, widest */}
        <div
          data-triple-desktop
          className="w-full md:relative md:z-10 md:w-[56%]"
        >
          <BrowserFrame
            src={desktop.src}
            alt={desktop.alt}
            url={desktop.url}
            aspect="aspect-[16/10]"
          />
          {desktop.label && (
            <p className="mt-4 text-center font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-white/40">
              {desktop.label}
            </p>
          )}
        </div>

        {/* Phone, in front of the desktop on the right, just kissing */}
        <div
          data-triple-phone
          className="w-[52%] max-w-[200px] md:relative md:z-20 md:w-[16%] md:max-w-none md:-ml-[2%]"
        >
          <PhoneFrame src={phone.src} alt={phone.alt} width="full" />
          {phone.label && (
            <p className="mt-4 text-center font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-white/40">
              {phone.label}
            </p>
          )}
        </div>
      </div>
      {caption && (
        <figcaption className="mt-10 text-center font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-white/40">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
