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

/* =========================================
    PUBLIC PORTFOLIO SHAPE
    Maps the raw DB record to the friendly shape the portfolio + docs expect.
========================================= */

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

// Projects/experiences store links as [{ key, value }]. The portfolio wants an
// object; the "live" demo link is also exposed as `demo`.
function linksArrayToObject(links) {
  if (!Array.isArray(links)) return {};

  const out = {};
  for (const link of links) {
    if (!link || !link.key || !link.value) continue;
    out[link.key] = link.value;
    if (link.key === "live") out.demo = link.value;
  }
  return out;
}

// Skills may be a legacy flat string[] or the grouped [{category, items}] shape.
// Always return grouped so the portfolio can render titled sections.
function normalizeSkills(skills) {
  if (!Array.isArray(skills) || skills.length === 0) return [];

  if (typeof skills[0] === "object" && skills[0] !== null) {
    return skills
      .filter((group) => group && (group.category || Array.isArray(group.items)))
      .map((group) => ({
        category: group.category || "General",
        items: toArray(group.items),
      }));
  }

  return [{ category: "General", items: skills.filter(Boolean) }];
}

function buildPublicPortfolio(record) {
  return {
    profile: {
      name: record.name,
      username: record.username,
      headline: record.headline,
      bio: record.bio,
      avatar: record.avatar,
      resume: record.resume,
      skills: normalizeSkills(record.skills),
      links:
        record.users_links && typeof record.users_links === "object"
          ? record.users_links
          : {},
    },
    projects: toArray(record.projects).map((project) => ({
      title: project.title,
      slug: project.slug,
      description: project.description,
      type: project.type,
      status: project.status,
      featured: project.featured,
      thumbnail: project.thumbnail,
      publisher: project.publisher,
      authors: toArray(project.authors_contributors),
      date: project.date_time,
      techStack: toArray(project.tags),
      links: linksArrayToObject(project.links),
    })),
    experience: toArray(record.experiences).map((exp) => ({
      company: exp.company,
      role: exp.title,
      slug: exp.slug,
      description: exp.description,
      location: exp.location,
      mode: exp.mode,
      images: toArray(exp.images),
      startDate: exp.start_date,
      endDate: exp.end_date,
      isCurrent: exp.is_current,
      links: linksArrayToObject(exp.links),
    })),
    certificates: toArray(record.certificates).map((cert) => ({
      title: cert.title,
      slug: cert.slug,
      type: cert.type,
      issuer: cert.issued_by,
      url: cert.link,
      linkedin: cert.linkedin,
      images: toArray(cert.images),
      issueDate: cert.issue_date,
    })),
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

    const record = await prisma.user.findUnique({
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
        resume: true,
        users_links: true,
        skills: true,
        // Soft-deleted (binned) rows must never reach the public site.
        projects: {
          where: { deleted_at: null },
          orderBy: {
            created_at: "desc",
          },
        },
        experiences: {
          where: { deleted_at: null },
          orderBy: {
            start_date: "desc",
          },
        },
        // Also hide certificates the user explicitly archived.
        certificates: {
          where: { deleted_at: null, archive_status: { not: "archived" } },
          orderBy: {
            created_at: "desc",
          },
        },
      },
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    const portfolio = buildPublicPortfolio(record);

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
