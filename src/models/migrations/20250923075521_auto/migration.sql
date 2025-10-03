-- CreateTable
CREATE TABLE "public"."user_rate_activity" (
    "grade" INTEGER NOT NULL,
    "comment" TEXT,
    "user_id" INTEGER NOT NULL,
    "activity_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_rate_activity_pkey" PRIMARY KEY ("user_id","activity_id")
);

-- CreateIndex
CREATE INDEX "activity_name_idx" ON "public"."activity"("name");

-- CreateIndex
CREATE INDEX "activity_category_id_idx" ON "public"."activity"("category_id");

-- CreateIndex
CREATE INDEX "activity_minimum_age_idx" ON "public"."activity"("minimum_age");

-- CreateIndex
CREATE INDEX "activity_disabled_access_idx" ON "public"."activity"("disabled_access");

-- CreateIndex
CREATE INDEX "activity_high_intensity_idx" ON "public"."activity"("high_intensity");

-- AddForeignKey
ALTER TABLE "public"."user_rate_activity" ADD CONSTRAINT "user_rate_activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_rate_activity" ADD CONSTRAINT "user_rate_activity_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "public"."activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
