/**
 * Privacy Policy.
 *
 * ⚠️ DRAFT. Written in plain English and structured around the UK GDPR
 * and the Data Protection Act 2018. Accurate to what the site actually
 * does today: a single contact form whose submissions are emailed to
 * hello@webgro.co.uk. No analytics, no remarketing, no third-party
 * tracking wired up. If any of that changes (Google Analytics, Meta
 * pixel, Hotjar, a CRM integration), this page has to be updated to
 * reflect it before launch.
 *
 * Have a UK solicitor review this before going live. It reads correct
 * to the best of my understanding, but I'm not qualified legal counsel.
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
  title: "Privacy Policy · Webgro",
  description:
    "How Webgro collects, uses, and protects your personal data. UK GDPR and Data Protection Act 2018.",
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <LegalPageView
          eyebrow="[ Legal ] Privacy"
          title="Privacy Policy"
          intro="This is the plain-English version of how Webgro handles your personal data. It covers what we collect, why we collect it, how long we keep it, and what you can ask us to do with it."
          lastReviewed="April 2026"
        >
          <LegalH2>Who we are</LegalH2>
          <LegalP>
            Webgro Ltd is a company registered in England and Wales under
            company number 10889889, with its registered office at 12 Longshot
            Lane, Bracknell, Berkshire, RG12 1RL. Webgro is part of the
            Broadbridge Group.
          </LegalP>
          <LegalP>
            For anything relating to this policy or your personal data, contact
            us at{" "}
            <LegalA href="mailto:hello@webgro.co.uk">
              hello@webgro.co.uk
            </LegalA>
            . We are the data controller responsible for your data as described
            on this page.
          </LegalP>

          <LegalH2>What this policy covers</LegalH2>
          <LegalP>
            This policy applies to personal data we collect through{" "}
            <strong>webgro.co.uk</strong>. It does not cover third-party sites
            we link to, or the separate systems we use on client engagements
            (those are governed by the contracts we sign with each client).
          </LegalP>

          <LegalH2>What we collect and why</LegalH2>

          <LegalH3>Contact form submissions</LegalH3>
          <LegalP>
            When you submit the contact form on our site, we collect your name,
            email address, optional phone number, the service you&rsquo;re
            interested in, your ballpark budget, and whatever you tell us in
            the message field. We use this information for one thing only: to
            reply to your enquiry and, if you want to work with us, to scope a
            project together.
          </LegalP>
          <LegalP>
            <strong>Lawful basis:</strong> legitimate interest (Article 6(1)(f)
            UK GDPR). You contacted us to ask about our services, and we use
            the data you supplied to respond.
          </LegalP>

          <LegalH3>Emails you send us directly</LegalH3>
          <LegalP>
            If you email <LegalA href="mailto:hello@webgro.co.uk">hello@webgro.co.uk</LegalA>{" "}
            or another Webgro address, we collect whatever you chose to send.
            We use it to reply, and if the conversation turns into a project,
            to scope and deliver that project.
          </LegalP>

          <LegalH3>Server logs</LegalH3>
          <LegalP>
            Our hosting provider retains standard server logs (IP address,
            timestamp, page requested, user agent) for operational and security
            purposes. These are retained for 30 days and are not tied to named
            individuals.
          </LegalP>
          <LegalP>
            <strong>Lawful basis:</strong> legitimate interest (keeping the
            site online and secure).
          </LegalP>

          <LegalH3>Analytics (only if you opt in)</LegalH3>
          <LegalP>
            If you accept analytics cookies on the cookie banner, we load
            Google Analytics 4 with IP anonymisation. GA4 tells us which
            pages get visited, which don&rsquo;t, and roughly where visitors
            come from. We do not combine this with any other Google product
            or use it for advertising.
          </LegalP>
          <LegalP>
            <strong>Lawful basis:</strong> consent (Article 6(1)(a) UK GDPR).
            You can withdraw consent at any time from the cookie controls,
            which removes analytics scripts from future page loads.
          </LegalP>

          <LegalH3>Bot protection (Cloudflare Turnstile)</LegalH3>
          <LegalP>
            When you submit the contact form, Cloudflare Turnstile runs a
            short challenge to distinguish humans from bots. Cloudflare
            receives the minimum needed for the challenge (headers, a short
            token) and returns a pass/fail. This is necessary to keep the
            contact form usable without drowning in spam.
          </LegalP>
          <LegalP>
            <strong>Lawful basis:</strong> legitimate interest (preventing
            abuse of the form).
          </LegalP>

          <LegalH3>What we don&rsquo;t collect</LegalH3>
          <LegalP>
            We don&rsquo;t run advertising pixels, remarketing tags, or
            behavioural-profiling scripts. There is no commercial
            &ldquo;profile&rdquo; of you being built anywhere.
          </LegalP>

          <LegalH2>How long we keep your data</LegalH2>
          <LegalUl>
            <li>
              <strong>Unsuccessful enquiries:</strong> 12 months after last
              contact, then deleted.
            </li>
            <li>
              <strong>Active clients and prospects:</strong> for the duration
              of our working relationship, plus 7 years after the last invoice
              (UK tax and accounting requirements).
            </li>
            <li>
              <strong>Server logs:</strong> 30 days.
            </li>
          </LegalUl>

          <LegalH2>Who we share it with</LegalH2>
          <LegalP>
            We use a small set of third-party tools to run the business. None
            of them sell your data or use it for their own marketing. Each is a
            data processor acting on our instructions.
          </LegalP>
          <LegalUl>
            <li>
              <strong>Email provider</strong> — to receive and send email
              (Microsoft 365 or Google Workspace, operated in the UK/EU).
            </li>
            <li>
              <strong>Hosting provider (Vercel, US)</strong> — to serve the
              site. Processes request metadata such as IP and user agent for
              routing and logging. UK International Data Transfer Agreement
              in place.
            </li>
            <li>
              <strong>Resend (US)</strong> — transactional email delivery for
              contact form submissions. Processes only the content of each
              submission and the recipient address. UK IDTA in place.
            </li>
            <li>
              <strong>Cloudflare Turnstile (US)</strong> — bot-protection
              challenge on the contact form. Receives challenge metadata, not
              the content of your submission. UK IDTA in place.
            </li>
            <li>
              <strong>Google Analytics 4 (US, consent-only)</strong> —
              anonymised page analytics. Only processes your data if you
              accept analytics cookies on the cookie banner.
            </li>
            <li>
              <strong>Accounting and invoicing software</strong> — for active
              clients, to issue invoices and meet HMRC obligations.
            </li>
          </LegalUl>
          <LegalP>
            Where personal data is transferred outside the UK or European
            Economic Area (typically to US-based providers above), we rely on
            the UK International Data Transfer Agreement or the EU Standard
            Contractual Clauses with the UK Addendum as the appropriate
            safeguard.
          </LegalP>

          <LegalH2>Your rights</LegalH2>
          <LegalP>
            Under the UK GDPR you have the right to:
          </LegalP>
          <LegalUl>
            <li>Ask for a copy of the personal data we hold on you.</li>
            <li>Ask us to correct anything that&rsquo;s wrong.</li>
            <li>
              Ask us to delete your data (subject to legal retention
              obligations, like the 7-year HMRC rule above).
            </li>
            <li>
              Ask us to restrict how we use it, or to port it to another
              provider.
            </li>
            <li>Object to us processing it on legitimate-interest grounds.</li>
            <li>Withdraw any consent you gave (where consent was the basis).</li>
          </LegalUl>
          <LegalP>
            To exercise any of these rights, email{" "}
            <LegalA href="mailto:hello@webgro.co.uk">
              hello@webgro.co.uk
            </LegalA>
            . We&rsquo;ll respond within one working day and complete your
            request within one calendar month.
          </LegalP>
          <LegalP>
            If you&rsquo;re unhappy with how we&rsquo;ve handled your data, you
            have the right to complain to the UK&rsquo;s Information
            Commissioner&rsquo;s Office at{" "}
            <LegalA href="https://ico.org.uk" external>
              ico.org.uk
            </LegalA>
            . We&rsquo;d appreciate the chance to fix it first.
          </LegalP>

          <LegalH2>Children</LegalH2>
          <LegalP>
            Our services are aimed at businesses. We do not knowingly collect
            personal data from anyone under 18. If you believe we have, contact
            us and we&rsquo;ll delete it.
          </LegalP>

          <LegalH2>Changes to this policy</LegalH2>
          <LegalP>
            We review this page at least once a year, and update it any time
            the site&rsquo;s data practices change. The &ldquo;last
            reviewed&rdquo; date at the top of the page reflects the most
            recent review.
          </LegalP>
        </LegalPageView>
      </main>
      <Footer />
    </>
  );
}
