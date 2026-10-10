"use client";

import { useState } from "react";
import { useLiveLoop } from "../useLiveLoop";
import { Frame, HubShell, stockNav } from "./shared";

type Move = { sku: string; action: string; order: string; qty: number };

// Invented sample movements. The live slot at the top rotates through them.
const POOL: Move[] = [
  { sku: "17PRO-CLR", action: "pick", order: "#10482", qty: -1 },
  { sku: "S26-FLEX-BLK", action: "pick", order: "#10483", qty: -2 },
  { sku: "TUMBLER-WHT", action: "book in", order: "PO-0142", qty: 48 },
  { sku: "16-TOUGH-BLK", action: "pick", order: "#10484", qty: -1 },
  { sku: "LAPTOP-15", action: "move", order: "A-12 to B-03", qty: 6 },
  { sku: "17PM-CLR", action: "pick", order: "#10485", qty: -3 },
  { sku: "KEYRING-LUX", action: "adjust", order: "stock take", qty: -4 },
  { sku: "PIXEL10-CLR", action: "pick", order: "#10486", qty: -1 },
  { sku: "17-GLASS", action: "pick", order: "#10487", qty: -2 },
  { sku: "S26U-CLR", action: "book in", order: "PO-0142", qty: 120 },
];

const MOVERS = [
  { sku: "17PRO-CLR", title: "Clear case, iPhone 17 Pro", n: 214, vol: 322, net: -298 },
  { sku: "17PM-CLR", title: "Clear case, iPhone 17 Pro Max", n: 187, vol: 260, net: -236 },
  { sku: "S26-FLEX-BLK", title: "Flex case, Galaxy S26, black", n: 122, vol: 171, net: -171 },
  { sku: "17-GLASS", title: "Screen protector, iPhone 17", n: 96, vol: 140, net: 60 },
  { sku: "TUMBLER-WHT", title: "Tumbler, white", n: 61, vol: 118, net: 34 },
  { sku: "16-TOUGH-BLK", title: "Tough case, iPhone 16, black", n: 58, vol: 74, net: -74 },
  { sku: "LAPTOP-15", title: "Laptop sleeve, 15 inch", n: 33, vol: 41, net: -29 },
  { sku: "KEYRING-LUX", title: "Keyring, luxury", n: 27, vol: 38, net: -38 },
];

const ROWS = 8;

export function StockPlanning() {
  const [n, setN] = useState(0);
  const ref = useLiveLoop(() => setN((v) => v + 1), 2800);

  const shown = Array.from({ length: ROWS }, (_, j) => {
    const id = n + ROWS - 1 - j;
    return { id, m: POOL[id % POOL.length] };
  });

  const tiles = [
    { l: "Total SKUs", v: "412", h: "18 discontinued", s: true },
    { l: "Units in stock", v: "28,450", h: "Across 96 locations", s: true },
    { l: "Out of stock", v: "3", h: "Nothing on the shelf", c: "#f03e2e" },
    { l: "Low stock", v: "9", h: "One pack or less left", c: "#b98500" },
    { l: "Movements today", v: String(128 + n), h: "860 in 7 days", c: "#2b7a1e" },
  ];

  return (
    <Frame loopRef={ref} className="bm-hub" label="Stock planning overview: stock totals, low and out of stock counts, recent movements and top movers, with sample data.">
      <HubShell rail="stock" workspace="Stock" nav={stockNav("planning:Overview", ["manage", "planning", "admin"])}>
        <div className="bm-col" style={{ gap: "0.5em" }}>
          <div className="bm-h1">Stock.</div>
          <div className="bm-sub bm-s-hide">Live figures from the warehouse stock system.</div>
        </div>

        <div className="bm-grid" style={{ "--n": 5, "--ns": 3 } as React.CSSProperties}>
          {tiles.map((t) => (
            <div key={t.l} className={`bm-card bm-tile ${t.s ? "bm-s-hide" : ""}`}>
              <div className="bm-lbl">{t.l}</div>
              <div className="bm-tile-v" style={{ color: t.c }}>{t.v}</div>
              <div className="bm-tile-h">{t.h}</div>
            </div>
          ))}
        </div>

        <div className="bm-grid" style={{ "--n": 2, gap: "1em" } as React.CSSProperties}>
          <div className="bm-card" style={{ overflow: "hidden" }}>
            <div className="bm-card-h">
              <span className="bm-card-t">Recent movements</span>
              <span className="bm-sp bm-cap" style={{ color: "#189bd6", fontWeight: 800 }}>See all</span>
            </div>
            {shown.map(({ id, m }, j) => (
              <div key={id} className={`bm-row ${j === 0 ? "bm-in" : ""}`} style={{ padding: "0.55em 1.1em", borderTop: "1px solid rgba(22,22,22,.08)" }}>
                <div className="bm-col bm-grow">
                  <span className="bm-mono bm-trunc" style={{ fontSize: "0.95em" }}>{m.sku}</span>
                  <span className="bm-cap bm-trunc">
                    {m.action} · {m.order} · 10 Oct, {j === 0 ? "now" : `10:${String(53 - j * 3).padStart(2, "0")}`}
                  </span>
                </div>
                <span className="bm-mono" style={{ color: m.qty > 0 ? "#2b7a1e" : "#161616" }}>
                  {m.qty > 0 ? `+${m.qty}` : `−${Math.abs(m.qty)}`}
                </span>
              </div>
            ))}
          </div>

          <div className="bm-card" style={{ overflow: "hidden" }}>
            <div className="bm-card-h">
              <span className="bm-card-t">Top movers</span>
              <span className="bm-sp bm-cap">Last 7 days</span>
            </div>
            {MOVERS.map((m) => (
              <div key={m.sku} className="bm-row" style={{ padding: "0.55em 1.1em", borderTop: "1px solid rgba(22,22,22,.08)" }}>
                <div className="bm-col bm-grow">
                  <span className="bm-mono bm-trunc" style={{ fontSize: "0.95em" }}>{m.sku}</span>
                  <span className="bm-cap bm-trunc">
                    {m.title} · {m.n} movements
                  </span>
                </div>
                <div className="bm-col" style={{ alignItems: "flex-end" }}>
                  <span style={{ fontWeight: 800 }}>{m.vol}</span>
                  <span className="bm-cap bm-nw">net {m.net > 0 ? `+${m.net}` : `−${Math.abs(m.net)}`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </HubShell>
    </Frame>
  );
}
