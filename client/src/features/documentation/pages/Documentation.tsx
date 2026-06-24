import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import {
  ArrowLeft,
  Sun,
  Moon,
  Copy,
  Check,
  FileText,
  Search,
  BookOpen,
  Info,
  AlertTriangle,
  ArrowUpRight,
  User,
  Key,
  BarChart2,
  Menu,
  Hash,
  X,
  Eye,
  Users,
  Globe,
  Monitor,
  Download,
  GitBranch,
  Mail,
  TrendingUp,
  Filter,
  MousePointerClick,
  Clock,
  Layers,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DocPage {
  id: string;
  title: string;
  category: string;
  attributes?: Array<{ name: string; value: string }>;
  headings: Array<{ id: string; text: string; sub?: boolean }>;
  content: React.ReactNode;
}

// ─── Reusable primitives ─────────────────────────────────────────────────────

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3
      id={id}
      className="flex items-center gap-3 text-[15px] font-semibold text-[var(--text-primary)] pt-1 pb-3 border-b border-[var(--border-color)] scroll-mt-20"
    >
      <span
        className="h-[18px] w-[3px] rounded-full shrink-0"
        style={{ background: "linear-gradient(to bottom, var(--grad-start), var(--grad-end))" }}
      />
      {children}
    </h3>
  );
}

function Callout({
  variant,
  icon,
  title,
  children,
}: {
  variant: "info" | "warning";
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const isInfo = variant === "info";
  const accent = isInfo ? "var(--accent)" : "var(--warning)";
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: isInfo ? "var(--accent-light)" : "rgba(245,158,11,0.08)",
        borderLeft: `3px solid ${accent}`,
        border: `1px solid ${accent}`,
        borderLeftWidth: "3px",
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span style={{ color: accent }} className="shrink-0 flex items-center">{icon}</span>
        <span className="text-[13px] font-semibold text-[var(--text-primary)]">{title}</span>
      </div>
      <div className="text-[13px] leading-relaxed text-[var(--text-secondary)]">{children}</div>
    </div>
  );
}

function CodeBlock({
  language,
  code,
  copyId,
  copyLabel = "Copy",
  copiedText,
  onCopy,
  maxHeight,
}: {
  language: string;
  code: string;
  copyId: string;
  copyLabel?: string;
  copiedText: string | null;
  onCopy: (text: string, id: string) => void;
  maxHeight?: string;
}) {
  const isCopied = copiedText === copyId;
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border-color)]">
      <div className="flex h-10 items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">{language}</span>
        </div>
        <button
          onClick={() => onCopy(code, copyId)}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
        >
          {isCopied ? <><Check size={11} className="text-[var(--success)]" /> Copied</> : <><Copy size={11} /> {copyLabel}</>}
        </button>
      </div>
      <div className={`bg-[var(--bg-tertiary)] ${maxHeight ? `overflow-y-auto ${maxHeight}` : ""}`}>
        <pre className="overflow-x-auto p-5 text-[12.5px] font-mono leading-[1.75] text-[var(--text-primary)]">{code}</pre>
      </div>
    </div>
  );
}

// ─── Chart components ─────────────────────────────────────────────────────────

const VISITS  = [82,67,95,78,110,130,98,115,88,142,160,135,118,95,105,122,145,158,138,125,148,170,155,140,128,112,99,118,132,125];
const UNIQUE  = [55,44,63,52, 74, 88,66, 77,59, 95,107, 90, 79,64, 70, 82, 97,106, 92, 84, 99,114,104, 94, 86, 75,66, 79, 88, 84];
const CLICKS  = [28,22,38,31, 45, 54,40, 48,35, 58, 66, 55, 49,39, 43, 50, 60, 65, 57, 51, 62, 70, 64, 58, 53, 46,41, 49, 54, 51];

function ActivityChart() {
  const W = 460, H = 152;
  const PL = 30, PR = 6, PT = 8, PB = 22;
  const plotW = W - PL - PR;
  const plotH = H - PT - PB;
  const MAX = 190;

  const cx = (i: number) => PL + (i / (VISITS.length - 1)) * plotW;
  const cy = (v: number) => PT + plotH - (v / MAX) * plotH;

  const pts = (data: number[]) =>
    data.map((v, i) => `${cx(i).toFixed(1)},${cy(v).toFixed(1)}`).join(" ");

  const area = (data: number[]) =>
    `${cx(0).toFixed(1)},${(PT + plotH).toFixed(1)} ${pts(data)} ${cx(data.length - 1).toFixed(1)},${(PT + plotH).toFixed(1)}`;

  const gridY = [0, 50, 100, 150];
  const xTicks = [
    { i: 0, label: "Jun 1" }, { i: 7, label: "Jun 8" }, { i: 14, label: "Jun 15" },
    { i: 21, label: "Jun 22" }, { i: 29, label: "Jun 30" },
  ];
  const peakIdx = VISITS.indexOf(170);

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-color)] px-5 py-3.5">
        <div>
          <p className="text-[13px] font-semibold text-[var(--text-primary)]">Activity Over Time</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Jun 2025 · 30 days · daily granularity</p>
        </div>
        <div className="flex items-center gap-5">
          {([
            { label: "Visits", color: "#6366f1" },
            { label: "Unique Visitors", color: "#3b82f6" },
            { label: "Project Clicks", color: "#10b981" },
          ] as const).map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="block h-[2.5px] w-6 rounded-full" style={{ background: color }} />
              <span className="text-[10px] font-medium text-[var(--text-muted)]">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG chart */}
      <div className="px-2 pb-2 pt-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 152 }}>
          <defs>
            <linearGradient id="ag-v" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="ag-u" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="ag-c" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {gridY.map(v => (
            <g key={v}>
              <line
                x1={PL} y1={cy(v).toFixed(1)}
                x2={W - PR} y2={cy(v).toFixed(1)}
                stroke="var(--border-color)" strokeWidth="1"
                strokeDasharray={v === 0 ? "0" : "3 4"}
              />
              <text
                x={PL - 5} y={cy(v)} dy="0.32em"
                textAnchor="end" fontSize="8.5" fill="var(--text-muted)"
              >{v}</text>
            </g>
          ))}

          {/* Area fills */}
          <polygon points={area(VISITS)} fill="url(#ag-v)" />
          <polygon points={area(UNIQUE)} fill="url(#ag-u)" />
          <polygon points={area(CLICKS)} fill="url(#ag-c)" />

          {/* Lines */}
          <polyline points={pts(VISITS)} fill="none" stroke="#6366f1" strokeWidth="2"   strokeLinejoin="round" strokeLinecap="round" />
          <polyline points={pts(UNIQUE)} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
          <polyline points={pts(CLICKS)} fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />

          {/* Peak dot + tooltip */}
          <circle cx={cx(peakIdx).toFixed(1)} cy={cy(170).toFixed(1)} r="4" fill="#6366f1" stroke="var(--bg-card)" strokeWidth="2" />
          <rect
            x={cx(peakIdx) - 26} y={cy(170) - 22}
            width="52" height="16" rx="4"
            fill="#6366f1" opacity="0.92"
          />
          <text
            x={cx(peakIdx)} y={cy(170) - 11}
            textAnchor="middle" fontSize="8.5" fill="white" fontWeight="600"
          >170 visits</text>
          {/* Tooltip stem */}
          <line
            x1={cx(peakIdx).toFixed(1)} y1={cy(170) - 6}
            x2={cx(peakIdx).toFixed(1)} y2={cy(170) - 1}
            stroke="#6366f1" strokeWidth="1.5"
          />

          {/* X-axis ticks */}
          {xTicks.map(({ i, label }) => (
            <text key={i} x={cx(i)} y={H - 5} textAnchor="middle" fontSize="8.5" fill="var(--text-muted)">{label}</text>
          ))}
        </svg>
      </div>
    </div>
  );
}

