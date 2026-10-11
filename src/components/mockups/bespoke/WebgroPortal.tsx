"use client";

import { useState } from "react";
import { useLiveLoop } from "../useLiveLoop";
import { Frame, Ico, type IconName } from "./shared";

const NAV: { label: string; icon: IconName; n?: number }[] = [
  { label: "Overview", icon: "home" },
  { label: "Customers", icon: "users" },
  { label: "Proposals", icon: "file", n: 3 },
  { label: "Projects", icon: "layers" },
  { label: "Billing", icon: "pound", n: 2 },
  { label: "Reports", icon: "chart" },
  { label: "Maintenance", icon: "wrench" },
  { label: "Broken links", icon: "link" },
  { label: "Design feedback", icon: "chat" },
  { label: "Social", icon: "share" },
  { label: "Data", icon: "database" },
  { label: "Import from Xero", icon: "refresh" },
  { label: "News emails", icon: "mail" },
  { label: "Email log", icon: "list" },
  { label: "Audit log", icon: "clock" },
  { label: "Settings", icon: "gear" },
  { label: "Security", icon: "shield" },
];

// Every count and client name here is invented. No revenue or other money
// figure is shown on this screen.
const STATS: { l: string; v: string; note: string; ok?: boolean }[] = [
  { l: "Active customers", v: "24", note: "6 prospects · 2 paused" },
  { l: "Open proposals", v: "3", note: "2 opened this week" },
  { l: "Active projects", v: "5", note: "1 waiting on the client" },
  { l: "Sites maintained", v: "18", note: "All fine", ok: true },
];

const ACTIVITY = [
  ["09:42", "Proposal opened", "Northfield Dental"],
  ["09:15", "Weekly report sent", "Client A"],
  ["08:50", "Weekly updates finished, no changes found", "Harbour Coffee Co"],
  ["08:02", "Project stage signed off", "Client B"],
  ["Fri", "Design feedback received, 4 comments", "Elm Street Yoga"],
  ["Fri", "Welcome email sent", "Client C"],
];

