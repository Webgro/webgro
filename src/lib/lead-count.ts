import { randomUUID } from "node:crypto";

const MEASUREMENT_ID = "G-5W34B106VM";

/**
 * Counts a sent form in GA4 from the server, because the browser's generate_lead
 * only fires for visitors who accept analytics cookies. It sends the form name
 * and the "How did you find us?" answer, with a random id each time, so nothing
 * identifies the person and no cookie is used. Does nothing until GA4_API_SECRET
 * is set, and a failure here never affects the enquiry.
 */
export async function countLead(form: string, heardFrom?: string) {
  const secret = process.env.GA4_API_SECRET;
  if (!secret) return;
  try {
    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${secret}`, {
      method: "POST",
      signal: AbortSignal.timeout(3000),
      body: JSON.stringify({
        client_id: randomUUID(),
        non_personalized_ads: true,
        events: [{ name: "lead_server", params: { form, ...(heardFrom ? { heard_from: heardFrom } : {}) } }],
      }),
    });
  } catch (err) {
    console.error("[lead-count]", err);
  }
}
