import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  FolderKanban,
  Key,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { toast } from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getApiKeys, type ApiKey } from "@features/apiKeys/services/apiKey.service";
import { getCertificates } from "@features/certificates/services/certificate.service";
import { getExperiences } from "@features/experience/services/experience.service";
import { getProjects } from "@features/projects/services/project.service";
import DashboardLayout from "@layouts/DashboardLayout";

type Project = {
  id: number;
  title: string;
  slug?: string | null;
  description?: string | null;
  publisher?: string | null;
  type?: string | null;
  status?: string | null;
  tags?: unknown;
  authors_contributors?: unknown;
};

type Experience = {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  company: string;
  location?: string | null;
  mode?: string | null;
};

type Certificate = {
  id: number;
  title: string;
  slug: string;
  type: "achievement" | "certificate";
  issued_by?: string | null;
  archive_status?: string | null;
};

type SearchKind =
  | "project"
  | "research"
  | "experience"
  | "certificate"
  | "achievement"
  | "apiKey";

type SearchResult = {
  id: string;
  kind: SearchKind;
  kindLabel: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  tags: string[];
  relevance: number;
  icon: ReactNode;
};

const SECTION_ORDER: Array<{
  kind: SearchKind;
  label: string;
}> = [
  { kind: "project", label: "Projects" },
  { kind: "research", label: "Research" },
  { kind: "experience", label: "Experience" },
  { kind: "certificate", label: "Certificates" },
  { kind: "achievement", label: "Achievements" },
  { kind: "apiKey", label: "API Keys" },
];

function normalize(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function formatDate(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function parseStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }

  if (typeof value !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed
          .map((item) => (typeof item === "string" ? item.trim() : ""))
          .filter(Boolean)
      : [];
  } catch {
    return value.trim() ? [value.trim()] : [];
  }
}

function isVisibleCertificate(certificate: Certificate) {
  return certificate.archive_status !== "archived";
}

function scoreMatch(query: string, values: string[]) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    return -1;
  }

  const normalizedValues = values.map(normalize).filter(Boolean);
  const primary = normalizedValues[0] || "";
  const haystack = normalizedValues.join(" ");

  if (!haystack.includes(normalizedQuery)) {
    return -1;
  }

  if (primary === normalizedQuery) {
    return 100;
  }

  if (primary.startsWith(normalizedQuery)) {
    return 90;
  }

  if (haystack.startsWith(normalizedQuery)) {
    return 80;
  }

  if (primary.includes(normalizedQuery)) {
    return 70;
  }

  return 60;
}

