import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";

import {
  apiLimiter,
  writeLimiter,
} from "./shared/middleware/rateLimit/rateLimit.middleware.js";

import {
  apiGateway,
} from "./shared/middleware/gateway/apiGateway.middleware.js";

import {
  securityMiddleware,
} from "./config/security.js";

import tokenRoutes from "./features/tokens/token.routes.js";

import healthRoutes from "./features/health/health.routes.js";
import authRoutes from "./features/auth/auth.routes.js";
import userRoutes from "./features/users/user.routes.js";
import projectRoutes from "./features/projects/project.routes.js";
import experienceRoutes from "./features/experience/experience.routes.js";
import certificateRoutes from "./features/certificates/certificate.routes.js";
import publicRoutes from "./features/public/public.routes.js";
import apiRoutes from "./features/apiKeys/apiKey.routes.js";
import dashboardRoutes from "./features/dashboard/dashboard.routes.js";
import analyticsRoutes from "./features/analytics/analytics.routes.js";
import logsRoutes from "./features/logs/logs.routes.js";
import binRoutes from "./features/bin/bin.routes.js";
import contactRoutes from "./features/contacts/contact.routes.js";
import cronRoutes from "./features/cron/cron.routes.js";


dotenv.config();

// BullMQ workers need an always-on process. Run them only off-Vercel
// (local / Docker / always-on host). On Vercel, scheduled cleanup runs via
// Vercel Cron → /api/cron/* (see vercel.json) instead.
if (!process.env.VERCEL) {
  await import("./jobs/analytics/analytics.worker.js");
  await import("./jobs/logs/logs.worker.js");
  await import("./jobs/tokens/tokens.worker.js");
  await import("./jobs/bin/bin.worker.js");
}

const app = express();

// Behind Vercel's proxy — needed so req.ip / rate-limit see the real client IP.
app.set("trust proxy", 1);

securityMiddleware(app);

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use(cookieParser());

app.use(apiLimiter);
app.use(writeLimiter);

app.use(apiGateway);

app.use(
  "/uploads",

  express.static(
    path.join(
      process.cwd(),
      "uploads"
    )
  )
);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Portfolio SaaS API Running",
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/keys", apiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/token", tokenRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/bin", binRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/cron", cronRoutes);

const PORT = process.env.PORT || 8000;

// Vercel provides its own listener — only listen when running as a real process.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
