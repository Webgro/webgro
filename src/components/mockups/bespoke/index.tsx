import { AnyprintQuotes } from "./AnyprintQuotes";
import { Content } from "./Content";
import { Forecast } from "./Forecast";
import { Helpdesk } from "./Helpdesk";
import { PrintRun } from "./PrintRun";
import { ProductGen } from "./ProductGen";
import { Resizer } from "./Resizer";
import { Returns } from "./Returns";
import { Shipping } from "./Shipping";
import { StockPlanning } from "./StockPlanning";
import { TTHelpdesk } from "./TTHelpdesk";
import { Warehouse } from "./Warehouse";
import { WebgroPortal } from "./WebgroPortal";

/**
 * Redrawn screens of the bespoke software on the Bespoke Software pages.
 * They follow each tool's real layout and labels, with invented data, so no
 * customer, order or ticket from a live system is ever shown.
 *
 * The names below are a contract with the pages that use them: add to the
 * list, don't rename.
 */
export const BESPOKE_MOCK_NAMES = [
  "fc-stock-planning",
  "fc-warehouse",
  "fc-forecast",
  "fc-shipping",
  "fc-print-run",
  "fc-returns",
  "fc-content",
  "fc-resizer",
  "fc-product-gen",
  "fc-helpdesk",
  "tt-helpdesk",
  "anyprint-quotes",
  "webgro-portal",
] as const;

export type BespokeMockName = (typeof BESPOKE_MOCK_NAMES)[number];

const registry: Record<BespokeMockName, () => React.ReactElement> = {
  "fc-stock-planning": StockPlanning,
  "fc-warehouse": Warehouse,
  "fc-forecast": Forecast,
  "fc-shipping": Shipping,
  "fc-print-run": PrintRun,
  "fc-returns": Returns,
  "fc-content": Content,
  "fc-resizer": Resizer,
  "fc-product-gen": ProductGen,
  "fc-helpdesk": Helpdesk,
  "tt-helpdesk": TTHelpdesk,
  "anyprint-quotes": AnyprintQuotes,
  "webgro-portal": WebgroPortal,
};

/** One redrawn screen, by name. A 16:10 picture that fills its container's width. */
export function BespokeMock({ name }: { name: BespokeMockName }) {
  const Component = registry[name];
  if (!Component) return null;
  return <Component />;
}
