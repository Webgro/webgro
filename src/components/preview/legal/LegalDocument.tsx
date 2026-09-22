import type { ReactNode } from "react";
import { PreviewShell } from "@/components/preview/PreviewShell";
import { extractLegal } from "./extract";
import { LegalView, type LegalPath } from "./LegalView";

/**
 * Server half of a legal page: pulls the wording out of the live route and
 * renders the sections, then hands them to the client view for the index,
 * the progress line and the quiet motion.
 */
export function LegalDocument({ source, current }: { source: () => ReactNode; current: LegalPath }) {
  const doc = extractLegal(source);

  return (
    <PreviewShell initialTheme="paper">
      <LegalView
        title={doc.title}
        intro={doc.intro}
        lastReviewed={doc.lastReviewed}
        current={current}
        index={doc.sections.map(({ id, label }) => ({ id, label }))}
      >
        {doc.sections.map((s) => (
          <section className="pv-legal-section" id={s.id} key={s.id} aria-labelledby={`${s.id}-title`}>
            <span className="pv-legal-rule" aria-hidden="true" />
            <h2 className="pv-legal-h2" id={`${s.id}-title`}>
              <span className="pv-line"><span>{s.heading}</span></span>
            </h2>
            <div className="pv-legal-prose">{s.body}</div>
          </section>
        ))}
      </LegalView>
    </PreviewShell>
  );
}
