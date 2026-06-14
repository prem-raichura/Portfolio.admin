import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import {
  ArrowLeft,
  Sun,
  Moon,
  Code,
  Copy,
  Check,
  Server,
  Globe,
  ChevronDown,
  FileText,
  Search,
  BookOpen,
  Info,
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  Settings,
} from "lucide-react";

// Types for Navigation & Sections
interface DocPage {
  id: string;
  title: string;
  category: string;
  attributes?: Array<{ name: string; value: string }>;
  headings: Array<{ id: string; text: string; sub?: boolean }>;
  content: React.ReactNode;
}

function Documentation() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  // Sidebar fold states
  const [folders, setFolders] = useState({
    overview: true,
    frontend: true,
    backend: true,
    publicApi: true,
  });

  // Current selected page ID
  const [selectedPage, setSelectedPage] = useState<string>("project-overview");

  // Search Modal state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Code copy feedback states
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [copiedPage, setCopiedPage] = useState(false);

  // Active right sidebar heading for scrollspy mockup
  const [activeHeading, setActiveHeading] = useState<string>("");

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 1800);
  };

  const handleCopyPage = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedPage(true);
    setTimeout(() => setCopiedPage(false), 2000);
  };

  // Keyboard listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleFolder = (folderName: keyof typeof folders) => {
    setFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  // Mock datasets for API reference page
  const [apiTab, setApiTab] = useState<"curl" | "fetch">("curl");

  const curlCode = `curl -X GET "https://api.portos.dev/api/public" \\
  -H "x-api-key: your_api_key_here"`;

  const fetchCode = `const fetchPortfolio = async () => {
  const response = await fetch("https://api.portos.dev/api/public", {
    method: "GET",
    headers: {
      "x-api-key": "your_api_key_here",
      "Content-Type": "application/json",
    }
  });
  const data = await response.json();
  console.log(data);
};`;

  const responseJson = `{
  "success": true,
  "source": "redis-cache",
  "portfolio": {
    "name": "Jane Doe",
    "headline": "Full Stack Engineer",
    "bio": "Building developer infrastructure.",
    "skills": ["TypeScript", "React", "Node.js", "Redis"],
    "projects": [
      {
        "title": "PortOS API",
        "description": "API Gateway and CDN for assets."
      }
    ]
  }
}`;

  // Documentation Pages Definitions
  const pages: Record<string, DocPage> = {
    "project-overview": {
      id: "project-overview",
      title: "Project Overview",
      category: "Getting Started",
      attributes: [
        { name: "Framework Base", value: "React & Express" },
        { name: "Recommended For", value: "Full Stack Developers" },
        { name: "Database Model", value: "Relational (PostgreSQL)" },
        { name: "License", value: "MIT Open Source" },
      ],
      headings: [
        { id: "what-is-portos", text: "What Is PortOS?" },
        { id: "core-concept", text: "The Core Concept" },
        { id: "target-audience", text: "Target Audience" },
      ],
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            PortOS acts as a personal database system for developers. Instead of writing separate backend models, configuration, and API systems for your personal websites, PortOS exposes a developer dashboard interface to build project cards, manage professional experiences, upload achievements/certificates, and retrieve them on the fly.
          </p>

          <h3 id="what-is-portos" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> What Is PortOS?
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            PortOS is an open-source tool built to decouple the presentation layer of a developer's portfolio from their content registry. Users deploy the admin dashboard panel, configure their resume materials once, and fetch them over a secured API CDN to render custom visual themes in React, Vue, Next.js, or HTML static sites.
          </p>

          <h3 id="core-concept" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> The Core Concept
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            By shifting content management to a self-contained operating system, developers gain real-time analytics (visitor counts, geographical data, project click rates) while keeping their codebases lightweight.
          </p>

          {/* Visual Alert Box */}
          <div className="rounded-2xl border border-l-4 border-l-[var(--accent)] border-[var(--border-color)] bg-[var(--bg-secondary)] p-5 text-sm text-[var(--text-secondary)] relative overflow-hidden">
            <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full opacity-10" style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }} />
            <div className="flex items-center gap-2 font-bold text-[var(--text-primary)] mb-1">
              <Info size={16} className="text-[var(--accent)]" />
              <span>Performance Boost</span>
            </div>
            All portfolio queries are run through an automatic caching model that guarantees response times under 50 milliseconds by bypassing the database entirely for cached entries.
          </div>

          <h3 id="target-audience" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Target Audience
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Engineers, designers, and systems architects who want total control over their portfolio frontend markup but do not want to hardcode projects or manually spin up backend servers for database storage.
          </p>
        </div>
      ),
    },
    "system-architecture": {
      id: "system-architecture",
      title: "System Architecture",
      category: "Getting Started",
      headings: [
        { id: "infrastructure-layers", text: "Infrastructure Layers" },
        { id: "database-cache-synchronization", text: "Database & Cache Synchronization" },
      ],
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            PortOS uses a decoupled architecture ensuring high availability, bulletproof security, and non-blocking background queue tasks.
          </p>

          {/* Architecture Chart */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 text-center space-y-4 shadow-sm">
            <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              System Flow Diagram
            </h4>
            <div className="flex flex-col md:flex-row items-center justify-around gap-4 py-4 text-xs font-semibold">
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 shadow-sm transition-all hover:scale-105">
                <p className="font-bold">Portfolio Client</p>
                <span className="text-[10px] text-[var(--text-muted)]">User Portfolio Web</span>
              </div>
              <ChevronRight className="rotate-90 md:rotate-0 text-[var(--text-muted)]" />
              <div className="rounded-xl border border-[var(--accent)] bg-[var(--accent-light)] px-4 py-3 shadow-sm transition-all hover:scale-105">
                <p className="font-bold text-[var(--accent)]">Express API Gateway</p>
                <span className="text-[10px] text-[var(--text-muted)]">Rate Limit / Auth Check</span>
              </div>
              <ChevronRight className="rotate-90 md:rotate-0 text-[var(--text-muted)]" />
              <div className="flex flex-col gap-2">
                <div className="rounded-xl border border-emerald-500 bg-emerald-500/10 px-4 py-2 text-emerald-500 font-bold transition-all hover:scale-105">
                  Redis Cache (EX 1h)
                </div>
                <div className="rounded-xl border border-indigo-500 bg-indigo-500/10 px-4 py-2 text-indigo-500 font-bold transition-all hover:scale-105">
                  BullMQ Queue (Async Jobs)
                </div>
                <div className="rounded-xl border border-purple-500 bg-purple-500/10 px-4 py-2 text-purple-500 font-bold transition-all hover:scale-105">
                  PostgreSQL DB (Prisma)
                </div>
              </div>
            </div>
          </div>

          <h3 id="infrastructure-layers" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Infrastructure Layers
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            The stack is composed of a decoupled frontend dashboard, a REST API server built in NodeJS, a fast in-memory key-value cache (Redis), and an transactional database (PostgreSQL).
          </p>

          <h3 id="database-cache-synchronization" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Database &amp; Cache Synchronization
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            When user data is updated in the dashboard panel, the Redis cached payload for that user is immediately purged. The subsequent request to the public endpoint queries PostgreSQL, updates Redis, and returns the response.
          </p>
        </div>
      ),
    },
    "database-schema": {
      id: "database-schema",
      title: "Database Schema Models",
      category: "Getting Started",
      headings: [
        { id: "user-model", text: "User Model" },
        { id: "projects-model", text: "Projects Model" },
        { id: "experience-model", text: "Experience Model" },
      ],
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            PortOS is backed by a PostgreSQL database orchestrated using Prisma ORM. Below are the key schemas:
          </p>

          <h3 id="user-model" className="text-base font-bold text-[var(--text-primary)] scroll-mt-20">
            User Model
          </h3>
          <div className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-tertiary)]">
            <div className="flex h-9 items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 text-xs font-semibold text-[var(--text-muted)]">
              <span>schema.prisma</span>
              <button
                onClick={() => handleCopy(`model User {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(255)
  username    String?  @unique @db.VarChar(100)
  email       String   @unique @db.VarChar(255)
  avatar      String?  @db.VarChar(500)
  bio         String?
  users_links Json?
  skills      Json?
  headline    String?  @db.VarChar(255)
}`, "user-model-code")}
                className="flex items-center gap-1 hover:text-[var(--text-primary)]"
              >
                {copiedText === "user-model-code" ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              </button>
            </div>
            <pre className="p-4 text-[11px] font-mono leading-relaxed text-[var(--text-primary)] overflow-x-auto">
{`model User {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(255)
  username    String?  @unique @db.VarChar(100)
  email       String   @unique @db.VarChar(255)
  avatar      String?  @db.VarChar(500)
  bio         String?
  users_links Json?
  skills      Json?
  headline    String?  @db.VarChar(255)
}`}
            </pre>
          </div>

          <h3 id="projects-model" className="text-base font-bold text-[var(--text-primary)] scroll-mt-20">
            Projects Model
          </h3>
          <div className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-tertiary)]">
            <div className="flex h-9 items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 text-xs font-semibold text-[var(--text-muted)]">
              <span>schema.prisma</span>
              <button
                onClick={() => handleCopy(`model Projects {
  id          Int      @id @default(autoincrement())
  user_id     Int
  title       String   @db.VarChar(255)
  slug        String?  @db.VarChar(255)
  description String?
  thumbnail   String?  @db.VarChar(500)
  featured    Boolean  @default(false)
  type        String   @db.VarChar(255)
}`, "projects-model-code")}
                className="flex items-center gap-1 hover:text-[var(--text-primary)]"
              >
                {copiedText === "projects-model-code" ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              </button>
            </div>
            <pre className="p-4 text-[11px] font-mono leading-relaxed text-[var(--text-primary)] overflow-x-auto">
{`model Projects {
  id          Int      @id @default(autoincrement())
  user_id     Int
  title       String   @db.VarChar(255)
  slug        String?  @db.VarChar(255)
  description String?
  thumbnail   String?  @db.VarChar(500)
  featured    Boolean  @default(false)
  type        String   @db.VarChar(255)
}`}
            </pre>
          </div>

          <h3 id="experience-model" className="text-base font-bold text-[var(--text-primary)] scroll-mt-20">
            Experience Model
          </h3>
          <div className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-tertiary)]">
            <div className="flex h-9 items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 text-xs font-semibold text-[var(--text-muted)]">
              <span>schema.prisma</span>
              <button
                onClick={() => handleCopy(`model Experience {
  id          Int       @id @default(autoincrement())
  user_id     Int
  title       String    @db.VarChar(255)
  slug        String    @db.VarChar(255)
  company     String    @db.VarChar(255)
  start_date  DateTime
  end_date    DateTime?
  is_current  Boolean   @default(false)
}`, "experience-model-code")}
                className="flex items-center gap-1 hover:text-[var(--text-primary)]"
              >
                {copiedText === "experience-model-code" ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              </button>
            </div>
            <pre className="p-4 text-[11px] font-mono leading-relaxed text-[var(--text-primary)] overflow-x-auto">
{`model Experience {
  id          Int       @id @default(autoincrement())
  user_id     Int
  title       String    @db.VarChar(255)
  slug        String    @db.VarChar(255)
  company     String    @db.VarChar(255)
  start_date  DateTime
  end_date    DateTime?
  is_current  Boolean   @default(false)
}`}
            </pre>
          </div>
        </div>
      ),
    },
    "frontend-stack": {
      id: "frontend-stack",
      title: "Frontend Stack",
      category: "Frontend Docs",
      headings: [
        { id: "framework-vite", text: "Framework & Bundle Engine" },
        { id: "component-architecture", text: "Component Architecture" },
      ],
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            The frontend interface operates as a highly responsive dashboard built using React 18, Vite, and TypeScript.
          </p>

          <h3 id="framework-vite" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Framework &amp; Bundle Engine
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Vite compiles single file components and routes instantly, utilizing hot module reloading (HMR) to provide immediate developer feedback in the client workspaces.
          </p>

          <h3 id="component-architecture" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Component Architecture
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Features are arranged cleanly inside directories separated by concern: <code>features/projects</code>, <code>features/experience</code>, <code>features/apiKeys</code>, and <code>shared/components</code> for layout, icons, loader modules, and helper libraries.
          </p>
        </div>
      ),
    },
    "routing-auth": {
      id: "routing-auth",
      title: "Routing & Authentication",
      category: "Frontend Docs",
      headings: [
        { id: "client-side-routing", text: "Client-Side Routing" },
        { id: "session-security", text: "Session Security & Access Token" },
      ],
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Protecting dashboard credentials and tracking authentication credentials safely across routes is vital.
          </p>

          <h3 id="client-side-routing" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Client-Side Routing
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Routes are created dynamically inside <code>AppRoutes.tsx</code> using the React Router library. Public routes (Landing, Login, Callback) sit side-by-side with Dashboard operations nested inside a specialized <code>ProtectedRoute</code> component.
          </p>

          <h3 id="session-security" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Session Security &amp; Access Token
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            A secure access token is loaded into memory (and localStorage), while a secure cookie manages token expiration. If the token expires or returns a <code>401</code>, axios interceptor automatically prompts the backend to verify the cookies and retrieve a refreshed access token silently.
          </p>
        </div>
      ),
    },
    "theme-config": {
      id: "theme-config",
      title: "Theme Configuration",
      category: "Frontend Docs",
      headings: [
        { id: "css-variables", text: "CSS Variables Design System" },
        { id: "theme-toggle-integration", text: "Integration with next-themes" },
      ],
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            PortOS features dynamic, harmonious colors for both light and dark mode operations using native browser values.
          </p>

          <h3 id="css-variables" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> CSS Variables Design System
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Colors, borders, shadows, backgrounds, and buttons are set using standard CSS Custom Properties in <code>src/index.css</code>. In light mode (defined on <code>:root</code>), we use clean backgrounds and teal/grey colors, while in dark mode (on <code>.dark</code> class), we switch variables dynamically to dark indigo and slate colors.
          </p>

          <h3 id="theme-toggle-integration" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Integration with next-themes
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            The theme toggle updates the root element's class list dynamically between light and dark. Components watch this state change and adjust accordingly.
          </p>
        </div>
      ),
    },
    "express-server": {
      id: "express-server",
      title: "Express Server Setup",
      category: "Backend Docs",
      headings: [
        { id: "routing-architecture", text: "Routing Architecture" },
        { id: "security-middlewares", text: "Security Middlewares" },
      ],
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            The core server uses NodeJS with Express, running on port 8000 by default.
          </p>

          <h3 id="routing-architecture" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Routing Architecture
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Express routes API suffixes to controller files, dividing logic into authentication, project registries, certificates, and metrics loggers.
          </p>

          <h3 id="security-middlewares" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Security Middlewares
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Standard guards protect controllers from abuse: Helmet shields HTTP headers, CORS config routes allowed domains, and cookie parser parses secure JSON Web Tokens.
          </p>
        </div>
      ),
    },
    "redis-cache-layer": {
      id: "redis-cache-layer",
      title: "Redis Cache Layer",
      category: "Backend Docs",
      headings: [
        { id: "performance-benefits", text: "Performance Benefits" },
        { id: "cache-invalidation-flow", text: "Cache Invalidation Flow" },
      ],
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            PortOS routes high-volume public portfolio queries through Redis to guarantee fast load times for end users.
          </p>

          <h3 id="performance-benefits" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Performance Benefits
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Caching portfolio outputs reduces SQL parsing bottlenecks, reducing public page requests to sub-20ms.
          </p>

          <h3 id="cache-invalidation-flow" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Cache Invalidation Flow
          </h3>
          <div className="rounded-2xl border border-l-4 border-l-amber-500 border-[var(--border-color)] bg-[var(--bg-secondary)] p-5 text-sm text-[var(--text-secondary)]">
            <div className="flex items-center gap-2 font-bold text-[var(--text-primary)] mb-1">
              <AlertTriangle size={16} className="text-amber-500" />
              <span>Expiry Policy</span>
            </div>
            Cache key is stored with a 3600 second TTL. Modifying certificates, links, or projects in the administrator dashboard commands the backend to wipe the cache key immediately.
          </div>
        </div>
      ),
    },
    "bullmq-worker": {
      id: "bullmq-worker",
      title: "BullMQ Worker Queue",
      category: "Backend Docs",
      headings: [
        { id: "analytics-processing", text: "Asynchronous Analytics Processing" },
        { id: "event-tracking-jobs", text: "Event Tracking Jobs" },
      ],
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Analytics metrics are processed asynchronously using BullMQ.
          </p>

          <h3 id="analytics-processing" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Asynchronous Analytics Processing
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Geographic lookups, browser client logging, and click counters are processed in background tasks using BullMQ worker threads, guaranteeing zero UI freeze.
          </p>

          <h3 id="event-tracking-jobs" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Event Tracking Jobs
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Background workers process tracking triggers including: <code>trackPortfolioVisit</code>, <code>githubClick</code>, <code>liveDemoClick</code>, and <code>contactSubmission</code>.
          </p>
        </div>
      ),
    },
    "getting-started-api": {
      id: "getting-started-api",
      title: "Getting Started (API)",
      category: "Public API Docs",
      headings: [
        { id: "api-purpose", text: "What is the Public API?" },
        { id: "base-url", text: "API Base URL" },
      ],
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            The PortOS Public API enables developers to query portfolio contents securely from any external static or server-rendered website.
          </p>

          <h3 id="api-purpose" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> What is the Public API?
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            It is a single read-only GET endpoint that aggregates User details, links, projects, experiences, and certificates.
          </p>

          <h3 id="base-url" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> API Base URL
          </h3>
          <div className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] p-4">
            <code className="text-sm font-semibold text-[var(--accent)]">
              https://api.portos.dev/api
            </code>
          </div>
        </div>
      ),
    },
    "api-authentication": {
      id: "api-authentication",
      title: "API Authentication",
      category: "Public API Docs",
      headings: [
        { id: "header-auth", text: "Header Key Authorization" },
        { id: "security-principles", text: "Security Principles" },
      ],
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            The Public API requires key validation to route portfolio parameters safely.
          </p>

          <h3 id="header-auth" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Header Key Authorization
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Requests must supply a valid key via the <code>x-api-key</code> request header.
          </p>

          <h3 id="security-principles" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Security Principles
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Keys generated have a configured rate limit and expiry date. If the key expires, the request returns a <code>401 Unauthorized</code> status and flags the key as inactive.
          </p>
        </div>
      ),
    },
    "public-api-reference": {
      id: "public-api-reference",
      title: "Public API Reference",
      category: "Public API Docs",
      attributes: [
        { name: "Endpoint", value: "GET /api/public" },
        { name: "Format", value: "JSON" },
        { name: "Auth Required", value: "Yes (x-api-key)" },
        { name: "Rate Limit", value: "1,000 req/day" },
      ],
      headings: [
        { id: "endpoint-details", text: "Endpoint Details" },
        { id: "request-headers", text: "Request Headers" },
        { id: "code-examples", text: "Code Examples" },
        { id: "response-json", text: "Response JSON Schema" },
      ],
      content: (
        <div className="space-y-6">
          <h3 id="endpoint-details" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Endpoint Details
          </h3>
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-500">
              GET
            </span>
            <code className="text-sm font-semibold text-[var(--text-primary)]">
              /api/public
            </code>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Returns details about the profile, certificates, experience items, and projects connected to the authorized API key owner.
          </p>

          <h3 id="request-headers" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Request Headers
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)]">
                  <th className="p-3">Header Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Required</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--border-color)]">
                  <td className="p-3 font-semibold text-[var(--accent)]">x-api-key</td>
                  <td className="p-3 text-[var(--text-secondary)]">String</td>
                  <td className="p-3 text-[var(--text-muted)]">The API Key generated in your admin dashboard panel.</td>
                  <td className="p-3 text-red-500 font-bold">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 id="code-examples" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Code Examples
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-xs text-[var(--text-muted)]">Query Snippet</span>
              <div className="flex items-center gap-1 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-1 text-xs">
                <button
                  onClick={() => setApiTab("curl")}
                  className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                    apiTab === "curl"
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--text-secondary)] hover:bg-[var(--accent-light)]"
                  }`}
                >
                  cURL
                </button>
                <button
                  onClick={() => setApiTab("fetch")}
                  className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                    apiTab === "fetch"
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--text-secondary)] hover:bg-[var(--accent-light)]"
                  }`}
                >
                  JavaScript
                </button>
              </div>
            </div>

            {/* Code Block Component */}
            <div className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-tertiary)]">
              <div className="flex h-10 items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 text-xs font-semibold text-[var(--text-muted)]">
                <span>{apiTab === "curl" ? "bash" : "javascript"}</span>
                <button
                  onClick={() => handleCopy(apiTab === "curl" ? curlCode : fetchCode, "api-req")}
                  className="flex items-center gap-1.5 hover:text-[var(--text-primary)]"
                >
                  {copiedText === "api-req" ? (
                    <>
                      <Check size={12} className="text-emerald-500" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> Copy Code
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-[11px] font-mono leading-relaxed text-[var(--text-primary)]">
                {apiTab === "curl" ? curlCode : fetchCode}
              </pre>
            </div>
          </div>

          <h3 id="response-json" className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Response JSON Schema
          </h3>
          <div className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-tertiary)]">
            <div className="flex h-10 items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 text-xs font-semibold text-[var(--text-muted)]">
              <span>json</span>
              <button
                onClick={() => handleCopy(responseJson, "api-res")}
                className="flex items-center gap-1.5 hover:text-[var(--text-primary)]"
              >
                {copiedText === "api-res" ? (
                  <>
                    <Check size={12} className="text-emerald-500" /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={12} /> Copy Code
                  </>
                )}
              </button>
            </div>
            <pre className="max-h-[300px] overflow-y-auto p-4 overflow-x-auto text-[11px] font-mono leading-relaxed text-[var(--text-primary)]">
              {responseJson}
            </pre>
          </div>
        </div>
      ),
    },
  };

  const handlePageSelect = (pageId: string) => {
    setSelectedPage(pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activePageData = pages[selectedPage] || pages["project-overview"];

  // Filter sections for Search Modal
  const allDocLinks = [
    { id: "project-overview", title: "Project Overview", category: "Getting Started" },
    { id: "system-architecture", title: "System Architecture", category: "Getting Started" },
    { id: "database-schema", title: "Database Schema Models", category: "Getting Started" },
    { id: "frontend-stack", title: "Frontend Stack", category: "Frontend Docs" },
    { id: "routing-auth", title: "Routing & Authentication", category: "Frontend Docs" },
    { id: "theme-config", title: "Theme Configuration", category: "Frontend Docs" },
    { id: "express-server", title: "Express Server Setup", category: "Backend Docs" },
    { id: "redis-cache-layer", title: "Redis Cache Layer", category: "Backend Docs" },
    { id: "bullmq-worker", title: "BullMQ Worker Queue", category: "Backend Docs" },
    { id: "getting-started-api", title: "Getting Started (API)", category: "Public API Docs" },
    { id: "api-authentication", title: "API Authentication", category: "Public API Docs" },
    { id: "public-api-reference", title: "Public API Reference", category: "Public API Docs" },
  ];

  const filteredLinks = allDocLinks.filter(
    (lnk) =>
      lnk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lnk.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen gradient-mesh text-[var(--text-primary)] transition-colors duration-300">
      {/* ── Glow Orbs ── */}
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />

      {/* ── TOP HEADER ── */}
      <header
        className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[var(--border-color)] px-6 lg:px-10"
        style={{
          background: "var(--bg-navbar)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--accent-light)]"
          >
            <ArrowLeft size={14} /> Back to Home
          </button>
          <div className="h-6 w-px bg-[var(--border-color)]" />
          <div className="flex items-center gap-3 select-none">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white animate-float"
              style={{
                background: "linear-gradient(135deg, var(--grad-start), var(--grad-end))",
                boxShadow: "0 4px 10px var(--accent-glow)",
              }}
            >
              P
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold leading-tight">PortOS Docs</h1>
              <p className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-bold">
                Guides, Explanations &amp; References
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Mock Search Bar with Keyboard shortcut */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-9 w-44 sm:w-56 items-center justify-between rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3 text-xs text-[var(--text-muted)] transition-all hover:border-[var(--accent)] hover:bg-[var(--bg-secondary)]"
          >
            <span className="flex items-center gap-2">
              <Search size={14} /> Search docs...
            </span>
            <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-secondary)] px-1.5 font-mono text-[9px] font-medium text-[var(--text-muted)]">
              Ctrl + K
            </kbd>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--accent-light)]"
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
        </div>
      </header>

      {/* ── THREE COLUMN CONTAINER ── */}
      <div className="mx-auto flex max-w-7xl px-4 py-8 lg:px-10">
        
        {/* 1. LEFT SIDEBAR (Folder Structure) */}
        <aside className="sticky top-24 hidden h-[calc(100vh-120px)] w-68 shrink-0 overflow-y-auto border-r border-[var(--border-color)] pr-6 md:block">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Project Documentation
              </p>
              <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">
                Guides, Explanations &amp; References
              </span>
            </div>

            {/* Folders & Links */}
            <div className="space-y-1.5">
              
              {/* Category: Overview Folder */}
              <div>
                <button
                  onClick={() => toggleFolder("overview")}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--accent-light)] transition-all"
                >
                  <span className="flex items-center gap-2.5">
                    <BookOpen size={16} className="text-[var(--text-muted)]" />
                    Overview Docs
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-[var(--text-muted)] transition-transform duration-200 ${
                      folders.overview ? "" : "-rotate-90"
                    }`}
                  />
                </button>
                {folders.overview && (
                  <div className="ml-5 mt-1 border-l border-[var(--border-color)] pl-3 space-y-1 animate-fade-in-up">
                    <button
                      onClick={() => handlePageSelect("project-overview")}
                      className={`flex w-full items-center gap-2 rounded-lg py-1.5 px-2.5 text-xs text-left transition-all ${
                        selectedPage === "project-overview"
                          ? "bg-[var(--accent-light)] text-[var(--accent)] font-bold"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                      }`}
                    >
                      <FileText size={12} /> Project Overview
                    </button>
                    <button
                      onClick={() => handlePageSelect("system-architecture")}
                      className={`flex w-full items-center gap-2 rounded-lg py-1.5 px-2.5 text-xs text-left transition-all ${
                        selectedPage === "system-architecture"
                          ? "bg-[var(--accent-light)] text-[var(--accent)] font-bold"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                      }`}
                    >
                      <FileText size={12} /> System Architecture
                    </button>
                    <button
                      onClick={() => handlePageSelect("database-schema")}
                      className={`flex w-full items-center gap-2 rounded-lg py-1.5 px-2.5 text-xs text-left transition-all ${
                        selectedPage === "database-schema"
                          ? "bg-[var(--accent-light)] text-[var(--accent)] font-bold"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                      }`}
                    >
                      <FileText size={12} /> Database Schema
                    </button>
                  </div>
                )}
              </div>

              {/* Category: Frontend Folder */}
              <div>
                <button
                  onClick={() => toggleFolder("frontend")}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--accent-light)] transition-all"
                >
                  <span className="flex items-center gap-2.5">
                    <Code size={16} className="text-[var(--text-muted)]" />
                    Frontend
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-[var(--text-muted)] transition-transform duration-200 ${
                      folders.frontend ? "" : "-rotate-90"
                    }`}
                  />
                </button>
                {folders.frontend && (
                  <div className="ml-5 mt-1 border-l border-[var(--border-color)] pl-3 space-y-1 animate-fade-in-up">
                    <button
                      onClick={() => handlePageSelect("frontend-stack")}
                      className={`flex w-full items-center gap-2 rounded-lg py-1.5 px-2.5 text-xs text-left transition-all ${
                        selectedPage === "frontend-stack"
                          ? "bg-[var(--accent-light)] text-[var(--accent)] font-bold"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                      }`}
                    >
                      <FileText size={12} /> Frontend Stack
                    </button>
                    <button
                      onClick={() => handlePageSelect("routing-auth")}
                      className={`flex w-full items-center gap-2 rounded-lg py-1.5 px-2.5 text-xs text-left transition-all ${
                        selectedPage === "routing-auth"
                          ? "bg-[var(--accent-light)] text-[var(--accent)] font-bold"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                      }`}
                    >
                      <FileText size={12} /> Routing &amp; Auth
                    </button>
                    <button
                      onClick={() => handlePageSelect("theme-config")}
                      className={`flex w-full items-center gap-2 rounded-lg py-1.5 px-2.5 text-xs text-left transition-all ${
                        selectedPage === "theme-config"
                          ? "bg-[var(--accent-light)] text-[var(--accent)] font-bold"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                      }`}
                    >
                      <FileText size={12} /> Theme Config
                    </button>
                  </div>
                )}
              </div>

              {/* Category: Backend Folder */}
              <div>
                <button
                  onClick={() => toggleFolder("backend")}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--accent-light)] transition-all"
                >
                  <span className="flex items-center gap-2.5">
                    <Server size={16} className="text-[var(--text-muted)]" />
                    Backend &amp; Server
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-[var(--text-muted)] transition-transform duration-200 ${
                      folders.backend ? "" : "-rotate-90"
                    }`}
                  />
                </button>
                {folders.backend && (
                  <div className="ml-5 mt-1 border-l border-[var(--border-color)] pl-3 space-y-1 animate-fade-in-up">
                    <button
                      onClick={() => handlePageSelect("express-server")}
                      className={`flex w-full items-center gap-2 rounded-lg py-1.5 px-2.5 text-xs text-left transition-all ${
                        selectedPage === "express-server"
                          ? "bg-[var(--accent-light)] text-[var(--accent)] font-bold"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                      }`}
                    >
                      <FileText size={12} /> Express Setup
                    </button>
                    <button
                      onClick={() => handlePageSelect("redis-cache-layer")}
                      className={`flex w-full items-center gap-2 rounded-lg py-1.5 px-2.5 text-xs text-left transition-all ${
                        selectedPage === "redis-cache-layer"
                          ? "bg-[var(--accent-light)] text-[var(--accent)] font-bold"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                      }`}
                    >
                      <FileText size={12} /> Redis Caching
                    </button>
                    <button
                      onClick={() => handlePageSelect("bullmq-worker")}
                      className={`flex w-full items-center gap-2 rounded-lg py-1.5 px-2.5 text-xs text-left transition-all ${
                        selectedPage === "bullmq-worker"
                          ? "bg-[var(--accent-light)] text-[var(--accent)] font-bold"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                      }`}
                    >
                      <FileText size={12} /> BullMQ Worker
                    </button>
                  </div>
                )}
              </div>

              {/* Category: Public API Folder */}
              <div>
                <button
                  onClick={() => toggleFolder("publicApi")}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--accent-light)] transition-all"
                >
                  <span className="flex items-center gap-2.5">
                    <Globe size={16} className="text-[var(--text-muted)]" />
                    Public API Docs
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-[var(--text-muted)] transition-transform duration-200 ${
                      folders.publicApi ? "" : "-rotate-90"
                    }`}
                  />
                </button>
                {folders.publicApi && (
                  <div className="ml-5 mt-1 border-l border-[var(--border-color)] pl-3 space-y-1 animate-fade-in-up">
                    <button
                      onClick={() => handlePageSelect("getting-started-api")}
                      className={`flex w-full items-center gap-2 rounded-lg py-1.5 px-2.5 text-xs text-left transition-all ${
                        selectedPage === "getting-started-api"
                          ? "bg-[var(--accent-light)] text-[var(--accent)] font-bold"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                      }`}
                    >
                      <FileText size={12} /> Getting Started (API)
                    </button>
                    <button
                      onClick={() => handlePageSelect("api-authentication")}
                      className={`flex w-full items-center gap-2 rounded-lg py-1.5 px-2.5 text-xs text-left transition-all ${
                        selectedPage === "api-authentication"
                          ? "bg-[var(--accent-light)] text-[var(--accent)] font-bold"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                      }`}
                    >
                      <FileText size={12} /> Authentication
                    </button>
                    <button
                      onClick={() => handlePageSelect("public-api-reference")}
                      className={`flex w-full items-center gap-2 rounded-lg py-1.5 px-2.5 text-xs text-left transition-all ${
                        selectedPage === "public-api-reference"
                          ? "bg-[var(--accent-light)] text-[var(--accent)] font-bold"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                      }`}
                    >
                      <FileText size={12} /> Public API Reference
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* 2. MIDDLE CONTENT PANE */}
        <main className="flex-1 px-4 lg:px-10 space-y-8 scroll-smooth animate-fade-in-up">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-extrabold flex items-center gap-1.5">
                  <Settings size={12} className="animate-spin-slow" /> {activePageData.category}
                </span>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl text-[var(--text-primary)]">
                  {activePageData.title}
                </h2>
              </div>
              <button
                onClick={handleCopyPage}
                className="flex items-center gap-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:scale-[1.02]"
              >
                {copiedPage ? (
                  <>
                    <Check size={12} className="text-emerald-500 animate-pulse" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={12} /> Copy Page Link
                  </>
                )}
              </button>
            </div>

            {/* Top metadata table (Matches Drishtiksha style) */}
            {activePageData.attributes && (
              <div className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm">
                <div className="grid grid-cols-2 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2.5 text-xs font-extrabold text-[var(--text-secondary)] tracking-wider">
                  <div>ATTRIBUTE</div>
                  <div>DETAILS</div>
                </div>
                <div className="divide-y divide-[var(--border-color)] text-xs text-[var(--text-primary)]">
                  {activePageData.attributes.map((attr, idx) => (
                    <div key={idx} className="grid grid-cols-2 px-4 py-3 hover:bg-[var(--bg-secondary)] transition-all">
                      <div className="font-semibold text-[var(--text-secondary)]">{attr.name}</div>
                      <div className="font-semibold">{attr.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[var(--border-color)] pt-6">
            {activePageData.content}
          </div>
        </main>

        {/* 3. RIGHT SIDEBAR (ON THIS PAGE) */}
        <aside className="sticky top-24 hidden h-[calc(100vh-120px)] w-60 shrink-0 overflow-y-auto pl-6 md:block">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            On This Page
          </p>
          <ul className="space-y-1.5 text-xs font-semibold relative">
            <li className="mb-3">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-[var(--accent)] font-extrabold hover:underline"
              >
                {activePageData.title}
              </a>
            </li>
            {activePageData.headings.map((h, idx) => (
              <li key={idx} className={`${h.sub ? "pl-4" : ""}`}>
                <a
                  href={`#${h.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                    setActiveHeading(h.id);
                  }}
                  className={`block border-l-2 py-1 pl-3 transition-all ${
                    activeHeading === h.id
                      ? "border-[var(--accent)] text-[var(--accent)] font-bold bg-[var(--accent-light)] rounded-r-lg"
                      : "border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]"
                  }`}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {/* ── COMMAND PALETTE SEARCH MODAL ── */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-24 backdrop-blur-sm animate-fade-in-up">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl">
            <div className="flex h-12 items-center gap-3 border-b border-[var(--border-color)] px-4">
              <Search size={16} className="text-[var(--text-muted)] animate-pulse" />
              <input
                type="text"
                placeholder="Type to search documentation..."
                className="flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="rounded-lg border border-[var(--border-color)] px-2 py-1 text-[10px] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]"
              >
                ESC
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {filteredLinks.length > 0 ? (
                filteredLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      handlePageSelect(link.id);
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-[var(--accent-light)] transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {link.title}
                      </p>
                      <span className="text-[10px] text-[var(--text-muted)] font-medium">
                        {link.category}
                      </span>
                    </div>
                    <ArrowUpRight size={14} className="text-[var(--text-muted)]" />
                  </button>
                ))
              ) : (
                <p className="p-4 text-center text-xs text-[var(--text-muted)]">
                  No matching documentation pages found.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Documentation;
