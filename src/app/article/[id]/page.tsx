import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowLeft } from "lucide-react";
import { getTopHeadlines } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import ArticleCard from "@/components/ArticleCard";
import SectionTitle from "@/components/SectionTitle";
import ShareButtons from "@/components/ShareButtons";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;

  // Search across multiple categories to find the article
  const allCategories = [undefined, "technology", "sports", "business", "health", "science", "entertainment"];
  let article = null;
  let allArticles: Awaited<ReturnType<typeof getTopHeadlines>> = [];

  for (const cat of allCategories) {
    const articles = await getTopHeadlines(cat, 10);
    allArticles = [...allArticles, ...articles];
    const found = articles.find((a) => a.id === id);
    if (found) {
      article = found;
      break;
    }
  }

  if (!article) {
    notFound();
  }

  // Deduplicate and get related articles
  const seen = new Set<string>();
  const relatedArticles = allArticles
    .filter((a) => {
      if (a.id === article.id || seen.has(a.id)) return false;
      seen.add(a.id);
      return true;
    })
    .slice(0, 5);

  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), {
    addSuffix: true,
  });

  const publishDate = new Date(article.publishedAt).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <article className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-[var(--muted)]">
        <Link
          href="/"
          className="inline-flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
        >
          <ArrowLeft size={14} />
          Home
        </Link>
        {article.category && (
          <>
            <span>/</span>
            <Link
              href={`/category/${article.category.toLowerCase()}`}
              className="hover:text-[var(--accent)] transition-colors"
            >
              {article.category}
            </Link>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Article Content */}
        <div className="lg:col-span-2">
          {article.category && (
            <span className="inline-block bg-[var(--accent)] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
              {article.category}
            </span>
          )}

          <h1 className="text-3xl md:text-4xl font-bold leading-tight font-serif mb-4">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted)] mb-6 pb-6 border-b border-[var(--border)]">
            <span className="font-medium text-[var(--foreground)]">
              {article.source.name}
            </span>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{publishDate}</span>
            </div>
            <span>{timeAgo}</span>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
            />
          </div>

          {/* Share buttons */}
          <div className="mb-8">
            <ShareButtons title={article.title} />
          </div>

          {/* Article Body */}
          <div className="article-content text-lg leading-relaxed text-gray-800">
            <p className="text-xl text-gray-600 mb-6 font-serif italic">
              {article.description}
            </p>
            {article.content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-4">{paragraph}</p>
            ))}
          </div>

          {/* Source Link */}
          {article.url && article.url !== "#" && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-[var(--border)]">
              <p className="text-sm text-[var(--muted)]">
                Read the full story at{" "}
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline font-medium"
                >
                  {article.source.name} &rarr;
                </a>
              </p>
            </div>
          )}

          {/* Share at bottom */}
          <div className="mt-8 pt-8 border-t border-[var(--border)]">
            <ShareButtons title={article.title} />
          </div>
        </div>

        {/* Sidebar - Related */}
        <aside>
          <SectionTitle title="Related Stories" />
          <div className="space-y-4">
            {relatedArticles.map((a) => (
              <ArticleCard key={a.id} article={a} variant="horizontal" />
            ))}
          </div>
        </aside>
      </div>
    </article>
  );
}
