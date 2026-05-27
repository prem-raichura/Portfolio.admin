import {
  ArrowRight,
  BarChart3,
  Moon,
  ShieldCheck,
  Sun,
} from "lucide-react";

import { useTheme } from "next-themes";

import { useNavigate } from "react-router-dom";

import { useState } from "react";

import PageLoader from "../components/ui/PageLoader";
import UserChart from "../components/ui/UserChart";

function App() {
  const { theme, setTheme } = useTheme();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleNavigation = (path: string) => {
    setLoading(true);

    setTimeout(() => {
      navigate(path);
    }, 700);
  };

  const stats = [
    {
      icon: <BarChart3 size={26} />,
      value: "4+",
      label: "Users",
    },
    {
      icon: <ShieldCheck size={26} />,
      value: "99.9%",
      label: "System Health",
    },
  ];

  return (
    <>
      {loading && <PageLoader />}

      <div
        className="
          relative
          isolate
          min-h-screen
          overflow-hidden
          bg-white/60
          dark:bg-black/8
          backdrop-blur-sm
          text-[var(--text-primary)]
          transition-colors
          duration-300
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-50
            blur-sm
            mix-blend-normal
            bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(255,240,230,0.06),transparent_36%)]
            dark:opacity-30
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            h-24
            bg-gradient-to-b
            from-white/35
            to-transparent
            dark:from-white/5
          "
        />

        {/* NAVBAR */}

        <header
          className="
            sticky
            top-0
            z-50
            border-b
            border-[var(--border-color)]
            bg-[var(--bg-card)]/78
            backdrop-blur
          "
        >
          <div
            className="
              mx-auto
              flex
              h-16
              max-w-7xl
              items-center
              justify-between
              px-4
              sm:px-6
              lg:px-8
            "
          >
            {/* Logo */}

            <a
              onClick={() => navigate("/")}
              className="
                flex
                cursor-pointer
                items-center
                gap-3
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
                  bg-[linear-gradient(135deg,var(--button-primary)_0%,var(--accent-secondary)_100%)]
                  text-lg
                  font-bold
                  text-white
                "
              >
                P
              </div>

              <div>
                <h1 className="text-lg font-semibold">
                  Portfolio Admin
                </h1>

                <p
                  className="
                    text-xs
                    text-[var(--text-secondary)]
                  "
                >
                  Developer Portfolio Platform
                </p>
              </div>
            </a>

            {/* Actions */}

            <div className="flex items-center gap-3">
              {/* Theme Toggle */}

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
                  bg-[var(--bg-card)]/95
                  transition-all
                  duration-300
                  hover:scale-105
                "
              >
                {/* Sun */}

                <Sun
                  size={19}
                  className={`
                    absolute
                    transition-all
                    duration-500
                    ${
                      theme === "dark"
                        ? "scale-0 rotate-90 opacity-0"
                        : "scale-100 rotate-0 opacity-100 text-amber-500"
                    }
                  `}
                />

                {/* Moon */}

                <Moon
                  size={19}
                  className={`
                    absolute
                    transition-all
                    duration-500
                    ${
                      theme === "dark"
                        ? "scale-100 rotate-0 opacity-100 text-slate-300"
                        : "scale-0 -rotate-90 opacity-0"
                    }
                  `}
                />
              </button>

              {/* Register */}

              <button
                onClick={() =>
                  handleNavigation("/register")
                }
                className="
                  rounded-2xl
                  border
                  border-[var(--border-color)]
                  bg-white/70
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  transition-all
                  duration-300
                  hover:bg-[var(--bg-secondary)]
                  dark:bg-[var(--bg-card)]
                "
              >
                Register
              </button>

              {/* Login */}

              <button
                onClick={() =>
                  handleNavigation("/login")
                }
                className="
                  rounded-2xl
                  bg-[linear-gradient(135deg,var(--button-primary)_0%,var(--accent-primary)_100%)]
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition-all
                  duration-300
                  hover:bg-[var(--button-primary-hover)]
                "
              >
                Login
              </button>
            </div>
          </div>
        </header>

        {/* HERO SECTION */}

        <main
          className="
            mx-auto
            grid
            min-h-[calc(100vh-64px)]
            max-w-7xl
            grid-cols-1
            items-center
            gap-16
            px-4
            py-14
            sm:px-6
            lg:grid-cols-2
            lg:px-8
          "
        >
          {/* LEFT */}

          <div>
            {/* badge removed per user request */}

            {/* Heading */}

            <h1
              className="
                mt-8
                text-4xl
                font-bold
                leading-tight
                tracking-tight
                sm:text-5xl
                lg:text-6xl
              "
            >
              Manage Your

              <span
                className="
                  block
                  bg-gradient-to-r
                  from-[var(--accent-primary)]
                  via-[var(--accent-secondary)]
                  to-[var(--accent-secondary)]
                  bg-clip-text
                  text-transparent
                "
              >
                Portfolio Ecosystem
              </span>
            </h1>

            {/* Description */}

            <p
              className="
                mt-6
                max-w-2xl
                text-base
                leading-relaxed
                text-[var(--text-secondary)]
                sm:text-lg
              "
            >
              A refined dashboard for managing
              projects, analytics, APIs,
              certificates, portfolio content,
              and public portfolio infrastructure
              with a calmer wood and peach visual
              style.
            </p>

            {/* Buttons */}

            <div
              className="
                mt-10
                flex
                flex-col
                gap-4
                sm:flex-row
              "
            >
              {/* Get Started */}

              <button
                onClick={() =>
                  handleNavigation("/login")
                }
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-[linear-gradient(135deg,var(--button-primary)_0%,var(--accent-primary)_100%)]
                  px-6
                  py-3
                  font-medium
                  text-white
                  transition-all
                  duration-300
                  shadow-[0_12px_30px_var(--accent-soft)]
                  hover:brightness-105
                "
              >
                Get Started

                <ArrowRight size={18} />
              </button>

              {/* Docs */}

              <button
                className="
                  rounded-2xl
                  border
                  border-[var(--border-color)]
                  bg-[var(--bg-card)]/90
                  px-6
                  py-3
                  font-medium
                  transition-all
                  duration-300
                  backdrop-blur
                  hover:bg-[var(--bg-secondary)]
                "
              >
                Documentation
              </button>
            </div>
          </div>

          {/* RIGHT */}

          <div
            className="
              rounded-[32px]
              border
              border-[var(--border-color)]
              bg-[linear-gradient(180deg,rgba(255,249,244,0.96)_0%,rgba(255,240,232,0.88)_100%)]
              p-5
              shadow-xl
              backdrop-blur
              sm:p-6
              lg:p-8
              dark:bg-[linear-gradient(180deg,rgba(36,27,23,0.96)_0%,rgba(30,22,19,0.9)_100%)]
            "
            style={{
              boxShadow:
                "0 10px 30px var(--shadow-color)",
            }}
          >
            {/* Top */}

            <div
              className="
                mb-8
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <h2 className="text-xl font-semibold">
                  Dashboard Overview
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-[var(--text-secondary)]
                  "
                >
                  Monitor your portfolio infrastructure
                </p>
              </div>

              <div
                className="
                  w-fit
                  rounded-xl
                  bg-[var(--accent-soft)]
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-[var(--accent-primary)]
                "
              >
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500 align-middle"></span>

                Live Analytics
              </div>
            </div>

            {/* Stats */}

            <div
              className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
              "
            >
              {stats.map((item, index) => (
                <div
                  key={index}
                  className="
                    rounded-2xl
                    border
                    border-[var(--border-color)]
                    bg-white/82
                    p-5
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-md
                    dark:bg-[var(--bg-card)]/82
                  "
                >
                  <div
                    className="
                      mb-4
                      text-[var(--text-secondary)]
                    "
                  >
                    {item.icon}
                  </div>

                  <h3 className="text-3xl font-bold">
                    {item.value}
                  </h3>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-[var(--text-secondary)]
                    "
                  >
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            {/* User chart */}
            <div className="mt-6">
              <UserChart />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;