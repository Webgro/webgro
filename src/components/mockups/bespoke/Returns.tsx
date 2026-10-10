"use client";

import { useState } from "react";
import { useLiveLoop } from "../useLiveLoop";
import { Art, Frame, HubShell } from "./shared";

type Status = "Awaiting parcel" | "Received" | "On hold" | "Refunded" | "Rejected" | "Cancelled";

const TONE: Record<Status, [string, string]> = {
  "Awaiting parcel": ["#fff1c2", "#e0a800"],
  Received: ["#dff3fd", "#189bd6"],
  "On hold": ["#ffe6d2", "#ff8a26"],
  Refunded: ["#dff5d8", "#58bb46"],
  Rejected: ["#ffe3df", "#f03e2e"],
  Cancelled: ["#efeadf", "#8f897b"],
};

type Row = { order: string; ref: string; name: string; email: string; item: string; more?: number; arts: number[]; method: string; refund: string; booked: string; status: Status };

// Invented sample returns. The live row at the top takes these in turn.
const LIVE: Omit<Row, "status" | "booked">[] = [
  { order: "#10482", ref: "RTN-2041", name: "Jess M.", email: "jess.m@example.com", item: "Leopard case, iPhone 17 Pro", arts: [0], method: "Royal Mail label", refund: "£12.00" },
  { order: "#10466", ref: "RTN-2042", name: "Omar K.", email: "omar.k@example.com", item: "Checker case, Galaxy S26", more: 1, arts: [2, 5], method: "Royal Mail label", refund: "£21.00" },
  { order: "#10451", ref: "RTN-2043", name: "Priya S.", email: "priya.s@example.com", item: "Stripe case, iPhone 16", arts: [1], method: "Own postage", refund: "£15.00" },
];

const REST: Row[] = [
  { order: "#10437", ref: "RTN-2040", name: "Tom B.", email: "tom.b@example.com", item: "Dotty case, Pixel 10", arts: [3], method: "Keep it", refund: "£7.50", booked: "2h ago", status: "Refunded" },
  { order: "#10420", ref: "RTN-2039", name: "Ana R.", email: "ana.r@example.com", item: "Screen protector, iPhone 17", more: 2, arts: [4, 6, 7], method: "Royal Mail label", refund: "£34.00", booked: "5h ago", status: "On hold" },
  { order: "#10398", ref: "RTN-2038", name: "Lee W.", email: "lee.w@example.com", item: "Tumbler, white", arts: [7], method: "Own postage", refund: "£18.00", booked: "Yesterday", status: "Awaiting parcel" },
  { order: "#10377", ref: "RTN-2037", name: "Mia D.", email: "mia.d@example.com", item: "Leopard case, iPhone 16", arts: [0], method: "Royal Mail label", refund: "£12.00", booked: "Yesterday", status: "Rejected" },
  { order: "#10352", ref: "RTN-2036", name: "Sam P.", email: "sam.p@example.com", item: "Gradient case, Galaxy S26", more: 1, arts: [6, 2], method: "Keep it", refund: "£9.00", booked: "2 days ago", status: "Refunded" },
  { order: "#10340", ref: "RTN-2035", name: "Kit H.", email: "kit.h@example.com", item: "Laptop sleeve, 15 inch", arts: [5], method: "Own postage", refund: "£24.00", booked: "3 days ago", status: "Cancelled" },
];

const PHASES: Status[] = ["Awaiting parcel", "Received", "Refunded"];
const COLS = {
  "--cols": "6.6em minmax(0,1.05fr) minmax(0,1.5fr) 8.4em 4.4em 5.4em 8.6em",
  "--cols-s": "6em minmax(0,1fr) 4.4em 8.8em",
} as React.CSSProperties;

function Chip({ s }: { s: Status }) {
  return (
    <span className="bm-rt-chip" style={{ background: TONE[s][0] }}>
      <i style={{ background: TONE[s][1] }} />
      {s}
    </span>
  );
}

