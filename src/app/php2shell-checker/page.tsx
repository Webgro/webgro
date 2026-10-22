import type { Metadata } from "next";
import { JsonLd, breadcrumbsLd, faqLd } from "@/components/JsonLd";
import { PHP2SHELL_META, PHP2SHELL_PATH, PHP2SHELL_PUBLISHED, php2shellFaqs } from "@/components/preview/php2shell/content";
import { Php2ShellView } from "@/components/preview/php2shell/Php2ShellView";
import { pageMeta, siteUrl } from "@/components/preview/seo";

export const metadata: Metadata = {
  ...pageMeta({ ...PHP2SHELL_META, path: PHP2SHELL_PATH }),
  keywords: [
    "PHP2Shell",
    "PHP2Shell checker",
    "CVE-2026-109618",
    "CVE-2026-109619",
    "PHP vulnerability checker",
    "WordPress PHP vulnerability",
  ],
};

/** The checker as a free web application, so search engines can show it as a tool. */
function checkerLd() {
  const url = siteUrl(PHP2SHELL_PATH);
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${url}#app`,
    name: "PHP2Shell checker",
    url,
    description: PHP2SHELL_META.description,
    applicationCategory: "SecurityApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
    provider: { "@id": siteUrl("/#org") },
    datePublished: PHP2SHELL_PUBLISHED,
    about: [
      { "@type": "Thing", name: "CVE-2026-109618", sameAs: "https://www.cve.org/CVERecord?id=CVE-2026-109618" },
      { "@type": "Thing", name: "CVE-2026-109619", sameAs: "https://www.cve.org/CVERecord?id=CVE-2026-109619" },
    ],
  };
}

export default function Php2ShellCheckerPage() {
  return (
    <>
      <JsonLd id="ld-app" data={checkerLd()} />
      <JsonLd
        id="ld-breadcrumbs"
        data={breadcrumbsLd([
          { name: "Home", url: siteUrl("/") },
          { name: "PHP2Shell checker", url: siteUrl(PHP2SHELL_PATH) },
        ])}
      />
      <JsonLd id="ld-faq" data={faqLd(php2shellFaqs)} />
      <Php2ShellView />
    </>
  );
}
