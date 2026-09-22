"use client";

import { Closing } from "../Closing";
import { PreviewShell } from "../PreviewShell";
import { BrushBandDefs } from "./BrushBand";
import { getAnyPvService } from "./content";
import { Faqs } from "./Faqs";
import { Process } from "./Process";
import { Branches, ForYou, Proof, ServiceHero, Start, WhatYouGet } from "./sections";
import "./services.css";
import "./body/body.css";

/**
 * One template for every service and sub-service. The order answers the
 * questions a visitor has, in the order they have them: is this for me, what
 * do I get, how does it work and how long does it take, what has it done for
 * someone like me, what do people usually ask, and how do I start.
 */
export function ServiceDetailView({ slug }: { slug: string }) {
  const service = getAnyPvService(slug);
  if (!service) return null;
  const hasFaqs = service.faqs.length > 0;

  return (
    <PreviewShell initialTheme="paper">
      <BrushBandDefs />
      <ServiceHero service={service} />
      <ForYou service={service} />
      {service.slug === "marketing" && <Branches />}
      <WhatYouGet service={service} />
      <Process process={service.process} />
      <Proof service={service} />
      {hasFaqs && <Faqs faqs={service.faqs} topic={service.lower} />}
      <Start service={service} theme={hasFaqs ? "ink" : "paper"} />
      <Closing />
    </PreviewShell>
  );
}
