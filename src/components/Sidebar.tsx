import Link from "next/link";
import { Article } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import ArticleCard from "./ArticleCard";
import SectionTitle from "./SectionTitle";

interface SidebarProps {
  editorsPicks: Article[];
}

export default function Sidebar({ editorsPicks }: SidebarProps) {
  return (
    <aside className="space-y-8 animate-slide-right">
      {/* Editor's Choice */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-5 hover:shadow-md transition-shadow duration-300">
        <SectionTitle title="Editor&apos;s Choice" />
        <div className="space-y-0">
          {editorsPicks.map((article) => (
            <ArticleCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-5 hover:shadow-md transition-shadow duration-300">
        <SectionTitle title="Categories" />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/category/${cat.toLowerCase()}`}
              className="px-3.5 py-1.5 text-sm bg-gray-50 border border-gray-100 rounded-full hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] hover:shadow-md hover:shadow-red-100 transition-all duration-300"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Subscribe CTA */}
      <div className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] rounded-xl p-7 text-white text-center shadow-lg shadow-red-200/50 hover:shadow-xl hover:shadow-red-200/60 transition-all duration-300">
        <h3 className="text-lg font-bold font-serif mb-2">
          Never Miss a Story
        </h3>
        <p className="text-sm text-red-100 mb-5 leading-relaxed">
          Subscribe to Velora News for unlimited access to premium journalism.
        </p>
        <Link
          href="#"
          className="inline-block bg-white text-[var(--accent)] font-semibold px-7 py-2.5 rounded-full text-sm hover:bg-gray-100 hover:scale-105 transition-all duration-300"
        >
          Subscribe Now
        </Link>
      </div>
    </aside>
  );
}
