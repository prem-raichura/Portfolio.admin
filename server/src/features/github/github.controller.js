import crypto from "crypto";

import { prisma } from "../../config/db.js";
import { redis } from "../../config/redis.js";
import cloudinary from "../../config/cloudinary.js";

import { activeWhere } from "../../shared/utils/softDelete.js";

/* =========================================
    GITHUB CONFIG
========================================= */

const githubAuthorizeUrl = "https://github.com/login/oauth/authorize";
const githubTokenUrl = "https://github.com/login/oauth/access_token";
const githubApiUrl = "https://api.github.com";

// The repo scope is what makes private repos visible for import. The login
// flow only asks for `read:user user:email`, so this is a separate consent.
const importScope = "repo read:user";

// Redis keys. The connect state is short-lived and maps the OAuth roundtrip
// back to the app user; the access token is cached per user with a 1h TTL and
// is never returned to the browser.
const connectStateKey = (state) => `github:connect:${state}`;
const importTokenKey = (userId) => `github:token:${userId}`;

const CONNECT_STATE_TTL = 10 * 60; // 10 minutes
const IMPORT_TOKEN_TTL = 60 * 60; // 1 hour

/* =========================================
    URL HELPERS
========================================= */

const getServerUrl = () =>
  process.env.SERVER_URL || `http://localhost:${process.env.PORT || 8000}`;

const getClientUrl = () => process.env.CLIENT_URL || "http://localhost:5173";

const getConnectRedirectUri = () =>
  `${getServerUrl()}/api/github/connect/callback`;

/* =========================================
    GITHUB API HELPERS (mirror auth.controller)
========================================= */

const exchangeCodeForToken = async (code) => {
  const response = await fetch(githubTokenUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: getConnectRedirectUri(),
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || "GitHub token exchange failed");
  }

  return data.access_token;
};

const githubRequest = async (path, accessToken) => {
  const response = await fetch(`${githubApiUrl}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    const error = new Error("GitHub request failed");
    error.status = response.status;
    throw error;
  }

  return response.json();
};

/* =========================================
    MAPPING HELPERS
========================================= */

const createSlug = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

// Find a slug that is not already taken by an active project of this user.
const getAvailableSlug = async (base, userId) => {
  const root = base || "project";
  let slug = root;
  let counter = 2;

  // eslint-disable-next-line no-await-in-loop
  while (
    await prisma.projects.findFirst({
      where: activeWhere({ slug, user_id: userId }),
    })
  ) {
    slug = `${root}-${counter}`;
    counter += 1;
  }

  return slug;
};

// Trim a full GitHub repo object down to what the modal renders.
const toRepoSummary = (repo) => ({
  id: repo.id,
  name: repo.name,
  full_name: repo.full_name,
  description: repo.description,
  html_url: repo.html_url,
  homepage: repo.homepage,
  topics: Array.isArray(repo.topics) ? repo.topics : [],
  language: repo.language,
  private: repo.private,
  archived: repo.archived,
  stargazers_count: repo.stargazers_count,
  updated_at: repo.updated_at,
});

// Upload the repo's GitHub OpenGraph social image as the project thumbnail.
// Returns null on any failure so import still succeeds without a thumbnail.
const uploadRepoThumbnail = async (fullName) => {
  try {
    const result = await cloudinary.uploader.upload(
      `https://opengraph.githubassets.com/1/${fullName}`,
      {
        folder: "projects",
        resource_type: "image",
      }
    );
    return result.secure_url;
  } catch (error) {
    console.error("[GitHub import] thumbnail upload failed:", error?.message);
    return null;
  }
};

/* =========================================
    CONNECT — start OAuth (repo scope)
========================================= */

export const connectGithub = async (req, res) => {
  try {
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "GitHub OAuth not configured",
      });
    }

    const userId = req.user.userId;
    const state = crypto.randomBytes(24).toString("hex");

    // Tie the OAuth state to this user so the (unauthenticated) callback can
    // recover who is importing without relying on a cookie surviving the
    // cross-site redirect.
    await redis.set(connectStateKey(state), String(userId), {
      EX: CONNECT_STATE_TTL,
    });

    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: getConnectRedirectUri(),
      scope: importScope,
      state,
      allow_signup: "false",
    });

    return res.status(200).json({
      success: true,
      authUrl: `${githubAuthorizeUrl}?${params.toString()}`,
    });
  } catch (error) {
    console.error("[GitHub connect] failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to start GitHub connection",
    });
  }
};

