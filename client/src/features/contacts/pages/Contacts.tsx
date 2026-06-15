import { useEffect, useState } from "react";
import {
  Mail,
  Trash2,
  X,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-hot-toast";

import DashboardLayout from "@layouts/DashboardLayout";
import { CardSkeletonGrid } from "@shared/components/ui/CardSkeletons";
import {
  type Contact,
  getContacts,
  getContact,
  deleteContact,
} from "@features/contacts/services/contact.service";

function formatDate(value: string) {
  const date = new Date(value);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const [openContact, setOpenContact] = useState<Contact | null>(null);
  const [loadingOpen, setLoadingOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAll = async () => {
    try {
      const res = await getContacts();
      if (res.success) {
        setContacts(res.contacts);
      }
    } catch (err) {
      console.error("Failed to load contacts", err);
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleOpen = async (contact: Contact) => {
    setOpenContact(contact);
    if (!contact.is_read) {
      // Server auto-flips is_read. Mirror the change locally so the list
      // updates immediately without a full refetch.
      setLoadingOpen(true);
      try {
        const res = await getContact(contact.id);
        if (res.success && res.contact) {
          setOpenContact(res.contact);
          setContacts((prev) =>
            prev.map((c) => (c.id === contact.id ? res.contact : c))
          );
        }
      } catch (err) {
        console.error("Failed to load contact detail", err);
      } finally {
        setLoadingOpen(false);
      }
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteContact(deleteTarget.id);
      if (res.success) {
        toast.success("Contact moved to Bin");
        setContacts((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        toast.error(res.message || "Failed to delete contact");
      }
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to delete contact";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

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

  const unreadCount = contacts.filter((c) => !c.is_read).length;

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
            Contacts
          </h1>
          {unreadCount > 0 && (
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
              style={{
                background:
                  "linear-gradient(135deg, var(--grad-start), var(--grad-end))",
              }}
            >
              {unreadCount} new
            </span>
          )}
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          Messages people sent through your portfolio.
        </p>
      </div>

      {contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-color)] py-20 text-center">
          <div className="mb-4 rounded-full bg-[var(--bg-secondary)] p-4">
            <Mail size={32} className="text-[var(--text-muted)]" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
            No contacts yet
          </h3>
          <p className="max-w-md text-sm text-[var(--text-muted)]">
            When someone reaches out through your portfolio contact form,
            their message will show up here.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex flex-col gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 transition-colors hover:border-[var(--accent)]/30 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {!contact.is_read && (
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: "var(--accent)" }}
                      aria-label="Unread"
                    />
                  )}
                  <p className="truncate text-base font-semibold text-[var(--text-primary)]">
                    {contact.name}
                  </p>
                </div>
                <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">
                  {contact.email}
                  {contact.subject ? ` · ${contact.subject}` : ""}
                </p>
                <p className="mt-2 line-clamp-1 text-sm text-[var(--text-secondary)]">
                  {contact.message}
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                  <Calendar size={12} />
                  Received {formatDate(contact.created_at)}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => handleOpen(contact)}
                  className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent)]/30 hover:text-[var(--accent)]"
                >
                  View more
                </button>
                <button
                  onClick={() => setDeleteTarget(contact)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-red-500 transition-colors hover:border-red-500/30 hover:bg-red-500/10"
                  title="Move to Bin"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {openContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="truncate text-xl font-bold text-[var(--text-primary)]">
                  {openContact.name}
                </h3>
                <a
                  href={`mailto:${openContact.email}`}
                  className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:underline"
                >
                  {openContact.email}
                  <ExternalLink size={12} />
                </a>
              </div>
              <button
                onClick={() => setOpenContact(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {openContact.subject && (
              <div className="mb-3">
                <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                  Subject
                </p>
                <p className="mt-0.5 text-sm font-semibold text-[var(--text-primary)]">
                  {openContact.subject}
                </p>
              </div>
            )}

            <div className="mb-4">
              <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                Message
              </p>
              <div className="mt-1 max-h-[40vh] overflow-y-auto whitespace-pre-wrap rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                {loadingOpen ? "Loading…" : openContact.message}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-[var(--border-color)] pt-4">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <Calendar size={12} />
                {formatDate(openContact.created_at)}
              </div>
              <button
                onClick={() => setOpenContact(null)}
                className="rounded-xl px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-secondary)]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              Move Contact to Bin?
            </h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              The message from "{deleteTarget.name}" will be moved to the Bin.
              You can restore it for 30 days before it's permanently deleted.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="rounded-xl px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--bg-secondary)] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                {isDeleting ? "Moving…" : "Move to Bin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Contacts;
