import api from "@shared/lib/api";
import { API_ROUTES } from "@shared/lib/apiRoutes";

export interface ApiKey {
  id: number;
  name: string;
  api_key: string;
  status: "active" | "inactive";
  rate_limit: number;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface GetApiKeysResponse {
  success: boolean;
  apis: ApiKey[];
  message?: string;
}

export interface SingleApiKeyResponse {
  success: boolean;
  api: ApiKey;
  message?: string;
}

/**
 * Fetch all API keys for the authenticated user.
 */
export const getApiKeys = async (): Promise<GetApiKeysResponse> => {
  const response = await api.get(API_ROUTES.apiKeys.list);
  return response.data;
};

/**
 * Create a new API key.
 * @param name The name for the new API key
 * @param expires_at Optional expiration date in ISO format
 */
export const createApiKey = async (
  name: string,
  expires_at?: string
): Promise<SingleApiKeyResponse> => {
  const response = await api.post(API_ROUTES.apiKeys.list, {
    name,
    expires_at,
  });
  return response.data;
};

/**
 * Regenerate an existing API key. This will invalidate the old key and create a new one.
 * @param id The ID of the API key to regenerate
 */
export const regenerateApiKey = async (
  id: number
): Promise<SingleApiKeyResponse> => {
  const response = await api.put(API_ROUTES.apiKeys.regenerate(id));
  return response.data;
};

/**
 * Toggle the status of an API key between active and inactive.
 * @param id The ID of the API key to toggle
 */
export const toggleApiStatus = async (
  id: number
): Promise<SingleApiKeyResponse> => {
  const response = await api.put(API_ROUTES.apiKeys.toggle(id));
  return response.data;
};

export interface DeleteApiKeyResponse {
  success: boolean;
  /** True when the server only deactivated the key (first step). */
  deactivated: boolean;
  message?: string;
  /** Present when the server deactivated the key — caller should swap it in. */
  api?: ApiKey;
}

/**
 * Two-step destroy.
 *
 *   1st call on an active key   → server deactivates it; deactivated = true
 *   2nd call on an inactive key → server soft-deletes it; deactivated = false
 *
 * Callers should branch on `deactivated` to surface the right UX.
 */
export const deleteApiKey = async (
  id: number
): Promise<DeleteApiKeyResponse> => {
  const response = await api.delete(API_ROUTES.apiKeys.detail(id));
  return response.data;
};
