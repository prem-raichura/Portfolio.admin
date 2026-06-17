import { prisma } from "../../config/db.js";

import {
  activeWhere,
  softDelete,
} from "../../shared/utils/softDelete.js";

/**
 * GET /api/contacts
 *
 * Lists every contact submission the authenticated user owns, newest first.
 * Soft-deleted rows live in the Bin and are filtered out by activeWhere.
 */
export const getContacts = async (req, res) => {
  try {
    const userId = req.user.userId;

    const contacts =
      await prisma.contact.findMany({
        where: activeWhere({
          user_id: userId,
        }),
        orderBy: {
          created_at: "desc",
        },
      });

    return res.status(200).json({
      success: true,
      contacts,
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
 * GET /api/contacts/:id
 *
 * Returns one contact and auto-marks it as read on the way out. The
 * client only needs to call this — the server handles the side effect.
 */
export const getSingleContact = async (req, res) => {
  try {
    const userId = req.user.userId;
    const contactId = parseInt(req.params.id, 10);

    if (!Number.isFinite(contactId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact id",
      });
    }

    const contact =
      await prisma.contact.findFirst({
        where: activeWhere({
          id: contactId,
          user_id: userId,
        }),
      });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    // Side effect: flip is_read once the admin actually opens the detail.
    // Skip the write when it's already read so we don't bump updated_at
    // (Contact doesn't have updated_at, but the principle stands).
    if (!contact.is_read) {
      const updated =
        await prisma.contact.update({
          where: {
            id: contact.id,
          },
          data: {
            is_read: true,
          },
        });

      return res.status(200).json({
        success: true,
        contact: updated,
      });
    }

    return res.status(200).json({
      success: true,
      contact,
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
 * DELETE /api/contacts/:id
 *
 * Soft delete — sends the row to the Bin, where it stays for 30 days
 * before the auto-purge worker removes it for good.
 */
export const deleteContact = async (req, res) => {
  try {
    const userId = req.user.userId;
    const contactId = parseInt(req.params.id, 10);

    if (!Number.isFinite(contactId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact id",
      });
    }

    const existing =
      await prisma.contact.findFirst({
        where: activeWhere({
          id: contactId,
          user_id: userId,
        }),
      });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    await softDelete(prisma.contact, {
      id: existing.id,
    });

    return res.status(200).json({
      success: true,
      message: "Contact moved to Bin",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
