import {
  Grid2X2,
  LayoutList,
  Plus,
} from "lucide-react";

import { useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import ProjectCard from "../components/dashboard/cards/ProjectCard";

import { usePageNavigation } from "../hooks/usePageNavigation";

import PageLoader from "../components/ui/PageLoader";

function Projects() {
  const {
    loading,
    handleNavigation,
  } = usePageNavigation();

  /* =========================
      VIEW MODE
  ========================= */

  const [viewMode, setViewMode] =
    useState("grid");

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

          {/* VIEW TOGGLE */}

          <div
            className="
              flex
              items-center
              rounded-2xl
              border
              border-[var(--border-color)]
              bg-[var(--bg-card)]
              p-1
            "
          >
            {/* GRID */}

            <button
              onClick={() =>
                setViewMode(
                  "grid"
                )
              }
              className={`
                rounded-xl
                p-2.5
                transition-all
                duration-300
                ${
                  viewMode ===
                  "grid"
                    ? "bg-[var(--button-primary)] text-white dark:text-black"
                    : "text-[var(--text-secondary)]"
                }
              `}
            >
              <Grid2X2
                size={18}
              />
            </button>

            {/* LIST */}

            <button
              onClick={() =>
                setViewMode(
                  "list"
                )
              }
              className={`
                rounded-xl
                p-2.5
                transition-all
                duration-300
                ${
                  viewMode ===
                  "list"
                    ? "bg-[var(--button-primary)] text-white dark:text-black"
                    : "text-[var(--text-secondary)]"
                }
              `}
            >
              <LayoutList
                size={18}
              />
            </button>

          </div>

        </div>

        {/* =========================
            PROJECT GRID
        ========================= */}

        {viewMode ===
          "grid" && (
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
              (
                project,
                index
              ) => (
                <ProjectCard
                  key={index}
                  title={
                    project.title
                  }
                  description={
                    project.description
                  }
                  featured={
                    project.featured
                  }
                  status={
                    project.status
                  }
                  tags={
                    project.tags
                  }
                />
              )
            )}
          </div>
        )}

        {/* =========================
            LIST VIEW
        ========================= */}

        {viewMode ===
          "list" && (
          <div className="mt-8 space-y-5">

            {projects.map(
              (
                project,
                index
              ) => (
                <div
                  key={index}
                  className="
                    flex
                    flex-col
                    gap-5
                    rounded-[28px]
                    border
                    border-[var(--border-color)]
                    bg-[var(--bg-card)]
                    p-6
                    transition-all
                    duration-300
                    hover:shadow-lg
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                  "
                >
                  {/* LEFT */}

                  <div className="flex-1">

                    <div className="flex items-center gap-3">

                      <h2
                        className="
                          text-xl
                          font-semibold
                        "
                      >
                        {
                          project.title
                        }
                      </h2>

                      {project.featured && (
                        <div
                          className="
                            rounded-full
                            bg-yellow-100
                            px-3
                            py-1
                            text-xs
                            font-medium
                            text-yellow-700
                          "
                        >
                          Featured
                        </div>
                      )}

                    </div>

                    {/* DESCRIPTION */}

                    <p
                      className="
                        mt-3
                        max-w-3xl
                        text-sm
                        leading-relaxed
                        text-[var(--text-secondary)]
                      "
                    >
                      {
                        project.description
                      }
                    </p>

                    {/* TAGS */}

                    <div
                      className="
                        mt-4
                        flex
                        flex-wrap
                        gap-2
                      "
                    >
                      {project.tags.map(
                        (
                          tag,
                          tagIndex
                        ) => (
                          <div
                            key={
                              tagIndex
                            }
                            className="
                              rounded-full
                              bg-[var(--bg-secondary)]
                              px-3
                              py-1
                              text-xs
                              font-medium
                            "
                          >
                            {tag}
                          </div>
                        )
                      )}
                    </div>

                  </div>

                  {/* RIGHT */}

                  <div
                    className="
                      flex
                      flex-col
                      items-start
                      gap-4
                      lg:items-end
                    "
                  >
                    {/* STATUS */}

                    <div
                      className={`
                        rounded-full
                        px-4
                        py-2
                        text-sm
                        font-medium
                        ${
                          project.status ===
                          "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }
                      `}
                    >
                      {
                        project.status
                      }
                    </div>

                    {/* ACTIONS */}

                    <div className="flex gap-3">

                      <button
                        className="
                          rounded-xl
                          border
                          border-[var(--border-color)]
                          px-4
                          py-2
                          text-sm
                          font-medium
                          transition-all
                          duration-300
                          hover:bg-[var(--bg-secondary)]
                        "
                      >
                        Edit
                      </button>

                      <button
                        className="
                          rounded-xl
                          border
                          border-red-200
                          px-4
                          py-2
                          text-sm
                          font-medium
                          text-red-500
                          transition-all
                          duration-300
                          hover:bg-red-50
                        "
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </DashboardLayout>
    </>
  );
}

export default Projects;