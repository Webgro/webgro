"use client";

import Link from "next/link";
import { useCallback, useId, useRef, useState } from "react";
import { requestPhp2ShellFix } from "@/app/actions/php2shell";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import type { ScanResult } from "@/lib/php2shell/scan";
import { checkVersion, fixFor, parseVersion } from "@/lib/php2shell/versions";
import { Closing } from "../Closing";
import { pv } from "../links";
import { PreviewShell } from "../PreviewShell";
import { Faqs } from "../services/Faqs";
import { BrushedTitle } from "../services/sections";
import "../services/services.css";
import { SCENE_QUERY, useGsap } from "../useGsap";
import { findVersion, fixedReleases, php2shellFaqs, timeline } from "./content";
import "./php2shell.css";

/** What the fix form starts with, from whichever check the visitor ran last. */
type FixContext = { site: string; verdict?: string; phpVersion?: string; platform?: string };

/**
 * The PHP2Shell checker. The page answers, in order: is my site affected (the
 * check, right in the hero), what is PHP2Shell, which versions are fixed, what
 * happened when, how do I find my version if the check can't see it, and how
 * do I get it fixed. Every result that needs action points at the fix form,
 * which carries the check result with it so the enquiry arrives with the facts.
 */
export function Php2ShellView() {
  const [fix, setFix] = useState<FixContext>({ site: "" });

  const askToFix = useCallback((ctx: FixContext) => {
    setFix(ctx);
    // An instant jump, like the site's other #anchor links: Lenis cancels a native smooth scroll part way.
    document.getElementById("fix")?.scrollIntoView({ block: "start" });
  }, []);

  return (
    <PreviewShell initialTheme="paper">
      <Hero onAskToFix={askToFix} />
      <About />
      <Timeline />
      <FindVersion onAskToFix={askToFix} />
      <FixForm context={fix} />
      <Faqs faqs={php2shellFaqs} topic="PHP2Shell" />
      <Closing />
    </PreviewShell>
  );
}

/* ── Hero and URL check ─────────────────────────────────────────────────── */

function Hero({ onAskToFix }: { onAskToFix: (ctx: FixContext) => void }) {
  const root = useRef<HTMLElement>(null);
  const inputId = useId();
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      gsap.fromTo(q(".pv-p2s-hero-brush"), { clipPath: "inset(0% 100% 0% 0%)" }, {
        clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, delay: 0.9, ease: "power3.out",
      });
    });
    return () => mm.revert();
  });

  async function check(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !url.trim()) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/php2shell/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = (await res.json()) as { ok: boolean; result?: ScanResult; error?: string };
      if (!data.ok || !data.result) setError(data.error ?? "Something went wrong. Please try again.");
      else setResult(data.result);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="pv-svc-hero pv-p2s-hero" ref={root} data-pv-theme="paper">
      <p className="pv-svc-crumbs">
        <Link href={pv("/")} data-cursor>Home</Link>
        <span aria-hidden="true">/</span>
        <span>PHP2Shell checker</span>
      </p>
      <h1 className="pv-h1 pv-svc-h1">
        <BrushedTitle lines={["Is your website", "safe from PHP2Shell?"]} brush="PHP2Shell" brushClass="pv-p2s-hero-brush" />
      </h1>
      <div className="pv-p2s-hero-body">
        <p className="pv-svc-hero-intro">
          PHP2Shell is a pair of critical flaws in PHP that let attackers take over a web server without logging in.
          The fix came out on 21 October 2026 and attacks have already started. Type in your website address and
          we&rsquo;ll check whether your site runs on PHP and, if your server shows it, whether its version has the fix.
        </p>

        <form className="pv-p2s-check" onSubmit={check} aria-busy={busy}>
          <label htmlFor={inputId} className="pv-p2s-sr">Your website address</label>
          <input
            id={inputId}
            type="text"
            inputMode="url"
            autoComplete="url"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="yourwebsite.co.uk"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button type="submit" className="pv-btn" disabled={busy} data-cursor>
            <span>{busy ? "Checking…" : "Check my site"}</span>
          </button>
        </form>
        <p className="pv-p2s-small">
          Free, and safe to run. We load your home page once, like a browser would, and never send attack code.
        </p>

        <div aria-live="polite">
          {busy && <p className="pv-p2s-status">Checking {url.trim()}. This takes a few seconds.</p>}
          {error && <p className="pv-p2s-status is-error">{error}</p>}
          {result && <ResultCard result={result} onAskToFix={onAskToFix} />}
        </div>
      </div>
    </section>
  );
}

