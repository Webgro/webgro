/**
 * Copy for the contact page concept. Same facts as src/content/contact.ts and
 * the live ContactView / ContactForm, reworded into the concept's voice.
 *
 * The service and budget option strings are sent in the enquiry email, so they
 * match the live form character for character.
 */

export const serviceOptions = [
  "Websites",
  "Consultancy",
  "Automation & AI",
  "SEO",
  "Marketing",
  "Design",
  "Something else",
] as const;

export const budgetOptions = ["£1–5k", "£5–10k", "£10–25k", "£25k+", "Retainer", "Not sure yet"] as const;

export const EMAIL = "hello@webgro.co.uk";
export const EMAIL_HREF = "mailto:hello@webgro.co.uk";
export const PHONE = "+44 (0) 1344 231 119";
export const PHONE_SHORT = "01344 231 119";
export const PHONE_HREF = "tel:+441344231119";
export const ADDRESS = "12 Longshot Lane, Bracknell, RG12 1RL";
export const MAP_HREF = "https://maps.google.com/?q=12+Longshot+Lane+Bracknell+RG12+1RL";

export const steps = [
  {
    node: "Your brief",
    when: "First",
    heading: "You send us a brief.",
    body: "Use the form, email us or call. A few lines on what you want built or fixed is enough, and it doesn't need to be fully scoped.",
  },
  {
    node: "Our reply",
    when: "Within one working day",
    heading: "We reply, usually with a couple of questions.",
    body: "We'll also offer you a time for a free 30-minute discovery call.",
  },
  {
    node: "The proposal",
    when: "Within three working days",
    heading: "You get a written proposal.",
    body: "It covers scope, timeline and price, and sets out any trade-offs.",
  },
  {
    node: "Kickoff",
    when: "When you're ready",
    heading: "We get started.",
    body: "A 50% deposit starts the project, and discovery begins within a week. We don't use lock-in retainers or add surprise line items.",
  },
];

export const proposalRows = ["Scope", "Timeline", "Price"];

export const directLines = [
  {
    kind: "phone",
    label: "Phone",
    value: PHONE,
    href: PHONE_HREF,
    meta: "Monday to Friday, 9 to 5.30",
    action: "Call us",
    external: false,
  },
  {
    kind: "visit",
    label: "Visit",
    value: ADDRESS,
    href: MAP_HREF,
    meta: "Please book a studio visit in advance",
    action: "Open in Maps",
    external: true,
  },
];
