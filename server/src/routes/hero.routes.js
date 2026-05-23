import express from "express";

import {
  createOrUpdateHero,
  getHero,
  deleteHero,
} from "../controllers/hero.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  createOrUpdateHero
);

router.get(
  "/",
  protect,
  getHero
);

router.delete(
  "/",
  protect,
  deleteHero
);

export default router;