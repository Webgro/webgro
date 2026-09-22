import type { Metadata } from "next";
import { PAGE_META, pageMeta } from "@/components/preview/seo";
import CookiesDoc from "@/components/legal/CookiesDoc";
import { LegalDocument } from "@/components/preview/legal/LegalDocument";

// Every word of the policy comes from CookiesDoc, so the wording lives in one place.
export const metadata: Metadata = pageMeta({ ...PAGE_META.cookies, path: "/cookies" });

export default function CookiesPage() {
  return <LegalDocument source={CookiesDoc} current="/cookies" />;
}
