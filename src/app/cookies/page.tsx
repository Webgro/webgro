/**
 * Cookie Policy.
 *
 * ⚠️ DRAFT. Written to reflect the site's current state: no analytics,
 * no marketing pixels, no third-party tracking. That makes this a very
 * short cookie policy — which is good. When analytics or CRM tooling is
 * added, this page MUST be updated and a cookie consent banner MUST be
 * added before any non-essential cookies are set (UK PECR requirement).
 *
 * Have a UK solicitor review before going live.
 */
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import {
  LegalPageView,
  LegalH2,
  LegalP,
  LegalUl,
  LegalA,
} from "@/components/LegalPageView";

export const metadata: Metadata = {
  title: "Cookie Policy · Webgro",
  description:
    "Which cookies webgro.co.uk uses, why, and how to control them.",
};

export default function CookiesPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <LegalPageView
          eyebrow="[ Legal ] Cookies"
          title="Cookie Policy"
          intro="The site uses a small number of cookies. Essential ones keep the site working. The only non-essential cookies we set are Google Analytics — and only if you've actively opted in via the cookie banner."
          lastReviewed="April 2026"
        >
          <LegalH2>What a cookie is</LegalH2>
          <LegalP>
            A cookie is a small text file a website can store on your device.
            It helps the site remember things between pages (like that
            you&rsquo;re logged in, or that you closed a banner). Some cookies
            are essential for a site to work; others are used for analytics
            or advertising. Under UK PECR, we have to ask your consent before
            setting any non-essential cookie.
          </LegalP>

          <LegalH2>Essential cookies (always on)</LegalH2>
          <LegalP>
            These are strictly-necessary for the site to function. UK law
            doesn&rsquo;t require us to ask consent for them, and blocking
            them may break basic functionality.
          </LegalP>
          <LegalUl>
            <li>
              <strong>Session cookie</strong> — set by our hosting provider to
              handle routing. Expires when you close your browser.
            </li>
            <li>
              <strong>Consent preference</strong> — stored in localStorage
              (not a true cookie, but behaves similarly) to remember your
              choice from the cookie banner so it doesn&rsquo;t re-appear on
              every visit.
            </li>
            <li>
              <strong>CSRF / form protection</strong> — set briefly when you
              submit the contact form, to protect against cross-site request
              forgery. Expires on submit.
            </li>
            <li>
              <strong>Turnstile challenge cookies</strong> — set by Cloudflare
              Turnstile when you submit the contact form, to distinguish
              humans from bots. Cloudflare sets a short-lived challenge
              cookie during the check; these cookies don&rsquo;t identify you
              personally.
            </li>
          </LegalUl>

          <LegalH2>Analytics cookies (opt-in)</LegalH2>
          <LegalP>
            If you click <strong>Accept</strong> on the cookie banner, we load
            Google Analytics 4. If you click <strong>Reject</strong>, or
            haven&rsquo;t decided yet, no analytics script is loaded and no
            analytics cookies are set.
          </LegalP>
          <LegalUl>
            <li>
              <strong>_ga</strong> — Google Analytics, distinguishes users.
              2 years.
            </li>
            <li>
              <strong>_ga_&lt;container-id&gt;</strong> — Google Analytics 4
              session / measurement cookie. 2 years.
            </li>
            <li>
              <strong>_gid</strong> — Google Analytics, distinguishes users.
              24 hours.
            </li>
          </LegalUl>
          <LegalP>
            We use GA4 with IP anonymisation enabled. Data is processed by
            Google LLC in the United States under the UK&rsquo;s
            International Data Transfer Agreement. We use it to see which
            pages land, which don&rsquo;t, and where visitors come from.
            Nothing is used for advertising, remarketing, or combined with
            other Google products on your behalf.
          </LegalP>

          <LegalH2>What we don&rsquo;t use</LegalH2>
          <LegalP>
            We don&rsquo;t run advertising cookies (Meta pixel, Google Ads
            conversion, LinkedIn Insight), remarketing tags, or any
            behavioural-profiling scripts. If that ever changes, this page
            gets updated and the banner re-prompts everyone for consent.
          </LegalP>

          <LegalH2>Changing your mind</LegalH2>
          <LegalP>
            You can change your cookie decision at any time. Clear your
            browser&rsquo;s site data for webgro.co.uk, or open your
            browser&rsquo;s developer tools and remove the{" "}
            <code>webgro:consent:v1</code> entry from localStorage. The banner
            will re-appear on your next visit and you can make a fresh
            choice.
          </LegalP>

          <LegalH2>How to control cookies in your browser</LegalH2>
          <LegalP>
            You can clear, block, or be warned about any cookie from your
            browser&rsquo;s settings. The exact steps differ by browser:
          </LegalP>
          <LegalUl>
            <li>
              <LegalA
                href="https://support.google.com/chrome/answer/95647"
                external
              >
                Chrome
              </LegalA>
            </li>
            <li>
              <LegalA
                href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac"
                external
              >
                Safari
              </LegalA>
            </li>
            <li>
              <LegalA
                href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                external
              >
                Firefox
              </LegalA>
            </li>
            <li>
              <LegalA
                href="https://support.microsoft.com/en-gb/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                external
              >
                Edge
              </LegalA>
            </li>
          </LegalUl>
          <LegalP>
            Blocking strictly-necessary cookies may break the contact form and
            basic site behaviour. Everything else is safe to block without
            losing anything important.
          </LegalP>

          <LegalH2>Questions</LegalH2>
          <LegalP>
            Email{" "}
            <LegalA href="mailto:hello@webgro.co.uk">
              hello@webgro.co.uk
            </LegalA>{" "}
            with anything you&rsquo;d like clarified.
          </LegalP>
        </LegalPageView>
      </main>
      <Footer />
    </>
  );
}
