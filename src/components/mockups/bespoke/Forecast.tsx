"use client";

import { useState } from "react";
import { useLiveLoop } from "../useLiveLoop";
import { Frame, HubShell, stockNav } from "./shared";

const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

type Sku = { code: string; sup: string; title: string; stock: number; perDay: number; deliveries?: Record<number, number> };

// Invented sample SKUs and usage. Sorted soonest to run out first.
const SKUS: Sku[] = [
  { code: "16-TOUGH-BLK", sup: "Supplier B", title: "Tough case, iPhone 16, black", stock: 0, perDay: 2.5, deliveries: { 1: 300 } },
  { code: "S26-FLEX-BLK", sup: "Supplier A", title: "Flex case, Galaxy S26, black", stock: 110, perDay: 5.7 },
  { code: "17PM-CLR", sup: "Supplier A", title: "Clear case, iPhone 17 Pro Max", stock: 400, perDay: 8.7, deliveries: { 2: 500 } },
  { code: "17PRO-CLR", sup: "Supplier A", title: "Clear case, iPhone 17 Pro", stock: 900, perDay: 10.7, deliveries: { 3: 1000 } },
  { code: "TUMBLER-WHT", sup: "Supplier C", title: "Tumbler, white", stock: 420, perDay: 3.9 },
  { code: "17-GLASS", sup: "Supplier B", title: "Screen protector, iPhone 17", stock: 900, perDay: 4.7 },
  { code: "LAPTOP-15", sup: "Supplier C", title: "Laptop sleeve, 15 inch", stock: 310, perDay: 1.4 },
  { code: "PIXEL10-CLR", sup: "Supplier A", title: "Clear case, Pixel 10", stock: 330, perDay: 1.0 },
  { code: "KEYRING-LUX", sup: "Supplier C", title: "Keyring, luxury", stock: 640, perDay: 1.3 },
  { code: "LUNCHBOX", sup: "Supplier C", title: "Lunchbox", stock: 0, perDay: 0 },
];

const GREEN = "#58bb46";
const YELLOW = "#ffc933";
const ORANGE = "#ff8a26";
const RED = "#f03e2e";
const GREY = "rgba(22,22,22,.14)";

/** Walks a SKU forward month by month at its usage, counting deliveries due. */
function walk(sku: Sku, extra?: Record<number, number>) {
  let stock = sku.stock;
  let runsOut: string | null = null;
  const cells = MONTHS.map((_, m) => {
    const due = (sku.deliveries?.[m] ?? 0) + (extra?.[m] ?? 0);
    stock += due;
    if (sku.perDay === 0) return { share: 1, color: GREY, due };
    const need = sku.perDay * 30;
    const share = Math.min(1, stock / need);
    const cover = stock / sku.perDay;
    const color = cover >= 60 ? GREEN : cover >= 30 ? YELLOW : cover > 0 ? ORANGE : RED;
    if (share < 1 && !runsOut) runsOut = share === 0 && m === 0 ? "Out now" : `${Math.max(1, Math.round(share * 30))} ${MONTHS[m]}`;
    stock = Math.max(0, stock - need);
    return { share, color, due };
  });
  return { cells, runsOut: sku.perDay === 0 ? "Not selling" : (runsOut ?? "Beyond Sep") };
}

const COLS = { "--cols": "13.5em 3.6em 3.6em 5.6em minmax(0,1fr)", "--cols-s": "8.2em 5.2em minmax(0,1fr)" } as React.CSSProperties;
const MGRID: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", columnGap: "0.3em" };

