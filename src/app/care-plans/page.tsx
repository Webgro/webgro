import type { Metadata } from "next";
import { pageMeta, siteUrl } from "@/components/preview/seo";
import { JsonLd, breadcrumbsLd, faqLd } from "@/components/JsonLd";
import { CarePlansView } from "@/components/preview/care/CarePlansView";
import { CARE_META, CARE_PATH, careFaqs, carePlans } from "@/components/preview/care/content";

export const metadata: Metadata = pageMeta({ ...CARE_META, path: CARE_PATH });

/** A Service with one Offer per plan, each priced per calendar month. */
function carePlansLd() {
  const url = siteUrl(CARE_PATH);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: "Website care plans",
    serviceType: "Website maintenance and support",
    description: CARE_META.description,
    provider: { "@id": siteUrl("/#org") },
    areaServed: "GB",
    url,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Care plans",
      itemListElement: carePlans.map((p) => ({
        "@type": "Offer",
        "@id": `${url}#${p.id}`,
        name: `${p.name} care plan`,
        description: p.for,
        url: `${url}#plans`,
        price: p.price.toFixed(2),
        priceCurrency: "GBP",
        availability: "https://schema.org/InStock",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: p.price.toFixed(2),
          priceCurrency: "GBP",
          unitCode: "MON",
          unitText: "month",
          billingDuration: "P1M",
          referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
        },
      })),
    },
  };
}

export default function PreviewCarePlansPage() {
  return (
    <>
      <JsonLd id="ld-service" data={carePlansLd()} />
      <JsonLd
        id="ld-breadcrumbs"
        data={breadcrumbsLd([
          { name: "Home", url: siteUrl("/") },
          { name: "Services", url: siteUrl("/services") },
          { name: "Care plans", url: siteUrl(CARE_PATH) },
        ])}
      />
      <JsonLd id="ld-faq" data={faqLd(careFaqs)} />
      <CarePlansView />
    </>
  );
}
