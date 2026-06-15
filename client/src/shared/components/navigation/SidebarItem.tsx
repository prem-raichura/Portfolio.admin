import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

function SidebarItem({
  icon,
  label,
  active,
  sidebarOpen,
  path,
  onClick,
  badge,
}: {
  icon:        ReactNode;
  label:       string;
  active?:     boolean;
  sidebarOpen: boolean;
  path:        string;
  onClick?:    () => void;
  /** Optional unread/notification count rendered next to the icon. */
  badge?:      number;
}) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        navigate(path);
        onClick?.();
      }}
      data-tooltip={!sidebarOpen ? label : undefined}
      className={`
        relative flex w-full items-center gap-3
        rounded-xl px-3 py-2.5
        text-sm font-medium
        transition-all duration-200 ease-in-out
        overflow-hidden
        ${active
          ? "text-white"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
        }
        ${!sidebarOpen ? "justify-center" : ""}
      `}
      style={
        active
          ? {
              background: "linear-gradient(135deg, var(--grad-start), var(--grad-end))",
              boxShadow:  "0 4px 14px var(--accent-glow)",
            }
          : undefined
      }
    >
      {/* Icon (with optional collapsed-state badge dot) */}
      <span
        className={`relative shrink-0 transition-all duration-200 ${
          active ? "text-white" : ""
        }`}
      >
        {icon}
        {badge !== undefined && badge > 0 && !sidebarOpen && (
          <span
            className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
            style={{
              background: "var(--danger, #ef4444)",
              boxShadow: "0 0 0 2px var(--bg-sidebar, var(--bg-main))",
            }}
          >
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </span>

      {/* Label */}
      {sidebarOpen && (
        <span className="flex flex-1 items-center justify-between gap-2 truncate">
          <span className="truncate">{label}</span>
          {badge !== undefined && badge > 0 && (
            <span
              className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                active ? "bg-white/25 text-white" : "text-white"
              }`}
              style={
                active
                  ? undefined
                  : {
                      background: "var(--danger, #ef4444)",
                    }
              }
            >
              {badge > 99 ? "99+" : badge}
            </span>
          )}
        </span>
      )}

      {/* Active shimmer overlay */}
      {active && (
        <span
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          }}
        />
      )}
    </button>
  );
}

export default SidebarItem;
