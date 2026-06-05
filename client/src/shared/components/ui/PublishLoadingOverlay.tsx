import PublishLoaderP from "@shared/components/ui/PublishLoaderP";

function PublishLoadingOverlay({
  message = "Publishing...",
}: {
  message?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[color:var(--bg-main)]/80 backdrop-blur-sm"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] px-8 py-7 shadow-2xl">
        <PublishLoaderP />
        <p className="text-sm font-medium text-[var(--text-muted)]">
          {message}
        </p>
      </div>
    </div>
  );
}

export default PublishLoadingOverlay;
