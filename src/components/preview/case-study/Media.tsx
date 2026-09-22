"use client";

import { createContext, useContext, useState } from "react";
import { Mockup, type MockupName } from "@/components/mockups";
import type { AssetMap } from "./assets";
import { aspectOf, type MediaBlock } from "./structure";

/** The checked image map and client name, shared with every frame below. */
export const CaseContext = createContext<{ assets: AssetMap; client: string }>({ assets: {}, client: "" });

export function Placeholder({ label, name }: { label?: string; name?: string }) {
  const ctx = useContext(CaseContext);
  const client = name ?? ctx.client;
  return (
    <span className="pv-cs-ph" role="img" aria-label={label ?? `${client} image to follow`}>
      <span aria-hidden="true">{client}</span>
    </span>
  );
}

/**
 * One image. Uses the optimised copy and real pixel size found on the server,
 * and falls back to a placeholder if the file is missing or fails to load.
 */
export function Shot({ src, alt, eager = false, className }: { src: string; alt: string; eager?: boolean; className?: string }) {
  const { assets } = useContext(CaseContext);
  const [failed, setFailed] = useState(false);
  const found = assets[src];
  if (!src || found === null || failed) return <Placeholder label={alt} />;
  const a = found ?? { src, w: 1440, h: 950 };
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={a.src}
      alt={alt}
      width={a.w}
      height={a.h}
      loading={eager ? undefined : "lazy"}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}

export function useHasImage(src: string) {
  const { assets } = useContext(CaseContext);
  return Boolean(src) && assets[src] !== null;
}

export function PhoneShot({ src, alt, size = "md" }: { src: string; alt: string; size?: "sm" | "md" | "lg" }) {
  return (
    <figure className={`pv-cs-phone pv-cs-phone--${size}`}>
      <div className="pv-cs-phone-body">
        <div className="pv-cs-phone-screen">
          <Shot src={src} alt={alt} />
        </div>
      </div>
    </figure>
  );
}

function BrowserShot({ block }: { block: Extract<MediaBlock, { type: "browser" }> }) {
  // A missing phone screenshot is left out rather than shown as an empty handset.
  const phone = useHasImage(block.phone?.src ?? "") ? block.phone : undefined;
  return (
    <figure className={`pv-cs-browser${phone ? " pv-cs-browser--duo" : ""}`}>
      <div className="pv-cs-browser-row">
        <div className="pv-cs-browser-win">
          <div className="pv-cs-browser-bar" aria-hidden="true">
            <i /><i /><i />
            <span>{block.url}</span>
          </div>
          <div className="pv-cs-browser-view" style={{ aspectRatio: aspectOf(block.aspect, "16 / 10") }}>
            <div className="pv-cs-browser-shot">
              <Shot src={block.src} alt={block.alt} />
            </div>
            <span className="pv-cs-scan" aria-hidden="true" />
          </div>
        </div>
        {phone && <PhoneShot src={phone.src} alt={phone.alt} size="sm" />}
      </div>
    </figure>
  );
}

/** A photograph that the WebGL layer redraws as a bendy plane. Nothing may sit on top of it. */
function GlImage({ src, alt, ratio }: { src: string; alt: string; ratio: string }) {
  const has = useHasImage(src);
  return (
    <div className="pv-cs-gl" style={{ aspectRatio: ratio }} {...(has ? { "data-pv-gl": "" } : {})}>
      <Shot src={src} alt={alt} />
    </div>
  );
}

export function Media({ block }: { block: MediaBlock }) {
  switch (block.type) {
    case "browser":
      return <BrowserShot block={block} />;

    case "phone":
      return (
        <div className="pv-cs-media pv-cs-media--phone">
          <PhoneShot src={block.src} alt={block.alt} size={block.width ?? "md"} />
        </div>
      );

    case "uiMock":
      return (
        <figure className="pv-cs-mock">
          <div className="pv-cs-mock-panel">
            <Mockup name={block.name as MockupName} />
          </div>
        </figure>
      );

    case "image":
      return (
        <figure className={`pv-cs-media pv-cs-media--image${block.full ? " is-full" : ""}`}>
          <GlImage src={block.src} alt={block.alt} ratio={aspectOf(block.aspect, "16 / 9")} />
        </figure>
      );

    case "product": {
      const contain = (block.fit ?? "contain") === "contain";
      return (
        <figure className="pv-cs-media pv-cs-media--product">
          <div
            className={`pv-cs-product${contain ? " is-contain" : ""}${contain && block.padded !== false ? " is-padded" : ""}`}
            style={{ aspectRatio: aspectOf(block.aspect, "4 / 3") }}
          >
            <Shot src={block.src} alt={block.alt} />
          </div>
        </figure>
      );
    }

    case "split":
      return (
        <div className="pv-cs-media pv-cs-split">
          <GlImage src={block.left.src} alt={block.left.alt} ratio="4 / 5" />
          <GlImage src={block.right.src} alt={block.right.alt} ratio="4 / 5" />
        </div>
      );

    case "gallery":
      return (
        <div className="pv-cs-media pv-cs-gallery">
          {block.images.map((img, i) => (
            <GlImage key={i} src={img.src} alt={img.alt} ratio={aspectOf(img.aspect, "1 / 1")} />
          ))}
        </div>
      );
  }
}
