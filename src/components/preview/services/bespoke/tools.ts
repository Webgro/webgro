import type { BespokeMockName } from "@/components/mockups/bespoke";

/**
 * Copy for the Bespoke Software showcase and the ten Fun Cases tool pages.
 * Every fact comes from the two research briefs written from the tools' own
 * code. Nothing here states a saving, a volume or a result, because the code
 * and docs state none.
 */

export const BESPOKE_PATH = "/services/bespoke-software";

/** The price, worded the same way everywhere it appears. */
export const BESPOKE_PRICE =
  "Bespoke software starts from £3,000, plus a monthly charge for servers, storage and maintenance that depends on the build.";

/** Sits in the body copy beside every redrawn screen. */
export const SCREEN_NOTE = "an example screen, redrawn with sample data";

export type ToolStep = { name: string; body: string };
export type ToolLink = { name: string; body: string };

export type BespokeTool = {
  slug: string;
  /** Short name, used in lists, breadcrumbs and the previous and next links. */
  name: string;
  mock: BespokeMockName;
  /** One line for the card on the service page. */
  card: string;
  /** The page heading, as lines, with one phrase brushed. */
  title: string[];
  brush: string;
  intro: string;
  /** What it does, in paragraphs. */
  does: string[];
  users: string;
  /** Only where the tool's own docs say what it took over from. */
  replaced?: string;
  steps: ToolStep[];
  connects: ToolLink[];
  /** Extra screens or rules worth listing, where the brief has them. */
  also?: { heading: string; items: string[] };
  meta: { title: string; description: string };
};

