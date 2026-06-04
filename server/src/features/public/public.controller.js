import crypto from "crypto";

import { prisma } from "../../config/db.js";

import { redis } from "../../config/redis.js";

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

function createVisitorId({ ip, userAgent, country, username }) {
  return crypto
    .createHash("sha256")
    .update([ip || "", userAgent || "", country || "", username || ""].join("|"))
    .digest("hex");
}

function getRequestMeta(req, user) {
  const userAgent = req.headers["user-agent"] || "";
  const country = getCountry(req);
  const referrer = req.headers.referer || req.headers.referrer || null;
  const ipAddress =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    req.ip ||
    null;
  const visitorId = createVisitorId({
    ip: ipAddress,
    userAgent,
    country,
    username: user.username,
  });

  return {
    session_id: crypto.randomUUID(),
    visitor_id: visitorId,
    country,
    referrer,
    ip_address: ipAddress,
    user_agent: userAgent,
    ...parseDeviceInfo(userAgent),
  };
}

export const getPublicPortfolio = async (req, res) => {
  try {
    const user = req.apiUser;
    const requestMeta = getRequestMeta(req, user);

    const cacheKey = `portfolio:${user.id}`;
    const cachedPortfolio = await redis.get(cacheKey);

    if (cachedPortfolio) {
      await analyticsQueue.add(
        "trackPortfolioVisit",
        {
          user_id: user.id,
          username: user.username,
          source: "redis-cache",
          path: req.originalUrl || "/",
          timestamp: new Date(),
          ...requestMeta,
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 2000,
          },
        }
      );

      return res.status(200).json({
        success: true,
        source: "redis-cache",
        portfolio: JSON.parse(cachedPortfolio),
      });
    }

    const portfolio = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        bio: true,
        headline: true,
        users_links: true,
        skills: true,
        projects: {
          orderBy: {
            created_at: "desc",
          },
        },
        experiences: {
          orderBy: {
            start_date: "desc",
          },
        },
        certificates: {
          orderBy: {
            created_at: "desc",
          },
        },
      },
    });

    await redis.set(cacheKey, JSON.stringify(portfolio), {
      EX: 3600,
    });

    await analyticsQueue.add(
      "trackPortfolioVisit",
      {
        user_id: user.id,
        username: user.username,
        source: requestMeta.referrer ? "referral" : "direct",
        path: req.originalUrl || "/",
        timestamp: new Date(),
        ...requestMeta,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      }
    );

    return res.status(200).json({
      success: true,
      source: "postgresql",
      portfolio,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
