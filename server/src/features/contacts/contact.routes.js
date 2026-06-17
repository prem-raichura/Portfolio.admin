import express from "express";

import {
  getContacts,
  getSingleContact,
  deleteContact,
} from "./contact.controller.js";

import {
  protect,
} from "../../shared/middleware/auth/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getContacts);
router.get("/:id", protect, getSingleContact);
router.delete("/:id", protect, deleteContact);

export default router;
