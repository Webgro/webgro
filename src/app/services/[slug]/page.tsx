import type { Metadata } from "next";
import { SERVICE_META, SERVICE_PRICE, pageMeta, siteUrl } from "@/components/preview/seo";
import { JsonLd, breadcrumbsLd, faqLd, serviceLd } from "@/components/JsonLd";
import { notFound } from "next/navigation";
import { ServiceDetailView } from "@/components/preview/services/ServiceDetailView";
import { getPvService, pvServices } from "@/components/preview/services/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return pvServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getPvService(slug);
  if (!s) return { title: "Service not found | Webgro" };
  const m = SERVICE_META[s.slug] ?? { title: `${s.name} | Webgro`, description: s.short };
  return pageMeta({ ...m, path: `/services/${slug}` });
}

export default async function PreviewServicePage({ params }: Props) {
  const { slug } = await params;
  const s = getPvService(slug);
  if (!s) notFound();
  // Keyed so that moving between services remounts every scene cleanly.
  return (
    <>
      <JsonLd id="ld-service" data={serviceLd({ slug: `/services/${slug}`.replace("/services/", ""), name: s.name, summary: s.short, price: SERVICE_PRICE[slug] })} />
      <JsonLd
        id="ld-breadcrumbs"
        data={breadcrumbsLd([
        { name: "Home", url: siteUrl("/") },
        { name: "Services", url: siteUrl("/services") },
          { name: s.name, url: siteUrl(`/services/${slug}`) },
        ])}
      />
      {s.faqs.length > 0 && <JsonLd id="ld-faq" data={faqLd(s.faqs)} />}
      <ServiceDetailView key={slug} slug={slug} />
    </>
  );
}
