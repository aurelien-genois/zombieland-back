-- AlterTable
ALTER TABLE "public"."activity" ADD COLUMN     "high_intensity" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."user" ALTER COLUMN "is_active" SET DEFAULT false;
