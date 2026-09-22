import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd, breadcrumbsLd, faqLd, localServiceLd } from "@/components/JsonLd";
import { getTown, towns } from "@/components/preview/local/content";
import { LocalView } from "@/components/preview/local/LocalView";
import { pageMeta, siteUrl } from "@/components/preview/seo";

type Props = {
  params: Promise<{ town: string }>;
};

/** Only the towns in the data exist. Anything else is a 404. */
export const dynamicParams = false;

export async function generateStaticParams() {
  return towns.map((t) => ({ town: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { town } = await params;
  const t = getTown(town);
  if (!t) return { title: "Page not found | Webgro" };
  return pageMeta({ ...t.meta, path: `/web-design/${t.slug}` });
}

export default async function PreviewTownPage({ params }: Props) {
  const { town } = await params;
  const t = getTown(town);
  if (!t) notFound();
  const path = `/web-design/${t.slug}`;

  return (
    <>
      <JsonLd
        id="ld-service"
        data={localServiceLd({
          path,
          name: `Web design in ${t.name}`,
          description: t.meta.description,
          area: { type: t.areaType, name: t.name },
        })}
      />
      <JsonLd
        id="ld-breadcrumbs"
        data={breadcrumbsLd([
          { name: "Home", url: siteUrl("/") },
          { name: "Web design in Berkshire", url: siteUrl("/web-design/berkshire") },
          { name: t.name, url: siteUrl(path) },
        ])}
      />
      <JsonLd id="ld-faq" data={faqLd(t.faqs)} />
      <LocalView key={t.slug} slug={t.slug} />
    </>
  );
}
