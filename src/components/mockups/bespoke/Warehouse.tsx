"use client";

import { useState } from "react";
import { useLiveLoop } from "../useLiveLoop";
import { Frame, HubShell, Ico, stockNav } from "./shared";

// Invented sample SKUs.
const SKUS = [
  { code: "17PRO-CLR", title: "Clear case, iPhone 17 Pro", box: "A-12", stock: 184, picks: 322 },
  { code: "17PM-CLR", title: "Clear case, iPhone 17 Pro Max", box: "A-13", stock: 96, picks: 260 },
  { code: "S26-FLEX-BLK", title: "Flex case, Galaxy S26, black", box: "B-03", stock: 12, picks: 171 },
  { code: "17-GLASS", title: "Screen protector, iPhone 17", box: "C-01", stock: 240, picks: 140 },
  { code: "TUMBLER-WHT", title: "Tumbler, white", box: "D-07", stock: 58, picks: 118 },
  { code: "16-TOUGH-BLK", title: "Tough case, iPhone 16, black", box: "A-21", stock: 0, picks: 74 },
  { code: "LAPTOP-15", title: "Laptop sleeve, 15 inch", box: "E-02", stock: 31, picks: 41 },
  { code: "KEYRING-LUX", title: "Keyring, luxury", box: "D-11", stock: 420, picks: 38 },
  { code: "PIXEL10-CLR", title: "Clear case, Pixel 10", box: "B-09", stock: 67, picks: 29 },
  { code: "LUNCHBOX", title: "Lunchbox", box: "E-05", stock: 22, picks: 17 },
  { code: "S26U-CLR", title: "Clear case, Galaxy S26 Ultra", box: "B-04", stock: 73, picks: 15 },
  { code: "17-TOUGH-BLK", title: "Tough case, iPhone 17, black", box: "A-22", stock: 8, picks: 12 },
  { code: "TUMBLER-PNK", title: "Tumbler, pink", box: "D-08", stock: 44, picks: 9 },
  { code: "LAPTOP-13", title: "Laptop sleeve, 13 inch", box: "E-03", stock: 19, picks: 6 },
  { code: "PIXEL10-TGH", title: "Tough case, Pixel 10", box: "B-10", stock: 27, picks: 4 },
];

// The handset picks these rows in turn.
const PICKS = [
  { row: 0, order: "#10482" },
  { row: 3, order: "#10483" },
  { row: 1, order: "#10484" },
  { row: 4, order: "#10485" },
];

const COLS = { "--cols": "8.4em minmax(0,1fr) 5em 5em 5em", "--cols-s": "8em minmax(0,1fr) 4.6em" } as React.CSSProperties;

