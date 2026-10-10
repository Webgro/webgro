"use client";

import { useState } from "react";
import { useLiveLoop } from "../useLiveLoop";
import { Frame, Ico } from "./shared";

// The wait, step by step. The last step is also the still picture.
const STEPS = [
  { h: "Checking your photo", p: 18 },
  { h: "Tailoring it to you", p: 48 },
  { h: "Tailoring it to you", p: 78 },
  { h: "Tailoring it to you", p: 100 },
];

/** A plain drawn figure, never a real person. `suit` dresses it in the garment. */
function Figure({ suit }: { suit?: boolean }) {
  const body = suit ? "#1f2a44" : "#b9b6b0";
  const skin = "#d8d4cd";
  return (
    <svg viewBox="0 0 90 120" preserveAspectRatio="xMidYMax meet">
      <rect width="90" height="120" fill={suit ? "#ecebe8" : "#e4e2de"} />
      <circle cx="45" cy="22" r="9" fill={skin} />
      <rect x="41.500" y="29" width="7" height="6" fill={skin} />
      <path d="M28 40 Q45 31 62 40 L66 76 L59 77 L57 52 L57 80 L33 80 L33 52 L31 77 L24 76 Z" fill={body} />
      <path d="M33 80 L57 80 L55 120 L47 120 L45 88 L43 120 L35 120 Z" fill={suit ? "#1f2a44" : "#a5a29c"} />
      {suit && <path d="M40 36 L45 52 L50 36 L47 34 L45 38 L43 34 Z" fill="#f4f3f1" />}
      {suit && <path d="M45 52 L45 80" stroke="#141c30" strokeWidth="0.800" />}
    </svg>
  );
}

function Head({ step, beta }: { step: number; beta?: boolean }) {
  return (
    <div className="bm-row" style={{ gap: "0.6em" }}>
      <span className="bm-to-step">{step}</span>
      <span style={{ width: "2.2em", height: "2.9em", background: "#1f2a44", flex: "none" }} />
      <div className="bm-col bm-grow">
        <span className="bm-row" style={{ gap: "0.5em" }}>
          <span className="bm-to-eyebrow bm-trunc">Try it on with AI</span>
          {beta && <span style={{ fontSize: "0.58em", fontWeight: 700, letterSpacing: "0.1em", border: "1px solid #111", padding: "0.05em 0.4em" }}>BETA</span>}
        </span>
        <span className="bm-trunc" style={{ fontSize: "0.86em", color: "#666" }}>Navy suit jacket</span>
      </div>
      <span style={{ fontSize: "1.2em", lineHeight: 1, color: "#666" }}>×</span>
    </div>
  );
}

