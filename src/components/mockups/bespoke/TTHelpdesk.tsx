"use client";

import { useState } from "react";
import { useLiveLoop } from "../useLiveLoop";
import { Frame, Ico, type IconName } from "./shared";

type Kind = "answer" | "escalate" | "return";
type Ticket = { id: number; intent: string; email: string; conf: number; kind: Kind; draft: string };

const BADGE: Record<Kind, { label: string; bg: string; fg: string }> = {
  answer: { label: "answer · will close", bg: "#ede9fe", fg: "#6d28d9" },
  escalate: { label: "escalate · stays open", bg: "#fef3c7", fg: "#b45309" },
  return: { label: "return · needs approval", bg: "#dcfce7", fg: "#15803d" },
};

// Invented sample tickets and drafts.
const POOL: Ticket[] = [
  { id: 4821, intent: "where is my order", email: "jess.m@example.com", conf: 94, kind: "answer", draft: "Hi Jess, I am the Twisted Tailor AI assistant. Your order #10482 was dispatched yesterday and is with the courier now. The tracking link in your dispatch email will show each step. It should be with you within two working days." },
  { id: 4822, intent: "sizing", email: "omar.k@example.com", conf: 88, kind: "answer", draft: "Hi Omar, I am the Twisted Tailor AI assistant. The skinny fit suit comes up close on the chest, so if you are between sizes we suggest the larger jacket. The size guide on the product page has the full chest and waist measurements." },
  { id: 4823, intent: "returns", email: "priya.s@example.com", conf: 81, kind: "return", draft: "Hi Priya, I am the Twisted Tailor AI assistant. Sorry the returns page did not work for you. I have prepared a return for the navy trousers on order #10466. Once the team approves it, your label will arrive by email." },
  { id: 4824, intent: "faulty item", email: "tom.b@example.com", conf: 62, kind: "escalate", draft: "Hi Tom, I am the Twisted Tailor AI assistant. I am sorry the jacket arrived with a loose button. I have passed this to the team with your photos, and one of them will reply to you directly." },
  { id: 4825, intent: "order changes", email: "ana.r@example.com", conf: 90, kind: "answer", draft: "Hi Ana, I am the Twisted Tailor AI assistant. Your order #10451 has not been packed yet, so the delivery address can still be changed. Reply with the new address and the team will update it." },
];

const NAV: { label: string; icon: IconName }[] = [
  { label: "Dashboard", icon: "home" },
  { label: "Knowledgebase", icon: "book" },
  { label: "Review queue", icon: "list" },
  { label: "Usage & billing", icon: "chart" },
  { label: "Settings", icon: "gear" },
  { label: "Users", icon: "users" },
];

export function TTHelpdesk() {
  // The top draft is approved and sent (phase 1), its card folds away
  // (phase 2), then the queue has moved up and the next draft is on top.
  const [s, setS] = useState({ i: 0, phase: 0 });
  const ref = useLiveLoop(() => setS((v) => (v.phase === 2 ? { i: v.i + 1, phase: 0 } : { i: v.i, phase: v.phase + 1 })), 2100);

  const cards = [0, 1, 2, 3].map((j) => ({ key: s.i + j, t: POOL[(s.i + j) % POOL.length] }));
  const waiting = s.phase === 0 ? 3 : 2;

  return (
    <Frame loopRef={ref} className="bm-tt" label="Twisted Tailor helpdesk review queue: AI drafted replies to support tickets, each with its topic, confidence and decision, waiting for a person to approve and send or dismiss, with sample data.">
      <div className="bm-tt-side">
        <div style={{ color: "#fff", fontSize: "1.2em", fontWeight: 600, padding: "0 0.6em" }}>TT Helpdesk</div>
        <div style={{ fontSize: "0.8em", padding: "0.2em 0.9em 1.4em", color: "#71717a" }}>Twisted Tailor · AI support</div>
        <div className="bm-col" style={{ gap: "0.15em" }}>
          {NAV.map((n) => (
            <div key={n.label} className={`bm-tt-lk ${n.label === "Review queue" ? "is-on" : ""}`}>
              <Ico n={n.icon} />
              {n.label}
            </div>
          ))}
        </div>
        <div style={{ marginTop: "auto", border: "1px solid #3f3f46", borderRadius: "0.6em", padding: "0.6em 0.75em" }}>
          <div style={{ color: "#fff", fontSize: "0.88em" }}>Sam T.</div>
          <div style={{ fontSize: "0.76em" }}>Sign out</div>
        </div>
        <div style={{ fontSize: "0.74em", padding: "0.8em 0.75em 0", color: "#71717a" }}>Built by Webgro</div>
      </div>

      <div className="bm-col bm-grow" style={{ padding: "1.8em 2.2em 0", gap: "1em", overflow: "hidden" }}>
        <div className="bm-col" style={{ gap: "0.2em" }}>
          <div style={{ fontSize: "1.8em", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.15 }}>Review queue</div>
          <div style={{ fontSize: "0.95em", color: "#71717a" }}>{waiting} drafts awaiting your approval</div>
        </div>

        {cards.map(({ key, t }, j) => {
          const sent = j === 0 && s.phase > 0;
          const gone = j === 0 && s.phase === 2;
          const b = BADGE[t.kind];
          return (
            <div key={key} className="bm-tt-card bm-tt-fold" style={gone ? { maxHeight: 0, opacity: 0, paddingTop: 0, paddingBottom: 0, marginBottom: "-1em", borderColor: "transparent" } : undefined}>
              <div className="bm-row" style={{ alignItems: "flex-start" }}>
                <div className="bm-col bm-grow">
                  <span className="bm-trunc" style={{ fontWeight: 600 }}>#{t.id} · {t.intent}</span>
                  <span className="bm-trunc" style={{ fontSize: "0.82em", color: "#71717a" }}>{t.email} · confidence {t.conf}%</span>
                </div>
                <span className="bm-tt-badge" style={{ background: b.bg, color: b.fg }}>{b.label}</span>
              </div>
              <div className="bm-tt-draft" style={{ margin: "0.7em 0" }}>
                <span style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{t.draft}</span>
              </div>
              <div className="bm-row" style={{ gap: "1.2em" }}>
                <span className="bm-tt-btn" style={{ background: sent ? "#16a34a" : "#7c3aed" }}>
                  {sent && <Ico n="check" />}
                  {sent ? "Sent" : t.kind === "return" ? "Approve & create return" : "Approve & send"}
                </span>
                <span style={{ fontSize: "0.9em", color: "#52525b" }}>Dismiss</span>
                <span className="bm-sp bm-nw" style={{ fontSize: "0.88em", color: "#7c3aed" }}>Open ticket →</span>
              </div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
}
