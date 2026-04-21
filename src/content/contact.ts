import type { Accent } from "./work";

/** Small data model for the dedicated /contact page. The homepage
 *  ContactSection shares the same form component but keeps its own copy. */

export type ContactMethod = {
  kind: "email" | "phone" | "visit";
  label: string;
  value: string;
  href: string;
  meta: string;
  accent: Accent;
};

export type NextStep = {
  num: string;
  heading: string;
  body: string;
  accent: Accent;
};

export const contact = {
  hero: {
    eyebrow: "[ Contact ] Start here",
    heading: "Let's",
    headingAccent: "gro.",
    lead:
      "30 minutes, no decks, no pressure. Drop the brief below, email us directly, or come by the studio if you're local.",
  },

  methods: [
    {
      kind: "email",
      label: "Email",
      value: "hello@webgro.co.uk",
      href: "mailto:hello@webgro.co.uk",
      meta: "Reply within one working day",
      accent: "blue",
    },
    {
      kind: "phone",
      label: "Phone",
      value: "+44 (0) 1344 231 119",
      href: "tel:+441344231119",
      meta: "Mon to Fri, 9 to 5.30",
      accent: "violet",
    },
    {
      kind: "visit",
      label: "Visit",
      value: "12 Longshot Lane, Bracknell, RG12 1RL",
      href: "https://maps.google.com/?q=12+Longshot+Lane+Bracknell+RG12+1RL",
      meta: "Book a studio visit in advance",
      accent: "teal",
    },
  ] satisfies ContactMethod[],

  nextSteps: [
    {
      num: "01",
      heading: "You send the brief",
      body: "Form, email, or phone. A few lines on what you're trying to build, fix, or rethink. No need to have it fully scoped.",
      accent: "blue",
    },
    {
      num: "02",
      heading: "We reply within a working day",
      body: "Usually with a couple of questions and a slot for a 30-minute discovery call. Free, no pitch, no slide deck.",
      accent: "violet",
    },
    {
      num: "03",
      heading: "Written proposal, 3 working days",
      body: "Scope, timeline, price. Honest about trade-offs. If we're not the right fit we'll say so and point you somewhere that is.",
      accent: "teal",
    },
    {
      num: "04",
      heading: "Kickoff when you're ready",
      body: "50% deposit, discovery starts within a week. No lock-in retainer, no surprise line items.",
      accent: "blue",
    },
  ] satisfies NextStep[],

  closing: {
    heading: "Prefer to keep it short?",
    body: "A one-line email with the problem is enough to start. We'll take it from there.",
  },
};
