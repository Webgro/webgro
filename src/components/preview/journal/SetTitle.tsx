import type { CSSProperties } from "react";
import { setLines } from "./lines";

function Lines({ lines, className }: { lines: string[]; className: string }) {
  return (
    <span className={`pv-jrnl-set ${className}`}>
      {lines.map((line, i) => (
        <span className="pv-line" key={i} style={{ "--i": i } as CSSProperties}>
          <span>{line}</span>
        </span>
      ))}
    </span>
  );
}

/**
 * A headline set in masked lines. The line breaks are worked out from the
 * character count for two measures (desktop and phone) and the unused setting
 * is removed with display: none, so only one is ever read out or shown. The
 * type sizes that go with each measure scale with the viewport, which keeps
 * the character count per line steady.
 */
export function SetTitle({ text, wide, narrow }: { text: string; wide: number; narrow: number }) {
  return (
    <>
      <Lines lines={setLines(text, wide)} className="pv-jrnl-set--wide" />
      <Lines lines={setLines(text, narrow)} className="pv-jrnl-set--narrow" />
    </>
  );
}