function ResultCard({
  result,
  onClick,
}: {
  result: SearchResult;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-start gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[var(--shadow-md)]"
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
        style={{
          background:
            "linear-gradient(135deg, var(--grad-start), var(--grad-end))",
        }}
      >
        {result.icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-base font-semibold text-[var(--text-primary)]">
            {result.title}
          </h3>
          <span className="rounded-full border border-[var(--border-color)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            {result.kindLabel}
          </span>
        </div>

        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          {result.subtitle}
        </p>

        <p className="mt-2 line-clamp-2 text-sm text-[var(--text-muted)]">
          {result.description}
        </p>

        {result.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {result.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--bg-secondary)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-secondary)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-1 flex items-center gap-1 text-sm font-medium text-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100">
        Open
        <ArrowRight size={15} />
      </div>
    </button>
  );
}

function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";

  const [draftQuery, setDraftQuery] = useState(query);
  const [loading, setLoading] = useState(true);
  const [sourceError, setSourceError] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  useEffect(() => {
    setDraftQuery(query);
  }, [query]);

  useEffect(() => {
    let active = true;

    const loadSources = async () => {
      setLoading(true);
      setSourceError(null);

      const results = await Promise.allSettled([
        getProjects(),
        getExperiences(),
        getCertificates(),
        getApiKeys(),
      ]);

      if (!active) {
        return;
      }

      const errors: string[] = [];

      const projectsResult = results[0];
      if (projectsResult.status === "fulfilled" && Array.isArray(projectsResult.value?.projects)) {
        setProjects(projectsResult.value.projects);
      } else {
        setProjects([]);
        errors.push("projects");
      }

      const experiencesResult = results[1];
      if (experiencesResult.status === "fulfilled" && Array.isArray(experiencesResult.value?.experiences)) {
        setExperiences(experiencesResult.value.experiences);
      } else {
        setExperiences([]);
        errors.push("experience");
      }

      const certificatesResult = results[2];
      if (certificatesResult.status === "fulfilled" && Array.isArray(certificatesResult.value?.certificates)) {
        setCertificates(certificatesResult.value.certificates.filter(isVisibleCertificate));
      } else {
        setCertificates([]);
        errors.push("certificates");
      }

      const apiKeysResult = results[3];
      if (apiKeysResult.status === "fulfilled" && Array.isArray(apiKeysResult.value?.apis)) {
        setApiKeys(apiKeysResult.value.apis);
      } else {
        setApiKeys([]);
        errors.push("api keys");
      }

      if (errors.length > 0) {
        const message = `Some sources could not be loaded: ${errors.join(", ")}`;
        setSourceError(message);
        toast.error(message);
      }

      setLoading(false);
    };

    void loadSources();

    return () => {
      active = false;
    };
  }, []);

  const searchResults = useMemo(() => {
    const normalizedQuery = normalize(query);

    if (!normalizedQuery) {
      return [] as SearchResult[];
    }

    const results: SearchResult[] = [];

    projects.forEach((project) => {
      const kind = normalize(project.type) === "research" ? "research" : "project";
      const subtitle =
        kind === "research"
          ? project.publisher || "Research project"
          : project.status || "Portfolio project";

      const relevance = scoreMatch(normalizedQuery, [
        project.title,
        project.description || "",
        project.publisher || "",
        project.type || "",
        ...parseStringArray(project.tags),
        ...parseStringArray(project.authors_contributors),
      ]);

      if (relevance < 0) {
        return;
      }

      results.push({
        id: `project-${project.id}`,
        kind,
        kindLabel: kind === "research" ? "Research" : "Project",
        title: project.title,
        subtitle,
        description:
          project.description ||
          project.publisher ||
          "Open the project editor to review its details.",
        href: `/projects/${project.slug || project.id}/edit`,
        tags: [
          project.type || "",
          project.status || "",
          ...parseStringArray(project.tags),
        ].filter(Boolean),
        relevance,
        icon: <FolderKanban size={18} />,
      });
    });

    experiences.forEach((experience) => {
      const relevance = scoreMatch(normalizedQuery, [
        experience.title,
        experience.company,
        experience.description || "",
        experience.location || "",
        experience.mode || "",
      ]);

      if (relevance < 0) {
        return;
      }

      results.push({
        id: `experience-${experience.id}`,
        kind: "experience",
        kindLabel: "Experience",
        title: experience.title,
        subtitle: experience.company,
        description:
          experience.description ||
          experience.location ||
          "Open the experience editor to review its details.",
        href: `/experience/${experience.slug}/edit`,
        tags: [experience.mode || "", experience.location || ""].filter(Boolean),
        relevance,
        icon: <BriefcaseBusiness size={18} />,
      });
    });

    certificates.forEach((certificate) => {
      const kind = certificate.type;
      const relevance = scoreMatch(normalizedQuery, [
        certificate.title,
        certificate.issued_by || "",
        certificate.type,
      ]);

      if (relevance < 0) {
        return;
      }

      results.push({
        id: `certificate-${certificate.id}`,
        kind,
        kindLabel: kind === "achievement" ? "Achievement" : "Certificate",
        title: certificate.title,
        subtitle:
          certificate.issued_by ||
          (kind === "achievement" ? "Achievement" : "Certificate"),
        description:
          certificate.issued_by ||
          "Open the certificate editor to review its details.",
        href: `/certificates/${certificate.slug}/edit`,
        tags: [certificate.type].filter(Boolean),
        relevance,
        icon: kind === "achievement" ? <Award size={18} /> : <Sparkles size={18} />,
      });
    });

    apiKeys.forEach((apiKey) => {
      const relevance = scoreMatch(normalizedQuery, [
        apiKey.name,
        apiKey.status,
        String(apiKey.id),
      ]);

      if (relevance < 0) {
        return;
      }

      results.push({
        id: `api-key-${apiKey.id}`,
        kind: "apiKey",
        kindLabel: "API Key",
        title: apiKey.name,
        subtitle: apiKey.status,
        description: apiKey.expires_at
          ? `Expires ${formatDate(apiKey.expires_at)}`
          : "No expiration set.",
        href: "/api-keys",
        tags: [apiKey.status].filter(Boolean),
        relevance,
        icon: <Key size={18} />,
      });
    });

    return results.sort((a, b) => b.relevance - a.relevance);
  }, [apiKeys, certificates, experiences, projects, query]);

  const groupedResults = useMemo(() => {
    return SECTION_ORDER.map((section) => ({
      ...section,
      items: searchResults.filter((item) => item.kind === section.kind),
    })).filter((section) => section.items.length > 0);
  }, [searchResults]);

  const totalResults = searchResults.length;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = draftQuery.trim();

    if (!nextQuery) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(nextQuery)}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <section className="rounded-[32px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-sm)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Global Search
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                Find projects, research, experience, certificates, achievements, and API keys.
              </h1>
              <p className="mt-3 text-[var(--text-secondary)]">
                Search once and jump straight to the right record.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex w-full max-w-xl items-center gap-2 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3"
            >
              <Search size={18} className="text-[var(--text-muted)]" />
              <input
                value={draftQuery}
                onChange={(e) => setDraftQuery(e.target.value)}
                placeholder="Search the dashboard..."
                className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
              />
              {draftQuery && (
                <button
                  type="button"
                  onClick={() => setDraftQuery("")}
                  className="text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </form>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
              Projects
            </span>
            <span className="rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
              Research
            </span>
            <span className="rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
              Experience
            </span>
            <span className="rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
              Certificates
            </span>
            <span className="rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
              Achievements
            </span>
            <span className="rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
              API Keys
            </span>
          </div>
        </section>

        {loading ? (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-40 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4"
              >
                <div className="h-10 w-10 rounded-xl bg-[var(--bg-secondary)] animate-pulse" />
                <div className="mt-4 h-4 w-2/3 rounded bg-[var(--bg-secondary)] animate-pulse" />
                <div className="mt-3 h-3 w-1/2 rounded bg-[var(--bg-secondary)] animate-pulse" />
                <div className="mt-4 h-3 w-full rounded bg-[var(--bg-secondary)] animate-pulse" />
                <div className="mt-2 h-3 w-5/6 rounded bg-[var(--bg-secondary)] animate-pulse" />
              </div>
            ))}
          </section>
        ) : !query ? (
          <section className="rounded-[28px] border border-dashed border-[var(--border-color)] bg-[var(--bg-card)] p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)]">
              <Search size={24} />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-[var(--text-primary)]">
              Start typing a search
            </h2>
            <p className="mt-2 text-[var(--text-secondary)]">
              Use the navbar search to jump into the global search page.
            </p>
          </section>
        ) : totalResults > 0 ? (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[var(--text-secondary)]">
                Showing <span className="font-semibold text-[var(--text-primary)]">{totalResults}</span> result{totalResults === 1 ? "" : "s"} for{" "}
                <span className="font-semibold text-[var(--text-primary)]">"{query}"</span>
              </p>
            </div>

            {sourceError && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-600">
                {sourceError}
              </div>
            )}

            {groupedResults.map((section) => (
              <section key={section.kind} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    {section.label}
                  </h2>
                  <span className="rounded-full bg-[var(--bg-secondary)] px-3 py-1 text-xs font-medium text-[var(--text-muted)]">
                    {section.items.length}
                  </span>
                </div>

                <div className="grid gap-4">
                  {section.items.map((result) => (
                    <ResultCard
                      key={result.id}
                      result={result}
                      onClick={() => navigate(result.href)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <section className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg-secondary)] text-[var(--text-muted)]">
              <Search size={24} />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-[var(--text-primary)]">
              No results found
            </h2>
            <p className="mt-2 text-[var(--text-secondary)]">
              Try a different name, tag, company, issuer, or key name.
            </p>
            {sourceError && (
              <p className="mt-3 text-sm text-amber-600">{sourceError}</p>
            )}
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}

export default SearchPage;
