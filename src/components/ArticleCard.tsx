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
        className="group flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-[var(--border)]"
      >
        <div className="relative w-32 h-24 md:w-40 md:h-28 flex-shrink-0 rounded-lg overflow-hidden img-zoom">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="160px"
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {article.category && (
            <span className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-wider">
              {article.category}
            </span>
          )}
          <h3 className="font-bold text-sm md:text-base leading-tight mt-1 line-clamp-2 group-hover:text-[var(--accent)] transition-colors duration-300">
            {article.title}
          </h3>
          <div className="flex items-center gap-2 mt-2 text-xs text-[var(--muted)]">
            <Clock size={12} />
            <span>{timeAgo}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
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
        className="group flex items-start gap-3 py-3.5 border-b border-[var(--border)] last:border-0"
      >
        <span className="text-2xl font-bold text-gray-200 group-hover:text-[var(--accent)] transition-colors duration-300 leading-none mt-0.5">
          &#9679;
        </span>
        <div>
          <h4 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-[var(--accent)] transition-colors duration-300">
            {article.title}
          </h4>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-[var(--muted)]">
            <Clock size={11} />
            <span>{timeAgo}</span>
          </div>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link
      href={`/article/${article.id}`}
      className="group block rounded-xl overflow-hidden border border-[var(--border)] bg-white card-hover animate-fade-in-up"
    >
      <div className="relative aspect-[16/10] overflow-hidden img-zoom">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        {article.category && (
          <span className="absolute top-3 left-3 bg-[var(--accent)] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg">
            {article.category}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-[var(--accent)] transition-colors duration-300 font-serif">
          {article.title}
        </h3>
        <p className="text-sm text-[var(--muted)] mt-2.5 line-clamp-2 leading-relaxed">
          {article.description}
        </p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <Clock size={12} />
            <span>{timeAgo}</span>
          </div>
          <span className="text-xs font-medium text-gray-500">{article.source.name}</span>
        </div>
      </div>
    </Link>
  );
}