/* =========================================
    CONNECT CALLBACK — cache repo-scope token
========================================= */

export const githubConnectCallback = async (req, res) => {
  const redirectBack = (status) =>
    res.redirect(`${getClientUrl()}/projects?github=${status}`);

  try {
    const { code, state } = req.query;

    if (!code || !state) {
      return redirectBack("error");
    }

    const userId = await redis.get(connectStateKey(state));

    // One-time use: drop the state whether or not it matched.
    await redis.del(connectStateKey(state));

    if (!userId) {
      return redirectBack("error");
    }

    const accessToken = await exchangeCodeForToken(code);

    await redis.set(importTokenKey(userId), accessToken, {
      EX: IMPORT_TOKEN_TTL,
    });

    return redirectBack("connected");
  } catch (error) {
    console.error("[GitHub connect callback] failed:", error);
    return redirectBack("error");
  }
};

/* =========================================
    LIST REPOS
========================================= */

export const listRepos = async (req, res) => {
  try {
    const userId = req.user.userId;
    const accessToken = await redis.get(importTokenKey(userId));

    if (!accessToken) {
      return res.status(200).json({ success: true, connected: false });
    }

    // Pull up to ~200 of the most recently updated repos across owned,
    // collaborator and org-member relationships (repo scope covers private).
    const repos = [];
    const perPage = 100;
    const maxPages = 2;

    for (let page = 1; page <= maxPages; page += 1) {
      // eslint-disable-next-line no-await-in-loop
      const pageRepos = await githubRequest(
        `/user/repos?per_page=${perPage}&sort=updated&page=${page}&affiliation=owner,collaborator,organization_member`,
        accessToken
      );

      repos.push(...pageRepos);

      if (pageRepos.length < perPage) {
        break;
      }
    }

    return res.status(200).json({
      success: true,
      connected: true,
      repos: repos.map(toRepoSummary),
    });
  } catch (error) {
    console.error("[GitHub list repos] failed:", error?.message);

    // A revoked/expired token surfaces as 401 — clear it and ask the user to
    // reconnect rather than showing a hard error.
    if (error?.status === 401) {
      await redis.del(importTokenKey(req.user.userId));
      return res.status(200).json({ success: true, connected: false });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch GitHub repositories",
    });
  }
};

/* =========================================
    IMPORT REPO — create a project from a repo
========================================= */

export const importRepo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { full_name } = req.body;

    if (!full_name) {
      return res.status(400).json({
        success: false,
        message: "Repository full_name is required",
      });
    }

    const accessToken = await redis.get(importTokenKey(userId));

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        connected: false,
        message: "GitHub not connected",
      });
    }

    // Re-fetch fresh repo data server-side rather than trusting the client.
    const repo = await githubRequest(`/repos/${full_name}`, accessToken);

    const slug = await getAvailableSlug(createSlug(repo.name), userId);

    const tags = Array.isArray(repo.topics) ? [...repo.topics] : [];
    if (repo.language && !tags.includes(repo.language)) {
      tags.push(repo.language);
    }

    const links = [{ key: "github", value: repo.html_url }];
    if (repo.homepage) {
      links.push({ key: "live", value: repo.homepage });
    }

    const thumbnail = await uploadRepoThumbnail(repo.full_name);

    const project = await prisma.projects.create({
      data: {
        user_id: userId,
        title: repo.name,
        slug,
        authors_contributors: [],
        description: repo.description ?? "",
        publisher: null,
        status: repo.archived ? "completed" : "ongoing",
        tags,
        links,
        thumbnail,
        featured: false,
        type: "project",
        date_time: new Date(repo.pushed_at ?? repo.created_at),
      },
    });

    await redis.del(`portfolio:${userId}`);

    return res.status(201).json({
      success: true,
      message: "Project imported from GitHub",
      project,
    });
  } catch (error) {
    console.error("[GitHub import repo] failed:", error?.message);

    if (error?.status === 401) {
      await redis.del(importTokenKey(req.user.userId));
      return res.status(401).json({
        success: false,
        connected: false,
        message: "GitHub session expired, reconnect and try again",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to import repository",
    });
  }
};
