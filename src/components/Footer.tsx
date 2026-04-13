import Link from "next/link";
import { Mail, ArrowUp } from "lucide-react";
import { CATEGORIES } from "@/lib/types";

export default function Footer() {
  return (
    <footer className="bg-[var(--dark-bg)] text-[var(--dark-text)]">
      {/* Newsletter Section */}
      <div className="border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-14 h-14 bg-[var(--accent)]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Mail className="text-[var(--accent)]" size={28} />
            </div>
            <h3 className="text-2xl font-bold font-serif mb-2">
              Stay Informed
            </h3>
            <p className="text-gray-400 mb-7 leading-relaxed">
              Get breaking news and top stories delivered to your inbox every
              morning. No spam, unsubscribe anytime.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3.5 rounded-full bg-gray-800/80 border border-gray-600 text-white placeholder:text-gray-500 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all duration-300"
              />
              <button
                type="submit"
                className="px-7 py-3.5 bg-[var(--accent)] text-white rounded-full font-semibold hover:bg-[var(--accent-dark)] hover:shadow-lg hover:shadow-red-900/30 hover:scale-105 transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-9 h-9 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] rounded-lg flex items-center justify-center text-white font-bold text-lg font-serif group-hover:scale-110 transition-transform duration-300">
                V
              </div>
              <span className="text-xl font-bold">
                <span className="text-[var(--accent)]">Velora</span>
                <span className="text-white"> News</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted source for breaking news and in-depth analysis from
              around the world.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" className="p-2.5 bg-gray-800 rounded-full hover:bg-[var(--accent)] transition-all duration-300 hover:scale-110" aria-label="Facebook">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="p-2.5 bg-gray-800 rounded-full hover:bg-[var(--accent)] transition-all duration-300 hover:scale-110" aria-label="Twitter">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="p-2.5 bg-gray-800 rounded-full hover:bg-[var(--accent)] transition-all duration-300 hover:scale-110" aria-label="YouTube">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="#" className="p-2.5 bg-gray-800 rounded-full hover:bg-[var(--accent)] transition-all duration-300 hover:scale-110" aria-label="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
            </div>
          </div>

          {/* Sections */}
          <div>
            <h4 className="font-semibold mb-4 text-white text-sm uppercase tracking-wider">Sections</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/category/${cat.toLowerCase()}`}
                    className="text-gray-400 text-sm hover:text-[var(--accent)] hover:pl-1 transition-all duration-300"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white text-sm uppercase tracking-wider">More</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.slice(5).map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/category/${cat.toLowerCase()}`}
                    className="text-gray-400 text-sm hover:text-[var(--accent)] hover:pl-1 transition-all duration-300"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-white text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-gray-400 text-sm hover:text-[var(--accent)] hover:pl-1 transition-all duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Velora News. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-gray-500 text-sm">
            <Link href="/privacy" className="hover:text-[var(--accent)] transition-colors duration-300">Privacy</Link>
            <Link href="/terms" className="hover:text-[var(--accent)] transition-colors duration-300">Terms</Link>
            <Link href="/contact" className="hover:text-[var(--accent)] transition-colors duration-300">Contact</Link>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[var(--accent)] transition-all duration-300" aria-label="Back to top">
              <ArrowUp size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
