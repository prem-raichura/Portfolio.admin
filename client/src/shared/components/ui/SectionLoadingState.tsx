import type { ReactNode } from "react";

import DashboardLayout from "@layouts/DashboardLayout";

export type SectionVariant =
  | "dashboard"
  | "project-grid"
  | "project-list"
  | "experience-grid"
  | "experience-list"
  | "certificate-grid"
  | "certificate-list"
  | "api-keys";

export type SectionLoadingStateProps = {
  variant: SectionVariant;
  count?: number;
};

function SkeletonBar({
  className,
}: {
  className: string;
}) {
  return <div className={`rounded bg-[var(--bg-secondary)] ${className}`} />;
}

function SkeletonCard({
  children,
  className,
}: {
  children?: ReactNode;
  className: string;
}) {
  return (
    <div
      className={`rounded-[32px] border border-[var(--border-color)] bg-[var(--bg-card)] ${className}`}
    >
      {children}
    </div>
  );
}

function ProjectGridCardSkeleton() {
  return (
    <SkeletonCard className="overflow-hidden">
      <div className="h-52 bg-[var(--bg-secondary)]" />
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-3">
            <SkeletonBar className="h-6 w-3/4" />
            <SkeletonBar className="h-3 w-1/2" />
          </div>
          <SkeletonBar className="h-10 w-10 rounded-xl" />
        </div>
        <div className="flex flex-wrap gap-2">
          <SkeletonBar className="h-6 w-16 rounded-full" />
          <SkeletonBar className="h-6 w-20 rounded-full" />
          <SkeletonBar className="h-6 w-14 rounded-full" />
        </div>
        <SkeletonBar className="h-4 w-full" />
        <SkeletonBar className="h-4 w-5/6" />
        <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-4">
          <SkeletonBar className="h-4 w-28" />
          <div className="flex gap-2">
            <SkeletonBar className="h-10 w-10 rounded-xl" />
            <SkeletonBar className="h-10 w-10 rounded-xl" />
            <SkeletonBar className="h-10 w-10 rounded-xl" />
          </div>
        </div>
      </div>
    </SkeletonCard>
  );
}

function ProjectListSkeleton() {
  return (
    <SkeletonCard className="p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-start gap-4">
          <SkeletonBar className="h-14 w-14 rounded-2xl" />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <SkeletonBar className="h-6 w-56" />
              <SkeletonBar className="h-6 w-20 rounded-full" />
            </div>
            <SkeletonBar className="h-3 w-32" />
            <SkeletonBar className="h-4 w-full" />
            <SkeletonBar className="h-4 w-5/6" />
            <div className="flex flex-wrap gap-2 pt-1">
              <SkeletonBar className="h-6 w-16 rounded-full" />
              <SkeletonBar className="h-6 w-18 rounded-full" />
              <SkeletonBar className="h-6 w-14 rounded-full" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-[var(--border-color)] pt-5 lg:border-t-0 lg:pt-0">
          <SkeletonBar className="h-11 w-11 rounded-xl" />
          <SkeletonBar className="h-11 w-11 rounded-xl" />
          <SkeletonBar className="h-11 w-11 rounded-xl" />
        </div>
      </div>
    </SkeletonCard>
  );
}

function ExperienceGridCardSkeleton() {
  return (
    <SkeletonCard className="overflow-hidden">
      <div className="h-52 bg-[var(--bg-secondary)]" />
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-3">
            <SkeletonBar className="h-6 w-3/5" />
            <SkeletonBar className="h-4 w-2/5" />
          </div>
          <div className="flex gap-1.5">
            <SkeletonBar className="h-10 w-10 rounded-xl" />
            <SkeletonBar className="h-10 w-10 rounded-xl" />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <SkeletonBar className="h-5 w-24 rounded-full" />
          <SkeletonBar className="h-5 w-20 rounded-full" />
        </div>
        <SkeletonBar className="h-4 w-full" />
        <SkeletonBar className="h-4 w-5/6" />
        <div className="flex flex-wrap gap-2">
          <SkeletonBar className="h-6 w-20 rounded-full" />
          <SkeletonBar className="h-6 w-14 rounded-full" />
        </div>
        <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-4">
          <SkeletonBar className="h-4 w-36" />
          <div className="flex gap-2">
            <SkeletonBar className="h-10 w-10 rounded-xl" />
            <SkeletonBar className="h-10 w-10 rounded-xl" />
          </div>
        </div>
      </div>
    </SkeletonCard>
  );
}

