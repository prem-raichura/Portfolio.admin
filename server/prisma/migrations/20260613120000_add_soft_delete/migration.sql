-- Soft delete: add `deleted_at` to every user-content table and replace
-- the existing (user_id, slug) unique constraints with PARTIAL unique
-- indexes that only apply to rows where deleted_at IS NULL. This lets a
-- user reuse a slug after the previous row has been soft-deleted.

-- ── 1. Add deleted_at columns ────────────────────────────────────────────
ALTER TABLE "Projects"     ADD COLUMN "deleted_at" TIMESTAMP(3);
ALTER TABLE "Experience"   ADD COLUMN "deleted_at" TIMESTAMP(3);
ALTER TABLE "Certificates" ADD COLUMN "deleted_at" TIMESTAMP(3);
ALTER TABLE "API"          ADD COLUMN "deleted_at" TIMESTAMP(3);

-- ── 2. Helper indexes on (user_id, deleted_at) ───────────────────────────
CREATE INDEX "Projects_user_id_deleted_at_idx"
  ON "Projects"("user_id", "deleted_at");

CREATE INDEX "Experience_user_id_deleted_at_idx"
  ON "Experience"("user_id", "deleted_at");

CREATE INDEX "Certificates_user_id_deleted_at_idx"
  ON "Certificates"("user_id", "deleted_at");

CREATE INDEX "API_user_id_deleted_at_idx"
  ON "API"("user_id", "deleted_at");

-- ── 3. Drop the full (user_id, slug) unique constraints ──────────────────
DROP INDEX IF EXISTS "Projects_user_id_slug_key";
DROP INDEX IF EXISTS "Experience_user_id_slug_key";
DROP INDEX IF EXISTS "Certificates_user_id_slug_key";

-- ── 4. Add partial unique indexes that only cover live (non-deleted) rows ─
CREATE UNIQUE INDEX "Projects_user_id_slug_active_key"
  ON "Projects"("user_id", "slug")
  WHERE "deleted_at" IS NULL;

CREATE UNIQUE INDEX "Experience_user_id_slug_active_key"
  ON "Experience"("user_id", "slug")
  WHERE "deleted_at" IS NULL;

CREATE UNIQUE INDEX "Certificates_user_id_slug_active_key"
  ON "Certificates"("user_id", "slug")
  WHERE "deleted_at" IS NULL;
