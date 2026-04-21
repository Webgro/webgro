type Row = {
  action: string;
  order: string;
  sku: string;
  title: string;
  from: string;
  to: string;
  qty: string;
  at: string;
  highlight?: boolean;
};

const rows: Row[] = [
  { action: "pickOrderDecrement", order: "FC349275", sku: "GHOOD1314", title: "Grey Kids Hoodie · 13–14", from: "BOX-GHOOD1314", to: "-", qty: "−1", at: "17 Apr 2026 10:53" },
  { action: "pickOrderDecrement", order: "FC348160", sku: "TUMBLER", title: "40oz Tumbler · White", from: "BOX-TUMBLER", to: "-", qty: "−1", at: "17 Apr 2026 10:53" },
  { action: "pickOrderDecrement", order: "FC349335", sku: "LUXKEY", title: "Luxury Keyring", from: "BOX-LUXKEY", to: "-", qty: "−1", at: "17 Apr 2026 10:53" },
  { action: "pickOrderDecrement", order: "FC349612", sku: "7-TGSP", title: "iPhone 6/7/8/SE · Tempered Glass Screen Protector", from: "BOX-7TGSP", to: "-", qty: "−1", at: "17 Apr 2026 10:53" },
  { action: "pickOrderDecrement", order: "SS15146", sku: "S26ULTRAFLEXCLEAR", title: "Galaxy S26 Ultra · Flexible Rubber Sides · Clear", from: "EJH6", to: "-", qty: "−4", at: "17 Apr 2026 10:53" },
  { action: "move", order: "SS15146", sku: "S26ULTRAFLEXCLEAR", title: "Galaxy S26 Ultra · Flexible Rubber Sides · Clear", from: "BOX172", to: "EJH6", qty: "+6", at: "17 Apr 2026 10:53", highlight: true },
  { action: "pickOrderDecrement", order: "FC349475", sku: "LUNCH", title: "Lunchbox", from: "BOX-LUNCH", to: "-", qty: "−1", at: "17 Apr 2026 10:53" },
  { action: "pickOrderDecrement", order: "SS15146", sku: "14PROMAXFLEXCLEAR", title: "iPhone 14 Pro Max · Flexible Rubber Sides · Clear", from: "AH5", to: "-", qty: "−3", at: "17 Apr 2026 10:53" },
  { action: "pickOrderDecrement", order: "FC349448", sku: "S25FLEXCLEAR", title: "Galaxy S25 · Flexible Rubber Sides · Clear", from: "AJ10", to: "-", qty: "−2", at: "17 Apr 2026 10:53" },
  { action: "pickOrderDecrement", order: "FC349448", sku: "LAPTOP-LARGE", title: "Large Laptop Sleeve · 15–16", from: "BOX-LAPTOP-LARGE", to: "-", qty: "−1", at: "17 Apr 2026 10:53" },
];

const nav = {
  Actions: [
    "Adjust Stock",
    "Book In",
    "Move Stock",
    "Find Stock",
    "Stock Value",
    "Pick Orders",
    "Bulk Pick",
    "Stock Takes",
    "Request Order",
  ],
  Manage: ["SKUs", "Locations", "Inventory", "Movement History", "Order Requests"],
  Admin: ["Users", "Backups", "Shopify", "Analytics"],
};

const PINK = "#F496BE";

