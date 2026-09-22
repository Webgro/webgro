import type { ReactNode } from "react";

function Set({ lines }: { lines: ReactNode[] }) {
  return (
    <>
      {lines.map((l, i) => (
        <span className="pv-line" key={i}><span>{l}</span></span>
      ))}
    </>
  );
}

/**
 * Masked line reveals need fixed line breaks, and the breaks that suit a wide
 * screen leave orphans on a phone. So a heading can carry two sets of breaks
 * and CSS shows whichever fits (the hidden set is display: none, so it is
 * never read out twice).
 */
export function Lines({ wide, narrow }: { wide: ReactNode[]; narrow?: ReactNode[] }) {
  if (!narrow) return <Set lines={wide} />;
  return (
    <>
      <span className="pv-about-lines-wide"><Set lines={wide} /></span>
      <span className="pv-about-lines-narrow"><Set lines={narrow} /></span>
    </>
  );
}

/** Filters masked line spans down to the set of breaks that is currently displayed. */
export const visibleLines = (spans: Element[]) =>
  spans.filter((s) => (s as HTMLElement).offsetParent !== null);
