import express from "express";

import {
  getPublicPortfolio,
} from "../controllers/public.controller.js";

import {
  validateApiKey,
} from "../middleware/apiKey.middleware.js";

const router = express.Router();

router.get(
  "/",
  validateApiKey,
  getPublicPortfolio
);

export default router;