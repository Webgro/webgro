import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudies, getCaseBySlug, getNextCase } from "@/content/work";
import { CaseStudyPreview } from "@/components/preview/case-study/CaseStudyPreview";
import { resolveAssets, resolveHero } from "@/components/preview/case-study/assets";
import { CASE_META, pageMeta, siteUrl } from "@/components/preview/seo";
import { JsonLd, breadcrumbsLd, caseStudyLd } from "@/components/JsonLd";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) return { title: "Case study not found | Webgro" };
  const m = CASE_META[slug] ?? { title: `${c.client} | Webgro Case Study`, description: c.excerpt };
  return pageMeta({ ...m, path: `/work/${slug}`, image: c.heroImage });
}

export default async function PreviewCasePage({ params }: Props) {
  const { slug } = await params;
  const caseStudy = getCaseBySlug(slug);
  if (!caseStudy) notFound();
  const next = getNextCase(slug);

  return (
    <>
    <JsonLd
      id="ld-case"
      data={caseStudyLd({
        slug: caseStudy.slug,
        client: caseStudy.client,
        excerpt: caseStudy.excerpt,
        heroImage: caseStudy.heroImage,
        year: caseStudy.year,
      })}
    />
    <JsonLd
      id="ld-breadcrumbs"
      data={breadcrumbsLd([
        { name: "Home", url: siteUrl("/") },
        { name: "Work", url: siteUrl("/work") },
        { name: caseStudy.client, url: siteUrl(`/work/${caseStudy.slug}`) },
      ])}
    />
    <CaseStudyPreview
      caseStudy={caseStudy}
      hero={resolveHero(caseStudy)}
      assets={resolveAssets(caseStudy)}
      next={
        next && next.slug !== caseStudy.slug
          ? {
              slug: next.slug,
              client: next.client,
              tag: next.tag,
              excerpt: next.excerpt,
              heroImageAlt: next.heroImageAlt,
              hero: resolveHero(next),
            }
          : null
      }
    />
    </>
  );
}
