import type { Metadata } from "next";
import { PAGE_META, pageMeta } from "@/components/preview/seo";
import { AboutView } from "@/components/preview/about/AboutView";

export const metadata: Metadata = pageMeta({ ...PAGE_META.about, path: "/about" });

export default function PreviewAboutPage() {
  return <AboutView />;
}
