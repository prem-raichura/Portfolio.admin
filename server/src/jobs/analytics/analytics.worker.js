import { Worker } from "bullmq";

import {
  queueConnection,
} from "../../config/queue.js";

import { prisma } from "../../config/db.js";

async function ensureVisitorSession(data) {
  const {
    user_id,
    visitor_id,
    session_id,
    source,
    country,
    device_type,
    browser,
    os,
  } = data;

  if (!visitor_id) {
    return false;
  }

  const existing = await prisma.visitorSession.findUnique({
    where: {
      user_id_visitor_id: {
        user_id,
        visitor_id,
      },
    },
  });

  if (existing) {
    await prisma.visitorSession.update({
      where: {
        user_id_visitor_id: {
          user_id,
          visitor_id,
        },
      },
      data: {
        session_id,
        source,
        country,
        device_type,
        browser,
        os,
        last_seen: new Date(),
      },
    });

    return false;
  }

  await prisma.visitorSession.create({
    data: {
      user_id,
      visitor_id,
      session_id,
      source,
      country,
      device_type,
      browser,
      os,
    },
  });

  return true;
}

async function createAnalyticsEntry(data, type) {
  const {
    user_id,
    session_id,
    visitor_id,
    path,
    referrer,
    source,
    country,
    device_type,
    browser,
    os,
    project_id,
    project_slug,
    user_agent,
    ip_address,
    metadata,
  } = data;

  await prisma.dashboardAnalytics.create({
    data: {
      user_id,
      type,
      session_id: session_id || null,
      visitor_id: visitor_id || null,
      path: path || null,
      referrer: referrer || null,
      source: source || null,
      country: country || null,
      device_type: device_type || null,
      browser: browser || null,
      os: os || null,
      project_id: project_id || null,
      project_slug: project_slug || null,
      user_agent: user_agent || null,
      ip_address: ip_address || null,
      metadata: metadata || null,
    },
  });
}

const analyticsWorker = new Worker(
  "analyticsQueue",
  async (job) => {
    const data = job.data || {};
    const {
      user_id,
    } = data;

    if (!user_id) {
      return;
    }

    let dashboard = await prisma.dashboard.findUnique({
      where: {
        user_id,
      },
    });

    if (!dashboard) {
      dashboard = await prisma.dashboard.create({
        data: {
          user_id,
        },
      });
    }

    switch (job.name) {
      case "trackPortfolioVisit": {
        const isUnique = await ensureVisitorSession(data);

        await prisma.dashboard.update({
          where: {
            user_id,
          },
          data: {
            total_visit: {
              increment: 1,
            },
            unique_visitor: isUnique
              ? {
                  increment: 1,
                }
              : undefined,
          },
        });

        await createAnalyticsEntry(data, "portfolio_visit");

        console.log(`Portfolio visit tracked for user ${user_id}`);
        break;
      }

      case "githubClick":
        await prisma.dashboard.update({
          where: {
            user_id,
          },
          data: {
            github_clicks: {
              increment: 1,
            },
          },
        });

        await createAnalyticsEntry(data, "github_click");
        console.log(`Github click tracked for user ${user_id}`);
        break;

      case "liveDemoClick":
        await prisma.dashboard.update({
          where: {
            user_id,
          },
          data: {
            live_demo_clicks: {
              increment: 1,
            },
          },
        });

        await createAnalyticsEntry(data, "live_demo_click");
        console.log(`Live demo click tracked for user ${user_id}`);
        break;

      case "resumeDownload":
        await prisma.dashboard.update({
          where: {
            user_id,
          },
          data: {
            resume_download: {
              increment: 1,
            },
          },
        });

        await createAnalyticsEntry(data, "resume_download");
        console.log(`Resume download tracked for user ${user_id}`);
        break;

      case "projectClick":
        await prisma.dashboard.update({
          where: {
            user_id,
          },
          data: {
            project_clicks: {
              increment: 1,
            },
          },
        });

        await createAnalyticsEntry(data, "project_click");
        console.log(`Project click tracked for user ${user_id}`);
        break;

      case "contactSubmission":
        await prisma.dashboard.update({
          where: {
            user_id,
          },
          data: {
            contact_submissions: {
              increment: 1,
            },
          },
        });

        await createAnalyticsEntry(data, "contact_submission");
        console.log(`Contact submission tracked for user ${user_id}`);
        break;

      default:
        console.log(`Unknown analytics job: ${job.name}`);
    }
  },
  {
    connection: queueConnection,
  }
);

analyticsWorker.on("completed", (job) => {
  console.log(`Analytics Job ${job.id} completed`);
});

analyticsWorker.on("failed", (job, err) => {
  console.log(`Analytics Job ${job?.id} failed`);
  console.log(err);
});

console.log("Analytics Worker Started");
