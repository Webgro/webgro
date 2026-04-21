import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CaseStudyView } from "@/components/CaseStudyView";
import { caseStudies, getCaseBySlug, getNextCase } from "@/content/work";
import { JsonLd, caseStudyLd, breadcrumbsLd } from "@/components/JsonLd";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) return { title: "Case not found" };
  return {
    title: `${c.client} · Webgro Studio`,
    description: c.excerpt.replace(/^\[\s*Replace:\s*/i, "").replace(/\s*\]$/, ""),
  };
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const caseStudy = getCaseBySlug(slug);
  if (!caseStudy) notFound();
  const next = getNextCase(slug);
  return (
    <>
      <JsonLd
        id={`ld-case-${slug}`}
        data={caseStudyLd({
          slug: caseStudy.slug,
          client: caseStudy.client,
          excerpt: caseStudy.excerpt,
          heroImage: caseStudy.heroImage,
          year: caseStudy.year,
        })}
      />
      <JsonLd
        id={`ld-breadcrumb-case-${slug}`}
        data={breadcrumbsLd([
          { name: "Home", url: "https://webgro.co.uk" },
          { name: "Work", url: "https://webgro.co.uk/work" },
          { name: caseStudy.client, url: `https://webgro.co.uk/work/${slug}` },
        ])}
      />
      <Nav />
      <main className="flex-1">
        <CaseStudyView caseStudy={caseStudy} next={next} />
      </main>
      <Footer />
    </>
  );
}
