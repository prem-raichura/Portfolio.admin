import express from "express";

import { getCurrentUser } from "../controllers/user.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/me",
  protect,
  getCurrentUser
);

export default router;