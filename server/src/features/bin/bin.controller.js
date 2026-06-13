import { prisma } from "../../config/db.js";
import { redis } from "../../config/redis.js";
import { restore } from "../../shared/utils/softDelete.js";

const BIN_PAGE_SIZE = 100;

const TYPE_HANDLERS = {
  project: {
    model: prisma.projects,
    select: {
      id: true,
      title: true,
      slug: true,
      type: true,
      thumbnail: true,
      deleted_at: true,
    },
    listKey: "projects",
  },
  experience: {
    model: prisma.experience,
    select: {
      id: true,
      title: true,
      slug: true,
      company: true,
      start_date: true,
      end_date: true,
      deleted_at: true,
    },
    listKey: "experience",
  },
  certificate: {
    model: prisma.certificates,
    select: {
      id: true,
      title: true,
      slug: true,
      type: true,
      issued_by: true,
      deleted_at: true,
    },
    listKey: "certificates",
  },
  apiKey: {
    model: prisma.aPI,
    select: {
      id: true,
      name: true,
      api_key: true,
      status: true,
      created_at: true,
      deleted_at: true,
    },
    listKey: "apiKeys",
  },
};

/**
 * GET /api/bin
 *
 * Returns every soft-deleted item the user owns, grouped by type. Each
 * group is sorted by `deleted_at desc` and capped at BIN_PAGE_SIZE.
 */
export const getBin = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [projects, experience, certificates, apiKeys] = await Promise.all(
      Object.values(TYPE_HANDLERS).map((handler) =>
        handler.model.findMany({
          where: {
            user_id: userId,
            deleted_at: { not: null },
          },
          orderBy: {
            deleted_at: "desc",
          },
          take: BIN_PAGE_SIZE,
          select: handler.select,
        })
      )
    );

    return res.status(200).json({
      success: true,
      bin: {
        projects,
        experience,
        certificates,
        apiKeys,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * POST /api/bin/restore  body: { type, id }
 *
 * Clears `deleted_at` for the row, putting it back into the active list.
 * API keys come back as "inactive" so the user reviews before reactivating.
 */
export const restoreItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type, id } = req.body || {};

    const handler = TYPE_HANDLERS[type];
    if (!handler) {
      return res.status(400).json({
        success: false,
        message: "Invalid bin item type",
      });
    }

    const parsedId = parseInt(id, 10);
    if (!Number.isFinite(parsedId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bin item id",
      });
    }

    const existing = await handler.model.findFirst({
      where: {
        id: parsedId,
        user_id: userId,
        deleted_at: { not: null },
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Bin item not found",
      });
    }

    // For projects/experience/certificates: if a live row already owns the
    // same slug, restoring would violate the partial unique index. Block
    // with a clear message so the user can rename the conflicting row.
    if (type !== "apiKey" && existing.slug) {
      const conflict = await handler.model.findFirst({
        where: {
          user_id: userId,
          slug: existing.slug,
          deleted_at: null,
        },
      });

      if (conflict) {
        return res.status(409).json({
          success: false,
          message:
            "Another item with the same slug exists. Rename it before restoring.",
        });
      }
    }

    if (type === "apiKey") {
      await handler.model.update({
        where: { id: existing.id },
        data: {
          deleted_at: null,
          status: "inactive",
        },
      });
    } else {
      await restore(handler.model, { id: existing.id });
    }

    if (type !== "apiKey") {
      await redis.del(`portfolio:${userId}`);
    }

    return res.status(200).json({
      success: true,
      message: "Item restored",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * DELETE /api/bin/:type/:id
 *
 * Permanent hard delete. Used by the "Delete forever" button and by the
 * auto-purge worker for items older than 30 days.
 */
export const permanentlyDeleteItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type } = req.params;

    const handler = TYPE_HANDLERS[type];
    if (!handler) {
      return res.status(400).json({
        success: false,
        message: "Invalid bin item type",
      });
    }

    const parsedId = parseInt(req.params.id, 10);
    if (!Number.isFinite(parsedId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bin item id",
      });
    }

    const existing = await handler.model.findFirst({
      where: {
        id: parsedId,
        user_id: userId,
        deleted_at: { not: null },
      },
      select: { id: true },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Bin item not found",
      });
    }

    await handler.model.delete({
      where: { id: existing.id },
    });

    return res.status(200).json({
      success: true,
      message: "Item permanently deleted",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
