const VIOLET = "#7C3AED";
const VIOLET_SOFT = "#EDE9FE";
const AMBER = "#B45309";
const AMBER_SOFT = "#FEF3C7";
const RED = "#B91C1C";
const RED_SOFT = "#FEE2E2";
const TEAL = "#0F766E";
const TEAL_SOFT = "#CCFBF1";

type ScoreRow = {
  area: string;
  score: number; // 0-10
  status: "Strong" | "Watch" | "Risk";
  note: string;
};

const scores: ScoreRow[] = [
  { area: "Platform health", score: 8, status: "Strong", note: "Shopify · well-scoped, low debt" },
  { area: "Conversion path", score: 6, status: "Watch", note: "PDP → checkout fall-off at 34%" },
  { area: "Performance", score: 7, status: "Watch", note: "LCP 2.9s on mobile, target <2.5s" },
  { area: "Marketing loop", score: 4, status: "Risk", note: "No post-purchase flow, weak retention" },
  { area: "Ops & stack", score: 7, status: "Strong", note: "Clean ERP sync, OMS in good shape" },
];

type Action = {
  priority: number;
  title: string;
  owner: string;
  effort: "Low" | "Med" | "High";
  impact: "Low" | "Med" | "High";
  tag: "Quick win" | "Big bet" | "Fix";
};

const actions: Action[] = [
  {
    priority: 1,
    title: "Rebuild post-purchase flow (Klaviyo)",
    owner: "Marketing",
    effort: "Low",
    impact: "High",
    tag: "Quick win",
  },
  {
    priority: 2,
    title: "PDP → checkout friction audit & fixes",
    owner: "Webgro · CRO",
    effort: "Med",
    impact: "High",
    tag: "Fix",
  },
  {
    priority: 3,
    title: "Mobile LCP, image pipeline + deferred scripts",
    owner: "Webgro · dev",
    effort: "Med",
    impact: "Med",
    tag: "Fix",
  },
  {
    priority: 4,
    title: "B2B portal scoping (phase 2 retainer)",
    owner: "Strategy",
    effort: "High",
    impact: "High",
    tag: "Big bet",
  },
];

function statusStyle(s: ScoreRow["status"]): React.CSSProperties {
  if (s === "Strong") return { borderColor: TEAL, backgroundColor: TEAL_SOFT, color: TEAL };
  if (s === "Watch") return { borderColor: AMBER, backgroundColor: AMBER_SOFT, color: AMBER };
  return { borderColor: RED, backgroundColor: RED_SOFT, color: RED };
}

function barColor(s: ScoreRow["status"]): string {
  if (s === "Strong") return TEAL;
  if (s === "Watch") return AMBER;
  return RED;
}

function tagStyle(t: Action["tag"]): React.CSSProperties {
  if (t === "Quick win") return { borderColor: VIOLET, backgroundColor: VIOLET_SOFT, color: VIOLET };
  if (t === "Big bet") return { borderColor: AMBER, backgroundColor: AMBER_SOFT, color: AMBER };
  return { borderColor: "#e4e4e7", backgroundColor: "#fafafa", color: "#52525b" };
}

/**
 * Consultancy audit deliverable, scorecard (left) + prioritised roadmap (right).
 * Not a real client, but representative of what a Webgro audit actually looks
 * like when we land the draft with the client. Chosen over a stock image so
 * the page shows the output, not a generic "strategy" lifestyle photo.
 */
export function ConsultancyAuditBoard() {
  return (
    <div
      className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl shadow-black/40"
      style={{ fontFamily: "var(--font-inter), Inter, system-ui, sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ backgroundColor: VIOLET_SOFT }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ color: VIOLET }}>
              <path
                d="M2 2h10v10H2z M2 6h10 M6 2v10"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold text-zinc-900">
            Growth Audit · <span style={{ color: VIOLET }}>Q2 · Acme Retail</span>
          </p>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <span
            className="rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em]"
            style={{ borderColor: VIOLET, backgroundColor: VIOLET_SOFT, color: VIOLET }}
          >
            Draft · week 2 of 3
          </span>
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white"
            style={{ backgroundColor: VIOLET }}
          >
            MB
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="grid min-h-[420px] grid-cols-1 md:grid-cols-5">
        {/* Left, scorecard */}
        <div className="border-b border-zinc-200 bg-zinc-50 md:col-span-2 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Audit scorecard
            </p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
              5 areas
            </p>
          </div>
          <div className="divide-y divide-zinc-100">
            {scores.map((s) => (
              <div key={s.area} className="px-5 py-3.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-900">
                    {s.area}
                  </p>
                  <p className="shrink-0 text-[11px] font-semibold tabular-nums text-zinc-800">
                    {s.score}/10
                  </p>
                </div>
                <p className="mt-1 truncate text-[11px] text-zinc-600">{s.note}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${s.score * 10}%`, backgroundColor: barColor(s.status) }}
                    />
                  </div>
                  <span
                    className="shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em]"
                    style={statusStyle(s.status)}
                  >
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right, prioritised roadmap */}
        <div className="flex flex-col bg-white md:col-span-3">
          <div className="border-b border-zinc-200 px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  Prioritised roadmap
                </p>
                <p className="mt-1 text-xl font-bold tracking-tight text-zinc-900 md:text-2xl">
                  8 recommendations
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="rounded-full border px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.2em]"
                  style={{ borderColor: VIOLET, backgroundColor: VIOLET_SOFT, color: VIOLET }}
                >
                  3 quick wins
                </span>
                <span
                  className="rounded-full border px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.2em]"
                  style={{ borderColor: AMBER, backgroundColor: AMBER_SOFT, color: AMBER }}
                >
                  2 big bets
                </span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-zinc-100">
            {actions.map((a) => (
              <div key={a.priority} className="flex items-start gap-4 px-6 py-3.5">
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                  style={{ backgroundColor: VIOLET_SOFT, color: VIOLET }}
                >
                  {a.priority}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[13px] font-semibold text-zinc-900">{a.title}</p>
                    <span
                      className="rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em]"
                      style={tagStyle(a.tag)}
                    >
                      {a.tag}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                    <span>Owner · <span className="text-zinc-700">{a.owner}</span></span>
                    <span>Effort · <span className="text-zinc-700">{a.effort}</span></span>
                    <span>Impact · <span className="text-zinc-700">{a.impact}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto border-t border-zinc-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Next check-in · Tues 10am
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: VIOLET }}>
                Delivered by Webgro
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
