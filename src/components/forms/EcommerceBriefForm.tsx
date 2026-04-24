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
 * eCommerce website brief.
 *
 * Longer-form than the onboarding doc. The questions here shape the
 * build estimate, not the paperwork. Designed to be filled in one
 * sitting or saved mid-way (localStorage keeps the draft alive). All
 * fields optional.
 */

const FIELD_MAP: Record<string, FieldMapEntry> = {
  // §1 About
  companyName: { section: "The business", label: "Company name" },
  contactName: { section: "The business", label: "Your name" },
  contactRole: { section: "The business", label: "Your role" },
  contactEmail: { section: "The business", label: "Email" },
  contactPhone: { section: "The business", label: "Phone" },
  currentUrl: { section: "The business", label: "Current website URL" },
  businessDescription: {
    section: "The business",
    label: "What the business does",
  },
  tradingSince: { section: "The business", label: "How long trading" },
  revenueRange: { section: "The business", label: "Annual revenue range" },
  teamSize: { section: "The business", label: "Team size" },

  // §2 Scope
  projectType: { section: "Project scope", label: "Confirm what we're building" },
  whyNow: { section: "Project scope", label: "Why now? What's driving this?" },
  launchDate: { section: "Project scope", label: "Launch deadline" },
  successMetrics: {
    section: "Project scope",
    label: "What does success look like?",
  },
  // buildBudget removed post-rewrite: redundant once the quote is
  // agreed; the agreed figure lives in Xero and the proposal PDF.
  retainerBudget: {
    section: "Project scope",
    label: "Ongoing retainer appetite",
  },

  // §3 Platform
  platformPreference: { section: "Platform", label: "Preferred platform" },
  currentPlatform: { section: "Platform", label: "Current platform (if any)" },
  platformReasoning: {
    section: "Platform",
    label: "Why that platform, or why you're unsure",
  },

  // §4 Products
  productCount: { section: "Products", label: "Product count" },
  productTypes: { section: "Products", label: "Product types" },
  variantsComplexity: {
    section: "Products",
    label: "Variants / configuration complexity",
  },
  bundles: { section: "Products", label: "Do you offer bundles or kits?" },
  stockManagement: { section: "Products", label: "Stock management tool" },
  productChurn: {
    section: "Products",
    label: "How often do products change?",
  },

  // §5 Orders
  ordersLaunch: {
    section: "Orders & fulfilment",
    label: "Expected orders/month at launch",
  },
  orders12m: {
    section: "Orders & fulfilment",
    label: "Expected orders/month in 12 months",
  },
  aov: { section: "Orders & fulfilment", label: "Average order value" },
  fulfilment: { section: "Orders & fulfilment", label: "Fulfilment method" },
  shippingZones: {
    section: "Orders & fulfilment",
    label: "Shipping zones",
  },
  carriers: { section: "Orders & fulfilment", label: "Shipping carriers" },
  shippingCalc: {
    section: "Orders & fulfilment",
    label: "How shipping is priced",
  },
  deliveryPromise: {
    section: "Orders & fulfilment",
    label: "Delivery promise / cut-off",
  },
  returnsPolicy: {
    section: "Orders & fulfilment",
    label: "Returns policy summary",
  },

  // §6 Customers
  customerType: { section: "Customers", label: "Primary customer type" },
  personas: {
    section: "Customers",
    label: "Target customer personas",
  },
  accountFeatures: {
    section: "Customers",
    label: "Customer account features needed",
  },
  supportChannels: {
    section: "Customers",
    label: "Customer support channels",
  },

  // §7 Payments & currency
  paymentMethods: { section: "Payments & currency", label: "Payment methods" },
  currencies: { section: "Payments & currency", label: "Currencies" },
  languages: { section: "Payments & currency", label: "Languages" },

  // §8 Marketing
  trafficSources: { section: "Marketing", label: "Current traffic sources" },
  paidSpend: { section: "Marketing", label: "Monthly paid marketing spend" },
  emailPlatform: { section: "Marketing", label: "Email marketing platform" },
  subscriberCount: { section: "Marketing", label: "Email subscriber count" },
  reviewPlatforms: { section: "Marketing", label: "Review platforms in use" },
  analyticsTools: { section: "Marketing", label: "Analytics tools in use" },
  currentConversion: {
    section: "Marketing",
    label: "Current conversion rate (rough %)",
  },

  // §9 Integrations
  accounting: {
    section: "Integrations required",
    label: "Accounting / invoicing",
  },
  erpOms: {
    section: "Integrations required",
    label: "ERP / OMS",
  },
  crm: { section: "Integrations required", label: "CRM" },
  searchProvider: {
    section: "Integrations required",
    label: "On-site search",
  },
  loyalty: {
    section: "Integrations required",
    label: "Loyalty / rewards",
  },
  subscriptions: {
    section: "Integrations required",
    label: "Subscriptions app",
  },
  otherIntegrations: {
    section: "Integrations required",
    label: "Anything else critical",
  },

  // §10 Creative
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
    label: "Competitors you respect",
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

  // §11 Content
  copyQuality: { section: "Content", label: "Current copy quality" },
  productPhotoQuality: {
    section: "Content",
    label: "Product photography quality",
  },
  lifestylePhoto: { section: "Content", label: "Lifestyle photography" },
  blogStrategy: {
    section: "Content",
    label: "Blog / content marketing plan",
  },
  contentMigration: { section: "Content", label: "Content migration needed?" },

  // §12 Compliance
  cookieBanner: {
    section: "Compliance & accessibility",
    label: "Cookie banner / consent mode",
  },
  gdprNotes: {
    section: "Compliance & accessibility",
    label: "GDPR-specific requirements",
  },
  ageVerification: {
    section: "Compliance & accessibility",
    label: "Age verification needed?",
  },
  wcagTarget: {
    section: "Compliance & accessibility",
    label: "Accessibility target",
  },
  legalDocs: {
    section: "Compliance & accessibility",
    label: "Privacy policy / T&Cs status",
  },

  // §13 Team
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
    label: "Team members contributing assets / content",
  },

  // §14 Anything else
  keptYouUp: {
    section: "Anything else",
    label: "What's kept you up at night about your current site?",
  },
  primaryGoal: {
    section: "Anything else",
    label: "#1 thing you want visitors to do",
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
  "Platform",
  "Products",
  "Orders & fulfilment",
  "Customers",
  "Payments & currency",
  "Marketing",
  "Integrations required",
  "Creative direction",
  "Content",
  "Compliance & accessibility",
  "Team & decision-making",
  "Anything else",
] as const;

