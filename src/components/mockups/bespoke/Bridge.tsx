"use client";

import { useState } from "react";
import { useLiveLoop } from "../useLiveLoop";
import { Frame } from "./shared";

// Invented sample product. The two shops are only ever "Shop A" and "Shop B".
const FIELDS = [
  { f: "Title", a: "Salmon bites for adult dogs, 500g", b: "Salmon bites for adult dogs, 500g", s: "Same" },
  { f: "Vendor", a: "Sample Pet Co", b: "Sample Pet Co", s: "Same" },
  { f: "Weight", a: "520g", b: "500g", s: "Update" },
  { f: "Images", a: "5 images", b: "4 images", s: "Update" },
  { f: "Variants", a: "500g, 2kg", b: "500g, 2kg, subscription", s: "Kept" },
  { f: "Description", a: "Source copy", b: "Approved copy", s: "Kept" },
];

const TAG: Record<string, [string, string]> = {
  Same: ["#eef0f3", "#6b7280"],
  Update: ["#e3ecfd", "#1a56db"],
  Kept: ["#e6f4ea", "#1b7f3b"],
};

const COLS = { "--cols": "6.2em minmax(0,1fr) minmax(0,1fr) 4.6em", "--cols-s": "6.2em minmax(0,1fr) 4.6em" } as React.CSSProperties;

