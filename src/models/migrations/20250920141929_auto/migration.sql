/*
  Warnings:

  - The values [user] on the enum `RoleName` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."RoleName_new" AS ENUM ('admin', 'member');
ALTER TABLE "public"."Role" ALTER COLUMN "name" DROP DEFAULT;
ALTER TABLE "public"."Role" ALTER COLUMN "name" TYPE "public"."RoleName_new" USING ("name"::text::"public"."RoleName_new");
ALTER TYPE "public"."RoleName" RENAME TO "RoleName_old";
ALTER TYPE "public"."RoleName_new" RENAME TO "RoleName";
DROP TYPE "public"."RoleName_old";
ALTER TABLE "public"."Role" ALTER COLUMN "name" SET DEFAULT 'member';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Role" ALTER COLUMN "name" SET DEFAULT 'member';

-- AlterTable
ALTER TABLE "public"."user" ALTER COLUMN "phone" DROP NOT NULL;
