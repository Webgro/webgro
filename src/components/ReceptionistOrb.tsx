"use client";

import { useEffect, useRef, useState } from "react";
import type Vapi from "@vapi-ai/web";

/**
 * Web call to the same Vapi assistant that answers the studio phone line.
 * The SDK is imported on first click so it never touches the main bundle.
 * Renders nothing unless both public env keys are configured:
 *   NEXT_PUBLIC_VAPI_PUBLIC_KEY   (Vapi dashboard → Account → Public key)
 *   NEXT_PUBLIC_VAPI_ASSISTANT_ID (the receptionist assistant's id)
 */

type Phase = "idle" | "connecting" | "live" | "error";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
const ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

const statusCopy: Record<Phase, string> = {
  idle: "Talk to our AI receptionist",
  connecting: "Connecting…",
  live: "Live · tap to end the call",
  error: "Couldn't start. Is your mic allowed?",
};

export function ReceptionistOrb() {
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
  // Orb grows slightly with the assistant's voice level.
  const scale = phase === "live" ? 1 + Math.min(volume, 1) * 0.18 : 1;

  return (
    <div className="flex items-center gap-5">
      <button
        type="button"
        onClick={toggle}
        data-cursor="hover"
        aria-label={active ? "End the call" : "Start a call with our AI receptionist"}
        className="group relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
      >
        {/* Volume ripple rings, only while live */}
        {phase === "live" && (
          <>
            <span
              className="absolute inset-0 rounded-full border border-wg-blue/40 transition-transform duration-150"
              style={{ transform: `scale(${1.15 + volume * 0.5})` }}
            />
            <span
              className="absolute inset-0 rounded-full border border-wg-violet/30 transition-transform duration-300"
              style={{ transform: `scale(${1.3 + volume * 0.9})` }}
            />
          </>
        )}
        {/* The orb */}
        <span
          className={`relative block h-14 w-14 rounded-full bg-gradient-to-br from-wg-blue via-wg-violet to-wg-teal transition-transform duration-150 ${
            phase === "connecting" ? "animate-pulse" : ""
          } ${phase === "idle" ? "group-hover:scale-105" : ""}`}
          style={{ transform: `scale(${scale})` }}
        >
          {/* Inner glass highlight */}
          <span className="absolute inset-[3px] rounded-full bg-wg-ink/55 backdrop-blur-sm" />
          {/* Centre glyph: mic when idle, square (end) when active */}
          <span className="absolute inset-0 flex items-center justify-center text-white">
            {active ? (
              <span className="block h-3.5 w-3.5 rounded-[3px] bg-white" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 3a3 3 0 0 1 3 3v5a3 3 0 1 1-6 0V6a3 3 0 0 1 3-3z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M6 11a6 6 0 0 0 12 0M12 17v3.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </span>
        </span>
      </button>

      <div>
        <p className="text-base font-medium text-white">
          {statusCopy[phase]}
          {phase === "live" && speaking && (
            <span className="ml-2 inline-flex items-end gap-[2px]" aria-hidden="true">
              <span className="wg-eq-bar" style={{ animationDelay: "0ms" }} />
              <span className="wg-eq-bar" style={{ animationDelay: "120ms" }} />
              <span className="wg-eq-bar" style={{ animationDelay: "240ms" }} />
            </span>
          )}
        </p>
        <p className="mt-1 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.22em] text-white/50">
          {phase === "live"
            ? "You're speaking with the studio's AI"
            : "The same AI that answers our phone line"}
        </p>
      </div>
    </div>
  );
}
