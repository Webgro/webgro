type RoutedOrder = {
  order: string;
  item: string;
  model: string;
  caseType: string;
  route: "auto" | "manual";
  destination: string;
  status: string;
  statusKind: "printed" | "printing" | "queued";
  highlight?: boolean;
};

const orders: RoutedOrder[] = [
  { order: "FC351208", item: "Strawberry Stripes", model: "iPhone 16", caseType: "Standard", route: "auto", destination: "Machine 2", status: "Printed · 1m 52s", statusKind: "printed" },
  { order: "FC351207", item: "Custom Photo", model: "iPhone 15 Pro", caseType: "Standard MagSafe", route: "auto", destination: "Machine 3", status: "Printing…", statusKind: "printing", highlight: true },
  { order: "FC351206", item: "Cartoon Beagle Sleeping", model: "Galaxy S25", caseType: "Tough", route: "manual", destination: "In-house queue", status: "Queued · #4", statusKind: "queued" },
  { order: "FC351205", item: "Design Your Own", model: "iPhone 16", caseType: "Clear", route: "auto", destination: "Machine 1", status: "Printed · 1m 47s", statusKind: "printed" },
  { order: "FC351204", item: "Norris Helmet Pattern", model: "Pixel 9", caseType: "Standard", route: "manual", destination: "In-house queue", status: "Queued · #3", statusKind: "queued" },
  { order: "FC351203", item: "Pastel Picnic", model: "iPhone 14", caseType: "Standard", route: "auto", destination: "Machine 2", status: "Printed · 1m 58s", statusKind: "printed" },
  { order: "FC351202", item: "A Hug Said Pooh", model: "iPhone 16 Pro Max", caseType: "MagSafe Tough", route: "manual", destination: "In-house queue", status: "Queued · #2", statusKind: "queued" },
  { order: "FC351201", item: "Abstract Patterns", model: "iPhone 13", caseType: "Standard", route: "auto", destination: "Machine 1", status: "Printed · 1m 44s", statusKind: "printed" },
];

const PINK = "#F496BE";
const GREEN = "#16a34a";
const AMBER = "#b45309";

export function FunCasesOrderRouting() {
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
            Order Routing
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-emerald-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live
          </span>
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white"
            style={{ backgroundColor: PINK }}
          >
            MB
          </div>
        </div>
      </div>

      <div className="bg-white p-5 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
            Routing feed
          </h3>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">
            Today · 28 Jul
          </p>
        </div>

        {/* Lane summary */}
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
                Automatic print
              </p>
              <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-emerald-600">
                3 machines online
              </p>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-lg font-bold tracking-tight text-zinc-900 md:text-xl">318</p>
              <p className="text-[10px] text-zinc-500">orders today · avg 1m 48s to print</p>
            </div>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-amber-700">
                Manual print
              </p>
              <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-amber-600">
                In-house
              </p>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-lg font-bold tracking-tight text-zinc-900 md:text-xl">86</p>
              <p className="text-[10px] text-zinc-500">orders today · queue of 4</p>
            </div>
          </div>
        </div>

        {/* Feed table */}
        <div className="mt-5 overflow-hidden rounded-xl border border-zinc-200">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50 text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                <th className="hidden px-3 py-2.5 lg:table-cell">Order #</th>
                <th className="px-3 py-2.5">Item</th>
                <th className="hidden px-3 py-2.5 md:table-cell">Model · Case type</th>
                <th className="px-3 py-2.5">Route</th>
                <th className="hidden px-3 py-2.5 lg:table-cell">Destination</th>
                <th className="px-3 py-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-[11px] text-zinc-700">
              {orders.map((o, i) => (
                <tr key={i} style={o.highlight ? { backgroundColor: `${PINK}14` } : undefined}>
                  <td className="hidden px-3 py-2.5 text-[10px] text-zinc-500 lg:table-cell">
                    {o.order}
                  </td>
                  <td className="max-w-[160px] truncate px-3 py-2.5 text-zinc-800">{o.item}</td>
                  <td className="hidden px-3 py-2.5 text-[10px] text-zinc-500 md:table-cell">
                    {o.model} · {o.caseType}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className="inline-block rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em]"
                      style={
                        o.route === "auto"
                          ? { borderColor: "#bbf7d0", backgroundColor: "#f0fdf4", color: GREEN }
                          : { borderColor: "#fde68a", backgroundColor: "#fffbeb", color: AMBER }
                      }
                    >
                      {o.route === "auto" ? "Auto print" : "Manual print"}
                    </span>
                  </td>
                  <td className="hidden px-3 py-2.5 text-[10px] text-zinc-500 lg:table-cell">
                    {o.destination}
                  </td>
                  <td
                    className="px-3 py-2.5 text-right text-[10px] font-semibold"
                    style={
                      o.statusKind === "printed"
                        ? { color: GREEN }
                        : o.statusKind === "printing"
                        ? { color: "#B14F7C" }
                        : { color: "#71717a" }
                    }
                  >
                    {o.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
