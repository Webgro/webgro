"use client";

import Link from "next/link";
import { useCallback, useId, useRef, useState, type ReactNode } from "react";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import {
  CHARITY_EMAIL_PATTERN,
  CHARITY_FIELD_ERRORS,
  CHARITY_LIMITS,
  type CharityApplicationBody,
  type CharityApplicationResponse,
  type CharityField,
} from "@/lib/charity-application";
import { BrushStroke } from "../Brush";
import { pv } from "../links";
import { SCENE_QUERY, STATIC_QUERY, useGsap } from "../useGsap";
import type { ApplyCopy } from "./content";
import "../contact/contact.css";
import "../contact/enquiry.css";

/* ── How it works ───────────────────────────────────────────────────────── */

/**
 * The three steps of the free charity website offer, and what makes a strong
 * application. A line joining the step numbers fills as the steps scroll past.
 */
export function ApplyHow({ copy }: { copy: ApplyCopy }) {
  const root = useRef<HTMLElement>(null);
  const { how, strong } = copy;

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      gsap.from(q(".pv-ind-how-head > *"), {
        y: 30, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 75%" },
      });
      // Each segment of the line fills as its step moves up the screen.
      q(".pv-ind-how-seg").forEach((seg) => {
        gsap.fromTo(seg.firstElementChild, { scaleY: 0 }, {
          scaleY: 1, ease: "none",
          scrollTrigger: { trigger: seg.parentElement, start: "top 65%", end: "bottom 50%", scrub: 0.5 },
        });
      });
      q(".pv-ind-how-step").forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 82%" } });
        tl.from(row.querySelector(".pv-ind-how-num"), { scale: 0.4, autoAlpha: 0, duration: 0.7, ease: "back.out(2)" })
          .from(row.querySelectorAll(".pv-ind-how-text > *"), { y: 24, autoAlpha: 0, duration: 0.8, ease: "power3.out", stagger: 0.07 }, 0.1);
      });
      const box = q(".pv-ind-how-strong")[0];
      gsap.from(box, {
        clipPath: "inset(0% 0% 100% 0% round 18px)", duration: 1.1, ease: "power3.inOut",
        scrollTrigger: { trigger: box, start: "top 85%" },
      });
      gsap.from(q(".pv-ind-how-strong > *"), {
        y: 22, autoAlpha: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, delay: 0.3,
        scrollTrigger: { trigger: box, start: "top 85%" },
      });
    });
    // Reduced motion: everything is already in its finished state in the CSS.
    mm.add(STATIC_QUERY, () => undefined);
    return () => mm.revert();
  });

  return (
    <section className="pv-ind-how" id="how" ref={root} data-pv-theme="ink">
      <div className="pv-ind-how-head">
        <p className="pv-label">{how.label}</p>
        <h2 className="pv-h2">{how.heading}</h2>
        <p className="pv-lede">{how.intro}</p>
      </div>
      <div className="pv-ind-how-body">
        <ol className="pv-ind-how-steps">
          {how.steps.map((s, i) => (
            <li className="pv-ind-how-step" key={s.title}>
              {i < how.steps.length - 1 && (
                <span className="pv-ind-how-seg" aria-hidden="true"><span className="pv-ind-how-fill" /></span>
              )}
              <span className="pv-ind-how-num" aria-hidden="true">{i + 1}</span>
              <div className="pv-ind-how-text">
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="pv-ind-how-strong">
          <h3>{strong.heading}</h3>
          <ul>
            {strong.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p>{strong.note}</p>
          <a href="#apply" className="pv-btn" data-cursor><span>Apply for a free website</span></a>
        </div>
      </div>
    </section>
  );
}

/* ── Application form ───────────────────────────────────────────────────── */

type Values = Record<CharityField, string>;
type Errors = Partial<Record<CharityField | "agreed", string>>;

const EMPTY: Values = {
  charityName: "", charityNumber: "", charityWebsite: "", about: "", needs: "", difference: "",
  contactName: "", role: "", email: "", phone: "",
};

/** Page order, so focus goes to the first problem on the page. */
const ORDER: (CharityField | "agreed")[] = [
  "charityName", "charityWebsite", "charityNumber", "about", "needs", "difference",
  "contactName", "role", "email", "phone", "agreed",
];
const REQUIRED: CharityField[] = ["charityName", "about", "needs", "difference", "contactName", "role", "email"];
const GENERIC = "Something went wrong. Please try again, or email hello@webgro.co.uk.";

function validate(v: Values, agreed: boolean): Errors {
  const errors: Errors = {};
  for (const key of REQUIRED) if (!v[key].trim()) errors[key] = CHARITY_FIELD_ERRORS[key];
  if (v.email.trim() && !CHARITY_EMAIL_PATTERN.test(v.email.trim())) errors.email = CHARITY_FIELD_ERRORS.email;
  if (!agreed) errors.agreed = CHARITY_FIELD_ERRORS.agreed;
  return errors;
}

/** Moves to a field without a smooth scroll, which would fight Lenis, and leaves room for the fixed nav. */
function jumpTo(el: HTMLElement | null) {
  if (!el) return;
  const top = el.getBoundingClientRect().top;
  if (top < 110 || top > window.innerHeight * 0.7) {
    window.scrollTo({ top: Math.max(0, window.scrollY + top - 140), behavior: "instant" });
  }
  el.focus({ preventScroll: true });
}

export function ApplyForm({ copy }: { copy: ApplyCopy }) {
  const uid = useId();
  const root = useRef<HTMLElement>(null);
  const doneHeading = useRef<HTMLHeadingElement>(null);
  const [values, setValues] = useState<Values>(EMPTY);
  const [notRegistered, setNotRegistered] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<{ first: string; charity: string } | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const onToken = useCallback((token: string) => setTurnstileToken(token), []);
  const onExpire = useCallback(() => setTurnstileToken(null), []);

  const id = (key: string) => `${uid}-${key}`;
  const refresh = useRef<(() => void) | null>(null);
  // Finishes every reveal at once, so a field that hasn't scrolled in yet can still take focus.
  const reveal = useRef<(() => void) | null>(null);

  useGsap(root, ({ gsap, ScrollTrigger }) => {
    refresh.current = () => ScrollTrigger.refresh();
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      const reveals: { progress: (p: number) => unknown }[] = [];
      reveal.current = () => reveals.forEach((r) => r.progress(1));
      reveals.push(gsap.from(q(".pv-ind-apply-head > *"), {
        y: 30, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 75%" },
      }));
      q(".pv-ind-apply-set").forEach((set) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: set, start: "top 85%" } });
        reveals.push(tl);
        tl.from(set.querySelector(".pv-ind-apply-rule"), { scaleX: 0, duration: 1.1, ease: "power3.inOut" })
          .from(set.querySelector("legend"), { y: 20, autoAlpha: 0, duration: 0.7, ease: "power3.out" }, 0.1)
          .from(set.querySelectorAll(".pv-ind-apply-field"), {
            y: 24, autoAlpha: 0, duration: 0.8, ease: "power3.out", stagger: 0.07, clearProps: "transform,opacity,visibility",
          }, 0.2);
      });
      // The send button must never be left hidden by a trigger that doesn't
      // fire, so this reveal moves it but never hides it.
      reveals.push(gsap.from(q(".pv-ind-apply-foot > *"), {
        y: 20, duration: 0.8, ease: "power3.out", stagger: 0.07,
        scrollTrigger: { trigger: q(".pv-ind-apply-foot")[0], start: "top 95%", once: true },
      }));
      return () => { reveal.current = null; };
    });
    mm.add(STATIC_QUERY, () => undefined);
    return () => mm.revert();
  });

  function set(key: CharityField, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function showErrors(next: Errors, summary: string) {
    setErrors(next);
    const first = ORDER.find((k) => next[k]);
    const count = ORDER.filter((k) => next[k]).length;
    setLive(
      `${summary} ${count === 1 ? "There is 1 problem" : `There are ${count} problems`} with the application. ${first ? next[first] : ""}`.trim(),
    );
    reveal.current?.();
    if (first) jumpTo(document.getElementById(id(first)));
  }

  async function submit() {
    if (sending) return;
    setError(null);
    const found = validate(values, agreed);
    if (Object.keys(found).length) {
      showErrors(found, "The application wasn't sent.");
      return;
    }
    setErrors({});
    setLive("Sending the application.");
    setSending(true);

    const t = (s: string) => s.trim();
    const body: CharityApplicationBody = {
      charityName: t(values.charityName),
      ...(!notRegistered && t(values.charityNumber) ? { charityNumber: t(values.charityNumber) } : {}),
      notRegistered,
      ...(t(values.charityWebsite) ? { charityWebsite: t(values.charityWebsite) } : {}),
      about: t(values.about),
      needs: t(values.needs),
      difference: t(values.difference),
      contactName: t(values.contactName),
      role: t(values.role),
      email: t(values.email),
      ...(t(values.phone) ? { phone: t(values.phone) } : {}),
      agreed: true,
      hp: honeypot,
      ...(turnstileToken ? { turnstileToken } : {}),
    };

    try {
      const res = await fetch("/api/charity-application", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({ ok: false, error: GENERIC }))) as CharityApplicationResponse;
      if (data.ok) {
        setLive("");
        setSent({ first: body.contactName.split(/\s+/)[0] ?? "", charity: body.charityName });
        // Wait for the confirmation to render, then take focus to it.
        // The section is shorter now, so the triggers below it need new positions.
        requestAnimationFrame(() => {
          refresh.current?.();
          jumpTo(doneHeading.current);
        });
        return;
      }
      if (data.fields && Object.keys(data.fields).length) {
        showErrors(data.fields, "The application wasn't sent.");
      } else {
        setError(data.error ?? GENERIC);
        setLive(`The application wasn't sent. ${data.error ?? GENERIC}`);
      }
    } catch {
      const msg = "We couldn't reach the server. Check your connection and try again.";
      setError(msg);
      setLive(`The application wasn't sent. ${msg}`);
    } finally {
      setSending(false);
    }
  }

  const field = (
    key: CharityField,
    label: string,
    opts: { type?: string; autoComplete?: string; inputMode?: "url" | "email" | "tel" | "text"; placeholder?: string; hint?: ReactNode; disabled?: boolean } = {},
  ) => {
    const err = errors[key];
    const describedBy = [opts.hint ? id(`${key}-hint`) : "", err ? id(`${key}-err`) : ""].filter(Boolean).join(" ");
    return (
      <div className={`pv-enq-input pv-ind-apply-field${err ? " is-invalid" : ""}`}>
        <label htmlFor={id(key)}>{label}</label>
        {opts.hint && <p className="pv-ind-apply-hint" id={id(`${key}-hint`)}>{opts.hint}</p>}
        <span className="pv-enq-input-line">
          <input
            id={id(key)}
            type={opts.type ?? "text"}
            inputMode={opts.inputMode}
            value={values[key]}
            autoComplete={opts.autoComplete ?? "off"}
            placeholder={opts.placeholder}
            maxLength={CHARITY_LIMITS[key]}
            disabled={opts.disabled}
            aria-required={REQUIRED.includes(key) || undefined}
            aria-invalid={err ? true : undefined}
            aria-describedby={describedBy || undefined}
            onChange={(e) => set(key, e.target.value)}
          />
          <BrushStroke className="pv-enq-brush" />
        </span>
        {err && <span className="pv-enq-input-err" id={id(`${key}-err`)}>{err}</span>}
      </div>
    );
  };

  const area = (key: "about" | "needs" | "difference", label: string, hint?: string) => {
    const err = errors[key];
    const left = CHARITY_LIMITS[key] - values[key].length;
    const describedBy = [hint ? id(`${key}-hint`) : "", err ? id(`${key}-err`) : ""].filter(Boolean).join(" ");
    return (
      <div className={`pv-ind-apply-field pv-ind-apply-area${err ? " is-invalid" : ""}`}>
        <label className="pv-ind-apply-label" htmlFor={id(key)}>{label}</label>
        {hint && <p className="pv-ind-apply-hint" id={id(`${key}-hint`)}>{hint}</p>}
        <div className="pv-enq-box">
          <textarea
            id={id(key)}
            className="pv-enq-field"
            rows={3}
            maxLength={CHARITY_LIMITS[key]}
            value={values[key]}
            aria-required
            aria-invalid={err ? true : undefined}
            aria-describedby={describedBy || undefined}
            onChange={(e) => set(key, e.target.value)}
          />
          <BrushStroke className="pv-enq-brush" />
          {left < CHARITY_LIMITS[key] * 0.2 && (
            <p className="pv-enq-count">{left.toLocaleString("en-GB")} characters left</p>
          )}
        </div>
        {err && <span className="pv-enq-input-err" id={id(`${key}-err`)}>{err}</span>}
      </div>
    );
  };

  const check = (
    key: string,
    checked: boolean,
    onChange: (v: boolean) => void,
    label: ReactNode,
    err?: string,
  ) => (
    <div className={`pv-contact-agree pv-ind-apply-check${err ? " is-invalid" : ""}`}>
      <span className="pv-contact-agree-box">
        <input
          id={id(key)}
          type="checkbox"
          checked={checked}
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? id(`${key}-err`) : undefined}
          onChange={(e) => onChange(e.target.checked)}
        />
        <svg viewBox="0 0 16 16" aria-hidden="true"><path pathLength={1} d="M2.5 8.6l3.6 3.6 7.4-8.2" /></svg>
      </span>
      <label htmlFor={id(key)} data-cursor="hover">{label}</label>
      {err && <span id={id(`${key}-err`)} className="pv-contact-agree-err">{err}</span>}
    </div>
  );

  return (
    <section className="pv-ind-apply" id="apply" ref={root} data-pv-theme="paper">
      <div className="pv-ind-apply-head">
        <p className="pv-label">Application</p>
        <h2 className="pv-h2">{copy.form.heading}</h2>
        <p className="pv-lede">{copy.form.intro}</p>
      </div>

      <p className="pv-contact-sr" aria-live="assertive">{live}</p>

      {sent ? (
        <div className="pv-ind-apply-done">
          <h3 ref={doneHeading} tabIndex={-1}>Application sent</h3>
          <p>
            Thank you{sent.first ? `, ${sent.first}` : ""}. We&rsquo;ve received the application for {sent.charity}.
          </p>
          <p>
            Applications are reviewed by the Webgro team, and it may take us a little while to reply. If we can help,
            we&rsquo;ll get in touch to talk about what the charity needs.
          </p>
          <Link href={pv("/work/jbvc-foundation")} className="pv-textlink" data-cursor>Read the JBVC Foundation case study</Link>
        </div>
      ) : (
        <form
          className="pv-ind-apply-form"
          aria-label="Charity website application"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <fieldset className="pv-ind-apply-set">
            <span className="pv-ind-apply-rule" aria-hidden="true" />
            <legend>The charity</legend>
            <div className="pv-ind-apply-grid">
              {field("charityName", "Charity name", { autoComplete: "organization" })}
              {field("charityWebsite", "Current website (optional)", { inputMode: "url", autoComplete: "url", placeholder: "yourcharity.org.uk" })}
            </div>
            <div className="pv-ind-apply-number">
              {field("charityNumber", "Registered charity number (optional)", {
                inputMode: "text",
                placeholder: notRegistered ? "Not registered yet" : "For example 1234567",
                disabled: notRegistered,
                hint: "The number the Charity Commission gave the charity. In Scotland or Northern Ireland, use your OSCR or CCNI number.",
              })}
              {check("notRegistered", notRegistered, (v) => {
                setNotRegistered(v);
                if (v) set("charityNumber", "");
              }, "The charity isn't registered yet")}
            </div>
            {area("about", "What does the charity do?", "Who you help, where, and how.")}
          </fieldset>

          <fieldset className="pv-ind-apply-set">
            <span className="pv-ind-apply-rule" aria-hidden="true" />
            <legend>The website</legend>
            {area("needs", "What does the charity need from a website?", "For example, what the site should explain, who it's for, and anything it has to do, like taking donations.")}
            {area("difference", "Why now, and what difference would a website make?")}
          </fieldset>

          <fieldset className="pv-ind-apply-set">
            <span className="pv-ind-apply-rule" aria-hidden="true" />
            <legend>Your details</legend>
            <div className="pv-ind-apply-grid">
              {field("contactName", "Your name", { autoComplete: "name" })}
              {field("role", "Your role at the charity", { autoComplete: "organization-title", placeholder: "For example trustee or manager" })}
              {field("email", "Email", { type: "email", inputMode: "email", autoComplete: "email" })}
              {field("phone", "Phone (optional)", { type: "tel", inputMode: "tel", autoComplete: "tel" })}
            </div>
          </fieldset>

          {/* Honeypot: offscreen and empty for people, filled in by bots. */}
          <div className="pv-contact-pot" aria-hidden="true">
            <label>
              Leave this blank
              <input type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </label>
          </div>

          <div className="pv-ind-apply-foot">
            <TurnstileWidget onToken={onToken} onExpire={onExpire} />
            {check("agreed", agreed, (v) => {
              setAgreed(v);
              if (errors.agreed) setErrors((e) => ({ ...e, agreed: undefined }));
            }, (
              <>
                I agree to Webgro&rsquo;s{" "}
                <Link href={pv("/privacy")} target="_blank" rel="noopener noreferrer" data-cursor>Privacy Policy</Link>.
              </>
            ), errors.agreed)}

            <div className="pv-contact-error" role="alert">
              {error && (
                <>
                  <strong>Your application wasn&rsquo;t sent.</strong>
                  <span>{error}</span>
                </>
              )}
            </div>

            <button type="submit" className="pv-btn pv-enq-next" disabled={sending} aria-busy={sending} data-cursor>
              <span>{sending ? "Sending…" : "Send application"}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
            <p className="pv-enq-note">
              Applications are reviewed by the Webgro team. It may take us a little while to reply.
            </p>
          </div>
        </form>
      )}
    </section>
  );
}
