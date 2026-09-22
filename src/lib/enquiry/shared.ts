/**
 * Types, limits and fixed questions for the guided enquiry. Imported by the
 * browser flow and by the route handlers, so nothing here may touch secrets.
 *
 * The flow is stateless. The browser holds the list of steps and posts all
 * of them each time. The server checks every step against what it could have
 * issued (fixed and fallback questions by id, AI questions by signature)
 * before any of it reaches the model or the email.
 */

export type InputType = "text" | "choice" | "yesno";

/** A question as the server issues it. */
export type EnquiryQuestion = {
  id: string;
  question: string;
  inputType: InputType;
  options?: string[];
  hint?: string;
  /** Chips can be picked together, as on the first question. */
  multi?: boolean;
  /** Fixed questions can't be skipped. */
  required?: boolean;
  /** Signature the server adds to AI questions so it can trust them when they come back. */
  sig?: string;
};

/** What the browser posts back for each answered question. */
export type EnquiryStepIn = Pick<EnquiryQuestion, "id" | "question" | "inputType" | "options" | "hint" | "sig"> & {
  answer: string;
};

export type NextResponse =
  | { done: true }
  | { done: false; step: EnquiryQuestion };

export type EnquiryContact = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
};

export type SubmitBody = {
  steps: EnquiryStepIn[];
  contact: EnquiryContact;
  agreed: boolean;
  /** Newsletter opt-in. Off unless the person ticked the box. */
  newsletter?: boolean;
  /** Honeypot. Must be empty. */
  website?: string;
  turnstileToken?: string;
};

export const LIMITS = {
  answer: 2000,
  question: 300,
  hint: 300,
  option: 80,
  /** Most options a question may carry. The service question has 11 chips. */
  options: 14,
  /** Follow-up questions after the two fixed ones. */
  followUps: 5,
  /** The two fixed steps plus the follow-ups. */
  steps: 7,
  name: 120,
  email: 200,
  phone: 40,
  company: 160,
} as const;

/** Services as chips on the first question, matching the price list in ./ai.ts. */
export const SERVICE_OPTIONS = [
  "Shopify website",
  "WordPress website",
  "Website care plan",
  "Consultancy",
  "Automation and AI",
  "SEO",
  "Email marketing",
  "PPC",
  "Social media",
  "Design",
  "Not sure yet",
] as const;

export const SERVICE_QUESTION: EnquiryQuestion = {
  id: "service",
  question: "What do you need help with?",
  inputType: "choice",
  options: [...SERVICE_OPTIONS],
  hint: "Choose any that apply, or describe it in your own words.",
  multi: true,
  required: true,
};

export const PROJECT_QUESTION: EnquiryQuestion = {
  id: "project",
  question: "Tell us about the project.",
  inputType: "text",
  hint: "A few lines is enough. What the business does, and what you'd like to change or build.",
  required: true,
};

export const FIXED_QUESTIONS = [SERVICE_QUESTION, PROJECT_QUESTION] as const;

/** Answer text built from the chips picked and anything typed, the same way WebFixed does it. */
export function composeAnswer(picked: string[], text: string): string {
  const typed = text.trim();
  const chips = picked.join(", ");
  if (chips && typed) return `${chips}. ${typed}`;
  return chips || typed;
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
