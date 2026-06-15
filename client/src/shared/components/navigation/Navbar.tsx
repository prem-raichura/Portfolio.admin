import {
  Bell,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";

import { useTheme } from "next-themes";
import {
  useEffect,
  useMemo,
  useState,
  useRef,
  type FormEvent,
} from "react";
import { useNavigate, Link } from "react-router-dom";

import { getProjects } from "@features/projects/services/project.service";
import { getExperiences } from "@features/experience/services/experience.service";
import { getCertificates } from "@features/certificates/services/certificate.service";
import { getApiKeys } from "@features/apiKeys/services/apiKey.service";
import { getContacts } from "@features/contacts/services/contact.service";
import {
  buildSearchHref,
  getSearchTargetCategories,
  normalizeSearchText,
  scoreSearchTarget,
  type SearchTarget,
} from "@shared/lib/globalSearch";

type SearchResult = SearchTarget & {
  score: number;
};

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTargets, setSearchTargets] = useState<SearchTarget[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const [user] = useState<{ name: string; avatar: string | null }>(() => {
    const storedName   = localStorage.getItem("userName");
    const storedAvatar = localStorage.getItem("userAvatar");
    return {
      name: storedName || "Admin User",
      avatar: storedAvatar || null,
    };
  });

  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLFormElement>(null);

  // Close notif dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }

      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    let active = true;

    const loadSearchIndex = async () => {
      setSearchLoading(true);

      const [projectsRes, experiencesRes, certificatesRes, apiKeysRes, contactsRes] =
        await Promise.allSettled([
          getProjects(),
          getExperiences(),
          getCertificates(),
          getApiKeys(),
          getContacts(),
        ]);

      if (!active) {
        return;
      }

      const targets: SearchTarget[] = [
        {
          id: "category-projects",
          label: "Projects",
          kind: "category",
          category: "project",
          keywords: ["project", "projects"],
          route: { path: "/projects" },
        },
        {
          id: "category-research",
          label: "Research",
          kind: "category",
          category: "research",
          keywords: ["research", "paper", "publication"],
          route: { path: "/projects", params: { type: "research" } },
        },
        {
          id: "category-experience",
          label: "Experience",
          kind: "category",
          category: "experience",
          keywords: ["experience", "career", "work"],
          route: { path: "/experience" },
        },
        {
          id: "category-certificates",
          label: "Certificates",
          kind: "category",
          category: "certificate",
          keywords: ["certificate", "certificates", "credential", "certification"],
          route: { path: "/certificates", params: { type: "certificate" } },
        },
        {
          id: "category-achievements",
          label: "Achievements",
          kind: "category",
          category: "achievement",
          keywords: ["achievement", "achievements", "award", "awards"],
          route: { path: "/certificates", params: { type: "achievement" } },
        },
        {
          id: "category-api-keys",
          label: "API Keys",
          kind: "category",
          category: "api-key",
          keywords: ["api key", "api keys", "apikey", "api-keys"],
          route: { path: "/api-keys" },
        },
        {
          id: "category-contacts",
          label: "Contacts",
          kind: "category",
          category: "contact",
          keywords: ["contact", "contacts", "message", "messages", "inbox", "inquiry"],
          route: { path: "/contacts" },
        },
      ];

      if (projectsRes.status === "fulfilled" && projectsRes.value?.success) {
        targets.push(
          ...projectsRes.value.projects.map((project: {
            id: number;
            title: string;
            slug?: string | null;
            description?: string | null;
            publisher?: string | null;
            type?: string | null;
            tags?: unknown;
          }): SearchTarget => {
            const searchType: "project" | "research" =
              (project.type || "").toLowerCase() === "research" ? "research" : "project";
            const keywords = [
              project.title,
              project.slug || "",
              project.description || "",
              project.publisher || "",
              project.type || "",
              ...(Array.isArray(project.tags) ? project.tags : []),
            ]
              .filter(Boolean)
              .map(String);

            return {
              id: `project-${project.slug || project.id}`,
              label: project.title,
              kind: "item" as const,
              category: searchType,
              keywords,
              route: {
                path: "/projects",
                params: {
                  q: project.title,
                  focus: `project-${project.slug || project.id}`,
                  type: searchType,
                },
              },
              focusId: `project-${project.slug || project.id}`,
            };
          })
        );
      }

      if (experiencesRes.status === "fulfilled" && experiencesRes.value?.success) {
        targets.push(
          ...experiencesRes.value.experiences.map((experience: {
            id: number;
            title: string;
            slug: string;
            company: string;
            description?: string | null;
            location?: string | null;
            mode?: string | null;
          }): SearchTarget => ({
            id: `experience-${experience.slug}`,
            label: `${experience.company} - ${experience.title}`,
            kind: "item",
            category: "experience",
            keywords: [
              experience.title,
              experience.slug,
              experience.company,
              experience.description || "",
              experience.location || "",
              experience.mode || "",
            ].filter(Boolean).map(String),
            route: {
              path: "/experience",
              params: {
                q: experience.title,
                focus: `experience-${experience.slug}`,
              },
            },
            focusId: `experience-${experience.slug}`,
          }))
        );
      }

      if (certificatesRes.status === "fulfilled" && certificatesRes.value?.success) {
        targets.push(
          ...certificatesRes.value.certificates.map((certificate: {
            id: number;
            title: string;
            slug: string;
            type: "achievement" | "certificate";
            issued_by?: string | null;
          }): SearchTarget => {
            const category: "achievement" | "certificate" = certificate.type;
            return {
              id: `certificate-${certificate.slug}`,
              label: certificate.title,
              kind: "item",
              category,
              keywords: [
                certificate.title,
                certificate.slug,
                certificate.issued_by || "",
                certificate.type || "",
              ].filter(Boolean).map(String),
              route: {
                path: "/certificates",
                params: {
                  q: certificate.title,
                  focus: `certificate-${certificate.slug}`,
                  type: certificate.type,
                },
              },
              focusId: `certificate-${certificate.slug}`,
            };
          })
        );
      }

      if (apiKeysRes.status === "fulfilled" && apiKeysRes.value?.success) {
        targets.push(
          ...apiKeysRes.value.apis.map((apiKey: {
            id: number;
            name: string;
            status: "active" | "inactive";
          }): SearchTarget => ({
            id: `api-key-${apiKey.id}`,
            label: apiKey.name,
            kind: "item",
            category: "api-key",
            keywords: [apiKey.name, apiKey.status, "api key"],
            route: {
              path: "/api-keys",
              params: {
                q: apiKey.name,
                focus: `api-key-${apiKey.id}`,
              },
            },
            focusId: `api-key-${apiKey.id}`,
          }))
        );
      }

      if (contactsRes.status === "fulfilled" && contactsRes.value?.success) {
        targets.push(
          ...contactsRes.value.contacts.map((contact: {
            id: number;
            name: string;
            email: string;
            subject: string | null;
            message: string;
          }): SearchTarget => ({
            id: `contact-${contact.id}`,
            label: contact.subject
              ? `${contact.name} — ${contact.subject}`
              : contact.name,
            kind: "item",
            category: "contact",
            keywords: [
              contact.name,
              contact.email,
              contact.subject || "",
              contact.message,
              "contact",
              "message",
            ].filter(Boolean).map(String),
            route: {
              path: "/contacts",
              params: {
                q: contact.name,
                focus: `contact-${contact.id}`,
              },
            },
            focusId: `contact-${contact.id}`,
          }))
        );
      }

      if (active) {
        setSearchTargets(targets);
        setSearchLoading(false);
      }
    };

    void loadSearchIndex();

    return () => {
      active = false;
    };
  }, []);

  const searchResults = useMemo<SearchResult[]>(() => {
    const query = normalizeSearchText(searchQuery);

    if (!query) {
      return searchTargets
        .filter((target) => target.kind === "category")
        .map((target) => ({
          ...target,
          score: 1,
        }));
    }

    return searchTargets
      .map((target) => ({
        ...target,
        score: scoreSearchTarget(query, target),
      }))
      .filter((target) => target.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        return a.label.localeCompare(b.label);
      });
  }, [searchQuery, searchTargets]);

  const handleNavigateToResult = (target: SearchTarget) => {
    navigate(buildSearchHref(target));
    setSearchQuery("");
    setSearchOpen(false);
    setSearchFocused(false);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const [bestMatch] = searchResults;
      const categoryHint = getSearchTargetCategories(searchQuery);

      if (bestMatch) {
        handleNavigateToResult(bestMatch);
        return;
      }

      if (categoryHint === "research") {
        navigate("/projects?type=research");
      } else if (categoryHint === "experience") {
        navigate("/experience");
      } else if (categoryHint === "achievement") {
        navigate("/certificates?type=achievement");
      } else if (categoryHint === "certificate") {
        navigate("/certificates?type=certificate");
      } else if (categoryHint === "api-key") {
        navigate("/api-keys");
      } else {
        navigate("/projects");
      }

      setSearchQuery("");
      setSearchOpen(false);
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
      <div className="flex min-w-0 flex-1 items-center gap-3">
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
            relative flex min-w-0 flex-1 max-w-[460px] items-center gap-2.5 rounded-xl px-3.5 py-2
            border transition-all duration-200
            ${searchFocused
              ? "border-[var(--accent)] bg-[var(--bg-card)] shadow-[0_0_0_3px_var(--accent-glow)]"
              : "border-[var(--border-color)] bg-[var(--bg-secondary)]"
            }
          `}
          ref={searchRef}
        >
          <Search
            size={16}
            className={`transition-colors duration-200 ${
              searchFocused ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
            }`}
          />
          <input
            type="text"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => {
              setSearchFocused(true);
              setSearchOpen(true);
            }}
            className="
              min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)]
              outline-none placeholder:text-[var(--text-muted)]
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

          {searchOpen && (
            <div
              className="
                absolute left-0 top-full mt-2 w-full min-w-0 overflow-hidden rounded-2xl
                border border-[var(--border-color)] bg-[var(--bg-card)] shadow-[var(--shadow-xl)]
              "
              style={{ zIndex: 60 }}
            >
              <div className="border-b border-[var(--border-color)] px-4 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  {searchLoading ? "Building search index..." : "Global Search"}
                </p>
              </div>

              <div className="max-h-80 overflow-y-auto p-2">
                {searchResults.length > 0 ? (
                  searchResults.slice(0, 6).map((result) => (
                    <button
                      key={result.id}
                      type="button"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        handleNavigateToResult(result);
                      }}
                      className="
                        flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left
                        transition-colors hover:bg-[var(--bg-secondary)]
                      "
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                          {result.label}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {result.kind === "category" ? "Category" : result.category.replace("-", " ")}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full border border-[var(--border-color)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        {result.route.path.replace("/", "") || "dashboard"}
                      </span>
                    </button>
                  ))
                ) : searchQuery.trim() ? (
                  <div className="px-3 py-4 text-sm text-[var(--text-muted)]">
                    No direct matches. Try a category like Projects, Experience, Certificates, or API Keys.
                  </div>
                ) : (
                  <div className="px-3 py-4 text-sm text-[var(--text-muted)]">
                    Start typing to search across projects, research, experience, certificates, achievements, and API keys.
                  </div>
                )}
              </div>
            </div>
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
            {/* Pulse dot */}
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--danger)]">
              <span className="absolute inset-0 animate-ping rounded-full bg-[var(--danger)] opacity-60" />
            </span>
          </button>

          {/* Notification dropdown */}
          {showNotif && (
            <div
              className="
                absolute right-0 top-full mt-2 w-72 rounded-2xl border border-[var(--border-color)]
                bg-[var(--bg-card)] p-3 shadow-[var(--shadow-xl)]
                animate-fade-in-up
              "
              style={{ zIndex: 50 }}
            >
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Notifications
              </p>
              <div className="space-y-1">
                {[
                  { title: "New API request", time: "2m ago", dot: "var(--accent)" },
                  { title: "Certificate updated", time: "1h ago", dot: "var(--success)" },
                  { title: "Portfolio viewed", time: "3h ago", dot: "var(--warning)" },
                ].map((n, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--bg-secondary)] cursor-pointer"
                  >
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: n.dot }} />
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{n.title}</p>
                      <p className="text-xs text-[var(--text-muted)]">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
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
