-- Drop global slug uniqueness so different users can reuse the same slug.
DROP INDEX IF EXISTS "Projects_slug_key";
DROP INDEX IF EXISTS "Experience_slug_key";
DROP INDEX IF EXISTS "Certificates_slug_key";

-- Keep slugs unique only within a user's own records.
CREATE UNIQUE INDEX "Projects_user_id_slug_key" ON "Projects"("user_id", "slug");
CREATE UNIQUE INDEX "Experience_user_id_slug_key" ON "Experience"("user_id", "slug");
CREATE UNIQUE INDEX "Certificates_user_id_slug_key" ON "Certificates"("user_id", "slug");