export const bespokeTools: BespokeTool[] = [
  {
    slug: "stock-management",
    name: "Stock management",
    mock: "fc-stock-planning",
    card: "Stock levels, stock on order, out-of-stock tracking and every purchase order.",
    title: ["Stock", "management"],
    brush: "management",
    intro:
      "The planning side of the Fun Cases hub. It shows what's in stock, what's on order and what has run out, and it holds every purchase order.",
    does: [
      "The planning screens read the warehouse records directly. There's no copy of the data and no sync to wait for, so the buyer sees the same figures the scanners write.",
      "The overview shows the number of SKUs, units in stock, stock value at cost, how many lines are low or out of stock, the latest stock movements and the top movers of the last 7 days. A SKU counts as low when one pack or less is left.",
      "Purchase orders are kept here and nowhere else. An order that hasn't arrived yet shows as stock on order on every other screen.",
    ],
    users: "The buyer and the owner. The planning screens are open to admins only.",
    steps: [
      { name: "Check the overview", body: "Totals, low and out-of-stock counts, stock value at cost and recent movements are on one screen." },
      { name: "Plan by SKU", body: "A searchable list shows each SKU's stock, stock on order, picks in the last 30 days, days out of stock and which SKU replaced which. It filters by supplier, product type and stock status." },
      { name: "Raise a purchase order", body: "An order can be written by hand, imported from a CSV file with a preview before it's saved, or generated from the stock forecast." },
      { name: "Receive or cancel it", body: "Marking an order as received or cancelled takes it out of the inbound figures. Any order can be exported as a CSV file." },
      { name: "Check the history", body: "The movement report is a log of every stock movement, filtered by SKU, action, person and date. Out-of-stock days are worked out from the same log." },
    ],
    connects: [
      { name: "The warehouse system", body: "Stock, locations and movements are read live from the scanner system in the same hub." },
      { name: "Stock forecasting", body: "The forecast writes its purchase orders here, and reads outstanding orders back as stock on order." },
      { name: "The case printing machines", body: "Stock loaded in the workshop's printing machines, and their print counts, are read from the machines." },
    ],
    meta: {
      title: "Bespoke Stock Management Software: Fun Cases Hub | Webgro",
      description:
        "A bespoke stock management tool: live stock levels, stock on order, out-of-stock tracking and purchase orders, read straight from the warehouse records.",
    },
  },
  {
    slug: "warehouse-management",
    name: "Warehouse management",
    mock: "fc-warehouse",
    card: "Booking in, moving, picking and counting stock on handheld scanners.",
    title: ["Warehouse", "management"],
    brush: "Warehouse",
    intro:
      "The warehouse system in the Fun Cases hub. Staff scan barcodes and QR codes on handheld scanners, and every scan records a stock movement and updates the stock held at each location.",
    does: [
      "The scanner screens cover booking stock in, moving it, finding it, picking orders, adjusting stock and stock takes. Each job is a short run of scans. Booking in is three: the SKU, the location and the quantity.",
      "Every scan is saved on the device before it's sent, and sent again if the connection drops. Each one carries its own key, so the server can't count it twice.",
      "Office screens hold the SKUs, locations, inventory and movement history, with CSV import and export and printable QR labels. Timekeeping is built in: clocking in and out, breaks and overtime, and a points score for picks, book-ins, moves and stock takes.",
    ],
    users:
      "Warehouse staff, who use it all day on rugged Android phones with barcode scanners. The scan screens are designed for a screen 360 to 400 pixels wide, with large buttons. Admins use the reports and settings.",
    replaced:
      "The warehouse system moved into the hub from an earlier custom app. Every record kept its original ID, so the QR codes already on shelves and boxes carried on working and the stock history came across with them.",
    steps: [
      { name: "Scan the order or SKU", body: "A pick starts with the order number. A book-in starts with the SKU barcode." },
      { name: "Scan the location", body: "Each shelf and picking box has its own QR code. Scanning it confirms where the stock is going to or coming from." },
      { name: "Confirm", body: "A pick is finished by scanning the picking box. A book-in asks for the quantity, which starts filled in with the pack size." },
      { name: "The movement is recorded", body: "Each stock change is written in one database transaction with the stock rows locked, so two scanners can't change the same stock at the same moment." },
      { name: "Background jobs run", body: "A low-stock check runs every hour and a backup every night, kept for 14 days. A stock movement email goes out each week and a stock value email each month." },
    ],
    connects: [
      { name: "Shopify", body: "A note is added to the Shopify order when it's picked, pressed and packed." },
      { name: "Barcode scanners", body: "The scanners type into the page like a keyboard, and the phone's camera can read a QR code as a fallback." },
      { name: "Label printing", body: "QR labels for SKUs and locations are made as PDFs at 50 × 25mm." },
      { name: "Email", body: "The weekly stock movement report and the monthly stock value report are sent by email." },
    ],
    meta: {
      title: "Warehouse Management System: Fun Cases Example | Webgro",
      description:
        "A bespoke warehouse system used on handheld scanners: book in, move, pick and count stock, with every scan saved on the device before it's sent.",
    },
  },
  {
    slug: "stock-forecasting",
    name: "Stock forecasting",
    mock: "fc-forecast",
    card: "Works out what to order from each supplier, with every number in the calculation shown.",
    title: ["Stock", "forecasting"],
    brush: "forecasting",
    intro:
      "The forecast works out what to order from each supplier and how much. It's a statistical calculation based on the last 30 days of stock leaving the warehouse, and it shows every number it used.",
    does: [
      "The buyer picks a supplier, a delivery date and how many days of cover they want. The hub returns a list of lines to order, and a second list of SKUs that don't need ordering with the reason for each.",
      "Seasonality is twelve monthly figures that the buyer enters by hand. The recommended quantity on any line can be changed before the order is created.",
      "A stock cover page runs the same calculation forward for 12 months and shows when each SKU will run out, counting deliveries that are due. A forecast accuracy page compares each forecast with what was used afterwards.",
    ],
    users: "The buyer or the owner, when raising a purchase order and when checking stock cover. It's open to admins only.",
    steps: [
      { name: "Choose supplier, delivery and cover", body: "The delivery date can be typed in, or set from that supplier's air or sea lead time. Days of cover defaults to 30." },
      { name: "Measure demand", body: "Demand is the units that left stock in the last 30 days: picks plus downward stock adjustments, read from the warehouse movement log." },
      { name: "Leave out one-offs", body: "A single adjustment of 50 units or more, or 25% or more of that SKU's demand, is treated as a one-off and left out. The buyer can tick any of them back in and recalculate." },
      { name: "Correct for stockouts", body: "If a SKU was out of stock for part of the 30 days, its daily rate is worked out over the days it was in stock. This needs at least 10 units and 7 in-stock days, and the increase is capped at three times." },
      { name: "Apply seasonality", body: "The twelve monthly figures are applied day by day across the period being covered." },
      { name: "Work out the need", body: "The need is the forecast for the cover period after delivery, less the stock in hand and on order, allowing for what will sell before the delivery arrives. A shortfall before arrival is reported separately." },
      { name: "Round to packs", body: "Quantities are rounded up to whole packs. Each line gets a confidence rating: high with 20 or more demand events in the 30 days, medium with 5 or more, and low below that." },
      { name: "Create the order", body: "Saving creates the purchase order and stores each line's forecast, so it can be scored against real usage later." },
    ],
    connects: [
      { name: "The warehouse movement log", body: "Demand, stock and out-of-stock days are all read live from the warehouse records." },
      { name: "Purchase orders", body: "Outstanding orders count as stock on order, and a generated order is saved straight into stock management." },
      { name: "The case printing machines", body: "For cases printed on the workshop's machines, usage is the higher of the machines' print counts and the stock loaded into them." },
    ],
    also: {
      heading: "How accuracy is measured",
      items: [
        "A forecast is scored once at least 7 days have passed since the order was generated.",
        "Days when the SKU was out of stock are removed from both the forecast and the usage.",
        "The page reports the median error and the bias, for all lines and for each supplier.",
      ],
    },
    meta: {
      title: "Stock Forecasting & Purchase Order Software Build | Webgro",
      description:
        "A bespoke stock forecasting tool: 30-day demand, an outlier rule, stockout correction and pack rounding, with every number shown before you order.",
    },
  },
  {
    slug: "shipping-labels",
    name: "Shipping labels",
    mock: "fc-shipping",
    card: "A packer scans an order. The Royal Mail label prints and tracking goes back to Shopify.",
    title: ["Shipping", "labels"],
    brush: "labels",
    intro:
      "A packer scans an order number at the bench. The hub creates the Royal Mail label through Click & Drop, prints it, and marks the order as fulfilled in Shopify with its tracking number.",
    does: [
      "The packing screen has one large scan box. After each scan it shows the service, the size, the weight and the tracking number, and confirms that the label went to the printer and the order was fulfilled in Shopify.",
      "A set of rules decides the size and service for each parcel, so the packer doesn't choose them. If something needs checking, the screen lists what and lets the packer override the size or service.",
      "Scanning an order that has already been dispatched never buys a second label. The screen shows when it was sent and by whom, with the options to reprint or void the label.",
    ],
    users: "Warehouse packers at the packing bench, with a barcode scanner. An admin maintains the rules.",
    steps: [
      { name: "Scan the order", body: "The packer chooses their name and a label printer once, then scans or types each order number." },
      { name: "The order is read from Shopify", body: "The hub reads the order's items, the shipping method chosen at checkout and the delivery country." },
      { name: "Rules decide the parcel", body: "The product type sets the format, Large Letter or Parcel, and a weight per item. The checkout shipping method sets Tracked 24 or Tracked 48. The country sets the region, the service and the customs lines." },
      { name: "The label is created", body: "The hub sends the order to Royal Mail Click & Drop and gets the label back in the same request. If Royal Mail refuses a size or a duty term, the hub retries and remembers what each service accepted." },
      { name: "The label prints", body: "The 102 × 152mm label goes straight to the bench label printer. If no printer is chosen, it downloads as a PDF." },
      { name: "Shopify is updated", body: "The order is fulfilled in Shopify with the tracking number and a tracking link, and the customer can be emailed." },
      { name: "The pack is logged", body: "The pack is credited to the packer and noted on the order." },
    ],
    connects: [
      { name: "Shopify", body: "Orders are read from Shopify and fulfilled there with tracking." },
      { name: "Royal Mail Click & Drop", body: "Labels are created through the Click & Drop API. Royal Mail is the only carrier." },
      { name: "Label printers", body: "Labels are sent to the bench printers through PrintNode." },
      { name: "The warehouse system", body: "Packer names come from the warehouse system, and packs count towards its points." },
    ],
    also: {
      heading: "Rules and reporting",
      items: [
        "The rules page holds the product types and their weights, the checkout shipping methods and the Royal Mail service for each region.",
        "The starting weights for each product type were worked out from 400 past orders.",
        "An analytics page reports orders, items and weight by service, size, destination and packer.",
      ],
    },
    meta: {
      title: "Royal Mail Shipping Label Software for Shopify | Webgro",
      description:
        "A bespoke packing bench tool: scan an order, create the Royal Mail label through Click & Drop, print it and write the tracking number back to Shopify.",
    },
  },
  {
    slug: "print-runs",
    name: "Print runs",
    mock: "fc-print-run",
    card: "One button per group of orders builds every sheet and sends it to the workshop printers.",
    title: ["Print", "runs"],
    brush: "runs",
    intro:
      "The hub sorts the open orders into groups. A print operator presses one button for a group, and the hub builds every sheet, sends them to the workshop printers and tags the orders in Shopify once the printer confirms.",
    does: [
      "It isn't unattended. Nothing prints when an order arrives. An operator starts each group, and everything after that press is automatic.",
      "For each order the hub builds a picking slip and the design sheets, on DL and A3, from the workshop's existing print templates. A batch is joined into one file per printer, with the slips and the designs in the same order so the two stacks match.",
      "A reprint screen prints any sheet again from a scanned picking slip or a typed order number. Staff can also print an order from inside Shopify admin.",
    ],
    users:
      "The print operator in the workshop, for the morning run. Anyone at a bench can use the reprint screen with a scanner. An admin manages the settings.",
    steps: [
      { name: "Orders are sorted", body: "The hub reads open, unfulfilled Shopify orders that haven't been printed and aren't on hold, and sorts them into groups such as next day, express and standard, oldest first." },
      { name: "The operator presses Print", body: "One button prints a whole group. A single order can be printed by typing its number." },
      { name: "The sheets are built", body: "Each order's picking slip and design sheets are made as PDFs at each sheet's own page size." },
      { name: "A printer is chosen", body: "For each kind of sheet the hub picks the online printer that will be free soonest. The operator can choose one instead." },
      { name: "The job is sent", body: "The files go to the workshop printers, and the screen checks progress every 5 seconds." },
      { name: "Shopify is tagged", body: "Once the picking slip is confirmed as printed, the order is tagged as printed in Shopify. A second print of the same sheet is refused unless it's marked as a reprint." },
      { name: "Problems are listed", body: "An order whose design couldn't be made is left out of the run and listed under Needs attention." },
    ],
    connects: [
      { name: "Shopify", body: "Open orders are read from Shopify, and printed orders are tagged there. A print action is added to Shopify admin." },
      { name: "The workshop printers", body: "Jobs are sent to the slip, DL and A3 printers through PrintNode." },
      { name: "The print templates", body: "The hub prints the workshop's existing templates as they are." },
    ],
    meta: {
      title: "Batch Order Printing Software: Fun Cases Example | Webgro",
      description:
        "A bespoke print run tool: an operator presses one button per group of orders, and every picking slip and design sheet is built, printed and tagged.",
    },
  },
  {
    slug: "returns",
    name: "Returns",
    mock: "fc-returns",
    card: "A returns portal for customers, and scan screens for the staff who receive the parcels.",
    title: ["Returns portal", "and returns desk"],
    brush: "returns desk",
    intro:
      "Customers book a return on a portal. Staff receive, check and refund it from the hub. Both sides work from the same returns records.",
    does: [
      "The customer enters an order number and delivery postcode, picks the items and a reason for each, and chooses how to settle it. They can keep the item for a partial refund, send it back with a Royal Mail label, or post it back themselves.",
      "The warehouse scans the parcel when it arrives, sees what should be inside and confirms or rejects it. Confirming refunds the quoted amount in Shopify and puts the stock back.",
      "Customer service work from a list of every return, with its status, method and refund, and a detail page with the full history.",
    ],
    users:
      "Customers, who book the return. Warehouse staff, who scan parcels in. Customer service and admins, who handle exceptions, reports and settings.",
    replaced: "The portal replaced an older returns page.",
    steps: [
      { name: "The customer finds the order", body: "The portal looks the order up in Shopify, checks it's inside the 30-day returns window and marks personalised items and free gifts as non-returnable." },
      { name: "They choose items and reasons", body: "Each item gets a quantity and a reason, such as wrong phone model, not as described, or arrived damaged." },
      { name: "They choose how to settle it", body: "Each option shows the amount they'll get back. Keeping the item refunds part of the price straight away. A Royal Mail label, or their own postage, creates a return in Shopify." },
      { name: "The label is emailed", body: "A confirmation email goes out with the label attached and a QR code, and the customer gets a private page showing the return's status." },
      { name: "The warehouse scans the parcel", body: "Staff scan the tracking number, the return reference or the order number, and the screen shows what the parcel should contain." },
      { name: "Refund or reject", body: "Confirming refunds the customer in Shopify and restocks the items. Rejecting records a reason and a note on the order, and nothing is refunded." },
    ],
    connects: [
      { name: "Shopify", body: "Order lookup, returns, refunds, restocking, order notes and tags all go through Shopify." },
      { name: "Royal Mail Click & Drop", body: "Tracked Returns labels and QR codes are requested from Royal Mail, for UK orders." },
      { name: "Email", body: "The confirmation and the label are emailed to the customer." },
    ],
    also: {
      heading: "Rules the team can change",
      items: [
        "Returns are refunds only. There are no exchanges and no store credit.",
        "The label is free for reasons such as a wrong or faulty item. For other reasons a label fee comes off the refund.",
        "The keep-it option is limited to a household's first return and to orders under a set value, with a weekly cap.",
        "A refund can be held for inspection above a set item total.",
        "Parcels returned to sender are scanned, logged and noted on the Shopify order.",
      ],
    },
    meta: {
      title: "Returns Portal Software for Shopify: Fun Cases | Webgro",
      description:
        "A bespoke returns portal: customers book a return, choose a refund option and get a Royal Mail label. Staff scan the parcel and refund it in Shopify.",
    },
  },
  {
    slug: "content-and-social",
    name: "Content and social",
    mock: "fc-content",
    card: "Makes social graphics, checks their claims and schedules them to Instagram.",
    title: ["Content", "and social"],
    brush: "and social",
    intro:
      "The part of the hub where the Fun Cases team make social content, check it and schedule it to Instagram.",
    does: [
      "For text graphics, someone writes a brief and Claude returns the copy for a batch of up to 14, each in one of seven layouts. The model only writes the words. Sizes and positions are set by the layout, and each graphic is rendered as a 1080 × 1350 image.",
      "Two checks run before a graphic is saved. A fit checker measures every piece of text and fails the graphic if it doesn't fit. A claims check looks for prices, percentages and promises such as free delivery, and each one has to match an entry in a Facts table the team maintains.",
      "A graphic that passes goes into the content pool as approved. One that fails waits under Needs review until a person clears it. Approved content is dragged onto a feed grid or a stories row, and the queue posts at the set times.",
    ],
    users: "The Fun Cases team. The Instagram connection, the posting times and the Facts table are open to admins only.",
    steps: [
      { name: "Write a brief", body: "The brief describes the batch and how many graphics it needs." },
      { name: "The copy is written", body: "Claude returns the text for each graphic, a background and accent from the brand palette, and a caption. Every draft can be edited." },
      { name: "The graphic is checked", body: "The fit checker and the claims check run when it's rendered. A headline can be shrunk within set limits to fit." },
      { name: "It goes to the pool", body: "Clean graphics are saved as approved. Flagged ones wait for a person." },
      { name: "It's scheduled", body: "Approved items are dragged onto the feed or the stories row. Slots fill in queue order, and a post can be pinned to a set time." },
      { name: "It's published", body: "A job runs every 5 minutes and publishes anything due through the Instagram API, with a first comment if one was written. A failed post is retried after 10 minutes, 30 minutes, 2 hours and 6 hours, then passed to a person." },
    ],
    connects: [
      { name: "Instagram", body: "Posts and stories are published through the Instagram API, and each post's results are read back daily." },
      { name: "Claude", body: "Claude writes the graphic copy, captions and blog articles." },
      { name: "Google Gemini and Veo", body: "Gemini builds lifestyle scenes around uploaded product photos, with the product left as it is. Veo adds short motion to a single image, and shows the cost first." },
      { name: "Trustpilot", body: "A daily job reads the public review page. Each new five-star review becomes a testimonial graphic that waits for review. The quote is cut from the reviewer's own words, with no model involved." },
      { name: "Shopify and Search Console", body: "Blog articles are published to the Shopify blog as a draft or live. Search Console data suggests topics." },
    ],
    also: {
      heading: "Other screens",
      items: [
        "Performance shows reach, likes, saves and shares for each post.",
        "The calendar shows posts, stories, blog articles and product launches in one view.",
        "Reels are made from one to four images with camera moves, at 1080 × 1920.",
      ],
    },
    meta: {
      title: "Social Content & Instagram Scheduling Software | Webgro",
      description:
        "A bespoke content tool: social graphics written to a brief, checked for fit and for unsupported claims, then scheduled and published to Instagram.",
    },
  },
  {
    slug: "resizer",
    name: "Resizer",
    mock: "fc-resizer",
    card: "Fits an order's artwork to the right print shape and sends a print file to the workshop.",
    title: ["Artwork resizer", "for print"],
    brush: "for print",
    intro:
      "The resizer takes the artwork from an order, fits it to the print shape for the right phone model and sends a 300dpi print file to the workshop printers.",
    does: [
      "Each phone model and case type has a mask: a transparent image of the print shape, with its real size in millimetres. The resizer picks the mask from the product on the order.",
      "The match has to be exact. If the resizer isn't sure which mask applies, it picks none and offers suggestions, because a wrong mask would print the wrong shape without anyone noticing.",
      "The print file carries a line under the artwork with the order number, the SKU, the mask name and whether the print is mirrored, for the person at the press.",
    ],
    users: "Whoever is preparing personalised, one-off or reprint artwork for the press in the workshop.",
    steps: [
      { name: "Fetch the order", body: "Typing an order number loads its items from Shopify, with the image, SKU and print file for each." },
      { name: "Pick the line", body: "The design is found on the order. It can also be pasted as a link or uploaded." },
      { name: "Check the mask", body: "The mask is chosen from the phone model and case type. It can be changed by hand, or a custom size typed in millimetres." },
      { name: "Position the design", body: "The design is dragged, zoomed and nudged on an artboard drawn at the sheet's true proportions." },
      { name: "Adjust it", body: "Options cover the background colour, a crop for each edge and extending the design for bleed, either by mirroring the edges or with an AI fill of only the new border." },
      { name: "Print", body: "The operator chooses a DL or A3 sheet, the bleed and whether to mirror, then prints. The file goes to a printer of that sheet type, or downloads as a PDF if it can't be sent." },
    ],
    connects: [
      { name: "Shopify", body: "Orders and their artwork are looked up in Shopify." },
      { name: "Print runs", body: "Print files are sent through the same printers as the hub's print runs." },
      { name: "The mask library", body: "New masks are uploaded with a name and a print size, and can be used straight away." },
    ],
    also: {
      heading: "Print sizes",
      items: [
        "DL sheets are 99 × 210mm and A3 sheets are 297 × 420mm, both at 300dpi.",
        "Bleed is set from 0 to 10mm in half-millimetre steps.",
      ],
    },
    meta: {
      title: "Print Artwork Resizer Tool for Custom Phone Cases | Webgro",
      description:
        "A bespoke artwork tool: pull an order from Shopify, fit the design to the print shape for that phone model and send a 300dpi print file to the workshop.",
    },
  },
  {
    slug: "product-generation",
    name: "Product generation",
    mock: "fc-product-gen",
    card: "Takes a batch of new designs from a brief to products in Shopify.",
    title: ["Product", "generation"],
    brush: "generation",
    intro:
      "Product generation takes a batch of new designs from a brief to products in Shopify. A person chooses which designs go forward and approves their details before anything is created.",
    does: [
      "A run can start from reference photos, a written brief or researched trending ideas. Runs queue on the server, so the page can be closed once they're queued.",
      "Claude writes a brief for each design and Google's Gemini model renders it. The default is a batch render, which costs less and takes longer. An urgent run renders straight away.",
    ],
    users: "The person adding new designs to the shop.",
    steps: [
      { name: "Start a run", body: "The run sets the starting point, the number of designs and the style." },
      { name: "Designs are rendered", body: "A brief is written for each design, then the design is rendered." },
      { name: "Review", body: "A person picks the designs worth keeping. Each one can be redone, edited, recoloured or repositioned." },
      { name: "Approve the details", body: "An approval sheet lists each design's name, SKU, category and tags. The SKU is the next free number and is checked against the library. AI can suggest the rest." },
      { name: "The queue creates the products", body: "Each design and product template is a job in a queue, paced against a daily limit and retried on failure. The product is created in Shopify with its title, description, variants and mockup images." },
    ],
    connects: [
      { name: "Shopify", body: "Products, variants, images and SEO titles are created through the Shopify API." },
      { name: "Claude", body: "Claude writes the design briefs and the first paragraph of each product description. A fixed section for the product type is added after it." },
      { name: "Google Gemini", body: "Gemini renders the designs." },
    ],
    meta: {
      title: "Shopify Product Generation Software: Fun Cases | Webgro",
      description:
        "A bespoke product tool: designs are rendered from a brief, reviewed by a person, then created in Shopify with titles, descriptions, variants and images.",
    },
  },
  {
    slug: "helpdesk",
    name: "Helpdesk",
    mock: "fc-helpdesk",
    card: "Email, contact form and Instagram messages as tickets, with the Shopify order beside each one.",
    title: ["Customer service", "helpdesk"],
    brush: "helpdesk",
    intro:
      "The customer service inbox in the Fun Cases hub. Emails, contact form messages and Instagram messages arrive as tickets, with the customer's Shopify order beside each one.",
    does: [
      "An AI assistant sorts each new ticket. It tells customers it's an AI. It works out what the message is about, reads the live order from Shopify and the knowledge base, then writes a summary, a suggested next step and a priority score from 0 to 100 for the person handling the ticket.",
      "A person reads the ticket and replies. From the same screen they can refund items, send a free replacement, refund shipping, put the order on hold or create a single-use goodwill code locked to the customer's email address.",
      "Automatic replies are off unless the team switches them on, and each kind has its own switch. The assistant never carries out refunds, replacements, discounts or order changes.",
    ],
    users: "Customer service staff. Access is granted per person in the hub.",
    replaced: "It replaced Freshdesk for Fun Cases. Open tickets were imported with their original dates.",
    steps: [
      { name: "A message arrives", body: "The support mailbox is checked every minute. Contact form messages are read for the name, email address and order number. Instagram messages arrive as they're sent." },
      { name: "It becomes a ticket", body: "New mail opens a ticket and replies join the existing one. A reply to a closed ticket reopens it. Bounces and out-of-office mail are filtered out." },
      { name: "The assistant sorts it", body: "It flags spam, finds the order number and works out the intent. It then chooses a route: ask the customer for missing information, reply, or pass it to a person." },
      { name: "A person handles it", body: "The inbox shows each ticket with its priority score and a one-line summary. The ticket page shows the conversation, the summary and the order." },
      { name: "Quiet tickets are chased", body: "A ticket waiting on the customer gets a reminder after 3 days and closes after 7." },
    ],
    connects: [
      { name: "Gmail", body: "Email is read from and sent through the support mailbox." },
      { name: "Instagram", body: "Direct messages arrive through Meta. Only customer service enquiries become tickets." },
      { name: "Shopify", body: "Orders are looked up by order number or email address, and refunds, replacements, holds and discount codes are made there." },
      { name: "Claude", body: "Claude does the sorting and writes the summaries." },
    ],
    also: {
      heading: "Also in the helpdesk",
      items: [
        "A knowledge base the team edits, with a list of questions the assistant couldn't answer so that someone can write the answer once.",
        "Reply templates and an email signature.",
        "A dashboard of ticket numbers, the actions the team has taken and what the AI has cost to run.",
        "An audit log of every action.",
      ],
    },
    meta: {
      title: "Custom Helpdesk Software for Shopify: Fun Cases | Webgro",
      description:
        "A bespoke helpdesk: email and Instagram messages become tickets, an AI assistant sorts and summarises them, and staff refund or replace from the ticket.",
    },
  },
];

