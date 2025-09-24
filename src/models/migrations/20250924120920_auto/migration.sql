-- CreateEnum
CREATE TYPE "public"."ProductStatus" AS ENUM ('published', 'draft');

-- AlterTable
ALTER TABLE "public"."product" ADD COLUMN     "status" "public"."ProductStatus" NOT NULL DEFAULT 'draft';
