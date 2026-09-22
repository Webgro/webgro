import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { LegalA, LegalH2, LegalH3, LegalP, LegalPageView, LegalUl } from "@/components/LegalPageView";

/**
 * The legal wording lives inline in the live routes (src/app/privacy, /cookies,
 * /accessibility) as children of <LegalPageView>. Rather than copy legal text
 * into the concept, we call the live page function, find that element in the
 * tree it returns, and re-dress its children in the concept's own markup. The
 * words can never drift from the live site because they are the same words.
 */

type AnyProps = { children?: ReactNode } & Record<string, unknown>;
type LegalProps = { title: string; intro: string; lastReviewed: string; children?: ReactNode };

export type LegalSection = { id: string; label: string; heading: ReactNode; body: ReactNode[] };
export type LegalDoc = { title: string; intro: string; lastReviewed: string; sections: LegalSection[] };

function findLegal(node: ReactNode): ReactElement<LegalProps> | null {
  for (const child of Children.toArray(node)) {
    if (!isValidElement<AnyProps>(child)) continue;
    if (child.type === LegalPageView) return child as ReactElement<LegalProps>;
    const found = findLegal(child.props.children);
    if (found) return found;
  }
  return null;
}

function textOf(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return String(child);
      return isValidElement<AnyProps>(child) ? textOf(child.props.children) : "";
    })
    .join("");
}

const slugify = (text: string) =>
  text.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/** Swaps the live site's Tailwind-styled helpers for the concept's classes, leaving every word alone. */
function dress(node: ReactNode): ReactNode[] {
  return Children.toArray(node).map((child) => {
    if (!isValidElement<AnyProps>(child)) return child;
    const { children } = child.props;
    const key = child.key;
    if (child.type === LegalP) return <p className="pv-legal-p" key={key}>{dress(children)}</p>;
    if (child.type === LegalH3) return <h3 className="pv-legal-h3" key={key}>{dress(children)}</h3>;
    if (child.type === LegalUl) return <ul className="pv-legal-ul" key={key}>{dress(children)}</ul>;
    if (child.type === LegalA) {
      const external = Boolean(child.props.external);
      return (
        <a
          className="pv-legal-a"
          key={key}
          href={String(child.props.href)}
          data-cursor
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {dress(children)}
        </a>
      );
    }
    if (typeof child.type === "string" && children !== undefined) {
      return cloneElement(child, undefined, dress(children));
    }
    return child;
  });
}

export function extractLegal(page: () => ReactNode): LegalDoc {
  const legal = findLegal(page());
  if (!legal) throw new Error("extractLegal: no <LegalPageView> found in the live page");

  const { title, intro, lastReviewed, children } = legal.props;
  const sections: LegalSection[] = [];
  const used = new Set<string>();

  for (const child of Children.toArray(children)) {
    if (isValidElement<AnyProps>(child) && child.type === LegalH2) {
      const label = textOf(child.props.children);
      let id = slugify(label) || `section-${sections.length + 1}`;
      while (used.has(id)) id = `${id}-${sections.length + 1}`;
      used.add(id);
      sections.push({ id, label, heading: dress(child.props.children), body: [] });
      continue;
    }
    // Anything before the first heading still needs a home.
    if (!sections.length) sections.push({ id: "overview", label: "Overview", heading: "Overview", body: [] });
    sections[sections.length - 1].body.push(...dress(child));
  }

  return { title, intro, lastReviewed, sections };
}