function DeviceMixCard() {
  const devices = [
    { label: "Desktop", pct: 59, count: "1,679", color: "#6366f1" },
    { label: "Mobile",  pct: 29, count: "824",   color: "#3b82f6" },
    { label: "Tablet",  pct: 9,  count: "256",   color: "#8b5cf6" },
    { label: "Unknown", pct: 3,  count: "88",    color: "#94a3b8" },
  ];

  const r = 38;
  const circ = 2 * Math.PI * r;
  const GAP = 2; // gap between segments in px along circumference

  let acc = 0;
  const segs = devices.map(d => {
    const dash = (d.pct / 100) * circ - GAP;
    const seg = { ...d, dash: Math.max(dash, 0), gap: circ - Math.max(dash, 0), offset: -acc };
    acc += (d.pct / 100) * circ;
    return seg;
  });

  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[13px] font-semibold text-[var(--text-primary)]">Device Mix</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">2,847 total sessions</p>
        </div>
        <span className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-2 py-1 text-[10px] font-semibold text-[var(--text-muted)]">
          Last 30d
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Donut */}
        <div className="relative shrink-0" style={{ width: 110, height: 110 }}>
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
            {/* Track */}
            <circle cx="50" cy="50" r={r} fill="none" stroke="var(--bg-secondary)" strokeWidth="14" />
            {/* Segments */}
            {segs.map((s, i) => (
              <circle
                key={i}
                cx="50" cy="50" r={r}
                fill="none"
                stroke={s.color}
                strokeWidth="14"
                strokeDasharray={`${s.dash.toFixed(2)} ${s.gap.toFixed(2)}`}
                strokeDashoffset={s.offset.toFixed(2)}
                strokeLinecap="butt"
              />
            ))}
          </svg>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[17px] font-extrabold leading-none text-[var(--text-primary)]">59%</p>
            <p className="text-[9px] font-medium text-[var(--text-muted)] mt-0.5">Desktop</p>
          </div>
        </div>

        {/* Legend with mini-bar per device */}
        <div className="flex-1 space-y-2.5">
          {devices.map(d => (
            <div key={d.label}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: d.color }} />
                  <span className="text-[11px] font-medium text-[var(--text-secondary)]">{d.label}</span>
                </div>
                <div className="flex items-center gap-2 text-right">
                  <span className="text-[10px] text-[var(--text-muted)]">{d.count}</span>
                  <span className="w-7 text-[11px] font-bold text-[var(--text-primary)]">{d.pct}%</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${d.pct}%`, background: d.color, opacity: 0.85 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Documentation() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLDivElement>(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPage, setSelectedPage] = useState("system-overview");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeHeading, setActiveHeading] = useState("");
  const [apiTab, setApiTab] = useState<"curl" | "fetch">("curl");

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 1800);
  };

  // ── Code snippets ────────────────────────────────────────────────────────

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
  "profile": {
    "name": "Jane Doe",
    "headline": "Senior Full Stack Engineer",
    "bio": "Building developer tooling and high-performance applications.",
    "avatar": "https://res.cloudinary.com/portos/image/upload/jane_avatar.png",
    "skills": ["TypeScript", "React", "Node.js", "Redis", "Docker", "PostgreSQL"],
    "links": {
      "github": "https://github.com/janedoe",
      "linkedin": "https://linkedin.com/in/janedoe",
      "twitter": "https://twitter.com/janedoe",
      "website": "https://janedoe.dev"
    }
  },
  "projects": [
    {
      "title": "PortOS CLI",
      "slug": "portos-cli",
      "description": "A terminal companion to bootstrap custom portfolio designs.",
      "techStack": ["TypeScript", "Vite", "React"],
      "featured": true,
      "links": {
        "demo": "https://cli.portos.dev",
        "github": "https://github.com/janedoe/portos-cli"
      }
    }
  ],
  "experience": [
    {
      "company": "Stark Tech",
      "role": "Senior Engineer",
      "startDate": "2024-01-15",
      "endDate": null,
      "isCurrent": true,
      "description": "Architecting decoupled user interfaces and high throughput cache pipelines."
    }
  ],
  "certificates": [
    {
      "title": "AWS Solutions Architect Associate",
      "issuer": "Amazon Web Services",
      "credentialId": "AWS-ASA-99812",
      "url": "https://aws.amazon.com/verification/AWS-ASA-99812"
    }
  ]
}`;

  // ── Page definitions ─────────────────────────────────────────────────────

  const pages: Record<string, DocPage> = {
    "system-overview": {
      id: "system-overview",
      title: "System Overview",
      category: "Getting Started",
      attributes: [
        { name: "Primary Concept", value: "Decoupled Portfolio CMS" },
        { name: "Workspace Access", value: "Instant via GitHub OAuth" },
        { name: "Data Sync Mode", value: "Real-time Cache Invalidation" },
      ],
      headings: [
        { id: "what-is-portos", text: "What is PortOS?" },
        { id: "decoupled-approach", text: "The Decoupled Approach" },
      ],
      content: (
        <div className="space-y-7">
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Welcome to the PortOS User Guide! PortOS (Personal Portfolio Operating System) is a developer-focused content management system designed to act as the single source of truth for your professional profile.
          </p>
          <SectionHeading id="what-is-portos">What is PortOS?</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Instead of hardcoding projects, copying and pasting markdown resume logs, or configuring individual database backends every time you update your personal web page, PortOS provides a centralized workspace dashboard. Here, you configure your bio, work history, certification credentials, and showcase projects once, and feed them securely to any frontend layout.
          </p>
          <SectionHeading id="decoupled-approach">The Decoupled Approach</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            By shifting content management to a decoupled administrator dashboard, you separate your professional data from your presentation layer. This means you can create multiple, unique portfolio themes (a terminal CLI style, a sleek minimalist design, or a full 3D interactive view) all fetching from the same updated database payload.
          </p>
          <Callout variant="info" icon={<Info size={14} />} title="Fast Page Load Guarantee">
            All portfolio data queries are delivered over an integrated caching model. By leveraging Redis in-memory storage, your public data queries load in less than 50 milliseconds globally.
          </Callout>
        </div>
      ),
    },
    "how-to-start": {
      id: "how-to-start",
      title: "How to Start",
      category: "Getting Started",
      attributes: [
        { name: "Estimated Setup", value: "Under 2 Minutes" },
        { name: "Identity Provider", value: "GitHub OAuth Secure Login" },
        { name: "Onboarding State", value: "Auto-generated Workspace" },
        { name: "Requirements", value: "Public GitHub Account" },
      ],
      headings: [
        { id: "github-onboarding", text: "1. GitHub Authorization" },
        { id: "dashboard-setup", text: "2. Setting Up Your Profile" },
        { id: "api-generation", text: "3. Generating Your First API Key" },
      ],
      content: (
        <div className="space-y-7">
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Getting your workspace set up in PortOS takes less than two minutes. Follow these simple onboarding steps to configure your dashboard:
          </p>
          <SectionHeading id="github-onboarding">1. GitHub Authorization</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Click the <strong className="text-[var(--text-primary)]">Get Started</strong> button on the home page. You will be redirected to GitHub to authorize the PortOS app. This establishes your identity and link mapping without passwords. We fetch only public details like your name, primary email, avatar image, and username.
          </p>
          <SectionHeading id="dashboard-setup">2. Setting Up Your Profile</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Once authorized, you will land on the primary Dashboard. Navigate to the <strong className="text-[var(--text-primary)]">Profile</strong> feature to edit your headline, bio, list your top technical skills, and link your professional social accounts.
          </p>
          <SectionHeading id="api-generation">3. Generating Your First API Key</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            To fetch this data on your custom web layout, navigate to the <strong className="text-[var(--text-primary)]">API Keys</strong> section in your dashboard side menu. Click <strong className="text-[var(--text-primary)]">Create New Key</strong>, give it a name (e.g., "Main Portfolio Site"), and copy the token. You will use this token to authenticate requests on your external websites.
          </p>
        </div>
      ),
    },
    "profile-socials": {
      id: "profile-socials",
      title: "Profile & Social Links",
      category: "Core Features",
      attributes: [
        { name: "Custom Fields", value: "Headline, Biography, Technical Skills" },
        { name: "Image Storage", value: "Cloudinary Cloud Hosting" },
        { name: "Link Types", value: "GitHub, LinkedIn, Twitter, Custom Web" },
        { name: "Tags Limit", value: "Up to 30 custom tech tags" },
      ],
      headings: [
        { id: "personal-details", text: "Personal Details & Headlines" },
        { id: "avatar-hosting", text: "Avatar & Image Uploads" },
        { id: "social-linking", text: "Connecting Social Links" },
        { id: "skills-tagging", text: "Configuring Technical Skills" },
      ],
      content: (
        <div className="space-y-7">
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">The profile configuration page manages the top-level parameters of your digital resume.</p>
          <SectionHeading id="personal-details">Personal Details &amp; Headlines</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">Update your full professional name, add a punchy developer headline (e.g., "Full Stack Developer specializing in Web Infrastructure"), and write a brief biography describing your focus areas and work interests.</p>
          <SectionHeading id="avatar-hosting">Avatar &amp; Image Uploads</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">By default, PortOS utilizes your GitHub profile picture. If you wish to change it, the dashboard features an integrated drag-and-drop uploader. Images are optimized and hosted securely on Cloudinary CDN, ensuring fast load times.</p>
          <SectionHeading id="social-linking">Connecting Social Links</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">Input direct profile links for GitHub, LinkedIn, Twitter, and your personal homepage. These links are packaged neatly in the public API payload under the <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 text-[12px] font-mono text-[var(--accent)]">links</code> object.</p>
          <SectionHeading id="skills-tagging">Configuring Technical Skills</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">Manage your technical skill tags dynamically. Type tech stacks like "React", "TypeScript", or "GraphQL" and press enter to tag them. These are returned as a simple array, perfect for rendering custom badges or filters on your personal website.</p>
        </div>
      ),
    },
    "project-showcase": {
      id: "project-showcase",
      title: "Project Showcase",
      category: "Core Features",
      attributes: [
        { name: "Visual Media", value: "Custom Thumbnail Uploader" },
        { name: "Featured Toggle", value: "Yes (Pin to top of lists)" },
        { name: "Asset Optimization", value: "Auto-compression to WebP" },
        { name: "Slug Generator", value: "Automatic URL-safe slugs" },
      ],
      headings: [
        { id: "creating-project", text: "Creating Showcase Cards" },
        { id: "managing-metadata", text: "Managing Hyperlinks & Tags" },
        { id: "featured-flag", text: "Featured Projects Pinning" },
      ],
      content: (
        <div className="space-y-7">
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">Showcase your open-source projects, personal software, and key client works dynamically.</p>
          <SectionHeading id="creating-project">Creating Showcase Cards</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">Add a project card by specifying a title and a description. PortOS automatically generates a URL-safe slug (e.g. <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 text-[12px] font-mono text-[var(--accent)]">portos-cli</code>). Upload a thumbnail card or mock image which gets compressed automatically to the WebP format for fast delivery.</p>
          <SectionHeading id="managing-metadata">Managing Hyperlinks &amp; Tags</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">For each project, assign a Github Repository URL and a Live Demo URL. You can also specify the exact tech stack tags (e.g., Node, Tailwind, React) utilized during development.</p>
          <SectionHeading id="featured-flag">Featured Projects Pinning</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">Toggle the <strong className="text-[var(--text-primary)]">Featured</strong> switch on your highest quality projects. This flags the project as <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 text-[12px] font-mono text-[var(--accent)]">featured: true</code> in the API response, allowing your portfolio layout to pin these highlight cards to the front page or list them in a hero grid.</p>
        </div>
      ),
    },
    "experience-history": {
      id: "experience-history",
      title: "Experience & History",
      category: "Core Features",
      attributes: [
        { name: "Entry Type", value: "Employment, Internships, Freelance" },
        { name: "Sorting order", value: "Reverse chronological" },
        { name: "Current Role", value: "Present Status Toggle" },
        { name: "Rich Text", value: "Bullets and highlights support" },
      ],
      headings: [
        { id: "work-history-setup", text: "Adding Experience Records" },
        { id: "current-employment", text: "Tracking Current Roles" },
      ],
      content: (
        <div className="space-y-7">
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">Maintain an interactive timeline of your employment history, internships, and consulting engagements.</p>
          <SectionHeading id="work-history-setup">Adding Experience Records</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">Input the company name, your professional title, start date, and end date. Describe key achievements, architectures built, and technical milestones accomplished during your stay.</p>
          <SectionHeading id="current-employment">Tracking Current Roles</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">If you are currently employed at a company, check the <strong className="text-[var(--text-primary)]">I presently work here</strong> box. This sets the end date parameter to null and tags the record as <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 text-[12px] font-mono text-[var(--accent)]">isCurrent: true</code> in the public API payload.</p>
        </div>
      ),
    },
    "certifications": {
      id: "certifications",
      title: "Certifications",
      category: "Core Features",
      attributes: [
        { name: "Categories", value: "Awards, Accreditations, Degrees" },
        { name: "Validation", value: "External Credential URL support" },
        { name: "Media Badge", value: "Issuer logo uploads" },
      ],
      headings: [
        { id: "register-certificates", text: "Logging Credentials & Licenses" },
        { id: "issuer-verification", text: "Issuer Verification Link" },
      ],
      content: (
        <div className="space-y-7">
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">Manage your credentials, professional exam licenses, bootcamp certificates, and tech hackathon awards.</p>
          <SectionHeading id="register-certificates">Logging Credentials &amp; Licenses</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">Provide the name of the certification (e.g. "Google Professional Cloud Architect") and the official issuing organization (e.g. "Google Cloud"). Specify the unique Credential ID issued to verify authenticity.</p>
          <SectionHeading id="issuer-verification">Issuer Verification Link</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">Include the direct credential lookup link provided by the issuer (like Credly or university portal). In the JSON payload, these are delivered under <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 text-[12px] font-mono text-[var(--accent)]">url</code>, allowing portfolio users to click directly to verify your credentials.</p>
        </div>
      ),
    },
    "managing-api-keys": {
      id: "managing-api-keys",
      title: "Managing API Keys",
      category: "Integrations & API",
      attributes: [
        { name: "Key Format", value: "Secure hex-encoded string" },
        { name: "Access Type", value: "Read-only GET requests" },
        { name: "Revocation", value: "Instant, real-time revocation" },
        { name: "Limits", value: "Up to 5 active client keys" },
      ],
      headings: [
        { id: "generating-keys", text: "Generating API Keys" },
        { id: "key-security", text: "Key Access & Security" },
        { id: "revoking-keys", text: "Revoking & Rotating Keys" },
      ],
      content: (
        <div className="space-y-7">
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">Connect your custom client portfolio layouts to the PortOS data infrastructure using secure access keys.</p>
          <SectionHeading id="generating-keys">Generating API Keys</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">Navigate to the <strong className="text-[var(--text-primary)]">API Keys</strong> panel in your dashboard menu. Click <strong className="text-[var(--text-primary)]">Create New Key</strong>, specify a descriptive label (like "NextJS Production", "Staging Resume"), and hit create. Copy the generated string immediately — it will not be shown again for security reasons.</p>
          <SectionHeading id="key-security">Key Access &amp; Security</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">All generated keys are strictly read-only. They permit external services to fetch your public portfolio metrics, experience, certificates, and profiles using GET requests, but prevent any write, update, or deletion operations.</p>
          <Callout variant="warning" icon={<AlertTriangle size={14} />} title="Keep Keys Secret">
            Do not bundle your API keys inside public git repositories. If you are using React or Next.js, store keys in server environments (like <code className="rounded bg-[var(--bg-secondary)] px-1 font-mono text-xs">&#46;env&#46;local</code>) or configure proxy API routing to prevent exposing the token in client browser requests.
          </Callout>
          <SectionHeading id="revoking-keys">Revoking &amp; Rotating Keys</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">If an API key is accidentally leaked or compromised, click <strong className="text-[var(--text-primary)]">Revoke</strong> next to the key entry in the dashboard. The key will be deleted instantly, and any subsequent queries using that key will return a <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 text-[12px] font-mono text-[var(--accent)]">401 Unauthorized</code> error.</p>
        </div>
      ),
    },
    "fetching-data": {
      id: "fetching-data",
      title: "Fetching Your Data",
      category: "Integrations & API",
      attributes: [
        { name: "Public Endpoint", value: "GET /api/public" },
        { name: "Authorization", value: "Header: x-api-key" },
        { name: "Cache Strategy", value: "Redis Cache Layer Enabled" },
        { name: "Format", value: "Application/JSON" },
      ],
      headings: [
        { id: "endpoint-details", text: "Endpoint Details" },
        { id: "request-headers", text: "Request Headers" },
        { id: "code-examples", text: "Code Examples" },
        { id: "response-json", text: "JSON Payload Structure" },
      ],
      content: (
        <div className="space-y-7">
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">Query your aggregated developer profile details securely using our public endpoints.</p>
          <SectionHeading id="endpoint-details">Endpoint Details</SectionHeading>
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3">
            <span className="rounded-lg bg-[var(--success-light)] px-2.5 py-1 text-xs font-bold text-[var(--success)]">GET</span>
            <code className="text-sm font-semibold text-[var(--text-primary)]">https://api.portos.dev/api/public</code>
          </div>
          <SectionHeading id="request-headers">Request Headers</SectionHeading>
          <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Header</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Type</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Description</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Required</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[var(--bg-card)]">
                  <td className="px-4 py-3 font-mono font-semibold text-[var(--accent)]">x-api-key</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">String</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">The active API Key generated in your admin dashboard.</td>
                  <td className="px-4 py-3 font-semibold text-red-500">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
          <SectionHeading id="code-examples">Code Examples</SectionHeading>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">Language</span>
              <div className="flex gap-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] p-1">
                {(["curl", "fetch"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setApiTab(tab)}
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                      apiTab === tab
                        ? "bg-[var(--accent)] text-white shadow-sm"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {tab === "curl" ? "cURL" : "JavaScript"}
                  </button>
                ))}
              </div>
            </div>
            <CodeBlock language={apiTab === "curl" ? "bash" : "javascript"} code={apiTab === "curl" ? curlCode : fetchCode} copyId="api-req" copiedText={copiedText} onCopy={handleCopy} />
          </div>
          <SectionHeading id="response-json">JSON Payload Structure</SectionHeading>
          <CodeBlock language="json" code={responseJson} copyId="api-res" copyLabel="Copy JSON" copiedText={copiedText} onCopy={handleCopy} maxHeight="max-h-[360px]" />
        </div>
      ),
    },
    "analytics-dashboard": {
      id: "analytics-dashboard",
      title: "Analytics Dashboard",
      category: "Analytics",
      attributes: [
        { name: "Dashboard Views", value: "Analytics (traffic) + Library (content counts)" },
        { name: "Time Ranges", value: "7D · 30D · 90D · 1Y" },
        { name: "Country Filter", value: "All countries or per-country drill-down" },
        { name: "Charts", value: "Area · Donut · Bar via Recharts" },
        { name: "KPI Metrics", value: "7 performance indicators" },
        { name: "API Endpoint", value: "GET /api/dashboard — Bearer auth" },
      ],
      headings: [
        { id: "analytics-overview", text: "Dashboard Overview" },
        { id: "kpi-cards", text: "KPI Metrics" },
        { id: "activity-chart", text: "Activity Over Time" },
        { id: "traffic-geography", text: "Traffic & Geography" },
        { id: "top-projects", text: "Top Projects & Devices" },
        { id: "activity-feed", text: "Recent Activity Feed" },
      ],
      content: (
        <div className="space-y-7">
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            The Analytics Dashboard gives you complete visibility into your portfolio's performance. Toggle between <strong className="text-[var(--text-primary)]">Analytics</strong> (visitor traffic, clicks, downloads) and <strong className="text-[var(--text-primary)]">Library</strong> (content you've added). Use the <strong className="text-[var(--text-primary)]">7D / 30D / 90D / 1Y</strong> buttons and the country dropdown at the top to slice all charts and KPI cards simultaneously.
          </p>

          {/* ── KPI Cards ── */}
          <SectionHeading id="kpi-cards">KPI Metrics</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Seven cards summarise your portfolio activity for the selected period. Each card updates instantly when you change the time range or country filter.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { Icon: Eye,              color: "text-indigo-500", bg: "rgba(99,102,241,0.12)",  label: "Visits",              value: "2,847" },
              { Icon: Users,            color: "text-blue-500",   bg: "rgba(59,130,246,0.12)",  label: "Unique Visitors",     value: "1,203" },
              { Icon: GitBranch,        color: "text-slate-500",  bg: "rgba(100,116,139,0.12)", label: "GitHub Clicks",       value: "384"   },
              { Icon: Download,         color: "text-emerald-500",bg: "rgba(16,185,129,0.12)",  label: "Resume Downloads",    value: "127"   },
              { Icon: MousePointerClick,color: "text-violet-500", bg: "rgba(139,92,246,0.12)",  label: "Project Clicks",      value: "698"   },
              { Icon: Mail,             color: "text-teal-500",   bg: "rgba(20,184,166,0.12)",  label: "Contacts",            value: "24"    },
              { Icon: ArrowUpRight,     color: "text-amber-500",  bg: "rgba(245,158,11,0.12)",  label: "Live Demo Clicks",    value: "312"   },
            ].map(({ Icon, color, bg, label, value }) => (
              <div key={label} className="flex flex-col gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`} style={{ background: bg }}>
                  <Icon size={14} />
                </span>
                <div>
                  <p className="text-[22px] font-bold leading-none text-[var(--text-primary)]">{value}</p>
                  <p className="mt-1 text-[11px] font-medium text-[var(--text-muted)]">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Activity chart ── */}
          <SectionHeading id="activity-chart">Activity Over Time</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            A multi-line area chart plots Visits, Unique Visitors, and Project Clicks across the selected period. Hover any column to see the exact values for that day.
          </p>
          <ActivityChart />

          {/* ── Traffic & Geography ── */}
          <SectionHeading id="traffic-geography">Traffic &amp; Geography</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Two bar charts sit side by side: <strong className="text-[var(--text-primary)]">Country Breakdown</strong> ranks where your visitors come from geographically, and <strong className="text-[var(--text-primary)]">Traffic Sources</strong> shows which referrer channels drive the most traffic. Selecting a country in the dropdown filters both charts.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Country breakdown */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <Globe size={12} className="text-[var(--text-muted)]" />
                <p className="text-[12px] font-semibold text-[var(--text-primary)]">Country Breakdown</p>
              </div>
              <div className="space-y-2">
                {[
                  { label: "United States", count: 1140, pct: 100, color: "#6366f1" },
                  { label: "India",          count: 748,  pct: 66,  color: "#818cf8" },
                  { label: "United Kingdom", count: 501,  pct: 44,  color: "#a5b4fc" },
                  { label: "Germany",        count: 321,  pct: 28,  color: "#c7d2fe" },
                  { label: "Canada",         count: 267,  pct: 23,  color: "#e0e7ff" },
                ].map(({ label, count, pct, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-[10px] w-24 truncate text-[var(--text-muted)]">{label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <span className="text-[10px] font-semibold text-[var(--text-primary)] w-9 text-right">{count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Traffic sources */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <TrendingUp size={12} className="text-[var(--text-muted)]" />
                <p className="text-[12px] font-semibold text-[var(--text-primary)]">Traffic Sources</p>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Direct",        count: 998, pct: 100, color: "#6366f1" },
                  { label: "linkedin.com",  count: 697, pct: 70,  color: "#3b82f6" },
                  { label: "github.com",    count: 428, pct: 43,  color: "#10b981" },
                  { label: "google.com",    count: 314, pct: 31,  color: "#f59e0b" },
                  { label: "twitter.com",   count: 150, pct: 15,  color: "#8b5cf6" },
                ].map(({ label, count, pct, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-[10px] w-24 truncate text-[var(--text-muted)]">{label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <span className="text-[10px] font-semibold text-[var(--text-primary)] w-9 text-right">{count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Top Projects & Devices ── */}
          <SectionHeading id="top-projects">Top Projects &amp; Devices</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            <strong className="text-[var(--text-primary)]">Top Projects</strong> ranks your portfolio projects by combined click count (demo + repo). <strong className="text-[var(--text-primary)]">Device Mix</strong> shows the device type split inferred from User-Agent headers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Top projects */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
              <p className="text-[12px] font-semibold text-[var(--text-primary)] mb-3">Top Projects</p>
              <div className="space-y-3">
                {[
                  { title: "PortOS CLI",         slug: "portos-cli",         clicks: 204 },
                  { title: "API Gateway Proxy",   slug: "api-gateway-proxy",  clicks: 148 },
                  { title: "React Component Kit", slug: "react-component-kit",clicks: 93  },
                  { title: "Redis Cache Layer",   slug: "redis-cache-layer",  clicks: 54  },
                ].map(({ title, slug, clicks }) => (
                  <div key={slug}>
                    <div className="flex justify-between mb-1">
                      <div>
                        <p className="text-[11px] font-semibold text-[var(--text-primary)]">{title}</p>
                        <p className="text-[9px] text-[var(--text-muted)]">{slug}</p>
                      </div>
                      <span className="text-[11px] font-bold text-[var(--text-primary)]">{clicks}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(clicks / 204) * 100}%`, background: "linear-gradient(to right, var(--grad-start), var(--grad-end))" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Device mix */}
            <DeviceMixCard />
          </div>

          {/* ── Activity Feed ── */}
          <SectionHeading id="activity-feed">Recent Activity Feed</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            A live event log at the bottom of the dashboard shows each individual interaction with your portfolio — the event type, visitor country, referrer source, path visited, and timestamp. The feed respects the country filter.
          </p>
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
            <p className="text-[12px] font-semibold text-[var(--text-primary)] mb-3">Recent Activity</p>
            <div className="space-y-2">
              {[
                { Icon: Eye,              color: "text-indigo-500", bg: "rgba(99,102,241,0.1)",  event: "Portfolio Visit",     country: "United States", source: "linkedin.com", path: "/",                    time: "2m ago"  },
                { Icon: GitBranch,        color: "text-slate-500",  bg: "rgba(100,116,139,0.1)", event: "GitHub Click",        country: "India",         source: "Direct",       path: "/projects",            time: "14m ago" },
                { Icon: Download,         color: "text-emerald-500",bg: "rgba(16,185,129,0.1)",  event: "Resume Download",     country: "Germany",       source: "google.com",   path: "/",                    time: "1h ago"  },
                { Icon: ArrowUpRight,     color: "text-amber-500",  bg: "rgba(245,158,11,0.1)",  event: "Live Demo Click",     country: "UK",            source: "twitter.com",  path: "/projects/portos-cli", time: "3h ago"  },
                { Icon: Mail,             color: "text-teal-500",   bg: "rgba(20,184,166,0.1)",  event: "Contact Submission",  country: "Canada",        source: "Direct",       path: "/contact",             time: "5h ago"  },
              ].map(({ Icon, color, bg, event, country, source, path, time }) => (
                <div key={time} className="flex items-center gap-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${color}`} style={{ background: bg }}>
                    <Icon size={12} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-[var(--text-primary)]">{event}</p>
                    <p className="text-[10px] text-[var(--text-muted)] truncate">
                      <Globe size={8} className="inline mr-0.5" />{country} · {source} · <span className="font-mono">{path}</span>
                    </p>
                  </div>
                  <span className="text-[10px] shrink-0 text-[var(--text-muted)]">{time}</span>
                </div>
              ))}
            </div>
          </div>
          <Callout variant="info" icon={<Info size={13} />} title="Library view">
            Toggle to <strong>Library</strong> at the top of the dashboard to replace the KPI cards with content counts — total projects, experience entries, certifications, and API keys you've added. These counts are not affected by time or country filters.
          </Callout>
        </div>
      ),
    },
  };

  const activePageData = pages[selectedPage] ?? pages["system-overview"];

  // ── Nav structure ────────────────────────────────────────────────────────

  const navGroups = [
    {
      category: "Getting Started",
      Icon: BookOpen,
      color: "text-teal-500",
      bg: "rgba(20,184,166,0.12)",
      items: [
        { id: "system-overview", label: "System Overview" },
        { id: "how-to-start", label: "How to Start" },
      ],
    },
    {
      category: "Core Features",
      Icon: User,
      color: "text-indigo-500",
      bg: "rgba(99,102,241,0.12)",
      items: [
        { id: "profile-socials", label: "Profile & Social Links" },
        { id: "project-showcase", label: "Project Showcase" },
        { id: "experience-history", label: "Experience & History" },
        { id: "certifications", label: "Certifications" },
      ],
    },
    {
      category: "Integrations & API",
      Icon: Key,
      color: "text-violet-500",
      bg: "rgba(139,92,246,0.12)",
      items: [
        { id: "managing-api-keys", label: "Managing API Keys" },
        { id: "fetching-data", label: "Fetching Your Data" },
      ],
    },
    {
      category: "Analytics",
      Icon: BarChart2,
      color: "text-emerald-500",
      bg: "rgba(16,185,129,0.12)",
      items: [{ id: "analytics-dashboard", label: "Analytics Dashboard" }],
    },
  ];

  // ── Effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setSearchOpen((p) => !p); }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Scroll-based heading spy
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    setActiveHeading("");
    const onScroll = () => {
      const containerTop = el.getBoundingClientRect().top;
      let current = "";
      for (const h of activePageData.headings) {
        const heading = document.getElementById(h.id);
        if (!heading) continue;
        if (heading.getBoundingClientRect().top - containerTop <= 100) current = h.id;
      }
      setActiveHeading(current);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [selectedPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handlePageSelect = (id: string) => {
    setSelectedPage(id);
    setActiveHeading("");
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const scrollToHeading = (id: string) => {
    const el = mainRef.current;
    const heading = document.getElementById(id);
    if (!el || !heading) return;
    const top = heading.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop;
    el.scrollTo({ top: top - 64, behavior: "smooth" });
    setActiveHeading(id);
  };

  const allLinks = [
    { id: "system-overview", title: "System Overview", category: "Getting Started" },
    { id: "how-to-start", title: "How to Start", category: "Getting Started" },
    { id: "profile-socials", title: "Profile & Social Links", category: "Core Features" },
    { id: "project-showcase", title: "Project Showcase", category: "Core Features" },
    { id: "experience-history", title: "Experience & History", category: "Core Features" },
    { id: "certifications", title: "Certifications", category: "Core Features" },
    { id: "managing-api-keys", title: "Managing API Keys", category: "Integrations & API" },
    { id: "fetching-data", title: "Fetching Your Data", category: "Integrations & API" },
    { id: "analytics-dashboard", title: "Analytics & Tracking", category: "Analytics" },
  ];

  const filtered = allLinks.filter(
    (l) =>
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Shared sidebar nav markup (used by both mobile & desktop) ─────────────

  const navContent = (
    <div className="flex flex-col h-full">
      {/* Sidebar brand */}
      <div className="flex items-center gap-3 border-b border-[var(--border-color)] px-5 py-4 shrink-0">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black text-white"
          style={{
            background: "linear-gradient(135deg, var(--grad-start), var(--grad-end))",
            boxShadow: "0 4px 12px var(--accent-glow)",
          }}
        >
          P
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-tight text-[var(--text-primary)]">PortOS</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">Documentation</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-5">
        {navGroups.map((group) => {
          const GIcon = group.Icon;
          return (
            <div key={group.category}>
              {/* Group label */}
              <div className="mb-1.5 flex items-center gap-2 px-2">
                <span
                  className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded ${group.color}`}
                  style={{ background: group.bg }}
                >
                  <GIcon size={10} />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                  {group.category}
                </span>
              </div>

              {/* Group items */}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = selectedPage === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handlePageSelect(item.id)}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-all duration-150 ${
                          isActive
                            ? "bg-[var(--accent-light)] text-[var(--accent)]"
                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        <FileText size={13} className={`shrink-0 ${isActive ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`} />
                        <span className="truncate">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Ambient background */}
      <style>{`
        .doc-root {
          height: 100dvh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: var(--bg-main);
          color: var(--text-primary);
        }
        .doc-sidebar-desktop {
          transition: width 280ms cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          flex-shrink: 0;
        }
        .doc-sidebar-inner {
          width: 260px;
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
        }
      `}</style>

      <div className="doc-root">
        {/* Background mesh */}
        <div className="fixed inset-0 gradient-mesh pointer-events-none" style={{ zIndex: 0 }} />
        <div className="glow-orb glow-orb-1 pointer-events-none" style={{ position: "fixed", zIndex: 0 }} />
        <div className="glow-orb glow-orb-2 pointer-events-none" style={{ position: "fixed", zIndex: 0 }} />

        {/* ── Mobile overlay ──────────────────────────────────────────────── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Mobile sidebar drawer ───────────────────────────────────────── */}
        <aside
          className={`
            md:hidden fixed top-0 bottom-0 left-0 z-40 flex flex-col
            bg-[var(--bg-sidebar)] border-r border-[var(--border-color)]
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          style={{ width: "260px" }}
        >
          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={15} />
          </button>
          <div className="overflow-y-auto flex-1">{navContent}</div>
        </aside>

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <header
          className="relative z-40 shrink-0 flex h-14 items-center border-b border-[var(--border-color)] px-4"
          style={{ background: "var(--bg-navbar)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
        >
          {/* LEFT: toggle + logo + back */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Sidebar toggle */}
            <button
              onClick={() => setSidebarOpen((p) => !p)}
              aria-label="Toggle sidebar"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)]"
            >
              <Menu size={15} />
            </button>

            {/* PortOS logo + name */}
            <div className="flex items-center gap-2">
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-black text-white"
                style={{
                  background: "linear-gradient(135deg, var(--grad-start), var(--grad-end))",
                  boxShadow: "0 3px 10px var(--accent-glow)",
                }}
              >
                P
              </div>
              <div className="leading-tight hidden sm:block">
                <p className="text-[13px] font-semibold text-[var(--text-primary)]">PortOS</p>
                <p className="text-[9px] font-medium uppercase tracking-wider text-[var(--text-muted)]">Docs</p>
              </div>
            </div>

            <div className="h-4 w-px bg-[var(--border-color)] hidden sm:block" />

            {/* Back to home */}
            <button
              onClick={() => navigate("/")}
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              <ArrowLeft size={12} />
              Back to Home
            </button>
          </div>

          {/* CENTER: search — absolutely centered in the header */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-8 items-center gap-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] px-3 text-[var(--text-muted)] transition-all hover:border-[var(--accent)] hover:bg-[var(--bg-secondary)] w-48 sm:w-60 lg:w-72"
            >
              <Search size={12} className="shrink-0" />
              <span className="flex-1 text-left text-xs">Search documentation...</span>
              <kbd className="hidden sm:flex items-center rounded border border-[var(--border-color)] bg-[var(--bg-secondary)] px-1.5 py-0.5 font-mono text-[9px] font-medium text-[var(--text-muted)]">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* RIGHT: theme toggle */}
          <div className="ml-auto shrink-0">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-light)]"
            >
              <Sun size={14} className={`absolute transition-all duration-500 ${theme === "dark" ? "scale-0 opacity-0" : "scale-100 opacity-100 text-amber-500"}`} />
              <Moon size={14} className={`absolute transition-all duration-500 ${theme === "dark" ? "scale-100 opacity-100 text-indigo-400" : "scale-0 opacity-0"}`} />
            </button>
          </div>
        </header>

        {/* ── BODY (sidebar + content + toc) ─────────────────────────────── */}
        <div className="relative z-10 flex flex-1 overflow-hidden">

          {/* Desktop sidebar — width-animated collapse */}
          <aside
            className="doc-sidebar-desktop hidden md:block bg-[var(--bg-sidebar)]"
            style={{
              width: sidebarOpen ? "260px" : "0px",
              borderRight: sidebarOpen ? "1px solid var(--border-color)" : "none",
            }}
          >
            <div className="doc-sidebar-inner overflow-y-auto">
              {navContent}
            </div>
          </aside>

          {/* ── Main content ──────────────────────────────────────────────── */}
          <main ref={mainRef} className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl px-6 lg:px-12 py-10 pb-28">

              {/* Page header */}
              <div key={`ph-${selectedPage}`} className="mb-8 animate-fade-in-up">
                {/* Breadcrumb */}
                <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)]">
                  <span>Docs</span>
                  <span>/</span>
                  <span className="text-[var(--text-secondary)]">{activePageData.category}</span>
                </p>

                {/* Title */}
                <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-[28px]">
                  {activePageData.title}
                </h1>

                {/* Attributes table */}
                {activePageData.attributes && (
                  <div className="mt-6 overflow-hidden rounded-xl border border-[var(--border-color)]">
                    <div className="grid grid-cols-2 gap-x-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Property</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Value</span>
                    </div>
                    {activePageData.attributes.map((a, i) => (
                      <div
                        key={a.name}
                        className={`grid grid-cols-2 gap-x-4 px-4 py-2.5 transition-colors hover:bg-[var(--bg-secondary)] ${i > 0 ? "border-t border-[var(--border-color)]" : ""} bg-[var(--bg-card)]`}
                      >
                        <span className="text-xs font-medium text-[var(--text-muted)]">{a.name}</span>
                        <span className="text-xs font-semibold text-[var(--text-primary)]">{a.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="mb-8 border-t border-[var(--border-color)]" />

              {/* Page content */}
              <div key={`pc-${selectedPage}`} className="animate-fade-in-up">
                {activePageData.content}
              </div>
            </div>
          </main>

          {/* ── Right TOC ─────────────────────────────────────────────────── */}
          <aside className="hidden xl:flex flex-col w-56 shrink-0 border-l border-[var(--border-color)] bg-[var(--bg-sidebar)] overflow-y-auto">
            <div className="sticky top-0 px-5 pt-8">
              <div className="flex items-center gap-2 mb-4">
                <Hash size={11} className="text-[var(--text-muted)] shrink-0" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">On This Page</p>
              </div>

              <nav className="space-y-0.5">
                {activePageData.headings.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => scrollToHeading(h.id)}
                    className={`w-full text-left border-l-2 py-1.5 pl-3 pr-2 text-[12px] leading-snug transition-all duration-150 rounded-r-lg ${
                      activeHeading === h.id
                        ? "border-[var(--accent)] bg-[var(--accent-light)] font-medium text-[var(--accent)]"
                        : "border-transparent text-[var(--text-muted)] hover:border-[var(--border-color)] hover:text-[var(--text-secondary)]"
                    } ${h.sub ? "pl-5" : ""}`}
                  >
                    {h.text}
                  </button>
                ))}

                {activePageData.headings.length === 0 && (
                  <p className="text-[11px] italic text-[var(--text-muted)]">No sections</p>
                )}
              </nav>

              <div className="mt-8 border-t border-[var(--border-color)] pt-5">
                <p className="text-[10px] text-[var(--text-muted)]">PortOS Documentation</p>
                <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">v1.0 · User Guide</p>
              </div>
            </div>
          </aside>
        </div>

        {/* ── Search modal ────────────────────────────────────────────────── */}
        {searchOpen && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-16 animate-fade-in-up"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
            onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
          >
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl">
              {/* Input row */}
              <div className="flex items-center gap-3 border-b border-[var(--border-color)] px-4 py-3.5">
                <Search size={16} className="shrink-0 text-[var(--text-muted)]" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm font-medium text-[var(--text-primary)] outline-none placeholder:font-normal placeholder:text-[var(--text-muted)]"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="rounded-md border border-[var(--border-color)] bg-[var(--bg-secondary)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  ESC
                </button>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto">
                {filtered.length > 0 ? (
                  <ul className="p-2 space-y-0.5">
                    {filtered.map((link) => (
                      <li key={link.id}>
                        <button
                          onClick={() => { handlePageSelect(link.id); setSearchOpen(false); setSearchQuery(""); }}
                          className="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--accent-light)]"
                        >
                          <div className="text-left">
                            <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                              {link.title}
                            </p>
                            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                              {link.category}
                            </p>
                          </div>
                          <ArrowUpRight size={13} className="shrink-0 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-8 text-center text-sm text-[var(--text-muted)]">No pages found for &ldquo;{searchQuery}&rdquo;</p>
                )}
              </div>

              {/* Footer hint */}
              <div className="flex items-center gap-4 border-t border-[var(--border-color)] px-4 py-2.5">
                <span className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
                  <kbd className="rounded border border-[var(--border-color)] bg-[var(--bg-secondary)] px-1.5 py-0.5 font-mono text-[9px]">↵</kbd>
                  to select
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
                  <kbd className="rounded border border-[var(--border-color)] bg-[var(--bg-secondary)] px-1.5 py-0.5 font-mono text-[9px]">esc</kbd>
                  to close
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
