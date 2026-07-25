import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import { isAxiosError } from "axios";
import {
  X,
  GitBranch,
  Lock,
  Globe,
  Star,
  Check,
  Loader2,
  Plus,
} from "lucide-react";

import {
  connectGithub,
  getGithubRepos,
  importGithubRepo,
  type GithubRepo,
} from "@features/projects/services/github.service";

interface ImportGithubModalProps {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
}

function ImportGithubModal({ open, onClose, onImported }: ImportGithubModalProps) {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [search, setSearch] = useState("");
  const [importing, setImporting] = useState<string | null>(null);
  const [added, setAdded] = useState<Set<string>>(new Set());

  const loadRepos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getGithubRepos();
      setConnected(Boolean(data.connected));
      setRepos(data.repos ?? []);
    } catch (error) {
      console.error("Failed to load GitHub repos", error);
      toast.error("Failed to load GitHub repositories");
      setConnected(false);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch repos whenever the modal opens; reset per-session state.
  useEffect(() => {
    if (!open) return;
    setSearch("");
    setAdded(new Set());
    void loadRepos();
  }, [open, loadRepos]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const { authUrl } = await connectGithub();
      // Full-page redirect to GitHub consent; returns to /projects?github=connected.
      window.location.href = authUrl;
    } catch (error) {
      console.error("Failed to start GitHub connection", error);
      toast.error("Could not start GitHub connection");
      setConnecting(false);
    }
  };

  const handleImport = async (repo: GithubRepo) => {
    setImporting(repo.full_name);
    try {
      const res = await importGithubRepo(repo.full_name);
      if (res?.success) {
        setAdded((prev) => new Set(prev).add(repo.full_name));
        toast.success(`Imported "${repo.name}"`);
        onImported();
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error("Failed to import repo", error);
      // A 401 means the cached GitHub token expired — prompt a reconnect.
      if (isAxiosError(error) && error.response?.status === 401) {
        toast.error("GitHub session expired, reconnect and try again");
        setConnected(false);
      } else {
        toast.error("Failed to import repository");
      }
    } finally {
      setImporting(null);
    }
  };

  if (!open) return null;

  const filteredRepos = repos.filter((repo) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      repo.name.toLowerCase().includes(term) ||
      repo.full_name.toLowerCase().includes(term) ||
      (repo.description?.toLowerCase().includes(term) ?? false)
    );
  });

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="
          relative
          z-10
          flex
          max-h-[90vh]
          w-full
          max-w-2xl
          flex-col
          overflow-hidden
          rounded-[28px]
          border
          border-[var(--border-color)]
          bg-[var(--bg-card)]
          shadow-2xl
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <GitBranch size={20} />
            <h2 className="text-lg font-semibold">Import from GitHub</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search (only when repos are shown) */}
        {connected && !loading && repos.length > 0 && (
          <div className="border-b border-[var(--border-color)] px-6 py-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search repositories…"
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--button-primary)]"
            />
          </div>
        )}

        {/* Body (scrollable) */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-[var(--text-secondary)]">
              <Loader2 className="animate-spin" size={28} />
              <p className="text-sm">Loading repositories…</p>
            </div>
          ) : !connected ? (
            <div className="flex flex-col items-center justify-center gap-4 py-14 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--bg-secondary)]">
                <GitBranch size={30} />
              </div>
              <div>
                <p className="font-semibold">Connect your GitHub account</p>
                <p className="mt-1 max-w-sm text-sm text-[var(--text-secondary)]">
                  Authorize access to list your repositories (including private
                  ones) so you can import them as projects.
                </p>
              </div>
              <button
                type="button"
                onClick={handleConnect}
                disabled={connecting}
                className="flex items-center gap-2 rounded-2xl bg-[var(--button-primary)] px-6 py-2.5 font-medium text-white transition-all hover:bg-[var(--button-primary-hover)] disabled:opacity-50 dark:text-black"
              >
                {connecting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <GitBranch size={18} />
                )}
                {connecting ? "Redirecting…" : "Connect GitHub"}
              </button>
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="py-14 text-center text-sm text-[var(--text-secondary)]">
              {repos.length === 0
                ? "No repositories found on your GitHub account."
                : "No repositories match your search."}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredRepos.map((repo) => {
                const isAdded = added.has(repo.full_name);
                const isImporting = importing === repo.full_name;

                return (
                  <div
                    key={repo.id}
                    className="flex items-center gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-medium">{repo.name}</p>
                        <span className="flex items-center gap-1 rounded-full bg-[var(--bg-secondary)] px-2 py-0.5 text-[11px] text-[var(--text-secondary)]">
                          {repo.private ? (
                            <>
                              <Lock size={11} /> Private
                            </>
                          ) : (
                            <>
                              <Globe size={11} /> Public
                            </>
                          )}
                        </span>
                      </div>
                      {repo.description && (
                        <p className="mt-1 truncate text-sm text-[var(--text-secondary)]">
                          {repo.description}
                        </p>
                      )}
                      <div className="mt-1.5 flex items-center gap-3 text-xs text-[var(--text-muted)]">
                        {repo.language && <span>{repo.language}</span>}
                        <span className="flex items-center gap-1">
                          <Star size={12} /> {repo.stargazers_count}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleImport(repo)}
                      disabled={isAdded || isImporting}
                      className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed ${
                        isAdded
                          ? "bg-green-500/10 text-green-500"
                          : "bg-[var(--button-primary)] text-white hover:bg-[var(--button-primary-hover)] disabled:opacity-60 dark:text-black"
                      }`}
                    >
                      {isImporting ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : isAdded ? (
                        <Check size={16} />
                      ) : (
                        <Plus size={16} />
                      )}
                      {isImporting ? "Adding…" : isAdded ? "Added" : "Add"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ImportGithubModal;
