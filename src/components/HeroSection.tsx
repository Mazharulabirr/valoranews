import Link from "next/link";
import Image from "next/image";
import { Clock, TrendingUp } from "lucide-react";
import { Article } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface HeroSectionProps {
  featured: Article;
  sideArticles: Article[];
}

export default function HeroSection({
  featured,
  sideArticles,
}: HeroSectionProps) {
  const timeAgo = formatDistanceToNow(new Date(featured.publishedAt), {
    addSuffix: true,
  });

  return (
    <section className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      {/* Trending Bar */}
      <div className="flex items-center gap-3 mb-6 bg-gradient-to-r from-red-50 to-white border border-red-100 rounded-xl px-5 py-3 animate-fade-in-up">
        <span className="flex items-center gap-1.5 text-[var(--accent)] font-bold text-sm whitespace-nowrap">
          <TrendingUp size={16} className="animate-bounce" style={{ animationDuration: '2s' }} />
          TRENDING
        </span>
        <div className="w-px h-5 bg-red-200" />
        <div className="overflow-hidden">
          <Link href={`/article/${featured.id}`} className="text-sm text-gray-700 hover:text-[var(--accent)] transition-colors duration-300 truncate block">
            {featured.title}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Featured */}
        <Link
          href={`/article/${featured.id}`}
          className="lg:col-span-2 group relative rounded-2xl overflow-hidden aspect-[16/9] lg:aspect-auto lg:min-h-[500px] img-zoom"
        >
          <Image
            src={featured.image}
            alt={featured.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            {featured.category && (
              <span className="inline-block bg-[var(--accent)] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 animate-fade-in-up">
                {featured.category}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight font-serif group-hover:text-red-100 transition-colors duration-300">
              {featured.title}
            </h1>
            <p className="text-gray-300 mt-3 text-sm md:text-base line-clamp-2 max-w-2xl">
              {featured.description}
            </p>
            <div className="flex items-center gap-3 mt-4 text-xs text-gray-400">
              <Clock size={12} />
              <span>{timeAgo}</span>
              <span className="w-1 h-1 bg-gray-500 rounded-full" />
              <span>{featured.source.name}</span>
            </div>
          </div>
        </Link>

        {/* Side Articles */}
        <div className="flex flex-col gap-4 stagger-children">
          {sideArticles.slice(0, 3).map((article) => {
            const ago = formatDistanceToNow(new Date(article.publishedAt), {
              addSuffix: true,
            });
            return (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className="group relative rounded-xl overflow-hidden flex-1 min-h-[150px] img-zoom animate-fade-in-up"
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {article.category && (
                    <span className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-wider">
                      {article.category}
                    </span>
                  )}
                  <h3 className="font-bold text-white text-sm leading-tight mt-1 line-clamp-2 font-serif group-hover:text-red-100 transition-colors duration-300">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-400">
                    <Clock size={10} />
                    <span>{ago}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
