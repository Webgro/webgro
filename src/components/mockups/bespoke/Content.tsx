"use client";

import { useState } from "react";
import { useLiveLoop } from "../useLiveLoop";
import { Art, Frame, HubShell } from "./shared";

const SHAPES = ["4:5", "1:1", "4:5", "9:16", "4:5", "1:1", "4:5"];
const FOLLOWERS = [8, 9, 9, 10, 9, 11, 12, 11, 12, 13, 12, 14, 13, 15, 14, 15, 16, 15, 17, 16, 18, 17, 18, 19, 18, 20, 19, 21, 20, 22];
const DAYS = ["Sat 10", "Sat 10", "Sun 11", "Sun 11", "Mon 12", "Mon 12", "Tue 13"];
const QUEUED = 5;

export function Content() {
  // Each step, the outlined pool item is scheduled: it joins the front of
  // the feed queue (the feed moves along one place and the oldest queued post
  // goes live), and a newly approved item takes its place in the pool.
  // All data is invented.
  const [n, setN] = useState(0);
  const ref = useLiveLoop(() => setN((v) => v + 1), 3400);

  // Item ids count up in the order they are scheduled: pool slot s holds the
  // next item due to leave from that slot, and the feed holds the last nine.
  const pool = Array.from({ length: 9 }, (_, s) => 100 + s + 9 * Math.floor((n + 8 - s) / 9));
  const feed = Array.from({ length: 9 }, (_, j) => 99 + n - j);
  const nextSlot = n % 9;

  const tiles = [
    { l: "Feed queue", v: String(QUEUED), h: "Posts waiting" },
    { l: "Stories queue", v: "7", h: "Stories waiting" },
    { l: "Next post", v: "Today 18:30", h: "Feed post" },
  ];

  return (
    <Frame loopRef={ref} className="bm-hub" label="Content scheduler: approved content in a pool, a row of queued stories, and a preview of the social feed with queued and live posts, with sample data.">
      <HubShell
        rail="content"
        workspace="Content & Social"
        nav={[
          {
            title: "Publish",
            links: [
              { label: "Scheduler", icon: "calendar", on: true },
              { label: "Calendar", icon: "grid" },
              { label: "Pool", icon: "layers", count: 9 },
              { label: "Performance", icon: "chart" },
            ],
          },
          {
            title: "Create",
            links: [
              { label: "Text graphics", icon: "pen" },
              { label: "Reviews", icon: "star" },
              { label: "Lifestyle", icon: "image" },
              { label: "Reels", icon: "video" },
              { label: "Blog", icon: "book" },
            ],
          },
          {
            title: "Settings",
            links: [
              { label: "Facts", icon: "check" },
              { label: "Usage", icon: "chart" },
            ],
          },
        ]}
      >
        <div className="bm-row" style={{ alignItems: "flex-end" }}>
          <div className="bm-col bm-grow" style={{ gap: "0.5em" }}>
            <div className="bm-h1">Scheduler.</div>
            <div className="bm-sub bm-trunc bm-s-hide">Drag approved content from the pool onto the feed or the stories row. The queue posts itself at your set times.</div>
          </div>
          <span className="bm-btn bm-s-hide">Posting times and connection</span>
        </div>

        <div className="bm-grid" style={{ "--n": 5, "--ns": 3 } as React.CSSProperties}>
          {tiles.map((t) => (
            <div key={t.l} className="bm-card bm-tile">
              <div className="bm-lbl">{t.l}</div>
              <div className="bm-tile-v" style={t.l === "Next post" ? { fontSize: "1.3em", lineHeight: 1.55 } : undefined}>{t.v}</div>
              <div className="bm-tile-h">{t.h}</div>
            </div>
          ))}
          <div className="bm-card bm-tile bm-row bm-s-hide" style={{ gridColumn: "span 2", gap: "1em" }}>
            <div className="bm-col">
              <div className="bm-lbl">Followers</div>
              <div className="bm-tile-v">24,180</div>
              <div className="bm-tile-h" style={{ color: "#2b7a1e" }}>+212 New this week</div>
            </div>
            <div className="bm-row bm-grow" style={{ alignItems: "flex-end", gap: "0.14em", height: "3.4em" }}>
              {FOLLOWERS.map((h, i) => (
                <span key={i} style={{ flex: 1, height: `${h * 4.4}%`, background: i > 22 ? "#58bb46" : "rgba(22,22,22,.16)", borderRadius: "0.15em" }} />
              ))}
            </div>
          </div>
        </div>

        <div className="bm-row" style={{ alignItems: "flex-start", gap: "1em" }}>
          {/* Approved pool */}
          <div className="bm-card" style={{ flex: "2 1 0", padding: "0 1em 1em" }}>
            <div className="bm-card-h" style={{ padding: "0.85em 0 0.1em" }}>
              <span className="bm-card-t">Approved pool</span>
              <span className="bm-pill">9</span>
            </div>
            <div className="bm-cap bm-trunc" style={{ marginBottom: "0.7em" }}>Drag onto the feed or stories</div>
            <div className="bm-grid" style={{ "--n": 3, gap: "0.5em" } as React.CSSProperties}>
              {pool.map((k, j) => {
                const shape = SHAPES[k % SHAPES.length];
                return (
                  <span key={k} className={n > 0 && j === (n + 8) % 9 ? "bm-in" : ""} style={{ position: "relative", display: "block" }}>
                    <Art k={k} kind="auto" style={{ display: "block", width: "100%", aspectRatio: "1 / 1", borderRadius: "0.7em" }} />
                    <span className={`bm-pill ${shape === "9:16" ? "bm-pill--blue" : "bm-pill--yellow"}`} style={{ position: "absolute", top: "0.4em", left: "0.4em", fontSize: "0.64em", padding: "0.1em 0.5em", background: shape === "9:16" ? "#35bdf2" : "#ffc933", color: "#161616" }}>
                      {shape}
                    </span>
                    {j === nextSlot && <span className="bm-in" style={{ position: "absolute", inset: 0, borderRadius: "0.7em", boxShadow: "inset 0 0 0 0.2em #161616" }} />}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="bm-col" style={{ flex: "3 1 0", gap: "1em" }}>
            {/* Stories */}
            <div className="bm-card" style={{ padding: "0 1em 0.8em" }}>
              <div className="bm-card-h" style={{ padding: "0.85em 0 0.5em" }}>
                <span className="bm-card-t">Stories</span>
                <span className="bm-cap bm-trunc bm-sp">Soonest first. Stories post without captions.</span>
              </div>
              <div className="bm-row" style={{ gap: "0.9em", overflow: "hidden" }}>
                {DAYS.map((d, i) => (
                  <span key={i} className="bm-col" style={{ alignItems: "center", gap: "0.25em", flex: "none" }}>
                    <span style={{ padding: "0.16em", borderRadius: "50%", border: "0.17em solid #8a4fd3", display: "block" }}>
                      <Art k={i + 3} kind={i % 2 ? "text" : "case"} style={{ display: "block", width: "3.3em", height: "3.3em", borderRadius: "50%" }} />
                    </span>
                    <span className="bm-cap bm-nw" style={{ fontSize: "0.7em" }}>{d}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Feed preview */}
            <div className="bm-card" style={{ padding: "0 1em 1em" }}>
              <div className="bm-card-h" style={{ padding: "0.85em 0 0.3em" }}>
                <span className="bm-card-t">Feed preview</span>
                <span className="bm-cap bm-trunc bm-sp bm-s-hide">Queued posts first, then what&rsquo;s already live.</span>
              </div>
              <div className="bm-row bm-cap" style={{ gap: "0.9em", marginBottom: "0.6em", fontSize: "0.74em" }}>
                {[
                  ["#ffc933", "Slot time"],
                  ["#8a4fd3", "Pinned time"],
                  ["#161616", "Live"],
                ].map(([c, l]) => (
                  <span key={l} className="bm-row bm-nw" style={{ gap: "0.35em" }}>
                    <span className="bm-dot" style={{ color: c }} />
                    {l}
                  </span>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "1px", borderRadius: "0.6em", overflow: "hidden" }}>
                {feed.map((k, j) => {
                  const queued = j < QUEUED;
                  const pinned = queued && k % 4 === 0;
                  return (
                    <span key={`${k}-${n}`} className={n > 0 ? "bm-slide" : ""} style={{ position: "relative", display: "block" }}>
                      <Art k={k} kind="auto" style={{ display: "block", width: "100%", aspectRatio: "5 / 4", borderRadius: 0, opacity: queued ? 1 : 0.92 }} />
                      <span className="bm-ease" style={{ position: "absolute", top: "0.45em", right: "0.45em", width: "0.85em", height: "0.85em", borderRadius: "50%", border: "0.14em solid #fff", background: queued ? (pinned ? "#8a4fd3" : "#ffc933") : "#161616" }} />
                      {!queued && (
                        <span style={{ position: "absolute", left: "0.45em", bottom: "0.4em", fontSize: "0.68em", color: "#fff", background: "rgba(22,22,22,.72)", borderRadius: "99em", padding: "0.1em 0.6em", whiteSpace: "nowrap" }}>
                          ♥ {120 + ((k * 37) % 400)}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </HubShell>
    </Frame>
  );
}
