import type { Metadata } from "next";
import { PAGE_META, pageMeta } from "@/components/preview/seo";
import { ContactPreview } from "@/components/preview/contact/ContactPreview";

export const metadata: Metadata = pageMeta({ ...PAGE_META.contact, path: "/contact" });

export default function PreviewContactPage() {
  return <ContactPreview />;
}