export function Forecast() {
  // The live row: an outstanding purchase order lands on the second SKU,
  // and its cover re-plots. Starts on the complete state.
  const [po, setPo] = useState(true);
  const ref = useLiveLoop(() => setPo((v) => !v), 3000);

  return (
    <Frame loopRef={ref} className="bm-hub" label="Stock cover: how many months each product's stock will last at its current usage, with deliveries due, shown as a bar per month, with sample data.">
      <HubShell rail="stock" workspace="Stock" nav={stockNav("planning:Cover", ["manage", "planning", "admin"])}>
        <div className="bm-col" style={{ gap: "0.5em" }}>
          <div className="bm-h1">Stock cover.</div>
          <div className="bm-sub bm-trunc bm-s-hide">How long each SKU&rsquo;s stock lasts, month by month, at its current usage with seasonality, counting outstanding deliveries.</div>
        </div>

        <div className="bm-row" style={{ gap: "0.45em" }}>
          <span className="bm-chip is-on">All suppliers <span style={{ opacity: 0.6 }}>10</span></span>
          <span className="bm-chip bm-s-hide">Supplier A <span className="bm-mut">4</span></span>
          <span className="bm-chip bm-s-hide">Supplier B <span className="bm-mut">2</span></span>
          <span className="bm-chip bm-s-hide">Supplier C <span className="bm-mut">4</span></span>
          <span className="bm-sp" />
          <span className="bm-chip" style={{ color: "#c2281a", borderColor: "rgba(240,62,46,.4)" }}>Run out within 3 months</span>
          <span className="bm-chip bm-s-hide" style={{ color: "#b25506", borderColor: "rgba(255,138,38,.5)" }}>Within 6 months</span>
        </div>

        <div className="bm-row bm-cap" style={{ gap: "1.1em" }}>
          {[
            [GREEN, "60+ days"],
            [YELLOW, "30 to 60"],
            [ORANGE, "Under 30"],
            [RED, "Out"],
            [GREY, "Not selling"],
          ].map(([c, l]) => (
            <span key={l} className="bm-row bm-nw" style={{ gap: "0.4em" }}>
              <span style={{ width: "1.3em", height: "0.6em", borderRadius: "99em", background: c }} />
              {l}
            </span>
          ))}
          <span className="bm-nw bm-s-hide">▲ delivery</span>
        </div>

        <div className="bm-tbl">
          <div className="bm-tr bm-th" style={COLS}>
            <span>SKU</span>
            <span className="bm-r bm-s-hide">Stock</span>
            <span className="bm-r bm-s-hide">Per day</span>
            <span>Runs out</span>
            <span style={MGRID}>
              {MONTHS.map((m) => (
                <span key={m} style={{ textAlign: "center" }}>{m}</span>
              ))}
            </span>
          </div>
          {SKUS.map((s, i) => {
            const live = i === 1;
            const w = walk(s, live && po ? { 1: 400 } : undefined);
            const out = w.runsOut === "Out now";
            return (
              <div key={s.code} className="bm-tr" style={{ ...COLS, paddingTop: "0.5em", paddingBottom: "0.5em" }}>
                <span className="bm-col">
                  <span className="bm-row" style={{ gap: "0.5em" }}>
                    <span className="bm-mono bm-trunc">{s.code}</span>
                    <span className="bm-pill bm-s-hide" style={{ fontSize: "0.72em", padding: "0.1em 0.6em" }}>{s.sup}</span>
                  </span>
                  <span className="bm-cap bm-trunc bm-s-hide" style={{ fontSize: "0.84em" }}>{s.title}</span>
                </span>
                <span className="bm-r bm-s-hide">{s.stock}</span>
                <span className="bm-r bm-mut bm-s-hide">{s.perDay.toFixed(1)}</span>
                <span className="bm-nw" style={{ fontWeight: 800, color: out ? "#f03e2e" : s.perDay === 0 ? "rgba(22,22,22,.4)" : "#161616", fontSize: "0.95em" }}>{w.runsOut}</span>
                <span style={{ ...MGRID, alignItems: "start" }}>
                  {w.cells.map((c, m) => (
                    <span key={m} className="bm-col" style={{ gap: "0.15em", height: "1.6em", justifyContent: "center" }}>
                      <span style={{ display: "block", height: "0.6em", borderRadius: "99em", background: c.share === 0 ? "rgba(240,62,46,.45)" : "rgba(22,22,22,.07)", overflow: "hidden" }}>
                        <span style={{ display: "block", height: "100%", width: `${c.share * 100}%`, background: c.color, borderRadius: "99em", transition: "width .7s ease, background-color .7s ease" }} />
                      </span>
                      {c.due > 0 && (
                        <span className="bm-in bm-nw" style={{ fontSize: "0.66em", textAlign: "center", lineHeight: 1, color: "#0d78ad" }}>▲ {c.due}</span>
                      )}
                    </span>
                  ))}
                </span>
              </div>
            );
          })}
        </div>
      </HubShell>
    </Frame>
  );
}
