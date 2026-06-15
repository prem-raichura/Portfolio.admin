import api from "@shared/lib/api";
import { API_ROUTES } from "@shared/lib/apiRoutes";

export type BinType =
  | "project"
  | "experience"
  | "certificate"
  | "apiKey"
  | "contact";

export interface BinProject {
  id: number;
  title: string;
  slug: string | null;
  type: string | null;
  thumbnail: string | null;
  deleted_at: string;
}

export interface BinExperience {
  id: number;
  title: string;
  slug: string;
  company: string;
  start_date: string;
  end_date: string | null;
  deleted_at: string;
}

export interface BinCertificate {
  id: number;
  title: string;
  slug: string;
  type: string;
  issued_by: string | null;
  deleted_at: string;
}

export interface BinApiKey {
  id: number;
  name: string;
  api_key: string;
  status: "active" | "inactive";
  created_at: string;
  deleted_at: string;
}

export interface BinContact {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
  deleted_at: string;
}

export interface BinResponse {
  success: boolean;
  bin: {
    projects: BinProject[];
    experience: BinExperience[];
    certificates: BinCertificate[];
    apiKeys: BinApiKey[];
    contacts: BinContact[];
  };
}

export const getBin = async (): Promise<BinResponse> => {
  const response = await api.get(API_ROUTES.bin.list);
  return response.data;
};

export const restoreItem = async (
  type: BinType,
  id: number
): Promise<{ success: boolean; message?: string }> => {
  const response = await api.post(API_ROUTES.bin.restore, { type, id });
  return response.data;
};

export const permanentlyDelete = async (
  type: BinType,
  id: number
): Promise<{ success: boolean; message?: string }> => {
  const response = await api.delete(API_ROUTES.bin.detail(type, id));
  return response.data;
};