function ExperienceListSkeleton() {
  return (
    <SkeletonCard className="p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-start gap-4">
          <SkeletonBar className="h-14 w-14 rounded-2xl" />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <SkeletonBar className="h-6 w-56" />
              <SkeletonBar className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex flex-wrap gap-3">
              <SkeletonBar className="h-4 w-24" />
              <SkeletonBar className="h-4 w-24" />
              <SkeletonBar className="h-4 w-28" />
            </div>
            <SkeletonBar className="h-4 w-full" />
            <SkeletonBar className="h-4 w-5/6" />
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-[var(--border-color)] pt-5 lg:border-t-0 lg:pt-0">
          <SkeletonBar className="h-11 w-11 rounded-xl" />
          <SkeletonBar className="h-11 w-11 rounded-xl" />
        </div>
      </div>
    </SkeletonCard>
  );
}

function CertificateGridCardSkeleton() {
  return (
    <SkeletonCard className="overflow-hidden">
      <div className="h-52 bg-[var(--bg-secondary)]" />
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-3">
            <SkeletonBar className="h-6 w-3/4" />
            <SkeletonBar className="h-3 w-1/2" />
          </div>
          <SkeletonBar className="h-10 w-10 rounded-xl" />
        </div>
        <div className="flex flex-wrap gap-2">
          <SkeletonBar className="h-6 w-20 rounded-full" />
          <SkeletonBar className="h-6 w-16 rounded-full" />
        </div>
        <SkeletonBar className="h-4 w-2/3" />
        <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-4">
          <SkeletonBar className="h-4 w-24" />
          <div className="flex gap-2">
            <SkeletonBar className="h-10 w-10 rounded-xl" />
            <SkeletonBar className="h-10 w-10 rounded-xl" />
            <SkeletonBar className="h-10 w-10 rounded-xl" />
          </div>
        </div>
      </div>
    </SkeletonCard>
  );
}

function CertificateListSkeleton() {
  return (
    <SkeletonCard className="p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-start gap-4">
          <SkeletonBar className="h-14 w-14 rounded-2xl" />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <SkeletonBar className="h-6 w-48" />
              <SkeletonBar className="h-6 w-20 rounded-full" />
            </div>
            <SkeletonBar className="h-3 w-32" />
            <SkeletonBar className="h-4 w-full" />
            <SkeletonBar className="h-4 w-5/6" />
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-[var(--border-color)] pt-5 lg:border-t-0 lg:pt-0">
          <SkeletonBar className="h-10 w-10 rounded-xl" />
          <SkeletonBar className="h-10 w-10 rounded-xl" />
          <SkeletonBar className="h-10 w-10 rounded-xl" />
        </div>
      </div>
    </SkeletonCard>
  );
}

function ApiKeyCardSkeleton() {
  return (
    <SkeletonCard className="rounded-2xl p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <SkeletonBar className="h-6 w-40" />
            <SkeletonBar className="h-6 w-20 rounded-full" />
            <SkeletonBar className="h-6 w-16 rounded-full" />
          </div>
          <div className="flex items-center gap-3">
            <SkeletonBar className="h-11 flex-1 rounded-xl" />
            <div className="flex gap-1.5">
              <SkeletonBar className="h-8 w-8 rounded-lg" />
              <SkeletonBar className="h-8 w-8 rounded-lg" />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <SkeletonBar className="h-4 w-32" />
            <SkeletonBar className="h-4 w-28" />
            <SkeletonBar className="h-4 w-24" />
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-[var(--border-color)] pt-5 sm:border-t-0 sm:pt-0">
          <SkeletonBar className="h-11 w-11 rounded-xl" />
          <SkeletonBar className="h-11 w-11 rounded-xl" />
          <SkeletonBar className="h-11 w-11 rounded-xl" />
        </div>
      </div>
    </SkeletonCard>
  );
}

