"use client";

import { useState } from "react";
import { useLiveLoop } from "../useLiveLoop";
import { Frame, HubShell, Ico } from "./shared";

// Invented sample counts.
const GROUPS = [
  { name: "Next Day", n: 0 },
  { name: "Fully Auto", n: 0 },
  { name: "Express Cat1", n: 9 },
  { name: "Express Cat2 and Cat3", n: 6 },
  { name: "Standard Cat1", n: 31 },
  { name: "Standard Cat2 and Cat3", n: 18 },
  { name: "Cat4 (Express and Standard)", n: 4 },
];

const TOTAL = 25;
const SHEETS = [
  { n: 25, what: "picking slips", printer: "Slip printer" },
  { n: 22, what: "DL designs", printer: "DL printer 2" },
  { n: 3, what: "A3 designs", printer: "A3 printer 1" },
];

// One run, step by step: build the sheets, send them, wait for the printers.
// Step 0 is the finished run, which is also the still picture.
const STEPS = [
  { built: 25, printed: 1, pill: "Printed", tone: "green" },
  { built: 0, printed: -1, pill: "In progress", tone: "blue" },
  { built: 7, printed: -1, pill: "In progress", tone: "blue" },
  { built: 14, printed: -1, pill: "In progress", tone: "blue" },
  { built: 21, printed: -1, pill: "In progress", tone: "blue" },
  { built: 25, printed: 0, pill: "Waiting for the printers", tone: "yellow" },
  { built: 25, printed: 0.6, pill: "Waiting for the printers", tone: "yellow" },
] as const;

export function PrintRun() {
  const [t, setT] = useState(0);
  const ref = useLiveLoop(() => setT((v) => v + 1), 1500);

  const step = STEPS[t % STEPS.length];
  const run = 14 + Math.floor((t + STEPS.length - 1) / STEPS.length);
  const done = step.printed === 1;
  const building = step.printed < 0;
  const barLabel = done ? "All sheets printed" : building ? "Building the sheets…" : "Sending to the printers…";

  return (
    <Frame loopRef={ref} className="bm-hub" label="Print run: groups of orders waiting to print, each with one Print button, and a live run building its sheets and sending them to the workshop printers, with sample data.">
      <HubShell
        rail="print"
        workspace="Print"
        nav={[
          {
            links: [
              { label: "Print run", icon: "printer", on: true },
              { label: "Machines", icon: "layers", count: 3 },
              { label: "Reprint", icon: "refresh" },
              { label: "Print history", icon: "clock" },
              { label: "Settings", icon: "gear" },
            ],
          },
        ]}
      >
        <div className="bm-row">
          <div className="bm-h1">Print run</div>
          <span className="bm-btn bm-sp"><Ico n="refresh" />Refresh</span>
        </div>

        <div className="bm-notice bm-notice--green">
          <span className="bm-dot" />
          <span className="bm-trunc">Live. Batches go to the printers, and orders are tagged once the printer confirms.</span>
        </div>

        <div className="bm-row" style={{ alignItems: "flex-start", gap: "1.1em" }}>
          {/* Waiting to print */}
          <div className="bm-col" style={{ flex: "1 1 0", gap: "0.9em" }}>
            <div className="bm-card" style={{ overflow: "hidden" }}>
              <div className="bm-card-h">
                <span className="bm-card-t">Waiting to print</span>
                <span className="bm-sp bm-cap">Oldest first</span>
              </div>
              {GROUPS.map((g, i) => {
                const first = g.n > 0 && GROUPS.findIndex((x) => x.n > 0) === i;
                const batch = Math.min(g.n, TOTAL);
                return (
                  <div key={g.name} className="bm-row" style={{ padding: "0.5em 1.1em", borderTop: "1px solid rgba(22,22,22,.08)", opacity: g.n ? 1 : 0.4 }}>
                    <span className="bm-num">{i + 1}</span>
                    <span className="bm-grow bm-trunc" style={{ fontSize: "0.95em" }}>{g.name}</span>
                    <span style={{ fontSize: "1.35em", fontWeight: 800, letterSpacing: "-0.03em" }}>{g.n}</span>
                    <span className={`bm-btn bm-btn--sm ${first ? "bm-btn--ink" : ""}`} style={{ minWidth: "5.6em", visibility: g.n ? "visible" : "hidden" }}>Print {batch}</span>
                  </div>
                );
              })}
            </div>
            <div className="bm-row">
              <div className="bm-input bm-grow"><span className="bm-ph">One order, e.g. #10482</span></div>
              <span className="bm-btn">Print order</span>
            </div>
          </div>

          {/* The live run */}
          <div className="bm-card" style={{ flex: "1.05 1 0", padding: "1em 1.1em 1.1em" }}>
            <div className="bm-row">
              <div className="bm-col bm-grow">
                <span className="bm-trunc" style={{ fontSize: "1.2em", fontWeight: 800, letterSpacing: "-0.02em" }}>Run {run}: Next Day</span>
                <span className="bm-cap">{TOTAL} orders</span>
              </div>
              <span className={`bm-pill bm-pill--${step.tone} bm-ease`}>{step.pill}</span>
            </div>

            <div className="bm-bar" style={{ marginTop: "0.9em", height: "0.75em" }}>
              <i className="bm-ease" style={{ width: `${(step.built / TOTAL) * 100}%`, background: done ? "#58bb46" : "#35bdf2", transition: step.built === 0 ? "none" : undefined }} />
            </div>
            <div className="bm-row" style={{ marginTop: "0.45em" }}>
              <span style={{ fontSize: "0.9em" }}>{barLabel}</span>
              <span className="bm-sp bm-cap bm-nw">{step.built} of {TOTAL} orders built</span>
            </div>

            <div className="bm-col" style={{ marginTop: "0.9em" }}>
              {SHEETS.map((sh) => {
                const printed = Math.round(sh.n * Math.max(0, step.printed));
                return (
                  <div key={sh.what} className="bm-row" style={{ padding: "0.6em 0", borderTop: "1px solid rgba(22,22,22,.08)" }}>
                    <Ico n="file" style={{ width: "1.3em", height: "1.3em", opacity: 0.5 }} />
                    <span className="bm-grow bm-trunc" style={{ fontSize: "0.93em" }}>
                      {sh.n} {sh.what} <span className="bm-mut">to {sh.printer}</span>
                    </span>
                    {building ? (
                      <span className="bm-pill bm-pulse">Building</span>
                    ) : done ? (
                      <span className="bm-pill bm-pill--green">All printed</span>
                    ) : (
                      <span className="bm-pill bm-pill--blue">{printed} of {sh.n} printed</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="bm-row" style={{ marginTop: "0.9em" }}>
              <span className="bm-cap" style={{ color: "#189bd6", fontWeight: 800 }}>Show the {TOTAL} orders</span>
              <span className="bm-sp bm-btn bm-btn--sm">{done ? "Done" : "Cancel run"}</span>
            </div>
          </div>
        </div>

        <div className="bm-card bm-s-hide">
          <div className="bm-card-h" style={{ paddingBottom: "0.4em" }}>
            <span className="bm-card-t">Needs attention (1)</span>
            <span className="bm-sp bm-cap">A design did not print</span>
          </div>
          <div className="bm-row" style={{ padding: "0.55em 1.1em 0.8em" }}>
            <span className="bm-mono">#10461</span>
            <span className="bm-grow bm-trunc" style={{ color: "#c2281a", fontSize: "0.92em" }}>The design file for line 2 could not be read.</span>
            <span className="bm-btn bm-btn--sm">Done</span>
          </div>
        </div>
      </HubShell>
    </Frame>
  );
}
