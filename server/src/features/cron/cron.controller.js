import { prisma } from "../../config/db.js";

/* =========================================
    CONFIG (lifted from bin.worker.js)
========================================= */

const PURGE_AFTER_DAYS = 30;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const SOFT_DELETE_MODELS = [
  { name: "projects", model: prisma.projects },
  { name: "experience", model: prisma.experience },
  { name: "certificates", model: prisma.certificates },
  { name: "apiKeys", model: prisma.aPI },
  { name: "contacts", model: prisma.contact },
];

/* =========================================
    PURGE EXPIRED REFRESH TOKENS
    (was tokens.worker.js → purgeExpiredTokens)
========================================= */

export const purgeTokens = async (req, res) => {
  try {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        expires_at: { lt: new Date() },
      },
    });

    console.log(
      `[Token Cleanup] Purged ${result.count} expired refresh token(s)`
    );

    return res.json({ success: true, deleted: result.count });
  } catch (err) {
    console.error("[Token Cleanup] failed", err);
    return res.status(500).json({ success: false, error: "purge failed" });
  }
};

/* =========================================
    PURGE OLD BIN ITEMS
    (was bin.worker.js → purgeOldBinItems)
========================================= */

export const purgeBin = async (req, res) => {
  try {
    const cutoff = new Date(Date.now() - PURGE_AFTER_DAYS * MS_PER_DAY);

    const counts = {};

    for (const { name, model } of SOFT_DELETE_MODELS) {
      const result = await model.deleteMany({
        where: {
          deleted_at: { lt: cutoff, not: null },
        },
      });

      counts[name] = result.count;
    }

    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

    console.log(
      `[Bin Purge] Removed ${total} item(s) older than ${PURGE_AFTER_DAYS} days — ${JSON.stringify(
        counts
      )}`
    );

    return res.json({ success: true, deleted: total, counts });
  } catch (err) {
    console.error("[Bin Purge] failed", err);
    return res.status(500).json({ success: false, error: "purge failed" });
  }
};
