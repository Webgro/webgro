import { escapeHtml } from "@/lib/form-guard";
import type { Brief } from "./ai";
import type { EnquiryContact } from "./shared";
import type { TrustedStep } from "./validate";

const TEAM_EMAIL = "hello@webgro.co.uk";
const TEAM_PHONE = "01344 231 119";
const TEAM_PHONE_HREF = "tel:+441344231119";

const row = (label: string, value: string) =>
  `<tr><td style="padding: 6px 12px 6px 0; color: #6B7A99; width: 110px; vertical-align: top;">${label}</td><td style="padding: 6px 0; vertical-align: top;">${value}</td></tr>`;

/** The team email for a guided enquiry: the internal brief first, then contact details, then every answer. */
export function buildEnquiryEmail(steps: TrustedStep[], contact: EnquiryContact, brief: Brief, newsletter = false) {
  const newsletterLine = newsletter ? "Opted in to the newsletter" : "Did not opt in to the newsletter";
  const priority = brief.priority.charAt(0).toUpperCase() + brief.priority.slice(1);
  const subject = `New enquiry · ${contact.name}${contact.company ? ` (${contact.company})` : ""} · ${brief.service.slice(0, 60)} · ${priority}`;

  const text = [
    "New guided enquiry from webgro.co.uk",
    "",
    "INTERNAL BRIEF (not shown to the customer)",
    `Service:   ${brief.service}`,
    `Priority:  ${priority}. ${brief.priorityReason}`,
    `Budget:    ${brief.budget}`,
    `Timeline:  ${brief.timeline}`,
    `Summary:   ${brief.summary}`,
    brief.missingInfo.length ? `Still to ask:\n${brief.missingInfo.map((m) => `  - ${m}`).join("\n")}` : null,
    brief.spam ? "Flagged as likely spam." : null,
    brief.source === "fallback" ? "(Brief written without AI.)" : null,
    "",
    "CONTACT",
    `Name:      ${contact.name}`,
    `Email:     ${contact.email}`,
    contact.phone ? `Phone:     ${contact.phone}` : null,
    contact.company ? `Company:   ${contact.company}` : null,
    `Newsletter: ${newsletterLine}`,
    "",
    "ANSWERS",
    ...steps.flatMap((s, i) => [`${i + 1}. ${s.question}`, `   ${s.answer || "(skipped)"}`, ""]),
  ]
    .filter((l) => l !== null)
    .join("\n");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; color: #0D1117;">
      <div style="border-left: 3px solid #2D8DFF; padding-left: 16px; margin-bottom: 24px;">
        <div style="font-family: ui-monospace, SFMono-Regular, monospace; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #6B7A99;">Guided enquiry · webgro.co.uk</div>
        <h1 style="margin: 8px 0 0; font-size: 24px; font-weight: 700;">${escapeHtml(contact.name)}${contact.company ? ` <span style="font-weight: 400; color: #6B7A99;">${escapeHtml(contact.company)}</span>` : ""}</h1>
      </div>

      <div style="padding: 16px 18px; background: #F4F6FB; border-radius: 8px; margin-bottom: 24px;">
        <div style="font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #6B7A99; margin-bottom: 8px;">Internal brief, not shown to the customer${brief.source === "fallback" ? " (written without AI)" : ""}</div>
        <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
          ${row("Service", escapeHtml(brief.service))}
          ${row("Priority", `<strong>${priority}</strong>. ${escapeHtml(brief.priorityReason)}`)}
          ${row("Budget", escapeHtml(brief.budget))}
          ${row("Timeline", escapeHtml(brief.timeline))}
          ${row("Summary", escapeHtml(brief.summary))}
          ${brief.missingInfo.length ? row("Still to ask", `<ul style="margin: 0; padding-left: 18px;">${brief.missingInfo.map((m) => `<li>${escapeHtml(m)}</li>`).join("")}</ul>`) : ""}
          ${brief.spam ? row("Flag", "<strong>Likely spam</strong>") : ""}
        </table>
      </div>

      <table style="border-collapse: collapse; width: 100%; font-size: 14px; margin-bottom: 24px;">
        ${row("Email", `<a href="mailto:${escapeHtml(contact.email)}" style="color: #2D8DFF;">${escapeHtml(contact.email)}</a>`)}
        ${contact.phone ? row("Phone", escapeHtml(contact.phone)) : ""}
        ${contact.company ? row("Company", escapeHtml(contact.company)) : ""}
        ${row("Newsletter", escapeHtml(newsletterLine))}
      </table>

      ${steps
        .map(
          (s) => `
      <div style="padding: 12px 0; border-top: 1px solid #E3E7EF;">
        <div style="font-size: 13px; color: #6B7A99; margin-bottom: 4px;">${escapeHtml(s.question)}</div>
        <div style="font-size: 15px; line-height: 1.55;">${s.answer ? escapeHtml(s.answer).replace(/\n/g, "<br>") : '<em style="color: #9AA6BC;">Skipped</em>'}</div>
      </div>`,
        )
        .join("")}

      <div style="margin-top: 32px; font-family: ui-monospace, monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #9AA6BC;">Sent via the webgro.co.uk guided enquiry</div>
    </div>
  `.trim();

  return { subject, text, html };
}

/**
 * The confirmation the person who sent the enquiry gets, with a copy of their
 * answers. Sent after the team email, never instead of it.
 */
export function buildEnquiryConfirmation(steps: TrustedStep[], contact: EnquiryContact) {
  const first = contact.name.trim().split(/\s+/)[0] ?? "";
  const greeting = first ? `Hi ${first},` : "Hi,";
  const details: [string, string][] = [
    ["Name", contact.name],
    ["Email", contact.email],
    ...(contact.phone ? ([["Phone", contact.phone]] as [string, string][]) : []),
    ...(contact.company ? ([["Company", contact.company]] as [string, string][]) : []),
  ];

  const text = [
    greeting,
    "",
    "We've received your enquiry. Someone will get back to you within one working day.",
    "",
    `If it's urgent, email ${TEAM_EMAIL} or call ${TEAM_PHONE}.`,
    "",
    "Webgro",
    "",
    "A copy of what you sent",
    "",
    ...steps.flatMap((s, i) => [`${i + 1}. ${s.question}`, s.answer || "Skipped", ""]),
    ...details.map(([k, v]) => `${k}: ${v}`),
  ].join("\n");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; color: #0D1117; font-size: 15px; line-height: 1.55;">
      <p style="margin: 0 0 16px;">${escapeHtml(greeting)}</p>
      <p style="margin: 0 0 16px;">We've received your enquiry. Someone will get back to you within one working day.</p>
      <p style="margin: 0 0 16px;">If it's urgent, email <a href="mailto:${TEAM_EMAIL}" style="color: #2D8DFF;">${TEAM_EMAIL}</a> or call <a href="${TEAM_PHONE_HREF}" style="color: #2D8DFF;">${TEAM_PHONE}</a>.</p>
      <p style="margin: 0 0 28px;">Webgro</p>

      <div style="font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #6B7A99;">A copy of what you sent</div>

      ${steps
        .map(
          (s) => `
      <div style="padding: 12px 0; border-top: 1px solid #E3E7EF;">
        <div style="font-size: 13px; color: #6B7A99; margin-bottom: 4px;">${escapeHtml(s.question)}</div>
        <div style="line-height: 1.55;">${s.answer ? escapeHtml(s.answer).replace(/\n/g, "<br>") : '<em style="color: #9AA6BC;">Skipped</em>'}</div>
      </div>`,
        )
        .join("")}

      <table style="border-collapse: collapse; width: 100%; font-size: 14px; margin-top: 12px; padding-top: 12px; border-top: 1px solid #E3E7EF;">
        ${details.map(([k, v]) => row(escapeHtml(k), escapeHtml(v))).join("")}
      </table>
    </div>
  `.trim();

  return { subject: "We've got your enquiry", text, html };
}
