import type { Metadata } from "next";
import { JsonLd, breadcrumbsLd, faqLd, localServiceLd } from "@/components/JsonLd";
import { BerkshireView } from "@/components/preview/local/BerkshireView";
import { berkshire } from "@/components/preview/local/content";
import { pageMeta, siteUrl } from "@/components/preview/seo";

const PATH = "/web-design/berkshire";

export const metadata: Metadata = pageMeta({ ...berkshire.meta, path: PATH });

export default function PreviewBerkshirePage() {
  return (
    <>
      <JsonLd
        id="ld-service"
        data={localServiceLd({
          path: PATH,
          name: "Web design in Berkshire",
          description: berkshire.meta.description,
          area: { type: "AdministrativeArea", name: "Berkshire" },
        })}
      />
      <JsonLd
        id="ld-breadcrumbs"
        data={breadcrumbsLd([
          { name: "Home", url: siteUrl("/") },
          { name: "Web design in Berkshire", url: siteUrl(PATH) },
        ])}
      />
      <JsonLd id="ld-faq" data={faqLd(berkshire.faqs)} />
      <BerkshireView />
    </>
  );
}
