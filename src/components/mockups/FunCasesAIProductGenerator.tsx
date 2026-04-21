const PINK = "#F496BE";
const PINK_DEEP = "#B14F7C";

type Product = {
  label: string;
  slug: string;
  aspect: string;
};

const products: Product[] = [
  { label: "Phone Case", slug: "phone-case", aspect: "aspect-[3/5]" },
  { label: "Laptop Sleeve", slug: "laptop-sleeve", aspect: "aspect-[3/5]" },
  { label: "Lunchbox", slug: "lunchbox", aspect: "aspect-[3/5]" },
  { label: "Keyring", slug: "keyring", aspect: "aspect-[3/5]" },
  { label: "Poster", slug: "poster", aspect: "aspect-[3/5]" },
];

const uploadedDesignSrc = "/work/fun-cases/generated/design.png";

export function FunCasesAIProductGenerator() {
  return (
    <div
      className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl shadow-black/40"
      style={{ fontFamily: "var(--font-poppins), Poppins, system-ui, sans-serif" }}
    >
      {/* App header */}
      <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-3">
        <p className="text-sm font-semibold text-zinc-900">
          Fun<span style={{ color: PINK }}>Cases</span> · Product Generator
        </p>
        <span
          className="rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em]"
          style={{ borderColor: "#a7f3d0", backgroundColor: "#ecfdf5", color: "#047857" }}
        >
          Complete
        </span>
      </div>

      {/* Input bar */}
      <div className="border-b border-zinc-200 bg-zinc-50 p-6 md:p-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap items-start gap-8">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Uploaded design
              </p>
              <div className="mt-3 h-20 w-20 overflow-hidden rounded-lg border border-zinc-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={uploadedDesignSrc}
                  alt="Uploaded design"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Collection title
              </p>
              <p className="mt-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 md:text-base">
                Pocket Trinkets
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                5 products · 3 min 41s
              </p>
              <div className="mt-2 h-1.5 w-44 overflow-hidden rounded-full bg-zinc-200">
                <div
                  className="h-full"
                  style={{ width: "100%", backgroundColor: PINK }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Output grid */}
      <div className="bg-white p-6 md:p-8">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Generated · 5 products · published to Shopify
          </p>
          <span
            className="rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em]"
            style={{ borderColor: `${PINK}60`, backgroundColor: `${PINK}18`, color: PINK_DEEP }}
          >
            AI generated
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 md:gap-5">
          {products.map((p) => {
            const src = `/work/fun-cases/generated/${p.slug}.png`;
            return (
              <div key={p.slug}>
                <div
                  className={`relative ${p.aspect} overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50`}
                >
                  {/* Placeholder layer, visible until the real PNG loads */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                      {p.label}
                    </span>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={p.label}
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.opacity = "0";
                    }}
                  />
                </div>
                <p className="mt-2 truncate text-[11px] font-medium text-zinc-900">
                  {p.label}
                </p>
                <p className="mt-0.5 truncate text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                  Pocket Trinkets
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
