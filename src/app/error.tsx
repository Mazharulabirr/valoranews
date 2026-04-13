"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-4">&#9888;</div>
      <h1 className="text-3xl font-bold font-serif mb-4">
        Something Went Wrong
      </h1>
      <p className="text-lg text-[var(--muted)] mb-8">
        We encountered an unexpected error. Please try again.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={reset}
          className="px-8 py-3 bg-[var(--accent)] text-white rounded-full font-semibold hover:bg-[var(--accent-dark)] transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-8 py-3 border border-[var(--border)] rounded-full font-semibold hover:bg-gray-50 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
