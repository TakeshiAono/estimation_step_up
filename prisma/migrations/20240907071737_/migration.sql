/*
  Warnings:

  - You are about to drop the `Histories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Histories" DROP CONSTRAINT "Histories_achivement_id_fkey";

-- DropTable
DROP TABLE "Histories";

-- CreateTable
CREATE TABLE "History" (
    "id" SERIAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "achivement_id" INTEGER NOT NULL,
    "survey_time" INTEGER,
    "operating_time" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "History_achivement_id_key" ON "History"("achivement_id");

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_achivement_id_fkey" FOREIGN KEY ("achivement_id") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
