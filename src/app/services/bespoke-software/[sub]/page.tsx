import type { Metadata } from "next";
import { SERVICE_META, SERVICE_PRICE, pageMeta, siteUrl } from "@/components/preview/seo";
import { JsonLd, breadcrumbsLd, faqLd, serviceLd } from "@/components/JsonLd";
import { notFound } from "next/navigation";
import { ServiceDetailView } from "@/components/preview/services/ServiceDetailView";
import { getBespokeSub, pvBespokeSubs } from "@/components/preview/services/content";

type Props = {
  params: Promise<{ sub: string }>;
};

export async function generateStaticParams() {
  return pvBespokeSubs.map((s) => ({ sub: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sub } = await params;
  const s = getBespokeSub(sub);
  if (!s) return { title: "Service not found | Webgro" };
  const m = SERVICE_META[s.slug] ?? { title: `${s.name} | Webgro`, description: s.short };
  return pageMeta({ ...m, path: `/services/bespoke-software/${sub}` });
}

export default async function BespokeSubPage({ params }: Props) {
  const { sub } = await params;
  const s = getBespokeSub(sub);
  if (!s) notFound();
  return (
    <>
      <JsonLd id="ld-service" data={serviceLd({ slug: `/services/bespoke-software/${sub}`.replace("/services/", ""), name: s.name, summary: s.short, price: SERVICE_PRICE[sub] })} />
      <JsonLd
        id="ld-breadcrumbs"
        data={breadcrumbsLd([
        { name: "Home", url: siteUrl("/") },
        { name: "Services", url: siteUrl("/services") },
        { name: "Bespoke Software", url: siteUrl("/services/bespoke-software") },
          { name: s.name, url: siteUrl(`/services/bespoke-software/${sub}`) },
        ])}
      />
      {s.faqs.length > 0 && <JsonLd id="ld-faq" data={faqLd(s.faqs)} />}
      <ServiceDetailView key={sub} slug={sub} />
    </>
  );
}
