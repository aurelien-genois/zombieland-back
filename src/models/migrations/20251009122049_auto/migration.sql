/*
  Warnings:

  - Added the required column `qr_code` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" ADD COLUMN     "qr_code" TEXT NOT NULL;
