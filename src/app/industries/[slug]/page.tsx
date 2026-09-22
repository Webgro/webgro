import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd, breadcrumbsLd, faqLd, industryServiceLd } from "@/components/JsonLd";
import { getIndustry, industries } from "@/components/preview/industries/content";
import { IndustryView } from "@/components/preview/industries/IndustryView";
import { pageMeta, siteUrl } from "@/components/preview/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

/** Only the industries in the data exist. Anything else is a 404. */
export const dynamicParams = false;

export async function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) return { title: "Page not found | Webgro" };
  return pageMeta({ ...ind.meta, path: `/industries/${ind.slug}` });
}

export default async function PreviewIndustryPage({ params }: Props) {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) notFound();
  const path = `/industries/${ind.slug}`;

  return (
    <>
      <JsonLd
        id="ld-service"
        data={industryServiceLd({
          path,
          name: `Websites for ${ind.name.toLowerCase()}`,
          description: ind.meta.description,
          audience: ind.audience,
        })}
      />
      <JsonLd
        id="ld-breadcrumbs"
        data={breadcrumbsLd([
          { name: "Home", url: siteUrl("/") },
          { name: "Industries", url: siteUrl("/industries") },
          { name: ind.name, url: siteUrl(path) },
        ])}
      />
      <JsonLd id="ld-faq" data={faqLd(ind.faqs)} />
      <IndustryView key={ind.slug} slug={ind.slug} />
    </>
  );
}
