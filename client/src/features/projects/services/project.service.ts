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
