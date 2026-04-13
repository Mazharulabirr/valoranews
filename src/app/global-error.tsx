"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ maxWidth: 500, margin: "100px auto", textAlign: "center", fontFamily: "sans-serif" }}>
          <h1 style={{ fontSize: 28, marginBottom: 16 }}>Something went wrong</h1>
          <p style={{ color: "#666", marginBottom: 24 }}>{error.message || "An unexpected error occurred."}</p>
          <button
            onClick={reset}
            style={{
              padding: "12px 32px",
              background: "#e63946",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
