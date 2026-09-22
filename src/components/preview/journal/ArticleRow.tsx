import Link from "next/link";
import { pv } from "../links";
import { tidy, type ArticleSummary } from "./lines";

/**
 * One row of the "More articles" list under an article. The title sits in a
 * mask so it can rise into place, and wears the brushed marker on hover (or, on
 * a phone, while the row is the one being read).
 */
export function ArticleRow({ article }: { article: ArticleSummary }) {
  return (
    <li className="pv-jrnl-row">
      <Link
        href={pv(`/the-gro/${article.slug}`)}
        className="pv-jrnl-row-link"
        data-cursor
      >
        <span className="pv-jrnl-row-rule" aria-hidden="true" />
        <span className="pv-jrnl-row-meta">
          <span className="pv-jrnl-row-date">{article.date}</span>
          <span className="pv-jrnl-row-cat">{article.category}</span>
          <span className="pv-jrnl-row-time">{article.readTime}</span>
        </span>
        <span className="pv-jrnl-row-main">
          <span className="pv-jrnl-row-mask">
            <h3 className="pv-jrnl-row-title">
              <span className="pv-jrnl-mark">{tidy(article.title)}</span>
            </h3>
          </span>
          <span className="pv-jrnl-row-excerpt">{tidy(article.excerpt)}</span>
        </span>
        <span className="pv-jrnl-row-thumb" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.heroImage} alt="" width={1240} height={692} loading="lazy" decoding="async" />
        </span>
      </Link>
    </li>
  );
}
