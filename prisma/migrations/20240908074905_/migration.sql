/*
  Warnings:

  - You are about to drop the column `operating_time` on the `Achievement` table. All the data in the column will be lost.
  - You are about to drop the column `survey_time` on the `Achievement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Achievement" DROP COLUMN "operating_time",
DROP COLUMN "survey_time";
