"use client";

import { useState } from "react";
import { useLiveLoop } from "../useLiveLoop";
import { Frame, Ico, type IconName } from "./shared";

type Card = { no: number; total: string; who: string; what: string; more?: number; age: string; chips?: string[]; late?: boolean };

// Invented sample quotes. Customer names are placeholders. Quotes come in at
// the bottom of "To quote" and are worked from the top, in this order.
const STREAM: Omit<Card, "no" | "age">[] = [
  { total: "£480.00", who: "Northfield Dental", what: "500 × A5 flyers, 170gsm silk", more: 1 },
  { total: "£1,250.00", who: "Client A", what: "2 × roller banners, 850mm" },
  { total: "£320.00", who: "Harbour Coffee Co", what: "1,000 × loyalty cards", more: 2 },
  { total: "£760.00", who: "Client B", what: "250 × A4 brochures, 12pp" },
  { total: "£195.00", who: "Elm Street Yoga", what: "100 × A3 posters" },
  { total: "£640.00", who: "Client C", what: "Shop window vinyl, 2 panels" },
  { total: "£410.00", who: "Riverside Vets", what: "5,000 × appointment cards", more: 1 },
  { total: "£900.00", who: "Client D", what: "50 × hardback notebooks" },
];

const WAITING: Card[] = [
  { no: 1041, total: "£540.00", who: "Oak Lane Nursery", what: "Outdoor banner, 3m", age: "2d", chips: ["Delivered"] },
  { no: 1043, total: "£210.00", who: "Client E", what: "200 × invitations, foil", age: "1d", chips: ["Opened ×1"] },
  { no: 1044, total: "£890.00", who: "Client F", what: "Exhibition stand graphics", more: 3, age: "1d", chips: ["Delivered"] },
];
const LOST: Card[] = [
  { no: 1032, total: "£1,400.00", who: "Client G", what: "10,000 × leaflets, folded", age: "6d", chips: ["Too expensive"] },
  { no: 1029, total: "£260.00", who: "Mill Road Bakery", what: "Menu boards, 4 off", age: "9d", chips: ["No reply · auto"] },
  { no: 1021, total: "£95.00", who: "Client H", what: "50 × business cards", age: "14d", chips: ["Went elsewhere"] },
];

const NAV: { label: string; icon: IconName }[] = [
  { label: "Quotes", icon: "file" },
  { label: "Jobs", icon: "layers" },
  { label: "Customers", icon: "users" },
  { label: "Analytics", icon: "chart" },
];

function QuoteCard({ c, dim, enter }: { c: Card; dim?: boolean; enter?: boolean }) {
  return (
    <div className={`bm-ap-card ${enter ? "bm-in" : ""}`} style={{ opacity: dim ? 0.6 : 1 }}>
      <div className="bm-row" style={{ fontSize: "0.82em" }}>
        <span style={{ color: "#6c6c72", fontWeight: 600 }}>QU-{c.no}</span>
        <span className="bm-sp" style={{ fontWeight: 700 }}>{c.total}</span>
      </div>
      <div className="bm-trunc" style={{ fontSize: "0.95em", fontWeight: 600, marginTop: "0.15em" }}>{c.who}</div>
      <div className="bm-trunc" style={{ fontSize: "0.8em", color: "#6c6c72" }}>
        {c.what}
        {c.more ? ` +${c.more} more` : ""}
      </div>
      <div className="bm-row" style={{ marginTop: "0.45em", gap: "0.3em" }}>
        {(c.chips ?? []).map((ch) => (
          <span key={ch} className="bm-ap-chip" style={ch.startsWith("Opened") ? { background: "#e6eefb", color: "#2a5fb4" } : undefined}>
            {ch.startsWith("Opened") && <Ico n="eye" />}
            {ch}
          </span>
        ))}
        <span className="bm-sp bm-row" style={{ gap: "0.25em", fontSize: "0.74em", color: c.late ? "#c8362c" : "#6c6c72" }}>
          <Ico n="clock" style={{ width: "1.1em", height: "1.1em" }} />
          {c.age}
        </span>
      </div>
    </div>
  );
}

