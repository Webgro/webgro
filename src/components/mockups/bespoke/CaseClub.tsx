"use client";

import { useState } from "react";
import { useLiveLoop } from "../useLiveLoop";
import { Frame, Ico, type IconName } from "./shared";

// Every name, date and coin amount here is invented sample data.
const TABS = ["Overview", "Members", "Prizes", "Campaigns", "Popups", "Referrals", "Analytics", "Settings"];

const CAMPAIGNS = [
  { name: "Double coins weekend", type: "Double points", runs: "Sat 17 to Sun 18 Oct", status: "Live" },
  { name: "Autumn collection bonus", type: "Collection bonus", runs: "1 to 31 Oct", status: "Live" },
  { name: "Refer a friend boost", type: "Referral boost", runs: "20 to 27 Oct", status: "Scheduled" },
  { name: "Spend and earn week", type: "Spend threshold", runs: "1 to 7 Nov", status: "Scheduled" },
  { name: "Half term coin drop", type: "Coin drop", runs: "26 Oct", status: "Draft" },
  { name: "Welcome back gift", type: "Gift drop", runs: "28 Sep", status: "Ended" },
];

const PRIZES = [
  { name: "£5 off your order", coins: "500" },
  { name: "£10 off your order", coins: "1,000" },
  { name: "£20 off your order", coins: "2,000" },
];

const EARN: { icon: IconName; label: string; coins: string }[] = [
  { icon: "box", label: "Each £1 spent", coins: "+10" },
  { icon: "star", label: "Review a product", coins: "+50" },
  { icon: "share", label: "Follow us", coins: "+25" },
  { icon: "calendar", label: "Your birthday", coins: "+100" },
  { icon: "users", label: "Refer a friend", coins: "+200" },
];

const TONE: Record<string, [string, string]> = {
  Live: ["rgba(88,187,70,.16)", "#2b7a1e"],
  Scheduled: ["rgba(255,201,51,.3)", "#7a5800"],
  Draft: ["rgba(22,22,22,.06)", "rgba(22,22,22,.6)"],
  Ended: ["rgba(22,22,22,.06)", "rgba(22,22,22,.45)"],
};

const COLS = { "--cols": "minmax(0,1.5fr) minmax(0,1fr) minmax(0,1.1fr) 6em", "--cols-s": "minmax(0,1fr) 5.6em" } as React.CSSProperties;