export function Warehouse() {
  // done: picks finished so far. toast: the latest pick has just been confirmed.
  const [s, setS] = useState({ done: 1, toast: true });
  const ref = useLiveLoop(() => setS((v) => (v.toast ? { done: v.done, toast: false } : { done: v.done + 1, toast: true })), 2200);

  // While the toast shows, the handset still shows the pick it confirmed.
  const current = PICKS[(s.toast ? s.done - 1 : s.done) % PICKS.length];
  const picked = (row: number) => {
    let c = 0;
    for (let i = 0; i < s.done; i++) if (PICKS[i % PICKS.length].row === row) c++;
    return c;
  };
  const sku = SKUS[current.row];

  return (
    <Frame loopRef={ref} className="bm-hub" label="Warehouse screens: the SKU list with stock per picking box, beside a handheld scanner confirming a pick, with sample data.">
      <HubShell rail="stock" workspace="Stock" nav={stockNav("manage:SKUs", ["actions", "manage"])} mainClass="bm-wh-main">
        <div className="bm-row" style={{ alignItems: "stretch", gap: "1.5em", flex: 1, minHeight: 0 }}>
          <div className="bm-col bm-grow" style={{ gap: "0.95em" }}>
            <div className="bm-row" style={{ alignItems: "flex-end" }}>
              <div className="bm-col bm-grow" style={{ gap: "0.4em" }}>
                <div className="bm-h1" style={{ fontSize: "2em" }}>SKUs</div>
                <div className="bm-sub bm-trunc">412 SKUs · 9 low · 3 out of stock</div>
              </div>
              <span className="bm-btn bm-s-hide">Import</span>
              <span className="bm-btn bm-s-hide">Export</span>
              <span className="bm-btn bm-btn--ink bm-s-hide">+ Add SKU</span>
            </div>
            <div className="bm-row bm-s-hide" style={{ gap: "0.45em" }}>
              {["All", "In stock", "Low", "Out of stock", "Discontinued"].map((c, i) => (
                <span key={c} className={`bm-chip ${i === 0 ? "is-on" : ""}`}>{c}</span>
              ))}
            </div>
            <div className="bm-tbl">
              <div className="bm-tr bm-th" style={COLS}>
                <span>SKU Code</span>
                <span>Title</span>
                <span className="bm-s-hide">Picking Box</span>
                <span className="bm-r">Total Stock</span>
                <span className="bm-r bm-s-hide">Picks (30d)</span>
              </div>
              {SKUS.map((r, i) => {
                const stock = Math.max(0, r.stock - picked(i));
                const hot = s.toast && current.row === i;
                return (
                  <div key={r.code} className="bm-tr bm-ease" style={{ ...COLS, background: hot ? "rgba(255,201,51,.22)" : "transparent" }}>
                    <span className="bm-mono bm-trunc">{r.code}</span>
                    <span className="bm-trunc">{r.title}</span>
                    <span className="bm-mono bm-s-hide">{r.box}</span>
                    <span className="bm-r" style={{ fontWeight: 800, color: stock === 0 ? "#f03e2e" : stock < 20 ? "#b98500" : "#161616" }}>{stock}</span>
                    <span className="bm-r bm-mut bm-s-hide">{r.picks}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Handheld scanner: Pick Order, step 3 of 3 */}
          <div className="bm-phone">
            <div className="bm-phone-s">
              <div className="bm-row" style={{ padding: "0.6em 0.9em", background: "#fff", borderBottom: "1px solid rgba(22,22,22,.08)" }}>
                <span className="bm-dot" style={{ color: "#58bb46" }} />
                <span style={{ fontSize: "0.8em" }}>All saved</span>
                <Ico n="bell" style={{ width: "1.2em", height: "1.2em", marginLeft: "auto", opacity: 0.6 }} />
              </div>
              <div className="bm-col" style={{ padding: "0.9em 0.9em 0", gap: "0.7em" }}>
                <div className="bm-row">
                  <span className="bm-nw" style={{ fontSize: "1.25em", fontWeight: 800, letterSpacing: "-0.03em" }}>Pick Order</span>
                  <span className="bm-sp bm-cap bm-nw">Step 3 of 3</span>
                </div>
                <div className="bm-row" style={{ gap: "0.3em" }}>
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{ flex: 1, height: "0.35em", borderRadius: "99em", background: "#161616" }} />
                  ))}
                </div>
                <div className="bm-card" style={{ padding: "0.6em 0.8em" }}>
                  <div className="bm-lbl">Order</div>
                  <div className="bm-mono" style={{ fontSize: "1.1em" }}>{current.order}</div>
                </div>
                <div key={current.order} className="bm-card bm-in" style={{ padding: "0.6em 0.8em" }}>
                  <div className="bm-lbl">SKU</div>
                  <div className="bm-mono" style={{ fontSize: "1.1em" }}>{sku.code}</div>
                  <div className="bm-cap bm-trunc">{sku.title}</div>
                  <div className="bm-cap bm-trunc">Primary box: {sku.box} · Picking shelf</div>
                </div>
                <div className="bm-col" style={{ gap: "0.35em" }}>
                  <span style={{ fontSize: "0.82em" }}>Scan Picking Box Location QR Code</span>
                  <div className="bm-input" style={{ border: "0.15em solid #161616", padding: "0.7em 0.8em" }}>
                    <span className={`bm-mono bm-grow ${s.toast ? "" : "bm-ph"}`}>{s.toast ? sku.box : "Scan…"}</span>
                    <Ico n="keyboard" />
                    <Ico n="scan" />
                  </div>
                </div>
                <span className="bm-btn" style={{ alignSelf: "stretch" }}>← Different SKU</span>
                <span className="bm-btn bm-s-hide" style={{ alignSelf: "stretch" }}>← New Order</span>
              </div>
              {s.toast && (
                <div key={s.done} className="bm-in" style={{ position: "absolute", top: "0.3em", left: "0.6em", right: "0.6em" }}>
                  <div className="bm-row" style={{ background: "#58bb46", color: "#fff", borderRadius: "0.8em", padding: "0.55em 0.8em", boxShadow: "0 0.3em 0.9em rgba(22,22,22,.25)", gap: "0.45em" }}>
                    <Ico n="check" style={{ width: "1.2em", height: "1.2em" }} />
                    <span className="bm-trunc" style={{ fontSize: "0.92em", fontWeight: 800 }}>Picked! {sku.code}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </HubShell>
    </Frame>
  );
}
