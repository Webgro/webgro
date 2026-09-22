import { SERVICE_OPTIONS, type EnquiryQuestion } from "./shared";

/**
 * Follow-up questions used when ANTHROPIC_API_KEY isn't set, so the whole
 * enquiry works without the model. Each set is picked from the services
 * chosen on the first question. Ids are "fb:<set>:<topic>" and the server
 * looks the text up by id, so the browser can't change what was asked.
 */

export type FallbackSet = "web" | "seo" | "marketing" | "consult" | "design" | "general";

const TIMELINE = ["As soon as possible", "In the next 3 months", "3 to 6 months", "No fixed date"];
const START = ["As soon as possible", "In the next month", "In the next 3 months", "No fixed date"];

type Draft = Omit<EnquiryQuestion, "id"> & { topic: string };

const site = (question = "What's your website address?"): Draft => ({
  topic: "site",
  question,
  inputType: "text",
  hint: "Skip this if you don't have a website yet.",
});

const SETS: Record<FallbackSet, Draft[]> = {
  web: [
    site("What's the address of your current website?"),
    {
      topic: "features",
      question: "Which features does the new site need?",
      inputType: "text",
      hint: "For example online payments, bookings, a trade login or product filters.",
    },
    { topic: "timeline", question: "When would you like the new site to go live?", inputType: "choice", options: TIMELINE },
    {
      topic: "budget",
      question: "Roughly what budget do you have in mind?",
      inputType: "choice",
      options: ["£4–8k", "£8–15k", "£15–25k", "£25k+", "Not sure yet"],
      hint: "Our WordPress builds usually cost £4,000 to £15,000, and Shopify rebuilds £5,000 to £25,000.",
    },
    {
      topic: "people",
      question: "Who else will be involved in choosing an agency?",
      inputType: "text",
      hint: "For example a business partner, a board or a marketing manager.",
    },
  ],
  seo: [
    site(),
    {
      topic: "goal",
      question: "What would you most like more of from search?",
      inputType: "choice",
      options: ["Enquiries", "Online sales", "Local customers", "Traffic we've lost"],
    },
    {
      topic: "history",
      question: "Have you had any SEO work done before?",
      inputType: "text",
      hint: "For example another agency, a freelancer or your own work.",
    },
    {
      topic: "budget",
      question: "Roughly what monthly budget do you have in mind?",
      inputType: "choice",
      options: ["£750–1,000 a month", "£1,000–2,000 a month", "£2,000+ a month", "Not sure yet"],
    },
    { topic: "timeline", question: "When would you like to start?", inputType: "choice", options: START },
  ],
  marketing: [
    site(),
    {
      topic: "tools",
      question: "Which marketing tools or ad platforms do you use now?",
      inputType: "text",
      hint: "For example Klaviyo, Mailchimp, Google Ads or Meta.",
    },
    {
      topic: "goal",
      question: "What's the main goal?",
      inputType: "choice",
      options: ["More online sales", "More enquiries", "A bigger audience", "Win back past customers"],
    },
    {
      topic: "budget",
      question: "Roughly what monthly budget do you have for our fees?",
      inputType: "choice",
      options: ["Under £1,000 a month", "£1,000–2,000 a month", "£2,000–5,000 a month", "£5,000+ a month", "Not sure yet"],
      hint: "Leave any ad spend out of this. We'll talk about that separately.",
    },
    { topic: "timeline", question: "When would you like to start?", inputType: "choice", options: START },
  ],
  consult: [
    {
      topic: "business",
      question: "What does the business do, and roughly how many people work in it?",
      inputType: "text",
    },
    {
      topic: "systems",
      question: "Which systems and tools does your team use day to day?",
      inputType: "text",
      hint: "For example Shopify, Xero, a CRM or spreadsheets.",
    },
    { topic: "goal", question: "What would a good result look like six months from now?", inputType: "text" },
    { topic: "timeline", question: "When would you like to start?", inputType: "choice", options: START },
    {
      topic: "budget",
      question: "Roughly what budget do you have in mind?",
      inputType: "choice",
      options: ["Under £2k", "£2–5k", "£5–15k", "£15k+", "Not sure yet"],
    },
  ],
  design: [
    {
      topic: "brand",
      question: "Do you have brand guidelines already?",
      inputType: "choice",
      options: ["Yes, full guidelines", "A logo only", "Starting from scratch"],
    },
    {
      topic: "examples",
      question: "Is there any design you like that we could look at?",
      inputType: "text",
      hint: "Links or names are fine.",
    },
    { topic: "timeline", question: "When do you need it?", inputType: "choice", options: TIMELINE },
    {
      topic: "budget",
      question: "Roughly what budget do you have in mind?",
      inputType: "choice",
      options: ["Under £1k", "£1–3k", "£3–8k", "£8k+", "Not sure yet"],
    },
  ],
  general: [
    site(),
    { topic: "business", question: "What does the business do, and who are your customers?", inputType: "text" },
    { topic: "goal", question: "What's the main thing you'd like to change or improve?", inputType: "text" },
    { topic: "timeline", question: "When would you like to get started?", inputType: "choice", options: START },
    {
      topic: "budget",
      question: "Roughly what budget do you have in mind?",
      inputType: "choice",
      options: ["Under £2k", "£2–5k", "£5–15k", "£15k+", "Not sure yet"],
    },
  ],
};

type Service = (typeof SERVICE_OPTIONS)[number];

const SET_FOR: Record<Service, FallbackSet> = {
  "Shopify website": "web",
  "WordPress website": "web",
  "Website care plan": "web",
  Consultancy: "consult",
  "Automation and AI": "consult",
  SEO: "seo",
  "Email marketing": "marketing",
  PPC: "marketing",
  "Social media": "marketing",
  Design: "design",
  "Not sure yet": "general",
};

/** The set for the first service chip mentioned in the answer, in the order the chips are listed. */
export function fallbackSetFor(serviceAnswer: string): FallbackSet {
  const hit = SERVICE_OPTIONS.find((s) => serviceAnswer.includes(s));
  return hit ? SET_FOR[hit] : "general";
}

export function fallbackQuestion(set: FallbackSet, index: number): EnquiryQuestion | null {
  const d = SETS[set][index];
  if (!d) return null;
  const { topic, ...rest } = d;
  return { id: `fb:${set}:${topic}`, ...rest };
}

/** Looks a fallback question up by the id the browser sent back. */
export function fallbackById(id: string): EnquiryQuestion | null {
  const [, set, topic] = id.split(":");
  const drafts = SETS[set as FallbackSet];
  const i = drafts ? drafts.findIndex((d) => d.topic === topic) : -1;
  return i < 0 ? null : fallbackQuestion(set as FallbackSet, i);
}
