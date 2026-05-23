import { Worker } from "bullmq";

import {
  queueConnection,
} from "../config/queue.js";

import { prisma } from "../config/db.js";

const analyticsWorker =
  new Worker(
    "analyticsQueue",

    async (job) => {

      const {
        user_id,
      } = job.data;

      let dashboard =
        await prisma.dashboard.findUnique({
          where: {
            user_id,
          },
        });

      if (!dashboard) {

        dashboard =
          await prisma.dashboard.create({
            data: {
              user_id,
            },
          });
      }

      switch (job.name) {

        case "trackPortfolioVisit":

          await prisma.dashboard.update({
            where: {
              user_id,
            },
            data: {
              total_visit: {
                increment: 1,
              },
            },
          });

          console.log(
            `Portfolio visit tracked for user ${user_id}`
          );

          break;

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

          console.log(
            `Github click tracked for user ${user_id}`
          );

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

          console.log(
            `Live demo click tracked for user ${user_id}`
          );

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

          console.log(
            `Resume download tracked for user ${user_id}`
          );

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

          console.log(
            `Project click tracked for user ${user_id}`
          );

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

          console.log(
            `Contact submission tracked for user ${user_id}`
          );

          break;

        default:

          console.log(
            `Unknown analytics job: ${job.name}`
          );
      }
    },

    {
      connection:
        queueConnection,
    }
  );

analyticsWorker.on(
  "completed",
  (job) => {

    console.log(
      `Job ${job.id} completed`
    );
  }
);

analyticsWorker.on(
  "failed",
  (job, err) => {

    console.log(
      `Job ${job?.id} failed`
    );

    console.log(err);
  }
);

console.log(
  "Analytics Worker Started"
);