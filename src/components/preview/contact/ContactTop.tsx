"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrushStroke } from "../Brush";
import { pv } from "../links";
import { revealConfirmation } from "./confirmation";
import { EMAIL, EMAIL_HREF, PHONE_HREF, PHONE_SHORT } from "./content";
import { EnquiryFlow } from "./EnquiryFlow";
import { ReceptionistCall } from "./ReceptionistCall";

/**
 * Headline, the guided enquiry and its margin notes. Once the server action
 * confirms the send, the whole section is swapped for the confirmation: the
 * blue dome from the closing CTA on every other page rises to say it arrived.
 */
export function ContactTop() {
  const [sentName, setSentName] = useState<string | null>(null);
  const [settled, setSettled] = useState(false);
  const doneTitle = useRef<HTMLHeadingElement>(null);
  const doneSection = useRef<HTMLElement>(null);
  const sent = sentName !== null;

  const handleSent = useCallback((firstName: string) => setSentName(firstName), []);

  useEffect(() => {
    if (!sent) return;
    // The section has just shrunk from a long form to one screen, so bring the
    // page back to the top of it and put focus on the confirmation.
    const cancel = revealConfirmation(doneSection.current, doneTitle.current);
    // Once the dome has risen, the page colour can switch at its usual pace.
    const timer = window.setTimeout(() => setSettled(true), 1600);
    return () => {
      cancel();
      window.clearTimeout(timer);
    };
  }, [sent]);

  if (sent) {
    return (
      <section className={`pv-contact-top is-done${settled ? " is-settled" : ""}`} data-pv-theme="blue" ref={doneSection}>
        <div className="pv-contact-done">
          <div className="pv-contact-done-fill" aria-hidden="true" />
          <div className="pv-contact-done-inner">
            <h1 className="pv-contact-done-title" ref={doneTitle} tabIndex={-1}>
              <span className="pv-line"><span>Thanks{sentName ? `, ${sentName}` : ""}.</span></span>
              <span className="pv-line">
                <span>
                  We&rsquo;ll be{" "}
                  <span className="pv-brushed">
                    in touch.
                    <BrushStroke className="pv-contact-done-brush" />
                  </span>
                </span>
              </span>
            </h1>
            <div className="pv-contact-done-foot">
              <Link href={pv("/work")} className="pv-btn pv-btn--white" data-cursor>
                <span>View our work</span>
              </Link>
              <p>
                We&rsquo;ve received your message and will reply within one working day. If it&rsquo;s urgent,
                email <a href={EMAIL_HREF} data-cursor>{EMAIL}</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pv-contact-top" data-pv-theme="paper">
      <div className="pv-contact-head">
        <p className="pv-contact-kicker">Contact</p>
        <h1 className="pv-h1">
          <span className="pv-line"><span>Tell us about</span></span>
          <span className="pv-line">
            <span>
              <span className="pv-brushed">
                your project.
                <BrushStroke className="pv-contact-head-brush" />
              </span>
            </span>
          </span>
        </h1>
        <p className="pv-contact-intro">
          Answer a few short questions below and we&rsquo;ll reply within one working day. You can also email{" "}
          <a href={EMAIL_HREF} data-cursor>{EMAIL}</a>, call <a href={PHONE_HREF} data-cursor>{PHONE_SHORT}</a>{" "}or
          visit the studio in Bracknell.
        </p>
      </div>

      <div className="pv-contact-body">
        <EnquiryFlow onSent={handleSent} />

        <aside className="pv-contact-aside" aria-label="Notes on the form">
          <div className="pv-contact-note">
            <p className="pv-label">Not sure what you need?</p>
            <p>
              Email <a href={EMAIL_HREF} data-cursor>{EMAIL}</a>{" "}with a short description. We&rsquo;ll reply with a
              couple of questions, and nothing needs to be scoped yet.
            </p>
          </div>
          <ReceptionistCall />
        </aside>
      </div>
    </section>
  );
}