export function getBespokeTool(slug: string): BespokeTool | undefined {
  return bespokeTools.find((t) => t.slug === slug);
}

/* ── The three other tools, shown as sections on the service page ───────── */

export type OtherTool = {
  id: string;
  mock: BespokeMockName;
  label: string;
  title: string;
  body: string[];
  points: string[];
  link?: { label: string; path: string };
};

export const otherTools: OtherTool[] = [
  {
    id: "twisted-tailor-helpdesk",
    mock: "tt-helpdesk",
    label: "Twisted Tailor",
    title: "AI support that works inside their helpdesk",
    body: [
      "Twisted Tailor's support team kept the helpdesk they already used. When a ticket comes in, the assistant reads the thread, looks up the customer's orders in Shopify and any return in progress, and drafts a reply from a knowledge base the team edits.",
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
      "An emailed enquiry becomes a draft quote. Claude reads the email and pulls out the customer, the reference and the items. Staff price it and send a branded PDF quote with a link to accept it online.",
      "The board is shown here as an example screen, redrawn with sample data. It has a column for quotes to write, quotes waiting on information, quotes sent and quotes lost.",
    ],
    points: [
      "Quotes that were opened but not answered are chased on day 3 and day 7, on weekdays between 9am and 5pm, and closed after 10 days.",
      "The customer accepts online: they choose a quantity and turnaround, enter their details, upload artwork and agree the terms.",
      "Acceptance raises an invoice in Xero and emails it. Payment status is checked every hour.",
      "An accepted quote becomes a job on a second board, and artwork proofs are approved by the customer online.",
    ],
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
