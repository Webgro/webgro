"use client";

import { Closing } from "../Closing";
import { PreviewShell } from "../PreviewShell";
import { Faqs } from "../services/Faqs";
import "../services/services.css";
import { Compare } from "./Compare";
import { careFaqs } from "./content";
import { Plans } from "./Plans";
import { CareForYou, CareHero, CareSteps } from "./sections";
import "./care.css";

/**
 * Care plans. The page answers, in order: what is it, what does each plan cost
 * and include, how do they compare line by line, what happens each month, is
 * it for my site, and the usual questions. The hero, FAQs and closing reuse
 * the service pages' building blocks.
 */
export function CarePlansView() {
  return (
    <PreviewShell initialTheme="paper">
      <CareHero />
      <Plans />
      <Compare />
      <CareSteps />
      <CareForYou />
      <Faqs faqs={careFaqs} topic="care plans" />
      <Closing />
    </PreviewShell>
  );
}
