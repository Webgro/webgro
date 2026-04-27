/**
 * Vapi tool registry.
 *
 * Each tool is a function that takes the assistant's parsed arguments
 * and returns a string the assistant will speak back to the caller.
 * Add new tools by extending the `tools` map below; the `name` here
 * must match the function name registered in Vapi's assistant config.
 */

import { Resend } from "resend";

const NOTIFY_TO   = process.env.VAPI_NOTIFY_EMAIL ?? "michael@webgro.co.uk";
const NOTIFY_FROM = process.env.VAPI_FROM_EMAIL   ?? "Webgro Receptionist <receptionist@webgro.co.uk>";
const BUSINESS_PHONE = process.env.VAPI_BUSINESS_PHONE ?? "+44 1344 231119";

type ToolFn = (args: Record<string, unknown>) => Promise<string>;

const tools: Record<string, ToolFn> = {
  scheduleCallback,
  sendInfoEmail,
};

export async function runTool(name: string, args: Record<string, unknown>): Promise<string> {
  const fn = tools[name];
  if (!fn) return `Tool '${name}' is not implemented on the server.`;
  return fn(args);
}

// =====================================================================
// scheduleCallback
//
// Vapi schema:
//   {
//     "name": "scheduleCallback",
//     "description": "Record a request for Michael to call the customer back. Use when the caller wants a human to phone them, or when their request is too detailed for the receptionist to handle on the call.",
//     "parameters": {
//       "type": "object",
//       "properties": {
//         "name":           { "type": "string", "description": "Caller's full name." },
//         "phone":          { "type": "string", "description": "Best number to reach them on, E.164 if possible." },
//         "email":          { "type": "string", "description": "Optional email address." },
//         "topic":          { "type": "string", "description": "Short summary of what the call is about." },
//         "preferred_time": { "type": "string", "description": "Caller's preferred time, e.g. 'tomorrow morning'." }
//       },
//       "required": ["name", "phone", "topic"]
//     }
//   }
// =====================================================================
async function scheduleCallback(args: Record<string, unknown>): Promise<string> {
  const name  = String(args.name  ?? "").trim();
  const phone = String(args.phone ?? "").trim();
  const email = String(args.email ?? "").trim();
  const topic = String(args.topic ?? "").trim();
  const when  = String(args.preferred_time ?? "").trim();

  if (!name || !phone || !topic) {
    return "I just need a name, a phone number and a quick line about what it's regarding before I can book that callback.";
  }

  const subject = `[ Callback ] ${name} . ${phone}`;
  const rows: Array<[string, string]> = [
    ["Name", name],
    ["Phone", phone],
  ];
  if (email) rows.push(["Email", email]);
  rows.push(["About", topic]);
  if (when) rows.push(["Preferred", when]);

  const rowsHtml = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 16px 8px 0;color:#6B7A99;font-size:12px;text-transform:uppercase;letter-spacing:.06em;width:100px;vertical-align:top;">${escapeHtml(k)}</td><td style="padding:8px 0;color:#0D1117;font-size:14px;line-height:1.5;">${escapeHtml(v)}</td></tr>`,
    )
    .join("");

  const html =
    `<!doctype html><html><body style="margin:0;background:#F4F6FB;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">` +
    `<table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:32px 16px;">` +
    `<table align="center" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(13,17,23,.06);">` +
    `<tr><td style="height:4px;background:linear-gradient(90deg,#2D8DFF,#7C3AED,#00C9A7);"></td></tr>` +
    `<tr><td style="padding:28px 32px 24px;">` +
    `<p style="margin:0 0 4px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#00C9A7;">[ Callback requested ]</p>` +
    `<h1 style="margin:0 0 20px;font-size:22px;color:#0D1117;font-weight:700;letter-spacing:-.01em;">${escapeHtml(name)} wants a call back</h1>` +
    `<table style="border-collapse:collapse;width:100%;">${rowsHtml}</table>` +
    `</td></tr></table></td></tr></table></body></html>`;

  const text = [
    "Callback requested",
    "",
    `Name : ${name}`,
    `Phone: ${phone}`,
    email ? `Email: ${email}` : "",
    `About: ${topic}`,
    when ? `When : ${when}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const ok = await sendMail({ to: NOTIFY_TO, from: NOTIFY_FROM, subject, html, text });
  if (!ok) {
    // Don't lie to the caller. They asked for a callback and we failed
    // to deliver the notification, so own it on the call.
    return "I've taken those details down, but our notification system is having a moment. I'll make sure Michael sees this and calls you back directly.";
  }

  const confirmWhen = when ? ` for ${when}` : "";
  return `All booked. Michael will call you back${confirmWhen} on ${phone}. He's been notified.`;
}

