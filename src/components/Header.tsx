"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, X, User, ChevronRight } from "lucide-react";
import { CATEGORIES } from "@/lib/types";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-[var(--dark-bg)] text-[var(--dark-text)] text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <span className="hidden sm:block text-gray-400">{today}</span>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 hidden md:block">Follow us:</span>
            <div className="flex items-center gap-3">
              <a href="#" className="hover:text-[var(--accent)] transition-colors duration-300" aria-label="Facebook">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="hover:text-[var(--accent)] transition-colors duration-300" aria-label="Twitter">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="hover:text-[var(--accent)] transition-colors duration-300" aria-label="YouTube">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="#" className="hover:text-[var(--accent)] transition-colors duration-300" aria-label="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] rounded-lg flex items-center justify-center text-white font-bold text-xl font-serif group-hover:scale-110 transition-transform duration-300">
              V
            </div>
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-[var(--accent)]">Velora</span>
              <span className="text-[var(--dark-bg)]"> News</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {searchOpen ? (
              <form
                onSubmit={handleSearch}
                className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 animate-fade-in"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search news..."
                  className="bg-transparent outline-none text-sm w-40 md:w-60"
                  autoFocus
                />
                <button type="submit" className="ml-1 text-gray-500 hover:text-[var(--accent)] transition-colors">
                  <Search size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-110"
              >
                <Search size={20} />
              </button>
            )}

            <Link
              href="/contact"
              className="hidden md:flex items-center gap-1 text-sm text-gray-600 hover:text-[var(--accent)] transition-colors duration-300"
            >
              <User size={18} />
              <span>Sign In</span>
            </Link>

            <Link
              href="/about"
              className="hidden md:block bg-[var(--accent)] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[var(--accent-dark)] hover:shadow-lg hover:shadow-red-200 transition-all duration-300"
            >
              Subscribe
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-[var(--border)] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="hidden lg:flex items-center gap-0.5 overflow-x-auto py-0.5">
            <Link
              href="/"
              className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[var(--accent)] hover:bg-red-50 rounded-md transition-all duration-300 whitespace-nowrap relative group"
            >
              Home
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[var(--accent)] group-hover:w-3/4 transition-all duration-300 rounded-full" />
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/category/${cat.toLowerCase()}`}
                className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[var(--accent)] hover:bg-red-50 rounded-md transition-all duration-300 whitespace-nowrap relative group"
              >
                {cat}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[var(--accent)] group-hover:w-3/4 transition-all duration-300 rounded-full" />
              </Link>
            ))}
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-[var(--border)] shadow-lg animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1 stagger-children">
              <Link href="/" className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[var(--accent)] hover:bg-red-50 rounded-md transition-all duration-300 animate-fade-in-up" onClick={() => setMobileMenuOpen(false)}>
                Home <ChevronRight size={14} className="text-gray-400" />
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${cat.toLowerCase()}`}
                  className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[var(--accent)] hover:bg-red-50 rounded-md transition-all duration-300 animate-fade-in-up"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat} <ChevronRight size={14} className="text-gray-400" />
                </Link>
              ))}
              <div className="pt-3 mt-2 border-t border-[var(--border)] space-y-1">
                <Link href="/search" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[var(--accent)] hover:bg-red-50 rounded-md transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>
                  <Search size={14} /> Search
                </Link>
                <Link href="/about" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[var(--accent)] hover:bg-red-50 rounded-md transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>
                  About Us
                </Link>
                <Link href="/contact" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[var(--accent)] hover:bg-red-50 rounded-md transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
