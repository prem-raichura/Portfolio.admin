import express from "express";

import {
  getBin,
  restoreItem,
  permanentlyDeleteItem,
} from "./bin.controller.js";

import {
  protect,
} from "../../shared/middleware/auth/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getBin);
router.post("/restore", protect, restoreItem);
router.delete("/:type/:id", protect, permanentlyDeleteItem);

export default router;
