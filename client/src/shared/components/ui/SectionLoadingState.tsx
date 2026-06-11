/**
 * SectionLoadingState.tsx
 *
 * Full-page skeleton for the main Dashboard page.
 * Card-level skeletons are in /ui/CardSkeletons.tsx
 */

import DashboardLayout from "@layouts/DashboardLayout";

function SkeletonBar({ className }: { className: string }) {
  return <div className={`rounded bg-[var(--bg-secondary)] ${className}`} />;
}

function SkeletonCard({
  className,
  children,
}: {
  className: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-[32px] border border-[var(--border-color)] bg-[var(--bg-card)] ${className}`}
    >
      {children}
    </div>
  );
}

function SectionLoadingState() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-pulse">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <SkeletonBar className="h-3 w-44" />
            <SkeletonBar className="h-8 w-72" />
            <SkeletonBar className="h-4 w-[520px] max-w-full" />
          </div>
          <div className="flex gap-2">
            <SkeletonBar className="h-10 w-20 rounded-xl" />
            <SkeletonBar className="h-10 w-28 rounded-xl" />
          </div>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} className="h-28 rounded-2xl" />
          ))}
        </div>

        {/* Chart row */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <SkeletonCard className="h-[360px] xl:col-span-2 rounded-2xl" />
          <SkeletonCard className="h-[360px] rounded-2xl" />
        </div>

        {/* Country / device row */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <SkeletonCard className="h-[360px] rounded-2xl" />
          <SkeletonCard className="h-[360px] rounded-2xl" />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SectionLoadingState;
