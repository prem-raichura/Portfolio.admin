import {
  Briefcase,
  Calendar,
  ExternalLink,
  MapPin,
  Monitor,
  Pencil,
  Trash2,
} from "lucide-react";

import { useState } from "react";

export interface ExperienceLink {
  key: string;
  value: string;
}

type CardAction = {
  onClick: () => void;
};

interface ExperienceCardProps {
  title: string;
  company: string;
  description?: string | null;
  start_date: string;
  end_date?: string | null;
  is_current?: boolean;
  location?: string | null;
  mode?: string | null;
  images?: string[] | null;
  links?: ExperienceLink[] | null;
  editAction?: CardAction;
  deleteAction?: CardAction;
}

function ExperienceCard({
  title,
  company,
  description,
  start_date,
  end_date,
  is_current,
  location,
  mode,
  images,
  links,
  editAction,
  deleteAction,
}: ExperienceCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const mainImage = images && images.length > 0 ? images[0] : null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return "Invalid Date";
      return new Intl.DateTimeFormat("en", {
        month: "short",
        year: "numeric",
      }).format(date);
    } catch {
      return "Invalid Date";
    }
  };

  const dateLabel = `${formatDate(start_date)} – ${
    is_current ? "Present" : end_date ? formatDate(end_date) : "N/A"
  }`;

  return (
    <div
      className="
        overflow-hidden
        rounded-[32px]
        border
        border-[var(--border-color)]
        bg-[var(--bg-card)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* ── Header image / gradient (same h-52 as AchievementCard) ── */}
      <div className="relative h-52 bg-gradient-to-br from-indigo-600 to-purple-600">
        {mainImage && !imageFailed ? (
          <img
            src={mainImage}
            alt={company}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Briefcase size={52} className="text-white/25" />
          </div>
        )}

        {/* Subtle dark overlay */}
        <div className="absolute inset-0 bg-black/15" />

        {/* Current badge (top-left) — mirrors type badge in AchievementCard */}
        {is_current && (
          <div
            className="
              absolute
              left-4
              top-4
              rounded-full
              bg-green-100
              px-3
              py-1
              text-xs
              font-medium
              text-green-700
            "
          >
            Current
          </div>
        )}

        {/* Mode badge (top-right) */}
        {mode && (
          <div
            className="
              absolute
              right-4
              top-4
              rounded-full
              bg-white/15
              px-3
              py-1
              text-xs
              font-medium
              text-white
              backdrop-blur-sm
            "
          >
            {mode}
          </div>
        )}
      </div>

      {/* ── Body (p-6, same as AchievementCard) ── */}
      <div className="p-6">
        {/* Title row */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-xl font-semibold">{company}</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{title}</p>
          </div>

          {/* Location / mode meta */}
          <div className="flex shrink-0 flex-col items-end gap-1 text-right">
            {location && (
              <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                <MapPin size={12} />
                {location}
              </span>
            )}
            {mode && (
              <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                <Monitor size={12} />
                <span className="capitalize">{mode}</span>
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            {description}
          </p>
        )}

        {/* Links */}
        {links && links.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {links.map((link) => (
              <a
                key={link.key}
                href={link.value}
                target="_blank"
                rel="noreferrer"
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-xl
                  border
                  border-[var(--border-color)]
                  bg-[var(--bg-secondary)]
                  px-2.5
                  py-1
                  text-xs
                  font-medium
                  text-[var(--text-primary)]
                  transition-colors
                  hover:bg-[var(--bg-card)]
                "
              >
                <span className="capitalize">{link.key}</span>
                <ExternalLink size={11} className="opacity-70" />
              </a>
            ))}
          </div>
        )}

        {/* ── Footer (border-top, same as AchievementCard) ── */}
        <div
          className="
            mt-5
            border-t
            border-[var(--border-color)]
            pt-5
            flex
            flex-wrap
            items-end
            justify-between
            gap-4
            text-sm
            text-[var(--text-secondary)]
          "
        >
          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar size={15} />
            {dateLabel}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {editAction && (
              <button
                type="button"
                onClick={editAction.onClick}
                className="
                  rounded-xl
                  border
                  border-[var(--border-color)]
                  p-2
                  transition-all
                  duration-300
                  hover:bg-[var(--bg-secondary)]
                "
                aria-label="Edit experience"
                title="Edit experience"
              >
                <Pencil size={16} />
              </button>
            )}

            {deleteAction && (
              <button
                type="button"
                onClick={deleteAction.onClick}
                className="
                  rounded-xl
                  border
                  border-red-200
                  p-2
                  text-red-500
                  transition-all
                  duration-300
                  hover:bg-red-50
                "
                aria-label="Delete experience"
                title="Delete experience"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExperienceCard;