export function WebgroPortal() {
  // The newest proposal gets opened by the client: "Not opened", then a rising count.
  const [t, setT] = useState(2);
  const ref = useLiveLoop(() => setT((v) => v + 1), 2600);

  const proposals = [
    { who: ["Northfield Dental", "Oak Lane Nursery", "Client E"][Math.floor(t / 4) % 3], opened: t % 4 },
    { who: "Client A", opened: 4 },
    { who: "Harbour Coffee Co", opened: 1 },
  ];

  return (
    <Frame loopRef={ref} className="bm-wp" label="Webgro portal admin overview: counts of active customers, open proposals, active projects and sites maintained, then open proposals, projects, maintenance, welcome emails and recent activity, with invented counts and placeholder client names.">
      <div className="bm-wp-side">
        <div className="bm-wp-d" style={{ color: "#fff", fontSize: "1.5em", padding: "0 0.45em 0.8em", lineHeight: 1 }}>
          webgro<span style={{ color: "#2d8dff" }}>.</span>
        </div>
        {NAV.map((n) => (
          <div key={n.label} className={`bm-wp-lk ${n.label === "Overview" ? "is-on" : ""}`}>
            <Ico n={n.icon} />
            {n.label}
            {n.n ? <i>{n.n}</i> : null}
          </div>
        ))}
      </div>

      <div className="bm-col bm-grow" style={{ padding: "1.7em 2.1em 0", gap: "1em", overflow: "hidden" }}>
        <div className="bm-col" style={{ gap: "0.15em" }}>
          <div className="bm-wp-d" style={{ fontSize: "1.9em", lineHeight: 1.1 }}>Overview</div>
          <div style={{ fontSize: "0.9em", color: "rgba(13,13,15,.55)" }}>Saturday 10 October</div>
        </div>

        <div className="bm-grid" style={{ "--n": 4, gap: "0.8em" } as React.CSSProperties}>
          {STATS.map((x) => (
            <div key={x.l} className="bm-wp-card" style={{ padding: "1em 1.15em 1.05em" }}>
              <div className="bm-trunc" style={{ fontSize: "0.82em", color: "rgba(13,13,15,.55)" }}>{x.l}</div>
              <div className="bm-wp-d" style={{ fontSize: "2.6em", lineHeight: 1.2, letterSpacing: "-0.04em" }}>{x.v}</div>
              <div className="bm-trunc" style={{ fontSize: "0.8em", color: x.ok ? "#0a8f5f" : "rgba(13,13,15,.55)" }}>{x.note}</div>
            </div>
          ))}
        </div>

        <div className="bm-grid" style={{ "--n": 2, gap: "0.8em" } as React.CSSProperties}>
          <div className="bm-wp-card">
            <div className="bm-wp-d" style={{ fontSize: "1.05em", marginBottom: "0.4em" }}>Open proposals</div>
            {proposals.map((p) => (
              <div key={p.who} className="bm-wp-li">
                <span className="bm-grow bm-trunc bm-in">{p.who}</span>
                <span key={p.opened} className="bm-nw bm-in" style={{ color: p.opened ? "#1a6fd6" : "rgba(13,13,15,.5)", fontWeight: p.opened ? 600 : 500 }}>
                  {p.opened ? `Opened ${p.opened}×` : "Not opened"}
                </span>
              </div>
            ))}
          </div>
          <div className="bm-wp-card">
            <div className="bm-wp-d" style={{ fontSize: "1.05em", marginBottom: "0.4em" }}>Projects</div>
            <div className="bm-wp-li">
              <span className="bm-grow bm-trunc">Client B</span>
              <span className="bm-wp-badge" style={{ background: "#fbeedd", color: "#b25e09" }}>Awaiting deposit</span>
            </div>
            <div className="bm-wp-li">
              <span className="bm-grow bm-trunc">Elm Street Yoga</span>
              <span className="bm-nw bm-trunc" style={{ color: "#c2334d", fontWeight: 600 }}>Overdue: send logo files</span>
            </div>
            <div className="bm-wp-li">
              <span className="bm-grow bm-trunc">Client C</span>
              <span className="bm-wp-badge" style={{ background: "#e3effe", color: "#1a6fd6" }}>Launched: connect analytics</span>
            </div>
          </div>
          <div className="bm-wp-card">
            <div className="bm-row" style={{ marginBottom: "0.4em" }}>
              <span className="bm-wp-d" style={{ fontSize: "1.05em" }}>Maintenance</span>
              <span className="bm-sp bm-nw" style={{ fontSize: "0.84em", color: "#1a6fd6", fontWeight: 600 }}>All sites</span>
            </div>
            <div className="bm-trunc" style={{ fontSize: "0.86em", color: "rgba(13,13,15,.55)", paddingBottom: "0.45em" }}>18 of 18 sites connected · 7 updates waiting for the weekly runs</div>
            <div className="bm-wp-li">
              <span className="bm-grow bm-trunc" style={{ color: "#0a8f5f" }}>Nothing needs you. Updates, uptime and security are all in hand.</span>
            </div>
          </div>
          <div className="bm-wp-card">
            <div className="bm-wp-d" style={{ fontSize: "1.05em", marginBottom: "0.4em" }}>Waiting on a welcome email</div>
            <div className="bm-wp-li">
              <span className="bm-grow bm-trunc">Alex R. <span style={{ color: "rgba(13,13,15,.5)" }}>at Client D</span></span>
              <span className="bm-wp-badge" style={{ border: "1px solid rgba(13,13,15,.2)" }}>Preview</span>
            </div>
            <div className="bm-wp-li">
              <span className="bm-grow bm-trunc">Sam T. <span style={{ color: "rgba(13,13,15,.5)" }}>at Riverside Vets</span></span>
              <span className="bm-wp-badge" style={{ border: "1px solid rgba(13,13,15,.2)" }}>Preview</span>
            </div>
          </div>
        </div>

        <div className="bm-wp-card">
          <div className="bm-wp-d" style={{ fontSize: "1.05em", marginBottom: "0.4em" }}>Recent activity</div>
          {ACTIVITY.map((a) => (
            <div key={a[1]} className="bm-wp-li">
              <span style={{ color: "rgba(13,13,15,.5)", width: "3.4em", flex: "none" }}>{a[0]}</span>
              <span className="bm-grow bm-trunc">{a[1]}</span>
              <span className="bm-nw" style={{ color: "rgba(13,13,15,.6)" }}>{a[2]}</span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}
