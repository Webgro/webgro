/**
 * Email body templates for the Vapi receptionist.
 *
 * One HTML version (brand-styled, gradient hairline, monospace meta,
 * collapsible transcript) and a plain-text fallback.
 */

type CallEmailData = {
  callerNumber: string;
  callerName: string | null;
  startedAt?: string | null;
  endedAt?: string | null;
  duration: string | null;
  endedReason: string;
  assistantName: string;
  summary: string;
  structured: Record<string, unknown>;
  transcript: string;
  recordingUrl: string;
};

type CallEmailTextData = Pick<
  CallEmailData,
  "callerNumber" | "callerName" | "duration" | "endedReason" | "summary" | "transcript" | "recordingUrl"
>;

export function renderCallEmailHtml(d: CallEmailData): string {
  const callerLine = escapeHtml(
    (d.callerName ? `${d.callerName} . ` : "") + d.callerNumber,
  );

  const rows: Array<[string, string]> = [
    ["Caller", callerLine],
  ];
  if (d.duration)   rows.push(["Duration", escapeHtml(d.duration)]);
  if (d.startedAt)  rows.push(["Started", escapeHtml(d.startedAt)]);
  if (d.endedAt)    rows.push(["Ended", escapeHtml(d.endedAt)]);
  rows.push(["Ended reason", escapeHtml(d.endedReason)]);
  rows.push(["Assistant", escapeHtml(d.assistantName)]);

  const rowsHtml = rows
    .map(
      ([k, v]) =>
        `<tr>` +
        `<td style="padding:8px 16px 8px 0;color:#6B7A99;font-size:12px;text-transform:uppercase;letter-spacing:.06em;width:130px;vertical-align:top;">${k}</td>` +
        `<td style="padding:8px 0;color:#0D1117;font-size:14px;line-height:1.5;">${v}</td>` +
        `</tr>`,
    )
    .join("");

  let summaryBlock = "";
  if (d.summary.trim() !== "") {
    summaryBlock =
      `<h2 style="margin:32px 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:.08em;color:#2D8DFF;">Summary</h2>` +
      `<p style="margin:0;color:#0D1117;font-size:15px;line-height:1.6;">${escapeHtml(d.summary).replace(/\n/g, "<br>")}</p>`;
  }

  let structuredBlock = "";
  const entries = Object.entries(d.structured ?? {});
  if (entries.length > 0) {
    const items = entries
      .map(([k, v]) => {
        const value =
          typeof v === "object" && v !== null ? JSON.stringify(v) : String(v ?? "");
        return (
          `<tr>` +
          `<td style="padding:6px 16px 6px 0;color:#6B7A99;font-size:12px;vertical-align:top;width:140px;">${escapeHtml(k)}</td>` +
          `<td style="padding:6px 0;color:#0D1117;font-size:13px;">${escapeHtml(value)}</td>` +
          `</tr>`
        );
      })
      .join("");
    structuredBlock =
      `<h2 style="margin:32px 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:.08em;color:#7C3AED;">Captured details</h2>` +
      `<table style="border-collapse:collapse;width:100%;">${items}</table>`;
  }

  let recordingBlock = "";
  if (d.recordingUrl.trim() !== "") {
    const url = escapeHtml(d.recordingUrl);
    recordingBlock = `<p style="margin:24px 0 0;font-size:14px;"><a href="${url}" style="color:#2D8DFF;text-decoration:underline;">Listen to the recording &rarr;</a></p>`;
  }

  let transcriptBlock = "";
  if (d.transcript.trim() !== "") {
    transcriptBlock =
      `<details style="margin:32px 0 0;">` +
      `<summary style="cursor:pointer;color:#6B7A99;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Full transcript</summary>` +
      `<pre style="margin:12px 0 0;white-space:pre-wrap;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;line-height:1.6;color:#0D1117;background:#F4F6FB;border-radius:8px;padding:14px 16px;">${escapeHtml(d.transcript)}</pre>` +
      `</details>`;
  }

  return `<!doctype html><html><body style="margin:0;background:#F4F6FB;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:32px 16px;">
  <table align="center" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(13,17,23,.06);">
    <tr><td style="height:4px;background:linear-gradient(90deg,#2D8DFF,#7C3AED,#00C9A7);"></td></tr>
    <tr><td style="padding:28px 32px 12px;">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#7C3AED;">[ Receptionist ]</p>
      <h1 style="margin:0;font-size:22px;color:#0D1117;font-weight:700;letter-spacing:-.01em;">Call ended</h1>
    </td></tr>
    <tr><td style="padding:8px 32px 32px;">
      <table style="border-collapse:collapse;width:100%;">${rowsHtml}</table>
      ${summaryBlock}
      ${structuredBlock}
      ${recordingBlock}
      ${transcriptBlock}
    </td></tr>
  </table>
  <p style="margin:18px auto 0;text-align:center;font-size:11px;color:#6B7A99;max-width:640px;">Sent by your Vapi receptionist webhook.</p>
</td></tr></table></body></html>`;
}

export function renderCallEmailText(d: CallEmailTextData): string {
  const lines: string[] = [];
  lines.push("== Call ended ==");
  lines.push("");
  lines.push(
    `Caller   : ${d.callerName ? `${d.callerName} (${d.callerNumber})` : d.callerNumber}`,
  );
  if (d.duration) lines.push(`Duration : ${d.duration}`);
  lines.push(`Reason   : ${d.endedReason}`);
  lines.push("");
  if (d.summary.trim() !== "") {
    lines.push("--- Summary ---");
    lines.push(d.summary);
    lines.push("");
  }
  if (d.recordingUrl.trim() !== "") {
    lines.push(`Recording: ${d.recordingUrl}`);
    lines.push("");
  }
  if (d.transcript.trim() !== "") {
    lines.push("--- Transcript ---");
    lines.push(d.transcript);
  }
  return lines.join("\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
