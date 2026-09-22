import { PreviewShell } from "../PreviewShell";
import { ContactTop } from "./ContactTop";
import { DirectLines } from "./DirectLines";
import { NextSteps } from "./NextSteps";
import "./contact.css";

/** Contact page concept. It is where the closing CTA on every other page leads, so it has its own ending. */
export function ContactPreview() {
  return (
    <PreviewShell initialTheme="paper">
      <ContactTop />
      <NextSteps />
      <DirectLines />
    </PreviewShell>
  );
}
