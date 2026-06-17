-- Soft delete for the Contact model: same pattern as Projects/Experience/
-- Certificates/API, but Contact has no slug so no partial unique index is
-- needed — just the column and the helper index.

ALTER TABLE "Contact" ADD COLUMN "deleted_at" TIMESTAMP(3);

CREATE INDEX "Contact_user_id_deleted_at_idx"
  ON "Contact"("user_id", "deleted_at");
