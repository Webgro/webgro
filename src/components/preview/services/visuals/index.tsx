"use client";

import type { PvService } from "../content";
import { EmailVisual } from "./EmailVisual";
import { LoopVisual } from "./LoopVisual";
import { MockupVisual } from "./MockupVisual";
import { PpcVisual } from "./PpcVisual";
import { SeoVisual } from "./SeoVisual";
import { SocialVisual } from "./SocialVisual";
import { SpecimenVisual } from "./SpecimenVisual";
import { WebsitesVisual } from "./WebsitesVisual";

/** The picture under each service's headline. */
export function HeroVisual({ service }: { service: PvService }) {
  switch (service.visual) {
    case "websites":
      return <WebsitesVisual />;
    case "consultancy":
    case "automation": {
      const m = service.mockups?.[0];
      return m ? <MockupVisual name={m.name} /> : null;
    }
    case "seo":
      return <SeoVisual />;
    case "marketing":
      return <LoopVisual />;
    case "design":
      return <SpecimenVisual />;
    case "email":
      return <EmailVisual />;
    case "ppc":
      return <PpcVisual />;
    case "social":
      return <SocialVisual />;
    default:
      return null;
  }
}

/**
 * The same pictures in their finished state, with no motion of their own, for
 * the small cards beside the services index headline.
 */
export function MiniVisual({ service }: { service: PvService }) {
  switch (service.visual) {
    case "websites":
      return <WebsitesVisual still />;
    case "consultancy":
    case "automation": {
      const m = service.mockups?.[0];
      return m ? <MockupVisual name={m.name} still /> : null;
    }
    case "seo":
      return <SeoVisual still />;
    case "marketing":
      return <LoopVisual still />;
    case "design":
      return <SpecimenVisual still />;
    case "email":
      return <EmailVisual still />;
    case "ppc":
      return <PpcVisual still />;
    case "social":
      return <SocialVisual still />;
    default:
      return null;
  }
}
