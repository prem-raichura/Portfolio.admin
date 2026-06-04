import "dotenv/config";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const countries = ["US", "IN", "GB", "CA", "DE", "AU", "SG", "AE", "FR", "NL"];
const sources = ["direct", "organic", "referral", "social", "email"];
const devices = [
  { device_type: "desktop", browser: "chrome", os: "windows" },
  { device_type: "mobile", browser: "safari", os: "ios" },
  { device_type: "mobile", browser: "chrome", os: "android" },
  { device_type: "tablet", browser: "safari", os: "ios" },
  { device_type: "desktop", browser: "firefox", os: "linux" },
];
const eventTypes = [
  "github_click",
  "live_demo_click",
  "resume_download",
  "project_click",
  "contact_submission",
];

function pick(list, index) {
  return list[index % list.length];
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDateWithinDays(daysBack = 30) {
  const now = Date.now();
  const offset = randomBetween(0, daysBack * 24 * 60 * 60 * 1000);
  return new Date(now - offset);
}

async function main() {
  const user = await prisma.user.findFirst({
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      username: true,
    },
  });

  if (!user) {
    throw new Error("No user found to seed dashboard data for.");
  }

  const projects = await prisma.projects.findMany({
    where: {
      user_id: user.id,
    },
    select: {
      id: true,
      slug: true,
      title: true,
    },
    take: 5,
  });

  await prisma.$executeRaw`
    DELETE FROM "DashboardAnalytics"
    WHERE "user_id" = ${user.id}
      AND "metadata"->>'seed' = 'dummy-dashboard'
  `;

  await prisma.$executeRaw`
    DELETE FROM "VisitorSession"
    WHERE "user_id" = ${user.id}
      AND "visitor_id" LIKE ${`dummy-${user.id}-%`}
  `;

  const visitorCount = 30;
  const portfolioVisits = 45;
  const extraEvents = 55;
  const totalEvents = portfolioVisits + extraEvents;

  const sessions = [];
  const analytics = [];

  for (let i = 0; i < visitorCount; i += 1) {
    const country = pick(countries, i);
    const source = pick(sources, i);
    const device = pick(devices, i);
    const visitor_id = `dummy-${user.id}-visitor-${i + 1}`;
    const session_id = `dummy-${user.id}-session-${i + 1}`;
    const first_seen = randomDateWithinDays(30);
    const last_seen = new Date(first_seen.getTime() + randomBetween(1, 6) * 60 * 60 * 1000);

    sessions.push({
      user_id: user.id,
      visitor_id,
      session_id,
      source,
      country,
      device_type: device.device_type,
      browser: device.browser,
      os: device.os,
      first_seen,
      last_seen,
    });
  }

  const visitSessions = sessions.slice(0, portfolioVisits);

  visitSessions.forEach((session, index) => {
    const created_at = new Date(
      session.first_seen.getTime() + randomBetween(5, 120) * 60 * 1000
    );

    analytics.push({
      user_id: user.id,
      type: "portfolio_visit",
      session_id: session.session_id,
      visitor_id: session.visitor_id,
      path: "/",
      referrer: session.source === "direct" ? null : `https://${session.source}.example.com`,
      source: session.source,
      country: session.country,
      device_type: session.device_type,
      browser: session.browser,
      os: session.os,
      project_id: null,
      project_slug: null,
      user_agent: `${session.browser}/${session.os} dummy`,
      ip_address: `10.0.${index % 5}.${index + 10}`,
      metadata: {
        seed: "dummy-dashboard",
        kind: "portfolio_visit",
      },
      created_at,
    });
  });

  for (let i = 0; i < extraEvents; i += 1) {
    const session = pick(visitSessions, i);
    const type = pick(eventTypes, i);
    const project = projects.length ? pick(projects, i) : null;
    const created_at = new Date(
      session.first_seen.getTime() + randomBetween(10, 7 * 24 * 60) * 60 * 1000
    );

    analytics.push({
      user_id: user.id,
      type,
      session_id: session.session_id,
      visitor_id: session.visitor_id,
      path:
        type === "resume_download"
          ? "/resume"
          : type === "contact_submission"
            ? "/contact"
            : project
              ? `/projects/${project.slug || project.id}`
              : "/",
      referrer: session.source === "direct" ? null : `https://${session.source}.example.com`,
      source: session.source,
      country: session.country,
      device_type: session.device_type,
      browser: session.browser,
      os: session.os,
      project_id: type === "project_click" && project ? project.id : null,
      project_slug: type === "project_click" && project ? project.slug : null,
      user_agent: `${session.browser}/${session.os} dummy`,
      ip_address: `10.0.${i % 5}.${i + 50}`,
      metadata: {
        seed: "dummy-dashboard",
        kind: type,
      },
      created_at,
    });
  }

  await prisma.$transaction([
    prisma.dashboard.upsert({
      where: {
        user_id: user.id,
      },
      create: {
        user_id: user.id,
        total_visit: 45,
        unique_visitor: visitorCount,
        github_clicks: analytics.filter((item) => item.type === "github_click").length,
        live_demo_clicks: analytics.filter((item) => item.type === "live_demo_click").length,
        resume_download: analytics.filter((item) => item.type === "resume_download").length,
        project_clicks: analytics.filter((item) => item.type === "project_click").length,
        contact_submissions: analytics.filter((item) => item.type === "contact_submission").length,
      },
      update: {
        total_visit: 45,
        unique_visitor: visitorCount,
        github_clicks: analytics.filter((item) => item.type === "github_click").length,
        live_demo_clicks: analytics.filter((item) => item.type === "live_demo_click").length,
        resume_download: analytics.filter((item) => item.type === "resume_download").length,
        project_clicks: analytics.filter((item) => item.type === "project_click").length,
        contact_submissions: analytics.filter((item) => item.type === "contact_submission").length,
      },
    }),
    prisma.visitorSession.createMany({
      data: sessions,
      skipDuplicates: true,
    }),
    prisma.dashboardAnalytics.createMany({
      data: analytics,
    }),
  ]);

  console.log(
    `Seeded ${visitorCount} visitor sessions and ${totalEvents} dashboard analytics rows for user ${user.id} (${user.username || "no username"})`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
