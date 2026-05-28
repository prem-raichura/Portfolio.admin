import {
  Plus,
  Briefcase,
  MapPin,
  CalendarDays,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";

import { usePageNavigation } from "../hooks/usePageNavigation";
import PageLoader from "../components/ui/PageLoader";

function Experience() {
  const {
    loading,
    handleNavigation,
  } = usePageNavigation();

  const experiences = [
    {
      company: "Reliance Industries Limited",
      role: "AI/ML Intern",
      duration: "May 2025 - July 2025",
      mode: "Onsite",
      location: "Jamnagar, Gujarat",
      status: "completed",
      technologies: [
        "Python",
        "TensorFlow",
        "Power BI",
        "Machine Learning",
      ],
    },

    {
      company: "Team E.D.I.T.H",
      role: "AI Research Developer",
      duration: "2024 - Present",
      mode: "Remote",
      location: "Ahmedabad, Gujarat",
      status: "active",
      technologies: [
        "PyTorch",
        "Deep Learning",
        "Transformers",
      ],
    },

    {
      company: "NextGen Techies",
      role: "Frontend Developer",
      duration: "2024",
      mode: "Hybrid",
      location: "Gandhinagar, Gujarat",
      status: "completed",
      technologies: [
        "React",
        "Tailwind CSS",
        "Node.js",
      ],
    },

    {
      company: "EduMate AI",
      role: "Full Stack Developer",
      duration: "2025 - Present",
      mode: "Remote",
      location: "India",
      status: "active",
      technologies: [
        "React",
        "Express",
        "MongoDB",
        "AI APIs",
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
              Experience
            </h1>

            <p
              className="
                mt-2
                text-[var(--text-secondary)]
              "
            >
              Manage your professional experience.
            </p>

          </div>

          {/* Right */}

          <button
            onClick={() =>
              handleNavigation(
                "/experience/create"
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

            Add Experience
          </button>
        </div>

        {/* =========================
            FILTERS
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
              Active
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
              Completed
            </button>

          </div>
        </div>

        {/* =========================
            EXPERIENCE GRID
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
          {experiences.map(
            (experience, index) => (
              <div
                key={index}
                className="
                  rounded-3xl
                  border
                  border-gray-500
                  bg-[#79889f]
                  p-6
                  text-white
                  shadow-lg
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-2xl
                "
              >
                {/* TOP */}

                <div className="flex items-start justify-between">

                  <div>

                    <h2
                      className="
                        text-xl
                        font-bold
                      "
                    >
                      {experience.role}
                    </h2>

                    <div
                      className="
                        mt-2
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-gray-200
                      "
                    >
                      <Briefcase size={15} />

                      {experience.company}
                    </div>

                  </div>

                  <span
                    className="
                      rounded-xl
                      bg-gray-300
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-white
                    "
                  >
                    {experience.status}
                  </span>

                </div>

                {/* DETAILS */}

                <div className="mt-6 space-y-4">

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      text-sm
                    "
                  >
                    <CalendarDays size={16} />

                    <span>
                      {experience.duration}
                    </span>

                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      text-sm
                    "
                  >
                    <MapPin size={16} />

                    <span>
                      {experience.location}
                    </span>

                  </div>

                  <div>

                    <p
                      className="
                        mb-2
                        text-xs
                        font-medium
                        uppercase
                        tracking-wide
                        text-gray-200
                      "
                    >
                      Work Mode
                    </p>

                    <span
                      className="
                        rounded-xl
                        bg-gray-400
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-white
                      "
                    >
                      {experience.mode}
                    </span>

                  </div>

                </div>

                {/* TECHNOLOGIES */}

                <div className="mt-6 flex flex-wrap gap-2">

                  {experience.technologies.map(
                    (
                      tech,
                      techIndex
                    ) => (
                      <span
                        key={techIndex}
                        className="
                          rounded-xl
                          border
                          border-gray-500
                          bg-gray-400
                          px-3
                          py-1
                          text-xs
                          font-medium
                          text-gray-100
                        "
                      >
                        {tech}
                      </span>
                    )
                  )}

                </div>

              </div>
            )
          )}
        </div>

      </DashboardLayout>
    </>
  );
}

export default Experience;