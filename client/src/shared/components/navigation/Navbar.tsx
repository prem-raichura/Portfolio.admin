import {
  Bell,
  CheckCheck,
  Loader,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";

import { useTheme } from "next-themes";
import {
  useEffect,
  useState,
  useRef,
  useCallback,
  type FormEvent,
} from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  notificationService,
  type Notification,
} from "../../../features/notifications/services/notification.service";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function notifTypeColor(type: string): string {
  switch (type) {
    case "success": return "var(--success)";
    case "warning": return "var(--warning)";
    case "error": return "var(--danger)";
    default: return "var(--accent)";
  }
}

function Navbar({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen:    boolean;
  setSidebarOpen: (value: boolean) => void;
}) {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifLoading, setNotifLoading] = useState(false);
  const [user] = useState<{ name: string; avatar: string | null }>(() => {
    const storedName   = localStorage.getItem("userName");
    const storedAvatar = localStorage.getItem("userAvatar");
    return {
      name: storedName || "Admin User",
      avatar: storedAvatar || null,
    };
  });

  const notifRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setNotifLoading(true);
      const [notifs, count] = await Promise.all([
        notificationService.getAll(),
        notificationService.getUnreadCount(),
      ]);
      setNotifications(notifs);
      setUnreadCount(count);
    } catch {
      // Silently fail
    } finally {
      setNotifLoading(false);
    }
  }, []);

  // Close notif dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch notifications on mount and poll every 30s
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Silently fail
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    } catch {
      // Silently fail
    }
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearchQuery("");
    }
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header
      className="sticky top-0 z-40 flex h-16 items-center justify-between px-5 lg:px-6"
      style={{
        background:     "var(--bg-navbar)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom:   "1px solid var(--border-color)",
      }}
    >
      {/* ── LEFT ── */}
      <div className="flex items-center gap-3">
        {/* Sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="
            flex h-9 w-9 items-center justify-center rounded-xl
            border border-[var(--border-color)] bg-[var(--bg-card)]
            text-[var(--text-secondary)]
            transition-all duration-200
            hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)]
          "
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>

        {/* Search */}
        <form
          onSubmit={handleSearchSubmit}
          className={`
            hidden items-center gap-2.5 rounded-xl px-3.5 py-2 lg:flex
            border transition-all duration-200
            ${searchFocused
              ? "border-[var(--accent)] bg-[var(--bg-card)] shadow-[0_0_0_3px_var(--accent-glow)]"
              : "border-[var(--border-color)] bg-[var(--bg-secondary)]"
            }
          `}
        >
          <Search
            size={16}
            className={`transition-colors duration-200 ${
              searchFocused ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
            }`}
          />
          <input
            type="text"
            placeholder="Search everything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="
              w-48 bg-transparent text-sm text-[var(--text-primary)]
              outline-none placeholder:text-[var(--text-muted)]
              transition-all duration-200 focus:w-64
            "
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </form>
      </div>

      {/* ── RIGHT ── */}
      <div className="flex items-center gap-2">

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="
            relative flex h-9 w-9 items-center justify-center rounded-xl
            border border-[var(--border-color)] bg-[var(--bg-card)]
            text-[var(--text-secondary)]
            transition-all duration-200
            hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)]
          "
          aria-label="Toggle theme"
        >
          <Sun
            size={17}
            className={`absolute transition-all duration-500 ${
              theme === "dark"
                ? "scale-0 rotate-90 opacity-0"
                : "scale-100 rotate-0 opacity-100 text-amber-500"
            }`}
          />
          <Moon
            size={17}
            className={`absolute transition-all duration-500 ${
              theme === "dark"
                ? "scale-100 rotate-0 opacity-100 text-indigo-400"
                : "scale-0 -rotate-90 opacity-0"
            }`}
          />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="
              relative flex h-9 w-9 items-center justify-center rounded-xl
              border border-[var(--border-color)] bg-[var(--bg-card)]
              text-[var(--text-secondary)]
              transition-all duration-200
              hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)]
            "
            aria-label="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--danger)] px-1 text-[10px] font-bold leading-none text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {showNotif && (
            <div
              className="
                absolute right-0 top-full mt-2 w-80 rounded-2xl border border-[var(--border-color)]
                bg-[var(--bg-card)] p-3 shadow-[var(--shadow-xl)]
                animate-fade-in-up
              "
              style={{ zIndex: 50 }}
            >
              {/* Header */}
              <div className="mb-2 flex items-center justify-between px-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Notifications
                </p>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-1 text-xs text-[var(--accent)] hover:underline"
                  >
                    <CheckCheck size={13} />
                    Mark all read
                  </button>
                )}
              </div>

              {/* Body */}
              {notifLoading && notifications.length === 0 ? (
                <div className="flex items-center justify-center py-6">
                  <Loader size={18} className="animate-spin text-[var(--text-muted)]" />
                </div>
              ) : notifications.length === 0 ? (
                <p className="py-6 text-center text-sm text-[var(--text-muted)]">
                  No notifications yet
                </p>
              ) : (
                <div className="max-h-80 space-y-1 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => !n.is_read && handleMarkAsRead(n.id)}
                      className={`
                        flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors
                        ${n.is_read ? "opacity-60" : "cursor-pointer hover:bg-[var(--bg-secondary)]"}
                      `}
                    >
                      <span
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                        style={{ background: notifTypeColor(n.type) }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                          {n.title}
                        </p>
                        {n.message && (
                          <p className="truncate text-xs text-[var(--text-muted)]">
                            {n.message}
                          </p>
                        )}
                        <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">
                          {timeAgo(n.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile */}
        <Link
          to="/profile"
          className="
            flex items-center gap-2.5 rounded-xl px-2.5 py-1.5
            border border-[var(--border-color)] bg-[var(--bg-card)]
            transition-all duration-200
            hover:border-[var(--accent)] hover:bg-[var(--accent-light)]
          "
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-7 w-7 rounded-lg object-cover"
            />
          ) : (
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, var(--grad-start), var(--grad-end))",
              }}
            >
              {initials}
            </div>
          )}

          <div className="hidden lg:block">
            <p className="text-sm font-semibold leading-tight text-[var(--text-primary)]">
              {user.name.split(" ")[0]}
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">Admin</p>
          </div>
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
