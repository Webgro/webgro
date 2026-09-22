"use server";

/**
 * Newsletter signup (Webgro news, releases and articles from The Gro). Subscribes the address to a Klaviyo list
 * with explicit email marketing consent, so Klaviyo sends its own double
 * opt-in email if the list is set up that way.
 *
 * Needs KLAVIYO_PRIVATE_KEY (a private API key with the "Subscriptions" and
 * "Lists" write scopes) and KLAVIYO_NEWSLETTER_LIST_ID. Until both are set the
 * action returns a clear error and nothing is sent anywhere.
 */

export type NewsletterResult = { ok: true } | { ok: false; error: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const newsletterConfigured = async () =>
  Boolean(process.env.KLAVIYO_PRIVATE_KEY && process.env.KLAVIYO_NEWSLETTER_LIST_ID);

export async function subscribeToNewsletter(form: { email: string; website?: string }): Promise<NewsletterResult> {
  // Honeypot: bots fill every field. Pretend it worked.
  if (form.website) return { ok: true };

  const email = (form.email || "").trim().toLowerCase();
  if (!EMAIL.test(email) || email.length > 254) return { ok: false, error: "Please enter a valid email address." };

  const key = process.env.KLAVIYO_PRIVATE_KEY;
  const list = process.env.KLAVIYO_NEWSLETTER_LIST_ID;
  if (!key || !list) return { ok: false, error: "Signups aren't open yet. Please try again soon." };

  const res = await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs", {
    method: "POST",
    headers: {
      Authorization: `Klaviyo-API-Key ${key}`,
      revision: "2024-10-15",
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "profile-subscription-bulk-create-job",
        attributes: {
          custom_source: "Website newsletter form",
          profiles: {
            data: [
              {
                type: "profile",
                attributes: { email, subscriptions: { email: { marketing: { consent: "SUBSCRIBED" } } } },
              },
            ],
          },
        },
        relationships: { list: { data: { type: "list", id: list } } },
      },
    }),
    cache: "no-store",
  }).catch(() => null);

  if (!res || !res.ok) {
    if (res) console.error("Klaviyo newsletter signup failed", res.status);
    return { ok: false, error: "Something went wrong. Please try again, or email hello@webgro.co.uk." };
  }
  return { ok: true };
}
