import {
  Bell,
  Menu,
  Moon,
  Search,
  Sun,
} from "lucide-react";

import { useTheme } from "next-themes";

import { useLocation } from "react-router-dom";

import PageLoader from "../ui/PageLoader";
import { usePageNavigation } from "../../hooks/usePageNavigation";

function Navbar({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (
    value: boolean
  ) => void;
}) {
  const { theme, setTheme } =
    useTheme();

  const { loading } =
    usePageNavigation();

  const location = useLocation();

  // Dynamic Page Title

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";

      case "/projects":
        return "Projects";

      case "/projects/create":
        return "Create Project";

      case "/experience":
        return "Experience";

      default:
        return "Portfolio Admin";
    }
  };

  return (
    <>
      {loading && <PageLoader />}

      <header
        className="
          sticky
          top-0
          z-40
          flex
          h-16
          items-center
          justify-between
          border-b
          border-[var(--border-color)]
          bg-[var(--bg-card)]/80
          px-6
          backdrop-blur
        "
      >
        {/* LEFT */}

        <div className="flex items-center gap-4">

          {/* SIDEBAR TOGGLE */}

          <button
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen
              )
            }
            className="
              rounded-xl
              border
              border-[var(--border-color)]
              bg-[var(--bg-card)]
              p-2
            "
          >
            <Menu size={20} />
          </button>

          {/* PAGE TITLE */}

          <div className="hidden md:block">

            <h1 className="text-xl font-bold">
              {getPageTitle()}
            </h1>

            <p
              className="
                text-sm
                text-[var(--text-secondary)]
              "
            >
              Manage your portfolio content
            </p>

          </div>

          {/* SEARCH */}

          <div
            className="
              hidden
              items-center
              gap-3
              rounded-2xl
              border
              border-[var(--border-color)]
              bg-[var(--bg-main)]
              px-4
              py-2
              lg:flex
            "
          >
            <Search
              size={18}
              className="
                text-[var(--text-secondary)]
              "
            />

            <input
              type="text"
              placeholder="Search..."
              className="
                bg-transparent
                outline-none
                placeholder:text-[var(--text-muted)]
              "
            />
          </div>

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-3">

          {/* THEME TOGGLE */}

          <button
            onClick={() =>
              setTheme(
                theme === "dark"
                  ? "light"
                  : "dark"
              )
            }
            className="
              relative
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              border
              border-[var(--border-color)]
              bg-[var(--bg-card)]
            "
          >
            <Sun
              size={18}
              className={`
                absolute
                transition-all
                duration-500
                ${
                  theme === "dark"
                    ? "scale-0 rotate-90 opacity-0"
                    : "scale-100 opacity-100 text-amber-500"
                }
              `}
            />

            <Moon
              size={18}
              className={`
                absolute
                transition-all
                duration-500
                ${
                  theme === "dark"
                    ? "scale-100 opacity-100 text-slate-300"
                    : "scale-0 opacity-0"
                }
              `}
            />
          </button>

          {/* NOTIFICATIONS */}

          <button
            className="
              relative
              rounded-2xl
              border
              border-[var(--border-color)]
              bg-[var(--bg-card)]
              p-3
            "
          >
            <Bell size={18} />

            <div
              className="
                absolute
                right-2
                top-2
                h-2
                w-2
                rounded-full
                bg-red-500
              "
            />
          </button>

          {/* PROFILE */}

          <div
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-[var(--border-color)]
              bg-[var(--bg-card)]
              px-3
              py-2
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[var(--button-primary)]
                font-semibold
                text-white
                dark:text-black
              "
            >
              P
            </div>

            <div className="hidden lg:block">

              <h3 className="text-sm font-medium">
                Prem Raichura
              </h3>

              <p
                className="
                  text-xs
                  text-[var(--text-secondary)]
                "
              >
                Administrator
              </p>

            </div>
          </div>

        </div>
      </header>
    </>
  );
}

export default Navbar;