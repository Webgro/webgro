"use client";

import { useState } from "react";
import { useLiveLoop } from "../useLiveLoop";
import { Frame } from "./shared";

// Generic sample product, options and codes.
const LED = [
  { head: "Single Colour White", opts: ["W80", "W90", "W90 HE", "W98"] },
  { head: "Tunable White", opts: ["TW90", "TW95"] },
  { head: "RGBW", opts: ["RGBW"] },
];
const SINGLE = ["2700K", "3000K", "3500K", "4000K", "5000K", "6500K"];
const RANGE = ["1800-3000K", "2700-6500K"];
const IP = ["IP20", "IP65", "IP67"];

// The specifier's choices, step by step. Step 0 is also the still picture.
const STEPS = [
  { led: "W90", temp: "3000K", code: "LP20-W90-30K" },
  { led: "TW90", temp: "", code: "LP20-TW90" },
  { led: "TW90", temp: "2700-6500K", code: "LP20-TW90-2765" },
  { led: "W90", temp: "", code: "LP20-W90" },
];

export function Configurator() {
  const [t, setT] = useState(0);
  const ref = useLiveLoop(() => setT((v) => v + 1), 2600);
  const s = STEPS[t % STEPS.length];
  const tunable = s.led.startsWith("TW");
  const count = s.temp ? 2 : 1;

  const tempClass = (o: string, isRange: boolean) => (o === s.temp ? "is-on" : isRange !== tunable ? "is-off" : "");

  return (
    <Frame loopRef={ref} className="bm-af" label="Architectural FX product configurator: lighting options chosen group by group as pills, with options that do not fit the earlier choice struck through, and a configuration card that builds the product code and offers a spec sheet download, with a sample product.">
      <div className="bm-col bm-grow" style={{ padding: "2em 2.6em 0", gap: "1.3em", overflow: "hidden" }}>
        <div className="bm-col" style={{ gap: "0.5em", borderBottom: "1px solid rgba(255,255,255,.12)", paddingBottom: "1.1em" }}>
          <span className="bm-af-serif bm-nw" style={{ fontSize: "1.9em", lineHeight: 1.15, color: "#fff" }}>Configure your Linear Profile 20</span>
          <span className="bm-trunc bm-s-hide" style={{ fontSize: "0.86em", color: "rgba(233,236,236,.7)" }}>Pick your options, add your project details, and download a complete spec sheet ready for the brief.</span>
        </div>

        <div className="bm-row" style={{ alignItems: "flex-start", gap: "1.8em" }}>
          <div className="bm-col bm-grow" style={{ gap: "1.5em" }}>
            <div className="bm-af-group">
              <span className="bm-af-legend" style={{ color: "#3cc8e0" }}>LED type</span>
              <div className="bm-col" style={{ gap: "0.75em" }}>
                {LED.map((g) => (
                  <div key={g.head} className="bm-col" style={{ gap: "0.4em" }}>
                    <span className="bm-af-serif" style={{ fontSize: "0.8em" }}>{g.head}</span>
                    <div className="bm-row" style={{ gap: "0.5em", flexWrap: "wrap" }}>
                      {g.opts.map((o) => (
                        <span key={o} className={`bm-af-opt ${o === s.led ? "is-on" : ""}`}>{o}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bm-af-group">
              <span className="bm-af-legend">Colour temperature</span>
              <div className="bm-row" style={{ gap: "0.5em", flexWrap: "wrap" }}>
                {SINGLE.map((o) => (
                  <span key={o} className={`bm-af-opt ${tempClass(o, false)}`}>{o}</span>
                ))}
                {RANGE.map((o) => (
                  <span key={o} className={`bm-af-opt ${tempClass(o, true)}`}>{o}</span>
                ))}
              </div>
            </div>
            <div className="bm-af-group">
              <span className="bm-af-legend">IP rating</span>
              <div className="bm-row" style={{ gap: "0.5em", flexWrap: "wrap" }}>
                {IP.map((o) => (
                  <span key={o} className="bm-af-opt">{o}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bm-col" style={{ flex: "none", width: "38%", border: "1px solid rgba(255,255,255,.13)", background: "rgba(0,0,0,.14)", padding: "1.4em 1.3em 1.3em", gap: "0.8em" }}>
            <span className="bm-af-serif bm-nw" style={{ fontSize: "0.72em", letterSpacing: "0.2em" }}>YOUR CONFIGURATION</span>
            <span className="bm-nw" style={{ fontSize: "0.64em", letterSpacing: "0.2em", color: "rgba(233,236,236,.6)" }}>{count} OF 8 OPTIONS SELECTED</span>
            <span className="bm-nw" style={{ fontSize: "0.64em", letterSpacing: "0.24em", marginTop: "0.5em" }}>PRODUCT CODE</span>
            <div style={{ border: "1px solid rgba(255,255,255,.13)", background: "rgba(255,255,255,.03)", padding: "0.75em 0.9em" }}>
              <span key={s.code} className="bm-af-serif bm-in bm-nw" style={{ display: "block", fontSize: "1.25em", color: "#3cc8e0" }}>{s.code}</span>
            </div>
            <div className="bm-col" style={{ gap: "0.25em", fontSize: "0.8em", minHeight: "2.9em" }}>
              <span className="bm-row"><span className="bm-grow" style={{ color: "rgba(233,236,236,.6)" }}>LED type</span>{s.led}</span>
              <span className="bm-row"><span className="bm-grow" style={{ color: "rgba(233,236,236,.6)" }}>Colour temperature</span><span style={{ fontStyle: s.temp ? "normal" : "italic", color: s.temp ? undefined : "rgba(233,236,236,.5)" }}>{s.temp || "Not chosen yet"}</span></span>
            </div>
            <span className="bm-af-btn" style={{ background: count === 2 ? "#3cc8e0" : "rgba(255,255,255,.08)", color: count === 2 ? "#10191b" : "rgba(233,236,236,.7)", borderColor: "transparent" }}>Download spec sheet</span>
            <span className="bm-af-btn">Need help / Get a quote</span>
            <span className="bm-af-btn" style={{ borderStyle: "dashed", borderColor: "rgba(255,255,255,.22)", height: "3em" }}>Reset</span>
          </div>
        </div>
      </div>
    </Frame>
  );
}
