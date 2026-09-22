import { z } from "zod";
import {
  CHARITY_FIELD_ERRORS,
  CHARITY_LIMITS as L,
  type CharityApplicationResponse,
  type CharityField,
} from "@/lib/charity-application";
import { clientIp, rateLimited } from "@/lib/enquiry/rate-limit";
import { escapeHtml, sendCustomerEmail, sendTeamEmail, verifyTurnstile } from "@/lib/form-guard";
import { NEWSLETTER_SOURCE, subscribeFormOptIn } from "@/lib/newsletter";

/**
 * POST /api/charity-application
 * The free charity website application from /industries/charities. Checks the
 * honeypot, rate limit, fields and Turnstile the same way the enquiry form
 * does, then emails the application to CONTACT_TO_EMAIL through Resend and
 * sends the applicant a short confirmation.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const json = (body: CharityApplicationResponse, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/** One line, no control characters, so nothing can sneak into an email header. */
const oneLine = (s: string | undefined) => (s ?? "").replace(/\p{Cc}+/gu, " ").replace(/\s+/g, " ").trim();

/** Keeps line breaks and tabs, drops every other control character. */
const multiLine = (s: string) => s.replace(/\r\n?/g, "\n").replace(/(?![\n\t])\p{Cc}/gu, "").trim();

const req = (max: number) => z.string().trim().min(1).max(max);
const opt = (max: number) => z.string().trim().max(max).optional();

const Body = z.object({
  charityName: req(L.charityName),
  charityNumber: opt(L.charityNumber),
  notRegistered: z.boolean().default(false),
  charityWebsite: opt(L.charityWebsite),
  about: req(L.about),
  needs: req(L.needs),
  difference: req(L.difference),
  contactName: req(L.contactName),
  role: req(L.role),
  email: z.email().max(L.email),
  phone: opt(L.phone),
  agreed: z.literal(true),
  newsletter: z.boolean().default(false),
  hp: z.string().max(500).optional(),
  turnstileToken: z.string().max(4000).optional(),
});

type Application = {
  charityName: string;
  charityNumber: string;
  charityWebsite: string;
  about: string;
  needs: string;
  difference: string;
  contactName: string;
  role: string;
  email: string;
  phone: string;
  newsletter: boolean;
  submittedAt: string;
};

function buildEmail(a: Application) {
  const rows: [string, string][] = [
    ["Charity", a.charityName],
    ["Charity number", a.charityNumber],
    ["Website", a.charityWebsite || "None given"],
    ["Contact", `${a.contactName}, ${a.role}`],
    ["Email", a.email],
    ["Phone", a.phone || "None given"],
    ["Newsletter", a.newsletter ? "Opted in to the newsletter" : "Did not opt in to the newsletter"],
    ["Submitted", a.submittedAt],
  ];
  const answers: [string, string][] = [
    ["What the charity does", a.about],
    ["What it needs from a website", a.needs],
    ["Why now, and the difference it would make", a.difference],
  ];

  const text = [
    "Charity website application from /industries/charities",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    ...answers.flatMap(([k, v]) => [`${k}:`, v, ""]),
  ].join("\n");

  const cell = "padding:6px 16px 6px 0;vertical-align:top;";
  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.5;color:#0d0d0f">
<p style="margin:0 0 16px">Charity website application from /industries/charities</p>
<table style="border-collapse:collapse;margin:0 0 20px">${rows
    .map(([k, v]) => `<tr><td style="${cell}color:#666">${escapeHtml(k)}</td><td style="${cell}">${escapeHtml(v)}</td></tr>`)
    .join("")}</table>
${answers
  .map(
    ([k, v]) =>
      `<h3 style="margin:20px 0 6px;font-size:15px">${escapeHtml(k)}</h3><p style="margin:0;white-space:pre-wrap">${escapeHtml(v)}</p>`,
  )
  .join("\n")}
</div>`;

  return { subject: oneLine(`Charity website application: ${a.charityName}`), text, html };
}

/**
 * The confirmation the applicant gets. It says what actually happens next and
 * promises no reply time, because applications sit in a queue.
 */
function buildConfirmationEmail(a: Application) {
  const first = a.contactName.split(/\s+/)[0] ?? "";
  const greeting = first ? `Hi ${first},` : "Hi,";
  const body = [
    `We've received the application for ${a.charityName}.`,
    "The team reads every application and reviews it against our own criteria. We take on one free charity project a month, so there is usually a wait.",
    "We'll get in touch when we can help.",
  ];

  const text = [greeting, "", ...body.flatMap((line) => [line, ""]), "Webgro"].join("\n");

  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.5;color:#0d0d0f">
