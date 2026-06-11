/**
 * CardSkeletons.tsx
 *
 * A single global skeleton-loader library that exactly mirrors
 * every card in /shared/components/cards:
 *
 *  - AchievementCard  → AchievementCardSkeleton
 *  - ExperienceCard   → ExperienceCardSkeleton
 *  - PortfolioItemCard→ PortfolioItemCardSkeleton
 *  - StatCard         → StatCardSkeleton
 *
 * Each skeleton is exported both individually (use them inline) and
 * collected inside <CardSkeletonGrid> for full-page loading states.
 */

/* ─────────────────────────────────────────────────────────────
   Base primitives (no animation class — add animate-pulse on wrapper)
───────────────────────────────────────────────────────────── */

function Bone({ className = "" }: { className?: string }) {
  return <div className={`rounded bg-[var(--bg-secondary)] ${className}`} />;
}

function BoneRound({ className = "" }: { className?: string }) {
  return <div className={`rounded-full bg-[var(--bg-secondary)] ${className}`} />;
}

function BoneXl({ className = "" }: { className?: string }) {
  return <div className={`rounded-xl bg-[var(--bg-secondary)] ${className}`} />;
}

/* ─────────────────────────────────────────────────────────────
   Shared card shell (matches rounded-[32px] border bg-[var(--bg-card)])
───────────────────────────────────────────────────────────── */

function CardShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[32px] border border-[var(--border-color)] bg-[var(--bg-card)] ${className}`}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   1. AchievementCard skeleton
   DOM structure:
     <div rounded-[32px] overflow-hidden>
       <div h-52>               ← image / gradient header
         <div badge top-left>
       <div p-6>
         <div flex justify-between>
           <div> title + issued-by
           <button star>
         <div border-t pt-5 flex justify-between>
           date | actions (link? edit delete)
═══════════════════════════════════════════════════════════ */

export function AchievementCardSkeleton() {
  return (
    <CardShell>
      {/* Header */}
      <div className="relative h-52 bg-[var(--bg-secondary)]">
        {/* Type badge top-left */}
        <BoneRound className="absolute left-4 top-4 h-6 w-20" />
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Title row */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <Bone className="h-6 w-3/4" />
            <Bone className="h-4 w-1/2" />
          </div>
          {/* Star button */}
          <BoneXl className="h-9 w-9 shrink-0" />
        </div>

        {/* Footer */}
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-[var(--border-color)] pt-5">
          {/* Date */}
          <Bone className="h-4 w-28" />
          {/* Actions */}
          <div className="flex items-center gap-2">
            <BoneXl className="h-9 w-9" />
            <BoneXl className="h-9 w-9" />
            <BoneXl className="h-9 w-9" />
          </div>
        </div>
      </div>
    </CardShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   2. ExperienceCard skeleton
   DOM structure:
     <div rounded-[32px] overflow-hidden>
       <div h-52>               ← indigo-purple gradient header
         <div Current badge top-left>
         <div mode badge top-right>
       <div p-6>
         <div flex justify-between>
           <div> company + title
           <div shrink-0> location + mode meta
         <p description>
         <div links>
         <div border-t pt-5 flex justify-between>
           date | actions (edit delete)
═══════════════════════════════════════════════════════════ */

export function ExperienceCardSkeleton() {
  return (
    <CardShell>
      {/* Header */}
      <div className="relative h-52 bg-[var(--bg-secondary)]">
        {/* "Current" badge top-left */}
        <BoneRound className="absolute left-4 top-4 h-6 w-16" />
        {/* mode badge top-right */}
        <BoneRound className="absolute right-4 top-4 h-6 w-20" />
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Title row */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <Bone className="h-6 w-3/5" />
            <Bone className="h-4 w-2/5" />
          </div>
          {/* Location / mode meta (right side) */}
          <div className="flex shrink-0 flex-col items-end gap-2">
            <Bone className="h-3 w-20" />
            <Bone className="h-3 w-16" />
          </div>
        </div>

        {/* Description lines */}
        <div className="mt-3 space-y-2">
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-5/6" />
          <Bone className="h-4 w-4/6" />
        </div>

        {/* Links */}
        <div className="mt-3 flex flex-wrap gap-2">
          <BoneXl className="h-6 w-20" />
          <BoneXl className="h-6 w-16" />
        </div>

        {/* Footer */}
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-[var(--border-color)] pt-5">
          {/* Date */}
          <Bone className="h-4 w-36" />
          {/* Actions */}
          <div className="flex items-center gap-2">
            <BoneXl className="h-9 w-9" />
            <BoneXl className="h-9 w-9" />
          </div>
        </div>
      </div>
    </CardShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   3. PortfolioItemCard skeleton
   DOM structure:
     <div rounded-[32px] overflow-hidden>
       <div h-52>               ← thumbnail / gradient header
         <div status badge top-right>
       <div p-6>
         <div flex justify-between>
           <div> title + metaLabel
           <button star>
         <p description>
         <div tags flex-wrap mt-5>
         <div border-t mt-6 pt-5 flex justify-between>
           date | actions (github, external, edit, delete)
═══════════════════════════════════════════════════════════ */

export function PortfolioItemCardSkeleton() {
  return (
    <CardShell>
      {/* Header */}
      <div className="relative h-52 bg-[var(--bg-secondary)]">
        {/* Status badge top-right */}
        <BoneRound className="absolute right-4 top-4 h-6 w-20" />
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Title row */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <Bone className="h-6 w-3/4" />
            <Bone className="h-3 w-1/3" />
          </div>
          {/* Star / featured button */}
          <BoneXl className="h-9 w-9 shrink-0" />
        </div>

        {/* Description */}
        <div className="mt-3 space-y-2">
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-5/6" />
          <Bone className="h-4 w-4/6" />
        </div>

        {/* Tags */}
        <div className="mt-5 flex flex-wrap gap-2">
          <BoneRound className="h-6 w-16" />
          <BoneRound className="h-6 w-20" />
          <BoneRound className="h-6 w-14" />
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-color)] pt-5">
          {/* Date */}
          <Bone className="h-4 w-28" />
          {/* Actions: github, external, edit, delete */}
          <div className="flex items-center gap-2">
            <BoneXl className="h-9 w-9" />
            <BoneXl className="h-9 w-9" />
            <BoneXl className="h-9 w-9" />
            <BoneXl className="h-9 w-9" />
          </div>
        </div>
      </div>
    </CardShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   4. StatCard skeleton
   DOM structure:
     <div rounded-2xl border p-5>
       <div flex justify-between>
         <div icon h-11 w-11 rounded-xl>
         <div growth-badge rounded-full>
       <div mt-4>
         <p title xs uppercase>
         <h3 value 2xl bold>
         <div mini progress bar h-1>
═══════════════════════════════════════════════════════════ */

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
      {/* Top row: icon + growth badge */}
      <div className="flex items-start justify-between">
        <BoneXl className="h-11 w-11" />
        <BoneRound className="h-6 w-16" />
      </div>

      {/* Content */}
      <div className="mt-4 space-y-2">
        <Bone className="h-3 w-24" />
        <Bone className="h-7 w-20" />
        {/* Progress bar */}
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[var(--bg-secondary)]">
          <div className="h-full w-2/3 rounded-full bg-[var(--bg-tertiary,var(--bg-secondary))]" />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   5. Convenience grid wrapper — renders N skeletons of a given type
   Usage:
     <CardSkeletonGrid type="achievement" count={6} />
     <CardSkeletonGrid type="experience"  count={3} />
     <CardSkeletonGrid type="portfolio"   count={6} />
     <CardSkeletonGrid type="stat"        count={4} cols={4} />
═══════════════════════════════════════════════════════════ */

export type CardSkeletonType =
  | "achievement"
  | "experience"
  | "portfolio"
  | "stat";

export function CardSkeletonGrid({
  type,
  count = 6,
  cols,
}: {
  type: CardSkeletonType;
  count?: number;
  /** Override tailwind grid-cols class e.g. "xl:grid-cols-4" */
  cols?: string;
}) {
  const defaultCols: Record<CardSkeletonType, string> = {
    achievement: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
    experience:  "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
    portfolio:   "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
    stat:        "grid-cols-2 xl:grid-cols-4",
  };

  const skeletonMap: Record<CardSkeletonType, React.FC> = {
    achievement: AchievementCardSkeleton,
    experience:  ExperienceCardSkeleton,
    portfolio:   PortfolioItemCardSkeleton,
    stat:        StatCardSkeleton,
  };

  const Skeleton = skeletonMap[type];
  const gridClass = cols ?? defaultCols[type];

  return (
    <div className={`grid gap-6 animate-pulse ${gridClass}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} />
      ))}
    </div>
  );
}
