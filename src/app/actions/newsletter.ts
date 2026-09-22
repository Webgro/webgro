"use server";

/**
 * Newsletter signup (Webgro news, new releases and articles from The Gro) for the footer form.
 * The Klaviyo call itself lives in src/lib/newsletter.ts, so the two form
 * route handlers can subscribe an opt-in without importing a server action.
 */

import { NEWSLETTER_SOURCE, newsletterConfigured as configured, subscribeEmail } from "@/lib/newsletter";

export type NewsletterResult = { ok: true } | { ok: false; error: string };

export const newsletterConfigured = async () => configured();

export async function subscribeToNewsletter(form: { email: string; website?: string }): Promise<NewsletterResult> {
  // Honeypot: bots fill every field. Pretend it worked.
  if (form.website) return { ok: true };
  return subscribeEmail(form.email, NEWSLETTER_SOURCE.footer);
}
