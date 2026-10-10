"use client";

import { useState } from "react";
import { useLiveLoop } from "../useLiveLoop";
import { Frame, Ico, type IconName } from "./shared";

const MENU: { label: string; icon: IconName }[] = [
  { label: "Dashboard", icon: "home" },
  { label: "Pages", icon: "file" },
  { label: "Forms", icon: "list" },
  { label: "Identity checks", icon: "shield" },
  { label: "Plugins", icon: "layers" },
  { label: "Users", icon: "users" },
  { label: "Settings", icon: "gear" },
];

// Placeholder form names. No person, result or stored record is shown.
const FORMS = ["Instruct us: individual", "Instruct us: limited company", "Instruct us: solicitor", "Instruct us: surveyor"];

const ON_SUBMIT = [
  "Confirm the form straight away and run checks in the background",
  "Check identity with the Identity check provider",
  "Send a secure link for the ID document and face check when one is needed",
  "Never block a submission. Flag it to the team instead",
];

// A neutral status line. The last one is also the still picture.
const STATUS = [
  { text: "New submission received. The form has confirmed to the client.", busy: false, tone: "#2271b1" },
  { text: "Checks running in the background.", busy: true, tone: "#2271b1" },
  { text: "Report emailed to the team.", busy: false, tone: "#00a32a" },
];

export function KycSettings() {
  const [t, setT] = useState(2);
  const ref = useLiveLoop(() => setT((v) => v + 1), 2600);
  const st = STATUS[t % STATUS.length];

  return (
    <Frame loopRef={ref} className="bm-wa" label="Settings screen for an identity check plugin in WordPress admin: which forms it is attached to, switches for what runs when a form is submitted, where the report is sent, and a status line saying checks are running in the background. No results or personal details are shown.">
      <div className="bm-wa-side">
        {MENU.map((m) => (
          <div key={m.label} className={`bm-wa-lk ${m.label === "Identity checks" ? "is-on" : ""}`}>
            <Ico n={m.icon} />
            {m.label}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2.2em", background: "#1d2327", color: "#c3c4c7", display: "flex", alignItems: "center", padding: "0 0.9em", fontSize: "0.86em", gap: "0.6em" }}>
        <Ico n="home" style={{ width: "1.2em", height: "1.2em" }} />
        Sample Firm
        <span className="bm-sp">Howdy, Sam</span>
      </div>

      <div className="bm-col bm-grow" style={{ padding: "3.5em 1.8em 0", gap: "0.9em", overflow: "hidden" }}>
        <span className="bm-nw" style={{ fontSize: "1.55em", fontWeight: 400, lineHeight: 1.2 }}>Identity checks: settings</span>

        <div className="bm-wa-note" style={{ borderLeftColor: st.tone }}>
          {st.busy ? <span className="bm-spin" /> : <Ico n="check" style={{ width: "1.1em", height: "1.1em", color: st.tone }} />}
          <span key={t} className="bm-in bm-trunc">{st.text}</span>
        </div>

        <div className="bm-wa-box">
          <div className="bm-wa-row" style={{ borderTop: 0 }}>
            <span>Attached to forms</span>
            <div className="bm-col" style={{ gap: "0.35em" }}>
              {FORMS.map((f, i) => (
                <span key={f} className={`bm-row ${i > 1 ? "bm-s-hide" : ""}`} style={{ gap: "0.5em" }}>
                  <span style={{ width: "1.05em", height: "1.05em", border: "1px solid #8c8f94", borderRadius: "0.2em", display: "grid", placeItems: "center", color: "#2271b1", flex: "none", background: "#fff" }}>
                    <Ico n="check" style={{ width: "0.85em", height: "0.85em", strokeWidth: 3 }} />
                  </span>
                  <span className="bm-trunc">{f}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="bm-wa-row">
            <span>When a form is submitted</span>
            <div className="bm-col" style={{ gap: "0.5em" }}>
              {ON_SUBMIT.map((o, i) => (
                <span key={o} className={`bm-row ${i === 3 ? "bm-s-hide" : ""}`} style={{ gap: "0.6em", alignItems: "flex-start" }}>
                  <span className="bm-wa-sw" />
                  <span style={{ lineHeight: 1.35 }}>{o}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="bm-wa-row">
            <span>Returning clients</span>
            <span className="bm-row" style={{ gap: "0.6em", alignItems: "flex-start" }}>
              <span className="bm-wa-sw" />
              <span style={{ lineHeight: 1.35 }}>Skip the ID and face check if already done. Other checks still run every time</span>
            </span>
          </div>
          <div className="bm-wa-row">
            <span>Send the report to</span>
            <div className="bm-col" style={{ gap: "0.3em" }}>
              <span className="bm-wa-in" style={{ maxWidth: "20em" }}>team@example.com</span>
              <span style={{ fontSize: "0.88em", color: "#646970" }}>A branded PDF for every submission.</span>
            </div>
          </div>
          <div className="bm-wa-row">
            <span>Name on the report</span>
            <span className="bm-wa-in" style={{ maxWidth: "20em" }}>Sample Firm</span>
          </div>
          <div className="bm-wa-row">
            <span>Identity check provider</span>
            <span className="bm-row" style={{ gap: "0.45em", color: "#00a32a" }}><span className="bm-dot" />Connected</span>
          </div>
        </div>
        <span style={{ alignSelf: "flex-start", background: "#2271b1", color: "#fff", borderRadius: "0.3em", padding: "0.45em 1em", fontSize: "0.92em" }}>Save Changes</span>
      </div>
    </Frame>
  );
}
