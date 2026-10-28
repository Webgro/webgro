import type { Metadata } from "next";
import { SERVICE_META, SERVICE_PRICE, pageMeta, siteUrl } from "@/components/preview/seo";
import { JsonLd, breadcrumbsLd, faqLd, serviceLd } from "@/components/JsonLd";
import { notFound } from "next/navigation";
import { ServiceDetailView } from "@/components/preview/services/ServiceDetailView";
import { getWebsiteSub, pvWebsiteSubs } from "@/components/preview/services/content";

type Props = {
  params: Promise<{ sub: string }>;
};

export async function generateStaticParams() {
  return pvWebsiteSubs.map((s) => ({ sub: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sub } = await params;
  const s = getWebsiteSub(sub);
  if (!s) return { title: "Service not found | Webgro" };
  const m = SERVICE_META[s.slug] ?? { title: `${s.name} | Webgro`, description: s.short };
  return pageMeta({ ...m, path: `/services/websites/${sub}` });
}

export default async function WebsiteSubPage({ params }: Props) {
  const { sub } = await params;
  const s = getWebsiteSub(sub);
  if (!s) notFound();
  return (
    <>
      <JsonLd id="ld-service" data={serviceLd({ slug: `/services/websites/${sub}`.replace("/services/", ""), name: s.name, summary: s.short, price: SERVICE_PRICE[sub] })} />
      <JsonLd
        id="ld-breadcrumbs"
        data={breadcrumbsLd([
        { name: "Home", url: siteUrl("/") },
        { name: "Services", url: siteUrl("/services") },
        { name: "Websites", url: siteUrl("/services/websites") },
          { name: s.name, url: siteUrl(`/services/websites/${sub}`) },
        ])}
      />
      {s.faqs.length > 0 && <JsonLd id="ld-faq" data={faqLd(s.faqs)} />}
      <ServiceDetailView key={sub} slug={sub} />
    </>
  );
}
