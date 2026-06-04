import crypto from "crypto";

import {
  analyticsQueue,
} from "../../jobs/analytics/analytics.queue.js";

function parseDeviceInfo(userAgent = "") {
  const ua = userAgent.toLowerCase();

  const device_type =
    /mobile|iphone|android/.test(ua)
      ? "mobile"
      : /ipad|tablet/.test(ua)
        ? "tablet"
        : "desktop";

  let browser = "unknown";
  if (ua.includes("edg/")) browser = "edge";
  else if (ua.includes("chrome/")) browser = "chrome";
  else if (ua.includes("firefox/")) browser = "firefox";
  else if (ua.includes("safari/")) browser = "safari";

  let os = "unknown";
  if (ua.includes("windows")) os = "windows";
  else if (ua.includes("mac os") || ua.includes("macintosh")) os = "macos";
  else if (ua.includes("android")) os = "android";
  else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ios")) os = "ios";
  else if (ua.includes("linux")) os = "linux";

  return { device_type, browser, os };
}

function getCountry(req) {
  const headerCountry =
    req.headers["x-vercel-ip-country"] ||
    req.headers["cf-ipcountry"] ||
    req.headers["x-country"];

  if (!headerCountry) return null;

  const value = String(headerCountry).trim();
  return value ? value.toUpperCase() : null;
}

function buildTrackingMeta(req, extra = {}) {
  const userAgent = req.headers["user-agent"] || "";
  const country = getCountry(req);
  const referrer = req.headers.referer || req.headers.referrer || null;
  const ip_address =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    req.ip ||
    null;

  return {
    session_id: req.body.session_id || crypto.randomUUID(),
    visitor_id: req.body.visitor_id || null,
    path: req.body.path || req.originalUrl || null,
    referrer,
    source: req.body.source || (referrer ? "referral" : "direct"),
    country,
    ip_address,
    user_agent: userAgent,
    ...parseDeviceInfo(userAgent),
    ...extra,
  };
}

export const trackGithubClick = async (req, res) => {
  try {
    const user = req.apiUser;

    await analyticsQueue.add(
      "githubClick",
      {
        user_id: user.id,
        ...buildTrackingMeta(req, {
          project_id: req.body.project_id || null,
          project_slug: req.body.project_slug || null,
          metadata: req.body.metadata || null,
        }),
      },
      {
        attempts: 3,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Github click tracked",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const trackLiveDemoClick = async (req, res) => {
  try {
    const user = req.apiUser;

    await analyticsQueue.add(
      "liveDemoClick",
      {
        user_id: user.id,
        ...buildTrackingMeta(req, {
          project_id: req.body.project_id || null,
          project_slug: req.body.project_slug || null,
          metadata: req.body.metadata || null,
        }),
      },
      {
        attempts: 3,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Live demo click tracked",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const trackResumeDownload = async (req, res) => {
  try {
    const user = req.apiUser;

    await analyticsQueue.add(
      "resumeDownload",
      {
        user_id: user.id,
        ...buildTrackingMeta(req, {
          metadata: req.body.metadata || null,
        }),
      },
      {
        attempts: 3,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Resume download tracked",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const trackProjectClick = async (req, res) => {
  try {
    const user = req.apiUser;

    await analyticsQueue.add(
      "projectClick",
      {
        user_id: user.id,
        ...buildTrackingMeta(req, {
          project_id: req.body.project_id || null,
          project_slug: req.body.project_slug || null,
          metadata: req.body.metadata || null,
        }),
      },
      {
        attempts: 3,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Project click tracked",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const trackContactSubmission = async (req, res) => {
  try {
    const user = req.apiUser;

    await analyticsQueue.add(
      "contactSubmission",
      {
        user_id: user.id,
        ...buildTrackingMeta(req, {
          metadata: req.body.metadata || null,
        }),
      },
      {
        attempts: 3,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Contact submission tracked",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
