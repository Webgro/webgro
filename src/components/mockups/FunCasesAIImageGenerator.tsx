const PINK = "#F496BE";
const PINK_DEEP = "#B14F7C";

const outputs = [
  { slug: "1" },
  { slug: "2" },
  { slug: "3" },
  { slug: "4" },
];

const inputSrc = "/work/fun-cases/image-gen/input.png";

export function FunCasesAIImageGenerator() {
  return (
    <div
      className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl shadow-black/40"
      style={{ fontFamily: "var(--font-poppins), Poppins, system-ui, sans-serif" }}
    >
      {/* App header */}
      <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-3">
        <p className="text-sm font-semibold text-zinc-900">
          Fun<span style={{ color: PINK }}>Cases</span> · Image Generator
        </p>
        <span
          className="rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em]"
          style={{ borderColor: `${PINK}60`, backgroundColor: `${PINK}18`, color: PINK_DEEP }}
        >
          4 variants · 6s
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* Input */}
        <div className="flex flex-col justify-between gap-8 border-b border-zinc-200 bg-zinc-50 p-6 md:col-span-2 md:border-b-0 md:border-r md:p-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Input mockup
            </p>
            <div className="mt-5 aspect-[3/5] w-32 overflow-hidden rounded-xl border border-zinc-200 bg-white md:w-36">
              <div className="relative h-full w-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                    Phone case
                  </span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={inputSrc}
                  alt="Input phone case mockup"
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.opacity = "0";
                  }}
                />
              </div>
            </div>
          </div>
          <div>
            <p className="text-xl font-bold tracking-tight text-zinc-900 md:text-2xl">
              2 clicks.
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-600">
              4 Instagram-ready lifestyle variants. No photographer. No location.
            </p>
            <div
              className="mt-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
              style={{ borderColor: `${PINK}60`, backgroundColor: `${PINK}15` }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: PINK }} />
              <p
                className="text-[10px] font-medium uppercase tracking-[0.22em]"
                style={{ color: PINK_DEEP }}
              >
                Generated · 4 variants · 6s
              </p>
            </div>
          </div>
        </div>

        {/* Output grid */}
        <div className="grid grid-cols-2 gap-3 bg-white p-6 md:col-span-3 md:gap-4 md:p-8">
          {outputs.map((o, i) => {
            const src = `/work/fun-cases/image-gen/output-${o.slug}.png`;
            return (
              <div
                key={o.slug}
                className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
                    Variant {i + 1}
                  </span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Generated lifestyle image ${i + 1}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.opacity = "0";
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
