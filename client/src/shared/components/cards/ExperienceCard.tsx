import {
  Calendar,
  ExternalLink,
  MapPin,
  Pencil,
  Trash2,
  Briefcase,
  Monitor,
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

  const hasActions = Boolean(editAction || deleteAction);
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

  const dateLabel = `${formatDate(start_date)} – ${is_current ? "Present" : end_date ? formatDate(end_date) : "N/A"}`;

  return (
    <div
      className="
        flex
        h-full
        flex-col
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
      <div
        className="
          relative
          h-52
          overflow-hidden
          bg-[var(--bg-secondary)]
        "
      >
        {mainImage && !imageFailed ? (
          <img
            src={mainImage}
            alt={company}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="
              flex
              h-full
              w-full
              items-center
              justify-center
              bg-gradient-to-br
              from-indigo-600
              to-purple-600
            "
          >
            <Briefcase size={48} className="text-white/30" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/10" />

        {is_current && (
          <div
            className="
              absolute
              left-4
              top-4
              rounded-full
              bg-green-500/15
              px-3
              py-1
              text-xs
              font-medium
              text-green-600
              backdrop-blur-sm
            "
          >
            Current
          </div>
        )}

        {mode && (
          <div
            className="
              absolute
              right-4
              top-4
              rounded-full
              bg-[var(--bg-card)]/90
              px-3
              py-1
              text-xs
              font-medium
              text-[var(--text-secondary)]
              backdrop-blur-sm
            "
          >
            {mode}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div>
          <div className="min-w-0">
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">
              {company}
            </h3>
            <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">
              {title}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-medium text-[var(--text-muted)]">
          {location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={13} />
              <span>{location}</span>
            </div>
          )}

          {mode && (
            <div className="flex items-center gap-1.5">
              <Monitor size={13} />
              <span className="capitalize">{mode}</span>
            </div>
          )}
        </div>

        {description && (
          <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
            {description}
          </p>
        )}

        {links && links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
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

        <div
          className="
            mt-6
            flex
            items-center
            justify-between
            gap-4
            border-t
            border-[var(--border-color)]
            pt-4
          "
        >
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]">
            <Calendar size={14} />
            <span>{dateLabel}</span>
          </div>

          {hasActions && (
            <div className="flex items-center gap-1.5">
              {editAction && (
                <button
                  type="button"
                  onClick={editAction.onClick}
                  className="
                    rounded-xl
                    border
                    border-[var(--border-color)]
                    p-2
                    text-[var(--text-secondary)]
                    transition-all
                    duration-300
                    hover:bg-[var(--bg-secondary)]
                  "
                  title="Edit Experience"
                  aria-label="Edit Experience"
                >
                  <Pencil size={15} />
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
                  title="Delete Experience"
                  aria-label="Delete Experience"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExperienceCard;
