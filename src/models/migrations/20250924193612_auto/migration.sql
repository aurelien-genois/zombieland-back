-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('pending', 'confirmed', 'canceled', 'refund');

-- CreateTable
CREATE TABLE "public"."order" (
    "id" SERIAL NOT NULL,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'pending',
    "order_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visit_date" TIMESTAMP(3) NOT NULL,
    "vat" DECIMAL(4,2) NOT NULL,
    "payment_method" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_line" (
    "id" SERIAL NOT NULL,
    "line_total_price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "ticket_code" TEXT NOT NULL,
    "product_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_line_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "order_user_id_idx" ON "public"."order"("user_id");

-- CreateIndex
CREATE INDEX "order_status_idx" ON "public"."order"("status");

-- CreateIndex
CREATE INDEX "order_order_date_idx" ON "public"."order"("order_date");

-- CreateIndex
CREATE INDEX "order_visit_date_idx" ON "public"."order"("visit_date");

-- CreateIndex
CREATE INDEX "order_line_order_id_idx" ON "public"."order_line"("order_id");

-- CreateIndex
CREATE INDEX "order_line_product_id_idx" ON "public"."order_line"("product_id");

-- CreateIndex
CREATE INDEX "order_line_ticket_code_idx" ON "public"."order_line"("ticket_code");

-- AddForeignKey
ALTER TABLE "public"."order" ADD CONSTRAINT "order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_line" ADD CONSTRAINT "order_line_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_line" ADD CONSTRAINT "order_line_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
