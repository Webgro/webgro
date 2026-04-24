"use client";

import {
  FormSection,
  PillMulti,
  PillRadio,
  TextArea,
  TextInput,
  TwoCol,
  YesNo,
} from "@/components/forms/fields";
import {
  LongFormLayout,
  useLongFormState,
  type FieldMapEntry,
} from "@/components/forms/LongFormLayout";

/**
 * Customer onboarding form.
 *
 * Used once a client has signed. Gathers the operational details we
 * need to kick off work: company info, primary contact, billing and
 * accounts contact, registered address, platform access, etc.
 *
 * Every field is optional — sections with nothing entered simply
 * won't appear in the email that lands at hello@webgro.co.uk. That
 * lets us re-use this single form for everyone from a sole trader
 * to a PLC with eight stakeholders.
 */

// Stable field keys → (section, label). These keys double as localStorage
// keys and are the contract between the form state and the server.
const FIELD_MAP: Record<string, FieldMapEntry> = {
  // §1
  legalName: { section: "Company details", label: "Legal company name" },
  tradingName: { section: "Company details", label: "Trading name (if different)" },
  companyReg: { section: "Company details", label: "Company registration number" },
  vatNumber: { section: "Company details", label: "VAT number" },
  industry: { section: "Company details", label: "Industry / sector" },
  websiteUrl: { section: "Company details", label: "Company website URL" },

  // §2
  primaryName: { section: "Primary contact", label: "Full name" },
  primaryRole: { section: "Primary contact", label: "Role / job title" },
  primaryEmail: { section: "Primary contact", label: "Email address" },
  primaryDirect: { section: "Primary contact", label: "Direct phone" },
  primaryMobile: { section: "Primary contact", label: "Mobile" },
  primaryChannel: {
    section: "Primary contact",
    label: "Preferred contact channel",
  },
  primaryTimes: {
    section: "Primary contact",
    label: "Best times to reach you",
  },

  // §3
  accountsName: { section: "Accounts & billing", label: "Accounts contact name" },
  accountsEmail: {
    section: "Accounts & billing",
    label: "Accounts contact email",
  },
  accountsPhone: {
    section: "Accounts & billing",
    label: "Accounts contact phone",
  },
  billingAddress: { section: "Accounts & billing", label: "Billing address" },
  poRequired: {
    section: "Accounts & billing",
    label: "PO number required on invoices?",
  },
  poDefault: {
    section: "Accounts & billing",
    label: "PO number (if you have a standing one)",
  },
  paymentMethod: {
    section: "Accounts & billing",
    label: "Preferred payment method",
  },
  billingCurrency: {
    section: "Accounts & billing",
    label: "Billing currency",
  },

  // §4
  regAddressSame: {
    section: "Registered company address",
    label: "Same as billing?",
  },
  regAddress: {
    section: "Registered company address",
    label: "Registered address (if different)",
  },

  // §5
  otherContacts: {
    section: "Other contacts",
    label: "Anyone else we should include?",
  },
  emergencyContact: {
    section: "Other contacts",
    label: "Out-of-hours / emergency contact",
  },

  // §6
  domainRegistrar: {
    section: "Platform access & credentials",
    label: "Domain registrar",
  },
  hostingProvider: {
    section: "Platform access & credentials",
    label: "Web hosting provider",
  },
  currentCms: {
    section: "Platform access & credentials",
    label: "Current CMS",
  },
  cmsAccess: {
    section: "Platform access & credentials",
    label: "CMS admin access",
  },
  analyticsAccess: {
    section: "Platform access & credentials",
    label: "Analytics access available?",
  },
  socials: {
    section: "Platform access & credentials",
    label: "Social media handles",
  },
  sharedPasswordTool: {
    section: "Platform access & credentials",
    label: "Preferred way to share credentials",
  },

  // §7
  anythingElse: {
    section: "Anything else",
    label: "Anything else we should know?",
  },
};

const SECTION_ORDER = [
  "Company details",
  "Primary contact",
  "Accounts & billing",
  "Registered company address",
  "Other contacts",
  "Platform access & credentials",
  "Anything else",
] as const;

const INITIAL = Object.keys(FIELD_MAP).reduce<Record<string, string | string[]>>(
  (acc, key) => {
    acc[key] = "";
    return acc;
  },
  {},
);

