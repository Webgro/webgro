import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ArticleView } from "@/components/ArticleView";
import {
  articles,
  getArticleBySlug,
  getOtherArticles,
} from "@/content/the-gro";
import { JsonLd, articleLd, breadcrumbsLd } from "@/components/JsonLd";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: `${article.title} · The Gro · Webgro`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getOtherArticles(slug, 2);

  return (
    <>
      <JsonLd
        id={`ld-article-${slug}`}
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
        id={`ld-breadcrumb-article-${slug}`}
        data={breadcrumbsLd([
          { name: "Home", url: "https://webgro.co.uk" },
          { name: "The Gro", url: "https://webgro.co.uk/the-gro" },
          { name: article.title, url: `https://webgro.co.uk/the-gro/${slug}` },
        ])}
      />
      <Nav />
      <main className="flex-1">
        <ArticleView article={article} related={related} />
      </main>
      <Footer />
    </>
  );
}
