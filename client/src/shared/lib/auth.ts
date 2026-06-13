import type { AxiosError } from "axios";
import api from "./api";
import { API_ROUTES } from "./apiRoutes";

export type SessionStatus = "valid" | "auth-failed" | "network-error" | "missing";

/**
 * Validates the current session by verifying the access token with the backend.
 *
 * Returns one of:
 *   - "valid"          → access (or refreshed) token works
 *   - "missing"        → no access token in localStorage
 *   - "auth-failed"    → server explicitly rejected refresh (401/403)
 *   - "network-error"  → no response or 5xx; session likely still valid
 *
 * Callers (e.g. ProtectedRoute) must treat "network-error" as transient
 * and NOT log the user out.
 */
export const verifySession = async (): Promise<SessionStatus> => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return "missing";
  }

  try {
    await api.get(API_ROUTES.user.me);
    return "valid";
  } catch (err) {
    const status = (err as AxiosError)?.response?.status;
    if (status === 401 || status === 403) {
      return "auth-failed";
    }
    return "network-error";
  }
};
