import {
  Award,
  BriefcaseBusiness,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Key,
  Mail,
  Trash2,
  X,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useEffect, useState } from "react";

import SidebarItem from "./SidebarItem";

import { getContacts } from "@features/contacts/services/contact.service";

const NAV_ITEMS = [
  {
    icon: <LayoutDashboard size={20} />,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <FolderKanban size={20} />,
    label: "Projects",
    path: "/projects",
  },
  {
    icon: <BriefcaseBusiness size={20} />,
    label: "Experience",
    path: "/experience",
  },
  {
    icon: <Award size={20} />,
    label: "Certificates",
    path: "/certificates",
  },
  {
    icon: <Key size={20} />,
    label: "API Keys",
    path: "/api-keys",
  },
  {
    icon: <Mail size={20} />,
    label: "Contacts",
    path: "/contacts",
  },
];

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadContacts, setUnreadContacts] = useState(0);

  // Refresh the unread badge on mount and whenever the route changes so that
  // opening a contact (which marks it read on the server) reflects here too.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await getContacts();
        if (!alive || !res.success) return;
        const unread = res.contacts.filter((c) => !c.is_read).length;
        setUnreadContacts(unread);
      } catch {
        // Stay silent — sidebar shouldn't toast for a background fetch.
      }
    })();
    return () => {
      alive = false;
    };
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col
          lg:relative lg:flex
          border-r border-[var(--border-color)]
          bg-[var(--bg-sidebar)]
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0 w-[260px]" : "-translate-x-full lg:translate-x-0 lg:w-[72px]"}
        `}
        style={{ backdropFilter: "blur(20px)" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-none"
          style={{
            background: "linear-gradient(90deg, var(--grad-start), var(--grad-end))",
          }}
        />

        <div
          className={`
            flex h-16 items-center gap-3
            border-b border-[var(--border-color)]
            ${sidebarOpen ? "px-5" : "justify-center px-0"}
          `}
        >
          <div
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-white text-base"
            style={{
              background: "linear-gradient(135deg, var(--grad-start), var(--grad-end))",
              boxShadow: "0 4px 14px var(--accent-glow)",
            }}
          >
            P
            <div
              className="absolute inset-0 rounded-xl opacity-40 animate-pulse"
              style={{ background: "linear-gradient(135deg, var(--grad-start), var(--grad-end))" }}
            />
          </div>

          {sidebarOpen && (
            <div className="min-w-0 flex-1">
              <h1 className="text-sm font-semibold leading-tight text-[var(--text-primary)] truncate">
                PortOS
              </h1>
              <p className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                Developer Platform
              </p>
            </div>
          )}

          {/* Mobile close button */}
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={
                item.path === "/certificates"
                  ? location.pathname.startsWith("/certificates")
                  : item.path === "/api-keys"
                    ? location.pathname.startsWith("/api-keys")
                    : location.pathname === item.path
              }
              sidebarOpen={sidebarOpen}
              badge={item.path === "/contacts" ? unreadContacts : undefined}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setSidebarOpen(false);
                }
              }}
            />
          ))}
        </nav>

        <div className="border-t border-[var(--border-color)] p-3 space-y-2">
          <button
            onClick={() => {
              navigate("/bin");
              if (window.innerWidth < 1024) {
                setSidebarOpen(false);
              }
            }}
            data-tooltip={!sidebarOpen ? "Bin" : undefined}
            className={`
              flex w-full items-center gap-3 rounded-xl px-3 py-2.5
              text-sm font-medium transition-all duration-200
              ${
                location.pathname === "/bin"
                  ? "bg-[var(--accent-light)] text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)]"
              }
              ${!sidebarOpen ? "justify-center" : ""}
            `}
          >
            <Trash2 size={18} />
            {sidebarOpen && <span>Bin</span>}
          </button>

          <button
            onClick={() => {
              navigate("/logout");
              if (window.innerWidth < 1024) {
                setSidebarOpen(false);
              }
            }}
            data-tooltip={!sidebarOpen ? "Logout" : undefined}
            className={`
              flex w-full items-center gap-3 rounded-xl px-3 py-2.5
              text-sm font-medium text-[var(--text-secondary)]
              transition-all duration-200
              hover:bg-[var(--danger-light)] hover:text-[var(--danger)]
              ${!sidebarOpen ? "justify-center" : ""}
            `}
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
