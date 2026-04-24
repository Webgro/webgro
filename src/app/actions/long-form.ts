"use server";

/**
 * Server action for the three link-only brief forms:
 *   /onboarding, /forms/ecommerce-brief, /forms/wordpress-brief.
 *
 * Same pipeline as the /contact form — honeypot short-circuit,
 * Turnstile verify, Resend send — but the payload is a flat list of
 * (section, label, value) triples rather than a fixed schema. That
 * lets the three forms share one handler despite wildly different
 * question sets.
 *
 * The email is rendered in full here (not in the template file) so a
 * change to question wording on the client doesn't require redeploying
 * anything server-side.
 */

import { Resend } from "resend";

export type LongFormField = {
  section: string;
  label: string;
  /** Always a string by the time it reaches the server — the client
   *  flattens arrays to comma-joined strings and booleans to Yes/No. */
  value: string;
};

export type LongFormPayload = {
  formType: "onboarding" | "ecommerce-brief" | "wordpress-brief";
  /** Client / company name — used in the email subject. */
  clientName: string;
  /** Reply-to address for the email — so hitting "Reply" goes to the
   *  person who filled the form, not back to ourselves. */
  replyTo?: string;
  fields: LongFormField[];
  website?: string; // honeypot
  turnstileToken?: string;
};

export type LongFormResult =
  | { ok: true }
  | { ok: false; error: string };

const FORM_TITLES: Record<LongFormPayload["formType"], string> = {
  onboarding: "Customer onboarding",
  "ecommerce-brief": "eCommerce website brief",
  "wordpress-brief": "WordPress website brief",
};

const TURNSTILE_VERIFY =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Build plain-text + HTML versions of the email, grouped by section. */
function buildEmail(payload: LongFormPayload) {
  const title = FORM_TITLES[payload.formType];

  // Group fields by section while preserving original order.
  const sections = new Map<string, LongFormField[]>();
  for (const f of payload.fields) {
    const list = sections.get(f.section) ?? [];
    list.push(f);
    sections.set(f.section, list);
  }

  // --- plain text ---
  const text: string[] = [];
  text.push(`${title} — ${payload.clientName}`);
  text.push("");
  for (const [section, fields] of sections) {
    text.push(`── ${section.toUpperCase()} ──`);
    for (const f of fields) {
      const v = f.value.trim() || "(blank)";
      // Split multi-line values nicely in plain-text mode
      if (v.includes("\n")) {
        text.push(`${f.label}:`);
        for (const line of v.split("\n")) text.push(`  ${line}`);
      } else {
        text.push(`${f.label}: ${v}`);
      }
    }
    text.push("");
  }

  // --- HTML ---
  const htmlSections = Array.from(sections.entries())
    .map(([section, fields]) => {
      const rows = fields
        .map((f) => {
          const v = f.value.trim();
          const displayValue = v
            ? escapeHtml(v).replace(/\n/g, "<br>")
            : '<span style="color:#9AA6BC;font-style:italic;">(blank)</span>';
          return `
            <tr>
              <td style="padding:8px 16px 8px 0;color:#6B7A99;font-size:12px;letter-spacing:0.04em;text-transform:uppercase;vertical-align:top;width:160px;">
                ${escapeHtml(f.label)}
              </td>
              <td style="padding:8px 0;color:#0D1117;font-size:14px;line-height:1.55;vertical-align:top;">
                ${displayValue}
              </td>
            </tr>`;
        })
        .join("");
      return `
        <div style="margin:32px 0 0;">
          <div style="border-left:3px solid #2D8DFF;padding-left:12px;margin-bottom:12px;">
            <div style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#6B7A99;">
              Section
            </div>
            <div style="font-weight:700;font-size:16px;color:#07080C;">
              ${escapeHtml(section)}
            </div>
          </div>
          <table style="border-collapse:collapse;width:100%;">
            ${rows}
          </table>
        </div>`;
    })
    .join("");

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:720px;margin:0 auto;padding:32px;color:#07080C;">
      <div style="border-bottom:2px solid #0D1117;padding-bottom:16px;margin-bottom:8px;">
        <div style="font-family:ui-monospace,monospace;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#6B7A99;">
          New submission · webgro.co.uk
        </div>
        <h1 style="margin:6px 0 0;font-size:26px;font-weight:800;letter-spacing:-0.01em;">
          ${escapeHtml(title)}
        </h1>
        <p style="margin:4px 0 0;font-size:14px;color:#525B6E;">
          From: <strong>${escapeHtml(payload.clientName)}</strong>
          ${
            payload.replyTo
              ? ` · <a href="mailto:${escapeHtml(payload.replyTo)}" style="color:#2D8DFF;">${escapeHtml(payload.replyTo)}</a>`
              : ""
          }
        </p>
      </div>
      ${htmlSections}
      <div style="margin-top:40px;padding-top:16px;border-top:1px solid #E6EAF2;font-family:ui-monospace,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#9AA6BC;">
        Sent via webgro.co.uk · ${new Date().toISOString()}
      </div>
    </div>
  `.trim();

  return { text: text.join("\n"), html, title };
}

export async function submitLongForm(
  payload: LongFormPayload,
): Promise<LongFormResult> {
  // 1. Honeypot
  if (payload.website && payload.website.trim() !== "") {
    return { ok: true };
  }

  // 2. Minimum data check
  if (!payload.clientName?.trim() || payload.fields.length === 0) {
    return { ok: false, error: "The form is missing required details." };
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

  // 4. Send via Resend
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "hello@webgro.co.uk";
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL ?? "hello@send.webgro.co.uk";

  if (!apiKey) {
    console.error(
      "[long-form] RESEND_API_KEY is not set — cannot deliver email.",
    );
    return {
      ok: false,
      error:
        "Delivery isn't configured on this server yet. Please email hello@webgro.co.uk directly.",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { text, html, title } = buildEmail(payload);
    const subject = `${title} · ${payload.clientName}`;

    const { error } = await resend.emails.send({
      from: `Webgro Forms <${fromEmail}>`,
      to: [toEmail],
      replyTo: payload.replyTo,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("[long-form] Resend error:", error);
      return {
        ok: false,
        error:
          "Something went wrong sending your brief. Please email hello@webgro.co.uk directly.",
      };
    }

    return { ok: true };
  } catch (err) {
    console.error("[long-form] Unexpected error:", err);
    return {
      ok: false,
      error:
        "Something went wrong. Please email hello@webgro.co.uk directly.",
    };
  }
}