const INITIAL = Object.keys(FIELD_MAP).reduce<Record<string, string | string[]>>(
  (acc, key) => {
    // Everything starts as empty string except a handful that are arrays
    acc[key] = "";
    return acc;
  },
  {},
);
// Multi-select fields start as [] so the type narrows correctly
const MULTI_KEYS = [
  "productTypes",
  "accountFeatures",
  "supportChannels",
  "paymentMethods",
  "trafficSources",
  "reviewPlatforms",
  "analyticsTools",
  "brandAssets",
  "vibe",
];
MULTI_KEYS.forEach((k) => (INITIAL[k] = []));

export function EcommerceBriefForm() {
  const { state, update, toggle, clear } = useLongFormState(
    "webgro:ecommerce-brief:v1",
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
      formType="ecommerce-brief"
      eyebrow="[ Webgro ] eCommerce kickoff"
      title="Let's get the store built."
      lead="Now that we're on, this is the brief that kicks the build off: the creative direction, integrations, content status, and the operational detail we'll design around. Fill what's relevant, skip what isn't."
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
          <TextInput label="Company name" value={s("companyName")} onChange={(v) => update("companyName", v)} />
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
          label="What the business does"
          value={s("businessDescription")}
          onChange={(v) => update("businessDescription", v)}
          rows={3}
          placeholder="Who you sell to, what you sell, what makes you different."
        />
        <TwoCol>
          <PillRadio
            label="How long trading"
            value={s("tradingSince")}
            onChange={(v) => update("tradingSince", v)}
            options={["Pre-launch", "< 1 year", "1–3 years", "3–5 years", "5–10 years", "10+ years"]}
          />
          <PillRadio
            label="Annual revenue range"
            value={s("revenueRange")}
            onChange={(v) => update("revenueRange", v)}
            options={["Pre-launch", "< £100k", "£100k–500k", "£500k–1M", "£1M–5M", "£5M–10M", "£10M+"]}
          />
        </TwoCol>
        <TextInput label="Team size" value={s("teamSize")} onChange={(v) => update("teamSize", v)} placeholder="e.g. 3 full-time, 2 freelance" />
      </FormSection>

      {/* §2 Scope */}
      <FormSection num="02" title="Project scope" intro="Confirming what we agreed, and what success looks like six months after go-live.">
        <PillRadio
          label="Confirm what we're building"
          value={s("projectType")}
          onChange={(v) => update("projectType", v)}
          options={[
            "New store from scratch",
            "Replatform",
            "Redesign on same platform",
            "Extending a current store",
          ]}
        />
        <TextArea
          label="Why now? What's driving this project?"
          value={s("whyNow")}
          onChange={(v) => update("whyNow", v)}
          rows={3}
        />
        <TextInput
          label="Launch deadline (if any)"
          value={s("launchDate")}
          onChange={(v) => update("launchDate", v)}
          placeholder="e.g. by Black Friday, Q3 2026, flexible"
        />
        <TextArea
          label="What does success look like?"
          value={s("successMetrics")}
          onChange={(v) => update("successMetrics", v)}
          rows={3}
          help="Three specific outcomes you'd celebrate six months after launch."
        />
        <PillRadio
          label="Ongoing retainer appetite (post-launch)"
          value={s("retainerBudget")}
          onChange={(v) => update("retainerBudget", v)}
          help="Optional. Helps us shape what we propose for ongoing care after go-live."
          options={[
            "Not decided yet",
            "< £500 / month",
            "£500–1k / month",
            "£1–2.5k / month",
            "£2.5–5k / month",
            "£5k+ / month",
          ]}
        />
      </FormSection>

      {/* §3 Platform */}
      <FormSection num="03" title="Platform">
        <PillRadio
          label="Preferred platform"
          value={s("platformPreference")}
          onChange={(v) => update("platformPreference", v)}
          options={[
            "Shopify",
            "Shopify Plus",
            "WooCommerce",
            "Magento",
            "BigCommerce",
            "Other",
            "Not sure, recommend one",
          ]}
        />
        <TextInput
          label="Current platform (if replatforming)"
          value={s("currentPlatform")}
          onChange={(v) => update("currentPlatform", v)}
        />
        <TextArea
          label="Why that platform, or why you're unsure"
          value={s("platformReasoning")}
          onChange={(v) => update("platformReasoning", v)}
          rows={3}
        />
      </FormSection>

      {/* §4 Products */}
      <FormSection num="04" title="Products">
        <PillRadio
          label="Product count"
          value={s("productCount")}
          onChange={(v) => update("productCount", v)}
          options={["1–10", "11–50", "51–200", "201–1000", "1000+", "Growing fast"]}
        />
        <PillMulti
          label="Product types"
          values={a("productTypes")}
          onToggle={(opt) => toggle("productTypes", opt)}
          options={[
            "Physical goods",
            "Digital downloads",
            "Services",
            "Subscription",
            "Gift cards",
            "Custom / made-to-order",
          ]}
        />
        <TextArea
          label="Variants / configuration complexity"
          value={s("variantsComplexity")}
          onChange={(v) => update("variantsComplexity", v)}
          rows={3}
          placeholder="e.g. size + colour; fully custom configurators; bundles with per-line pricing."
        />
        <YesNo
          label="Do you offer bundles or kits?"
          value={yn("bundles")}
          onChange={(v) => update("bundles", v)}
        />
        <PillRadio
          label="Stock management"
          value={s("stockManagement")}
          onChange={(v) => update("stockManagement", v)}
          options={[
            "Manual / spreadsheet",
            "Shopify native",
            "WooCommerce native",
            "ERP (NetSuite, SAP, etc.)",
            "WMS",
            "Other",
          ]}
        />
        <TextInput
          label="How often do products change?"
          value={s("productChurn")}
          onChange={(v) => update("productChurn", v)}
          placeholder="e.g. a drop every 6 weeks; seasonal; static catalogue"
        />
      </FormSection>

      {/* §5 Orders */}
      <FormSection num="05" title="Orders & fulfilment">
        <TwoCol>
          <TextInput
            label="Expected orders / month at launch"
            value={s("ordersLaunch")}
            onChange={(v) => update("ordersLaunch", v)}
          />
          <TextInput
            label="Expected orders / month in 12 months"
            value={s("orders12m")}
            onChange={(v) => update("orders12m", v)}
          />
        </TwoCol>
        <TextInput label="Average order value" value={s("aov")} onChange={(v) => update("aov", v)} placeholder="e.g. £45" />
        <PillRadio
          label="Fulfilment"
          value={s("fulfilment")}
          onChange={(v) => update("fulfilment", v)}
          options={["In-house", "3PL", "Dropship", "Print-on-demand", "Mix"]}
        />
        <PillRadio
          label="Shipping zones"
          value={s("shippingZones")}
          onChange={(v) => update("shippingZones", v)}
          options={["UK only", "UK + EU", "UK + US", "Worldwide"]}
        />
        <TextInput label="Shipping carriers" value={s("carriers")} onChange={(v) => update("carriers", v)} placeholder="e.g. Royal Mail, DPD, FedEx" />
        <PillRadio
          label="How shipping is priced"
          value={s("shippingCalc")}
          onChange={(v) => update("shippingCalc", v)}
          options={[
            "Free shipping",
            "Free over £X",
            "Flat rate",
            "By weight",
            "By zone",
            "Live carrier rates",
          ]}
        />
        <TextInput
          label="Delivery promise / cut-off"
          value={s("deliveryPromise")}
          onChange={(v) => update("deliveryPromise", v)}
          placeholder={'e.g. "Order by 2pm for next-day dispatch"'}
        />
        <TextArea
          label="Returns policy summary"
          value={s("returnsPolicy")}
          onChange={(v) => update("returnsPolicy", v)}
          rows={3}
          help="How long, who pays, restocking fees."
        />
      </FormSection>

      {/* §6 Customers */}
      <FormSection num="06" title="Customers">
        <PillRadio
          label="Primary customer type"
          value={s("customerType")}
          onChange={(v) => update("customerType", v)}
          options={["B2C / DTC", "B2B", "Wholesale", "Mixed B2B + B2C"]}
        />
        <TextArea
          label="Target customer personas"
          value={s("personas")}
          onChange={(v) => update("personas", v)}
          rows={4}
          help="Short descriptions. Age, context, why they buy."
        />
        <PillMulti
          label="Customer account features needed"
          values={a("accountFeatures")}
          onToggle={(opt) => toggle("accountFeatures", opt)}
          options={[
            "Logged-in ordering",
            "Wishlists",
            "Order history",
            "Loyalty / rewards",
            "VIP pricing",
            "Wholesale tiered pricing",
            "Saved addresses / payment methods",
            "Subscriptions management",
          ]}
        />
        <PillMulti
          label="Customer support channels"
          values={a("supportChannels")}
          onToggle={(opt) => toggle("supportChannels", opt)}
          options={["Email", "Live chat", "Phone", "FAQ / help centre", "WhatsApp", "Social DM"]}
        />
      </FormSection>

      {/* §7 Payments & currency */}
      <FormSection num="07" title="Payments & currency">
        <PillMulti
          label="Payment methods"
          values={a("paymentMethods")}
          onToggle={(opt) => toggle("paymentMethods", opt)}
          options={[
            "Card (Visa/Mastercard)",
            "Apple Pay",
            "Google Pay",
            "PayPal",
            "Klarna",
            "Clearpay",
            "Shop Pay",
            "Bank transfer",
            "Invoice / account",
          ]}
        />
        <TextInput label="Currencies" value={s("currencies")} onChange={(v) => update("currencies", v)} placeholder="e.g. GBP only; GBP + EUR + USD" />
        <TextInput label="Languages" value={s("languages")} onChange={(v) => update("languages", v)} placeholder="e.g. English only; EN + FR + DE" />
      </FormSection>

      {/* §8 Marketing */}
      <FormSection num="08" title="Marketing">
        <PillMulti
          label="Current traffic sources"
          values={a("trafficSources")}
          onToggle={(opt) => toggle("trafficSources", opt)}
          options={[
            "Organic search",
            "Paid Google",
            "Paid Meta",
            "Paid TikTok",
            "Email",
            "Direct",
            "Referral",
            "Social organic",
            "Influencer",
            "Affiliate",
          ]}
        />
        <TextInput
          label="Monthly paid marketing spend"
          value={s("paidSpend")}
          onChange={(v) => update("paidSpend", v)}
          placeholder="e.g. £10k / month blended"
        />
        <TwoCol>
          <PillRadio
            label="Email marketing platform"
            value={s("emailPlatform")}
            onChange={(v) => update("emailPlatform", v)}
            options={["Klaviyo", "Mailchimp", "ActiveCampaign", "Hubspot", "Omnisend", "Other", "None"]}
          />
          <TextInput
            label="Email subscriber count"
            value={s("subscriberCount")}
            onChange={(v) => update("subscriberCount", v)}
          />
        </TwoCol>
        <PillMulti
          label="Review platforms in use"
          values={a("reviewPlatforms")}
          onToggle={(opt) => toggle("reviewPlatforms", opt)}
          options={["Trustpilot", "Reviews.io", "Yotpo", "Judge.me", "Google Reviews", "None"]}
        />
        <PillMulti
          label="Analytics tools in use"
          values={a("analyticsTools")}
          onToggle={(opt) => toggle("analyticsTools", opt)}
          options={["GA4", "Hotjar", "Lucky Orange", "Microsoft Clarity", "Fullstory", "None"]}
        />
        <TextInput
          label="Current conversion rate (rough %)"
          value={s("currentConversion")}
          onChange={(v) => update("currentConversion", v)}
          placeholder="e.g. 1.8%"
        />
      </FormSection>

      {/* §9 Integrations */}
      <FormSection num="09" title="Integrations required" intro="Anything the site needs to talk to. Skip any line that's not relevant.">
        <TwoCol>
          <TextInput label="Accounting / invoicing" value={s("accounting")} onChange={(v) => update("accounting", v)} placeholder="Xero / QuickBooks / Sage" />
          <TextInput label="ERP / OMS" value={s("erpOms")} onChange={(v) => update("erpOms", v)} placeholder="NetSuite / Brightpearl / custom" />
        </TwoCol>
        <TwoCol>
          <TextInput label="CRM" value={s("crm")} onChange={(v) => update("crm", v)} placeholder="Hubspot / Salesforce / Pipedrive" />
          <TextInput label="On-site search" value={s("searchProvider")} onChange={(v) => update("searchProvider", v)} placeholder="Algolia / Klevu / native" />
        </TwoCol>
        <TwoCol>
          <TextInput label="Loyalty / rewards" value={s("loyalty")} onChange={(v) => update("loyalty", v)} placeholder="Smile.io / LoyaltyLion / custom" />
          <TextInput label="Subscriptions app" value={s("subscriptions")} onChange={(v) => update("subscriptions", v)} placeholder="Recharge / Appstle / Bold" />
        </TwoCol>
        <TextArea
          label="Anything else critical"
          value={s("otherIntegrations")}
          onChange={(v) => update("otherIntegrations", v)}
          rows={3}
          placeholder="Any other integrations the build must have to ship."
        />
      </FormSection>

      {/* §10 Creative */}
      <FormSection num="10" title="Creative direction" intro="Tell us the brand you want, not just the brand you are.">
        <PillMulti
          label="Brand assets available"
          values={a("brandAssets")}
          onToggle={(opt) => toggle("brandAssets", opt)}
          options={[
            "Logo",
            "Brand guidelines",
            "Colour palette",
            "Fonts / typography",
            "Product photography",
            "Lifestyle photography",
            "Icon set",
            "Motion / video",
          ]}
        />
        <TextInput
          label="Brand guidelines URL (if shareable)"
          type="url"
          value={s("brandGuidelinesUrl")}
          onChange={(v) => update("brandGuidelinesUrl", v)}
          placeholder="Google Drive / Notion / Figma"
        />
        <TextArea
          label="Websites you love (with why)"
          value={s("sitesYouLove")}
          onChange={(v) => update("sitesYouLove", v)}
          rows={5}
          help="3–5 URLs, and one line each on what you love about them."
        />
        <TextArea
          label="Competitors you respect"
          value={s("respectedCompetitors")}
          onChange={(v) => update("respectedCompetitors", v)}
          rows={3}
          help="Who in your space is doing it well, and where could you overtake them?"
        />
        <PillMulti
          label="Brand vibe"
          values={a("vibe")}
          onToggle={(opt) => toggle("vibe", opt)}
          options={[
            "Minimal",
            "Editorial",
            "Playful",
            "Premium / luxury",
            "Technical",
            "Bold",
            "Warm",
            "Clinical",
            "Craft / handmade",
            "Maximalist",
          ]}
        />
        <TextArea
          label="Hard no-gos in design"
          value={s("designNoGos")}
          onChange={(v) => update("designNoGos", v)}
          rows={3}
          placeholder="Colours, patterns, styles you never want to see."
        />
        <TwoCol>
          <TextInput label="Colour palette direction" value={s("colourDirection")} onChange={(v) => update("colourDirection", v)} />
          <TextInput label="Typography direction" value={s("typographyDirection")} onChange={(v) => update("typographyDirection", v)} />
        </TwoCol>
        <TextInput label="Photography style" value={s("photoStyle")} onChange={(v) => update("photoStyle", v)} placeholder="e.g. natural light, white cyc, studio, editorial" />
      </FormSection>

      {/* §11 Content */}
      <FormSection num="11" title="Content">
        <PillRadio
          label="Current copy quality"
          value={s("copyQuality")}
          onChange={(v) => update("copyQuality", v)}
          options={["Polished", "Usable but needs editing", "Needs rewriting", "Doesn't exist yet"]}
        />
        <PillRadio
          label="Product photography quality"
          value={s("productPhotoQuality")}
          onChange={(v) => update("productPhotoQuality", v)}
          options={[
            "Professional and consistent",
            "Decent phone shots",
            "Mixed quality",
            "Needs shooting from scratch",
          ]}
        />
        <YesNo
          label="Do you have lifestyle photography?"
          value={yn("lifestylePhoto")}
          onChange={(v) => update("lifestylePhoto", v)}
        />
        <PillRadio
          label="Blog / content marketing"
          value={s("blogStrategy")}
          onChange={(v) => update("blogStrategy", v)}
          options={[
            "Already in-house",
            "We need help with it",
            "Not a priority",
            "Unsure",
          ]}
        />
        <YesNo
          label="Content migration needed from an old site?"
          value={yn("contentMigration")}
          onChange={(v) => update("contentMigration", v)}
        />
      </FormSection>

      {/* §12 Compliance */}
      <FormSection num="12" title="Compliance & accessibility">
        <TextInput
          label="Cookie banner / consent mode"
          value={s("cookieBanner")}
          onChange={(v) => update("cookieBanner", v)}
          placeholder="Google Consent Mode v2 / Cookiebot / custom / none"
        />
        <TextArea
          label="Any GDPR-specific requirements"
          value={s("gdprNotes")}
          onChange={(v) => update("gdprNotes", v)}
          rows={3}
        />
        <YesNo
          label="Age verification needed?"
          value={yn("ageVerification")}
          onChange={(v) => update("ageVerification", v)}
        />
        <PillRadio
          label="Accessibility target"
          value={s("wcagTarget")}
          onChange={(v) => update("wcagTarget", v)}
          options={["WCAG 2.2 AA", "WCAG 2.2 AAA", "None specified"]}
        />
        <PillRadio
          label="Privacy policy / T&Cs status"
          value={s("legalDocs")}
          onChange={(v) => update("legalDocs", v)}
          options={[
            "We have them",
            "We need them",
            "Our solicitors will provide",
          ]}
        />
      </FormSection>

      {/* §13 Team */}
      <FormSection num="13" title="Team & decision-making">
        <TextInput label="Primary decision-maker" value={s("decisionMaker")} onChange={(v) => update("decisionMaker", v)} />
        <TextArea label="Others who need to approve designs" value={s("approvers")} onChange={(v) => update("approvers", v)} rows={2} />
        <TextArea label="Team members contributing assets / content" value={s("contributors")} onChange={(v) => update("contributors", v)} rows={2} />
      </FormSection>

      {/* §14 Anything else */}
      <FormSection num="14" title="Anything else">
        <TextArea label="What's kept you up at night about your current site?" value={s("keptYouUp")} onChange={(v) => update("keptYouUp", v)} rows={3} />
        <TextInput label="#1 thing you want visitors to do" value={s("primaryGoal")} onChange={(v) => update("primaryGoal", v)} />
        <TextArea label="Anything you're worried about with this project" value={s("concerns")} onChange={(v) => update("concerns", v)} rows={3} />
        <TextArea label="Anything else we should know" value={s("misc")} onChange={(v) => update("misc", v)} rows={4} />
      </FormSection>
    </LongFormLayout>
  );
}
