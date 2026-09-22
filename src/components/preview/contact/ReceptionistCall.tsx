"use client";

import { useEffect, useRef, useState } from "react";
import type Vapi from "@vapi-ai/web";

/**
 * The live page's ReceptionistOrb, redrawn for the concept palette. The logic
 * is the same: a web call to the Vapi assistant that answers the studio phone
 * line, with the SDK imported on first click. It renders nothing unless both
 * NEXT_PUBLIC_VAPI_PUBLIC_KEY and NEXT_PUBLIC_VAPI_ASSISTANT_ID are set.
 */

type Phase = "idle" | "connecting" | "live" | "error";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
const ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

const statusCopy: Record<Phase, string> = {
  idle: "Talk to our AI receptionist",
  connecting: "Connecting…",
  live: "Call connected. Tap to end.",
  error: "The call couldn't start. Check your browser has microphone access.",
};

export function ReceptionistCall() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [volume, setVolume] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const vapiRef = useRef<Vapi | null>(null);

  useEffect(() => {
    return () => {
      vapiRef.current?.stop();
    };
  }, []);

  if (!PUBLIC_KEY || !ASSISTANT_ID) return null;

  const toggle = async () => {
    if (phase === "live" || phase === "connecting") {
      vapiRef.current?.stop();
      setPhase("idle");
      setVolume(0);
      return;
    }
    setPhase("connecting");
    try {
      if (!vapiRef.current) {
        const { default: VapiClient } = await import("@vapi-ai/web");
        const vapi = new VapiClient(PUBLIC_KEY);
        vapi.on("call-start", () => setPhase("live"));
        vapi.on("call-end", () => {
          setPhase("idle");
          setVolume(0);
          setSpeaking(false);
        });
        vapi.on("volume-level", (v: number) => setVolume(v));
        vapi.on("speech-start", () => setSpeaking(true));
        vapi.on("speech-end", () => setSpeaking(false));
        vapi.on("error", () => setPhase("error"));
        vapiRef.current = vapi;
      }
      await vapiRef.current.start(ASSISTANT_ID);
    } catch {
      setPhase("error");
    }
  };

  const active = phase === "live" || phase === "connecting";
  const level = Math.min(volume, 1);

  return (
    <div className={`pv-contact-call is-${phase}`}>
      <button
        type="button"
        className="pv-contact-call-btn"
        onClick={toggle}
        aria-label={active ? "End the call" : "Start a call with our AI receptionist"}
        data-cursor
      >
        {phase === "live" && (
          <>
            <span className="pv-contact-call-ring" style={{ transform: `scale(${1.15 + level * 0.5})` }} />
            <span className="pv-contact-call-ring" style={{ transform: `scale(${1.3 + level * 0.9})` }} />
          </>
        )}
        <span className="pv-contact-call-disc" style={{ transform: `scale(${phase === "live" ? 1 + level * 0.18 : 1})` }}>
          {active ? (
            <span className="pv-contact-call-stop" />
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3a3 3 0 0 1 3 3v5a3 3 0 1 1-6 0V6a3 3 0 0 1 3-3z" />
              <path d="M6 11a6 6 0 0 0 12 0M12 17v3.5" />
            </svg>
          )}
        </span>
      </button>
      <div>
        <p className="pv-contact-call-status" aria-live="polite">
          {statusCopy[phase]}
          {phase === "live" && speaking && (
            <span className="pv-contact-call-eq" aria-hidden="true"><i /><i /><i /></span>
          )}
        </p>
        <p className="pv-contact-call-meta">
          {phase === "live" ? "You're speaking to our AI receptionist." : "This is the same AI assistant that answers our phone line."}
        </p>
      </div>
    </div>
  );
}