export function FunCasesWMS() {
  return (
    <div
      className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl shadow-black/40"
      style={{ fontFamily: "var(--font-poppins), Poppins, system-ui, sans-serif" }}
    >
      {/* App chrome */}
      <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-bold tracking-tight text-zinc-900">
            Fun<span style={{ color: PINK }}>Cases</span>
          </span>
          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-600">
            Stock System
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white"
            style={{ backgroundColor: PINK }}
          >
            MB
          </div>
          <span className="hidden text-xs font-medium text-zinc-700 md:inline">Michael</span>
        </div>
      </div>

      <div className="grid min-h-[480px] grid-cols-1 md:grid-cols-[180px_1fr]">
        {/* Sidebar */}
        <aside className="hidden border-r border-zinc-200 bg-zinc-50 py-5 md:block">
          {Object.entries(nav).map(([section, items]) => (
            <div key={section} className="mb-5">
              <p className="mb-2 px-5 text-[9px] font-semibold uppercase tracking-[0.25em] text-zinc-400">
                {section}
              </p>
              <ul>
                {items.map((item) => {
                  const active = item === "Movement History";
                  return (
                    <li key={item}>
                      <span
                        className="flex items-center justify-between px-5 py-1.5 text-[11px]"
                        style={
                          active
                            ? { background: `${PINK}20`, color: PINK, fontWeight: 500 }
                            : { color: "#52525b" }
                        }
                      >
                        <span>{item}</span>
                        {active && (
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: PINK }}
                          />
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </aside>

        {/* Main */}
        <div className="bg-white p-5 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
              Movement History
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-medium text-zinc-600">
                  01/04/2026
                </div>
                <span className="text-[10px] text-zinc-400">→</span>
                <div className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-medium text-zinc-600">
                  17/04/2026
                </div>
              </div>
              <button className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-medium text-zinc-800 hover:bg-zinc-50">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M5 1v6m0 0L3 5m2 2l2-2M2 9h6" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Export
              </button>
            </div>
          </div>

          {/* Stat strip */}
          <div className="mt-5 grid grid-cols-3 gap-3 md:gap-4">
            {[
              { label: "Movements · today", value: "128" },
              { label: "AI-recommended restocks", value: "14" },
              { label: "Pick accuracy · 7d", value: "99.4%" },
            ].map((s, i) => (
              <div key={i} className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  {s.label}
                </p>
                <p className="mt-1 text-lg font-bold tracking-tight text-zinc-900 md:text-xl">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="mt-5 overflow-hidden rounded-xl border border-zinc-200">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50 text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  <th className="px-3 py-2.5">Action</th>
                  <th className="hidden px-3 py-2.5 lg:table-cell">Order #</th>
                  <th className="hidden px-3 py-2.5 md:table-cell">SKU</th>
                  <th className="px-3 py-2.5">Title</th>
                  <th className="hidden px-3 py-2.5 lg:table-cell">From</th>
                  <th className="px-3 py-2.5 text-right">Qty</th>
                  <th className="hidden px-3 py-2.5 md:table-cell">At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-[11px] text-zinc-700">
                {rows.map((r, i) => (
                  <tr
                    key={i}
                    style={r.highlight ? { backgroundColor: `${PINK}14` } : undefined}
                  >
                    <td className="px-3 py-2.5">
                      <span
                        className="inline-block rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em]"
                        style={
                          r.action === "move"
                            ? { borderColor: `${PINK}60`, backgroundColor: `${PINK}20`, color: "#B14F7C" }
                            : { borderColor: "#e4e4e7", backgroundColor: "#fafafa", color: "#71717a" }
                        }
                      >
                        {r.action}
                      </span>
                    </td>
                    <td className="hidden px-3 py-2.5 text-[10px] text-zinc-500 lg:table-cell">{r.order}</td>
                    <td className="hidden px-3 py-2.5 text-[10px] text-zinc-500 md:table-cell">{r.sku}</td>
                    <td className="max-w-[220px] truncate px-3 py-2.5 text-zinc-800">{r.title}</td>
                    <td className="hidden px-3 py-2.5 text-[10px] text-zinc-500 lg:table-cell">{r.from}</td>
                    <td
                      className="px-3 py-2.5 text-right text-[11px] font-semibold"
                      style={r.qty.startsWith("+") ? { color: "#B14F7C" } : { color: "#18181b" }}
                    >
                      {r.qty}
                    </td>
                    <td className="hidden px-3 py-2.5 text-[10px] text-zinc-400 md:table-cell">{r.at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
