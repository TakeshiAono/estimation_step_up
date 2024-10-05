-- CreateTable
CREATE TABLE "Setting" (
    "id" SERIAL NOT NULL,
    "start_business_time" TIMESTAMP(3) NOT NULL DEFAULT '2024-01-01 10:00:00 +09:00',
    "end_business_time" TIMESTAMP(3) NOT NULL DEFAULT '2024-01-01 10:00:00 +09:00',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);