type Tone = "bad" | "good" | "unsure";

function describe(r: ScanResult): { tone: Tone; title: string; body: string } {
  const v = r.phpVersion;
  const distro = r.distroBuild
    ? " Your server's version number looks like a Linux distribution's own build, and those are sometimes patched without the number changing, so ask your host to confirm."
    : "";
  switch (r.verdict) {
    case "vulnerable":
      return {
        tone: "bad",
        title: "Your site looks vulnerable",
        body: `Your server reports PHP ${v}. The fix for this version is in PHP ${r.fixVersion}, so the server needs updating.${distro}`,
      };
    case "end-of-life":
      return {
        tone: "bad",
        title: "Your site is vulnerable",
        body: `Your server reports PHP ${v}. The PHP project no longer releases updates for this version, so there's no official fix. The safe option is to move the site to PHP 8.4 or 8.5, which can mean updating the theme and plugins as well.${distro}`,
      };
    case "patched":
      return {
        tone: "good",
        title: "Your PHP version has the fix",
        body: `Your server reports PHP ${v}, which includes the PHP2Shell fix. There's nothing more to do for this one.`,
      };
    case "platform":
      return {
        tone: "good",
        title: "Your site isn't affected",
        body: `Your site runs on ${r.platform}, which looks after its own servers. You don't need to do anything.`,
      };
    case "php-unknown":
      return {
        tone: "unsure",
        title: "Your site runs on PHP, but the version is hidden",
        body: "Most hosting companies hide the PHP version, so this is normal. It means we can't see whether your server has the fix. Find your version with the steps further down this page, or ask us and we'll find out for you.",
      };
    case "no-php":
      return {
        tone: "unsure",
        title: "We didn't find any sign of PHP",
        body: "Nothing on your home page points to PHP, so your site probably isn't affected. Some sites hide it well, so if you know your site is built on WordPress or another PHP system, check your version with the steps further down.",
      };
    case "blocked":
      return {
        tone: "unsure",
        title: "Your firewall stopped our check",
        body: "Your site has a firewall that turned our check away, so we couldn't see your server. Find your PHP version with the steps further down this page, or ask us to check it for you.",
      };
    default:
      return { tone: "unsure", title: "We couldn't check that site", body: r.reason ?? "Please check the address and try again." };
  }
}

function ResultCard({ result, onAskToFix }: { result: ScanResult; onAskToFix: (ctx: FixContext) => void }) {
  const { tone, title, body } = describe(result);
  const needsHelp = result.verdict !== "patched" && result.verdict !== "platform" && result.verdict !== "unreachable";
  const ctx: FixContext = {
    site: result.host,
    verdict: result.verdict,
    phpVersion: result.phpRaw,
    platform: result.platform,
  };

  return (
    <div className={`pv-p2s-result is-${tone}`}>
      <p className="pv-p2s-result-site">{result.host}</p>
      <h2 className="pv-p2s-result-title">{title}</h2>
      <p className="pv-p2s-result-body">{body}</p>
      {result.cloudflare && (result.verdict === "vulnerable" || result.verdict === "end-of-life" || result.verdict === "php-unknown") && (
        <p className="pv-p2s-result-body">
          Your site is behind Cloudflare, which has added firewall rules for the known attacks. That helps, but
          Cloudflare calls it a stopgap, so PHP still needs updating.
        </p>
      )}
      {result.signals.length > 0 && (
        <details className="pv-p2s-result-found">
          <summary data-cursor>What we found</summary>
          <ul>{result.signals.map((s) => <li key={s}>{s}</li>)}</ul>
        </details>
      )}
      <div className="pv-p2s-result-actions">
        {needsHelp && (
          <button type="button" className="pv-btn" onClick={() => onAskToFix(ctx)} data-cursor>
            <span>{tone === "bad" ? "Ask us to fix it" : "Ask us to check it"}</span>
          </button>
        )}
        {(result.verdict === "php-unknown" || result.verdict === "no-php" || result.verdict === "blocked") && (
          <a href="#version" className="pv-textlink" data-cursor>Find your PHP version</a>
        )}
        {result.verdict === "patched" && (
          <Link href={pv("/care-plans")} className="pv-textlink" data-cursor>See our website care plans</Link>
        )}
      </div>
    </div>
  );
}

