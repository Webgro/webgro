import type { ScreenName } from "./Screen";

/**
 * The four pieces of software on the Bespoke Software page. Facts come from
 * the research briefs written from each tool's own code. The savings figures
 * were supplied by the owner. The fuller account of the Fun Cases software and the
 * ANYPRINT quote desk is in their case studies (src/content/work.ts).
 */

export type Software = {
  id: string;
  mock: ScreenName;
  label: string;
  title: string;
  body: string[];
  points: string[];
  link?: { label: string; path: string };
};

export const software: Software[] = [
  {
    id: "fun-cases-software",
    mock: "fc-stock-planning",
    label: "Fun Cases",
    title: "Ten tools behind one login",
    body: [
      "Fun Cases sell phone cases online and print them in their own workshop. We built the software they run the business on, from stock coming in to customer service after the sale. It saves them about 20 hours of work a day, worth more than £30,000 a year.",
      "The stock overview is shown here as an example screen, redrawn with sample data.",
    ],
    points: [
      "Stock management, warehouse management on handheld scanners, and stock forecasting that shows every number it used.",
      "Shipping labels created through Royal Mail Click & Drop from a scan at the packing bench, and print runs started with one button for each group of orders.",
      "A returns portal for customers, with scan screens for the staff who receive the parcels.",
      "Content and social scheduling, an artwork resizer and product generation.",
      "A helpdesk that replaced Freshdesk, with the Shopify order beside every ticket.",
    ],
    link: { label: "Read the Fun Cases case study", path: "/work/fun-cases" },
  },
  {
    id: "twisted-tailor-helpdesk",
    mock: "tt-helpdesk",
    label: "Twisted Tailor",
    title: "AI support that works inside their helpdesk",
    body: [
      "Twisted Tailor's support team kept the helpdesk they already used. When a ticket comes in, the assistant reads the thread, looks up the customer's orders in Shopify and any return in progress, and drafts a reply from a knowledge base the team edits. It halved their support hours.",
      "The draft goes into a review queue, shown here as an example screen, redrawn with sample data. A member of the team approves it before it's sent.",
    ],
    points: [
      "It only states facts found in the knowledge base or the order data, and passes the ticket to a person when it's unsure.",
      "Every reply says it comes from an AI assistant.",
      "Once a member of staff replies on a ticket, the assistant stops answering it.",
    ],
    link: { label: "Read the Twisted Tailor case study", path: "/work/twisted-tailor" },
  },
  {
    id: "anyprint-quote-desk",
    mock: "anyprint-quotes",
    label: "ANYPRINT",
    title: "A quote desk, from enquiry to paid job",
    body: [
      "An emailed enquiry becomes a draft quote. Claude reads the email and pulls out the customer, the reference and the items. Staff price it and send a branded PDF quote with a link to accept it online. The quote desk saves the team 8 hours a week.",
      "The board is shown here as an example screen, redrawn with sample data. It has a column for quotes to write, quotes waiting on information, quotes sent and quotes lost.",
    ],
    points: [
      "Quotes that were opened but not answered are chased on day 3 and day 7, on weekdays between 9am and 5pm, and closed after 10 days.",
      "The customer accepts online: they choose a quantity and turnaround, enter their details, upload artwork and agree the terms.",
      "Acceptance raises an invoice in Xero and emails it. Payment status is checked every hour.",
      "An accepted quote becomes a job on a second board, and artwork proofs are approved by the customer online.",
    ],
    link: { label: "Read the ANYPRINT case study", path: "/work/anyprint" },
  },
  {
    id: "webgro-portal",
    mock: "webgro-portal",
    label: "Webgro",
    title: "The portal we run our own client work on",
    body: [
      "Our clients sign in with an emailed link to see their reports, project progress, the work we've done, proposals and invoices. We run the studio from the admin side of the same system.",
      "The admin overview is shown here as an example screen, redrawn with sample data.",
    ],
    points: [
      "Recurring billing: a draft invoice appears on each client's billing day. Once we approve it, it's created in Xero, emailed and collected by Direct Debit or card. Nothing is sent or charged without approval.",
      "Proposals are sent by link and accepted online, and the acceptance is kept as a signed PDF with the terms that applied.",
      "An accepted build becomes a project with stages, client tasks and payment milestones.",
      "WordPress maintenance: weekly updates with before and after screenshots compared, uptime checks every 15 minutes, and SSL and plugin vulnerability checks.",
    ],
  },
];

