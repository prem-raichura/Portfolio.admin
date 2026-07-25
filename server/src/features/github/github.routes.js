import express from "express";

import {
  connectGithub,
  githubConnectCallback,
  listRepos,
  importRepo,
} from "./github.controller.js";

import { protect } from "../../shared/middleware/auth/auth.middleware.js";

const router = express.Router();

// Start the repo-scope OAuth flow. Called via axios (bearer attached) so it
// returns the authorize URL rather than issuing a redirect itself.
router.get("/connect", protect, connectGithub);

// GitHub redirects the browser here after consent — no auth header, the user
// is recovered from the OAuth state stored in Redis.
router.get("/connect/callback", githubConnectCallback);

router.get("/repos", protect, listRepos);

router.post("/import", protect, importRepo);

export default router;
