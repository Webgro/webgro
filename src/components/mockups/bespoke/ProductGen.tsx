"use client";

import { useState } from "react";
import { useLiveLoop } from "../useLiveLoop";
import { Art, Frame, HubShell, Ico, type IconName } from "./shared";

const MODES: { t: string; d: string; icon: IconName; c: string }[] = [
  { t: "Match from photos", d: "Variations of the designs in your case screenshots.", icon: "image", c: "#35bdf2" },
  { t: "Brief", d: "Describe a theme, or write each brief yourself.", icon: "pen", c: "#8a4fd3" },
  { t: "Trending ideas", d: "Research what is trending and pick ideas to design.", icon: "bolt", c: "#ff8a26" },
  { t: "Clothing motif", d: "Artwork for tees and hoodies, with a transparent version.", icon: "tag", c: "#58bb46" },
];

const COUNTS = [2, 4, 6, 8, 10, 12];
// The "Designs per photo" choice steps through these, and the total follows.
const PICKS = [6, 8, 4];
const PHOTOS = 6;

export function ProductGen() {
  const [t, setT] = useState(0);
  const ref = useLiveLoop(() => setT((v) => v + 1), 2800);
  const per = PICKS[t % PICKS.length];
  const total = per * PHOTOS;

  return (
    <Frame loopRef={ref} className="bm-hub" label="Product generation, new designs: choose a starting point, add case photos, set how many designs to make from each, and queue the run, with sample data.">
      <HubShell
        rail="products"
        workspace="Product Gen"
        nav={[
          {
            links: [
              { label: "New designs", icon: "sparkles", on: true },
              { label: "Review", icon: "check", count: 12 },
              { label: "Designs", icon: "grid" },
              { label: "Templates", icon: "layers" },
              { label: "Queue", icon: "list", count: 48 },
              { label: "Rivals", icon: "eye" },
            ],
          },
        ]}
      >
        <div className="bm-row" style={{ alignItems: "flex-end" }}>
          <div className="bm-col bm-grow" style={{ gap: "0.5em" }}>
            <div className="bm-h1">New designs.</div>
            <div className="bm-sub bm-trunc bm-s-hide">Start a run from case photos, a brief, trending ideas or a clothing motif. Runs are queued on the server.</div>
          </div>
          <span className="bm-btn">Review</span>
        </div>

        <div className="bm-grid" style={{ "--n": 4, gap: "0.8em" } as React.CSSProperties}>
          {MODES.map((m, i) => (
            <div key={m.t} className="bm-card" style={{ padding: "0.8em 0.9em", border: i === 0 ? "0.15em solid #161616" : undefined }}>
              <span style={{ width: "2.3em", height: "2.3em", borderRadius: "0.75em", background: m.c, color: "#fff", display: "grid", placeItems: "center" }}>
                <Ico n={m.icon} style={{ width: "1.35em", height: "1.35em" }} />
              </span>
              <div className="bm-trunc" style={{ fontSize: "0.98em", fontWeight: 800, marginTop: "0.5em" }}>{m.t}</div>
              <div className="bm-cap bm-s-hide" style={{ fontSize: "0.76em", lineHeight: 1.35, marginTop: "0.15em" }}>{m.d}</div>
            </div>
          ))}
        </div>

        <div className="bm-card" style={{ padding: "0.95em 1.1em 1.1em" }}>
          <div className="bm-card-t" style={{ marginBottom: "0.7em" }}>Match from photos</div>
          <div className="bm-row" style={{ alignItems: "stretch", gap: "0.9em" }}>
            <div className="bm-col bm-s-hide" style={{ flex: "none", width: "13em", border: "0.15em dashed rgba(22,22,22,.25)", borderRadius: "1em", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0.8em", gap: "0.4em" }}>
              <Ico n="share" style={{ width: "1.8em", height: "1.8em", opacity: 0.45 }} />
              <span className="bm-cap" style={{ lineHeight: 1.35 }}>Drop case screenshots here, or click to browse</span>
            </div>
            <div className="bm-grid bm-grow" style={{ "--n": 6, gap: "0.55em" } as React.CSSProperties}>
              {Array.from({ length: PHOTOS }, (_, i) => (
                <span key={i} style={{ position: "relative", display: "block" }}>
                  <span className="bm-pg-photo" style={{ overflow: "hidden" }}><Art k={i + 8} style={{ display: "block", width: "100%", height: "100%", borderRadius: 0 }} /></span>
                  <span className="bm-pill bm-pill--ink" style={{ position: "absolute", top: "0.35em", left: "0.35em", fontSize: "0.66em", padding: "0.05em 0.5em" }}>{i + 1}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="bm-row" style={{ marginTop: "0.9em", gap: "1.6em", alignItems: "flex-end" }}>
            <div className="bm-col" style={{ gap: "0.3em" }}>
              <span className="bm-lbl">Designs per photo</span>
              <span className="bm-seg">
                {COUNTS.map((c) => (
                  <span key={c} className={c === per ? "is-on" : ""}>{c}</span>
                ))}
              </span>
            </div>
            <div className="bm-col bm-s-hide" style={{ gap: "0.3em" }}>
              <span className="bm-lbl">How close to the photos</span>
              <span className="bm-seg">
                <span className="is-on">Inspired by</span>
                <span>Close variation</span>
              </span>
            </div>
          </div>
        </div>

        <div className="bm-card bm-row bm-s-hide" style={{ padding: "0.7em 1.1em" }}>
          <span className="bm-card-t">Style</span>
          <span className="bm-cap bm-grow bm-trunc">Technique: Auto · Inks: 4</span>
          <Ico n="chevron" style={{ width: "1.1em", height: "1.1em", transform: "rotate(90deg)", opacity: 0.5 }} />
        </div>

        {/* Sticky bottom bar */}
        <div className="bm-row" style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: "#fff", borderTop: "0.15em solid #161616", padding: "0.8em 2em", gap: "1.2em" }}>
          <div className="bm-col bm-grow">
            <span className="bm-trunc" style={{ fontSize: "1.25em", fontWeight: 800, letterSpacing: "-0.02em" }}>{total} designs from {PHOTOS} photos</span>
            <span className="bm-cap bm-trunc">Batch: half price, usually within an hour</span>
          </div>
          <span className="bm-row bm-s-hide" style={{ gap: "0.45em", color: "#c2281a", fontSize: "0.92em" }}>
            Urgent <span className="bm-sw" />
          </span>
          <span className="bm-btn bm-btn--ink" style={{ fontSize: "1.05em", padding: "0.65em 1.4em", minWidth: "11.4em" }}>Create {total} designs</span>
        </div>
      </HubShell>
    </Frame>
  );
}
