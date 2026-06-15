"use client";

import { usePiAuth } from "@/contexts/pi-auth-context";

export function AuthLoadingScreen() {
  const { authMessage, hasError, reinitialize } = usePiAuth();

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#1a1040" }}
    >
      {/* Woven background texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent 0px,transparent 8px,rgba(196,98,45,0.07) 8px,rgba(196,98,45,0.07) 9px)," +
            "repeating-linear-gradient(90deg,transparent 0px,transparent 8px,rgba(245,240,232,0.04) 8px,rgba(245,240,232,0.04) 9px)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-xs w-full px-6 text-center flex flex-col items-center gap-7">
        {/* Logo mark */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              backgroundColor: "#c4622d",
              boxShadow: "0 8px 32px rgba(196,98,45,0.45)",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect x="3"  y="3"  width="8" height="8" rx="1.5" fill="rgba(245,240,232,0.95)" />
              <rect x="21" y="3"  width="8" height="8" rx="1.5" fill="rgba(245,240,232,0.95)" />
              <rect x="3"  y="21" width="8" height="8" rx="1.5" fill="rgba(245,240,232,0.95)" />
              <rect x="21" y="21" width="8" height="8" rx="1.5" fill="rgba(245,240,232,0.55)" />
              <rect x="12" y="12" width="8" height="8" rx="1.5" fill="rgba(245,240,232,0.8)" />
            </svg>
          </div>
          <div>
            <p
              className="text-[10px] font-semibold tracking-[0.22em] uppercase mb-1"
              style={{ color: "rgba(245,240,232,0.4)", fontFamily: "var(--font-inter), sans-serif" }}
            >
              Global Marketplace
            </p>
            <h1
              className="text-2xl font-bold"
              style={{
                color: "#f5f0e8",
                fontFamily: "var(--font-serif), 'Playfair Display', serif",
              }}
            >
              Global Weavers
            </h1>
          </div>
        </div>

        {/* Spinner or error */}
        <div className="flex justify-center">
          {hasError ? (
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(185,28,28,0.15)", border: "2px solid rgba(185,28,28,0.3)" }}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                strokeWidth="2"
                stroke="#ef4444"
                viewBox="0 0 24 24"
                aria-label="Error"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
          ) : (
            <div className="relative w-16 h-16" role="status" aria-label="Loading">
              <div
                className="absolute inset-0 rounded-full"
                style={{ border: "3px solid rgba(245,240,232,0.1)" }}
              />
              <div
                className="absolute inset-0 rounded-full animate-spin"
                style={{ border: "3px solid transparent", borderTopColor: "#c4622d" }}
              />
              {/* Inner Pi symbol */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-xl font-bold"
                  style={{ color: "rgba(245,240,232,0.6)", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  π
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Message */}
        <div className="flex flex-col gap-2">
          <p
            className="text-base font-semibold"
            style={{
              color: hasError ? "#ef4444" : "#f5f0e8",
              fontFamily: "var(--font-serif), 'Playfair Display', serif",
            }}
          >
            {hasError ? "Authentication Failed" : "Connecting to Pi Network"}
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "rgba(245,240,232,0.5)", fontFamily: "var(--font-inter), sans-serif" }}
          >
            {authMessage}
          </p>
        </div>

        {/* Retry button */}
        {hasError && (
          <button
            onClick={reinitialize}
            className="px-6 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95"
            style={{
              backgroundColor: "#c4622d",
              color: "#f5f0e8",
              fontFamily: "var(--font-inter), sans-serif",
              boxShadow: "0 4px 16px rgba(196,98,45,0.4)",
            }}
          >
            Retry Authentication
          </button>
        )}

        {/* Pi Network badge */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            backgroundColor: "rgba(245,240,232,0.06)",
            border: "1px solid rgba(245,240,232,0.1)",
          }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: hasError ? "#ef4444" : "#4ade80" }}
            aria-hidden="true"
          />
          <span
            className="text-[11px]"
            style={{ color: "rgba(245,240,232,0.4)", fontFamily: "var(--font-inter), sans-serif" }}
          >
            {hasError ? "Pi Network unavailable" : "Pi Network · Secure"}
          </span>
        </div>
      </div>
    </div>
  );
}
