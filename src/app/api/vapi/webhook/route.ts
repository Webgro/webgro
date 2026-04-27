import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { renderCallEmailHtml, renderCallEmailText } from "../_lib/email-templates";
import { runTool } from "../_lib/tools";

/**
 * Vapi receptionist webhook.
 *
 * One route handles every event type Vapi sends to a server URL:
 *
 *   end-of-call-report  -> email Michael with the transcript + summary
 *   tool-calls          -> dispatch to a named tool handler
 *   status-update       -> log only
 *   transcript          -> log only (live partials, very chatty)
 *
 * Configure in Vapi's assistant settings:
 *   Server URL        : https://webgro.co.uk/api/vapi/webhook
 *   Server URL Secret : same string as the VAPI_SECRET env var
 *
 * This route is excluded from the sitemap and disallowed in
 * robots.txt; nothing in the marketing site links to it.
 */

// Always treated as dynamic; no static optimisation, no caching.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type VapiMessage = {
  type?: string;
  call?: Record<string, unknown>;
  customer?: { number?: string; name?: string };
  assistant?: { name?: string };
  transcript?: string;
  recordingUrl?: string;
  summary?: string;
  endedReason?: string;
  startedAt?: string;
  endedAt?: string;
  analysis?: { summary?: string; structuredData?: Record<string, unknown> };
  toolCallList?: ToolCall[];
  toolCalls?: ToolCall[];
};

type ToolCall = {
  id?: string;
  name?: string;
  function?: { name?: string; arguments?: string | Record<string, unknown> };
  arguments?: string | Record<string, unknown>;
};

const NOTIFY_TO   = process.env.VAPI_NOTIFY_EMAIL ?? "michael@webgro.co.uk";
const NOTIFY_FROM = process.env.VAPI_FROM_EMAIL   ?? "Webgro Receptionist <receptionist@send.webgro.co.uk>";
const VAPI_SECRET = process.env.VAPI_SECRET ?? "";

// GET: a tiny health check so it's obvious the route is live.
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Vapi receptionist webhook is alive. POST events from Vapi.",
  });
}

export async function POST(req: NextRequest) {
  // 1. Auth: optional. If VAPI_SECRET is set, we require x-vapi-secret
  //    to match it. If it's not set, we accept any caller and just log
  //    a warning. Convenient for first-run setup; lock it down later
  //    by adding the env var + the same value in Vapi's dashboard.
  if (VAPI_SECRET) {
    const presented = req.headers.get("x-vapi-secret") ?? "";
    if (!constantTimeEqual(presented, VAPI_SECRET)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else {
    console.warn(
      "[vapi-webhook] VAPI_SECRET not set; webhook is unauthenticated. " +
      "Add VAPI_SECRET to Vercel env vars and paste the same value into " +
      "Vapi's Server URL Secret field to lock down.",
    );
  }

  // 2. Body
  let payload: { message?: VapiMessage } | null = null;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const message = payload?.message;
  if (!message || typeof message !== "object") {
    return NextResponse.json({ error: "Missing message envelope" }, { status: 400 });
  }

  // 3. Route by type
  try {
    switch (message.type) {
      case "end-of-call-report":
        return await handleEndOfCall(message);
      case "tool-calls":
        return await handleToolCalls(message);
      case "status-update":
      case "transcript":
      case "speech-update":
      case "hang":
      case "conversation-update":
        // Acknowledge so Vapi doesn't retry. No action needed for these.
        return NextResponse.json({ received: true });
      default:
        return NextResponse.json({
          received: true,
          unhandled: message.type ?? null,
        });
    }
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    console.error("[vapi-webhook] handler error", detail);
    return NextResponse.json({ error: "Handler exception", detail }, { status: 500 });
  }
}

/**
 * end-of-call-report -> email Michael with everything we have on the
 * call: caller, duration, summary, transcript, recording URL.
 */
async function handleEndOfCall(message: VapiMessage) {
  const callerNumber =
    message.customer?.number ??
    (message.call?.customer as { number?: string } | undefined)?.number ??
    "Unknown number";
  const callerName =
    message.customer?.name ??
    (message.call?.customer as { name?: string } | undefined)?.name ??
    null;
  const startedAt = message.startedAt ?? (message.call?.startedAt as string | undefined);
  const endedAt   = message.endedAt   ?? (message.call?.endedAt   as string | undefined);
  const duration  = computeDuration(startedAt, endedAt);
  const summary   = message.analysis?.summary ?? message.summary ?? "";
  const structured = message.analysis?.structuredData ?? {};
  const transcript = message.transcript ?? "";
  const recordingUrl = message.recordingUrl ?? "";
  const endedReason = message.endedReason ?? "unknown";
  const assistantName = message.assistant?.name ?? "Receptionist";

  const subject = [
    "[ Receptionist ] Call ended",
    callerName ? `${callerName} (${callerNumber})` : callerNumber,
    duration ? formatDuration(duration) : null,
  ]
    .filter(Boolean)
    .join(" . ");

  const html = renderCallEmailHtml({
    callerNumber,
    callerName,
    startedAt: startedAt ?? null,
    endedAt: endedAt ?? null,
    duration: duration ? formatDuration(duration) : null,
    endedReason,
    assistantName,
    summary,
    structured,
    transcript,
    recordingUrl,
  });
  const text = renderCallEmailText({
    callerNumber,
    callerName,
    duration: duration ? formatDuration(duration) : null,
    endedReason,
    summary,
    transcript,
    recordingUrl,
  });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[vapi-webhook] RESEND_API_KEY not set; skipping email.");
    return NextResponse.json({ received: true, emailed: false, reason: "missing-resend-key" });
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: NOTIFY_FROM,
    to: NOTIFY_TO,
    subject,
    html,
    text,
  });
  if (error) {
    console.error("[vapi-webhook] Resend send failed:", error);
    return NextResponse.json({ received: true, emailed: false, error: error.message ?? String(error) });
  }
  return NextResponse.json({ received: true, emailed: true, id: data?.id ?? null });
}

/**
 * tool-calls -> dispatch each call to a registered handler in
 * _lib/tools.ts. Returns the format Vapi expects: { results: [...] }.
 */
async function handleToolCalls(message: VapiMessage) {
  const calls = message.toolCallList ?? message.toolCalls ?? [];
  const results = await Promise.all(
    calls.map(async (call) => {
      const id = call.id ?? "";
      const name = call.function?.name ?? call.name ?? "";
      const rawArgs = call.function?.arguments ?? call.arguments ?? {};
      const args =
        typeof rawArgs === "string"
          ? safeJsonParse(rawArgs)
          : (rawArgs as Record<string, unknown>);
      try {
        const result = await runTool(name, args);
        return { toolCallId: id, result };
      } catch (e) {
        const detail = e instanceof Error ? e.message : String(e);
        console.error(`[vapi-webhook] tool '${name}' threw:`, detail);
        return {
          toolCallId: id,
          result: "Sorry, I couldn't complete that. Internal error.",
        };
      }
    }),
  );
  return NextResponse.json({ results });
}

// ---------- helpers ----------

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function safeJsonParse(s: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(s);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function computeDuration(startedAt?: string | null, endedAt?: string | null): number | null {
  if (!startedAt || !endedAt) return null;
  const a = Date.parse(startedAt);
  const b = Date.parse(endedAt);
  if (Number.isNaN(a) || Number.isNaN(b) || b < a) return null;
  return Math.round((b - a) / 1000);
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s.toString().padStart(2, "0")}s` : `${s}s`;
}
