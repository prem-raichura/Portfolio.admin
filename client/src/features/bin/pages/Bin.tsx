import { useEffect, useMemo, useState } from "react";
import {
  Trash2,
  RotateCcw,
  FolderKanban,
  BriefcaseBusiness,
  Award,
  Key,
} from "lucide-react";
import { toast } from "react-hot-toast";

import DashboardLayout from "@layouts/DashboardLayout";
import { CardSkeletonGrid } from "@shared/components/ui/CardSkeletons";
import {
  type BinType,
  type BinResponse,
  getBin,
  restoreItem,
  permanentlyDelete,
} from "@features/bin/services/bin.service";

type Tab = "project" | "experience" | "certificate" | "apiKey";

const TAB_CONFIG: Array<{
  value: Tab;
  label: string;
  icon: typeof FolderKanban;
}> = [
  { value: "project", label: "Projects", icon: FolderKanban },
  { value: "experience", label: "Experience", icon: BriefcaseBusiness },
  { value: "certificate", label: "Certificates", icon: Award },
  { value: "apiKey", label: "API Keys", icon: Key },
];

function formatDeletedAt(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysUntilPurge(value: string) {
  const PURGE_DAYS = 30;
  const deletedAt = new Date(value).getTime();
  const purgeAt = deletedAt + PURGE_DAYS * 24 * 60 * 60 * 1000;
  const left = Math.ceil((purgeAt - Date.now()) / (24 * 60 * 60 * 1000));
  return Math.max(0, left);
}

interface RowItem {
  id: number;
  title: string;
  subtitle?: string;
  deleted_at: string;
}

function Bin() {
  const [bin, setBin] = useState<BinResponse["bin"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("project");
  const [purgeTarget, setPurgeTarget] = useState<{
    type: BinType;
    id: number;
    title: string;
  } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchBin = async () => {
    try {
      const res = await getBin();
      if (res.success) setBin(res.bin);
    } catch (err) {
      console.error("Failed to load bin", err);
      toast.error("Failed to load the Bin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBin();
  }, []);

  const rows: RowItem[] = useMemo(() => {
    if (!bin) return [];
    if (tab === "project") {
      return bin.projects.map((p) => ({
        id: p.id,
        title: p.title,
        subtitle: p.type || p.slug || undefined,
        deleted_at: p.deleted_at,
      }));
    }
    if (tab === "experience") {
      return bin.experience.map((e) => ({
        id: e.id,
        title: e.title,
        subtitle: e.company,
        deleted_at: e.deleted_at,
      }));
    }
    if (tab === "certificate") {
      return bin.certificates.map((c) => ({
        id: c.id,
        title: c.title,
        subtitle: c.issued_by || c.type,
        deleted_at: c.deleted_at,
      }));
    }
    return bin.apiKeys.map((k) => ({
      id: k.id,
      title: k.name,
      subtitle: `${k.api_key.substring(0, 16)}…`,
      deleted_at: k.deleted_at,
    }));
  }, [bin, tab]);

  const handleRestore = async (type: BinType, id: number) => {
    const key = `${type}-${id}`;
    setBusyId(key);
    try {
      const res = await restoreItem(type, id);
      if (res.success) {
        toast.success("Restored");
        await fetchBin();
      } else {
        toast.error(res.message || "Restore failed");
      }
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Restore failed";
      toast.error(msg);
    } finally {
      setBusyId(null);
    }
  };

  const confirmPurge = async () => {
    if (!purgeTarget) return;
    const key = `${purgeTarget.type}-${purgeTarget.id}`;
    setBusyId(key);
    try {
      const res = await permanentlyDelete(purgeTarget.type, purgeTarget.id);
      if (res.success) {
        toast.success("Deleted forever");
        setPurgeTarget(null);
        await fetchBin();
      } else {
        toast.error(res.message || "Permanent delete failed");
      }
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Permanent delete failed";
      toast.error(msg);
    } finally {
      setBusyId(null);
    }
  };

  const counts = useMemo(() => {
    if (!bin) {
      return { project: 0, experience: 0, certificate: 0, apiKey: 0 };
    }
    return {
      project: bin.projects.length,
      experience: bin.experience.length,
      certificate: bin.certificates.length,
      apiKey: bin.apiKeys.length,
    };
  }, [bin]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="space-y-2">
            <div className="h-7 w-32 rounded bg-[var(--bg-secondary)]" />
            <div className="h-4 w-72 rounded bg-[var(--bg-secondary)]" />
          </div>
          <CardSkeletonGrid type="stat" count={4} cols="grid-cols-1" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
          Bin
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Items here are kept for 30 days, then permanently deleted.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-[var(--border-color)] pb-2">
        {TAB_CONFIG.map((item) => {
          const Icon = item.icon;
          const active = tab === item.value;
          return (
            <button
              key={item.value}
              onClick={() => setTab(item.value)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
              style={
                active
                  ? {
                      background:
                        "linear-gradient(135deg, var(--grad-start), var(--grad-end))",
                    }
                  : undefined
              }
            >
              <Icon size={16} />
              {item.label}
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  active
                    ? "bg-white/20 text-white"
                    : "bg-[var(--bg-secondary)] text-[var(--text-muted)]"
                }`}
              >
                {counts[item.value]}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-color)] py-20 text-center">
          <div className="mb-4 rounded-full bg-[var(--bg-secondary)] p-4">
            <Trash2 size={32} className="text-[var(--text-muted)]" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">Bin is empty</h3>
          <p className="max-w-md text-sm text-[var(--text-muted)]">
            Anything you delete will appear here for 30 days before it's gone
            for good.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {rows.map((row) => {
            const key = `${tab}-${row.id}`;
            const busy = busyId === key;
            const daysLeft = daysUntilPurge(row.deleted_at);
            return (
              <div
                key={key}
                className="flex flex-col gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-[var(--text-primary)]">
                    {row.title}
                  </p>
                  {row.subtitle ? (
                    <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">
                      {row.subtitle}
                    </p>
                  ) : null}
                  <p className="mt-2 text-xs text-[var(--text-muted)]">
                    Deleted {formatDeletedAt(row.deleted_at)}
                    {" · "}
                    {daysLeft === 0
                      ? "purges today"
                      : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleRestore(tab, row.id)}
                    disabled={busy}
                    className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <RotateCcw size={15} />
                    Restore
                  </button>
                  <button
                    onClick={() =>
                      setPurgeTarget({
                        type: tab,
                        id: row.id,
                        title: row.title,
                      })
                    }
                    disabled={busy}
                    className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:border-red-500/30 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 size={15} />
                    Delete forever
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Permanent-delete confirm modal */}
      {purgeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              Delete forever?
            </h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              "{purgeTarget.title}" will be permanently removed. This cannot be
              undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setPurgeTarget(null)}
                disabled={busyId !== null}
                className="rounded-xl px-5 py-2.5 text-sm font-medium transition-all hover:bg-[var(--bg-secondary)] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmPurge}
                disabled={busyId !== null}
                className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-red-600 disabled:opacity-50"
              >
                {busyId ? "Deleting…" : "Delete forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Bin;
