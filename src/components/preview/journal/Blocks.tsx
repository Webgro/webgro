import type { ArticleBlock } from "@/content/the-gro";
import { headingId, tidy } from "./lines";

export type TocItem = { id: string; text: string };

/** The h2s, in order, with the same ids the renderer below gives them. */
export function tocFor(blocks: ArticleBlock[]): TocItem[] {
  const items: TocItem[] = [];
  for (const b of blocks) {
    if (b.type === "h2") items.push({ id: headingId(b.text, items.length), text: tidy(b.text) });
  }
  return items;
}

/** Each word in its own span, so a pull quote can light up as it is read. */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span className="pv-jrnl-word" key={i}>{w} </span>
      ))}
    </>
  );
}

function CalloutStroke() {
  return (
    <svg className="pv-jrnl-callout-stroke" viewBox="0 0 30 300" preserveAspectRatio="none" aria-hidden="true">
      <path
        filter="url(#pv-rough)"
        d="M19 4 C 8 52, 3 150, 9 292 C 9.5 298, 15 298, 15.5 291 C 12 200, 15 96, 26 9 C 27 2, 21 -1, 19 4 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Renders every block type the live article view supports. */
export function Blocks({ blocks }: { blocks: ArticleBlock[] }) {
  const ids = new Map<number, string>();
  blocks.forEach((b, i) => {
    if (b.type === "h2") ids.set(i, headingId(b.text, ids.size));
  });
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return <p key={i}>{tidy(block.text)}</p>;
          case "h2":
            return <h2 key={i} id={ids.get(i)}>{tidy(block.text)}</h2>;
          case "h3":
            return <h3 key={i}>{tidy(block.text)}</h3>;
          case "ul":
            return (
              <ul key={i}>
                {block.items.map((item, n) => <li key={n}>{tidy(item)}</li>)}
              </ul>
            );
          case "ol":
            return (
              <ol key={i}>
                {block.items.map((item, n) => <li key={n}>{tidy(item)}</li>)}
              </ol>
            );
          case "quote":
            return (
              <blockquote className="pv-jrnl-quote pv-jrnl-lit" key={i}>
                <p><Words text={`“${tidy(block.text)}”`} /></p>
              </blockquote>
            );
          case "callout":
            return (
              <aside className="pv-jrnl-callout pv-jrnl-lit" key={i}>
                <CalloutStroke />
                <p><Words text={tidy(block.text)} /></p>
              </aside>
            );
        }
      })}
    </>
  );
}
