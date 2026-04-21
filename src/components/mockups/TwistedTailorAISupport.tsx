const tickets = [
  {
    initial: "T",
    name: "Theo Bennett",
    subject: "What's the fit on the Vegas two-piece?",
    status: "drafted" as const,
    time: "3m",
  },
  {
    initial: "R",
    name: "Rhea Kapoor",
    subject: "Can I return a jacket without the trouser?",
    status: "drafted" as const,
    time: "11m",
    active: true,
  },
  {
    initial: "C",
    name: "Callum Owens",
    subject: "Order #TT-48201, shipping to Dublin",
    status: "sent" as const,
    time: "24m",
  },
  {
    initial: "N",
    name: "Nadia Ferrell",
    subject: "Tailoring on the Monarch tux, possible?",
    status: "review" as const,
    time: "1h",
  },
];

const statusLabel: Record<string, string> = {
  drafted: "AI drafted",
  review: "Needs review",
  sent: "Sent",
};

function statusChip(status: string): React.CSSProperties {
  if (status === "drafted") {
    return { borderColor: "#18181b", backgroundColor: "#f4f4f5", color: "#18181b" };
  }
  if (status === "sent") {
    return { borderColor: "#d4d4d8", backgroundColor: "#ffffff", color: "#52525b" };
  }
  return { borderColor: "#e4e4e7", backgroundColor: "#fafafa", color: "#71717a" };
}

export function TwistedTailorAISupport() {
  return (
    <div
      className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl shadow-black/40"
      style={{ fontFamily: "var(--font-poppins), Poppins, system-ui, sans-serif" }}
    >
      {/* App header */}
      <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="text-white">
              <path
                d="M2 3.5h10v6H7l-3 2v-2H2z"
                stroke="currentColor"
                strokeWidth="1.1"
                fill="none"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p
            className="text-sm font-semibold uppercase tracking-[0.16em] text-black"
            style={{ letterSpacing: "0.14em" }}
          >
            Twisted Tailor · Support Agent
          </p>
        </div>
        <div className="hidden items-center gap-5 text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500 md:flex">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-black" />9 drafted
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
            14 sent · today
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="grid min-h-[380px] grid-cols-1 md:grid-cols-5">
        {/* Ticket list */}
        <div className="border-b border-zinc-200 bg-zinc-50 md:col-span-2 md:border-b-0 md:border-r">
          <div className="border-b border-zinc-200 px-5 py-3">
            <div className="flex gap-2">
              {["All", "AI drafted", "Sent"].map((f, i) => (
                <span
                  key={f}
                  className="rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em]"
                  style={
                    i === 1
                      ? { borderColor: "#18181b", backgroundColor: "#18181b", color: "#ffffff" }
                      : { borderColor: "#e4e4e7", backgroundColor: "#ffffff", color: "#71717a" }
                  }
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div className="divide-y divide-zinc-100">
            {tickets.map((t, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-5 py-3.5"
                style={t.active ? { backgroundColor: "#f4f4f5" } : undefined}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                  {t.initial}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs font-medium text-zinc-900">{t.name}</p>
                    <span className="shrink-0 text-[10px] text-zinc-400">{t.time}</span>
                  </div>
                  <p className="mt-1 truncate text-[11px] leading-snug text-zinc-600">{t.subject}</p>
                  <div className="mt-1.5">
                    <span
                      className="inline-block rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em]"
                      style={statusChip(t.status)}
                    >
                      {statusLabel[t.status]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div className="flex flex-col bg-white md:col-span-3">
          <div className="border-b border-zinc-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                R
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-zinc-900">Rhea Kapoor</p>
                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                  Return query · Order #TT-48176
                </p>
              </div>
              <span
                className="shrink-0 rounded-full border px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.2em]"
                style={{ borderColor: "#18181b", backgroundColor: "#f4f4f5", color: "#18181b" }}
              >
                AI drafted
              </span>
            </div>
          </div>
          <div className="flex-1 space-y-4 px-6 py-5">
            {/* Customer message */}
            <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-zinc-100 p-4">
              <p className="text-sm leading-relaxed text-zinc-800">
                Hi, I bought the Vegas two-piece last week but the trouser fit isn&rsquo;t right. Can I return just the trouser and keep the jacket?
              </p>
              <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">
                Customer · 11 min ago
              </p>
            </div>
            {/* AI draft */}
            <div
              className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md border p-4"
              style={{ borderColor: "#18181b", backgroundColor: "#ffffff" }}
            >
              <div className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-black" />
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-black">
                  AI draft · ready to review
                </p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-900">
                Hi Rhea, because the Vegas is sold as a paired two-piece, returning the trouser alone would break the set. I can either arrange a full return (jacket + trouser) or a size-swap on just the trouser if you&rsquo;d like to keep the jacket. Which works better?
              </p>
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-3 border-t border-zinc-200 bg-zinc-50 px-6 py-4">
            <button className="rounded-full bg-black px-5 py-2 text-xs font-semibold text-white hover:bg-zinc-800">
              Approve &amp; send
            </button>
            <button className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-800 hover:bg-zinc-50">
              Edit
            </button>
            <button className="ml-auto text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">
              Regenerate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
