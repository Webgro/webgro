const VIOLET = "#7C3AED";
const VIOLET_SOFT = "#EDE9FE";
const AMBER_SOFT = "#FEF3C7";
const AMBER_DEEP = "#B45309";
const GREEN_SOFT = "#DCFCE7";
const GREEN_DEEP = "#15803D";

type Row = {
  sku: string;
  title: string;
  stock: number;
  velocity: number;
  lead: string;
  recommend: string;
  urgency: "urgent" | "warn" | "ok";
};

const rows: Row[] = [
  { sku: "PC-I17P", title: "Sublimation Phone Case · iPhone 17", stock: 184, velocity: 64, lead: "14 days", recommend: "500", urgency: "urgent" },
  { sku: "TUM-40-W", title: "40oz Sublimation Tumbler", stock: 96, velocity: 42, lead: "18 days", recommend: "400", urgency: "urgent" },
  { sku: "WB-500-W", title: "Sublimation Water Bottle · White", stock: 62, velocity: 28, lead: "12 days", recommend: "300", urgency: "urgent" },
  { sku: "MUG-11-W", title: "Sublimation Mug · 11oz White", stock: 540, velocity: 180, lead: "7 days", recommend: "1500", urgency: "warn" },
  { sku: "TS-ADLT-L-W", title: "Sublimation T-shirt · Adult L White", stock: 320, velocity: 96, lead: "10 days", recommend: "800", urgency: "warn" },
  { sku: "MSP-22", title: "Sublimation Mousepad · 22cm Round", stock: 218, velocity: 44, lead: "12 days", recommend: "400", urgency: "warn" },
  { sku: "KR-30-RD", title: "Sublimation Keyring · 30mm Round", stock: 2400, velocity: 210, lead: "5 days", recommend: "-", urgency: "ok" },
  { sku: "CST-SQ-10", title: "Sublimation Coaster · Square x10", stock: 3100, velocity: 260, lead: "4 days", recommend: "-", urgency: "ok" },
];

function urgencyChipStyle(u: Row["urgency"]): React.CSSProperties {
  if (u === "urgent") return { borderColor: VIOLET, backgroundColor: VIOLET_SOFT, color: VIOLET };
  if (u === "warn") return { borderColor: "#F59E0B", backgroundColor: AMBER_SOFT, color: AMBER_DEEP };
  return { borderColor: "#22C55E", backgroundColor: GREEN_SOFT, color: GREEN_DEEP };
}

function urgencyLabel(u: Row["urgency"]): string {
  if (u === "urgent") return "Reorder now";
  if (u === "warn") return "Reorder soon";
  return "OK";
}

export function SublishopInventoryPlanner() {
  return (
    <div
      className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl shadow-black/40"
      style={{ fontFamily: "var(--font-poppins), Poppins, system-ui, sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: VIOLET_SOFT }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ color: VIOLET }}>
              <path
                d="M2 4h10v8H2z M2 4l5-2 5 2 M2 8h10"
                stroke="currentColor"
                strokeWidth="1.1"
                fill="none"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold text-zinc-900">
            Sublishop · <span style={{ color: VIOLET }}>Inventory Planner</span>
          </p>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">
            Last sync · 12m ago
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white" style={{ backgroundColor: VIOLET }}>
            MB
          </div>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-3 gap-px border-b border-zinc-200 bg-zinc-200">
        {[
          { label: "Low stock · SKUs", value: "12" },
          { label: "Reorder alerts", value: "5" },
          { label: "In transit · orders", value: "8" },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 md:p-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              {s.label}
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50 px-5 py-3">
        <div className="flex gap-2">
          {["All SKUs", "Reorder now", "Reorder soon"].map((f, i) => (
            <span
              key={f}
              className="rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em]"
              style={
                i === 0
                  ? { borderColor: "#18181b", backgroundColor: "#18181b", color: "#ffffff" }
                  : { borderColor: "#e4e4e7", backgroundColor: "#ffffff", color: "#71717a" }
              }
            >
              {f}
            </span>
          ))}
        </div>
        <button
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-medium text-white"
          style={{ backgroundColor: VIOLET }}
        >
          Generate PO
          <span>→</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              <th className="px-5 py-3">SKU</th>
              <th className="px-3 py-3">Product</th>
              <th className="hidden px-3 py-3 text-right md:table-cell">Stock</th>
              <th className="hidden px-3 py-3 text-right md:table-cell">Vel. /wk</th>
              <th className="hidden px-3 py-3 md:table-cell">Lead</th>
              <th className="hidden px-3 py-3 text-right lg:table-cell">Reorder</th>
              <th className="px-5 py-3 text-right">AI call</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-[11px] text-zinc-700">
            {rows.map((r, i) => (
              <tr key={i} className="bg-white">
                <td className="px-5 py-3 font-[family-name:var(--font-mono),monospace] text-[10px] text-zinc-500">{r.sku}</td>
                <td className="max-w-[240px] truncate px-3 py-3 text-zinc-800">{r.title}</td>
                <td className="hidden px-3 py-3 text-right font-medium text-zinc-800 md:table-cell">{r.stock.toLocaleString()}</td>
                <td className="hidden px-3 py-3 text-right text-zinc-600 md:table-cell">{r.velocity}</td>
                <td className="hidden px-3 py-3 text-[10px] text-zinc-500 md:table-cell">{r.lead}</td>
                <td className="hidden px-3 py-3 text-right font-semibold text-zinc-900 lg:table-cell">{r.recommend}</td>
                <td className="px-5 py-3 text-right">
                  <span
                    className="inline-block rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em]"
                    style={urgencyChipStyle(r.urgency)}
                  >
                    {urgencyLabel(r.urgency)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
