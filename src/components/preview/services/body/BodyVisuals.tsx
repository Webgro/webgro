"use client";

import type { ReactNode } from "react";
import { MockupVisual } from "../visuals/MockupVisual";
import type { PvService } from "../content";
import {
  AiAnswer, AppBill, ConsistencyGrid, EmailShare, MarginReport, ReportGap, SpecialistHub, TechChecklist, TemplateGrid,
} from "./Drawings";
import { PhonePair, ShotDuo, ShotFan } from "./Frames";

/**
 * The pictures further down each service page, so that scrolling alternates
 * text and imagery. Everything is either the studio's own work (real
 * screenshots and the live product mockups) or a drawing that is labelled as
 * an illustration and shows no invented figures.
 *
 * `wide` pictures run the full width of their section. The others are small
 * enough to sit in the section's left-hand column beside the text.
 */
type Placed = { node: ReactNode; wide: boolean };

/** Beside "Who it's for". */
export function forYouVisual(service: PvService): Placed | null {
  switch (service.slug) {
    case "websites":
      return { node: <AppBill />, wide: false };
    case "consultancy":
      return {
        wide: true,
        node: (
          <ShotDuo
            desktop={{ src: "/work/gieves-and-hawkes/live-collection.jpg", alt: "Gieves & Hawkes collection page", url: "gievesandhawkes.com" }}
            phone={{ src: "/work/gieves-and-hawkes/mobile-2.jpg", alt: "Gieves & Hawkes on a phone", w: 700, h: 1517 }}
            caption="Gieves & Hawkes, where we provide ongoing strategy, platform guidance and hands-on delivery each week."
          />
        ),
      };
    case "automation-ai":
      return {
        wide: true,
        node: (
          <MockupVisual
            name="stack-integration-flow"
            caption="An automation that routes each Shopify order to Xero, Sheets, Klaviyo and Slack."
          />
        ),
      };
    case "seo":
      return { node: <AiAnswer />, wide: false };
    case "marketing":
      return {
        wide: true,
        node: (
          <ShotDuo
            desktop={{ src: "/work/fun-cases/live-collection.jpg", alt: "Fun Cases collection page", url: "funcases.com" }}
            phone={{ src: "/preview/cs-fun-cases-email.jpg", alt: "A Fun Cases campaign email on a phone", w: 600, h: 1214 }}
            caption="Fun Cases, where we've run email and paid ads since their rebrand."
          />
        ),
      };
    case "design":
      return { node: <ConsistencyGrid />, wide: false };
    case "email-marketing":
      return { node: <EmailShare />, wide: false };
    case "ppc":
      return { node: <ReportGap />, wide: false };
    case "social-media":
      return {
        wide: true,
        node: (
          <ShotDuo
            desktop={{ src: "/work/paragon-freight/live-services.jpg", alt: "Paragon Freight services page", url: "paragonfreight.com" }}
            phone={{ src: "/work/paragon-freight/live-mobile-home.jpg", alt: "Paragon Freight on a phone" }}
            caption="Paragon Freight. We manage their social channels alongside the website we redesigned."
          />
        ),
      };
    default:
      return null;
  }
}

/** In "What's included", between the description and the list. */
export function getVisual(service: PvService): ReactNode {
  switch (service.slug) {
    case "websites":
      return (
        <ShotFan
          shots={[
            { src: "/work/threadology/live-about.jpg", alt: "Threadology website", url: "threadology.co.uk" },
            { src: "/work/twisted-tailor/storefront.jpg", alt: "Twisted Tailor Shopify store", url: "twistedtailor.com" },
            { src: "/work/origin-architectural/live-collection.jpg", alt: "Origin Architectural Shopify store", url: "originarchitectural.co.uk" },
          ]}
          caption="Threadology on WordPress, Twisted Tailor on Shopify, and Origin Architectural, which we moved from WordPress to Shopify."
        />
      );
    case "consultancy":
      return <SpecialistHub />;
    case "seo":
      return <TechChecklist />;
    case "marketing":
      return <MarginReport />;
    case "design":
      return (
        <ShotFan
          shots={[
            { src: "/work/its-pouch/live-home.jpg", alt: "it's Pouch website", url: "itspouch.com" },
            { src: "/work/fun-cases/live-product.jpg", alt: "Fun Cases website after the rebrand", url: "funcases.com" },
            { src: "/preview/cs-fandp-agency-storefront.jpg", alt: "F&P Agency website", url: "fandpagency.com" },
          ]}
          caption="Design work for it's Pouch, Fun Cases and F&P Agency."
        />
      );
    case "email-marketing":
      return (
        <PhonePair
          shots={[
            { src: "/preview/cs-fun-cases-email.jpg", alt: "A Fun Cases campaign email on a phone", w: 600, h: 1214 },
            { src: "/work/fun-cases/live-mobile-product.jpg", alt: "The Fun Cases shop on a phone", w: 700, h: 1515 },
          ]}
          caption="A campaign email we designed for Fun Cases, and a product page from their shop."
        />
      );
    case "ppc":
      return (
        <ShotDuo
          desktop={{ src: "/work/fun-cases/live-product.jpg", alt: "Fun Cases product page", url: "funcases.com" }}
          phone={{ src: "/work/fun-cases/live-mobile-product.jpg", alt: "Fun Cases product page on a phone" }}
          caption="Fun Cases, where we manage paid search and paid social across Google and Meta."
        />
      );
    case "social-media":
      return <TemplateGrid />;
    default:
      return null;
  }
}
