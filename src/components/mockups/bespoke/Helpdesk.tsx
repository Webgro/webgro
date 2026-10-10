"use client";

import { useState } from "react";
import { useLiveLoop } from "../useLiveLoop";
import { Frame, HubShell, Ico } from "./shared";

// Triage steps for the open ticket. Step 0 is the finished state and the
// still picture. All ticket content is invented.
const STEPS = [
  { pill: "Ready for human", tone: "green", done: true },
  { pill: "New", tone: "blue", done: false },
  { pill: "Triaging", tone: "purple", done: false },
] as const;

export function Helpdesk() {
  const [t, setT] = useState(0);
  const ref = useLiveLoop(() => setT((v) => v + 1), 2600);
  const step = STEPS[t % STEPS.length];

  return (
    <Frame loopRef={ref} className="bm-hub" label="Customer service ticket: the conversation and an empty reply box on the left, with an AI summary, a suggested next step and the customer's order details on the right, with sample data.">
      <HubShell
        rail="service"
        workspace="Customer Service"
        nav={[
          {
            links: [
              { label: "Inbox", icon: "mail", on: true, count: 7 },
              { label: "Dashboard", icon: "chart" },
              { label: "Settings", icon: "gear" },
            ],
          },
        ]}
      >
        <div className="bm-row" style={{ gap: "0.5em" }}>
          <span className="bm-btn bm-btn--sm">← Inbox</span>
          <span className="bm-btn bm-btn--sm bm-s-hide" style={{ padding: "0.4em 0.55em" }}><Ico n="chevron" style={{ transform: "rotate(180deg)" }} /></span>
          <span className="bm-btn bm-btn--sm bm-s-hide" style={{ padding: "0.4em 0.55em" }}><Ico n="chevron" /></span>
          <span className="bm-sp" />
          <span className="bm-btn bm-btn--sm">Close</span>
          <span className="bm-btn bm-btn--sm">Spam</span>
          <span className="bm-btn bm-btn--sm bm-s-hide">More</span>
        </div>

        <div className="bm-col" style={{ gap: "0.5em" }}>
          <div className="bm-trunc" style={{ fontSize: "1.7em", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>Wrong phone model in my order</div>
          <div className="bm-row" style={{ gap: "0.6em" }}>
            <span className="bm-trunc" style={{ fontSize: "0.92em" }}>Jess M. <span className="bm-mut bm-s-hide">jess.m@example.com</span></span>
            <span className={`bm-pill bm-pill--${step.tone} bm-ease`}>{step.pill}</span>
            <span className="bm-ease" style={{ width: "1.9em", height: "1.9em", borderRadius: "50%", display: "grid", placeItems: "center", fontSize: "0.8em", fontWeight: 800, flex: "none", background: step.done ? "#ffc933" : "rgba(22,22,22,.08)", color: step.done ? "#161616" : "rgba(22,22,22,.4)" }}>{step.done ? 45 : "–"}</span>
            <span className="bm-pill bm-mono">#10482</span>
            <span className="bm-pill bm-s-hide">wrong item</span>
          </div>
        </div>

        <div className="bm-row" style={{ alignItems: "flex-start", gap: "1.1em" }}>
          {/* Conversation */}
          <div className="bm-col bm-grow" style={{ gap: "0.8em" }}>
            <div className="bm-card" style={{ padding: "0.85em 1em 0.9em" }}>
              <div className="bm-row" style={{ marginBottom: "0.6em" }}>
                <span className="bm-card-t">Reply to Jess</span>
                <span className="bm-btn bm-btn--sm bm-sp">Insert template<Ico n="chevron" style={{ transform: "rotate(90deg)" }} /></span>
              </div>
              <div className="bm-input" style={{ alignItems: "flex-start", height: "5.6em" }}>
                <span className="bm-ph">Write a reply…</span>
              </div>
              <div className="bm-row" style={{ marginTop: "0.65em", gap: "0.45em" }}>
                <span className="bm-cap bm-nw bm-s-hide">Attach files</span>
                <span className="bm-sp" />
                <span className="bm-btn bm-btn--sm bm-s-hide">Send &amp; waiting</span>
                <span className="bm-btn bm-btn--sm">Send &amp; close</span>
                <span className="bm-btn bm-btn--sm bm-btn--ink">Send</span>
              </div>
            </div>
            <div className="bm-cap">2 messages, newest first</div>
            <div className="bm-card" style={{ padding: "0.8em 1em" }}>
              <div className="bm-row" style={{ marginBottom: "0.35em" }}>
                <span className="bm-ini" style={{ fontSize: "0.72em", background: "rgba(255,123,178,.25)", color: "#b23a70" }}>JM</span>
                <span style={{ fontSize: "0.92em", fontWeight: 800 }}>Jess M.</span>
                <span className="bm-sp bm-cap bm-nw">12 min ago</span>
              </div>
              <div style={{ fontSize: "0.92em", fontWeight: 600, lineHeight: 1.45 }}>
                Hi, I ordered the leopard case for an iPhone 17 Pro but the one that arrived is for the 17 Pro Max. Could you send the right one? Thanks.
              </div>
            </div>
            <div className="bm-card bm-s-hide" style={{ padding: "0.8em 1em", borderLeft: "0.3em solid #35bdf2" }}>
              <div className="bm-row" style={{ marginBottom: "0.35em" }}>
                <span className="bm-ini" style={{ fontSize: "0.72em" }}>FC</span>
                <span style={{ fontSize: "0.92em", fontWeight: 800 }}>Fun Cases</span>
                <span className="bm-sp bm-cap bm-nw">3 days ago</span>
              </div>
              <div className="bm-trunc" style={{ fontSize: "0.92em", fontWeight: 600 }}>Your order #10482 is on its way. Track it with the link below.</div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="bm-col" style={{ flex: "none", width: "21.5em", gap: "0.8em" }}>
            <div className="bm-card" style={{ padding: "0.85em 1em 0.95em", background: "rgba(138,79,211,.06)", borderColor: "rgba(138,79,211,.28)", minHeight: "16.6em" }}>
              <div className="bm-row" style={{ color: "#6a34b1", marginBottom: "0.5em", gap: "0.45em" }}>
                <Ico n="sparkles" style={{ width: "1.25em", height: "1.25em" }} />
                <span className="bm-card-t">AI summary</span>
              </div>
              {step.done ? (
                <div key={t} className="bm-col bm-in" style={{ gap: "0.6em" }}>
                  <div style={{ fontSize: "0.9em", fontWeight: 600, lineHeight: 1.45 }}>
                    Customer received a 17 Pro Max case instead of the 17 Pro case ordered. Order is fulfilled and delivered. Wants the correct item.
                  </div>
                  <div className="bm-col" style={{ gap: "0.2em" }}>
                    <span className="bm-lbl">Suggested next step</span>
                    <span style={{ fontSize: "0.9em", lineHeight: 1.4 }}>Send a free replacement for line 1, then reply to confirm.</span>
                  </div>
                  <div className="bm-col" style={{ gap: "0.3em" }}>
                    <span className="bm-lbl">Priority</span>
                    <div className="bm-row" style={{ gap: "0.35em", flexWrap: "wrap" }}>
                      <span className="bm-pill bm-pill--purple">Wrong item sent</span>
                      <span className="bm-pill bm-pill--purple">Calm tone</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bm-col bm-pulse" style={{ gap: "0.55em" }}>
                  {[100, 92, 60, 0, 40, 78].map((w, i) => (
                    <span key={i} style={{ height: "0.7em", width: `${w}%`, borderRadius: "99em", background: "rgba(138,79,211,.22)" }} />
                  ))}
                  <span className="bm-cap" style={{ color: "#6a34b1" }}>{step.pill === "New" ? "Waiting for triage" : "Reading the order and the knowledge base…"}</span>
                </div>
              )}
            </div>

            <div className="bm-card" style={{ padding: "0.85em 1em 0.95em" }}>
              <div className="bm-row" style={{ marginBottom: "0.5em" }}>
                <span className="bm-card-t">Order</span>
                <span className="bm-mono bm-sp">#10482</span>
              </div>
              <div className="bm-grid" style={{ "--n": 2, gap: "0.45em 0.8em" } as React.CSSProperties}>
                {[
                  ["Fulfilment", "Fulfilled"],
                  ["Payment", "Paid"],
                  ["Ships to", "United Kingdom"],
                  ["Ordered", "5 Oct 2026"],
                ].map(([l, v]) => (
                  <div key={l} className="bm-col">
                    <span className="bm-lbl">{l}</span>
                    <span className="bm-trunc" style={{ fontSize: "0.9em" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="bm-col bm-s-hide" style={{ marginTop: "0.7em", paddingTop: "0.7em", borderTop: "1px solid rgba(22,22,22,.1)", gap: "0.5em" }}>
                <span className="bm-lbl">Refund or replace</span>
                <div className="bm-row">
                  <span className="bm-grow bm-trunc" style={{ fontSize: "0.88em" }}>Leopard case, iPhone 17 Pro</span>
                  <span className="bm-row" style={{ gap: "0.3em", border: "1px solid rgba(22,22,22,.14)", borderRadius: "0.7em", padding: "0.15em 0.5em", fontSize: "0.85em" }}>
                    <span className="bm-mut">−</span>1<span className="bm-mut">+</span>
                  </span>
                </div>
                <div className="bm-row" style={{ gap: "0.4em" }}>
                  <span className="bm-btn bm-btn--sm">Refund 1</span>
                  <span className="bm-btn bm-btn--sm bm-btn--sky">Replace 1 free</span>
                  <span className="bm-btn bm-btn--sm">Put on hold</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HubShell>
    </Frame>
  );
}
