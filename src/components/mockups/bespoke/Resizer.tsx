"use client";

import { useState } from "react";
import { useLiveLoop } from "../useLiveLoop";
import { Art, Frame, HubShell, Ico } from "./shared";

// The design is nudged and zoomed on the artboard, then settles back centred.
const POSES = [
  { x: 0, y: 0, z: 1, zoom: 50 },
  { x: -6, y: 4, z: 1.12, zoom: 62 },
  { x: 5, y: -5, z: 1.2, zoom: 70 },
  { x: 2, y: 2, z: 1.06, zoom: 56 },
];

// Invented sample order lines.
const LINES = [
  { t: "Custom photo case", v: "iPhone 17 Pro · Clear", sku: "17PRO-CLR", tag: "Custom photo", k: 6, on: true },
  { t: "Leopard case", v: "iPhone 17 Pro · Tough", sku: "17PRO-TGH", tag: "Print file", k: 0 },
];

// The customer's design, drawn rather than loaded.
const DESIGN = (
  <span className="bm-art bm-art--flat" style={{ display: "block", width: "100%", height: "100%", borderRadius: 0, background: "linear-gradient(160deg, #3d6be0, #35bdf2 55%, #ffc933)" }}>
    <span style={{ position: "absolute", left: "22%", top: "30%", width: "56%", aspectRatio: "1 / 1", borderRadius: "50%", background: "#fff8ec", opacity: 0.9 }} />
    <span style={{ position: "absolute", left: "10%", right: "10%", bottom: "14%", height: "9%", borderRadius: "99em", background: "#161616" }} />
  </span>
);