export function CaseClub() {
  // The shopper cashes in coins: picks an amount (phase 1), then the balance
  // drops and a discount code appears (phase 2, also the still picture).
  const [phase, setPhase] = useState(2);
  const ref = useLiveLoop(() => setPhase((v) => (v + 1) % 3), 2600);
  const cashed = phase === 2;

  return (
    <Frame loopRef={ref} className="bm-cc" label="Case Club loyalty app: the staff admin with its list of campaigns and prizes, beside the shopper's panel showing a coin balance, ways to earn and a reward cashed in for a discount code, with sample data.">
      <div className="bm-row bm-grow" style={{ alignItems: "stretch", gap: "1.6em", padding: "1.6em 1.8em 0" }}>
        {/* Staff admin */}
        <div className="bm-col bm-grow" style={{ gap: "0.95em" }}>
          <div className="bm-row">
            <span style={{ width: "2.2em", height: "2.2em", borderRadius: "0.65em", background: "#ffc933", display: "grid", placeItems: "center", flex: "none" }}>
              <span className="bm-cc-coin" style={{ width: "1em", height: "1em" }} />
            </span>
            <span className="bm-nw" style={{ fontSize: "1.5em", fontWeight: 700, letterSpacing: "-0.03em" }}>Case Club</span>
            <span className="bm-pill bm-pill--green"><span className="bm-dot" />Live</span>
            <span className="bm-sp bm-btn bm-s-hide" style={{ fontWeight: 600 }}>Analytics</span>
            <span className="bm-btn bm-btn--ink bm-s-hide" style={{ fontWeight: 600 }}>New campaign</span>
          </div>
          <div className="bm-row" style={{ gap: "0.2em", overflow: "hidden" }}>
            {TABS.map((t) => (
              <span key={t} className={`bm-cc-tab ${t === "Campaigns" ? "is-on" : ""} ${["Popups", "Referrals", "Analytics", "Overview"].includes(t) ? "bm-s-hide" : ""}`}>{t}</span>
            ))}
          </div>

          <div className="bm-cc-card" style={{ overflow: "hidden" }}>
            <div className="bm-row" style={{ padding: "0.8em 1.1em 0.6em" }}>
              <span style={{ fontWeight: 700 }}>Campaigns</span>
              <span className="bm-sp bm-cap bm-nw">2 running now</span>
            </div>
            <div className="bm-tr bm-thp" style={COLS}>
              <span>Campaign</span>
              <span className="bm-s-hide">Type</span>
              <span className="bm-s-hide">Runs</span>
              <span>Status</span>
            </div>
            {CAMPAIGNS.map((c) => (
              <div key={c.name} className="bm-tr" style={COLS}>
                <span className="bm-trunc" style={{ fontWeight: 600 }}>{c.name}</span>
                <span className="bm-trunc bm-s-hide" style={{ color: "rgba(22,22,22,.6)" }}>{c.type}</span>
                <span className="bm-trunc bm-s-hide" style={{ color: "rgba(22,22,22,.6)" }}>{c.runs}</span>
                <span><span className="bm-pill" style={{ background: TONE[c.status][0], color: TONE[c.status][1], fontWeight: 600 }}>{c.status}</span></span>
              </div>
            ))}
          </div>

          <div className="bm-cc-card" style={{ overflow: "hidden" }}>
            <div className="bm-row" style={{ padding: "0.8em 1.1em 0.6em" }}>
              <span style={{ fontWeight: 700 }}>Prizes</span>
              <span className="bm-sp bm-cap bm-nw" style={{ color: "#161616", fontWeight: 600 }}>Add a prize</span>
            </div>
            {PRIZES.map((p) => (
              <div key={p.name} className="bm-row" style={{ padding: "0.6em 1.1em", borderTop: "1px solid rgba(22,22,22,.08)", fontSize: "0.9em" }}>
                <span className="bm-grow bm-trunc" style={{ fontWeight: 600 }}>{p.name}</span>
                <span className="bm-row bm-nw" style={{ gap: "0.35em" }}><span className="bm-cc-coin" />{p.coins} coins</span>
                <span className="bm-sw is-on" style={{ background: "#ff7bb2" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Shopper's panel on a phone */}
        <div className="bm-phone" style={{ marginTop: 0 }}>
          <div className="bm-phone-s bm-hub" style={{ background: "#fff8ec", padding: "0.9em 0.9em 0", gap: "0.6em" }}>
            <div className="bm-col" style={{ gap: "0.1em" }}>
              <span style={{ fontSize: "0.58em", letterSpacing: "0.14em", fontWeight: 800 }}>FUN CASES REWARDS</span>
              <span className="bm-nw" style={{ fontSize: "1.9em", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>
                Case <span style={{ color: "#f03e2e" }}>Club</span>
              </span>
            </div>
            <span className="bm-trunc" style={{ alignSelf: "flex-start", maxWidth: "100%", background: "#f03e2e", color: "#fff", borderRadius: "99em", padding: "0.25em 0.8em", fontSize: "0.72em", fontWeight: 800 }}>Double coins all weekend!</span>

            <div style={{ background: "#fff", border: "0.15em solid #161616", borderRadius: "1.1em", padding: "0.7em 0.9em" }}>
              <div className="bm-lbl">Your balance</div>
              <div className="bm-row" style={{ gap: "0.4em" }}>
                <span key={String(cashed)} className="bm-in" style={{ fontSize: "2.3em", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1 }}>{cashed ? "700" : "1,200"}</span>
                <span className="bm-cc-coin" style={{ width: "1.1em", height: "1.1em" }} />
              </div>
              <div className="bm-cap">Worth {cashed ? "£7" : "£12"}</div>
            </div>

            <div className="bm-col" style={{ gap: "0.35em" }}>
              <span style={{ fontSize: "0.9em", fontWeight: 800 }}>Cash in <span className="bm-mut" style={{ fontWeight: 600, fontSize: "0.85em" }}>Pick an amount</span></span>
              <div className="bm-row" style={{ gap: "0.4em" }}>
                <span className="bm-cc-pill" style={{ fontSize: "0.85em", background: phase === 1 ? "#161616" : "#fff", color: phase === 1 ? "#fff" : "#161616" }}>£5</span>
                <span className="bm-cc-pill" style={{ fontSize: "0.85em", opacity: cashed ? 0.35 : 1 }}>£10</span>
                <span className="bm-cc-pill" style={{ fontSize: "0.85em", opacity: 0.35 }}>£20</span>
              </div>
            </div>

            <div className="bm-col" style={{ gap: "0.35em", minHeight: "4.1em" }}>
              <span style={{ fontSize: "0.9em", fontWeight: 800 }}>Your codes{cashed && <span className="bm-mut" style={{ fontWeight: 600, fontSize: "0.85em" }}> £5 off</span>}</span>
              {cashed ? (
                <div className="bm-row bm-in" style={{ gap: "0.4em" }}>
                  <span className="bm-mono bm-grow bm-trunc" style={{ border: "0.12em dashed #161616", borderRadius: "0.6em", padding: "0.35em 0.6em", fontSize: "0.82em", background: "#fff" }}>CLUB-7K2Q</span>
                  <span className="bm-cc-pill" style={{ fontSize: "0.78em", background: "#ffc933" }}>Use it</span>
                </div>
              ) : (
                <span className="bm-cap">{phase === 1 ? "Making your code…" : "No codes yet."}</span>
              )}
            </div>

            <div className="bm-col">
              <span style={{ fontSize: "0.9em", fontWeight: 800, marginBottom: "0.2em" }}>Ways to earn</span>
              {EARN.map((e) => (
                <div key={e.label} className="bm-row" style={{ padding: "0.38em 0", borderTop: "1px solid rgba(22,22,22,.1)", gap: "0.45em", fontSize: "0.82em" }}>
                  <Ico n={e.icon} style={{ width: "1.2em", height: "1.2em" }} />
                  <span className="bm-grow bm-trunc">{e.label}</span>
                  <span className="bm-nw" style={{ fontWeight: 800 }}>{e.coins}</span>
                  <span className="bm-cc-coin" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}
