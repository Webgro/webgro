import type { Metadata } from "next";
import { PAGE_META, pageMeta } from "@/components/preview/seo";
import { preload } from "react-dom";
import { PreviewHome } from "@/components/preview/PreviewHome";

export const metadata: Metadata = pageMeta({ ...PAGE_META.home, path: "/" });

export default function PreviewPage() {
  // The display face sets the whole first screen, so fetch it with the HTML rather than after the CSS.
  preload("/fonts/satoshi-700.woff2?v=2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  preload("/fonts/satoshi-500.woff2?v=2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  return <PreviewHome darkHero />;
}
