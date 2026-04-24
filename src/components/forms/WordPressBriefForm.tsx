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
 * WordPress website brief.
 *
 * Shorter than the eCommerce brief — the commercial / fulfilment
 * sections come out, and we swap in questions about content types,
 * page templates, functionality (membership, booking, forms,
 * newsletter), and hosting.
 */

const FIELD_MAP: Record<string, FieldMapEntry> = {
  // §1 About
  companyName: { section: "The business", label: "Company / project name" },
  contactName: { section: "The business", label: "Your name" },
  contactRole: { section: "The business", label: "Your role" },
  contactEmail: { section: "The business", label: "Email" },
  contactPhone: { section: "The business", label: "Phone" },
  currentUrl: { section: "The business", label: "Current website URL" },
  businessDescription: {
    section: "The business",
    label: "What the business / project does (2\u20133 lines)",
  },
  tradingSince: { section: "The business", label: "How long you've been going" },
  teamSize: { section: "The business", label: "Team size" },

  // §2 Scope
  projectType: { section: "Project scope", label: "What are you building?" },
  whyNow: { section: "Project scope", label: "Why now? What's driving this?" },
  launchDate: { section: "Project scope", label: "Desired launch date" },
  successMetrics: {
    section: "Project scope",
    label: "What does success look like?",
  },
  buildBudget: { section: "Project scope", label: "Build budget" },
  retainerBudget: {
    section: "Project scope",
    label: "Ongoing maintenance / retainer budget",
  },

  // §3 Platform & hosting
  platformPreference: {
    section: "Platform & hosting",
    label: "WordPress flavour",
  },
  currentPlatform: {
    section: "Platform & hosting",
    label: "Current platform (if any)",
  },
  hostingStatus: {
    section: "Platform & hosting",
    label: "Hosting situation",
  },
  hostingProvider: {
    section: "Platform & hosting",
    label: "Preferred / existing hosting provider",
  },
  maintenanceExpectation: {
    section: "Platform & hosting",
    label: "Do you want us to handle ongoing maintenance?",
  },

  // §4 Audience
  audienceType: { section: "Audience", label: "Who the site is for" },
  personas: { section: "Audience", label: "Audience personas" },
  primaryGoal: { section: "Audience", label: "#1 thing you want visitors to do" },

  // §5 Pages & content types
  pageTypes: { section: "Pages & content types", label: "Page types expected" },
  contentTypes: {
    section: "Pages & content types",
    label: "Custom content types needed",
  },
  contentVolume: {
    section: "Pages & content types",
    label: "Estimated volume (pages / posts)",
  },
  multilingual: {
    section: "Pages & content types",
    label: "Multilingual / multi-region?",
  },

  // §6 Functionality
  functionality: {
    section: "Functionality",
    label: "Functionality required",
  },
  forms: { section: "Functionality", label: "Form / submission flows" },
  membership: {
    section: "Functionality",
    label: "Logged-in / membership area?",
  },
  booking: {
    section: "Functionality",
    label: "Booking / appointments?",
  },
  searchExpectation: {
    section: "Functionality",
    label: "On-site search expectations",
  },

  // §7 Marketing
  trafficSources: { section: "Marketing", label: "Current traffic sources" },
  seoPriority: { section: "Marketing", label: "SEO priority" },
  emailPlatform: {
    section: "Marketing",
    label: "Email / newsletter platform",
  },
  socialChannels: {
    section: "Marketing",
    label: "Active social channels",
  },
  analyticsTools: { section: "Marketing", label: "Analytics tools in use" },

  // §8 Integrations
  crm: { section: "Integrations required", label: "CRM" },
  newsletter: {
    section: "Integrations required",
    label: "Newsletter platform",
  },
  calendar: {
    section: "Integrations required",
    label: "Calendar / scheduling",
  },
  otherIntegrations: {
    section: "Integrations required",
    label: "Anything else critical",
  },

  // §9 Creative
  brandAssets: { section: "Creative direction", label: "Brand assets available" },
  brandGuidelinesUrl: {
    section: "Creative direction",
    label: "Brand guidelines URL",
  },
  sitesYouLove: {
    section: "Creative direction",
    label: "Websites you love (with why)",
  },
  respectedCompetitors: {
    section: "Creative direction",
    label: "Competitors / peers you respect",
  },
  vibe: { section: "Creative direction", label: "Brand vibe" },
  designNoGos: { section: "Creative direction", label: "Hard no-gos in design" },
  colourDirection: {
    section: "Creative direction",
    label: "Colour palette direction",
  },
  typographyDirection: {
    section: "Creative direction",
    label: "Typography direction",
  },
  photoStyle: {
    section: "Creative direction",
    label: "Photography style",
  },

  // §10 Team
  decisionMaker: {
    section: "Team & decision-making",
    label: "Primary decision-maker",
  },
  approvers: {
    section: "Team & decision-making",
    label: "Others who need to approve designs",
  },
  contributors: {
    section: "Team & decision-making",
    label: "Team members contributing content",
  },
  availability: {
    section: "Team & decision-making",
    label: "Hours per week you can commit to reviews",
  },

  // §11 Anything else
  keptYouUp: {
    section: "Anything else",
    label: "What's kept you up at night about your current site?",
  },
  concerns: {
    section: "Anything else",
    label: "Anything you're worried about with this project",
  },
  misc: { section: "Anything else", label: "Anything else we should know" },
};

