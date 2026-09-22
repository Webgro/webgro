import type { Metadata } from "next";
import { PAGE_META, pageMeta } from "@/components/preview/seo";
import { ServicesIndexView } from "@/components/preview/services/ServicesIndexView";

export const metadata: Metadata = pageMeta({ ...PAGE_META.services, path: "/services" });

export default function PreviewServicesPage() {
  return <ServicesIndexView />;
}
