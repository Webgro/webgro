import { Resend } from "resend";

/**
 * Spam protection and email delivery shared by the contact form
 * (src/app/actions/contact.ts) and the guided enquiry (src/app/api/enquiry).
 * Moved out of contact.ts unchanged so both forms behave the same way.
 */

export type SendResult = { ok: true } | { ok: false; error: string };

const TURNSTILE_VERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // In local dev without a Turnstile key, skip verification. In
    // production this would fail open, so guard with NODE_ENV so we
    // never skip for a real deploy.
    if (process.env.NODE_ENV !== "production") return true;
    return false;
  }
  if (!token) return false;

  try {
    const res = await fetch(TURNSTILE_VERIFY, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = (await res.json()) as { success: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type TeamEmail = {
  /** Display name on the from line, for example "Webgro Contact". */
  fromName: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
  /** Prefix for server logs, for example "[contact]". */
  logTag: string;
};

/** Sends a form submission to CONTACT_TO_EMAIL through Resend. */
export async function sendTeamEmail(mail: TeamEmail): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "hello@webgro.co.uk";
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "hello@webgro.co.uk";

  if (!apiKey) {
    // Credentials not set yet. Log server-side so the dev still sees the
    // submission, and tell the user clearly rather than silently swallowing.
    console.error(`${mail.logTag} RESEND_API_KEY is not set, so the form cannot deliver email.`);
    return {
      ok: false,
      error: "Email delivery isn't configured on this server yet. Please email hello@webgro.co.uk directly.",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: `${mail.fromName} <${fromEmail}>`,
      to: [toEmail],
      replyTo: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });

    if (error) {
      // Log the full object for ops visibility (lands in Vercel runtime logs).
      console.error(`${mail.logTag} Resend error:`, error);

      // Surface a more specific user-facing message where we safely can.
      // Resend error shapes vary by failure mode; we keep this conservative.
      const name = (error as { name?: string }).name ?? "";
      const message = (error as { message?: string }).message ?? "Unknown email delivery error.";

      // Only "safe" Resend errors get echoed to the visitor (no API keys,
      // no internal infrastructure names). Everything else falls through
      // to a generic message.
      const isSafeToShow =
        name === "validation_error" ||
        name === "domain_not_found" ||
        name === "missing_required_field" ||
        name === "invalid_from_address" ||
        name === "invalid_to_address" ||
        message.toLowerCase().includes("domain") ||
        message.toLowerCase().includes("from address") ||
        message.toLowerCase().includes("not verified");

      return {
        ok: false,
        error: isSafeToShow
          ? `Email provider rejected the send (${message}). Please email hello@webgro.co.uk directly.`
          : "Something went wrong sending your message. Please email hello@webgro.co.uk directly.",
      };
    }

    return { ok: true };
  } catch (err) {
    console.error(`${mail.logTag} Unexpected error:`, err);
    return { ok: false, error: "Something went wrong. Please email hello@webgro.co.uk directly." };
  }
}
