import {
  ArrowRight,
  Moon,
  Sun,
  Briefcase,
  Award,
  Eye,
  TrendingUp,
  Sparkles,
} from "lucide-react";

import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import PageLoader from "@shared/components/ui/PageLoader";
import { verifySession } from "@shared/lib/auth";

function App() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    verifySession().then((status) => {
      if (status === "valid") navigate("/dashboard", { replace: true });
    });
  }, [navigate]);

  const handleNavigation = (path: string) => {
    setLoading(true);
    setTimeout(() => navigate(path), 700);
  };

  const [views, setViews] = useState(24512);

  useEffect(() => {
    const interval = setInterval(() => {
      setViews((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {loading && <PageLoader />}

      {/* ── Gradient mesh wrapper (same as Login) ── */}
      <div
        className="relative min-h-screen overflow-hidden gradient-mesh text-[var(--text-primary)] transition-colors duration-300"
      >
        {/* Glow orb — top-left */}
        <div
          className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%)",
            animation:  "orb-pulse 10s ease-in-out infinite alternate",
          }}
        />
        {/* Glow orb — bottom-right */}
        <div
          className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 65%)",
            animation:  "orb-pulse 8s ease-in-out infinite alternate-reverse",
          }}
        />

        {/* ══════════════════════════════════
            NAVBAR
        ══════════════════════════════════ */}
        <header
          className="sticky top-0 z-50 flex h-16 items-center justify-between px-6 lg:px-10"
          style={{
            background:           "var(--bg-navbar)",
            backdropFilter:       "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom:         "1px solid var(--border-color)",
          }}
        >
          {/* Logo */}
          <a
            onClick={() => navigate("/")}
            className="flex cursor-pointer items-center gap-3 select-none"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white"
              style={{
                background: "linear-gradient(135deg, var(--grad-start), var(--grad-end))",
                boxShadow:  "0 4px 14px var(--accent-glow)",
              }}
            >
              P
            </div>
            <div>
              <h1 className="text-sm font-semibold">PortOS</h1>
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Personal Portfolio Operating System
              </p>
            </div>
          </a>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="
                relative flex h-9 w-9 items-center justify-center rounded-xl
                border border-[var(--border-color)] bg-[var(--bg-card)]
                transition-all duration-200
                hover:border-[var(--accent)] hover:bg-[var(--accent-light)]
              "
              aria-label="Toggle theme"
            >
              <Sun
                size={16}
                className={`absolute transition-all duration-500 ${
                  theme === "dark"
                    ? "scale-0 rotate-90 opacity-0"
                    : "scale-100 rotate-0 opacity-100 text-amber-500"
                }`}
              />
              <Moon
                size={16}
                className={`absolute transition-all duration-500 ${
                  theme === "dark"
                    ? "scale-100 rotate-0 opacity-100 text-indigo-400"
                    : "scale-0 -rotate-90 opacity-0"
                }`}
              />
            </button>

            {/* Get Started CTA in navbar */}
            {/* <button
              onClick={() => handleNavigation("/login")}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, var(--grad-start), var(--grad-end))",
                boxShadow:  "0 4px 14px var(--accent-glow)",
              }}
            >
              Get Started <ArrowRight size={14} />
            </button> */}
          </div>
        </header>

        {/* ══════════════════════════════════
            HERO
        ══════════════════════════════════ */}
        <main
          className="
            relative z-10 mx-auto grid
            min-h-[calc(100vh-64px)]
            max-w-7xl
            grid-cols-1 items-center gap-14
            px-4 py-8
            lg:grid-cols-2 lg:px-10 lg:py-12
          "
        >
          {/* ── LEFT ── */}
          <div className="animate-fade-in-up">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--success)]" />
              </span>
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                Modern Portfolio Infrastructure
              </p>
            </div>

            {/* Heading */}
            <h1 className="mt-8 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              PortOS
              <span className="block gradient-text">
                Personal Portfolio Operating System
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
              A modern developer-focused dashboard for managing projects, analytics,
              APIs, certificates, portfolio content, and dynamic public portfolio infrastructure.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              {/* Primary */}
              <button
                onClick={() => handleNavigation("/login")}
                className="flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, var(--grad-start), var(--grad-end))",
                  boxShadow:  "0 8px 24px var(--accent-glow)",
                }}
              >
                Get Started <ArrowRight size={16} />
              </button>

              {/* Secondary */}
              <button
                onClick={() => handleNavigation("/documentation")}
                className="
                  flex items-center justify-center gap-2 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] px-6 py-3 text-sm font-semibold transition-all duration-300 hover:bg-[var(--accent-light)] hover:border-[var(--accent)] hover:-translate-y-0.5
                "
              >
                Documentation <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="animate-fade-in-up animate-delay-2 relative flex items-center justify-center min-h-[460px] w-full">
            <style>{`
              @keyframes float-p1 {
                0% { transform: translateY(0px) rotate(-1.5deg); }
                50% { transform: translateY(-10px) rotate(1deg); }
                100% { transform: translateY(0px) rotate(-1.5deg); }
              }
              @keyframes float-p2 {
                0% { transform: translateY(0px) rotate(2deg); }
                50% { transform: translateY(-14px) rotate(-2deg); }
                100% { transform: translateY(0px) rotate(2deg); }
              }
              @keyframes float-p3 {
                0% { transform: translateY(0px) rotate(-2deg); }
                50% { transform: translateY(-8px) rotate(2deg); }
                100% { transform: translateY(0px) rotate(-2deg); }
              }
              @keyframes orbit-dot-1 {
                0% { transform: translate(-50%, -50%) rotate(0deg) translate(150px) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg) translate(150px) rotate(-360deg); }
              }
              @keyframes orbit-dot-2 {
                0% { transform: translate(-50%, -50%) rotate(180deg) translate(210px) rotate(-180deg); }
                100% { transform: translate(-50%, -50%) rotate(-180deg) translate(210px) rotate(180deg); }
              }
              .float-card-1 {
                animation: float-p1 5s ease-in-out infinite;
              }
              .float-card-2 {
                animation: float-p2 6s ease-in-out infinite;
              }
              .float-card-3 {
                animation: float-p3 4.5s ease-in-out infinite;
              }
              .orbit-track-1 {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 300px;
                height: 300px;
                border: 1px dashed var(--border-color);
                border-radius: 50%;
                pointer-events: none;
                opacity: 0.45;
              }
              .orbit-track-2 {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 420px;
                height: 420px;
                border: 1px dashed var(--border-color);
                border-radius: 50%;
                pointer-events: none;
                opacity: 0.25;
              }
              .orbit-pulse-dot-1 {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: var(--accent);
                box-shadow: 0 0 12px var(--accent);
                animation: orbit-dot-1 12s linear infinite;
              }
              .orbit-pulse-dot-2 {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background-color: #fbbf24;
                box-shadow: 0 0 10px #fbbf24;
                animation: orbit-dot-2 18s linear infinite;
              }
            `}</style>

            {/* Concentric Orbit Paths */}
            <div className="orbit-track-1" />
            <div className="orbit-track-2" />
            
            {/* Glowing Orbit Dots */}
            <div className="orbit-pulse-dot-1" />
            <div className="orbit-pulse-dot-2" />

            {/* Central Desktop Frame Mockup */}
            <div
              className="relative w-full max-w-[480px] min-h-[420px] rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-xl)] flex flex-col justify-between overflow-hidden z-10"
            >
              {/* Inner glowing core */}
              <div
                className="pointer-events-none absolute inset-0 opacity-15"
                style={{
                  background: "radial-gradient(circle at 50% 50%, var(--accent), transparent 60%)",
                }}
              />

              {/* Window Controls */}
              <div className="flex items-center gap-1.5 border-b border-[var(--border-color)] pb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <span className="ml-2 text-[10px] font-bold tracking-wider text-[var(--text-muted)] uppercase">
                  portos-app.com
                </span>
              </div>

              {/* Main Core Profile Screen */}
              <div className="my-auto py-6 flex flex-col items-center text-center space-y-3">
                <div
                  className="relative h-16 w-16 rounded-full p-1 bg-gradient-to-tr from-[var(--grad-start)] to-[var(--grad-end)] shadow-md"
                >
                  <div className="h-full w-full rounded-full bg-[var(--bg-card)] flex items-center justify-center text-[var(--accent)] font-extrabold text-xl animate-pulse">
                    JD
                  </div>
                  <Sparkles size={16} className="absolute -top-1 -right-1 text-amber-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[var(--text-primary)]">Jane Doe</h3>
                  <p className="text-xs text-[var(--text-secondary)] font-medium">Software Engineer</p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-1 text-[10px] text-[var(--text-muted)] font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] animate-pulse" /> Available for projects
                </div>
              </div>

              {/* Animated Path Chart at Bottom */}
              <div className="w-full h-12 overflow-hidden border-t border-[var(--border-color)] pt-3 relative">
                <span className="absolute left-0 top-3 text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Live Traffic
                </span>
                <svg className="w-full h-full text-[var(--accent)]" viewBox="0 0 300 50">
                  <path
                    d="M0 40 C 50 10, 70 30, 100 20 C 130 10, 150 40, 180 30 C 210 20, 240 10, 300 35"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="animate-pulse"
                    style={{ strokeDasharray: "300", strokeDashoffset: "0" }}
                  />
                </svg>
              </div>

              {/* FLOATING CARD 1: Projects (Top Left) */}
              <div
                className="absolute top-12 -left-12 z-20 w-40 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-3 shadow-[var(--shadow-md)] float-card-1 backdrop-blur-md"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                    <Briefcase size={14} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-extrabold text-[var(--text-primary)]">PortOS CLI</h4>
                    <p className="text-[8px] text-[var(--text-muted)] font-medium">Vite + React</p>
                  </div>
                </div>
              </div>

              {/* FLOATING CARD 2: Certificates Badge (Bottom Left) */}
              <div
                className="absolute bottom-16 -left-10 z-20 w-36 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-3 shadow-[var(--shadow-md)] float-card-2 backdrop-blur-md"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                    <Award size={14} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-extrabold text-[var(--text-primary)]">AWS Solutions</h4>
                    <p className="text-[8px] text-[var(--text-muted)] font-medium">Certified</p>
                  </div>
                </div>
              </div>

              {/* FLOATING CARD 3: Analytics / Eye View Tracker (Top Right) */}
              <div
                className="absolute top-8 -right-10 z-20 w-36 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-3 shadow-[var(--shadow-md)] float-card-3 backdrop-blur-md"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                    <Eye size={14} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-extrabold text-[var(--text-primary)]">{views.toLocaleString()}</h4>
                    <p className="text-[8px] text-[var(--text-muted)] font-medium flex items-center gap-0.5">
                      <TrendingUp size={10} className="text-emerald-500" /> Active views
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
