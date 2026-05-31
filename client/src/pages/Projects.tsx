import {
  Grid2X2,
  LayoutList,
  Plus,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import ProjectCard from "../components/dashboard/cards/ProjectCard";
import { usePageNavigation } from "../hooks/usePageNavigation";
import PageLoader from "../components/ui/PageLoader";
import api from "../services/api"; // update path if needed

interface Project {
  id: number;
  title: string;
  description: string;
  featured: boolean;
  status: string;
  tags: string[];
}

function Projects() {
 const {
  handleNavigation,
} = usePageNavigation();

  const [viewMode, setViewMode] =
    useState<"grid" | "list">("grid");

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [
    projectsLoading,
    setProjectsLoading,
  ] = useState(true);

  const fetchProjects = async () => {
  try {
      const response = await api.get("/api/projects");

      setProjects(
        response?.data?.projects ?? []
      );
    } catch (error: any) {
      console.log("ERROR");
      console.log(error.response);
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (projectsLoading) {
    return <PageLoader />;
  }

  return (
    <DashboardLayout>
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
            Manage your portfolio
            projects.
          </p>
        </div>

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

      <div
        className="
          mt-8
          flex
          justify-end
        "
      >
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
          <button
            onClick={() =>
              setViewMode("grid")
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
            <Grid2X2 size={18} />
          </button>

          <button
            onClick={() =>
              setViewMode("list")
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
            <LayoutList size={18} />
          </button>
        </div>
      </div>

      {projects.length === 0 && (
        <div
          className="
            mt-8
            rounded-3xl
            border
            border-[var(--border-color)]
            bg-[var(--bg-card)]
            p-10
            text-center
          "
        >
          <h3
            className="
              text-xl
              font-semibold
            "
          >
            No Projects Found
          </h3>

          <p
            className="
              mt-2
              text-[var(--text-secondary)]
            "
          >
            Create your first
            project.
          </p>
        </div>
      )}

      {viewMode ===
        "grid" &&
        projects.length >
          0 && (
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
              (project) => (
                <ProjectCard
                  key={project.id}
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
                    project.tags ||
                    []
                  }
                />
              )
            )}
          </div>
        )}

      {viewMode ===
        "list" &&
        projects.length >
          0 && (
          <div className="mt-8 space-y-5">
            {projects.map(
              (project) => (
                <div
                  key={project.id}
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
                  <div className="flex-1">
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

                    <p
                      className="
                        mt-3
                        text-sm
                        text-[var(--text-secondary)]
                      "
                    >
                      {
                        project.description
                      }
                    </p>
                  </div>

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
                </div>
              )
            )}
          </div>
        )}
    </DashboardLayout>
  );
}

export default Projects;