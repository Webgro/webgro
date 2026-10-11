"use client";

import { useState } from "react";
import { useLiveLoop } from "../useLiveLoop";
import { Art, Frame, HubShell, Ico } from "./shared";

// Invented sample orders. Tracking numbers are placeholders.
const ORDERS = [
  { svc: "Tracked 48", size: "Large Letter", weight: "85g · 2 items", items: [1, 2] },
  { svc: "Tracked 24", size: "Parcel", weight: "410g · 3 items", items: [4, 5, 7] },
  { svc: "Tracked 48", size: "Large Letter", weight: "60g · 1 item", items: [3] },
  { svc: "Tracked 48", size: "Large Letter", weight: "110g · 2 items", items: [6, 8] },
  { svc: "Tracked 24", size: "Large Letter", weight: "85g · 2 items", items: [2, 5] },
];

export function Shipping() {
  // i: the order whose result is on screen. busy: the next one is being dispatched.
  const [s, setS] = useState({ i: 4, busy: false });
  const ref = useLiveLoop(() => setS((v) => (v.busy ? { i: v.i + 1, busy: false } : { i: v.i, busy: true })), 2300);

  // Order and tracking numbers count up from the position in the session.
  const at = (k: number) => ({
    ...ORDERS[((k % ORDERS.length) + ORDERS.length) % ORDERS.length],
    n: `#${10478 + k}`,
    trk: `AB 0${478 + k} 001 GB`,
  });
  const o = at(s.i);
  const next = at(s.i + 1);
  const session = [0, 1, 2, 3, 4].map((j) => ({ id: s.i - j, o: at(s.i - j), mins: j * 2 }));

  return (
    <Frame loopRef={ref} className="bm-hub" label="Shipping, scan and dispatch: an order number is scanned, a Royal Mail label is created and printed, and the result shows service, size, weight and tracking, with sample data.">
      <HubShell
        rail="shipping"
        workspace="Shipping"
        nav={[
          {
            links: [
              { label: "Scan & dispatch", icon: "scan", on: true },
              { label: "Analytics", icon: "chart" },
              { label: "Rules", icon: "list" },
            ],
          },
        ]}
      >
        <div className="bm-col" style={{ gap: "0.5em" }}>
          <div className="bm-h1">Scan &amp; dispatch</div>
          <div className="bm-sub bm-s-hide" style={{ lineHeight: 1.4 }}>
            Scan or type an order number. The label is created in Click &amp; Drop, the order is fulfilled in Shopify with its tracking, and the label prints. An order already dispatched never prints again on its own.
          </div>
        </div>

        <div className="bm-grid bm-s-hide" style={{ "--n": 2, gap: "1em" } as React.CSSProperties}>
          <div className="bm-card bm-row" style={{ padding: "0.75em 1em" }}>
            <span className="bm-ini">ST</span>
            <div className="bm-col bm-grow" style={{ gap: "0.25em" }}>
              <span className="bm-lbl">Who is packing?</span>
              <div className="bm-input"><span className="bm-grow">Sam T.</span><Ico n="chevron" style={{ transform: "rotate(90deg)" }} /></div>
            </div>
          </div>
          <div className="bm-card bm-row" style={{ padding: "0.75em 1em" }}>
            <span className="bm-ini" style={{ background: "rgba(255,201,51,.35)", color: "#7a5800" }}><Ico n="printer" style={{ width: "1.3em", height: "1.3em" }} /></span>
            <div className="bm-col bm-grow" style={{ gap: "0.25em" }}>
              <span className="bm-lbl">Print to</span>
              <div className="bm-input"><span className="bm-grow bm-trunc">Label printer · 102×152mm · Bench 1</span><Ico n="chevron" style={{ transform: "rotate(90deg)" }} /></div>
            </div>
          </div>
        </div>

        {/* Scan bar */}
        <div style={{ border: "0.15em solid #161616", borderRadius: "1.2em", padding: "0.9em 1em 0.8em", background: "#fff" }}>
          <div className="bm-row" style={{ gap: "0.8em" }}>
            <div className="bm-input bm-grow" style={{ fontSize: "1.3em", padding: "0.5em 0.8em" }}>
              <Ico n="scan" />
              {s.busy ? <span key={next.n} className="bm-mono bm-in">{next.n}</span> : <span className="bm-ph">Scan or type an order number</span>}
            </div>
            <span className="bm-btn bm-btn--ink" style={{ fontSize: "1.15em", padding: "0.62em 1.5em", minWidth: "7.2em" }}>{s.busy ? "Working…" : "Dispatch"}</span>
          </div>
          <div className="bm-row" style={{ marginTop: "0.6em" }}>
            <span className="bm-cap bm-trunc">Packing as <b style={{ color: "#161616" }}>Sam T.</b> · Printing to <b style={{ color: "#161616" }}>Label printer</b></span>
            <span className="bm-sp bm-cap bm-nw" style={{ color: s.busy ? "#0d78ad" : undefined }}>{s.busy ? "Creating the label…" : "Press Enter to dispatch"}</span>
          </div>
          <div className="bm-bar" style={{ marginTop: "0.5em", height: "0.3em" }}>
            <i style={{ width: s.busy ? "100%" : "0%", transition: s.busy ? "width 2s linear" : "none" }} />
          </div>
        </div>

        <div className="bm-row" style={{ alignItems: "flex-start", gap: "1em" }}>
          {/* Result */}
          <div key={o.n + s.i} className="bm-card bm-grow bm-in" style={{ overflow: "hidden" }}>
            <div className="bm-row" style={{ background: "rgba(88,187,70,.16)", padding: "0.8em 1.1em", gap: "0.8em" }}>
              <span style={{ width: "2.4em", height: "2.4em", borderRadius: "50%", background: "#58bb46", color: "#fff", display: "grid", placeItems: "center", flex: "none" }}>
                <Ico n="check" style={{ width: "1.4em", height: "1.4em" }} />
              </span>
              <div className="bm-col">
                <span style={{ fontSize: "0.76em", color: "#2b7a1e" }}>Dispatched</span>
                <span className="bm-nw" style={{ fontSize: "1.25em", fontWeight: 800, letterSpacing: "-0.02em" }}>Order {o.n}</span>
              </div>
            </div>
            <div className="bm-grid" style={{ "--n": 4, "--ns": 2, padding: "0.9em 1.1em 0.2em", gap: "0.7em 1em" } as React.CSSProperties}>
              {[
                ["Service", o.svc],
                ["Size", o.size],
                ["Weight", o.weight],
                ["Tracking", o.trk],
              ].map(([l, v], j) => (
                <div key={l} className="bm-col">
                  <span className="bm-lbl">{l}</span>
                  <span className={`bm-trunc ${j === 3 ? "bm-mono" : ""}`} style={{ fontSize: "0.98em", fontWeight: 800 }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="bm-col" style={{ padding: "0.7em 1.1em 0.9em", gap: "0.35em" }}>
              {["Sent to the printer.", "Fulfilled in Shopify."].map((t) => (
                <span key={t} className="bm-row" style={{ gap: "0.45em", fontSize: "0.92em" }}>
                  <Ico n="check" style={{ width: "1.1em", height: "1.1em", color: "#58bb46" }} />
                  {t}
                </span>
              ))}
              <div className="bm-row bm-s-hide" style={{ marginTop: "0.5em", gap: "0.6em" }}>
                {o.items.map((k) => (
                  <span key={k} style={{ position: "relative" }}>
                    <Art k={k} style={{ display: "block", width: "4em", height: "4em" }} />
                    <span className="bm-pill bm-pill--ink" style={{ position: "absolute", top: "-0.5em", right: "-0.6em", fontSize: "0.68em", padding: "0.1em 0.55em" }}>×1</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Session list */}
          <div className="bm-card" style={{ flex: "none", width: "17em", overflow: "hidden" }}>
            <div className="bm-card-h">
              <span className="bm-card-t">This session</span>
              <span className="bm-sp bm-cap bm-nw">{12 + s.i} dispatched</span>
            </div>
            {session.map(({ id, o: r, mins }, j) => (
              <div key={id} className={`bm-row ${j === 0 ? "bm-in" : ""}`} style={{ padding: "0.5em 1.1em", borderTop: "1px solid rgba(22,22,22,.08)", alignItems: "flex-start" }}>
                <span className="bm-dot" style={{ color: "#58bb46", marginTop: "0.4em" }} />
                <div className="bm-col bm-grow">
                  <span className="bm-row">
                    <span className="bm-mono">{r.n}</span>
                    <span className="bm-sp bm-cap bm-nw">{mins === 0 ? "now" : `${mins} min`}</span>
                  </span>
                  <span className="bm-cap bm-trunc">{r.svc} · {r.size}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </HubShell>
    </Frame>
  );
}
