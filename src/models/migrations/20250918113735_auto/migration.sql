/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `activity` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."activity" ADD COLUMN     "high_intensity" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "activity_slug_key" ON "public"."activity"("slug");
