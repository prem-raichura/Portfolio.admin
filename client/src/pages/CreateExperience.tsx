import {
  Calendar,
  Plus,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import type {
  ChangeEvent,
} from "react";

import DashboardLayout from "../layouts/DashboardLayout";

function CreateExperience() {
  /* =========================
      MAIN STATES
  ========================= */

  const [title, setTitle] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [company, setCompany] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [mode, setMode] =
    useState("Remote");

  const [
    startDate,
    setStartDate,
  ] = useState("");

  const [endDate, setEndDate] =
    useState("");

  const [
    isCurrent,
    setIsCurrent,
  ] = useState(false);

  /* =========================
      SKILLS / TAGS
  ========================= */

  const [tags, setTags] = useState<
    string[]
  >([]);

  const [tagInput, setTagInput] =
    useState("");

  /* =========================
      LINKS
  ========================= */

  const [links, setLinks] =
    useState([
      {
        key: "website",
        value: "",
      },
    ]);

  /* =========================
      AUTO SLUG
  ========================= */

  useEffect(() => {
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    setSlug(generatedSlug);
  }, [title]);

  /* =========================
      URL VALIDATION
  ========================= */

  const isValidUrl = (
    url: string
  ) => {
    try {
      new URL(url);

      return true;
    } catch {
      return false;
    }
  };

  /* =========================
      TAG FUNCTIONS
  ========================= */

  const addTag = () => {
    if (
      tagInput.trim() &&
      !tags.includes(tagInput)
    ) {
      setTags([
        ...tags,
        tagInput.trim(),
      ]);

      setTagInput("");
    }
  };

  /* =========================
      REMOVE TAG
  ========================= */

  const removeTag = (
    tag: string
  ) => {
    setTags(
      tags.filter(
        (t) => t !== tag
      )
    );
  };

  /* =========================
      LINK FUNCTIONS
  ========================= */

  const addLink = () => {
    setLinks([
      ...links,
      {
        key: "website",
        value: "",
      },
    ]);
  };

  const updateLink = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedLinks = [
      ...links,
    ];

    updatedLinks[index] = {
      ...updatedLinks[index],
      [field]: value,
    };

    setLinks(updatedLinks);
  };

  const removeLink = (
    index: number
  ) => {
    const updatedLinks = [
      ...links,
    ];

    updatedLinks.splice(index, 1);

    setLinks(updatedLinks);
  };

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

          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Create Experience
          </h1>

          <p
            className="
              mt-2
              text-[var(--text-secondary)]
            "
          >
            Add your professional
            experience details.
          </p>

        </div>

        <button
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
            dark:text-black
          "
        >
          Publish Experience
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
          xl:grid-cols-3
        "
      >
        {/* LEFT SIDE */}

        <div className="xl:col-span-2">

          <div
            className="
              rounded-[32px]
              border
              border-[var(--border-color)]
              bg-[var(--bg-card)]
              p-6
            "
          >
            {/* TITLE */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                "
              >
                Job Title *
              </label>

              <input
                required
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="Frontend Developer"
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

            {/* COMPANY */}

            <div className="mt-6">

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                "
              >
                Company Name *
              </label>

              <input
                required
                type="text"
                value={company}
                onChange={(e) =>
                  setCompany(
                    e.target.value
                  )
                }
                placeholder="Google, Reliance..."
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

            {/* DESCRIPTION */}

            <div className="mt-6">

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                "
              >
                Description
              </label>

              <textarea
                rows={7}
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="Write experience details..."
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

            {/* SKILLS */}

            <div className="mt-6">

              <label
                className="
                  mb-3
                  block
                  text-sm
                  font-medium
                "
              >
                Skills / Technologies
              </label>

              <div className="flex gap-3">

                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) =>
                    setTagInput(
                      e.target.value
                    )
                  }
                  placeholder="React, Node.js..."
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

                <button
                  type="button"
                  onClick={addTag}
                  className="
                    flex
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[var(--button-primary)]
                    px-5
                    text-white
                    dark:text-black
                  "
                >
                  <Plus size={18} />
                </button>

              </div>

              {/* TAGS */}

              <div
                className="
                  mt-4
                  flex
                  flex-wrap
                  gap-3
                "
              >
                {tags.map(
                  (
                    tag,
                    index
                  ) => (
                    <div
                      key={index}
                      className="
                        rounded-full
                        bg-[var(--bg-secondary)]
                        px-4
                        py-2
                        text-sm
                      "
                    >
                      {tag}
                    </div>
                  )
                )}
              </div>

            </div>

            {/* LINKS */}

            <div className="mt-6">

              <div
                className="
                  mb-3
                  flex
                  items-center
                  justify-between
                "
              >
                <label
                  className="
                    text-sm
                    font-medium
                  "
                >
                  Experience Links
                </label>

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

                {links.map(
                  (
                    link,
                    index
                  ) => (
                    <div
                      key={index}
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
                      {/* KEY */}

                      <div className="md:col-span-3">

                        <select
                          value={
                            link.key
                          }
                          onChange={(e) =>
                            updateLink(
                              index,
                              "key",
                              e.target
                                .value
                            )
                          }
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
                          <option value="website">
                            Website
                          </option>

                          <option value="linkedin">
                            LinkedIn
                          </option>

                          <option value="certificate">
                            Certificate
                          </option>

                          <option value="portfolio">
                            Portfolio
                          </option>
                        </select>

                      </div>

                      {/* URL */}

                      <div className="md:col-span-8">

                        <input
                          type="url"
                          value={
                            link.value
                          }
                          onChange={(e) =>
                            updateLink(
                              index,
                              "value",
                              e.target
                                .value
                            )
                          }
                          placeholder="Enter URL"
                          className={`
                            w-full
                            rounded-xl
                            border
                            px-4
                            py-3
                            outline-none
                            ${
                              link.value &&
                              !isValidUrl(
                                link.value
                              )
                                ? "border-red-400"
                                : "border-[var(--border-color)]"
                            }
                            bg-[var(--bg-card)]
                          `}
                        />

                      </div>

                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() =>
                          removeLink(
                            index
                          )
                        }
                        className="
                          rounded-xl
                          border
                          border-red-200
                          text-red-500
                          transition-all
                          duration-300
                          hover:bg-red-50
                        "
                      >
                        Remove
                      </button>

                    </div>
                  )
                )}

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="space-y-6">

          {/* SETTINGS */}

          <div
            className="
              rounded-[32px]
              border
              border-[var(--border-color)]
              bg-[var(--bg-card)]
              p-6
            "
          >
            <h2
              className="
                text-lg
                font-semibold
              "
            >
              Experience Settings
            </h2>

            {/* LOCATION */}

            <div className="mt-5">

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                "
              >
                Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) =>
                  setLocation(
                    e.target.value
                  )
                }
                placeholder="Ahmedabad, India"
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

            {/* MODE */}

            <div className="mt-5">

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                "
              >
                Work Mode
              </label>

              <select
                value={mode}
                onChange={(e) =>
                  setMode(
                    e.target.value
                  )
                }
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
              >
                <option>
                  Remote
                </option>

                <option>
                  Onsite
                </option>

                <option>
                  Hybrid
                </option>
              </select>

            </div>

            {/* START DATE */}

            <div className="mt-5">

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                "
              >
                Start Date *
              </label>

              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-[var(--border-color)]
                  bg-[var(--bg-main)]
                  px-4
                  py-3
                "
              >
                <Calendar
                  size={18}
                />

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    bg-transparent
                    outline-none
                  "
                />

              </div>

            </div>

            {/* END DATE */}

            {!isCurrent && (
              <div className="mt-5">

                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                  "
                >
                  End Date
                </label>

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-[var(--border-color)]
                    bg-[var(--bg-main)]
                    px-4
                    py-3
                  "
                >
                  <Calendar
                    size={18}
                  />

                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) =>
                      setEndDate(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      bg-transparent
                      outline-none
                    "
                  />

                </div>

              </div>
            )}

            {/* CURRENTLY WORKING */}

            <div
              className="
                mt-6
                flex
                items-center
                justify-between
              "
            >
              <div>

                <h3 className="font-medium">
                  Currently Working
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    text-[var(--text-secondary)]
                  "
                >
                  Presently active
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setIsCurrent(
                    !isCurrent
                  )
                }
                className={`
                  relative
                  h-7
                  w-12
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    isCurrent
                      ? "bg-[var(--button-primary)]"
                      : "bg-gray-300"
                  }
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
                    ${
                      isCurrent
                        ? "right-1"
                        : "left-1"
                    }
                  `}
                />
              </button>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default CreateExperience;