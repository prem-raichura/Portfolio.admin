function PublishLoaderP() {
  return (
    <span className="inline-flex items-center justify-center">
      <span className="relative flex h-5 w-5 items-center justify-center">
        <span
          className="absolute inset-0 animate-spin rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0%, var(--grad-start) 50%, var(--grad-end) 100%)",
            WebkitMask:
              "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",
          }}
        />
        <span
          className="absolute inset-1 rounded-full animate-pulse"
          style={{
            background: "linear-gradient(135deg, var(--grad-start), var(--grad-end))",
            boxShadow: "0 0 10px var(--accent-glow)",
          }}
        />
        <span className="relative text-[10px] font-bold text-white dark:text-black">
          P
        </span>
      </span>
    </span>
  );
}

export default PublishLoaderP;