export function TryOn() {
  const [t, setT] = useState(3);
  const ref = useLiveLoop(() => setT((v) => v + 1), 2200);
  const s = STEPS[t % STEPS.length];
  const run = Math.floor(t / STEPS.length);

  return (
    <Frame loopRef={ref} className="bm-to" label="Twisted Tailor try it on with AI widget, in beta, shown as three steps: agreeing to the photo terms and choosing a photo, the wait while the image is made, and the result with its AI preview label and brand watermark. The person is a plain drawn figure.">
      <div className="bm-row bm-grow" style={{ alignItems: "flex-start", gap: "1.4em", padding: "2.6em 2em 0" }}>
        {/* 1. Start */}
        <div className="bm-to-panel bm-s-hide">
          <Head step={1} beta />
          <div style={{ fontSize: "1.5em", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15 }}>See it on you</div>
          <div style={{ fontSize: "0.86em", lineHeight: 1.45, color: "#444" }}>Upload a full-length photo and we&rsquo;ll show you wearing it in about 30 seconds.</div>
          <div className="bm-grid" style={{ "--n": 2, gap: "0.5em 0.8em" } as React.CSSProperties}>
            {["Head to toe in the frame", "Standing, facing the camera", "Good light, just you in the photo", "Mirror selfies are fine"].map((tip) => (
              <span key={tip} className="bm-row" style={{ alignItems: "flex-start", gap: "0.35em", fontSize: "0.76em", lineHeight: 1.35 }}>
                <Ico n="check" style={{ width: "1.1em", height: "1.1em", marginTop: "0.1em" }} />
                {tip}
              </span>
            ))}
          </div>
          <div className="bm-row" style={{ alignItems: "flex-start", gap: "0.55em", background: "#f2f2f2", padding: "0.7em 0.8em" }}>
            <span style={{ width: "1.1em", height: "1.1em", background: "#111", color: "#fff", display: "grid", placeItems: "center", flex: "none", marginTop: "0.1em" }}>
              <Ico n="check" style={{ width: "0.8em", height: "0.8em" }} />
            </span>
            <span style={{ fontSize: "0.72em", lineHeight: 1.45, color: "#444" }}>
              I&rsquo;m 18 or over and I agree to my photo being processed by AI to create this image. Your original photo isn&rsquo;t stored. The try-on image is kept for 7 days, then deleted. <u>Privacy policy</u>
            </span>
          </div>
          <span className="bm-to-btn">Choose or take a photo</span>
        </div>

        {/* 2. Working */}
        <div className="bm-to-panel">
          <Head step={2} />
          <div className="bm-to-frame">
            <span style={{ position: "absolute", inset: 0, opacity: 0.55, filter: "grayscale(1)" }}><Figure /></span>
            <span style={{ position: "absolute", left: 0, right: 0, top: `${s.p * 0.9}%`, height: "10%", background: "linear-gradient(rgba(255,255,255,0), rgba(255,255,255,.85), rgba(255,255,255,0))", transition: s.p === STEPS[0].p ? "none" : "top 1.8s ease" }} />
          </div>
          <div style={{ height: "0.2em", background: "#e4e4e4" }}>
            <span style={{ display: "block", height: "100%", width: `${s.p}%`, background: "#111", transition: s.p === STEPS[0].p ? "none" : "width 1.8s ease" }} />
          </div>
          <div className="bm-nw" style={{ fontSize: "1.15em", fontWeight: 700 }}>{s.h}</div>
          <div style={{ fontSize: "0.76em", lineHeight: 1.45, color: "#666" }}>This usually takes 20 to 40 seconds. You can close this and keep browsing, we&rsquo;ll keep going.</div>
        </div>

        {/* 3. Result */}
        <div className="bm-to-panel">
          <Head step={3} />
          <div key={run} className={`bm-to-frame ${t % STEPS.length === 3 && run > 0 ? "bm-in" : ""}`}>
            <Figure suit />
            <span style={{ position: "absolute", top: "0.6em", left: "0.6em", background: "rgba(17,17,17,.78)", color: "#fff", fontSize: "0.58em", fontWeight: 700, letterSpacing: "0.1em", padding: "0.25em 0.6em" }}>AI PREVIEW</span>
            <span style={{ position: "absolute", right: "0.7em", bottom: "0.6em", fontSize: "0.62em", fontWeight: 700, letterSpacing: "0.16em", color: "rgba(17,17,17,.55)", whiteSpace: "nowrap" }}>TWISTED TAILOR</span>
          </div>
          <div className="bm-grid" style={{ "--n": 2, gap: "0.5em" } as React.CSSProperties}>
            <span className="bm-to-btn bm-to-btn--line">Show my photo</span>
            <span className="bm-to-btn bm-to-btn--line">Save image</span>
          </div>
          <div className="bm-s-hide" style={{ fontSize: "0.72em", lineHeight: 1.45, color: "#666" }}>AI preview for styling only. Fit, colour and fabric may differ slightly from the real garment.</div>
          <span className="bm-to-btn">Choose your size</span>
          <span style={{ fontSize: "0.8em", textAlign: "center", textDecoration: "underline" }}>Try another photo</span>
        </div>
      </div>
    </Frame>
  );
}