// =====================================================================
// sendInfoEmail
//
// Vapi schema:
//   {
//     "name": "sendInfoEmail",
//     "description": "Email the caller a follow-up with information about a service. Use when they ask 'can you send me details', want pricing, or want a brochure / link to a case study.",
//     "parameters": {
//       "type": "object",
//       "properties": {
//         "email": { "type": "string", "description": "Caller's email address." },
//         "kind":  { "type": "string", "enum": ["websites","ecommerce","wordpress","ai-tools","seo","general"] },
//         "name":  { "type": "string", "description": "Caller's first name, used to personalise." }
//       },
//       "required": ["email", "kind"]
//     }
//   }
// =====================================================================
async function sendInfoEmail(args: Record<string, unknown>): Promise<string> {
  const email = String(args.email ?? "").trim();
  const kind  = String(args.kind  ?? "general").toLowerCase().trim();
  const name  = String(args.name  ?? "there").trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Hmm, that email didn't sound right. Could you spell it out for me?";
  }

  const packs: Record<string, { subject: string; headline: string; body: string; links: Array<[string, string]> }> = {
    websites: {
      subject: "Webgro . Websites that earn their keep",
      headline: "Websites that earn their keep",
      body: "Thanks for the call. Here's the overview of our website work, including recent builds and the AI integrations we layer on top where the numbers say yes.",
      links: [
        ["Websites overview", "https://webgro.co.uk/services/websites"],
        ["Selected work",     "https://webgro.co.uk/work"],
      ],
    },
    ecommerce: {
      subject: "Webgro . Shopify and eCommerce",
      headline: "Shopify built to convert",
      body: "As discussed, here's our Shopify and eCommerce work plus the case studies that mirror what you described.",
      links: [
        ["Websites and eCommerce", "https://webgro.co.uk/services/websites"],
        ["ANYPRINT case study",    "https://webgro.co.uk/work/anyprint"],
        ["Fun Cases case study",   "https://webgro.co.uk/work/fun-cases"],
      ],
    },
    wordpress: {
      subject: "Webgro . WordPress, properly built",
      headline: "WordPress that loads fast and stays fast",
      body: "Following our chat, here's the WordPress page and a recent rebuild we did with page speed as the design constraint.",
      links: [
        ["WordPress overview",  "https://webgro.co.uk/services/websites"],
        ["ANYPRINT case study", "https://webgro.co.uk/work/anyprint"],
      ],
    },
    "ai-tools": {
      subject: "Webgro . AI tools that earn their keep",
      headline: "AI in production, not in pitch decks",
      body: "Here's our AI work . live tools we've built for clients, plus the framework we use to decide when AI actually earns out.",
      links: [
        ["Automation and AI",                      "https://webgro.co.uk/services/automation-ai"],
        ["Five AI integrations that paid back",    "https://webgro.co.uk/the-gro/five-ai-integrations-first-month-roi"],
      ],
    },
    seo: {
      subject: "Webgro . SEO that compounds",
      headline: "SEO that compounds",
      body: "Here's our SEO approach and a recent piece on how things have shifted since AI Overviews landed.",
      links: [
        ["SEO services",                     "https://webgro.co.uk/services/seo"],
        ["SEO after AI Overviews (article)", "https://webgro.co.uk/the-gro/seo-after-ai-overviews-2026"],
      ],
    },
    general: {
      subject: "Webgro . Following up",
      headline: "Thanks for calling",
      body: "Lovely to chat. Here are a few links that line up with what you mentioned.",
      links: [
        ["Website",      "https://webgro.co.uk"],
        ["Selected work","https://webgro.co.uk/work"],
        ["Services",     "https://webgro.co.uk/services"],
      ],
    },
  };
  const pack = packs[kind] ?? packs.general;

  const linksHtml = pack.links
    .map(
      ([label, href]) =>
        `<li style="margin:6px 0;"><a href="${escapeHtml(href)}" style="color:#2D8DFF;text-decoration:underline;font-size:15px;">${escapeHtml(label)}</a></li>`,
    )
    .join("");

  const html =
    `<!doctype html><html><body style="margin:0;background:#F4F6FB;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">` +
    `<table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:32px 16px;">` +
    `<table align="center" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(13,17,23,.06);">` +
    `<tr><td style="height:4px;background:linear-gradient(90deg,#2D8DFF,#7C3AED,#00C9A7);"></td></tr>` +
    `<tr><td style="padding:28px 32px 28px;">` +
    `<p style="margin:0 0 4px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#7C3AED;">[ Webgro ]</p>` +
    `<h1 style="margin:0 0 18px;font-size:22px;color:#0D1117;font-weight:700;letter-spacing:-.01em;">${escapeHtml(pack.headline)}</h1>` +
    `<p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#0D1117;">Hi ${escapeHtml(name)},</p>` +
    `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#0D1117;">${escapeHtml(pack.body)}</p>` +
    `<ul style="margin:0 0 18px;padding:0 0 0 18px;">${linksHtml}</ul>` +
    `<p style="margin:24px 0 0;font-size:14px;color:#0D1117;">Reply to this email any time, or call back on ${escapeHtml(BUSINESS_PHONE)}.</p>` +
    `<p style="margin:8px 0 0;font-size:14px;color:#0D1117;">. Michael at Webgro</p>` +
    `</td></tr></table></td></tr></table></body></html>`;

  const text = [
    `Hi ${name},`,
    "",
    pack.body,
    "",
    ...pack.links.map(([label, href]) => `- ${label}: ${href}`),
    "",
    `Reply any time, or call back on ${BUSINESS_PHONE}.`,
    "",
    ". Michael at Webgro",
  ].join("\n");

  const ok = await sendMail({
    to: email,
    from: NOTIFY_FROM,
    subject: pack.subject,
    html,
    text,
  });

  if (!ok) {
    return "I tried to send that, but the email didn't go through. I'll make sure Michael follows up directly.";
  }
  return "Sent. It should be in your inbox in the next minute or two. Anything else?";
}

// ---------- shared helpers ----------

async function sendMail(opts: {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      "[vapi-mail] RESEND_API_KEY env var is not set on Vercel. " +
      "The tool ran but no email was sent. Add it under " +
      "Vercel project > Settings > Environment Variables and redeploy.",
    );
    return false;
  }
  // Log enough to debug from Vercel's runtime logs without leaking
  // anything secret. Subject + to/from are useful to confirm a send
  // was attempted at all.
  console.log("[vapi-mail] attempting send", {
    to: opts.to,
    from: opts.from,
    subject: opts.subject,
  });
  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send(opts);
    if (error) {
      console.error("[vapi-mail] Resend rejected the send:", {
        name: error.name,
        message: error.message,
        // Resend includes the full error blob here when validation fails.
        full: JSON.stringify(error),
      });
      return false;
    }
    console.log("[vapi-mail] sent OK", { id: data?.id });
    return true;
  } catch (e) {
    console.error("[vapi-mail] sendMail threw exception:", e);
    return false;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
