import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd, breadcrumbsLd } from "@/components/JsonLd";
import { pageMeta, siteUrl } from "@/components/preview/seo";
import { BespokeToolView } from "@/components/preview/services/bespoke/BespokeToolView";
import { BESPOKE_PATH, bespokeTools, getBespokeTool } from "@/components/preview/services/bespoke/tools";

type Props = {
  params: Promise<{ tool: string }>;
};

export async function generateStaticParams() {
  return bespokeTools.map((t) => ({ tool: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool } = await params;
  const t = getBespokeTool(tool);
  if (!t) return { title: "Page not found | Webgro" };
  return pageMeta({ ...t.meta, path: `${BESPOKE_PATH}/${tool}` });
}

export default async function BespokeToolPage({ params }: Props) {
  const { tool } = await params;
  const t = getBespokeTool(tool);
  if (!t) notFound();
  // Keyed so that moving between tools remounts every scene cleanly.
  return (
    <>
      <JsonLd
        id="ld-breadcrumbs"
        data={breadcrumbsLd([
          { name: "Home", url: siteUrl("/") },
          { name: "Services", url: siteUrl("/services") },
          { name: "Bespoke Software", url: siteUrl(BESPOKE_PATH) },
          { name: t.name, url: siteUrl(`${BESPOKE_PATH}/${tool}`) },
        ])}
      />
      <BespokeToolView key={tool} slug={tool} />
    </>
  );
}