/* ── Custom Shopify apps ────────────────────────────────────────────────── */

/**
 * Facts from the apps and plugins brief. Its "sensitive" notes apply: no
 * programme numbers, no pricing or limits detail, nothing about how the two
 * pet shops are related, and the try-on app is in beta.
 */
export const shopifyApps: Software[] = [
  {
    id: "case-club",
    mock: "case-club",
    label: "Fun Cases",
    title: "Case Club, a loyalty app",
    body: [
      "Case Club is Fun Cases' loyalty scheme, built as a custom Shopify app. Shoppers earn coins on every paid order, and for reviews, follows, birthdays and referring a friend. They cash coins in for a one-time discount code from their account. It replaced Smile.io.",
      "The picture is an example screen, redrawn with sample data.",
    ],
    points: [
      "Refunds and cancelled orders take the coins back.",
      "Staff run the scheme from screens inside the Shopify admin: members, prizes, campaigns, scheduled popups, referrals and analytics.",
      "There are six kinds of campaign, including double-coin weekends and bonus coins on a collection.",
      "It connects to Klaviyo and to Judge.me for product reviews. Balances from the old scheme were imported at launch.",
    ],
    link: { label: "Read the Fun Cases case study", path: "/work/fun-cases" },
  },
  {
    id: "stock-sync",
    mock: "pw-vp-bridge",
    label: "ValuePet",
    title: "Two pet shops kept in step",
    body: [
      "A sync service that keeps products and stock in step between two pet shops on Shopify. When a product changes on the first shop, the second is updated, and stock levels are kept the same on both.",
      "The description review is shown as an example screen, redrawn with sample data.",
    ],
    points: [
      "Each product description is rewritten once by Claude in the second shop's voice. A person approves every draft before it's published.",
      "For products already on both shops, only real differences are sent, so the second shop's own settings are left alone.",
      "Nothing is written until a switch is turned on. With it off, the service logs what it would have sent. Stock syncing has its own switch.",
      "The whole catalogue is compared several times a day, as a check that nothing was missed.",
    ],
    link: { label: "Read the ValuePet case study", path: "/work/valuepet" },
  },
  {
    id: "try-on",
    mock: "tt-tryon",
    label: "Twisted Tailor, in beta",
    title: "Try it on with AI",
    body: [
      "A shopper uploads a full-length photo on a product page and sees themselves wearing the garment, usually in 20 to 40 seconds. The app is in beta testing with Twisted Tailor and isn't yet available to all shoppers.",
      "The picture is an example screen, redrawn with sample data.",
    ],
    points: [
      "The shopper's photo isn't stored. The try-on image is kept for 7 days, then deleted.",
      "Every image is checked by a second AI model before the shopper sees it, and images that fail are held back.",
      "Results are labelled as an AI preview and carry the brand's watermark.",
      "Staff see the results, the quality checks and a funnel from the button to an order, inside the Shopify admin. Fair-use limits apply to each shopper.",
    ],
    link: { label: "Read the Twisted Tailor case study", path: "/work/twisted-tailor" },
  },
];

/* ── Custom WordPress plugins ───────────────────────────────────────────── */

