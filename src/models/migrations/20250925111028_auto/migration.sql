/*
  Warnings:

  - You are about to drop the column `current_price` on the `order_line` table. All the data in the column will be lost.
  - You are about to drop the column `ticket_code` on the `order_line` table. All the data in the column will be lost.
  - Added the required column `ticket_code` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_price` to the `order_line` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."order_line_ticket_code_idx";

-- AlterTable
ALTER TABLE "public"."order" ADD COLUMN     "ticket_code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."order_line" DROP COLUMN "current_price",
DROP COLUMN "ticket_code",
ADD COLUMN     "unit_price" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE INDEX "order_ticket_code_idx" ON "public"."order"("ticket_code");
