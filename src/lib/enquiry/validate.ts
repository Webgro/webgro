import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { fallbackById } from "./fallback";
import { FIXED_QUESTIONS, LIMITS, type EnquiryQuestion } from "./shared";

/**
 * Server-side checks for the steps the browser posts back. Nothing the
 * browser says about a question is trusted: fixed and fallback questions are
 * looked up by id, and AI questions must carry the signature the server gave
 * them when it issued them.
 */

const Id = z.string().min(1).max(40).regex(/^[a-z0-9:_-]+$/);
const Opt = z.string().trim().max(LIMITS.option);

const StepIn = z.object({
  id: Id,
  answer: z.string().max(LIMITS.answer),
  question: z.string().max(LIMITS.question).optional(),
  inputType: z.enum(["text", "choice", "yesno"]).optional(),
  options: z.array(Opt).max(LIMITS.options).optional(),
  hint: z.string().max(LIMITS.hint).optional(),
  sig: z.string().max(100).optional(),
});

export const StepsBody = z.object({
  steps: z.array(StepIn).min(FIXED_QUESTIONS.length).max(LIMITS.steps),
});

export const SubmitBody = StepsBody.extend({
  contact: z.object({
    name: z.string().trim().min(1).max(LIMITS.name),
    email: z.email().max(LIMITS.email),
    phone: z.string().trim().max(LIMITS.phone).optional(),
    company: z.string().trim().max(LIMITS.company).optional(),
  }),
  agreed: z.literal(true),
  website: z.string().max(500).optional(),
  turnstileToken: z.string().max(4000).optional(),
});

/** A step the server has checked, with the question text the server itself issued. */
export type TrustedStep = EnquiryQuestion & { answer: string; kind: "fixed" | "fallback" | "ai" };

// Signing key for AI questions. ENQUIRY_SIGNING_SECRET if set, otherwise a
// one-way derivation of the Anthropic key so it's stable across server
// instances. AI questions are only issued when the Anthropic key exists.
function signingKey(): string | null {
  const own = process.env.ENQUIRY_SIGNING_SECRET;
  if (own) return own;
  const api = process.env.ANTHROPIC_API_KEY;
  return api ? createHash("sha256").update(`webgro-enquiry-signing:${api}`).digest("hex") : null;
}

function payload(q: Pick<EnquiryQuestion, "id" | "question" | "inputType" | "options" | "hint">): string {
  return JSON.stringify([q.id, q.question, q.inputType, q.options ?? [], q.hint ?? ""]);
}

export function signQuestion(q: EnquiryQuestion): EnquiryQuestion {
  const key = signingKey();
  if (!key) throw new Error("No signing key");
  return { ...q, sig: createHmac("sha256", key).update(payload(q)).digest("base64url") };
}

function validSig(q: Pick<EnquiryQuestion, "id" | "question" | "inputType" | "options" | "hint">, sig: string | undefined): boolean {
  const key = signingKey();
  if (!key || !sig) return false;
  const want = Buffer.from(createHmac("sha256", key).update(payload(q)).digest("base64url"));
  const got = Buffer.from(sig);
  return want.length === got.length && timingSafeEqual(want, got);
}

export class StepError extends Error {}

/** Checks order, ids, signatures and the fixed answers, and returns the steps with server-side question text. */
export function trustSteps(steps: z.infer<typeof StepsBody>["steps"]): TrustedStep[] {
  const seen = new Set<string>();
  return steps.map((s, i) => {
    if (seen.has(s.id)) throw new StepError("A question appears twice.");
    seen.add(s.id);
    const answer = s.answer.trim();

    const fixed = FIXED_QUESTIONS[i];
    if (fixed) {
      if (s.id !== fixed.id) throw new StepError("The questions are out of order.");
      if (fixed.id === "service" && !answer) throw new StepError("Tell us what you need help with.");
      if (fixed.id === "project" && answer.length < 3) throw new StepError("Please tell us a little about the project.");
      return { ...fixed, answer, kind: "fixed" };
    }

    if (s.id.startsWith("fb:")) {
      const q = fallbackById(s.id);
      if (!q) throw new StepError("One of the questions wasn't recognised.");
      return { ...q, answer, kind: "fallback" };
    }

    if (/^ai:\d{1,2}$/.test(s.id)) {
      const q = {
        id: s.id,
        question: s.question ?? "",
        inputType: s.inputType ?? "text",
        ...(s.options?.length ? { options: s.options } : {}),
        ...(s.hint ? { hint: s.hint } : {}),
      };
      if (!q.question || !validSig(q, s.sig)) throw new StepError("One of the questions wasn't recognised.");
      return { ...q, answer, kind: "ai" };
    }

    throw new StepError("One of the questions wasn't recognised.");
  });
}

export const followUps = (steps: TrustedStep[]) => steps.slice(FIXED_QUESTIONS.length);
