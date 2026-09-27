"use client";

import { useEffect, useState } from "react";
import { Closing } from "../Closing";
import { PreviewShell } from "../PreviewShell";
import { Faqs } from "../services/Faqs";
import "../services/services.css";
import { Compare } from "./Compare";
import { careFaqs, carePlatforms, DEFAULT_PLATFORM, type CarePlatform } from "./content";
import { Plans } from "./Plans";
import { CareForYou, CareHero, CareSteps } from "./sections";
import "./care.css";

const STORE_KEY = "pv-care-platform";

/**
 * Care plans. The page answers, in order: what is it, what does each plan cost
 * and include, how do they compare line by line, what happens each month, is
 * it for my site, and the usual questions. The hero, FAQs and closing reuse
 * the service pages' building blocks.
 *
 * The platform choice lives here, so the switch above the cards drives both the
 * cards and the comparison table. WordPress renders on the server. A choice
 * saved earlier in the session is applied after mount, which keeps the first
 * paint identical to the server's.
 */
export function CarePlansView() {
  const [platform, setPlatform] = useState<CarePlatform>(DEFAULT_PLATFORM);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.sessionStorage.getItem(STORE_KEY);
    } catch {
      saved = null;
    }
    if (saved && saved !== platform && carePlatforms.some((p) => p.id === saved)) {
      // Deliberate: WordPress has to render on the server and through hydration,
      // so a choice saved earlier in the session can only be applied afterwards.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlatform(saved as CarePlatform);
    }
    // Runs once: this is the restore, not a sync.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function choose(next: CarePlatform) {
    setPlatform(next);
    try {
      window.sessionStorage.setItem(STORE_KEY, next);
    } catch {
      // Private browsing and blocked storage: the choice just doesn't persist.
    }
  }

  return (
    <PreviewShell initialTheme="paper">
      <CareHero />
      <Plans platform={platform} onPlatformChange={choose} />
      <Compare platform={platform} />
      <CareSteps />
      <CareForYou />
      <Faqs faqs={careFaqs} topic="care plans" />
      <Closing />
    </PreviewShell>
  );
}
