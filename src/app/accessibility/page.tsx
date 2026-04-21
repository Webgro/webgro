/**
 * Accessibility Statement.
 *
 * Written to match UK public-sector accessibility regulations in spirit
 * (though Webgro isn't a public body, so strict compliance isn't legally
 * required). Target standard is WCAG 2.2 AA.
 *
 * ⚠️ This is a statement of intent based on what we know we've built.
 * A formal accessibility audit by a qualified auditor would surface
 * things this draft doesn't. Recommend commissioning one before launch.
 *
 * Known design choices that need disclosing as accessibility trade-offs:
 *   - Custom cursor (dot + ring) hides the default OS cursor on
 *     pointer-fine devices. Keyboard users are unaffected; touch users
 *     fall back to native behaviour; but anyone relying on custom
 *     cursor sizes at the OS level will lose that signal.
 *   - Lenis smooth-scroll overrides default browser scrolling. Users
 *     who prefer their own scroll behaviour (especially those on
 *     macOS with "reduce motion" enabled) may find this disorienting.
 *     We honour `prefers-reduced-motion` where possible.
 *   - GSAP scroll-reveal animations hide content until the user
 *     scrolls into it. If JS fails, content stays hidden — CSS
 *     fallback paints default-hidden content invisible by design.
 */
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import {
  LegalPageView,
  LegalH2,
  LegalH3,
  LegalP,
  LegalUl,
  LegalA,
} from "@/components/LegalPageView";

export const metadata: Metadata = {
  title: "Accessibility Statement · Webgro",
  description:
    "What we've built for accessibility on webgro.co.uk, what we know still needs work, and how to report an issue.",
};

export default function AccessibilityPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <LegalPageView
          eyebrow="[ Legal ] Accessibility"
          title="Accessibility Statement"
          intro="We want webgro.co.uk to be usable by as many people as possible. This is a plain-English statement of what we've built, what we know isn't yet perfect, and how to tell us when we get it wrong."
          lastReviewed="April 2026"
        >
          <LegalH2>What we&rsquo;re aiming for</LegalH2>
          <LegalP>
            Our target is <strong>WCAG 2.2 level AA</strong> across the whole
            site. That means perceivable, operable, understandable, and robust
            for keyboard, screen-reader, and assistive-tech users.
          </LegalP>

          <LegalH2>What should work well</LegalH2>
          <LegalUl>
            <li>
              All content is reachable by keyboard. Focus states are visible
              and the tab order follows the visual reading order.
            </li>
            <li>
              Semantic HTML throughout. Headings are nested correctly, landmarks
              (nav, main, footer) are labelled, and links say where they go.
            </li>
            <li>
              Text contrast meets or exceeds 4.5:1 for body copy and 3:1 for
              large display type against our dark background.
            </li>
            <li>
              Every image has alt text. Decorative images are marked as such
              so screen readers skip them.
            </li>
            <li>
              The site works without a mouse. Every interactive element can be
              activated with Enter, Space, or the relevant arrow key.
            </li>
            <li>
              We respect <code>prefers-reduced-motion</code>. If you&rsquo;ve
              turned reduced motion on in your OS, our scroll-triggered
              animations and smooth-scroll effects are toned down.
            </li>
          </LegalUl>

          <LegalH2>Known limitations</LegalH2>
          <LegalP>
            We&rsquo;re honest about the places the site trades visual polish
            for accessibility. These are open issues we&rsquo;ll improve where
            we can:
          </LegalP>

          <LegalH3>Custom cursor</LegalH3>
          <LegalP>
            On mouse-and-trackpad devices we replace the default OS cursor
            with a custom dot-and-ring cursor. Keyboard users, touch users,
            and anyone on a reduced-motion setting are not affected. If you
            rely on an enlarged or high-contrast OS cursor for visibility,
            the custom cursor may work against you. Disable JavaScript and
            you&rsquo;ll get your native cursor back.
          </LegalP>

          <LegalH3>Smooth scrolling</LegalH3>
          <LegalP>
            We use a smooth-scroll library (Lenis) for momentum scrolling.
            Some users, especially on trackpads with reduce-motion enabled,
            find this disorienting. We honour the reduce-motion system
            preference, but the fallback is not identical to native scrolling.
          </LegalP>

          <LegalH3>Scroll-reveal animations</LegalH3>
          <LegalP>
            Several sections fade or translate into view as you scroll. This
            is driven by GSAP and requires JavaScript. We use CSS to hide
            these sections by default so they don&rsquo;t &ldquo;pop in&rdquo;
            after the page loads; if JavaScript fails, they stay hidden. This
            is a deliberate trade-off for a smoother first paint, but it
            means JavaScript-off users lose some content. If you browse with
            scripts disabled and hit this, email us and we&rsquo;ll send you
            the copy directly.
          </LegalP>

          <LegalH2>How to tell us about a problem</LegalH2>
          <LegalP>
            We want to know when we get it wrong. Email{" "}
            <LegalA href="mailto:hello@webgro.co.uk">
              hello@webgro.co.uk
            </LegalA>{" "}
            with the page URL and a description of what&rsquo;s not working.
            We aim to reply within one working day and fix confirmed issues
            within 30 days.
          </LegalP>
          <LegalP>
            If we can&rsquo;t fix something immediately, we&rsquo;ll add it to
            this page as a known limitation and give an honest estimate of
            when it&rsquo;ll be resolved.
          </LegalP>

          <LegalH2>Escalation</LegalH2>
          <LegalP>
            If you report an issue and you&rsquo;re not happy with our response,
            you can contact the Equality Advisory and Support Service (EASS) at{" "}
            <LegalA
              href="https://www.equalityadvisoryservice.com"
              external
            >
              equalityadvisoryservice.com
            </LegalA>
            . Webgro is a private-sector company, so public-sector
            accessibility regulations don&rsquo;t formally apply to us, but we
            try to meet their spirit anyway.
          </LegalP>

          <LegalH2>How this statement was prepared</LegalH2>
          <LegalP>
            This statement was prepared in April 2026 based on a self-review
            of the site against WCAG 2.2 level AA. We haven&rsquo;t yet
            commissioned a formal external audit; when we do, we&rsquo;ll
            update this page with the results and any new known issues.
          </LegalP>
        </LegalPageView>
      </main>
      <Footer />
    </>
  );
}
