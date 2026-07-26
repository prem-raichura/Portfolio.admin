import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { toast } from "react-hot-toast";
import { Plus, User, ImagePlus, ArrowLeft, X, Pencil, Trash2, FileText } from "lucide-react";
import DashboardLayout from "@layouts/DashboardLayout";
import PageLoader from "@shared/components/ui/PageLoader";
import { getProfile, updateProfile, type UserProfile } from "../services/profile.service";
import AvatarEditorModal from "../components/AvatarEditorModal";
import { useNavigate } from "react-router-dom";

const PLATFORM_OPTIONS = [
  { value: "github", label: "GitHub" },
  { value: "twitter", label: "Twitter / X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "website", label: "Website" },
  { value: "youtube", label: "YouTube" },
  { value: "instagram", label: "Instagram" },
  { value: "email", label: "Email" },
  { value: "orcid", label: "ORCID" },
  { value: "scholar", label: "Google Scholar" },
];

interface SkillGroup {
  category: string;
  items: string[];
}

function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({});

  // Local states for complex fields
  const [skills, setSkills] = useState<SkillGroup[]>([]);
  const [skillInputs, setSkillInputs] = useState<Record<number, string>>({});
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [removeResume, setRemoveResume] = useState(false);
  const [links, setLinks] = useState<{ platform: string; url: string }[]>([
    { platform: "github", url: "" },
    { platform: "linkedin", url: "" },
  ]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorSrc, setEditorSrc] = useState("");
  const [removeAvatar, setRemoveAvatar] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        if (active && data?.success && data.user) {
          setProfile(data.user);
          if (data.user.avatar) setAvatarPreview(data.user.avatar);

          if (data.user.skills && Array.isArray(data.user.skills)) {
            const raw = data.user.skills as unknown[];
            if (raw.length > 0 && typeof raw[0] === "object" && raw[0] !== null) {
              // Grouped shape.
              setSkills(
                (raw as { category?: string; items?: string[] }[]).map((g) => ({
                  category: g.category || "",
                  items: Array.isArray(g.items) ? g.items : [],
                }))
              );
            } else {
              // Legacy flat string[] — wrap into a single group.
              setSkills([{ category: "General", items: raw as string[] }]);
            }
          }

          if (data.user.users_links && typeof data.user.users_links === "object") {
            const entries = Object.entries(data.user.users_links);
            if (entries.length > 0) {
              const linksArr = entries.map(([k, v]) => ({
                platform: k,
                url: v as string,
              }));
              setLinks(linksArr);
            }
          }
        }
      } catch {
        toast.error("Failed to load profile");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchProfile();
    return () => {
      active = false;
    };
  }, []);

  /* =========================
      VALIDATION
  ========================= */

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Email links are validated as an address; everything else must be a URL.
  const isValidLink = (platform: string, url: string) => {
    if (platform === "email") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url);
    }
    return isValidUrl(url);
  };

  /* =========================
      AVATAR
  ========================= */

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Open the editor on the picked image instead of using it directly.
      setEditorSrc(URL.createObjectURL(file));
      setEditorOpen(true);
    }
    // Reset so re-picking the same file fires onChange again.
    e.target.value = "";
  };

  const handleEditorConfirm = (file: File) => {
    setAvatarFile(file);
    setRemoveAvatar(false);
    setAvatarPreview((prev) => {
      if (prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setEditorOpen(false);
  };

  const handleEditorCancel = () => {
    if (editorSrc.startsWith("blob:")) URL.revokeObjectURL(editorSrc);
    setEditorSrc("");
    setEditorOpen(false);
  };

  const handleEditExisting = () => {
    if (!avatarPreview) return;
    setEditorSrc(avatarPreview);
    setEditorOpen(true);
  };

  const handleRemoveAvatar = () => {
    if (avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview("");
    setRemoveAvatar(true);
  };

  /* =========================
      RESUME
  ========================= */

  const handleResumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Resume must be a PDF");
      } else {
        setResumeFile(file);
        setRemoveResume(false);
      }
    }
    e.target.value = "";
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
    setRemoveResume(true);
    setProfile((prev) => ({ ...prev, resume: null }));
  };

  /* =========================
      SKILLS (grouped by category)
  ========================= */

  const addSkillGroup = () => setSkills([...skills, { category: "", items: [] }]);

  const updateGroupCategory = (index: number, value: string) => {
    const next = [...skills];
    next[index] = { ...next[index], category: value };
    setSkills(next);
  };

  const removeSkillGroup = (index: number) =>
    setSkills(skills.filter((_, i) => i !== index));

  const addSkillItem = (index: number) => {
    const value = (skillInputs[index] || "").trim();
    if (!value) return;
    const next = [...skills];
    if (!next[index].items.includes(value)) {
      next[index] = { ...next[index], items: [...next[index].items, value] };
      setSkills(next);
    }
    setSkillInputs({ ...skillInputs, [index]: "" });
  };

  const removeSkillItem = (index: number, item: string) => {
    const next = [...skills];
    next[index] = {
      ...next[index],
      items: next[index].items.filter((s) => s !== item),
    };
    setSkills(next);
  };

  /* =========================
      LINKS
  ========================= */

  const addLink = () => setLinks([...links, { platform: "", url: "" }]);

  const handleLinkChange = (index: number, field: "platform" | "url", value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const removeLink = (index: number) => setLinks(links.filter((_, i) => i !== index));

  /* =========================
      SUBMIT
  ========================= */

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();

    if (!profile.name?.trim()) {
      toast.error("Full name is required");
      return;
    }

    const invalidLink = links.find(
      (link) => link.url && !isValidLink(link.platform, link.url)
    );
    if (invalidLink) {
      toast.error(`Invalid value for platform: ${invalidLink.platform || "unknown"}`);
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      if (profile.name) formData.append("name", profile.name);
      if (profile.bio) formData.append("bio", profile.bio);
      if (profile.headline !== undefined) formData.append("headline", profile.headline ?? "");
      if (profile.is_public !== undefined) formData.append("is_public", String(profile.is_public));
      if (avatarFile) formData.append("avatar", avatarFile);
      else if (removeAvatar) formData.append("remove_avatar", "true");

      if (resumeFile) formData.append("resume", resumeFile);
      else if (removeResume) formData.append("remove_resume", "true");

      // Drop empty groups; default a missing category label to "General".
      const cleanedSkills = skills
        .map((g) => ({ category: g.category.trim(), items: g.items }))
        .filter((g) => g.category || g.items.length > 0)
        .map((g) => ({ category: g.category || "General", items: g.items }));
      formData.append("skills", JSON.stringify(cleanedSkills));

      const formattedLinks: Record<string, string> = {};
      links.forEach((l) => {
        if (l.platform && l.url) {
          formattedLinks[l.platform.trim()] = l.url.trim();
        }
      });
      formData.append("users_links", JSON.stringify(formattedLinks));

      const res = await updateProfile(formData);

      if (res?.success) {
        toast.success("Profile updated successfully");
        if (profile.name) localStorage.setItem("userName", profile.name);
        if (res.user?.avatar) localStorage.setItem("userAvatar", res.user.avatar);
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <DashboardLayout>

      {/* =========================
          HEADER
      ========================= */}

      <div
        className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div>

          <button
            onClick={() => navigate(-1)}
            className="
              mb-3
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-[var(--text-secondary)]
              transition-all
              duration-300
              hover:text-[var(--text-primary)]
            "
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <h1 className="text-3xl font-bold">Profile Settings</h1>

          <p className="mt-2 text-[var(--text-secondary)]">
            Manage your personal information and public profile
          </p>

        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="
            rounded-2xl
            bg-[var(--button-primary)]
            px-5
            py-3
            font-medium
            text-white
            transition-all
            duration-300
            hover:bg-[var(--button-primary-hover)]
            disabled:opacity-50
            dark:text-black
          "
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>

      </div>

      {/* =========================
          MAIN GRID
      ========================= */}

      <div
        className="
          mt-8
          grid
          grid-cols-1
          gap-6
          lg:grid-cols-3
          pb-12
        "
      >
        {/* =========================
            LEFT
        ========================= */}

        <div className="lg:col-span-2">

          <div
            className="
              rounded-[32px]
              border
              border-[var(--border-color)]
              bg-[var(--bg-card)]
              p-6
            "
          >
            {/* BASIC INFO */}

            <h2
              className="
                mb-6
                flex
                items-center
                gap-2
                text-xl
                font-semibold
              "
            >
              <User size={20} className="text-[var(--button-primary)]" />
              Basic Information
            </h2>

            {/* NAME */}

            <div>
              <label className="mb-2 block text-sm font-medium">Full Name *</label>
              <input
                required
                type="text"
                value={profile.name || ""}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Enter full name"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-[var(--border-color)]
                  bg-[var(--bg-main)]
                  px-4
                  py-3
                  outline-none
                "
              />
            </div>

            {/* BIO */}

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium">Bio</label>
              <textarea
                value={profile.bio || ""}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={5}
                placeholder="Tell us about yourself..."
                className="
                  w-full
                  rounded-2xl
                  border
                  border-[var(--border-color)]
                  bg-[var(--bg-main)]
                  px-4
                  py-3
                  outline-none
                "
              />
            </div>

            {/* HEADLINE */}

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium">
                Headline
              </label>
              <input
                type="text"
                value={profile.headline || ""}
                onChange={(e) =>
                  setProfile({ ...profile, headline: e.target.value })
                }
                placeholder="e.g. Full-Stack Developer & AI Enthusiast"
                maxLength={255}
                className="
                  w-full
                  rounded-2xl
                  border
                  border-[var(--border-color)]
                  bg-[var(--bg-main)]
                  px-4
                  py-3
                  outline-none
                "
              />
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Short tagline shown prominently on your public portfolio.
              </p>
            </div>


            {/* SKILLS (grouped by category) */}

            <div className="mt-6">

              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-medium">Skills / Technologies</label>
                <button
                  type="button"
                  onClick={addSkillGroup}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-[var(--button-primary)]
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-white
                    dark:text-black
                  "
                >
                  <Plus size={16} />
                  Add Group
                </button>
              </div>

              <div className="space-y-4">

                {skills.length === 0 && (
                  <p className="text-sm italic text-[var(--text-muted)]">
                    No skill groups yet. Add one (e.g. "Frontend", "Backend").
                  </p>
                )}

                {skills.map((group, gi) => (
                  <div
                    key={gi}
                    className="
                      rounded-2xl
                      border
                      border-[var(--border-color)]
                      bg-[var(--bg-main)]
                      p-4
                    "
                  >
                    {/* Category name + remove group */}
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={group.category}
                        onChange={(e) => updateGroupCategory(gi, e.target.value)}
                        placeholder="Category (e.g. Frontend)"
                        className="
                          w-full
                          rounded-xl
                          border
                          border-[var(--border-color)]
                          bg-[var(--bg-card)]
                          px-4
                          py-2.5
                          font-medium
                          outline-none
                        "
                      />
                      <button
                        type="button"
                        onClick={() => removeSkillGroup(gi)}
                        className="
                          flex
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-red-200
                          px-3
                          text-red-500
                          transition-all
                          duration-300
                          hover:bg-red-50
                        "
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Add a skill to this group */}
                    <div className="mt-3 flex gap-3">
                      <input
                        type="text"
                        value={skillInputs[gi] || ""}
                        onChange={(e) =>
                          setSkillInputs({ ...skillInputs, [gi]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkillItem(gi);
                          }
                        }}
                        placeholder="Add a skill (e.g. React)"
                        className="
                          w-full
                          rounded-xl
                          border
                          border-[var(--border-color)]
                          bg-[var(--bg-card)]
                          px-4
                          py-2.5
                          outline-none
                        "
                      />
                      <button
                        type="button"
                        onClick={() => addSkillItem(gi)}
                        className="
                          flex
                          items-center
                          justify-center
                          rounded-xl
                          bg-[var(--button-primary)]
                          px-4
                          text-white
                          dark:text-black
                        "
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    {/* Skill pills */}
                    {group.items.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {group.items.map((item, ii) => (
                          <div
                            key={ii}
                            className="
                              flex
                              items-center
                              gap-2
                              rounded-full
                              bg-[var(--bg-secondary)]
                              px-4
                              py-2
                              text-sm
                            "
                          >
                            {item}
                            <button
                              type="button"
                              onClick={() => removeSkillItem(gi, item)}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

              </div>

            </div>

            {/* SOCIAL LINKS */}

            <div className="mt-6">

              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-medium">Social Links</label>
                <button
                  type="button"
                  onClick={addLink}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-[var(--button-primary)]
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-white
                    dark:text-black
                  "
                >
                  <Plus size={16} />
                  Add Link
                </button>
              </div>

              <div className="space-y-4">

                {links.length === 0 && (
                  <p className="text-sm italic text-[var(--text-muted)]">No links added yet.</p>
                )}

                {links.map((link, idx) => {
                  const selectedPlatforms = links.map(l => l.platform);
                  
                  return (
                    <div
                      key={idx}
                      className="
                        grid
                        grid-cols-1
                        gap-4
                        rounded-2xl
                        border
                        border-[var(--border-color)]
                        bg-[var(--bg-main)]
                        p-4
                        md:grid-cols-12
                      "
                    >
                      {/* Platform */}
                      <div className="md:col-span-3">
                        <select
                          value={link.platform}
                          onChange={(e) => handleLinkChange(idx, "platform", e.target.value)}
                          className="
                            w-full
                            rounded-xl
                            border
                            border-[var(--border-color)]
                            bg-[var(--bg-card)]
                            px-4
                            py-3
                            outline-none
                          "
                        >
                          <option value="">Select</option>
                          {PLATFORM_OPTIONS.map((opt) => {
                            const isUsed = selectedPlatforms.includes(opt.value);
                            const isThis = link.platform === opt.value;
                            if (isUsed && !isThis) return null;
                            return (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* URL */}
                    <div className="md:col-span-8">
                      <input
                        type="text"
                        placeholder={
                          link.platform === "email"
                            ? "you@example.com"
                            : "URL (e.g. https://github.com/...)"
                        }
                        value={link.url}
                        onChange={(e) => handleLinkChange(idx, "url", e.target.value)}
                        className={`
                          w-full
                          rounded-xl
                          border
                          px-4
                          py-3
                          outline-none
                          bg-[var(--bg-card)]
                          ${link.url && !isValidLink(link.platform, link.url)
                            ? "border-red-400"
                            : "border-[var(--border-color)]"
                          }
                        `}
                      />
                      {link.url && !isValidLink(link.platform, link.url) && (
                        <p className="mt-2 text-xs text-red-500">
                          {link.platform === "email"
                            ? "Invalid email address"
                            : "Invalid URL format"}
                        </p>
                      )}
                    </div>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => removeLink(idx)}
                      className="
                        flex
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-red-200
                        text-red-500
                        transition-all
                        duration-300
                        hover:bg-red-50
                      "
                    >
                      <X size={18} />
                    </button>

                  </div>
                )})}

              </div>

            </div>

          </div>
        </div>

        {/* =========================
            RIGHT
        ========================= */}

        <div className="space-y-6">

          {/* AVATAR */}

          <div
            className="
              rounded-[32px]
              border
              border-[var(--border-color)]
              bg-[var(--bg-card)]
              p-6
            "
          >
            <h2 className="text-lg font-semibold">Avatar</h2>

            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />

            {avatarPreview ? (
              <div
                className="
                  group
                  relative
                  mt-5
                  h-64
                  overflow-hidden
                  rounded-3xl
                  border
                  border-[var(--border-color)]
                  bg-[var(--bg-main)]
                "
              >
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />

                {/* Hover actions */}
                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    gap-3
                    bg-black/50
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                  "
                >
                  <button
                    type="button"
                    onClick={handleEditExisting}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-white/90
                      px-4
                      py-2
                      text-sm
                      font-medium
                      text-black
                      transition-transform
                      hover:scale-105
                    "
                  >
                    <Pencil size={15} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-red-500/90
                      px-4
                      py-2
                      text-sm
                      font-medium
                      text-white
                      transition-transform
                      hover:scale-105
                    "
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="avatar-upload"
                className="
                  mt-5
                  flex
                  h-64
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-3xl
                  border-2
                  border-dashed
                  border-[var(--border-color)]
                  bg-[var(--bg-main)]
                  transition-all
                  duration-300
                  hover:border-[var(--button-primary)]
                "
              >
                <ImagePlus size={42} className="text-[var(--text-secondary)]" />
                <p className="mt-4 text-sm text-[var(--text-secondary)]">
                  Click to upload avatar
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  PNG, JPG, WEBP
                </p>
              </label>
            )}

          </div>

          {/* RESUME */}

          <div
            className="
              rounded-[32px]
              border
              border-[var(--border-color)]
              bg-[var(--bg-card)]
              p-6
            "
          >
            <h2 className="text-lg font-semibold">Resume</h2>

            <input
              type="file"
              id="resume-upload"
              accept="application/pdf"
              className="hidden"
              onChange={handleResumeChange}
            />

            {resumeFile || (profile.resume && !removeResume) ? (
              <div
                className="
                  mt-5
                  flex
                  items-center
                  justify-between
                  gap-3
                  rounded-2xl
                  border
                  border-[var(--border-color)]
                  bg-[var(--bg-main)]
                  p-4
                "
              >
                <div className="flex min-w-0 items-center gap-3">
                  <FileText size={22} className="shrink-0 text-[var(--button-primary)]" />
                  <div className="min-w-0">
                    {resumeFile ? (
                      <p className="truncate text-sm font-medium">{resumeFile.name}</p>
                    ) : (
                      <a
                        href={profile.resume as string}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate text-sm font-medium text-[var(--button-primary)] hover:underline"
                      >
                        View current resume
                      </a>
                    )}
                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">PDF</p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer rounded-xl border border-[var(--border-color)] px-3 py-2 text-xs font-medium transition-colors hover:bg-[var(--bg-secondary)]"
                  >
                    Replace
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveResume}
                    className="flex items-center justify-center rounded-xl border border-red-200 px-3 py-2 text-red-500 transition-colors hover:bg-red-50"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="resume-upload"
                className="
                  mt-5
                  flex
                  h-32
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-3xl
                  border-2
                  border-dashed
                  border-[var(--border-color)]
                  bg-[var(--bg-main)]
                  transition-all
                  duration-300
                  hover:border-[var(--button-primary)]
                "
              >
                <FileText size={34} className="text-[var(--text-secondary)]" />
                <p className="mt-3 text-sm text-[var(--text-secondary)]">
                  Click to upload resume
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">PDF only</p>
              </label>
            )}

          </div>

          {/* ACCOUNT DETAILS */}

          <div
            className="
              rounded-[32px]
              border
              border-[var(--border-color)]
              bg-[var(--bg-card)]
              p-6
            "
          >
            <h2 className="text-lg font-semibold">Account Details</h2>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium">Username</label>
              <input
                type="text"
                disabled
                value={profile.username || ""}
                className="
                  w-full
                  cursor-not-allowed
                  rounded-2xl
                  border
                  border-[var(--border-color)]
                  bg-[var(--bg-main)]
                  px-4
                  py-3
                  opacity-70
                  outline-none
                "
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium">Email</label>
              <input
                type="email"
                disabled
                value={profile.email || ""}
                className="
                  w-full
                  cursor-not-allowed
                  rounded-2xl
                  border
                  border-[var(--border-color)]
                  bg-[var(--bg-main)]
                  px-4
                  py-3
                  opacity-70
                  outline-none
                "
              />
            </div>

          </div>

          {/* VISIBILITY */}

          <div
            className="
              rounded-[32px]
              border
              border-[var(--border-color)]
              bg-[var(--bg-card)]
              p-6
            "
          >
            <h2 className="text-lg font-semibold">Visibility</h2>

            <div
              className="
                mt-6
                flex
                items-center
                justify-between
              "
            >
              <div>
                <h3 className="font-medium">Public Profile</h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Make your portfolio visible
                </p>
              </div>

              <button
                type="button"
                onClick={() => setProfile({ ...profile, is_public: !profile.is_public })}
                className={`
                  relative
                  h-7
                  w-12
                  rounded-full
                  transition-all
                  duration-300
                  ${profile.is_public ? "bg-[var(--button-primary)]" : "bg-gray-300"}
                `}
              >
                <div
                  className={`
                    absolute
                    top-1
                    h-5
                    w-5
                    rounded-full
                    bg-white
                    transition-all
                    duration-300
                    ${profile.is_public ? "right-1" : "left-1"}
                  `}
                />
              </button>

            </div>

          </div>

        </div>

      </div>

      <AvatarEditorModal
        open={editorOpen}
        imageSrc={editorSrc}
        onCancel={handleEditorCancel}
        onConfirm={handleEditorConfirm}
      />

    </DashboardLayout>
  );
}

export default Profile;
