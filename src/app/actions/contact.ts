"use server";

/**
 * Contact form submission handler.
 *
 * Runs as a Next.js Server Action so the form can POST directly without
 * a dedicated API route. On every submission we:
 *   1. Short-circuit on honeypot (silent success, no email sent).
 *   2. Verify the Turnstile token against Cloudflare's siteverify endpoint.
 *   3. Validate the required fields.
 *   4. Send a transactional email via Resend to CONTACT_TO_EMAIL.
 *
 * The function is defensive about missing env vars: if RESEND_API_KEY or
 * Turnstile keys aren't set yet (e.g. local dev without credentials), the
 * action returns a clear error rather than crashing the route. That keeps
 * the site shippable while the real keys are being provisioned.
 */

import { escapeHtml, sendTeamEmail, verifyTurnstile } from "@/lib/form-guard";

export type ContactResult =
  | { ok: true }
  | { ok: false; error: string };

export type ContactPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  service?: string;
  budget?: string;
  message?: string;
  /** Honeypot: must be empty. Named innocuously so bots auto-fill it. */
  website?: string;
  /** Cloudflare Turnstile response token from the client widget. */
  turnstileToken?: string;
};

/** Compose the email body as plain-text and HTML. Plain-text keeps it
 *  readable in terminal-style mail clients; HTML gives a nicer layout
 *  when rendered. */
function buildEmail(p: ContactPayload) {
  const lines = [
    `New contact from webgro.co.uk`,
    ``,
    `Name:     ${p.firstName} ${p.lastName}`,
    `Email:    ${p.email}`,
    p.phone ? `Phone:    ${p.phone}` : null,
    p.service ? `Service:  ${p.service}` : null,
    p.budget ? `Budget:   ${p.budget}` : null,
    ``,
    `Message:`,
    p.message ?? "(empty)",
  ].filter(Boolean);

  const text = lines.join("\n");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #0D1117;">
      <div style="border-left: 3px solid #2D8DFF; padding-left: 16px; margin-bottom: 24px;">
        <div style="font-family: ui-monospace, SFMono-Regular, monospace; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #6B7A99;">New contact · webgro.co.uk</div>
        <h1 style="margin: 8px 0 0; font-size: 24px; font-weight: 700;">${escapeHtml(p.firstName)} ${escapeHtml(p.lastName)}</h1>
      </div>
      <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
        <tr><td style="padding: 6px 0; color: #6B7A99; width: 100px;">Email</td><td style="padding: 6px 0;"><a href="mailto:${escapeHtml(p.email)}" style="color: #2D8DFF;">${escapeHtml(p.email)}</a></td></tr>
        ${p.phone ? `<tr><td style="padding: 6px 0; color: #6B7A99;">Phone</td><td style="padding: 6px 0;">${escapeHtml(p.phone)}</td></tr>` : ""}
        ${p.service ? `<tr><td style="padding: 6px 0; color: #6B7A99;">Service</td><td style="padding: 6px 0;">${escapeHtml(p.service)}</td></tr>` : ""}
        ${p.budget ? `<tr><td style="padding: 6px 0; color: #6B7A99;">Budget</td><td style="padding: 6px 0;">${escapeHtml(p.budget)}</td></tr>` : ""}
      </table>
      ${
        p.message
          ? `<div style="margin-top: 20px; padding: 16px; background: #F4F6FB; border-radius: 8px; line-height: 1.6;">${escapeHtml(p.message).replace(/\n/g, "<br>")}</div>`
          : ""
      }
      <div style="margin-top: 32px; font-family: ui-monospace, monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #9AA6BC;">Sent via webgro.co.uk contact form</div>
    </div>
  `.trim();

  return { text, html };
}

export async function submitContact(
  payload: ContactPayload,
): Promise<ContactResult> {
  // 1. Honeypot: bots fill every field; real users don't fill the hidden one.
  // We silently "succeed" so the bot doesn't retry with the value cleared.
  if (payload.website && payload.website.trim() !== "") {
    return { ok: true };
  }

  // 2. Required field sanity check (defence-in-depth; the browser already
  //    checks these via `required`).
  if (!payload.firstName?.trim() || !payload.lastName?.trim() || !payload.email?.trim()) {
    return { ok: false, error: "Please fill in your name and email." };
  }

  // 3. Turnstile
  const verified = await verifyTurnstile(payload.turnstileToken);
  if (!verified) {
    return {
      ok: false,
      error:
        "We couldn't verify you're a human. Refresh the page and try again, or email hello@webgro.co.uk directly.",
    };
  }

  // 4. Send via Resend (shared with the guided enquiry in src/lib/form-guard.ts)
  const { text, html } = buildEmail(payload);
  const subject = `New brief · ${payload.firstName} ${payload.lastName}${payload.service ? ` · ${payload.service}` : ""}`;
  return sendTeamEmail({
    fromName: "Webgro Contact",
    replyTo: payload.email,
    subject,
    text,
    html,
    logTag: "[contact]",
  });
}
