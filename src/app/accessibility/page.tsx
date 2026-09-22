import type { Metadata } from "next";
import { PAGE_META, pageMeta } from "@/components/preview/seo";
import AccessibilityDoc from "@/components/legal/AccessibilityDoc";
import { LegalDocument } from "@/components/preview/legal/LegalDocument";

// Every word of the statement comes from AccessibilityDoc, so the wording lives in one place.
export const metadata: Metadata = pageMeta({ ...PAGE_META.accessibility, path: "/accessibility" });

export default function AccessibilityPage() {
  return <LegalDocument source={AccessibilityDoc} current="/accessibility" />;
}
