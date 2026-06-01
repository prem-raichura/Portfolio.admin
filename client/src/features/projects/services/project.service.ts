import api from "@shared/lib/api";

export const createProject =
  async (
    formData: FormData
  ) => {

    const response =
      await api.post(
        "/api/projects",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  };

export const getProject =
  async (slug: string) => {

    const response =
      await api.get(
        `/api/projects/${slug}`
      );

    return response.data;
  };

export const updateProject =
  async (
    slug: string,
    formData: FormData
  ) => {

    const response =
      await api.put(
        `/api/projects/${slug}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  };

export const deleteProject =
  async (slug: string) => {
    const response =
      await api.delete(
        `/api/projects/${slug}`
      );
    return response.data;
  };
