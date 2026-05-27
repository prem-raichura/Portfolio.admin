import {
  BarChart3,
  BriefcaseBusiness,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";

import { useLocation } from "react-router-dom";

import SidebarItem from "./SidebarItem";

import PageLoader from "../ui/PageLoader";

import { usePageNavigation } from "../../hooks/usePageNavigation";

function Sidebar({
  sidebarOpen,
}: {
  sidebarOpen: boolean;
}) {
  const location = useLocation();
  const { loading, } = usePageNavigation();

  return (
    <>
    {loading && <PageLoader />}
    <aside
      className={`
        hidden
        border-r
        border-[var(--border-color)]
        bg-[var(--bg-card)]
        transition-all
        duration-300
        lg:flex
        lg:flex-col
        ${
          sidebarOpen
            ? "w-72"
            : "w-24"
        }
      `}
    >
      {/* =========================
          LOGO
      ========================= */}

      <div
        className="
          flex
          h-16
          items-center
          border-b
          border-[var(--border-color)]
          px-6
        "
      >
        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-2xl
            bg-[var(--button-primary)]
            text-lg
            font-bold
            text-white
            dark:text-black
          "
        >
          P
        </div>

        {sidebarOpen && (
          <div className="ml-3">

            <h1 className="font-semibold">
              Portfolio Admin
            </h1>

            <p
              className="
                text-xs
                text-[var(--text-secondary)]
              "
            >
              Developer Platform
            </p>

          </div>
        )}
      </div>

      {/* =========================
          NAVIGATION
      ========================= */}

      <div className="flex-1 p-4">

        <div className="space-y-2">

          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            path="/dashboard"
            active={
              location.pathname ===
              "/dashboard"
            }
            sidebarOpen={sidebarOpen}
          />

          <SidebarItem
            icon={<FolderKanban size={20} />}
            label="Projects"
            path="/projects"
            active={
              location.pathname ===
              "/projects"
            }
            sidebarOpen={sidebarOpen}
          />

          <SidebarItem
            icon={<FileText size={20} />}
            label="Research Papers"
            path="/research"
            active={
              location.pathname ===
              "/research"
            }
            sidebarOpen={sidebarOpen}
          />

          <SidebarItem
            icon={<BriefcaseBusiness size={20} />}
            label="Experience"
            path="/experience"
            active={
              location.pathname ===
              "/experience"
            }
            sidebarOpen={sidebarOpen}
          />

          <SidebarItem
            icon={<BarChart3 size={20} />}
            label="Analytics"
            path="/analytics"
            active={
              location.pathname ===
              "/analytics"
            }
            sidebarOpen={sidebarOpen}
          />

          <SidebarItem
            icon={<Settings size={20} />}
            label="Settings"
            path="/settings"
            active={
              location.pathname ===
              "/settings"
            }
            sidebarOpen={sidebarOpen}
          />

        </div>
      </div>

      {/* =========================
          BOTTOM
      ========================= */}

      <div
        className="
          border-t
          border-[var(--border-color)]
          p-4
        "
      >
        <SidebarItem
          icon={<LogOut size={20} />}
          label="Logout"
          path="/login"
          sidebarOpen={sidebarOpen}
        />
      </div>
    </aside>
    </>
  );
}

export default Sidebar;