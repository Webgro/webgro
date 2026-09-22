/**
 * Newsletter signups (Webgro news, new releases and articles from The Gro).
 * Shared by the footer signup action (src/app/actions/newsletter.ts) and by
 * the two form route handlers, which subscribe the address when someone ticks
 * the opt-in box. Server side only: it uses the private Klaviyo key.
 *
 * Subscribes with explicit email marketing consent, so Klaviyo sends its own
 * double opt-in email if the list is set up that way.
 *
 * Needs KLAVIYO_PRIVATE_KEY (a private API key with the "Subscriptions" and
 * "Lists" write scopes) and KLAVIYO_NEWSLETTER_LIST_ID. Until both are set
 * nothing is sent anywhere and the call returns a clear error.
 */

export type NewsletterResult = { ok: true } | { ok: false; error: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Where the signup came from, recorded against the profile in Klaviyo. */
export const NEWSLETTER_SOURCE = {
  footer: "Website newsletter form",
  enquiry: "Website enquiry form",
  charity: "Charity website application",
} as const;

export const newsletterConfigured = () =>
  Boolean(process.env.KLAVIYO_PRIVATE_KEY && process.env.KLAVIYO_NEWSLETTER_LIST_ID);

/** Adds one address to the Klaviyo newsletter list. */
export async function subscribeEmail(
  rawEmail: string,
  source: string = NEWSLETTER_SOURCE.footer,
): Promise<NewsletterResult> {
  const email = (rawEmail || "").trim().toLowerCase();
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
          custom_source: source,
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
    // Klaviyo is not worth holding a form submission open for.
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);

  if (!res || !res.ok) {
    if (res) console.error("Klaviyo newsletter signup failed", res.status);
    return { ok: false, error: "Something went wrong. Please try again, or email hello@webgro.co.uk." };
  }
  return { ok: true };
}

/**
 * Subscribes the address a form was sent from, when the person ticked the
 * opt-in box. A Klaviyo failure must never fail an enquiry or an application,
 * so every error is caught and logged and nothing is thrown.
 */
export async function subscribeFormOptIn(opts: {
  optIn: boolean;
  email: string;
  source: string;
  /** Prefix for server logs, for example "[enquiry]". */
  logTag: string;
}): Promise<void> {
  if (!opts.optIn) return;
  try {
    const result = await subscribeEmail(opts.email, opts.source);
    if (!result.ok) console.error(`${opts.logTag} newsletter opt-in was not subscribed:`, result.error);
  } catch (err) {
    console.error(`${opts.logTag} newsletter opt-in failed:`, err);
  }
}
