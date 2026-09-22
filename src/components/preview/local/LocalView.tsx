"use client";

import { Closing } from "../Closing";
import { PreviewShell } from "../PreviewShell";
import { Reviews } from "../Reviews";
import { Faqs } from "../services/Faqs";
import { getTown } from "./content";
import { Business, LocalHero, Nearby, TravelSection, WorkCards } from "./sections";
import "../services/services.css";
import "../services/body/body.css";
import "./local.css";

/**
 * One template for every town page. The order follows what a local visitor
 * wants to know: who you are and where, how far away you are and how meetings
 * work, whether you understand businesses like theirs, what you've built for
 * them, and what people usually ask.
 */
export function LocalView({ slug }: { slug: string }) {
  const town = getTown(slug);
  if (!town) return null;
  const home = town.slug === "bracknell";

  return (
    <PreviewShell initialTheme="paper">
      <LocalHero
        {...town.hero}
        crumb={town.name}
        focus={town.slug}
        mapLabel={
          home
            ? "Map of east Berkshire showing our Bracknell office, with routes to Reading, Wokingham, Windsor and Maidenhead."
            : `Map of east Berkshire showing the route from our Bracknell office to ${town.name}, ${town.drive.toLowerCase()} by car.`
        }
      />
      <TravelSection heading={town.travel.heading} body={town.travel.body} />
      <Business {...town.business} />
      <WorkCards {...town.work} theme="ink" review={town.review} />
      {home && <Reviews limit={3} theme="paper" />}
      <Faqs faqs={town.faqs} topic={`web design in ${town.name}`} />
      <Nearby current={town.slug} />
      <Closing />
    </PreviewShell>
  );
}
