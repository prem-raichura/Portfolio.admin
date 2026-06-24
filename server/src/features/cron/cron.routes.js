import express from "express";
import { purgeTokens, purgeBin } from "./cron.controller.js";

const router = express.Router();

/* =========================================
    CRON AUTH GUARD
    Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`
    when the CRON_SECRET env var is set. Reject anything else
    so these purge endpoints can't be hit publicly.
========================================= */

const verifyCron = (req, res, next) => {
  const secret = process.env.CRON_SECRET;

  // If no secret configured, refuse rather than run unprotected.
  if (!secret) {
    return res.status(503).json({ success: false, error: "CRON_SECRET not set" });
  }

  if (req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ success: false, error: "unauthorized" });
  }

  return next();
};

router.get("/purge-tokens", verifyCron, purgeTokens);
router.get("/purge-bin", verifyCron, purgeBin);

export default router;
