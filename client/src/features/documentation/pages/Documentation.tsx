import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import {
  ArrowLeft,
  Sun,
  Moon,
  Copy,
  Check,
  ChevronDown,
  FileText,
  Search,
  BookOpen,
  Info,
  AlertTriangle,
  ArrowUpRight,
  Settings,
  User,
  Key,
  Eye,
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

// ─── Reusable doc primitives ─────────────────────────────────────────────
// These render the exact same DOM as the original inline markup; they exist
// only to deduplicate ~25 copies of the same h3 / callout / code-block JSX.

function SectionHeading({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h3
      id={id}
      className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 scroll-mt-20 flex items-center gap-2"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> {children}
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
  const accent = variant === "info" ? "var(--accent)" : "var(--warning)";
  return (
    <div
      className="rounded-2xl border border-l-4 border-[var(--border-color)] bg-[var(--bg-secondary)] p-5 text-sm text-[var(--text-secondary)] relative overflow-hidden"
      style={{ borderLeftColor: accent }}
    >
      {variant === "info" && (
        <div
          className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full opacity-10"
          style={{
            background: `radial-gradient(circle, ${accent}, transparent 70%)`,
          }}
        />
      )}
      <div className="flex items-center gap-2 font-bold text-[var(--text-primary)] mb-1">
        <span style={{ color: accent }} className="flex items-center">
          {icon}
        </span>
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}

function CodeBlock({
  language,
  code,
  copyId,
  copyLabel = "Copy Code",
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
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-tertiary)]">
      <div className="flex h-10 items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 text-xs font-semibold text-[var(--text-muted)]">
        <span>{language}</span>
        <button
          onClick={() => onCopy(code, copyId)}
          className="flex items-center gap-1.5 hover:text-[var(--text-primary)]"
        >
          {isCopied ? (
            <>
              <Check size={12} className="text-[var(--success)]" /> Copied
            </>
          ) : (
            <>
              <Copy size={12} /> {copyLabel}
            </>
          )}
        </button>
      </div>
      <pre
        className={`p-4 overflow-x-auto text-[11px] font-mono leading-relaxed text-[var(--text-primary)] ${
          maxHeight ? `overflow-y-auto ${maxHeight}` : ""
        }`}
      >
        {code}
      </pre>
    </div>
  );
}

function Documentation() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  // Sidebar fold states
  const [folders, setFolders] = useState({
    overview: true,
    features: true,
    integrations: true,
    analytics: true,
  });

  // Current selected page ID
  const [selectedPage, setSelectedPage] = useState<string>("system-overview");

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

  // API reference tab state
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

  // Documentation Pages Definitions
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
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Welcome to the PortOS User Guide! PortOS (Personal Portfolio Operating System) is a developer-focused content management system designed to act as the single source of truth for your professional profile.
          </p>

          <SectionHeading id="what-is-portos">What is PortOS?</SectionHeading>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Instead of hardcoding projects, copying and pasting markdown resume logs, or configuring individual database backends every time you update your personal web page, PortOS provides a centralized workspace dashboard. Here, you configure your bio, work history, certification credentials, and showcase projects once, and feed them securely to any frontend layout.
          </p>

          <SectionHeading id="decoupled-approach">The Decoupled Approach</SectionHeading>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            By shifting content management to a decoupled administrator dashboard, you separate your professional data from your presentation layer. This means you can create multiple, unique portfolio themes (a terminal CLI style, a sleek minimalist design, or a full 3D interactive view) all fetching from the same updated database payload.
          </p>

          <Callout variant="info" icon={<Info size={16} />} title="Fast Page Load Guarantee">
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
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Getting your workspace set up in PortOS takes less than two minutes. Follow these simple onboarding steps to configure your dashboard:
          </p>

          <SectionHeading id="github-onboarding">1. GitHub Authorization</SectionHeading>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Click the **Get Started** button on the home page. You will be redirected to GitHub to authorize the PortOS app. This establishes your identity and link mapping without passwords. We fetch only public details like your name, primary email, avatar image, and username.
          </p>

          <SectionHeading id="dashboard-setup">2. Setting Up Your Profile</SectionHeading>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Once authorized, you will land on the primary Dashboard. Navigate to the **Profile** feature to edit your headline, bio, list your top technical skills, and link your professional social accounts.
          </p>

          <SectionHeading id="api-generation">3. Generating Your First API Key</SectionHeading>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            To fetch this data on your custom web layout, navigate to the **API Keys** section in your dashboard side menu. Click **Create New Key**, give it a name (e.g., "Main Portfolio Site"), and copy the token. You will use this token to authenticate requests on your external websites.
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
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            The profile configuration page manages the top-level parameters of your digital resume.
          </p>

          <SectionHeading id="personal-details">Personal Details &amp; Headlines</SectionHeading>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Update your full professional name, add a punchy developer headline (e.g., "Full Stack Developer specializing in Web Infrastructure"), and write a brief biography describing your focus areas and work interests.
          </p>

          <SectionHeading id="avatar-hosting">Avatar &amp; Image Uploads</SectionHeading>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            By default, PortOS utilizes your GitHub profile picture. If you wish to change it, the dashboard features an integrated drag-and-drop uploader. Images are optimized and hosted securely on Cloudinary CDN, ensuring fast load times.
          </p>

          <SectionHeading id="social-linking">Connecting Social Links</SectionHeading>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Input direct profile links for GitHub, LinkedIn, Twitter, and your personal homepage. These links are packaged neatly in the public API payload under the <code>links</code> object.
          </p>

          <SectionHeading id="skills-tagging">Configuring Technical Skills</SectionHeading>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Manage your technical skill tags dynamically. Type tech stacks like "React", "TypeScript", or "GraphQL" and press enter to tag them. These are returned as a simple array, perfect for rendering custom badges or filters on your personal website.
          </p>
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
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Showcase your open-source projects, personal software, and key client works dynamically.
          </p>

          <SectionHeading id="creating-project">Creating Showcase Cards</SectionHeading>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Add a project card by specifying a title and a description. PortOS automatically generates a URL-safe slug (e.g. <code>portos-cli</code>). Upload a thumbnail card or mock image which gets compressed automatically to the WebP format for fast delivery.
          </p>

          <SectionHeading id="managing-metadata">Managing Hyperlinks &amp; Tags</SectionHeading>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            For each project, assign a Github Repository URL and a Live Demo URL. You can also specify the exact tech stack tags (e.g., Node, Tailwind, React) utilized during development.
          </p>

          <SectionHeading id="featured-flag">Featured Projects Pinning</SectionHeading>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Toggle the **Featured** switch on your highest quality projects. This flags the project as <code>featured: true</code> in the API response, allowing your portfolio layout to pin these highlight cards to the front page or list them in a hero grid.
          </p>
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
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Maintain an interactive timeline of your employment history, internships, and consulting engagements.
          </p>

          <SectionHeading id="work-history-setup">Adding Experience Records</SectionHeading>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Input the company name, your professional title, start date, and end date. Describe key achievements, architectures built, and technical milestones accomplished during your stay.
          </p>

          <SectionHeading id="current-employment">Tracking Current Roles</SectionHeading>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            If you are currently employed at a company, check the **I presently work here** box. This sets the end date parameter to null and tags the record as <code>isCurrent: true</code> in the public API payload. Your portfolio site can render this dynamically as "Present" or display a special "Available for freelance" indicator.
          </p>
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
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Manage your credentials, professional exam licenses, bootcamp certificates, and tech hackathon awards.
          </p>

          <SectionHeading id="register-certificates">Logging Credentials &amp; Licenses</SectionHeading>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Provide the name of the certification (e.g. "Google Professional Cloud Architect") and the official issuing organization (e.g. "Google Cloud"). Specify the unique Credential ID issued to verify authenticity.
          </p>

          <SectionHeading id="issuer-verification">Issuer Verification Link</SectionHeading>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Include the direct credential lookup link provided by the issuer (like Credly or university portal). In the JSON payload, these are delivered under <code>url</code>, allowing portfolio users to click directly to verify your credentials.
          </p>
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
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Connect your custom client portfolio layouts to the PortOS data infrastructure using secure access keys.
          </p>

          <SectionHeading id="generating-keys">Generating API Keys</SectionHeading>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Navigate to the **API Keys** panel in your dashboard menu. Click **Create New Key**, specify a descriptive label (like "NextJS Production", "Staging Resume"), and hit create. Copy the generated string immediately—it will not be shown again for security reasons.
          </p>

          <SectionHeading id="key-security">Key Access &amp; Security</SectionHeading>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            All generated keys are strictly read-only. They permit external services to fetch your public portfolio metrics, experience, certificates, and profiles using GET requests, but prevent any write, update, or deletion operations.
          </p>

          <Callout variant="warning" icon={<AlertTriangle size={16} />} title="Keep Keys Secret">
            Do not bundle your API keys inside public git repositories. If you are using React or Next.js, store keys in server environments (like <code>.env.local</code>) or configure proxy API routing to prevent exposing the token in client browser requests.
          </Callout>

          <SectionHeading id="revoking-keys">Revoking &amp; Rotating Keys</SectionHeading>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            If an API key is accidentally leaked or compromised, click **Revoke** next to the key entry in the dashboard. The key will be deleted instantly, and any subsequent queries using that key on your portfolio sites will return a <code>401 Unauthorized</code> error. You can then generate a new key to replace it.
          </p>
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
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Query your aggregated developer profile details securely using our public endpoints.
          </p>

          <SectionHeading id="endpoint-details">Endpoint Details</SectionHeading>
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-[var(--success-light)] px-2.5 py-1 text-xs font-bold text-[var(--success)]">
              GET
            </span>
            <code className="text-sm font-semibold text-[var(--text-primary)]">
              /api/public
            </code>
          </div>

          <SectionHeading id="request-headers">Request Headers</SectionHeading>
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
                  <td className="p-3 text-[var(--text-muted)]">The active API Key generated in your admin dashboard.</td>
                  <td className="p-3 text-red-500 font-bold">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>

          <SectionHeading id="code-examples">Code Examples</SectionHeading>
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

            <CodeBlock
              language={apiTab === "curl" ? "bash" : "javascript"}
              code={apiTab === "curl" ? curlCode : fetchCode}
              copyId="api-req"
              copyLabel="Copy Code"
              copiedText={copiedText}
              onCopy={handleCopy}
            />
          </div>

          <SectionHeading id="response-json">JSON Payload Structure</SectionHeading>
          <CodeBlock
            language="json"
            code={responseJson}
            copyId="api-res"
            copyLabel="Copy Payload"
            copiedText={copiedText}
            onCopy={handleCopy}
            maxHeight="max-h-[350px]"
          />
        </div>
      ),
    },
    "analytics-dashboard": {
      id: "analytics-dashboard",
      title: "Analytics & Tracking",
      category: "Analytics",
      attributes: [
        { name: "Primary Views Log", value: "Page views & Unique visitors" },
        { name: "Geolocation Map", value: "Visitor country distribution chart" },
        { name: "Device Statistics", value: "Browser & OS percentages" },
        { name: "Outbound tracking", value: "Link clicks (GitHub/Demo)" },
      ],
      headings: [
        { id: "visitor-stats", text: "Visitor Metrics & Page Views" },
        { id: "geography-metrics", text: "Geographic Heatmaps" },
        { id: "engagement-events", text: "Link Click Event Tracking" },
      ],
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Gain immediate visibility into who is visiting your portfolio, which projects they review, and where they click.
          </p>

          <SectionHeading id="visitor-stats">Visitor Metrics &amp; Page Views</SectionHeading>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            The **Dashboard Overview** displays real-time visitor stats. Analyze total visual hits, filter unique daily visits, and view timelines showing weekly traffic trends.
          </p>

          <SectionHeading id="geography-metrics">Geographic Heatmaps</SectionHeading>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            PortOS includes IP geolocation parsing. Our analytics dashboard maps visitor IPs to their country of origin and showcases distribution metrics, allowing you to see which global regions visit your portfolio.
          </p>

          <SectionHeading id="engagement-events">Link Click Event Tracking</SectionHeading>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Track outbound links instantly. We record click actions when a user opens your GitHub repositories, clicks "Live Demo" links, or submits contact info. This event log gives you direct insight into which projects attract the most engagement.
          </p>
        </div>
      ),
    },
  };

  const handlePageSelect = (pageId: string) => {
    setSelectedPage(pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activePageData = pages[selectedPage] || pages["system-overview"];

  // Filter sections for Search Modal
  const allDocLinks = [
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
              <h1 className="text-sm font-semibold leading-tight">PortOS User Docs</h1>
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
        <aside className="sticky top-24 hidden h-[calc(100vh-120px)] w-72 shrink-0 overflow-y-auto border-r border-[var(--border-color)] pr-6 md:block">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                PortOS User Guide
              </p>
              <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">
                Features &amp; Settings Walkthroughs
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
                    Getting Started
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
                      onClick={() => handlePageSelect("system-overview")}
                      className={`flex w-full items-center gap-2 rounded-lg py-1.5 px-2.5 text-xs text-left transition-all ${
                        selectedPage === "system-overview"
                          ? "bg-[var(--accent-light)] text-[var(--accent)] font-bold"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                      }`}
                    >
                      <FileText size={12} /> System Overview
                    </button>
                    <button
                      onClick={() => handlePageSelect("how-to-start")}
                      className={`flex w-full items-center gap-2 rounded-lg py-1.5 px-2.5 text-xs text-left transition-all ${
                        selectedPage === "how-to-start"
                          ? "bg-[var(--accent-light)] text-[var(--accent)] font-bold"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                      }`}
                    >
                      <FileText size={12} /> How to Start
                    </button>
                  </div>
                )}
              </div>

              {/* Category: Core Features Folder */}
              <div>
                <button
                  onClick={() => toggleFolder("features")}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--accent-light)] transition-all"
                >
                  <span className="flex items-center gap-2.5">
                    <User size={16} className="text-[var(--text-muted)]" />
                    Core Features
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-[var(--text-muted)] transition-transform duration-200 ${
                      folders.features ? "" : "-rotate-90"
                    }`}
                  />
                </button>
                {folders.features && (
                  <div className="ml-5 mt-1 border-l border-[var(--border-color)] pl-3 space-y-1 animate-fade-in-up">
                    <button
                      onClick={() => handlePageSelect("profile-socials")}
                      className={`flex w-full items-center gap-2 rounded-lg py-1.5 px-2.5 text-xs text-left transition-all ${
                        selectedPage === "profile-socials"
                          ? "bg-[var(--accent-light)] text-[var(--accent)] font-bold"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                      }`}
                    >
                      <FileText size={12} /> Profile &amp; Social Links
                    </button>
                    <button
                      onClick={() => handlePageSelect("project-showcase")}
                      className={`flex w-full items-center gap-2 rounded-lg py-1.5 px-2.5 text-xs text-left transition-all ${
                        selectedPage === "project-showcase"
                          ? "bg-[var(--accent-light)] text-[var(--accent)] font-bold"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                      }`}
                    >
                      <FileText size={12} /> Project Showcase
                    </button>
                    <button
                      onClick={() => handlePageSelect("experience-history")}
                      className={`flex w-full items-center gap-2 rounded-lg py-1.5 px-2.5 text-xs text-left transition-all ${
                        selectedPage === "experience-history"
                          ? "bg-[var(--accent-light)] text-[var(--accent)] font-bold"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                      }`}
                    >
                      <FileText size={12} /> Experience &amp; History
                    </button>
                    <button
                      onClick={() => handlePageSelect("certifications")}
                      className={`flex w-full items-center gap-2 rounded-lg py-1.5 px-2.5 text-xs text-left transition-all ${
                        selectedPage === "certifications"
                          ? "bg-[var(--accent-light)] text-[var(--accent)] font-bold"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                      }`}
                    >
                      <FileText size={12} /> Certifications
                    </button>
                  </div>
                )}
              </div>

              {/* Category: Integrations & API Folder */}
              <div>
                <button
                  onClick={() => toggleFolder("integrations")}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--accent-light)] transition-all"
                >
                  <span className="flex items-center gap-2.5">
                    <Key size={16} className="text-[var(--text-muted)]" />
                    Integrations &amp; API
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-[var(--text-muted)] transition-transform duration-200 ${
                      folders.integrations ? "" : "-rotate-90"
                    }`}
                  />
                </button>
                {folders.integrations && (
                  <div className="ml-5 mt-1 border-l border-[var(--border-color)] pl-3 space-y-1 animate-fade-in-up">
                    <button
                      onClick={() => handlePageSelect("managing-api-keys")}
                      className={`flex w-full items-center gap-2 rounded-lg py-1.5 px-2.5 text-xs text-left transition-all ${
                        selectedPage === "managing-api-keys"
                          ? "bg-[var(--accent-light)] text-[var(--accent)] font-bold"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                      }`}
                    >
                      <FileText size={12} /> Managing API Keys
                    </button>
                    <button
                      onClick={() => handlePageSelect("fetching-data")}
                      className={`flex w-full items-center gap-2 rounded-lg py-1.5 px-2.5 text-xs text-left transition-all ${
                        selectedPage === "fetching-data"
                          ? "bg-[var(--accent-light)] text-[var(--accent)] font-bold"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                      }`}
                    >
                      <FileText size={12} /> Fetching Your Data
                    </button>
                  </div>
                )}
              </div>

              {/* Category: Analytics Folder */}
              <div>
                <button
                  onClick={() => toggleFolder("analytics")}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--accent-light)] transition-all"
                >
                  <span className="flex items-center gap-2.5">
                    <Eye size={16} className="text-[var(--text-muted)]" />
                    Analytics &amp; Tracking
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-[var(--text-muted)] transition-transform duration-200 ${
                      folders.analytics ? "" : "-rotate-90"
                    }`}
                  />
                </button>
                {folders.analytics && (
                  <div className="ml-5 mt-1 border-l border-[var(--border-color)] pl-3 space-y-1 animate-fade-in-up">
                    <button
                      onClick={() => handlePageSelect("analytics-dashboard")}
                      className={`flex w-full items-center gap-2 rounded-lg py-1.5 px-2.5 text-xs text-left transition-all ${
                        selectedPage === "analytics-dashboard"
                          ? "bg-[var(--accent-light)] text-[var(--accent)] font-bold"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                      }`}
                    >
                      <FileText size={12} /> Analytics Dashboard
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
                    <Check size={12} className="text-[var(--success)] animate-pulse" /> Copied!
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
                  {activePageData.attributes.map((attr) => (
                    <div key={attr.name} className="grid grid-cols-2 px-4 py-3 hover:bg-[var(--bg-secondary)] transition-all">
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
            {activePageData.headings.map((h) => (
              <li key={h.id} className={`${h.sub ? "pl-4" : ""}`}>
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