export function AnyprintQuotes() {
  // One quote at a time is priced and sent: it leaves "To quote", lands at
  // the top of "Quote sent", then the customer opens it.
  const [s, setS] = useState({ i: 2, phase: 2 });
  const ref = useLiveLoop(() => setS((v) => (v.phase === 2 ? { i: v.i + 1, phase: 0 } : { i: v.i, phase: v.phase + 1 })), 2500);

  const quote = (k: number) => ({ ...STREAM[((k % STREAM.length) + STREAM.length) % STREAM.length], no: 1046 + k });
  const first = s.phase === 0 ? s.i : s.i + 1;
  const toQuote: Card[] = [];
  for (let k = first; k <= s.i + 3; k++) {
    const back = s.i + 3 - k;
    toQuote.push({ ...quote(k), total: "", age: ["1h", "3h", "6h", "1d"][back], late: back === 3 });
  }
  const newest = s.phase === 0 ? s.i - 1 : s.i;
  const sent: Card[] = [0, 1, 2].map((j) => {
    const fresh = newest - j === s.i;
    const chip = fresh ? (s.phase === 1 ? "Delivered" : "Opened ×1") : j === 2 ? "Chased 1×" : "Opened ×2";
    return { ...quote(newest - j), age: fresh ? "now" : ["2h", "5h", "1d"][j], chips: [chip] };
  });

  const cols = [
    { label: "To quote", dot: "#c8362c", hint: "oldest first", cards: toQuote, enterLast: true },
    { label: "Waiting on info", dot: "#d9a21b", hint: "", cards: WAITING },
    { label: "Quote sent", dot: "#3a78d6", hint: "latest first", cards: sent, enterFirst: true },
    { label: "Lost", dot: "#a3a3a8", hint: "last 30 days", cards: LOST, dim: true },
  ];

  return (
    <Frame loopRef={ref} className="bm-ap" label="ANYPRINT quote desk: a board of print quotes in four columns, to quote, waiting on info, quote sent and lost, with a quote moving to sent, using sample data.">
      <div className="bm-ap-side">
        <div style={{ color: "#fff", fontSize: "1.55em", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1, padding: "0 0.4em" }}>
          ANYPR<span style={{ color: "#c8362c" }}>!</span>NT
        </div>
        <div style={{ fontSize: "0.68em", letterSpacing: "0.22em", padding: "0.5em 0.95em 1.6em", fontWeight: 600 }}>QUOTE DESK</div>
        <div style={{ fontSize: "0.7em", letterSpacing: "0.08em", padding: "0 0.95em 0.5em", textTransform: "uppercase", color: "#6c6c72", fontWeight: 600 }}>Work</div>
        <div className="bm-col" style={{ gap: "0.15em" }}>
          {NAV.map((n) => (
            <div key={n.label} className={`bm-ap-lk ${n.label === "Quotes" ? "is-on" : ""}`}>
              <Ico n={n.icon} />
              {n.label}
              {n.label === "Quotes" && (
                <span className="bm-sp" style={{ background: "#c8362c", color: "#fff", borderRadius: "99em", fontSize: "0.78em", padding: "0 0.5em", fontWeight: 700 }}>{toQuote.length}</span>
              )}
            </div>
          ))}
        </div>
        <div className="bm-ap-lk" style={{ marginTop: "auto" }}>
          <Ico n="gear" />
          Settings
        </div>
      </div>

      <div className="bm-col bm-grow" style={{ padding: "1.6em 1.8em 0", gap: "1.1em", overflow: "hidden" }}>
        <div className="bm-row" style={{ alignItems: "flex-end", gap: "0.6em" }}>
          <div className="bm-col bm-grow" style={{ gap: "0.15em" }}>
            <div style={{ fontSize: "1.8em", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15 }}>Quotes</div>
            <div className="bm-trunc" style={{ fontSize: "0.92em", color: "#6c6c72" }}>{toQuote.length} to quote · {WAITING.length + sent.length} waiting on customers</div>
          </div>
          <div className="bm-ap-btn bm-s-hide" style={{ width: "12em", justifyContent: "flex-start", color: "#6c6c72", fontWeight: 500 }}>
            <Ico n="search" style={{ width: "1.15em", height: "1.15em" }} />
            Search quotes
          </div>
          <span className="bm-ap-btn bm-s-hide">Blank quote</span>
          <span className="bm-ap-btn bm-ap-btn--red">+ New from email</span>
        </div>

        <div className="bm-grid bm-grow" style={{ "--n": 4, "--ns": 3, gap: "0.8em", alignItems: "stretch", minHeight: 0 } as React.CSSProperties}>
          {cols.map((col) => (
            <div key={col.label} className={`bm-ap-colm ${col.dim ? "bm-s-hide" : ""}`}>
              <div className="bm-row" style={{ gap: "0.45em", padding: "0 0.25em" }}>
                <span className="bm-dot" style={{ color: col.dot }} />
                <span className="bm-trunc" style={{ fontSize: "0.9em", fontWeight: 600 }}>{col.label}</span>
                <span style={{ fontSize: "0.82em", color: "#6c6c72" }}>{col.cards.length}</span>
                <span className="bm-sp bm-nw bm-s-hide" style={{ fontSize: "0.72em", color: "#6c6c72" }}>{col.hint}</span>
              </div>
              {col.cards.map((c, j) => (
                <QuoteCard key={c.no} c={c} dim={col.dim} enter={(col.enterFirst && j === 0) || (col.enterLast && j === 3)} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}
