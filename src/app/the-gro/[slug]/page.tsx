import type { Metadata } from "next";
import { ARTICLE_META, pageMeta, siteUrl } from "@/components/preview/seo";
import { JsonLd, articleLd, breadcrumbsLd } from "@/components/JsonLd";
import { notFound } from "next/navigation";
import { tocFor } from "@/components/preview/journal/Blocks";
import { JournalArticle } from "@/components/preview/journal/JournalArticle";
import { summarise } from "@/components/preview/journal/lines";
import { articles, getArticleBySlug } from "@/content/the-gro";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article not found | Webgro" };
  const m = ARTICLE_META[slug] ?? { title: `${article.title} | Webgro`, description: article.excerpt };
  return pageMeta({ ...m, path: `/the-gro/${slug}`, image: article.heroImage, type: "article" });
}

export default async function PreviewArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  // The next two in the run, wrapping round to the newest at the end.
  const at = articles.findIndex((a) => a.slug === slug);
  const next = [1, 2]
    .map((step) => articles[(at + step) % articles.length])
    .filter((a, i, all) => a.slug !== slug && all.findIndex((b) => b.slug === a.slug) === i)
    .map(summarise);

  return (
    <>
      <JsonLd
        id="ld-article"
        data={articleLd({
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          author: article.author,
          heroImage: article.heroImage,
          date: article.date,
        })}
      />
      <JsonLd
        id="ld-breadcrumbs"
        data={breadcrumbsLd([
          { name: "Home", url: siteUrl("/") },
          { name: "The Gro", url: siteUrl("/the-gro") },
          { name: article.title, url: siteUrl(`/the-gro/${article.slug}`) },
        ])}
      />
      <JournalArticle article={article} toc={tocFor(article.body)} next={next} />
    </>
  );
}
