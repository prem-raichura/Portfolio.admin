import {
  Plus,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";

import ProjectCard from "../components/dashboard/cards/ProjectCard";
import { usePageNavigation } from "../hooks/usePageNavigation";
import PageLoader from "../components/ui/PageLoader";

function Projects() {
  const {
  loading,
  handleNavigation,
} = usePageNavigation();
  const projects = [
  {
    title:
      "AI Portfolio Platform",

    description:
      "Modern AI-powered developer portfolio infrastructure with dynamic APIs and analytics.",

    featured: true,

    status: "published",

    tags: [
      "React",
      "Node.js",
      "PostgreSQL",
      "Redis",
    ],
  },

  {
    title:
      "Deepfake Detection System",

    description:
      "Research-based deepfake detection platform using Swin Transformers and diffusion models.",

    featured: true,

    status: "published",

    tags: [
      "PyTorch",
      "Vision AI",
      "Transformers",
    ],
  },

  {
    title:
      "E-Library Platform",

    description:
      "Collaborative educational resource sharing platform with recommendation system.",

    featured: false,

    status: "draft",

    tags: [
      "Laravel",
      "MySQL",
      "Bootstrap",
    ],
  },

  {
    title:
      "Farmer Marketplace",

    description:
      "Direct farmer-to-consumer marketplace platform with smart pricing system.",

    featured: false,

    status: "published",

    tags: [
      "Django",
      "Cloud",
      "Payments",
    ],
  },
];

  return (
    <>
  {loading && <PageLoader />}
    <DashboardLayout>

      {/* =========================
          TOP SECTION
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
        {/* Left */}

        <div>

          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Projects
          </h1>

          <p
            className="
              mt-2
              text-[var(--text-secondary)]
            "
          >
            Manage your portfolio projects.
          </p>

        </div>

        {/* Right */}

        <button
            onClick={() =>
                handleNavigation(
                "/projects/create"
                )
            }
            className="
                flex
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-[var(--button-primary)]
                px-5
                py-3
                font-medium
                text-white
                transition-all
                duration-300
                hover:bg-[var(--button-primary-hover)]
                dark:text-black
            "
        >
          <Plus size={18} />

          Add Project
        </button>
      </div>

      {/* =========================
          SEARCH + FILTER
      ========================= */}

      <div
        className="
          mt-8
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        {/* Filters */}

        <div className="flex items-center gap-3">

          <button
            className="
              rounded-2xl
              border
              border-[var(--border-color)]
              bg-[var(--bg-card)]
              px-4
              py-2.5
              text-sm
              font-medium
            "
          >
            All
          </button>

          <button
            className="
              rounded-2xl
              border
              border-[var(--border-color)]
              bg-[var(--bg-card)]
              px-4
              py-2.5
              text-sm
              font-medium
            "
          >
            Published
          </button>

          <button
            className="
              rounded-2xl
              border
              border-[var(--border-color)]
              bg-[var(--bg-card)]
              px-4
              py-2.5
              text-sm
              font-medium
            "
          >
            Draft
          </button>

        </div>
      </div>

      {/* =========================
          PROJECT GRID
      ========================= */}

      <div
        className="
          mt-8
          grid
          grid-cols-1
          gap-6
          md:grid-cols-2
          xl:grid-cols-3
        "
      >
        {projects.map(
          (project, index) => (
            <ProjectCard
                key={index}
                title={project.title}
                description={
                    project.description
                }
                featured={project.featured}
                status={project.status}
                tags={project.tags}
            />
          )
        )}
      </div>

    </DashboardLayout>
    </>
  );
}

export default Projects;