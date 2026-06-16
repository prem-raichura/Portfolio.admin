import api from "../../../shared/lib/api";
import { API_ROUTES } from "../../../shared/lib/apiRoutes";

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string | null;
  type: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

interface NotificationsResponse {
  success: boolean;
  notifications: Notification[];
}

interface UnreadCountResponse {
  success: boolean;
  count: number;
}

export const notificationService = {
  async getAll(): Promise<Notification[]> {
    const { data } = await api.get<NotificationsResponse>(
      API_ROUTES.notifications.list
    );
    return data.notifications;
  },

  async getUnreadCount(): Promise<number> {
    const { data } = await api.get<UnreadCountResponse>(
      API_ROUTES.notifications.unreadCount
    );
    return data.count;
  },

  async markAsRead(id: number): Promise<void> {
    await api.put(API_ROUTES.notifications.markRead(id));
  },

  async markAllAsRead(): Promise<void> {
    await api.put(API_ROUTES.notifications.markAllRead);
  },
};
