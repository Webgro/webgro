import type { Metadata } from "next";
import { PAGE_META, pageMeta } from "@/components/preview/seo";
import PrivacyDoc from "@/components/legal/PrivacyDoc";
import { LegalDocument } from "@/components/preview/legal/LegalDocument";

// Every word of the policy comes from PrivacyDoc, so the wording lives in one place.
export const metadata: Metadata = pageMeta({ ...PAGE_META.privacy, path: "/privacy" });

export default function PrivacyPage() {
  return <LegalDocument source={PrivacyDoc} current="/privacy" />;
}