export const wordpressPlugins: Software[] = [
  {
    id: "catalogue-configurator",
    mock: "afx-configurator",
    label: "Architectural FX",
    title: "A product catalogue and configurator",
    body: [
      "Architectural FX keep their lighting catalogue in a Google Sheet and publish to the website from a menu in the sheet. One plugin holds the catalogue and runs the products page, the product pages and a configurator that produces spec sheets. It replaced three plugins.",
      "The configurator is shown as an example screen, redrawn with sample data.",
    ],
    points: [
      "Each update is signed, so the site only accepts changes that come from the sheet.",
      "The products page can be filtered nine ways, including colour temperature, wattage and IP rating.",
      "In the configurator, options that don't go with an earlier choice are greyed out, and the product code builds as options are picked.",
      "The specifier adds their project details and downloads a PDF spec sheet, or asks for a quote.",
    ],
    link: { label: "Read the Architectural FX case study", path: "/work/architectural-fx" },
  },
  {
    id: "identity-checks",
    mock: "equivo-kyc",
    label: "Equivo, in testing",
    title: "Identity checks from an instruction form",
    body: [
      "A plugin that connects Equivo's online instruction forms to LexisNexis for identity and anti-money-laundering checks. When a client submits a form, it confirms straight away and the checks run in the background. It replaces a paper-and-email process, and is in testing ahead of launch.",
      "The picture is an example screen, redrawn with sample data.",
    ],
    points: [
      "Where an ID document and face check is needed, the client gets a secure link and completes it on their phone in a couple of minutes.",
      "The firm's team get a branded PDF report by email for every submission.",
      "A failed check never blocks an instruction. It's flagged to the team to review.",
      "Returning clients don't repeat the ID and face check every time. Risk screening still runs on every instruction.",
    ],
  },
];

/* ── What the software can connect to ───────────────────────────────────── */

/**
 * Systems bespoke software can connect to, grouped by kind. This is one list:
 * some of these we have built against and some we have not, and the page does
 * not say which. So the copy around it must only ever say what the software
 * CAN connect to, never what we have connected. Every name is a current
 * product with a public API or a documented import and export. Names only: no
 * third-party logos.
 */
export const connections: Array<{ group: string; items: string[] }> = [
  { group: "Shops and marketplaces", items: ["Shopify", "WooCommerce", "WordPress", "BigCommerce", "Adobe Commerce (Magento)", "Squarespace", "Amazon", "eBay", "Etsy", "TikTok Shop"] },
  { group: "Accounting and payments", items: ["Xero", "Sage", "QuickBooks", "FreeAgent", "Zoho Books", "KashFlow", "Stripe", "PayPal", "GoCardless", "Klarna", "Clearpay", "Square", "SumUp", "Worldpay", "Adyen"] },
  { group: "Stock, orders and ERP", items: ["Linnworks", "Brightpearl", "Veeqo", "Cin7", "Unleashed", "Odoo", "NetSuite", "Microsoft Dynamics 365", "SAP Business One"] },
  { group: "Couriers, shipping and printing", items: ["Royal Mail Click & Drop", "DPD", "Evri", "DHL", "UPS", "FedEx", "Parcelforce", "ShipStation", "Sendcloud", "Shippo", "PrintNode", "Label and document printers", "Barcode scanners"] },
  { group: "CRM and sales", items: ["HubSpot", "Salesforce", "Pipedrive", "Zoho CRM"] },
  { group: "Email and SMS", items: ["Klaviyo", "Mailchimp", "Gmail", "Brevo", "ActiveCampaign", "SendGrid", "Postmark", "Mailgun", "Twilio", "WhatsApp Business"] },
  { group: "Customer service", items: ["Zendesk", "Freshdesk", "Gorgias", "Intercom", "Help Scout"] },
  { group: "Reviews and loyalty", items: ["Trustpilot", "Judge.me", "Reviews.io", "Yotpo", "Feefo", "Google Business Profile"] },
  { group: "Social and video", items: ["Instagram", "Facebook", "LinkedIn", "TikTok", "YouTube"] },
  { group: "Analytics and advertising", items: ["Google Analytics", "Google Search Console", "Google Ads", "Meta Ads", "Microsoft Advertising", "Google Merchant Center", "Google PageSpeed"] },
  { group: "Work and communication", items: ["Slack", "Microsoft Teams", "Trello", "Asana", "monday.com", "Notion", "Airtable", "Jira"] },
  { group: "Office and files", items: ["Microsoft 365", "Google Workspace", "Excel", "Google Sheets", "Google Drive", "SharePoint", "OneDrive", "Dropbox", "CSV files", "PDF documents"] },
  { group: "Bookings and forms", items: ["Calendly", "Typeform", "Jotform", "Gravity Forms"] },
  { group: "Documents and signing", items: ["DocuSign", "Adobe Acrobat Sign", "Dropbox Sign"] },
  { group: "Automation platforms", items: ["Zapier", "Make"] },
  { group: "AI models", items: ["Claude", "OpenAI", "Gemini"] },
  { group: "People", items: ["BambooHR"] },
];
