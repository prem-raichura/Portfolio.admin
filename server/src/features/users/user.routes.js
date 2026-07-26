import express from "express";

import { getCurrentUser, updateCurrentUser } from "./user.controller.js";

import { protect } from "../../shared/middleware/auth/auth.middleware.js";
import { uploadProfileAssets } from "../../config/multer.js";

const router = express.Router();

router.get(
  "/me",
  protect,
  getCurrentUser
);

router.put(
  "/me",
  protect,
  (req, res, next) => {
    req.uploadFolder = "uploads/avatars";
    next();
  },
  uploadProfileAssets.fields([
    { name: "avatar", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  updateCurrentUser
);

export default router;
