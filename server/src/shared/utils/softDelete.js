/**
 * Soft-delete primitives.
 *
 * Every user-owned entity (Projects, Experience, Certificates, API) carries
 * a `deleted_at` column. A `null` value means the row is live; a timestamp
 * means it lives only in the Bin until either restored or purged.
 *
 * Use these helpers in feature controllers so the rule is applied uniformly.
 */

/**
 * Merge `deleted_at: null` into a where clause so soft-deleted rows are
 * excluded from the query.
 *
 *   prisma.projects.findMany({ where: activeWhere({ user_id }) })
 */
export const activeWhere = (extra = {}) => ({
  deleted_at: null,
  ...extra,
});

/**
 * Soft delete: stamps `deleted_at` with the current time.
 *
 *   await softDelete(prisma.projects, { id });
 */
export const softDelete = (model, where) =>
  model.update({
    where,
    data: {
      deleted_at: new Date(),
    },
  });

/**
 * Restore: clears `deleted_at`, pulling the row out of the Bin.
 *
 *   await restore(prisma.projects, { id });
 */
export const restore = (model, where) =>
  model.update({
    where,
    data: {
      deleted_at: null,
    },
  });
