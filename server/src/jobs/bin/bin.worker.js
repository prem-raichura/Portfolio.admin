import { Worker } from "bullmq";

import {
  queueConnection,
} from "../../config/queue.js";

import { prisma } from "../../config/db.js";

import { binQueue } from "./bin.queue.js";

/* =========================================
    CONFIG
========================================= */

// Items soft-deleted longer ago than this are hard-deleted by the cron.
const PURGE_AFTER_DAYS = 30;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const SOFT_DELETE_MODELS = [
  { name: "projects",     model: prisma.projects },
  { name: "experience",   model: prisma.experience },
  { name: "certificates", model: prisma.certificates },
  { name: "apiKeys",      model: prisma.aPI },
];

/* =========================================
    WORKER
========================================= */

const binWorker =
  new Worker(
    "binQueue",

    async (job) => {

      /* =====================
          PURGE OLD BIN (cron)
      ===================== */

      if (job.name === "purgeOldBinItems") {

        const cutoff =
          new Date(Date.now() - PURGE_AFTER_DAYS * MS_PER_DAY);

        const counts = {};

        for (const { name, model } of SOFT_DELETE_MODELS) {
          const result =
            await model.deleteMany({
              where: {
                deleted_at: {
                  lt: cutoff,
                  not: null,
                },
              },
            });

          counts[name] = result.count;
        }

        const total =
          Object.values(counts).reduce((sum, n) => sum + n, 0);

        console.log(
          `[Bin Purge] Removed ${total} item(s) older than ${PURGE_AFTER_DAYS} days — ${JSON.stringify(counts)}`
        );

        return { deleted: total, counts };
      }
    },

    {
      connection:
        queueConnection,
    }
  );

/* =========================================
    EVENTS
========================================= */

binWorker.on(
  "completed",
  (job, result) => {
    console.log(
      `[Bin Purge] Job ${job.id} completed — deleted: ${result?.deleted ?? 0}`
    );
  }
);

binWorker.on(
  "failed",
  (job, err) => {
    console.error(
      `[Bin Purge] Job ${job?.id} failed`
    );
    console.error(err);
  }
);

/* =========================================
    SCHEDULE DAILY CRON
    Runs every day at 03:30 server time
========================================= */

binQueue.add(
  "purgeOldBinItems",
  {},
  {
    repeat: {
      pattern: "30 3 * * *",
    },
    jobId: "purgeOldBinItems-cron",
  }
);

console.log("[Bin Purge] Daily purge cron scheduled (3:30 AM)");