function Step({ n, done, title, children }: { n: number; done?: boolean; title: string; children: React.ReactNode }) {
  return (
    <div className="bm-card" style={{ padding: "0.75em 0.9em 0.85em" }}>
      <div className="bm-row" style={{ marginBottom: "0.55em" }}>
        <span className={`bm-num ${done ? "is-done" : ""}`}>{done ? <Ico n="check" /> : n}</span>
        <span className="bm-card-t" style={{ fontSize: "0.98em" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

export function Resizer() {
  const [t, setT] = useState(0);
  const ref = useLiveLoop(() => setT((v) => v + 1), 2600);
  const p = POSES[t % POSES.length];

  return (
    <Frame loopRef={ref} className="bm-hub" label="Resizer: an order's design is matched to the print mask for its phone model, positioned on a sheet, and sent to the workshop printer at true size, with sample data.">
      <HubShell
        rail="resizer"
        workspace="Resizer"
        nav={[
          {
            links: [
              { label: "Resizer", icon: "crop", on: true },
              { label: "Masks", icon: "layers" },
            ],
          },
        ]}
      >
        <div className="bm-row" style={{ alignItems: "flex-end" }}>
          <div className="bm-col bm-grow" style={{ gap: "0.5em" }}>
            <div className="bm-h1">Resizer.</div>
            <div className="bm-sub bm-trunc bm-s-hide">Pull an order, pick the product, check the mask, position the design and send the print file to the workshop.</div>
          </div>
          <span className="bm-btn bm-s-hide">Manage masks</span>
        </div>

        <div className="bm-row" style={{ alignItems: "flex-start", gap: "1em" }}>
          {/* Steps 1 to 3 */}
          <div className="bm-col" style={{ flex: "none", width: "17.5em", gap: "0.7em" }}>
            <Step n={1} done title="Order and product">
              <div className="bm-row" style={{ gap: "0.4em" }}>
                <div className="bm-input bm-grow"><span className="bm-mono">#10482</span></div>
                <span className="bm-btn bm-btn--ink">Fetch</span>
              </div>
              <div className="bm-cap" style={{ margin: "0.5em 0 0.3em" }}>2 lines</div>
              <div className="bm-col" style={{ gap: "0.35em" }}>
                {LINES.map((l) => (
                  <div key={l.sku} className={`bm-row ${l.on ? "" : "bm-s-hide"}`} style={{ padding: "0.4em", borderRadius: "0.8em", border: l.on ? "0.15em solid #161616" : "1px solid rgba(22,22,22,.12)", gap: "0.5em" }}>
                    <Art k={l.k} style={{ width: "2.5em", height: "2.5em" }} />
                    <div className="bm-col bm-grow">
                      <span className="bm-trunc" style={{ fontSize: "0.88em", fontWeight: 800 }}>{l.t}</span>
                      <span className="bm-cap bm-trunc" style={{ fontSize: "0.74em" }}>{l.v}</span>
                    </div>
                    <span className={`bm-pill ${l.on ? "bm-pill--blue" : ""}`} style={{ fontSize: "0.66em", padding: "0.15em 0.55em" }}>{l.tag}</span>
                  </div>
                ))}
              </div>
            </Step>
            <Step n={2} done title="Mask">
              <div className="bm-row" style={{ gap: "0.6em" }}>
                <span style={{ width: "1.5em", height: "2.7em", borderRadius: "0.4em", background: "#161616", flex: "none" }} />
                <div className="bm-col bm-grow">
                  <span className="bm-trunc" style={{ fontSize: "0.9em", fontWeight: 800 }}>iPhone 17 Pro, clear</span>
                  <span className="bm-cap bm-trunc" style={{ fontSize: "0.76em" }}>76 × 156mm · from the product</span>
                </div>
                <span className="bm-cap" style={{ color: "#189bd6", fontWeight: 800 }}>Change</span>
              </div>
            </Step>
            <Step n={3} done title="Design">
              <div className="bm-row">
                <span className="bm-pill bm-pill--green">From the order</span>
                <span className="bm-sp bm-cap bm-nw">Upload a file</span>
              </div>
            </Step>
          </div>

          {/* Artboard and print */}
          <div className="bm-col bm-grow" style={{ gap: "0.7em" }}>
            <div className="bm-card" style={{ padding: "1em", background: "#f2f2ef" }}>
              <div style={{ display: "grid", placeItems: "center" }}>
                {/* DL sheet, 99 x 210mm, with the 76 x 156mm print area */}
                <div style={{ position: "relative", width: "10.4em", height: "22em", background: "#fff", boxShadow: "0 0.2em 0.8em rgba(22,22,22,.16)", overflow: "hidden" }}>
                  <div className="bm-ease" style={{ position: "absolute", left: "11.5%", right: "11.5%", top: "12.9%", bottom: "12.9%", transform: `translate(${p.x}%, ${p.y}%) scale(${p.z})`, opacity: 0.3 }}>
                    {DESIGN}
                  </div>
                  <div style={{ position: "absolute", left: "11.5%", right: "11.5%", top: "12.9%", bottom: "12.9%", overflow: "hidden", borderRadius: "1.3em" }}>
                    <div className="bm-ease" style={{ width: "100%", height: "100%", transform: `translate(${p.x}%, ${p.y}%) scale(${p.z})` }}>{DESIGN}</div>
                  </div>
                  <div style={{ position: "absolute", left: "11.5%", right: "11.5%", top: "12.9%", bottom: "12.9%", border: "0.12em dashed #161616", borderRadius: "1.3em" }} />
                </div>
              </div>
              <div className="bm-row" style={{ marginTop: "0.8em", gap: "0.5em" }}>
                <span className="bm-cap">−</span>
                <span className="bm-grow" style={{ position: "relative", height: "0.3em", borderRadius: "99em", background: "rgba(22,22,22,.15)" }}>
                  <span className="bm-ease" style={{ position: "absolute", top: "-0.4em", left: `${p.zoom}%`, width: "1.1em", height: "1.1em", marginLeft: "-0.55em", borderRadius: "50%", background: "#161616", transition: "left .6s ease" }} />
                </span>
                <span className="bm-cap">+</span>
                <span className="bm-btn bm-btn--sm">Fill</span>
                <span className="bm-btn bm-btn--sm bm-s-hide">Whole design</span>
                <span className="bm-btn bm-btn--sm bm-s-hide">Reset</span>
              </div>
            </div>
            <div className="bm-card bm-col" style={{ padding: "0.75em 0.9em 0.85em", gap: "0.65em" }}>
              <div className="bm-row" style={{ gap: "0.7em" }}>
                <span className="bm-num">4</span>
                <div className="bm-col bm-grow">
                  <span className="bm-card-t" style={{ fontSize: "0.98em" }}>Print</span>
                  <span className="bm-cap bm-trunc">76 × 156mm on DL, 300dpi, mirrored</span>
                </div>
                <span className="bm-btn bm-btn--ink" style={{ padding: "0.6em 1.6em" }}><Ico n="printer" />Print</span>
              </div>
              <div className="bm-row bm-s-hide" style={{ gap: "0.8em" }}>
                <span className="bm-seg"><span className="is-on">DL 99 × 210mm</span><span>A3</span></span>
                <span className="bm-sp bm-nw" style={{ fontSize: "0.86em" }}>Mirror print</span>
                <span className="bm-sw is-on" />
              </div>
            </div>
          </div>

          {/* Adjust */}
          <div className="bm-card bm-col bm-s-hide" style={{ flex: "none", width: "15.5em", padding: "0.85em 0.95em 1em", gap: "0.8em" }}>
            <div className="bm-row">
              <span className="bm-card-t">Adjust</span>
              <span className="bm-btn bm-btn--sm bm-sp">Centre</span>
            </div>
            <div className="bm-col" style={{ gap: "0.35em" }}>
              <span className="bm-lbl">Background</span>
              <div className="bm-row" style={{ gap: "0.35em" }}>
                {["#fff", "#35bdf2", "#3d6be0", "#ffc933", "#161616"].map((c, i) => (
                  <span key={c} style={{ width: "1.7em", height: "1.7em", borderRadius: "0.5em", background: c, border: i === 1 ? "0.17em solid #161616" : "1px solid rgba(22,22,22,.2)" }} />
                ))}
              </div>
            </div>
            <div className="bm-row"><span className="bm-grow" style={{ fontSize: "0.9em" }}>Crop</span><span className="bm-sw" /></div>
            <div className="bm-row" style={{ alignItems: "flex-start" }}>
              <div className="bm-col bm-grow">
                <span style={{ fontSize: "0.9em" }}>Show the mask outline</span>
                <span className="bm-cap" style={{ fontSize: "0.74em" }}>A guide only. It is not printed.</span>
              </div>
              <span className="bm-sw is-on" />
            </div>
            <div className="bm-col" style={{ gap: "0.4em", borderTop: "1px solid rgba(22,22,22,.1)", paddingTop: "0.8em" }}>
              <span style={{ fontSize: "0.9em" }}>Extend the design for bleed</span>
              <div className="bm-input" style={{ width: "6em" }}><span className="bm-grow">10</span><span className="bm-mut">mm</span></div>
              <div className="bm-row" style={{ gap: "0.4em" }}>
                <span className="bm-btn bm-btn--sm">Mirror edges</span>
                <span className="bm-btn bm-btn--sm"><Ico n="sparkles" />AI expand</span>
              </div>
            </div>
          </div>
        </div>
      </HubShell>
    </Frame>
  );
}
