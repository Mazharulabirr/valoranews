import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-8xl font-bold text-[var(--accent)] font-serif mb-4">
        404
      </div>
      <h1 className="text-3xl font-bold font-serif mb-4">Page Not Found</h1>
      <p className="text-lg text-[var(--muted)] mb-8">
        Sorry, the page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/"
          className="px-8 py-3 bg-[var(--accent)] text-white rounded-full font-semibold hover:bg-[var(--accent-dark)] transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/search"
          className="px-8 py-3 border border-[var(--border)] rounded-full font-semibold hover:bg-gray-50 transition-colors"
        >
          Search News
        </Link>
      </div>
    </div>
  );
}
