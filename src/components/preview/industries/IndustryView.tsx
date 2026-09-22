"use client";

import { Closing } from "../Closing";
import { PreviewShell } from "../PreviewShell";
import { Faqs } from "../services/Faqs";
import { ApplyForm, ApplyHow } from "./CharityApply";
import { getIndustry, industries } from "./content";
import { Cases, IndustryHero, Needs, OtherIndustries, Services } from "./sections";
import "../services/services.css";
import "./industries.css";

/**
 * One template for every industry page: what these businesses need from a
 * website (each item tied to the project where we built it), the projects and
 * their results, the services and prices, questions, and how to start.
 * A page with an `apply` block (charities) swaps the needs list for how the
 * free website offer works, and puts the application form after the case study.
 */
export function IndustryView({ slug }: { slug: string }) {
  const industry = getIndustry(slug);
  if (!industry) return null;

  return (
    <PreviewShell initialTheme="paper">
      <IndustryHero industry={industry} />
      {industry.apply && <ApplyHow copy={industry.apply} />}
      {industry.needs && <Needs industry={{ ...industry, needs: industry.needs }} />}
      <Cases industry={industry} />
      {industry.apply && <ApplyForm copy={industry.apply} />}
      <Services industry={industry} />
      <Faqs faqs={industry.faqs} topic={industry.lower} />
      <OtherIndustries others={industries.filter((i) => i.slug !== industry.slug)} />
      <Closing />
    </PreviewShell>
  );
}
