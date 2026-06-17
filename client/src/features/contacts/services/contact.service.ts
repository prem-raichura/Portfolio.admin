import api from "@shared/lib/api";
import { API_ROUTES } from "@shared/lib/apiRoutes";

export interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const getContacts = async (): Promise<{
  success: boolean;
  contacts: Contact[];
}> => {
  const response = await api.get(API_ROUTES.contacts.list);
  return response.data;
};

/**
 * Fetches a single contact. The server auto-marks it as read on this call,
 * so the returned row will have `is_read: true`.
 */
export const getContact = async (
  id: number
): Promise<{ success: boolean; contact: Contact }> => {
  const response = await api.get(API_ROUTES.contacts.detail(id));
  return response.data;
};

export const deleteContact = async (
  id: number
): Promise<{ success: boolean; message?: string }> => {
  const response = await api.delete(API_ROUTES.contacts.detail(id));
  return response.data;
};
