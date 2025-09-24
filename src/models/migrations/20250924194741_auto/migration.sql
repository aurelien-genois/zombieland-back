/*
  Warnings:

  - You are about to drop the column `line_total_price` on the `order_line` table. All the data in the column will be lost.
  - Added the required column `selling_price` to the `order_line` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."order_line" DROP COLUMN "line_total_price",
ADD COLUMN     "selling_price" DOUBLE PRECISION NOT NULL;
