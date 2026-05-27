function PageLoader() {
  return (
    <div
      className="
        fixed
        inset-0
        z-[999]
        flex
        items-center
        justify-center
        bg-[var(--bg-main)]/70
        backdrop-blur-sm
      "
    >
      <div className="flex items-center gap-3">

        {/* Spinner */}

        <div
          className="
            h-10
            w-10
            animate-spin
            rounded-full
            border-4
            border-[var(--border-color)]
            border-t-[var(--button-primary)]
          "
        />

        {/* Text */}

        <p
          className="
            text-sm
            font-medium
            text-[var(--text-secondary)]
          "
        >
          Loading...
        </p>

      </div>
    </div>
  );
}

export default PageLoader;