<p style="margin:0 0 16px">${escapeHtml(greeting)}</p>
${body.map((line) => `<p style="margin:0 0 16px">${escapeHtml(line)}</p>`).join("\n")}
<p style="margin:0">Webgro</p>
</div>`;

  return { subject: "We've got your charity application", text, html };
}

export async function POST(request: Request) {
  if (rateLimited(`charity:${clientIp(request)}`, 5, 60 * 60_000)) {
    return json(
      { ok: false, error: "You've sent several applications in the last hour. Please email hello@webgro.co.uk directly." },
      429,
    );
  }

  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const fields: Partial<Record<CharityField | "agreed", string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key !== "string" || key in fields) continue;
      const tooLong = issue.code === "too_big";
      fields[key as CharityField] = tooLong
        ? "This answer is too long. Please shorten it."
        : (CHARITY_FIELD_ERRORS[key as CharityField] ?? "Please check this answer.");
    }
    if (!Object.keys(fields).length) {
      return json({ ok: false, error: "Something in the form wasn't right. Please refresh the page and try again." }, 400);
    }
    return json({ ok: false, error: "Some answers need checking. They're marked on the form.", fields }, 400);
  }
  const body = parsed.data;

  // Honeypot: bots fill every field. Report success so they don't retry.
  if (body.hp && body.hp.trim() !== "") return json({ ok: true });

  if (!(await verifyTurnstile(body.turnstileToken))) {
    return json(
      { ok: false, error: "We couldn't verify you're a human. Refresh the page and try again, or email hello@webgro.co.uk directly." },
      400,
    );
  }

  const application: Application = {
    charityName: oneLine(body.charityName),
    charityNumber: body.notRegistered ? "Not registered yet" : oneLine(body.charityNumber) || "Not given",
    charityWebsite: oneLine(body.charityWebsite),
    about: multiLine(body.about),
    needs: multiLine(body.needs),
    difference: multiLine(body.difference),
    contactName: oneLine(body.contactName),
    role: oneLine(body.role),
    email: oneLine(body.email),
    phone: oneLine(body.phone),
    newsletter: body.newsletter,
    submittedAt: new Date().toISOString(),
  };

  // Database: when Neon Postgres is added, save `application` here, before the
  // email is sent (for example `await saveCharityApplication(application)`), so
  // an application is kept even if Resend fails. Nothing else needs to change.

  const { subject, text, html } = buildEmail(application);
  const result = await sendTeamEmail({
    fromName: "Webgro Charity Applications",
    replyTo: application.email,
    subject,
    text,
    html,
    logTag: "[charity-application]",
  });

  // Confirmation to the address on the application, after the team copy and
  // only if that one went out: promising a look at something nobody received
  // would be worse than sending nothing. sendCustomerEmail logs its own
  // failures and never throws, so this can't fail the application.
  if (result.ok) {
    const confirmation = buildConfirmationEmail(application);
    await sendCustomerEmail({
      fromName: "Webgro",
      to: application.email,
      subject: confirmation.subject,
      text: confirmation.text,
      html: confirmation.html,
      logTag: "[charity-application]",
    });
  }

  // The newsletter is a separate consent, so a Klaviyo problem never changes
  // what the applicant sees. subscribeFormOptIn catches and logs everything.
  await subscribeFormOptIn({
    optIn: application.newsletter,
    email: application.email,
    source: NEWSLETTER_SOURCE.charity,
    logTag: "[charity-application]",
  });

  return json(result, result.ok ? 200 : 502);
}
