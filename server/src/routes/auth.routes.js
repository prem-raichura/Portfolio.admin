import express from "express";

import {
  registerUser,
  loginUser,
} from "../controllers/auth.controller.js";

import {
  authLimiter,
} from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  registerUser
);

router.post(
  "/login",
  authLimiter,
  loginUser
);

export default router;