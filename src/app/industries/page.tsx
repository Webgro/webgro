import type { Metadata } from "next";
import { JsonLd, breadcrumbsLd } from "@/components/JsonLd";
import { INDUSTRIES_META } from "@/components/preview/industries/content";
import { IndustriesIndexView } from "@/components/preview/industries/IndustriesIndexView";
import { pageMeta, siteUrl } from "@/components/preview/seo";

export const metadata: Metadata = pageMeta({ ...INDUSTRIES_META, path: "/industries" });

export default function PreviewIndustriesPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumbs"
        data={breadcrumbsLd([
          { name: "Home", url: siteUrl("/") },
          { name: "Industries", url: siteUrl("/industries") },
        ])}
      />
      <IndustriesIndexView />
    </>
  );
}