const SECTION_ORDER = [
  "The business",
  "Project scope",
  "Platform & hosting",
  "Audience",
  "Pages & content types",
  "Functionality",
  "Marketing",
  "Integrations required",
  "Creative direction",
  "Team & decision-making",
  "Anything else",
] as const;

const INITIAL = Object.keys(FIELD_MAP).reduce<Record<string, string | string[]>>(
  (acc, key) => {
    acc[key] = "";
    return acc;
  },
  {},
);
const MULTI_KEYS = [
  "pageTypes",
  "contentTypes",
  "functionality",
  "trafficSources",
  "socialChannels",
  "analyticsTools",
  "brandAssets",
  "vibe",
];
MULTI_KEYS.forEach((k) => (INITIAL[k] = []));

export function WordPressBriefForm() {
  const { state, update, toggle, clear } = useLongFormState(
    "webgro:wordpress-brief:v1",
    INITIAL,
  );

  const s = (k: string) => (typeof state[k] === "string" ? (state[k] as string) : "");
  const a = (k: string) => (Array.isArray(state[k]) ? (state[k] as string[]) : []);
  const yn = (k: string): "" | "Yes" | "No" => {
    const v = s(k);
    return v === "Yes" || v === "No" ? v : "";
  };

  return (
    <LongFormLayout
      formType="wordpress-brief"
      eyebrow="[ Webgro ] WordPress brief"
      title="Tell us about the site."
      lead="A working brief for a WordPress build \u2014 brochure, editorial, portfolio, membership, or any shape between. All questions optional."
      state={state}
      fieldMap={FIELD_MAP}
      sectionOrder={SECTION_ORDER as unknown as readonly string[]}
      clientNameKey="companyName"
      replyToKey="contactEmail"
      onClearDraft={clear}
    >
      {/* §1 About */}
      <FormSection num="01" title="The business">
        <TwoCol>
          <TextInput label="Company / project name" value={s("companyName")} onChange={(v) => update("companyName", v)} />
          <TextInput label="Your name" value={s("contactName")} onChange={(v) => update("contactName", v)} autoComplete="name" />
        </TwoCol>
        <TwoCol>
          <TextInput label="Your role" value={s("contactRole")} onChange={(v) => update("contactRole", v)} />
          <TextInput label="Email" type="email" value={s("contactEmail")} onChange={(v) => update("contactEmail", v)} autoComplete="email" />
        </TwoCol>
        <TwoCol>
          <TextInput label="Phone" type="tel" value={s("contactPhone")} onChange={(v) => update("contactPhone", v)} />
          <TextInput label="Current website URL" type="url" value={s("currentUrl")} onChange={(v) => update("currentUrl", v)} placeholder="https://" />
        </TwoCol>
        <TextArea
          label="What the business / project does (2\u20133 lines)"
          value={s("businessDescription")}
          onChange={(v) => update("businessDescription", v)}
          rows={3}
        />
        <TwoCol>
          <PillRadio
            label="How long you've been going"
            value={s("tradingSince")}
            onChange={(v) => update("tradingSince", v)}
            options={["Pre-launch", "< 1 year", "1\u20133 years", "3\u20135 years", "5\u201310 years", "10+ years"]}
          />
          <TextInput label="Team size" value={s("teamSize")} onChange={(v) => update("teamSize", v)} placeholder="e.g. 3 full-time, 2 freelance" />
        </TwoCol>
      </FormSection>

      {/* §2 Scope */}
      <FormSection num="02" title="Project scope">
        <PillRadio
          label="What are you building?"
          value={s("projectType")}
          onChange={(v) => update("projectType", v)}
          options={[
            "New site from scratch",
            "Replacing an existing site",
            "Redesign on same platform",
            "Extending a current site",
            "Not sure yet",
          ]}
        />
        <TextArea label="Why now? What's driving this?" value={s("whyNow")} onChange={(v) => update("whyNow", v)} rows={3} />
        <TwoCol>
          <TextInput label="Desired launch date" value={s("launchDate")} onChange={(v) => update("launchDate", v)} placeholder="e.g. Q3 2026" />
          <PillRadio
            label="Build budget"
            value={s("buildBudget")}
            onChange={(v) => update("buildBudget", v)}
            options={[
              "< \u00a32k",
              "\u00a32\u20135k",
              "\u00a35\u201310k",
              "\u00a310\u201325k",
              "\u00a325\u201350k",
              "\u00a350k+",
              "Not sure",
            ]}
          />
        </TwoCol>
        <TextArea
          label="What does success look like?"
          value={s("successMetrics")}
          onChange={(v) => update("successMetrics", v)}
          rows={3}
          help="Three specific outcomes you'd celebrate six months after launch."
        />
        <PillRadio
          label="Ongoing maintenance / retainer budget"
          value={s("retainerBudget")}
          onChange={(v) => update("retainerBudget", v)}
          options={[
            "None yet",
            "\u00a3120 / month maintenance only",
            "\u00a3250\u2013500 / month",
            "\u00a3500\u20131k / month",
            "\u00a31k+ / month",
          ]}
        />
      </FormSection>

      {/* §3 Platform & hosting */}
      <FormSection num="03" title="Platform & hosting">
        <PillRadio
          label="WordPress flavour"
          value={s("platformPreference")}
          onChange={(v) => update("platformPreference", v)}
          options={[
            "Standard WordPress (self-hosted)",
            "WordPress.com business",
            "Open to alternatives",
            "Not sure \u2014 recommend",
          ]}
        />
        <TextInput label="Current platform (if any)" value={s("currentPlatform")} onChange={(v) => update("currentPlatform", v)} />
        <PillRadio
          label="Hosting situation"
          value={s("hostingStatus")}
          onChange={(v) => update("hostingStatus", v)}
          options={[
            "We have hosting, keep it",
            "We have hosting, open to moving",
            "No hosting yet \u2014 recommend",
            "Not sure",
          ]}
        />
        <TextInput label="Preferred / existing hosting provider" value={s("hostingProvider")} onChange={(v) => update("hostingProvider", v)} placeholder="e.g. 20i, SiteGround, Kinsta, WP Engine" />
        <PillRadio
          label="Do you want us to handle ongoing maintenance?"
          value={s("maintenanceExpectation")}
          onChange={(v) => update("maintenanceExpectation", v)}
          options={[
            "Yes, full maintenance package",
            "Yes, ad-hoc updates only",
            "No, we'll handle it",
            "Not decided",
          ]}
        />
      </FormSection>

      {/* §4 Audience */}
      <FormSection num="04" title="Audience">
        <TextInput label="Who the site is for" value={s("audienceType")} onChange={(v) => update("audienceType", v)} placeholder="e.g. B2B buyers; parents of toddlers; small hotel operators" />
        <TextArea label="Audience personas" value={s("personas")} onChange={(v) => update("personas", v)} rows={4} help="Short descriptions of the people you're writing for." />
        <TextInput label="#1 thing you want visitors to do" value={s("primaryGoal")} onChange={(v) => update("primaryGoal", v)} placeholder="e.g. book a call; download the guide; subscribe" />
      </FormSection>

      {/* §5 Pages & content types */}
      <FormSection num="05" title="Pages & content types">
        <PillMulti
          label="Page types expected"
          values={a("pageTypes")}
          onToggle={(opt) => toggle("pageTypes", opt)}
          options={[
            "Homepage",
            "About",
            "Services",
            "Team",
            "Case studies / portfolio",
            "Blog",
            "Resources / guides",
            "Events",
            "Careers",
            "Contact",
            "FAQ",
            "Locations",
          ]}
        />
        <PillMulti
          label="Custom content types needed"
          values={a("contentTypes")}
          onToggle={(opt) => toggle("contentTypes", opt)}
          options={[
            "Blog posts",
            "Case studies",
            "Team profiles",
            "Events",
            "Resources / downloads",
            "Locations / branches",
            "Products (non-sellable)",
            "Testimonials",
            "Jobs / careers",
          ]}
        />
        <TextInput label="Estimated volume (pages / posts)" value={s("contentVolume")} onChange={(v) => update("contentVolume", v)} placeholder="e.g. 12 core pages + a blog that grows over time" />
        <PillRadio
          label="Multilingual / multi-region?"
          value={s("multilingual")}
          onChange={(v) => update("multilingual", v)}
          options={["No", "Yes \u2014 2 languages", "Yes \u2014 3+ languages", "Regional variants (e.g. UK/US)"]}
        />
      </FormSection>

      {/* §6 Functionality */}
      <FormSection num="06" title="Functionality">
        <PillMulti
          label="Functionality required"
          values={a("functionality")}
          onToggle={(opt) => toggle("functionality", opt)}
          options={[
            "Contact form",
            "Quote request",
            "Newsletter signup",
            "Booking / appointment",
            "Events calendar",
            "Membership / logged-in area",
            "Knowledge base",
            "Live chat",
            "Download gating",
            "Podcast / media feed",
            "Internal search",
            "Filtering / faceted search",
          ]}
        />
        <TextArea label="Form / submission flows" value={s("forms")} onChange={(v) => update("forms", v)} rows={4} help="Describe the forms you need and where they lead (CRM, email, both)." />
        <YesNo label="Logged-in / membership area?" value={yn("membership")} onChange={(v) => update("membership", v)} />
        <YesNo label="Booking / appointments?" value={yn("booking")} onChange={(v) => update("booking", v)} />
        <TextInput label="On-site search expectations" value={s("searchExpectation")} onChange={(v) => update("searchExpectation", v)} placeholder="e.g. global search; filtered search on resources only" />
      </FormSection>

      {/* §7 Marketing */}
      <FormSection num="07" title="Marketing">
        <PillMulti
          label="Current traffic sources"
          values={a("trafficSources")}
          onToggle={(opt) => toggle("trafficSources", opt)}
          options={[
            "Organic search",
            "Paid Google",
            "Paid Meta",
            "Paid LinkedIn",
            "Email",
            "Direct",
            "Referral",
            "Social organic",
            "Podcast / PR",
          ]}
        />
        <PillRadio
          label="SEO priority"
          value={s("seoPriority")}
          onChange={(v) => update("seoPriority", v)}
          options={[
            "Core \u2014 it's how we win customers",
            "Important \u2014 one of several channels",
            "Nice to have",
            "Not a priority",
          ]}
        />
        <PillRadio
          label="Email / newsletter platform"
          value={s("emailPlatform")}
          onChange={(v) => update("emailPlatform", v)}
          options={["Mailchimp", "ConvertKit", "Beehiiv", "Hubspot", "ActiveCampaign", "Substack", "Other", "None"]}
        />
        <PillMulti
          label="Active social channels"
          values={a("socialChannels")}
          onToggle={(opt) => toggle("socialChannels", opt)}
          options={["Instagram", "LinkedIn", "Facebook", "X / Twitter", "TikTok", "YouTube", "Threads", "None"]}
        />
        <PillMulti
          label="Analytics tools in use"
          values={a("analyticsTools")}
          onToggle={(opt) => toggle("analyticsTools", opt)}
          options={["GA4", "Hotjar", "Microsoft Clarity", "Fathom / Plausible", "Matomo", "None"]}
        />
      </FormSection>

      {/* §8 Integrations */}
      <FormSection num="08" title="Integrations required">
        <TwoCol>
          <TextInput label="CRM" value={s("crm")} onChange={(v) => update("crm", v)} placeholder="Hubspot / Salesforce / Pipedrive" />
          <TextInput label="Newsletter platform" value={s("newsletter")} onChange={(v) => update("newsletter", v)} placeholder="Mailchimp / ConvertKit / Beehiiv" />
        </TwoCol>
        <TextInput label="Calendar / scheduling" value={s("calendar")} onChange={(v) => update("calendar", v)} placeholder="e.g. Calendly, Cal.com, Google Calendar" />
        <TextArea label="Anything else critical" value={s("otherIntegrations")} onChange={(v) => update("otherIntegrations", v)} rows={3} />
      </FormSection>

      {/* §9 Creative direction */}
      <FormSection num="09" title="Creative direction">
        <PillMulti
          label="Brand assets available"
          values={a("brandAssets")}
          onToggle={(opt) => toggle("brandAssets", opt)}
          options={[
            "Logo",
            "Brand guidelines",
            "Colour palette",
            "Fonts / typography",
            "Photography",
            "Icon set",
            "Motion / video",
          ]}
        />
        <TextInput label="Brand guidelines URL (if shareable)" type="url" value={s("brandGuidelinesUrl")} onChange={(v) => update("brandGuidelinesUrl", v)} placeholder="Google Drive / Notion / Figma" />
        <TextArea
          label="Websites you love (with why)"
          value={s("sitesYouLove")}
          onChange={(v) => update("sitesYouLove", v)}
          rows={5}
          help="3\u20135 URLs, and one line each on what you love about them."
        />
        <TextArea label="Competitors / peers you respect" value={s("respectedCompetitors")} onChange={(v) => update("respectedCompetitors", v)} rows={3} />
        <PillMulti
          label="Brand vibe"
          values={a("vibe")}
          onToggle={(opt) => toggle("vibe", opt)}
          options={[
            "Minimal",
            "Editorial",
            "Playful",
            "Premium",
            "Technical",
            "Bold",
            "Warm",
            "Clinical",
            "Craft",
            "Maximalist",
          ]}
        />
        <TextArea label="Hard no-gos in design" value={s("designNoGos")} onChange={(v) => update("designNoGos", v)} rows={3} />
        <TwoCol>
          <TextInput label="Colour palette direction" value={s("colourDirection")} onChange={(v) => update("colourDirection", v)} />
          <TextInput label="Typography direction" value={s("typographyDirection")} onChange={(v) => update("typographyDirection", v)} />
        </TwoCol>
        <TextInput label="Photography style" value={s("photoStyle")} onChange={(v) => update("photoStyle", v)} />
      </FormSection>

      {/* §10 Team */}
      <FormSection num="10" title="Team & decision-making">
        <TextInput label="Primary decision-maker" value={s("decisionMaker")} onChange={(v) => update("decisionMaker", v)} />
        <TextArea label="Others who need to approve designs" value={s("approvers")} onChange={(v) => update("approvers", v)} rows={2} />
        <TextArea label="Team members contributing content" value={s("contributors")} onChange={(v) => update("contributors", v)} rows={2} />
        <TextInput label="Hours per week you can commit to reviews" value={s("availability")} onChange={(v) => update("availability", v)} />
      </FormSection>

      {/* §11 Anything else */}
      <FormSection num="11" title="Anything else">
        <TextArea label="What's kept you up at night about your current site?" value={s("keptYouUp")} onChange={(v) => update("keptYouUp", v)} rows={3} />
        <TextArea label="Anything you're worried about with this project" value={s("concerns")} onChange={(v) => update("concerns", v)} rows={3} />
        <TextArea label="Anything else we should know" value={s("misc")} onChange={(v) => update("misc", v)} rows={4} />
      </FormSection>
    </LongFormLayout>
  );
}
