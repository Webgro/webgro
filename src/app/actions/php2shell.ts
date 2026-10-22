"use server";

/**
 * "Ask us to fix it" requests from the PHP2Shell checker. Same protection as
 * the contact form (honeypot, then Turnstile), then an email to the team with
 * the check result attached, and a short confirmation to the sender.
 */

import { escapeHtml, sendCustomerEmail, sendTeamEmail, verifyTurnstile } from "@/lib/form-guard";

export type FixRequestResult = { ok: true } | { ok: false; error: string };

export type FixRequestPayload = {
  name: string;
  email: string;
  phone?: string;
  site: string;
  /** The checker's verdict and what it found, so we start with the facts. */
  verdict?: string;
  phpVersion?: string;
  platform?: string;
  message?: string;
  /** Honeypot: must be empty. */
  company?: string;
  turnstileToken?: string;
};

const VERDICT_LABEL: Record<string, string> = {
  vulnerable: "Vulnerable (old version showing)",
  "end-of-life": "Vulnerable (PHP 8.1 or older)",
  patched: "Looks patched",
  "php-unknown": "Uses PHP, version hidden",
  "no-php": "No sign of PHP",
  platform: "Hosted platform",
  blocked: "Firewall blocked the check",
  unreachable: "Couldn't reach the site",
  manual: "Version typed in by visitor",
};

/** One line, no control characters, so nothing can sneak into an email header. */
const oneLine = (s: string | undefined) => (s ?? "").replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, 300);

export async function requestPhp2ShellFix(p: FixRequestPayload): Promise<FixRequestResult> {
  if (p.company && p.company.trim() !== "") return { ok: true };

  const name = oneLine(p.name);
  const email = oneLine(p.email);
  const site = oneLine(p.site);
  if (!name || !site || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: "Please fill in your name, email address and website." };
  }

  if (!(await verifyTurnstile(p.turnstileToken))) {
    return {
      ok: false,
      error: "We couldn't verify you're a human. Refresh the page and try again, or email hello@webgro.co.uk directly.",
    };
  }

  const phone = oneLine(p.phone);
  const verdict = VERDICT_LABEL[p.verdict ?? ""] ?? "Not checked";
  const phpVersion = oneLine(p.phpVersion);
  const platform = oneLine(p.platform);
  const message = (p.message ?? "").slice(0, 4000).trim();

  const rows: Array<[string, string]> = [
    ["Website", site],
    ["Check result", verdict],
    ...(phpVersion ? [["PHP version", phpVersion] as [string, string]] : []),
    ...(platform ? [["Platform", platform] as [string, string]] : []),
    ["Email", email],
    ...(phone ? [["Phone", phone] as [string, string]] : []),
  ];

  const text = [
    "PHP2Shell fix request from webgro.co.uk/php2shell-checker",
    "",
    `Name:         ${name}`,
    ...rows.map(([k, v]) => `${(k + ":").padEnd(14)}${v}`),
    "",
    "Message:",
    message || "(none)",
  ].join("\n");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #0D1117;">
      <div style="border-left: 3px solid #2D8DFF; padding-left: 16px; margin-bottom: 24px;">
        <div style="font-family: ui-monospace, SFMono-Regular, monospace; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #6B7A99;">PHP2Shell fix request</div>
        <h1 style="margin: 8px 0 0; font-size: 24px; font-weight: 700;">${escapeHtml(name)}</h1>
      </div>
      <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
        ${rows
          .map(([k, v]) => `<tr><td style="padding: 6px 0; color: #6B7A99; width: 120px;">${k}</td><td style="padding: 6px 0;">${escapeHtml(v)}</td></tr>`)
          .join("")}
      </table>
      ${message ? `<div style="margin-top: 20px; padding: 16px; background: #F4F6FB; border-radius: 8px; line-height: 1.6;">${escapeHtml(message).replace(/\n/g, "<br>")}</div>` : ""}
    </div>
  `.trim();

  const sent = await sendTeamEmail({
    fromName: "Webgro PHP2Shell",
    replyTo: email,
    subject: `PHP2Shell fix request · ${site} · ${verdict}`,
    text,
    html,
    logTag: "[php2shell]",
  });
  if (!sent.ok) return sent;

  const first = name.split(/\s+/)[0];
  await sendCustomerEmail({
    fromName: "Webgro",
    to: email,
    subject: "Your PHP2Shell fix request",
    text: [
      `Hi ${first},`,
      "",
      `Thanks for asking us to look at ${site}. We'll check which PHP version your server is running and get back to you within one working day with what needs doing.`,
      "",
      "If it's urgent, call us on 01344 231 119.",
      "",
      "Webgro",
      "hello@webgro.co.uk",
    ].join("\n"),
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #0D1117; line-height: 1.6; font-size: 15px;">
        <p>Hi ${escapeHtml(first)},</p>
        <p>Thanks for asking us to look at ${escapeHtml(site)}. We'll check which PHP version your server is running and get back to you within one working day with what needs doing.</p>
        <p>If it's urgent, call us on <a href="tel:+441344231119" style="color: #2D8DFF;">01344 231 119</a>.</p>
        <p>Webgro<br><a href="mailto:hello@webgro.co.uk" style="color: #2D8DFF;">hello@webgro.co.uk</a></p>
      </div>
    `.trim(),
    logTag: "[php2shell]",
  });

  return { ok: true };
}
