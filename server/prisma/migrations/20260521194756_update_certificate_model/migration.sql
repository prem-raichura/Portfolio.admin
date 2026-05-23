/*
  Warnings:

  - You are about to drop the column `image_url` on the `Certificates` table. All the data in the column will be lost.
  - Added the required column `type` to the `Certificates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Certificates" DROP COLUMN "image_url",
ADD COLUMN     "images" JSONB,
ADD COLUMN     "type" VARCHAR(100) NOT NULL;
