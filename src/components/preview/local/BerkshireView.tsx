"use client";

import Link from "next/link";
import { Closing } from "../Closing";
import { pv } from "../links";
import { PreviewShell } from "../PreviewShell";
import { Reviews } from "../Reviews";
import { Faqs } from "../services/Faqs";
import { berkshire, towns } from "./content";
import { LocalHero, Nearby, TravelSection, WorkCards } from "./sections";
import "../services/services.css";
import "../services/body/body.css";
import "./local.css";

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** The county hub: every town page, the Berkshire work, reviews and questions. */
export function BerkshireView() {
  return (
    <PreviewShell initialTheme="paper">
      <LocalHero
        {...berkshire.hero}
        focus="all"
        mapLabel="Map of east Berkshire showing our Bracknell office, with routes to Reading, Wokingham, Windsor and Maidenhead."
      />
      <TravelSection heading={berkshire.towns.heading} body={[berkshire.towns.body]}>
        <div className="pv-local-hub-list">
          {towns.map((t) => (
            <Link href={pv(`/web-design/${t.slug}`)} className="pv-local-near-row" key={t.slug} data-cursor>
              <span className="pv-local-near-rule" aria-hidden="true" />
              <span className="pv-local-near-mask pv-local-near-mask--name"><span>{t.name}</span></span>
              <span className="pv-local-near-mask pv-local-near-mask--sub"><span>{t.hubLine}</span></span>
              <Arrow />
            </Link>
          ))}
        </div>
      </TravelSection>
      <WorkCards {...berkshire.work} theme="paper" />
      <Reviews limit={3} theme="ink" />
      <Faqs faqs={berkshire.faqs} topic="web design in Berkshire" />
      <Nearby areas={false} />
      <Closing />
    </PreviewShell>
  );
}
