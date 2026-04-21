const TEAL = "#00C9A7";
const TEAL_SOFT = "#CCFBF1";

type Node = {
  id: string;
  app: string;
  action: string;
  color: string; // brand colour
  icon: React.ReactElement;
};

// App nodes with a recognisable coloured disc + minimal mark. Not official
// logos (rights), just tidy stand-ins that read as the right brand at a glance.
const shopify: Node = {
  id: "shopify",
  app: "Shopify",
  action: "Order paid",
  color: "#95BF47",
  icon: (
    <text x="50%" y="56%" textAnchor="middle" fontSize="22" fontWeight="700" fill="#fff" fontFamily="sans-serif">
      S
    </text>
  ),
};

const router: Node = {
  id: "router",
  app: "Router",
  action: "If total > £100",
  color: "#0F172A",
  icon: (
    <g>
      <circle cx="50%" cy="50%" r="9" fill="none" stroke="#fff" strokeWidth="2" />
      <path d="M15 25 L25 25 M25 15 L25 35" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </g>
  ),
};

const xero: Node = {
  id: "xero",
  app: "Xero",
  action: "Push invoice",
  color: "#13B5EA",
  icon: (
    <g>
      <circle cx="50%" cy="50%" r="10" fill="none" stroke="#fff" strokeWidth="2.4" />
      <circle cx="50%" cy="50%" r="4.5" fill="#fff" />
    </g>
  ),
};

const sheets: Node = {
  id: "sheets",
  app: "Google Sheets",
  action: "Log row",
  color: "#0F9D58",
  icon: (
    <g>
      <rect x="14" y="11" width="22" height="28" rx="2" fill="#fff" />
      <path d="M18 19h14 M18 25h14 M18 31h14 M25 16v18" stroke="#0F9D58" strokeWidth="1.2" />
    </g>
  ),
};

const klaviyo: Node = {
  id: "klaviyo",
  app: "Klaviyo",
  action: "Flag VIP",
  color: "#1A1A1A",
  icon: (
    <text x="50%" y="57%" textAnchor="middle" fontSize="21" fontWeight="700" fill="#fff" fontFamily="sans-serif">
      K
    </text>
  ),
};

const slack: Node = {
  id: "slack",
  app: "Slack",
  action: "Alert #ops",
  color: "#611F69",
  icon: (
    <text x="50%" y="60%" textAnchor="middle" fontSize="22" fontWeight="700" fill="#fff" fontFamily="sans-serif">
      #
    </text>
  ),
};

const outputs: Node[] = [xero, sheets, klaviyo, slack];

// Node bubble, Make-style rounded square with coloured disc + description
function NodeBubble({ n, active }: { n: Node; active?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div
        className={`relative flex h-[54px] w-[54px] items-center justify-center rounded-2xl border-2 shadow-md transition ${
          active ? "border-[var(--node-bd)]" : "border-transparent"
        }`}
        style={
          {
            backgroundColor: n.color,
            // the teal ring uses a CSS var so the border is readable on any node
            ["--node-bd" as string]: TEAL,
          } as React.CSSProperties
        }
      >
        <svg viewBox="0 0 50 50" className="h-[42px] w-[42px]" aria-hidden="true">
          {n.icon}
        </svg>
      </div>
      <div className="min-w-[88px]">
        <p className="text-[11px] font-semibold leading-tight text-zinc-900">{n.app}</p>
        <p className="mt-0.5 text-[10px] leading-tight text-zinc-500">{n.action}</p>
      </div>
    </div>
  );
}

/**
 * Make-scenario-style diagram, Shopify trigger → router → fan-out to Xero,
 * Sheets, Klaviyo, Slack. Colours lifted from each app's brand. Curved SVG
 * connectors + a pulsing dot on the active arm.
 *
 * Built as an SVG overlay (absolute, pointer-events-none) on top of a CSS
 * grid holding the node bubbles, so the layout stays resilient to container
 * width and responsive steps.
 */
export function StackIntegrationFlow() {
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
            style={{ backgroundColor: TEAL_SOFT }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ color: "#007F6A" }}>
              <path d="M2 7h3l2-4 2 8 2-4h3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-zinc-900">
            Scenario · <span style={{ color: "#007F6A" }}>Order → Accounting → CRM</span>
          </p>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live · 14 runs today
          </span>
          <span
            className="rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em]"
            style={{ borderColor: "#007F6A", backgroundColor: TEAL_SOFT, color: "#007F6A" }}
          >
            avg 2.1s
          </span>
        </div>
      </div>

      {/* Flow canvas */}
      <div className="relative min-h-[420px] bg-[radial-gradient(circle_at_1px_1px,_#e4e4e7_1px,_transparent_0)] [background-size:18px_18px]">
        {/* Connectors (SVG overlay) */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 600 420"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="flow-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#95BF47" />
              <stop offset="40%" stopColor={TEAL} />
              <stop offset="100%" stopColor="#13B5EA" />
            </linearGradient>
          </defs>
          {/* Trigger → Router */}
          <path
            d="M 110 210 C 180 210, 220 210, 290 210"
            stroke="url(#flow-stroke)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Router → Xero (top) */}
          <path
            d="M 330 210 C 400 210, 420 80, 500 80"
            stroke={TEAL}
            strokeWidth="1.8"
            fill="none"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />
          {/* Router → Sheets */}
          <path
            d="M 330 210 C 400 210, 420 160, 500 160"
            stroke={TEAL}
            strokeWidth="1.8"
            fill="none"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />
          {/* Router → Klaviyo */}
          <path
            d="M 330 210 C 400 210, 420 260, 500 260"
            stroke={TEAL}
            strokeWidth="1.8"
            fill="none"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />
          {/* Router → Slack (bottom) */}
          <path
            d="M 330 210 C 400 210, 420 340, 500 340"
            stroke={TEAL}
            strokeWidth="1.8"
            fill="none"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />

          {/* Moving data-packet along Trigger → Router (the "live" arm) */}
          <circle r="3.5" fill={TEAL}>
            <animateMotion dur="2.6s" repeatCount="indefinite" path="M 110 210 C 180 210, 220 210, 290 210" />
          </circle>
          {/* And a second packet on Router → Klaviyo to suggest fan-out */}
          <circle r="3" fill="#00C9A7" opacity="0.7">
            <animateMotion dur="3.2s" repeatCount="indefinite" begin="0.6s" path="M 330 210 C 400 210, 420 260, 500 260" />
          </circle>
        </svg>

        {/* Trigger (absolute positioned over canvas) */}
        <div className="absolute left-[6%] top-1/2 -translate-y-1/2">
          <NodeBubble n={shopify} active />
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-emerald-700">
            <span className="h-1 w-1 rounded-full bg-emerald-500" />
            Trigger
          </div>
        </div>

        {/* Router */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <NodeBubble n={router} />
          <p className="mt-2 rounded-full bg-zinc-100 px-2 py-0.5 text-center text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-600">
            Filter
          </p>
        </div>

        {/* Outputs (fan out right side) */}
        <div className="absolute right-[4%] top-0 flex h-full flex-col justify-around py-8">
          {outputs.map((n) => (
            <NodeBubble key={n.id} n={n} />
          ))}
        </div>
      </div>

      {/* Footer legend */}
      <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#95BF47]" />
              Trigger
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
              Logic
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: TEAL }} />
              Action
            </span>
          </div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em]" style={{ color: "#007F6A" }}>
            Built with n8n / Make / Claude API
          </p>
        </div>
      </div>
    </div>
  );
}
