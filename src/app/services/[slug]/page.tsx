import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ServiceView } from "@/components/ServiceView";
import { services, getServiceBySlug } from "@/content/services";
import { caseStudies, type CaseStudy } from "@/content/work";
import { JsonLd, serviceLd, breadcrumbsLd } from "@/components/JsonLd";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const s = getServiceBySlug(slug);
  if (!s) return { title: "Service not found" };
  return {
    title: `${s.name} · Webgro Studio`,
    description: s.summary,
  };
}

/** Pick the case studies that relate to this service. Matches either
 *  by category tag or by service-string keyword. Preserves the order
 *  from the caseStudies array so featured work stays at the top. */
function relatedCasesFor(slug: string): CaseStudy[] {
  const service = getServiceBySlug(slug);
  if (!service) return [];
  const matchesCategory = (c: CaseStudy) =>
    service.relatedCategories?.some((cat) => c.categories.includes(cat)) ?? false;
  const matchesKeyword = (c: CaseStudy) =>
    service.relatedKeyword
      ? c.services.some((s) => service.relatedKeyword!.test(s))
      : false;
  return caseStudies.filter((c) => matchesCategory(c) && matchesKeyword(c));
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  const relatedCases = relatedCasesFor(slug);

  // RegExp and Category[] are server-only (not serialisable across the
  // client boundary). Drop them before handing the object to the client.
  const stripServerOnly = <T extends { relatedKeyword?: RegExp; relatedCategories?: unknown }>(s: T) => {
    const { relatedKeyword: _rk, relatedCategories: _rc, ...rest } = s;
    void _rk;
    void _rc;
    return rest;
  };

  const clientService = stripServerOnly(service);
  // "More Ways To Gro", show three other services, starting from the
  // next one in the canonical order so pairings feel intentional.
  const idx = services.findIndex((s) => s.slug === slug);
  const rotated = [...services.slice(idx + 1), ...services.slice(0, idx)];
  const more = rotated.slice(0, 3).map(stripServerOnly);

  return (
    <>
      <JsonLd
        id={`ld-service-${slug}`}
        data={serviceLd({
          slug: service.slug,
          name: service.name,
          summary: service.summary,
        })}
      />
      <JsonLd
        id={`ld-breadcrumb-service-${slug}`}
        data={breadcrumbsLd([
          { name: "Home", url: "https://webgro.co.uk" },
          { name: "Services", url: "https://webgro.co.uk/services" },
          { name: service.name, url: `https://webgro.co.uk/services/${slug}` },
        ])}
      />
      <Nav />
      <main className="flex-1">
        <ServiceView service={clientService} relatedCases={relatedCases} more={more} />
      </main>
      <Footer />
    </>
  );
}
