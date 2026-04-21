const VIOLET = "#7C3AED";
const VIOLET_SOFT = "#EDE9FE";

type Competitor = {
  brand: string;
  product: string;
  price: string;
  change: "down" | "up" | "flat" | "stockout";
  delta?: string;
  active?: boolean;
};

const competitors: Competitor[] = [
  { brand: "Subliblanks", product: "Phone Case · iPhone 17", price: "£4.20", change: "down", delta: "−14%", active: true },
  { brand: "Dye Sublimation Supplies", product: "40oz Sublimation Tumbler", price: "Out of stock", change: "stockout" },
  { brand: "Longforte", product: "Water Bottle · White", price: "£5.80", change: "up", delta: "+9%" },
  { brand: "Xpres", product: "11oz Mug · White", price: "£1.25", change: "flat" },
  { brand: "Get Sublimation Supplies", product: "T-shirt · Adult L", price: "£3.40", change: "flat" },
];

function deltaStyle(change: Competitor["change"]): React.CSSProperties {
  if (change === "down") return { borderColor: VIOLET, backgroundColor: VIOLET_SOFT, color: VIOLET };
  if (change === "up") return { borderColor: "#F59E0B", backgroundColor: "#FEF3C7", color: "#B45309" };
  if (change === "stockout") return { borderColor: "#EF4444", backgroundColor: "#FEE2E2", color: "#B91C1C" };
  return { borderColor: "#e4e4e7", backgroundColor: "#fafafa", color: "#71717a" };
}

function deltaLabel(change: Competitor["change"]): string {
  if (change === "down") return "Price drop";
  if (change === "up") return "Price up";
  if (change === "stockout") return "Stockout";
  return "Stable";
}

// Simple SVG sparkline, the price is falling for the active competitor
function Sparkline({ direction }: { direction: "down" | "up" | "flat" | "stockout" }) {
  let path = "M2 12 L10 11 L18 10 L26 10 L34 9 L42 9 L50 10 L58 10"; // flat
  if (direction === "down") path = "M2 4 L10 5 L18 6 L26 5 L34 8 L42 10 L50 12 L58 14";
  if (direction === "up") path = "M2 14 L10 13 L18 12 L26 10 L34 9 L42 7 L50 5 L58 4";
  if (direction === "stockout") path = "M2 6 L18 6 L18 16 L58 16";
  const color = direction === "down" ? VIOLET : direction === "up" ? "#B45309" : direction === "stockout" ? "#B91C1C" : "#a1a1aa";
  return (
    <svg width="60" height="18" viewBox="0 0 60 18" fill="none" aria-hidden="true">
      <path d={path} stroke={color} strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Chart on the right, price history of the active competitor
function PriceChart() {
  // 14 data points, trending from £4.89 down to £4.20
  const points = [4.89, 4.89, 4.89, 4.80, 4.80, 4.70, 4.70, 4.60, 4.50, 4.45, 4.50, 4.35, 4.20, 4.20];
  const max = 5.0;
  const min = 4.0;
  const w = 320;
  const h = 100;
  const step = w / (points.length - 1);
  const y = (v: number) => h - ((v - min) / (max - min)) * h;
  const coords = points.map((v, i) => `${i * step},${y(v)}`).join(" ");
  const d = `M${coords.replace(/ /g, " L")}`;
  const areaD = `M0,${h} L${coords.replace(/ /g, " L")} L${w},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="pt-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={VIOLET} stopOpacity="0.3" />
          <stop offset="100%" stopColor={VIOLET} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#pt-fill)" />
      <path d={d} stroke={VIOLET} strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function SublishopCompetitorTracker() {
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
              <path d="M2 10l3-4 3 2 4-6" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-zinc-900">
            Sublishop · <span style={{ color: VIOLET }}>Competitor Tracker</span>
          </p>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <span
            className="rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em]"
            style={{ borderColor: VIOLET, backgroundColor: VIOLET_SOFT, color: VIOLET }}
          >
            3 new alerts · 24h
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
        {/* Left, competitor list */}
        <div className="border-b border-zinc-200 bg-zinc-50 md:col-span-2 md:border-b-0 md:border-r">
          <div className="border-b border-zinc-200 px-5 py-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Tracked products · 5
            </p>
          </div>
          <div className="divide-y divide-zinc-100">
            {competitors.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3.5"
                style={c.active ? { backgroundColor: VIOLET_SOFT } : undefined}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-900">
                      {c.brand}
                    </p>
                    <p className="text-xs font-medium text-zinc-800">{c.price}</p>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-zinc-600">{c.product}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span
                      className="inline-block rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em]"
                      style={deltaStyle(c.change)}
                    >
                      {deltaLabel(c.change)}
                      {c.delta ? ` · ${c.delta}` : ""}
                    </span>
                    <Sparkline direction={c.change} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right, detail panel */}
        <div className="flex flex-col bg-white md:col-span-3">
          <div className="border-b border-zinc-200 px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  Subliblanks · Phone Case · iPhone 17
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
                  £4.20
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    14-day change
                  </p>
                  <p className="mt-1 text-lg font-bold tracking-tight" style={{ color: VIOLET }}>
                    −14%
                  </p>
                </div>
                <span
                  className="rounded-full border px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.2em]"
                  style={{ borderColor: VIOLET, backgroundColor: VIOLET_SOFT, color: VIOLET }}
                >
                  Price drop
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="h-32">
              <PriceChart />
            </div>
            <div className="mt-3 flex justify-between font-[family-name:var(--font-mono),monospace] text-[9px] uppercase tracking-[0.18em] text-zinc-400">
              <span>14 Apr</span>
              <span>21 Apr</span>
              <span>28 Apr</span>
            </div>
          </div>

          <div className="border-t border-zinc-200 px-6 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Recent alerts
            </p>
            <ul className="mt-3 space-y-2 text-[11px] text-zinc-700">
              <li className="flex items-start gap-2">
                <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: VIOLET }} />
                <span><strong className="text-zinc-900">Subliblanks</strong> dropped iPhone 17 Phone Case to £4.20 <span className="text-zinc-400">· 2h ago</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                <span><strong className="text-zinc-900">Dye Sublimation Supplies</strong> out of stock on 40oz Tumbler <span className="text-zinc-400">· 6h ago</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                <span><strong className="text-zinc-900">Longforte</strong> raised White Water Bottle to £5.80 <span className="text-zinc-400">· 1d ago</span></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