export function Bridge() {
  // A sale on Shop B: the unit comes off Shop A's stock, then Shop B mirrors
  // the new figure. Step 0 is in sync, which is also the still picture.
  const [t, setT] = useState(0);
  const ref = useLiveLoop(() => setT((v) => v + 1), 2400);
  const step = t % 3;
  const base = 24 - (Math.floor(t / 3) % 6);
  const a = step === 0 ? base : base - 1;
  const b = step === 2 ? base - 1 : base;
  const inSync = a === b;

  return (
    <Frame loopRef={ref} className="bm-br" label="Sync dashboard for two shops: a safety switch for writes, a field by field comparison of one product between Shop A and Shop B, an AI written description waiting for a person to approve, and shared stock mirrored between the shops, with sample data.">
      <div className="bm-col bm-grow" style={{ padding: "1.6em 2em 0", gap: "1em", overflow: "hidden" }}>
        <div className="bm-row" style={{ gap: "1em" }}>
          <div className="bm-col bm-grow">
            <span className="bm-nw" style={{ fontSize: "1.6em", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}>Shop A to Shop B sync</span>
            <span className="bm-trunc" style={{ fontSize: "0.88em", color: "#6b7280" }}>Dry run unless both halves of the kill switch are on.</span>
          </div>
          <div className="bm-br-card bm-row" style={{ padding: "0.55em 0.9em", gap: "0.7em" }}>
            <span className="bm-col">
              <span className="bm-nw" style={{ fontSize: "0.76em", color: "#6b7280" }}>Kill switch</span>
              <span className="bm-nw" style={{ fontSize: "0.92em", fontWeight: 600, color: "#1b7f3b" }}>Writes on</span>
            </span>
            <span className="bm-sw is-on" style={{ background: "#1b7f3b" }} />
          </div>
        </div>

        <div className="bm-grid bm-s-hide" style={{ "--n": 4, gap: "0.8em" } as React.CSSProperties}>
          {[
            ["Links confirmed", "320", "#1c1f24"],
            ["Events queued", "4", "#1a56db"],
            ["Events failed", "0", "#1c1f24"],
            ["Sync errors", "0", "#1c1f24"],
          ].map(([l, v, c]) => (
            <div key={l} className="bm-br-card" style={{ padding: "0.6em 0.9em" }}>
              <div className="bm-nw" style={{ fontSize: "0.78em", color: "#6b7280" }}>{l}</div>
              <div style={{ fontSize: "1.5em", fontWeight: 700, color: c, lineHeight: 1.25 }}>{v}</div>
            </div>
          ))}
        </div>

        <div className="bm-grid" style={{ "--n": 2, gap: "1em", alignItems: "start" } as React.CSSProperties}>
          {/* Field by field */}
          <div className="bm-br-card" style={{ overflow: "hidden" }}>
            <div className="bm-br-h">
              Sync one product
              <span className="bm-sp bm-br-btn bm-s-hide">Run sync</span>
            </div>
            <div className="bm-tr bm-thp" style={{ ...COLS, borderTop: 0 }}>
              <span>Field</span>
              <span>Shop A (source)</span>
              <span className="bm-s-hide">Shop B</span>
              <span>Result</span>
            </div>
            {FIELDS.map((r) => (
              <div key={r.f} className="bm-tr" style={{ ...COLS, borderTopColor: "#e2e5ea" }}>
                <span style={{ color: "#6b7280" }}>{r.f}</span>
                <span className="bm-trunc">{r.a}</span>
                <span className="bm-trunc bm-s-hide" style={{ color: r.s === "Update" ? "#9a6700" : undefined }}>{r.b}</span>
                <span><span className="bm-br-tag" style={{ background: TAG[r.s][0], color: TAG[r.s][1] }}>{r.s}</span></span>
              </div>
            ))}
            <div className="bm-tr" style={{ ...COLS, borderTopColor: "#e2e5ea", background: "#fafbfc" }}>
              <span style={{ color: "#6b7280" }}>Stock</span>
              <span style={{ fontWeight: 700 }}>{a} <span style={{ fontWeight: 400, color: "#6b7280" }}>held here</span></span>
              <span className="bm-s-hide" style={{ fontWeight: 700 }}>{b} <span style={{ fontWeight: 400, color: "#6b7280" }}>mirrored</span></span>
              <span><span className="bm-br-tag" style={{ background: inSync ? "#e6f4ea" : "#fdf3d7", color: inSync ? "#1b7f3b" : "#9a6700" }}>{inSync ? "In sync" : "Moving"}</span></span>
            </div>
          </div>

          {/* AI description review */}
          <div className="bm-br-card" style={{ overflow: "hidden" }}>
            <div className="bm-br-h">
              AI description review
              <span className="bm-sp bm-br-tag" style={{ background: "#fdf3d7", color: "#9a6700" }}>To approve</span>
            </div>
            <div className="bm-grid" style={{ "--n": 2, gap: 0 } as React.CSSProperties}>
              <div style={{ padding: "0.8em 1em", borderRight: "1px solid #e2e5ea" }}>
                <div style={{ fontSize: "0.76em", color: "#6b7280", fontWeight: 600, marginBottom: "0.35em" }}>Source (Shop A)</div>
                <div style={{ fontSize: "0.86em", lineHeight: 1.5 }}>Salmon bites for adult dogs. Made with fresh salmon and sweet potato. Grain free recipe. 500g resealable bag.</div>
              </div>
              <div style={{ padding: "0.8em 1em", background: "#fafbff" }}>
                <div style={{ fontSize: "0.76em", color: "#1a56db", fontWeight: 600, marginBottom: "0.35em" }}>Draft (AI)</div>
                <div style={{ fontSize: "0.86em", lineHeight: 1.5 }}>A grain free treat your dog will sit for. Fresh salmon and sweet potato, baked into small bites and packed in a 500g bag that reseals.</div>
              </div>
            </div>
            <div className="bm-row" style={{ padding: "0.7em 1em", borderTop: "1px solid #e2e5ea", gap: "0.45em" }}>
              <span className="bm-br-btn bm-br-btn--go">Approve and apply</span>
              <span className="bm-br-btn">Approve</span>
              <span className="bm-br-btn bm-s-hide">Reject</span>
              <span className="bm-br-btn bm-s-hide">Re-run</span>
            </div>
          </div>
        </div>

        {/* Shared stock */}
        <div className="bm-br-card" style={{ overflow: "hidden" }}>
          <div className="bm-br-h">
            Inventory (shared stock)
            <span className="bm-sp bm-row" style={{ gap: "0.5em", fontSize: "0.86em", fontWeight: 400, color: "#6b7280" }}>
              Stock sync on <span className="bm-sw is-on" style={{ background: "#1b7f3b" }} />
            </span>
          </div>
          <div className="bm-row" style={{ padding: "0.8em 1em", gap: "1.2em" }}>
            <div className="bm-col" style={{ flex: "none" }}>
              <span style={{ fontSize: "0.76em", color: "#6b7280" }}>Shop A holds</span>
              <span key={`a${a}`} className="bm-in" style={{ fontSize: "1.6em", fontWeight: 700, lineHeight: 1.2 }}>{a}</span>
            </div>
            <div className="bm-col bm-grow" style={{ gap: "0.3em" }}>
              <span className="bm-trunc" style={{ fontSize: "0.84em", color: inSync ? "#1b7f3b" : "#9a6700" }}>
                {step === 0 ? "Both shops agree." : step === 1 ? "Sale on Shop B. One unit taken off Shop A." : "Shop B updated to match."}
              </span>
              <div className="bm-bar" style={{ height: "0.35em" }}>
                <i style={{ width: step === 1 ? "50%" : "100%", background: inSync ? "#1b7f3b" : "#9a6700" }} />
              </div>
            </div>
            <div className="bm-col" style={{ flex: "none", alignItems: "flex-end" }}>
              <span style={{ fontSize: "0.76em", color: "#6b7280" }}>Shop B shows</span>
              <span key={`b${b}`} className="bm-in" style={{ fontSize: "1.6em", fontWeight: 700, lineHeight: 1.2 }}>{b}</span>
            </div>
            <div className="bm-row bm-s-hide" style={{ gap: "1.4em", borderLeft: "1px solid #e2e5ea", paddingLeft: "1.2em", flex: "none" }}>
              {[
                ["Moves applied", String(86 + Math.floor((t + 1) / 3))],
                ["Moves pending", step === 1 ? "1" : "0"],
                ["Reconcile in sync", "320"],
              ].map(([l, v]) => (
                <div key={l} className="bm-col">
                  <span className="bm-nw" style={{ fontSize: "0.76em", color: "#6b7280" }}>{l}</span>
                  <span style={{ fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}
