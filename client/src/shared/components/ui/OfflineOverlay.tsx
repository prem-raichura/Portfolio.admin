import { useEffect, useState } from "react";

interface OfflineOverlayProps {
  onRetry: () => void | Promise<void>;
}

function OfflineOverlay({ onRetry }: OfflineOverlayProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  // Reset spinner if the overlay stays mounted after a failed retry attempt.
  useEffect(() => {
    if (!isRetrying) return;
    const t = setTimeout(() => setIsRetrying(false), 4000);
    return () => clearTimeout(t);
  }, [isRetrying]);

  const handleRetry = async () => {
    if (isRetrying) return;
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div
      role="alertdialog"
      aria-live="assertive"
      aria-modal="true"
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-[color:var(--bg-main)]/85 backdrop-blur-sm"
    >
      <div className="mx-4 flex max-w-sm flex-col items-center gap-4 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] px-8 py-7 text-center shadow-2xl">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{
            background:
              "linear-gradient(135deg, var(--grad-start), var(--grad-end))",
            boxShadow: "0 0 20px var(--accent-glow)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-white"
            aria-hidden="true"
          >
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-base font-semibold text-[var(--text-main)]">
            You're offline
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Your session is preserved. We'll reconnect automatically when the
            network is back.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRetry}
          disabled={isRetrying}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2 text-sm font-medium text-white shadow-md transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            background:
              "linear-gradient(135deg, var(--grad-start), var(--grad-end))",
          }}
        >
          {isRetrying ? "Retrying…" : "Retry now"}
        </button>
      </div>
    </div>
  );
}

export default OfflineOverlay;