function SectionLoadingState({ variant, count = 6 }: SectionLoadingStateProps) {
  if (variant === "dashboard") {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
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

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} className="h-28 rounded-2xl" />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <SkeletonCard className="h-[360px] xl:col-span-2 rounded-2xl" />
            <SkeletonCard className="h-[360px] rounded-2xl" />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <SkeletonCard className="h-[360px] rounded-2xl" />
            <SkeletonCard className="h-[360px] rounded-2xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (variant === "project-grid") {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <SkeletonBar className="h-7 w-44" />
              <SkeletonBar className="h-4 w-80 max-w-full" />
            </div>
            <div className="flex gap-2">
              <SkeletonBar className="h-10 w-24 rounded-2xl" />
              <SkeletonBar className="h-10 w-28 rounded-2xl" />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <SkeletonBar className="h-10 w-20 rounded-2xl" />
            <SkeletonBar className="h-10 w-20 rounded-2xl" />
            <SkeletonBar className="h-10 w-24 rounded-2xl" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: count }).map((_, index) => (
              <ProjectGridCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (variant === "project-list") {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <SkeletonBar className="h-7 w-44" />
              <SkeletonBar className="h-4 w-80 max-w-full" />
            </div>
            <div className="flex gap-2">
              <SkeletonBar className="h-10 w-24 rounded-2xl" />
              <SkeletonBar className="h-10 w-28 rounded-2xl" />
            </div>
          </div>
          <div className="grid gap-4">
            {Array.from({ length: count }).map((_, index) => (
              <ProjectListSkeleton key={index} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (variant === "experience-grid") {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <SkeletonBar className="h-7 w-52" />
              <SkeletonBar className="h-4 w-80 max-w-full" />
            </div>
            <div className="flex gap-2">
              <SkeletonBar className="h-10 w-24 rounded-2xl" />
              <SkeletonBar className="h-10 w-28 rounded-2xl" />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <SkeletonBar className="h-10 w-20 rounded-2xl" />
            <SkeletonBar className="h-10 w-20 rounded-2xl" />
            <SkeletonBar className="h-10 w-24 rounded-2xl" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: count }).map((_, index) => (
              <ExperienceGridCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (variant === "experience-list") {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <SkeletonBar className="h-7 w-52" />
              <SkeletonBar className="h-4 w-80 max-w-full" />
            </div>
            <div className="flex gap-2">
              <SkeletonBar className="h-10 w-24 rounded-2xl" />
              <SkeletonBar className="h-10 w-28 rounded-2xl" />
            </div>
          </div>
          <div className="grid gap-4">
            {Array.from({ length: count }).map((_, index) => (
              <ExperienceListSkeleton key={index} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (variant === "certificate-grid") {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <SkeletonBar className="h-7 w-52" />
              <SkeletonBar className="h-4 w-80 max-w-full" />
            </div>
            <div className="flex gap-2">
              <SkeletonBar className="h-10 w-24 rounded-2xl" />
              <SkeletonBar className="h-10 w-28 rounded-2xl" />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <SkeletonBar className="h-10 w-20 rounded-2xl" />
            <SkeletonBar className="h-10 w-24 rounded-2xl" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: count }).map((_, index) => (
              <CertificateGridCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (variant === "certificate-list") {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <SkeletonBar className="h-7 w-52" />
              <SkeletonBar className="h-4 w-80 max-w-full" />
            </div>
            <div className="flex gap-2">
              <SkeletonBar className="h-10 w-24 rounded-2xl" />
              <SkeletonBar className="h-10 w-28 rounded-2xl" />
            </div>
          </div>
          <div className="grid gap-4">
            {Array.from({ length: count }).map((_, index) => (
              <CertificateListSkeleton key={index} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (variant === "api-keys") {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <SkeletonBar className="h-7 w-44" />
              <SkeletonBar className="h-4 w-96 max-w-full" />
            </div>
            <SkeletonBar className="h-10 w-36 rounded-xl" />
          </div>

          <SkeletonCard className="rounded-2xl p-6">
            <div className="space-y-4">
              <SkeletonBar className="h-5 w-48" />
              <div className="flex flex-col gap-4 sm:flex-row">
                <SkeletonBar className="h-10 flex-1 rounded-xl" />
                <SkeletonBar className="h-10 w-40 rounded-xl" />
                <SkeletonBar className="h-10 w-24 rounded-xl" />
              </div>
            </div>
          </SkeletonCard>

          <div className="grid gap-4">
            {Array.from({ length: count }).map((_, index) => (
              <ApiKeyCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return null;
}

export default SectionLoadingState;