export function Returns() {
  // The top return is booked, scanned in at the warehouse, then refunded.
  const [s, setS] = useState({ i: 0, phase: 2 });
  const ref = useLiveLoop(() => setS((v) => (v.phase === 2 ? { i: v.i + 1, phase: 0 } : { i: v.i, phase: v.phase + 1 })), 2400);

  const live: Row = { ...LIVE[s.i % LIVE.length], booked: s.phase === 0 ? "Just now" : "12 min ago", status: PHASES[s.phase] };
  const rows = [live, ...REST];
  const awaiting = 14 + (s.phase === 0 ? 1 : 0);
  const attention = 3 + (s.phase === 1 ? 1 : 0);
  const refunded = 420 + s.i * 12 + (s.phase === 2 ? 12 : 0);

  const stats = [
    { l: "Awaiting parcel", v: String(awaiting), h: "Label issued, not yet scanned" },
    { l: "Needs attention", v: String(attention), h: "Received, rejected or errored" },
    { l: "Refunded, last 7 days", v: `£${refunded}`, h: "31 refunded in total" },
  ];

  return (
    <Frame loopRef={ref} className="bm-hub" label="Returns: counts of returns awaiting a parcel, needing attention and refunded, above a list of returns with customer, items, method, refund and status, with sample data.">
      <HubShell
        rail="returns"
        workspace="Returns"
        mainClass="bm-rt"
        nav={[
          {
            links: [
              { label: "Returns", icon: "undo", on: true },
              { label: "Scan returns", icon: "scan" },
              { label: "Scan RTS", icon: "box" },
              { label: "Pre-portal refunds", icon: "pound" },
              { label: "Analytics", icon: "chart" },
              { label: "Settings", icon: "gear" },
            ],
          },
        ]}
      >
        <div className="bm-row" style={{ alignItems: "flex-end", gap: "0.9em" }}>
          <div className="bm-col bm-grow" style={{ gap: "0.4em" }}>
            <div className="bm-h1">Returns</div>
            <div className="bm-sub bm-trunc">38 booked in the last 7 days</div>
          </div>
          <span className="bm-rt-btn bm-s-hide">Pre-portal refund</span>
          <span className="bm-rt-btn bm-rt-btn--sun">Scan a parcel</span>
        </div>

        <div className="bm-grid" style={{ "--n": 4, "--ns": 3, gap: "0.9em" } as React.CSSProperties}>
          {stats.map((t) => (
            <div key={t.l} className="bm-rt-panel bm-tile">
              <div className="bm-lbl bm-trunc">{t.l}</div>
              <div className="bm-tile-v">{t.v}</div>
              <div className="bm-tile-h">{t.h}</div>
            </div>
          ))}
          <div className="bm-rt-panel bm-tile bm-s-hide">
            <div className="bm-lbl">Trends</div>
            <div className="bm-row" style={{ alignItems: "flex-end", gap: "0.22em", height: "2.05em", margin: "0.15em 0" }}>
              {[5, 8, 6, 9, 7, 11, 8, 10, 12, 9].map((h, i) => (
                <span key={i} style={{ flex: 1, height: `${h * 8}%`, background: i === 8 ? "#ffc933" : "#161616", borderRadius: "0.2em" }} />
              ))}
            </div>
            <div className="bm-tile-h" style={{ color: "#189bd6", fontWeight: 800 }}>Open analytics →</div>
          </div>
        </div>

        <div className="bm-row" style={{ gap: "0.25em" }}>
          {[
            ["All", 38],
            ["Awaiting parcel", awaiting],
            ["Needs attention", attention],
            ["Refunded", 19],
            ["Cancelled", 2],
          ].map(([t, n], i) => (
            <span key={t} className={`bm-rt-tab ${i === 0 ? "is-on" : ""} ${i > 2 ? "bm-s-hide" : ""}`}>
              {t} <span>{n}</span>
            </span>
          ))}
          <div className="bm-input bm-sp bm-s-hide" style={{ border: "0.15em solid #161616", borderRadius: "99em", width: "17em", fontSize: "0.85em" }}>
            <span className="bm-ph bm-trunc">Search order, name, email, tracking</span>
          </div>
        </div>

        <div className="bm-rt-panel" style={{ overflow: "hidden" }}>
          <div className="bm-tr bm-th" style={{ ...COLS, borderBottomWidth: "0.15em" }}>
            <span>Return</span>
            <span>Customer</span>
            <span className="bm-s-hide">Items</span>
            <span className="bm-s-hide">Method</span>
            <span className="bm-r">Refund</span>
            <span className="bm-s-hide">Booked</span>
            <span>Status</span>
          </div>
          {rows.map((r, j) => (
            <div key={r.ref} className={`bm-tr ${j === 0 ? "bm-in" : ""}`} style={{ ...COLS, paddingTop: "0.5em", paddingBottom: "0.5em" }}>
              <span className="bm-col">
                <span className="bm-mono">{r.order}</span>
                <span className="bm-cap bm-trunc" style={{ fontSize: "0.82em" }}>{r.ref}</span>
              </span>
              <span className="bm-col">
                <span className="bm-trunc" style={{ fontWeight: 800 }}>{r.name}</span>
                <span className="bm-cap bm-trunc" style={{ fontSize: "0.82em" }}>{r.email}</span>
              </span>
              <span className="bm-row bm-s-hide" style={{ gap: "0.35em" }}>
                {r.arts.map((k) => (
                  <Art key={k} k={k} style={{ width: "2.2em", height: "2.2em", borderRadius: "0.45em", border: "0.12em solid #161616" }} />
                ))}
                <span className="bm-trunc" style={{ marginLeft: "0.2em" }}>
                  {r.item}
                  {r.more ? <span className="bm-mut"> +{r.more} more</span> : null}
                </span>
              </span>
              <span className="bm-s-hide"><span className="bm-rt-chip" style={{ background: "#fff", border: "0.12em solid #161616" }}>{r.method}</span></span>
              <span className="bm-r" style={{ fontWeight: 800 }}>{r.refund}</span>
              <span className="bm-cap bm-nw bm-s-hide">{r.booked}</span>
              <span><Chip s={r.status} /></span>
            </div>
          ))}
        </div>
      </HubShell>
    </Frame>
  );
}
