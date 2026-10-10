import type { BespokeMockName } from "@/components/mockups/bespoke";

/**
 * The four pieces of software on the Bespoke Software page. Facts come from
 * the research briefs written from each tool's own code. The savings figures
 * were supplied by the owner. The fuller account of the Fun Cases hub and the
 * ANYPRINT quote desk is in their case studies (src/content/work.ts).
 */

export type Software = {
  id: string;
  mock: BespokeMockName;
  label: string;
  title: string;
  body: string[];
  points: string[];
  link?: { label: string; path: string };
};

export const software: Software[] = [
  {
    id: "fun-cases-hub",
    mock: "fc-stock-planning",
    label: "Fun Cases",
    title: "Ten tools behind one login",
    body: [
      "Fun Cases sell phone cases online and print them in their own workshop. The hub is the software they run the business on, from stock coming in to customer service after the sale. It saves them about 20 hours of work a day, worth more than £30,000 a year.",
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

/* ── What the software connects to ──────────────────────────────────────── */

/**
 * Systems we have connected software to, grouped by kind. Every name here
 * appears as a working integration in the research briefs. Names only: no
 * third-party logos.
 */
export const connections: Array<{ group: string; items: string[] }> = [
  { group: "Shops and sites", items: ["Shopify", "WordPress"] },
  { group: "Accounts and payments", items: ["Xero", "GoCardless", "Stripe"] },
  { group: "Shipping and printing", items: ["Royal Mail Click & Drop", "PrintNode", "Label and document printers", "Barcode scanners"] },
  { group: "Email and marketing", items: ["Klaviyo", "Gmail", "Transactional email"] },
  { group: "Social", items: ["Instagram", "Facebook", "LinkedIn"] },
  { group: "Reviews and loyalty", items: ["Judge.me"] },
  { group: "Analytics", items: ["Google Analytics", "Google Search Console", "Google PageSpeed"] },
  { group: "AI models", items: ["Claude", "Gemini"] },
  { group: "Spreadsheets and files", items: ["Google Sheets", "Google Drive", "CSV files", "PDF documents"] },
];
