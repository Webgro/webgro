import { nextQuestion } from "@/lib/enquiry/ai";
import { clientIp, rateLimited } from "@/lib/enquiry/rate-limit";
import type { NextResponse } from "@/lib/enquiry/shared";
import { StepError, StepsBody, trustSteps } from "@/lib/enquiry/validate";

/**
 * POST /api/enquiry/next
 * Body: { steps: [{ id, answer, question?, inputType?, options?, hint?, sig? }] }
 * Returns the next follow-up question, or { done: true } when it's time for
 * contact details. Stateless: the browser sends every step each time.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  // Each call can cost a model request, so one visitor gets a limited number.
  if (rateLimited(`next:${clientIp(req)}`, 40, 15 * 60_000)) {
    return json({ error: "You've sent a lot of answers in a short time. Please wait a few minutes, or email hello@webgro.co.uk." }, 429);
  }

  const parsed = StepsBody.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const tooLong = parsed.error.issues.some((i) => i.path.at(-1) === "answer" && i.code === "too_big");
    return json({ error: tooLong ? "Please keep each answer under 2,000 characters." : "Something in the form wasn't right. Please refresh the page and start again." }, 400);
  }

  let steps;
  try {
    steps = trustSteps(parsed.data.steps);
  } catch (err) {
    if (err instanceof StepError) return json({ error: err.message }, 400);
    throw err;
  }

  try {
    const next: NextResponse = await nextQuestion(steps);
    return json(next);
  } catch (err) {
    // If the model is unavailable, stop asking and move on to contact details.
    console.error("[enquiry] next question failed:", err instanceof Error ? err.message : "unknown error");
    return json({ done: true } satisfies NextResponse);
  }
}
