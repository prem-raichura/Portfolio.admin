import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Moon,
  Sun,
} from "lucide-react";

import { useTheme } from "next-themes";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import PageLoader from "../components/ui/PageLoader";

function Login() {
  const { theme, setTheme } = useTheme();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleNavigation = (
    path: string
  ) => {
    setLoading(true);

    setTimeout(() => {
      navigate(path);
    }, 700);
  };

  return (
    <>
      {loading && <PageLoader />}

      <div
        className="
          min-h-screen
          bg-[var(--bg-main)]
          text-[var(--text-primary)]
          transition-colors
          duration-300
        "
      >
        {/* =========================
            NAVBAR
        ========================= */}

        <header
          className="
            sticky
            top-0
            z-50
            border-b
            border-[var(--border-color)]
            bg-[var(--bg-card)]/80
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
              onClick={() =>
                handleNavigation("/")
              }
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
                  bg-[var(--button-primary)]
                  text-lg
                  font-bold
                  text-white
                  dark:text-black
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

            {/* Right Actions */}

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
                  bg-[var(--bg-card)]
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
            </div>
          </div>
        </header>

        {/* =========================
            MAIN
        ========================= */}

        <main
          className="
            mx-auto
            grid
            min-h-[calc(100vh-64px)]
            max-w-7xl
            grid-cols-1
            items-center
            gap-14
            px-4
            py-10
            sm:px-6
            lg:grid-cols-2
            lg:px-8
          "
        >
          {/* =========================
              LEFT SIDE
          ========================= */}

          <div className="hidden lg:block">
            {/* Badge */}

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[var(--border-color)]
                bg-[var(--bg-card)]
                px-4
                py-2
                shadow-sm
              "
            >
              <div className="h-2 w-2 rounded-full bg-green-500"></div>

              <p
                className="
                  text-sm
                  font-medium
                  text-[var(--text-secondary)]
                "
              >
                Secure Multi-Tenant Platform
              </p>
            </div>

            {/* Heading */}

            <h1
              className="
                mt-8
                text-5xl
                font-bold
                leading-tight
                tracking-tight
              "
            >
              Manage Your

              <span
                className="
                  block
                  text-[var(--text-muted)]
                "
              >
                Portfolio Infrastructure
              </span>
            </h1>

            {/* Description */}

            <p
              className="
                mt-6
                max-w-xl
                text-lg
                leading-relaxed
                text-[var(--text-secondary)]
              "
            >
              Access your centralized portfolio
              dashboard to manage projects,
              APIs, analytics, certificates,
              and dynamic public portfolio
              content.
            </p>

            {/* Features */}

            <div className="mt-10 space-y-5">
              {[
                "Dynamic Public Portfolio APIs",
                "Advanced Analytics Dashboard",
                "Secure Multi-Tenant Architecture",
                "Project & Certificate Management",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <div className="h-2 w-2 rounded-full bg-[var(--button-primary)]"></div>

                  <p
                    className="
                      text-[var(--text-secondary)]
                    "
                  >
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* =========================
              RIGHT SIDE
          ========================= */}

          <div
            className="
              mx-auto
              w-full
              max-w-md
            "
          >
            {/* Card */}

            <div
              className="
                rounded-[32px]
                border
                border-[var(--border-color)]
                bg-[var(--bg-card)]
                p-6
                shadow-xl
                sm:p-8
              "
              style={{
                boxShadow:
                  "0 10px 30px var(--shadow-color)",
              }}
            >
              {/* Top */}

              <div className="text-center">
                <h2
                  className="
                    text-3xl
                    font-bold
                  "
                >
                  Welcome Back
                </h2>

                <p
                  className="
                    mt-2
                    text-sm
                    text-[var(--text-secondary)]
                  "
                >
                  Login to your admin dashboard
                </p>
              </div>

              {/* Form */}

              <form className="mt-8 space-y-5">
                {/* Email */}

                <div>
                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                    "
                  >
                    Email
                  </label>

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      border-[var(--border-color)]
                      bg-[var(--bg-main)]
                      px-4
                      py-3
                    "
                  >
                    <Mail
                      size={18}
                      className="
                        text-[var(--text-secondary)]
                      "
                    />

                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="
                        w-full
                        bg-transparent
                        outline-none
                        placeholder:text-[var(--text-muted)]
                      "
                    />
                  </div>
                </div>

                {/* Password */}

                <div>
                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                    "
                  >
                    Password
                  </label>

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      border-[var(--border-color)]
                      bg-[var(--bg-main)]
                      px-4
                      py-3
                    "
                  >
                    <LockKeyhole
                      size={18}
                      className="
                        text-[var(--text-secondary)]
                      "
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter your password"
                      className="
                        w-full
                        bg-transparent
                        outline-none
                        placeholder:text-[var(--text-muted)]
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                    >
                      {showPassword ? (
                        <EyeOff
                          size={18}
                          className="
                            text-[var(--text-secondary)]
                          "
                        />
                      ) : (
                        <Eye
                          size={18}
                          className="
                            text-[var(--text-secondary)]
                          "
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* Options */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <label
                    className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      text-[var(--text-secondary)]
                    "
                  >
                    <input
                      type="checkbox"
                      className="
                        h-4
                        w-4
                      "
                    />

                    Remember me
                  </label>

                  <button
                    type="button"
                    className="
                      text-sm
                      font-medium
                      text-[var(--button-primary)]
                    "
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login Button */}

                <button
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-[var(--button-primary)]
                    px-6
                    py-3.5
                    font-medium
                    text-white
                    transition-all
                    duration-300
                    hover:bg-[var(--button-primary-hover)]
                    dark:text-black
                  "
                >
                  Login

                  <ArrowRight size={18} />
                </button>
              </form>

              {/* Bottom */}

              <p
                className="
                  mt-6
                  text-center
                  text-sm
                  text-[var(--text-secondary)]
                "
              >
                Don&apos;t have an account?{" "}

                <button
                  onClick={() =>
                    handleNavigation(
                      "/register"
                    )
                  }
                  className="
                    font-medium
                    text-[var(--button-primary)]
                  "
                >
                  Register
                </button>
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Login;