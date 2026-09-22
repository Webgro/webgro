import { SHOPIFY_PATH } from "./services/PlatformMark";

/** A small "Shopify Partner" badge: the Shopify bag and the words, in the concept's type. */
export function ShopifyPartner({ className = "" }: { className?: string }) {
  return (
    <span className={`pv-partner ${className}`.trim()}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={SHOPIFY_PATH} /></svg>
      Shopify Partner
    </span>
  );
}
