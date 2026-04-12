import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { Article } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "horizontal" | "compact";
}

export default function ArticleCard({
  article,
  variant = "default",
}: ArticleCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), {
    addSuffix: true,
  });

  if (variant === "horizontal") {
    return (
      <Link
        href={`/article/${article.id}`}
        className="group flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
      >
        <div className="relative w-32 h-24 md:w-40 md:h-28 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="160px"
          />
        </div>
        <div className="flex-1 min-w-0">
          {article.category && (
            <span className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wide">
              {article.category}
            </span>
          )}
          <h3 className="font-bold text-sm md:text-base leading-tight mt-1 line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
            {article.title}
          </h3>
          <div className="flex items-center gap-2 mt-2 text-xs text-[var(--muted)]">
            <Clock size={12} />
            <span>{timeAgo}</span>
            <span>&bull;</span>
            <span>{article.source.name}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/article/${article.id}`}
        className="group block py-3 border-b border-[var(--border)] last:border-0"
      >
        <h4 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
          {article.title}
        </h4>
        <div className="flex items-center gap-2 mt-1.5 text-xs text-[var(--muted)]">
          <Clock size={11} />
          <span>{timeAgo}</span>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link
      href={`/article/${article.id}`}
      className="group block rounded-xl overflow-hidden border border-[var(--border)] hover:shadow-lg transition-shadow bg-white"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        {article.category && (
          <span className="absolute top-3 left-3 bg-[var(--accent)] text-white text-xs font-semibold px-3 py-1 rounded-full">
            {article.category}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-[var(--accent)] transition-colors font-serif">
          {article.title}
        </h3>
        <p className="text-sm text-[var(--muted)] mt-2 line-clamp-2">
          {article.description}
        </p>
        <div className="flex items-center gap-2 mt-3 text-xs text-[var(--muted)]">
          <Clock size={12} />
          <span>{timeAgo}</span>
          <span>&bull;</span>
          <span>{article.source.name}</span>
        </div>
      </div>
    </Link>
  );
}
