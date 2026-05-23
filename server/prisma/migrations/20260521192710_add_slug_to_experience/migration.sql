/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Experience` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Experience` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "slug" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Experience_slug_key" ON "Experience"("slug");
