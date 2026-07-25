import api from "@shared/lib/api";
import { API_ROUTES } from "@shared/lib/apiRoutes";

/** A GitHub repo as trimmed down by the backend `listRepos` handler. */
export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  private: boolean;
  archived: boolean;
  stargazers_count: number;
  updated_at: string;
  /** True when a project already exists for this repo's GitHub link. */
  imported: boolean;
}

export interface GithubReposResponse {
  success: boolean;
  connected: boolean;
  repos?: GithubRepo[];
}

/**
 * Start the repo-scope OAuth flow. Returns the GitHub authorize URL that the
 * caller redirects the browser to (the bearer token can't ride a redirect,
 * so we ask via axios and navigate to the returned URL).
 */
export const connectGithub = async (): Promise<{ authUrl: string }> => {
  const response = await api.get(API_ROUTES.github.connect);
  return response.data;
};

/**
 * List the connected user's GitHub repos. If GitHub isn't connected the
 * response has `connected: false` and no repos.
 */
export const getGithubRepos = async (): Promise<GithubReposResponse> => {
  const response = await api.get(API_ROUTES.github.repos);
  return response.data;
};

/**
 * Import a single repo (by full_name, e.g. "owner/repo") into projects.
 */
export const importGithubRepo = async (fullName: string) => {
  const response = await api.post(API_ROUTES.github.import, {
    full_name: fullName,
  });
  return response.data;
};