export function OnboardingForm() {
  const { state, update, clear } = useLongFormState(
    "webgro:onboarding:v1",
    INITIAL,
  );

  // Narrowing helpers so TypeScript knows the value shape
  const s = (k: string) =>
    typeof state[k] === "string" ? (state[k] as string) : "";
  const yesNo = (k: string): "" | "Yes" | "No" => {
    const v = s(k);
    return v === "Yes" || v === "No" ? v : "";
  };

  return (
    <LongFormLayout
      formType="onboarding"
      eyebrow="[ Webgro ] New client onboarding"
      title="Let's get set up."
      lead="A few details so we can file you properly, hit the ground running, and make sure invoices land with the right person. Fill what's relevant, skip what isn't."
      state={state}
      fieldMap={FIELD_MAP}
      sectionOrder={SECTION_ORDER as unknown as readonly string[]}
      clientNameKey="legalName"
      replyToKey="primaryEmail"
      onClearDraft={clear}
    >
      {/* §1 Company details */}
      <FormSection num="01" title="Company details">
        <TwoCol>
          <TextInput
            label="Legal company name"
            value={s("legalName")}
            onChange={(v) => update("legalName", v)}
            placeholder="e.g. Example Trading Ltd"
          />
          <TextInput
            label="Trading name (if different)"
            value={s("tradingName")}
            onChange={(v) => update("tradingName", v)}
          />
        </TwoCol>
        <TwoCol>
          <TextInput
            label="Company registration number"
            value={s("companyReg")}
            onChange={(v) => update("companyReg", v)}
            placeholder="UK Companies House number"
          />
          <TextInput
            label="VAT number"
            value={s("vatNumber")}
            onChange={(v) => update("vatNumber", v)}
            help="Leave blank if not VAT-registered."
          />
        </TwoCol>
        <TwoCol>
          <TextInput
            label="Industry / sector"
            value={s("industry")}
            onChange={(v) => update("industry", v)}
            placeholder="e.g. Fashion, B2B SaaS, Logistics"
          />
          <TextInput
            label="Current website URL"
            type="url"
            value={s("websiteUrl")}
            onChange={(v) => update("websiteUrl", v)}
            placeholder="https://"
          />
        </TwoCol>
      </FormSection>

      {/* §2 Primary contact */}
      <FormSection
        num="02"
        title="Primary contact"
        intro="The person we'll work with day to day. This is the inbox we'll default to for strategy calls, proofs, and sign-offs."
      >
        <TwoCol>
          <TextInput
            label="Full name"
            value={s("primaryName")}
            onChange={(v) => update("primaryName", v)}
            autoComplete="name"
          />
          <TextInput
            label="Role / job title"
            value={s("primaryRole")}
            onChange={(v) => update("primaryRole", v)}
          />
        </TwoCol>
        <TwoCol>
          <TextInput
            label="Email address"
            type="email"
            value={s("primaryEmail")}
            onChange={(v) => update("primaryEmail", v)}
            autoComplete="email"
          />
          <TextInput
            label="Direct phone"
            type="tel"
            value={s("primaryDirect")}
            onChange={(v) => update("primaryDirect", v)}
          />
        </TwoCol>
        <TextInput
          label="Mobile"
          type="tel"
          value={s("primaryMobile")}
          onChange={(v) => update("primaryMobile", v)}
        />
        <PillRadio
          label="Preferred contact channel"
          value={s("primaryChannel")}
          onChange={(v) => update("primaryChannel", v)}
          options={[
            "Email",
            "Phone",
            "Video call",
            "WhatsApp",
            "Slack",
            "Teams",
          ]}
        />
        <TextInput
          label="Best times to reach you"
          value={s("primaryTimes")}
          onChange={(v) => update("primaryTimes", v)}
          placeholder="e.g. Weekdays 9\u201312, or avoid Fri afternoons"
        />
      </FormSection>

      {/* §3 Accounts & billing */}
      <FormSection
        num="03"
        title="Accounts & billing"
        intro="Where invoices and remittance advice go. This can be the same person as the primary contact, a finance inbox, or a separate bookkeeper."
      >
        <TwoCol>
          <TextInput
            label="Accounts contact name"
            value={s("accountsName")}
            onChange={(v) => update("accountsName", v)}
          />
          <TextInput
            label="Accounts contact email"
            type="email"
            value={s("accountsEmail")}
            onChange={(v) => update("accountsEmail", v)}
          />
        </TwoCol>
        <TextInput
          label="Accounts contact phone"
          type="tel"
          value={s("accountsPhone")}
          onChange={(v) => update("accountsPhone", v)}
        />
        <TextArea
          label="Billing address"
          value={s("billingAddress")}
          onChange={(v) => update("billingAddress", v)}
          rows={4}
          placeholder="Street\nCity\nCounty\nPostcode\nCountry"
        />
        <TwoCol>
          <YesNo
            label="PO number required on invoices?"
            value={yesNo("poRequired")}
            onChange={(v) => update("poRequired", v)}
          />
          <TextInput
            label="Standing PO number (if any)"
            value={s("poDefault")}
            onChange={(v) => update("poDefault", v)}
            help="Optional — only if you use the same PO across every invoice."
          />
        </TwoCol>
        <TwoCol>
          <PillRadio
            label="Preferred payment method"
            value={s("paymentMethod")}
            onChange={(v) => update("paymentMethod", v)}
            options={[
              "Bank transfer",
              "Direct debit",
              "Card",
              "Cheque",
            ]}
          />
          <PillRadio
            label="Billing currency"
            value={s("billingCurrency")}
            onChange={(v) => update("billingCurrency", v)}
            options={["GBP", "EUR", "USD", "Other"]}
          />
        </TwoCol>
      </FormSection>

      {/* §4 Registered address */}
      <FormSection
        num="04"
        title="Registered company address"
        intro="For invoice legal footers and anything we need to post. Skip if same as billing."
      >
        <YesNo
          label="Same as billing address?"
          value={yesNo("regAddressSame")}
          onChange={(v) => update("regAddressSame", v)}
        />
        <TextArea
          label="Registered address (if different)"
          value={s("regAddress")}
          onChange={(v) => update("regAddress", v)}
          rows={4}
        />
      </FormSection>

      {/* §5 Other contacts */}
      <FormSection
        num="05"
        title="Other contacts"
        intro="Anyone else we might correspond with during the project — a project manager, a brand lead, an external agency, an IT contact."
      >
        <TextArea
          label="Anyone else we should CC or know about?"
          value={s("otherContacts")}
          onChange={(v) => update("otherContacts", v)}
          rows={5}
          placeholder="Name · Role · Email · (what they're involved with)"
        />
        <TextArea
          label="Out-of-hours / emergency contact"
          value={s("emergencyContact")}
          onChange={(v) => update("emergencyContact", v)}
          rows={2}
          placeholder="Useful if your live site has an outage overnight."
        />
      </FormSection>

      {/* §6 Platform access */}
      <FormSection
        num="06"
        title="Platform access & credentials"
        intro="We don't need passwords up front — just a picture of where everything lives so we can request access cleanly at the right time."
      >
        <TwoCol>
          <TextInput
            label="Domain registrar"
            value={s("domainRegistrar")}
            onChange={(v) => update("domainRegistrar", v)}
            placeholder="e.g. GoDaddy, 123-reg, Cloudflare"
          />
          <TextInput
            label="Web hosting provider"
            value={s("hostingProvider")}
            onChange={(v) => update("hostingProvider", v)}
            placeholder="e.g. 20i, SiteGround, Shopify, Vercel"
          />
        </TwoCol>
        <TwoCol>
          <PillRadio
            label="Current CMS"
            value={s("currentCms")}
            onChange={(v) => update("currentCms", v)}
            options={[
              "WordPress",
              "Shopify",
              "Squarespace",
              "Wix",
              "Webflow",
              "Custom",
              "None / building from scratch",
              "Not sure",
            ]}
          />
          <PillRadio
            label="CMS admin access for us"
            value={s("cmsAccess")}
            onChange={(v) => update("cmsAccess", v)}
            options={[
              "Can create one now",
              "Will create when asked",
              "Need help creating one",
              "No CMS yet",
            ]}
          />
        </TwoCol>
        <PillMulti
          label="Analytics / platform access available"
          values={
            Array.isArray(state.analyticsAccess) ? state.analyticsAccess : []
          }
          onToggle={(opt) => {
            const current = Array.isArray(state.analyticsAccess)
              ? state.analyticsAccess
              : [];
            const next = current.includes(opt)
              ? current.filter((v) => v !== opt)
              : [...current, opt];
            update("analyticsAccess", next);
          }}
          options={[
            "Google Analytics",
            "Google Search Console",
            "Google Tag Manager",
            "Google Ads",
            "Meta Business",
            "Klaviyo",
            "Mailchimp",
            "Shopify admin",
            "WordPress admin",
            "Hosting control panel",
          ]}
        />
        <TextArea
          label="Social media handles"
          value={s("socials")}
          onChange={(v) => update("socials", v)}
          rows={3}
          placeholder="Instagram: @...\nLinkedIn: ...\nFacebook: ..."
        />
        <PillRadio
          label="Preferred way to share credentials when needed"
          value={s("sharedPasswordTool")}
          onChange={(v) => update("sharedPasswordTool", v)}
          options={[
            "1Password shared vault",
            "LastPass",
            "Bitwarden",
            "Encrypted email",
            "Whatever you recommend",
          ]}
        />
      </FormSection>

      {/* §7 Anything else */}
      <FormSection num="07" title="Anything else">
        <TextArea
          label="Is there anything else we should know before we start?"
          value={s("anythingElse")}
          onChange={(v) => update("anythingElse", v)}
          rows={6}
          placeholder="Key dates, known blockers, stakeholders we should flatter, ways you like to work."
        />
      </FormSection>
    </LongFormLayout>
  );
}
