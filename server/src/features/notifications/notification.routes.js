import express from "express";

import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "./notification.controller.js";

import { protect } from "../../shared/middleware/auth/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.put("/:id/read", protect, markAsRead);
router.put("/read-all", protect, markAllAsRead);

export default router;