/* ── What PHP2Shell is ──────────────────────────────────────────────────── */

function About() {
  return (
    <section className="pv-p2s-about" data-pv-theme="paper">
      <div className="pv-p2s-about-head">
        <p className="pv-label">About the vulnerability</p>
        <h2 className="pv-h2">What PHP2Shell is</h2>
      </div>
      <div className="pv-p2s-prose">
        <p>
          PHP2Shell is the name given to two vulnerabilities in PHP, CVE-2026-109618 and CVE-2026-109619. Either one
          lets an attacker run their own code on a web server without logging in. From there they can change your
          site, add malware or take customer data. The PHP project rates both 9.2 out of 10.
        </p>
        <p>
          PHP runs every WordPress, WooCommerce, Joomla, Drupal and Magento site, along with a lot of custom ones.
          The flaws are in PHP itself, so updating WordPress, your theme or your plugins won&rsquo;t fix them. The
          PHP on your server has to be updated. On most hosting that&rsquo;s done by your hosting company, or in your
          hosting control panel.
        </p>
        <p>
          The PHP project says every PHP installation that serves web pages is at risk, including PHP-FPM, Apache with
          mod_php, php-cgi, FrankenPHP and LiteSpeed. The researchers who found the flaws traced the affected code
          back to PHP 5.4. Sites on Shopify, Wix, Squarespace and similar platforms aren&rsquo;t affected, because the
          platform runs the servers.
        </p>
        <p>
          For a longer guide, read{" "}
          <Link href={pv("/the-gro/how-to-check-website-php-vulnerabilities")} className="pv-textlink" data-cursor>
            how to check your website for PHP vulnerabilities
          </Link>
          .
        </p>

        <h3 className="pv-h3 pv-p2s-sub">Fixed versions</h3>
        <div className="pv-p2s-table-wrap">
          <table className="pv-p2s-table">
            <thead>
              <tr><th scope="col">Your PHP</th><th scope="col">Fixed in</th><th scope="col">What to do</th></tr>
            </thead>
            <tbody>
              {fixedReleases.map((r) => (
                <tr key={r.branch}>
                  <th scope="row">{r.branch}</th>
                  <td>{r.fixed}</td>
                  <td>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="pv-h3 pv-p2s-sub">If you can&rsquo;t update straight away</h3>
        <p>
          The PHP project lists settings that reduce the risk until you can update. They don&rsquo;t make a server
          safe, so treat them as a stopgap. They need to go in php.ini or the PHP-FPM pool, not in .user.ini or
          ini_set(), and every PHP worker needs restarting afterwards.
        </p>
        <pre className="pv-p2s-code"><code>{`memory_limit = -1
session.upload_progress.enabled = 0
; PHP 8.5 only
fatal_error_backtraces = 0`}</code></pre>
        <p>
          If your site has been on an unpatched version since 17 October, it&rsquo;s also worth checking for signs of a
          break-in: admin users you don&rsquo;t recognise, new files in your site&rsquo;s folders, or pages that redirect
          somewhere they shouldn&rsquo;t.
        </p>
      </div>
    </section>
  );
}

/* ── Timeline ───────────────────────────────────────────────────────────── */

function Timeline() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    mm.add(SCENE_QUERY, () => {
      q(".pv-p2s-event").forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 86%" } });
        tl.from(row.querySelector(".pv-p2s-event-rule"), { scaleX: 0, duration: 1.1, ease: "power3.inOut" })
          .from(row.querySelector("h3 > span > span"), { yPercent: 110, duration: 0.9, ease: "power3.out" }, 0.12)
          .from(row.querySelector("p"), { y: 20, autoAlpha: 0, duration: 0.8, ease: "power3.out" }, 0.28);
      });
    });
    return () => mm.revert();
  });

  return (
    <section className="pv-p2s-timeline" ref={root} data-pv-theme="ink">
      <div className="pv-p2s-timeline-head">
        <p className="pv-label">Timeline</p>
        <h2 className="pv-h2">What happened, October 2026</h2>
      </div>
      <ol className="pv-p2s-events">
        {timeline.map((t) => (
          <li className="pv-p2s-event" key={t.date}>
            <span className="pv-p2s-event-rule" aria-hidden="true" />
            <h3><span className="pv-line"><span>{t.date}</span></span></h3>
            <p>{t.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ── Find your version, and check it ────────────────────────────────────── */

function FindVersion({ onAskToFix }: { onAskToFix: (ctx: FixContext) => void }) {
  const inputId = useId();
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState<string | null>(null);

  const parsed = checked ? parseVersion(checked) : null;
  const verdict = parsed ? checkVersion(parsed) : checked ? "invalid" : null;

  return (
    <section className="pv-p2s-find" id="version" data-pv-theme="paper">
      <div className="pv-p2s-find-head">
        <p className="pv-label">Check by version</p>
        <h2 className="pv-h2">Find your PHP version</h2>
        <p className="pv-lede">
          If the checker couldn&rsquo;t see your version, you can find it yourself in a couple of minutes. Then type it
          in below.
        </p>
      </div>

      <ol className="pv-p2s-steps">
        {findVersion.map((s) => (
          <li key={s.name}>
            <h3>{s.name}</h3>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>

      <form
        className="pv-p2s-check pv-p2s-check--version"
        onSubmit={(e) => { e.preventDefault(); setChecked(value); }}
      >
        <label htmlFor={inputId} className="pv-p2s-sr">Your PHP version</label>
        <input
          id={inputId}
          type="text"
          inputMode="decimal"
          placeholder="For example 8.3.14"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
        <button type="submit" className="pv-btn" data-cursor><span>Check version</span></button>
      </form>

      <div aria-live="polite">
        {verdict && (
          <div className={`pv-p2s-result ${verdict === "patched" ? "is-good" : verdict === "invalid" ? "is-unsure" : "is-bad"}`}>
            {verdict === "invalid" && (
              <>
                <h3 className="pv-p2s-result-title">We couldn&rsquo;t read that version</h3>
                <p className="pv-p2s-result-body">Type it the way your dashboard shows it, for example 8.3.14.</p>
              </>
            )}
            {verdict === "patched" && parsed && (
              <>
                <h3 className="pv-p2s-result-title">PHP {parsed.text} has the fix</h3>
                <p className="pv-p2s-result-body">That version includes the PHP2Shell fix. There&rsquo;s nothing more to do for this one.</p>
              </>
            )}
            {verdict === "vulnerable" && parsed && (
              <>
                <h3 className="pv-p2s-result-title">PHP {parsed.text} needs updating</h3>
                <p className="pv-p2s-result-body">
                  {parsed.patch < 0
                    ? `We need the full version number to be sure. The fix for PHP ${parsed.text} is in ${fixFor(parsed)}, so anything older needs updating.`
                    : `The fix for this version is in PHP ${fixFor(parsed)}. Some hosts patch PHP without changing the number, so if yours says it's patched, ask them to confirm it in writing.`}
                </p>
              </>
            )}
            {verdict === "end-of-life" && parsed && (
              <>
                <h3 className="pv-p2s-result-title">PHP {parsed.text} is vulnerable</h3>
                <p className="pv-p2s-result-body">
                  The PHP project no longer releases updates for this version, so there&rsquo;s no official fix. The safe
                  option is to move the site to PHP 8.4 or 8.5, which can mean updating the theme and plugins as well.
                </p>
              </>
            )}
            {(verdict === "vulnerable" || verdict === "end-of-life") && parsed && (
              <div className="pv-p2s-result-actions">
                <button
                  type="button"
                  className="pv-btn"
                  onClick={() => onAskToFix({ site: "", verdict: "manual", phpVersion: parsed.text })}
                  data-cursor
                >
                  <span>Ask us to fix it</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Ask us to fix it ───────────────────────────────────────────────────── */

function FixForm({ context }: { context: FixContext }) {
  const ids = useId();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", site: "", message: "", company: "" });
  // A new check fills in the site, without wiping anything the visitor has typed since.
  const [seen, setSeen] = useState<FixContext | null>(null);
  if (context !== seen) {
    setSeen(context);
    if (context.site) setForm((f) => ({ ...f, site: context.site }));
  }

  const onToken = useCallback((t: string) => setToken(t), []);
  const onExpire = useCallback(() => setToken(null), []);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    const res = await requestPhp2ShellFix({
      ...form,
      verdict: context.verdict,
      phpVersion: context.phpVersion,
      platform: context.platform,
      turnstileToken: token ?? undefined,
    });
    setSubmitting(false);
    if (res.ok) setDone(true);
    else setError(res.error);
  }

  return (
    <section className="pv-p2s-fix" id="fix" data-pv-theme="ink">
      <div className="pv-p2s-fix-head">
        <p className="pv-label">Get it fixed</p>
        <h2 className="pv-h2">Ask us to fix it</h2>
        <p className="pv-lede">
          Send us your website address and we&rsquo;ll find out which PHP version it&rsquo;s on, then sort the update,
          either in your hosting control panel or with your hosting company. If your site needs a newer version of PHP,
          we&rsquo;ll test your theme and plugins on it first. We&rsquo;ll reply within one working day.
        </p>
      </div>

      {done ? (
        <div className="pv-p2s-fix-done" role="status">
          <h3 className="pv-h3">Thanks, we&rsquo;ve got it.</h3>
          <p>
            We&rsquo;ve sent a confirmation to {form.email}. We&rsquo;ll be in touch within one working day. If it&rsquo;s
            urgent, call us on <a href="tel:+441344231119" className="pv-textlink">01344 231 119</a>.
          </p>
        </div>
      ) : (
        <form className="pv-p2s-fix-form" onSubmit={submit} noValidate={false}>
          <div className="pv-p2s-field">
            <label htmlFor={`${ids}-name`}>Your name</label>
            <input id={`${ids}-name`} autoComplete="name" value={form.name} onChange={set("name")} required />
          </div>
          <div className="pv-p2s-field">
            <label htmlFor={`${ids}-email`}>Email address</label>
            <input id={`${ids}-email`} type="email" autoComplete="email" value={form.email} onChange={set("email")} required />
          </div>
          <div className="pv-p2s-field">
            <label htmlFor={`${ids}-site`}>Website</label>
            <input
              id={`${ids}-site`}
              inputMode="url"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="yourwebsite.co.uk"
              value={form.site}
              onChange={set("site")}
              required
            />
          </div>
          <div className="pv-p2s-field">
            <label htmlFor={`${ids}-phone`}>Phone (optional)</label>
            <input id={`${ids}-phone`} type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} />
          </div>
          <div className="pv-p2s-field pv-p2s-field--wide">
            <label htmlFor={`${ids}-message`}>Anything else we should know? (optional)</label>
            <textarea
              id={`${ids}-message`}
              rows={3}
              placeholder="For example who hosts your site, or if you've noticed anything odd"
              value={form.message}
              onChange={set("message")}
            />
          </div>
          {/* Honeypot: hidden from people, filled in by bots. */}
          <div className="pv-p2s-hp" aria-hidden="true">
            <label htmlFor={`${ids}-company`}>Company</label>
            <input id={`${ids}-company`} tabIndex={-1} autoComplete="off" value={form.company} onChange={set("company")} />
          </div>
          <TurnstileWidget onToken={onToken} onExpire={onExpire} />
          {context.verdict && (
            <p className="pv-p2s-small pv-p2s-field--wide">
              We&rsquo;ll include your check result{context.phpVersion ? ` (PHP ${context.phpVersion})` : ""} with your request.
            </p>
          )}
          {error && <p className="pv-p2s-status is-error pv-p2s-field--wide" role="alert">{error}</p>}
          <div className="pv-p2s-field--wide pv-p2s-fix-send">
            <button type="submit" className="pv-btn pv-btn--light" disabled={submitting} aria-busy={submitting} data-cursor>
              <span>{submitting ? "Sending…" : "Send request"}</span>
            </button>
            <p className="pv-p2s-small">
              We&rsquo;ll only use your details to reply to this request. See our{" "}
              <Link href={pv("/privacy")} className="pv-textlink" data-cursor>privacy policy</Link>.
            </p>
          </div>
        </form>
      )}
    </section>
  );
}
