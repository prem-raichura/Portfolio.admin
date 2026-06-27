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

// ─── Main component ───────────────────────────────────────────────────────────

export default function Documentation() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLDivElement>(null);

  const [selectedPage, setSelectedPage] = useState("system-overview");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeHeading, setActiveHeading] = useState("");
  const [apiTab, setApiTab] = useState<"curl" | "fetch">("curl");
  const [analyticsTab, setAnalyticsTab] = useState<"curl" | "fetch">("curl");

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

  const analyticsTrackCurl = `curl -X POST "https://api.portos.dev/api/analytics/github-click" \\
  -H "x-api-key: your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "path": "/projects",
    "source": "direct",
    "project_id": 42,
    "project_slug": "my-project"
  }'`;

  const analyticsTrackFetch = `const trackEvent = async (endpoint, data = {}) => {
  await fetch(\`https://api.portos.dev/api/analytics/\${endpoint}\`, {
    method: "POST",
    headers: {
      "x-api-key": "your_api_key_here",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      path: window.location.pathname,
      source: document.referrer ? "referral" : "direct",
      ...data,
    }),
  });
};

// Track GitHub link click
document.getElementById("github-btn").addEventListener("click", () => {
  trackEvent("github-click", { project_slug: "my-project" });
});

// Track live demo click
document.getElementById("demo-btn").addEventListener("click", () => {
  trackEvent("live-demo-click", { project_id: 42, project_slug: "my-project" });
});

// Track resume download
document.getElementById("resume-btn").addEventListener("click", () => {
  trackEvent("resume-download");
});

// Track project card click
document.getElementById("project-card").addEventListener("click", () => {
  trackEvent("project-click", { project_id: 42, project_slug: "my-project" });
});

// Track contact form submission
document.getElementById("contact-form").addEventListener("submit", () => {
  trackEvent("contact-submission");
});`;

  const analyticsDashboardResponse = `{
  "success": true,
  "filter": "30d",
  "selectedCountry": "ALL",
  "dashboard": {
    "total_visit": 2847,
    "unique_visitor": 1203,
    "github_clicks": 384,
    "live_demo_clicks": 312,
    "resume_download": 127,
    "project_clicks": 698,
    "contact_submissions": 24,
    "updated_at": "2026-06-25T14:32:18.000Z"
  },
  "addedCounts": {
    "totalProjectsAdded": 12,
    "experienceAdded": 5,
    "achievementsAdded": 8,
    "certificationsAdded": 6,
    "apiKeysAdded": 2
  },
  "totalEvents": 4391,
  "graphData": [
    {
      "date": "2026-05-26",
      "visits": 89,
      "uniqueVisitors": 45,
      "githubClicks": 12,
      "liveDemoClicks": 9,
      "resumeDownloads": 3,
      "projectClicks": 24,
      "contactSubmissions": 1
    }
  ],
  "countryBreakdown": [
    { "country": "US", "visits": 1140 },
    { "country": "IN", "visits": 748 },
    { "country": "GB", "visits": 501 }
  ],
  "deviceBreakdown": [
    { "device": "desktop", "value": 1804 },
    { "device": "mobile",  "value": 923  },
    { "device": "tablet",  "value": 120  },
    { "device": "unknown", "value": 0    }
  ],
  "sourceBreakdown": [
    { "source": "direct",       "visits": 998 },
    { "source": "linkedin.com", "visits": 697 },
    { "source": "github.com",   "visits": 428 }
  ],
  "topProjects": [
    {
      "project_id": 1,
      "project_slug": "portos-cli",
      "title": "PortOS CLI",
      "clicks": 204
    }
  ],
  "recentActivity": [
    {
      "id": 4391,
      "type": "contact_submission",
      "created_at": "2026-06-25T14:28:45.123Z",
      "country": "CA",
      "device_type": "mobile",
      "source": "direct",
      "path": "/contact",
      "referrer": null,
      "project_slug": null,
      "project_id": null
    }
  ],
  "availableCountries": ["US", "IN", "GB", "DE", "CA"]
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
        { name: "Tracking Endpoints", value: "POST /api/analytics/*" },
        { name: "Dashboard Endpoint", value: "GET /api/dashboard" },
        { name: "Tracking Auth",      value: "Header: x-api-key" },
        { name: "Dashboard Auth",     value: "Bearer JWT (admin only)" },
        { name: "Event Types",        value: "6 (5 manual + 1 automatic)" },
        { name: "Time Ranges",        value: "7D · 30D · 90D · 1Y" },
      ],
      headings: [
        { id: "analytics-how-it-works",  text: "How Tracking Works" },
        { id: "analytics-events",        text: "Event Endpoints" },
        { id: "analytics-request-body",  text: "Tracking Request Body" },
        { id: "analytics-code-examples", text: "Code Examples" },
        { id: "analytics-responses",     text: "Tracking Responses" },
        { id: "analytics-dashboard-api", text: "Dashboard API" },
        { id: "analytics-query-params",  text: "Query Parameters" },
        { id: "analytics-response-json", text: "Response Structure" },
        { id: "analytics-ui",            text: "Dashboard UI Overview" },
      ],
      content: (
        <div className="space-y-7">
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            PortOS ships a built-in analytics engine that tracks every meaningful interaction visitors have with your external portfolio site — visits, project clicks, GitHub link taps, resume downloads, live demo opens, and contact form submissions. All data feeds directly into your admin Analytics Dashboard with time-range filters, country drill-downs, and device breakdowns.
          </p>

          {/* ── How Tracking Works ── */}
          <SectionHeading id="analytics-how-it-works">How Tracking Works</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            The system tracks two categories of events — one automatic and five that you fire manually from your external portfolio site:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-black text-white" style={{ background: "var(--accent)" }}>A</span>
                <p className="text-[12px] font-semibold text-[var(--text-primary)]">Automatic — Portfolio Visit</p>
              </div>
              <p className="text-[12px] leading-relaxed text-[var(--text-secondary)]">
                Every time your external site calls <code className="rounded bg-[var(--bg-secondary)] px-1 font-mono text-[var(--accent)]">GET /api/public</code>, the server automatically queues a <code className="rounded bg-[var(--bg-secondary)] px-1 font-mono text-[var(--accent)]">portfolio_visit</code> event. No extra code needed on your site.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-black text-white" style={{ background: "var(--success)" }}>M</span>
                <p className="text-[12px] font-semibold text-[var(--text-primary)]">Manual — Interaction Events</p>
              </div>
              <p className="text-[12px] leading-relaxed text-[var(--text-secondary)]">
                For clicks and form submissions, your portfolio site fires a <code className="rounded bg-[var(--bg-secondary)] px-1 font-mono text-[var(--accent)]">POST</code> request to the relevant tracking endpoint using your API key. All fields in the request body are optional.
              </p>
            </div>
          </div>
          <Callout variant="info" icon={<Info size={14} />} title="Background processing">
            All tracking events are processed asynchronously via a BullMQ job queue. Your portfolio visitors experience zero latency — the tracking write happens in a background worker after the HTTP response is already returned.
          </Callout>

          {/* ── Event Endpoints ── */}
          <SectionHeading id="analytics-events">Event Endpoints</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Five POST endpoints correspond to the five interaction types you can track. All use the same <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 text-[12px] font-mono text-[var(--accent)]">x-api-key</code> authentication header.
          </p>
          <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Method</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Endpoint</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Event Tracked</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { method: "POST", path: "/api/analytics/github-click",       event: "GitHub repository link click" },
                  { method: "POST", path: "/api/analytics/live-demo-click",    event: "Live demo / preview link click" },
                  { method: "POST", path: "/api/analytics/resume-download",    event: "Resume file download" },
                  { method: "POST", path: "/api/analytics/project-click",      event: "Project card click" },
                  { method: "POST", path: "/api/analytics/contact-submission", event: "Contact form submission" },
                ].map(({ method, path, event }, i) => (
                  <tr key={path} className={`bg-[var(--bg-card)] ${i > 0 ? "border-t border-[var(--border-color)]" : ""}`}>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-[var(--accent-light)] px-2 py-0.5 text-[10px] font-bold text-[var(--accent)]">{method}</span>
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-[var(--accent)]">{path}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{event}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Request Body ── */}
          <SectionHeading id="analytics-request-body">Tracking Request Body</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            All fields are optional. Include as much context as you have — the more data you send, the richer your dashboard becomes.
          </p>
          <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Field</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Type</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { field: "path",         type: "string", desc: 'Current page URL path (e.g. "/projects")' },
                  { field: "source",       type: "string", desc: '"direct" or the referrer domain (e.g. "linkedin.com")' },
                  { field: "project_id",   type: "number", desc: "Database ID of the project — for project/demo/github events" },
                  { field: "project_slug", type: "string", desc: "URL-safe slug of the project (e.g. \"portos-cli\")" },
                  { field: "session_id",   type: "string", desc: "UUID for grouping multiple events from one visitor session" },
                  { field: "metadata",     type: "object", desc: "Any additional JSON data you want to attach to the event" },
                ].map(({ field, type, desc }, i) => (
                  <tr key={field} className={`bg-[var(--bg-card)] ${i > 0 ? "border-t border-[var(--border-color)]" : ""}`}>
                    <td className="px-4 py-3 font-mono font-semibold text-[var(--accent)]">{field}</td>
                    <td className="px-4 py-3 text-[var(--text-muted)]">{type}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Code Examples ── */}
          <SectionHeading id="analytics-code-examples">Code Examples</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            The following examples demonstrate firing a tracking event from your external portfolio site. Adapt the <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 text-[12px] font-mono text-[var(--accent)]">endpoint</code> and body fields for each event type.
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">Language</span>
              <div className="flex gap-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] p-1">
                {(["curl", "fetch"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setAnalyticsTab(tab)}
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                      analyticsTab === tab
                        ? "bg-[var(--accent)] text-white shadow-sm"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {tab === "curl" ? "cURL" : "JavaScript"}
                  </button>
                ))}
              </div>
            </div>
            <CodeBlock
              language={analyticsTab === "curl" ? "bash" : "javascript"}
              code={analyticsTab === "curl" ? analyticsTrackCurl : analyticsTrackFetch}
              copyId="analytics-track"
              copiedText={copiedText}
              onCopy={handleCopy}
              maxHeight={analyticsTab === "fetch" ? "max-h-[340px]" : undefined}
            />
          </div>

          {/* ── Tracking Responses ── */}
          <SectionHeading id="analytics-responses">Tracking Responses</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            All five tracking endpoints return the same lightweight JSON envelope on success. The message text varies per endpoint.
          </p>
          <div className="overflow-hidden rounded-xl border border-[var(--border-color)]">
            <div className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2.5 flex items-center justify-between">
              <span className="rounded-md bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-500">200 OK</span>
              <span className="text-[10px] text-[var(--text-muted)]">application/json</span>
            </div>
            <div className="space-y-0">
              {[
                { endpoint: "github-click",       message: "Github click tracked" },
                { endpoint: "live-demo-click",     message: "Live demo click tracked" },
                { endpoint: "resume-download",     message: "Resume download tracked" },
                { endpoint: "project-click",       message: "Project click tracked" },
                { endpoint: "contact-submission",  message: "Contact submission tracked" },
              ].map(({ endpoint, message }, i) => (
                <div key={endpoint} className={`grid grid-cols-[1fr_auto] gap-4 px-4 py-2.5 bg-[var(--bg-card)] ${i > 0 ? "border-t border-[var(--border-color)]" : ""}`}>
                  <code className="text-[11px] font-mono text-[var(--text-muted)]">
                    {`{ "success": true, "message": "`}<span className="text-[var(--success)]">{message}</span>{`" }`}
                  </code>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] shrink-0 self-center">/analytics/{endpoint}</span>
                </div>
              ))}
            </div>
          </div>
          <Callout variant="warning" icon={<AlertTriangle size={14} />} title="Error responses">
            A missing or invalid <code className="rounded bg-[var(--bg-secondary)] px-1 font-mono text-xs">x-api-key</code> returns <strong>401 Unauthorized</strong>. An expired key returns <strong>401 API key expired and has been deactivated</strong> and the key is permanently disabled. Rotate your keys from the API Keys section in your dashboard.
          </Callout>

          {/* ── Dashboard API ── */}
          <SectionHeading id="analytics-dashboard-api">Dashboard API</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            The dashboard endpoint returns your full aggregated analytics data. It is called by the PortOS admin UI — you do not need to call it from your portfolio site. It requires your session Bearer token, not an API key.
          </p>
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3">
            <span className="rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-400">GET</span>
            <code className="text-sm font-semibold text-[var(--text-primary)]">https://api.portos.dev/api/dashboard</code>
          </div>
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
                  <td className="px-4 py-3 font-mono font-semibold text-[var(--accent)]">Authorization</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">String</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">Bearer token from your admin session JWT</td>
                  <td className="px-4 py-3 font-semibold text-red-500">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── Query Params ── */}
          <SectionHeading id="analytics-query-params">Query Parameters</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Both parameters are optional and default to the values below. Combine them to slice your data by time and geography simultaneously.
          </p>
          <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Parameter</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Values</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Default</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { param: "filter",  values: "7d · 30d · 90d · 1y", def: "7d",  desc: "Rolling date range applied to all metrics and chart data" },
                  { param: "country", values: "ISO code or ALL",     def: "ALL", desc: "Filter all results to a single country (e.g. US, IN, GB)" },
                ].map(({ param, values, def, desc }, i) => (
                  <tr key={param} className={`bg-[var(--bg-card)] ${i > 0 ? "border-t border-[var(--border-color)]" : ""}`}>
                    <td className="px-4 py-3 font-mono font-semibold text-[var(--accent)]">{param}</td>
                    <td className="px-4 py-3 font-mono text-[var(--text-secondary)]">{values}</td>
                    <td className="px-4 py-3 font-mono text-[var(--text-muted)]">{def}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 space-y-1.5">
            {[
              "GET /api/dashboard?filter=7d&country=ALL",
              "GET /api/dashboard?filter=30d&country=IN",
              "GET /api/dashboard?filter=1y&country=US",
            ].map((ex) => (
              <code key={ex} className="block text-[12px] font-mono text-[var(--text-secondary)]">{ex}</code>
            ))}
          </div>

          {/* ── Response Structure ── */}
          <SectionHeading id="analytics-response-json">Response Structure</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            The response contains the KPI summary, daily graph data, country and device breakdowns, top projects by clicks, and the most recent activity feed — all scoped to the requested filter and country.
          </p>
          <CodeBlock
            language="json"
            code={analyticsDashboardResponse}
            copyId="analytics-dash-res"
            copyLabel="Copy JSON"
            copiedText={copiedText}
            onCopy={handleCopy}
            maxHeight="max-h-[400px]"
          />

          {/* ── Dashboard UI Overview ── */}
          <SectionHeading id="analytics-ui">Dashboard UI Overview</SectionHeading>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            The Analytics section of your PortOS admin panel visualises all of the above data. It has two views toggled at the top:
          </p>
          <div className="space-y-3">
            {[
              {
                label: "Analytics View",
                accent: "var(--accent)",
                items: [
                  "7 KPI cards — Visits, Unique Visitors, GitHub Clicks, Resume Downloads, Project Clicks, Contact Submissions, Live Demo Clicks",
                  "Activity Over Time — area chart of visits, unique visitors, and project clicks per day",
                  "Country Breakdown — horizontal bar chart of top countries by visit count",
                  "Traffic Sources — referrer domains ranked by visits (Direct, LinkedIn, GitHub, Google, …)",
                  "Top Projects — top 5 projects ranked by total click count with progress bars",
                  "Device Mix — donut chart split by Desktop, Mobile, Tablet, Unknown",
                  "Recent Activity Feed — last 10 events with type, country, source, path, and timestamp",
                ],
              },
              {
                label: "Library View",
                accent: "var(--success)",
                items: [
                  "Total Projects added (including research entries)",
                  "Experience records added",
                  "Achievements and Certifications added",
                  "Active API Keys count",
                  "These counts are not affected by time range or country filters",
                ],
              },
            ].map(({ label, accent, items }) => (
              <div key={label} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: accent }} />
                  <p className="text-[13px] font-semibold text-[var(--text-primary)]">{label}</p>
                </div>
                <ul className="space-y-1.5">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[12px] text-[var(--text-secondary)]">
                      <span className="mt-1.5 h-1 w-1 rounded-full shrink-0 bg-[var(--text-muted)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Use the <strong className="text-[var(--text-primary)]">7D / 30D / 90D / 1Y</strong> buttons and the country dropdown at the top of the dashboard to filter all KPI cards and charts simultaneously. The <strong className="text-[var(--text-primary)]">Available Countries</strong> list in the dropdown is populated from your actual visitor data — only countries that have sent at least one event appear.
          </p>
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
      {/* Sidebar top label */}
      <div className="shrink-0 border-b border-[var(--border-color)] px-4 py-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Documentation</p>
        <p className="mt-0.5 text-[12px] font-medium text-[var(--text-secondary)]">User Guide · v1.0</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navGroups.map((group) => {
          const GIcon = group.Icon;
          return (
            <div key={group.category}>
              {/* Group label */}
              <div className="mb-2 flex items-center gap-2 px-2">
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
                  const pageData = pages[item.id];
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handlePageSelect(item.id)}
                        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-[var(--accent-light)] text-[var(--accent)]"
                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        <FileText size={13} className={`shrink-0 ${isActive ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`} />
                        <span className="truncate">{item.label}</span>
                      </button>

                      {/* Heading sub-items shown when this page is active */}
                      {isActive && pageData?.headings && pageData.headings.length > 0 && (
                        <ul className="mt-0.5 mb-1 ml-4 space-y-0.5 border-l-2 border-[var(--border-color)] pl-3">
                          {pageData.headings.map((h) => (
                            <li key={h.id}>
                              <button
                                onClick={() => scrollToHeading(h.id)}
                                className={`w-full text-left py-1.5 px-2 text-[12px] leading-snug rounded-lg transition-all duration-150 ${
                                  activeHeading === h.id
                                    ? "font-semibold text-[var(--accent)] bg-[var(--accent-light)]"
                                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                                } ${h.sub ? "pl-4" : ""}`}
                              >
                                {h.text}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
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
        .doc-sidebar-inner {
          width: 260px;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
      `}</style>

      <div className="doc-root">
        {/* Background mesh */}
        <div className="fixed inset-0 gradient-mesh pointer-events-none" style={{ zIndex: 0 }} />
        <div className="glow-orb glow-orb-1 pointer-events-none" style={{ position: "fixed", zIndex: 0 }} />
        <div className="glow-orb glow-orb-2 pointer-events-none" style={{ position: "fixed", zIndex: 0 }} />

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <header
          className="relative z-40 shrink-0 flex h-16 items-center border-b border-[var(--border-color)] px-5 lg:px-6"
          style={{ background: "var(--bg-navbar)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
        >
          {/* LEFT: logo + back */}
          <div className="flex items-center gap-3 shrink-0">
            {/* PortOS logo + name */}
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[12px] font-black text-white"
                style={{
                  background: "linear-gradient(135deg, var(--grad-start), var(--grad-end))",
                  boxShadow: "0 3px 10px var(--accent-glow)",
                }}
              >
                P
              </div>
              <div className="leading-tight hidden sm:block">
                <p className="text-sm font-semibold text-[var(--text-primary)]">PortOS</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">Docs</p>
              </div>
            </div>

            <div className="h-5 w-px bg-[var(--border-color)] hidden sm:block" />

            {/* Back to home */}
            <button
              onClick={() => navigate("/")}
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              <ArrowLeft size={14} />
              Back to Home
            </button>
          </div>

          {/* CENTER: search — absolutely centered in the header */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-9 items-center gap-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3.5 text-[var(--text-muted)] transition-all hover:border-[var(--accent)] hover:bg-[var(--bg-secondary)] w-52 sm:w-64 lg:w-80"
            >
              <Search size={14} className="shrink-0" />
              <span className="flex-1 text-left text-sm">Search documentation...</span>
              <kbd className="hidden sm:flex items-center rounded border border-[var(--border-color)] bg-[var(--bg-secondary)] px-1.5 py-0.5 font-mono text-[9px] font-medium text-[var(--text-muted)]">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* RIGHT: theme toggle */}
          <div className="ml-auto shrink-0">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--accent-light)]"
              aria-label="Toggle theme"
            >
              <Sun size={17} className={`absolute transition-all duration-500 ${theme === "dark" ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100 text-amber-500"}`} />
              <Moon size={17} className={`absolute transition-all duration-500 ${theme === "dark" ? "scale-100 rotate-0 opacity-100 text-indigo-400" : "scale-0 -rotate-90 opacity-0"}`} />
            </button>
          </div>
        </header>

        {/* ── BODY (sidebar + content + toc) ─────────────────────────────── */}
        <div className="relative z-10 flex flex-1 overflow-hidden">

          {/* Desktop sidebar — always visible */}
          <aside
            className="bg-[var(--bg-sidebar)] shrink-0 border-r border-[var(--border-color)]"
            style={{ width: "260px" }}
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
