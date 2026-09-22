import Link from "next/link";
import { pv } from "../links";
import { tidy, type ArticleSummary } from "./lines";

/** Where a card sits on a desktop (twelve columns) and a tablet (two columns). */
function place(slot: number) {
  const desk = slot === 0 ? "feature" : slot === 1 ? "side" : (["a", "b", "c"] as const)[(slot - 2) % 3];
  const pair = slot === 0 ? "full" : (slot - 1) % 2 === 0 ? "l" : "r";
  return { desk, pair };
}

/**
 * One article on the contents page: picture, a line of small print, the title
 * and the excerpt. `slot` is the card's position among the articles on show,
 * so the layout re-forms around whatever the filter leaves. A negative slot
 * means the filter has hidden it.
 */
export function ArticleCard({ article, slot }: { article: ArticleSummary; slot: number }) {
  const hidden = slot < 0;
  const { desk, pair } = place(Math.max(slot, 0));

  return (
    <li className="pv-jrnl-card" data-desk={desk} data-pair={pair} hidden={hidden}>
      <Link href={pv(`/the-gro/${article.slug}`)} className="pv-jrnl-card-link" data-cursor>
        <span className="pv-jrnl-card-media">
          <span className="pv-jrnl-card-zoom">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.heroImage} alt="" width={1240} height={692} loading="lazy" decoding="async" />
          </span>
        </span>
        <span className="pv-jrnl-card-meta">
          <span>{article.category}</span>
          <span>{article.date}</span>
          <span>{article.readTime}</span>
        </span>
        <h3 className="pv-jrnl-card-title">
          <span className="pv-jrnl-card-mask">
            <span className="pv-jrnl-card-rise">
              <span className="pv-jrnl-card-ul">{tidy(article.title)}</span>
            </span>
          </span>
        </h3>
        <span className="pv-jrnl-card-excerpt">{tidy(article.excerpt)}</span>
      </Link>
    </li>
  );
}
