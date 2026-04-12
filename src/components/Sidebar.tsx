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
    <aside className="space-y-8">
      {/* Editor's Choice */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-5">
        <SectionTitle title="Editor's Choice" />
        <div className="space-y-0">
          {editorsPicks.map((article) => (
            <ArticleCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-5">
        <SectionTitle title="Categories" />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/category/${cat.toLowerCase()}`}
              className="px-3 py-1.5 text-sm bg-gray-100 rounded-full hover:bg-[var(--accent)] hover:text-white transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Subscribe CTA */}
      <div className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] rounded-xl p-6 text-white text-center">
        <h3 className="text-lg font-bold font-serif mb-2">
          Never Miss a Story
        </h3>
        <p className="text-sm text-red-100 mb-4">
          Subscribe to Velora News for unlimited access to premium journalism.
        </p>
        <Link
          href="#"
          className="inline-block bg-white text-[var(--accent)] font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-gray-100 transition-colors"
        >
          Subscribe Now
        </Link>
      </div>
    </aside>
  );
}
