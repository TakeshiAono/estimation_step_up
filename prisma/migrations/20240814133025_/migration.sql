/*
  Warnings:

  - You are about to drop the column `investigation_time` on the `Achievement` table. All the data in the column will be lost.
  - You are about to drop the column `investigation_detail` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `prediction_investigation_time_of_first` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `prediction_investigation_time_of_second` on the `Plan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Achievement" DROP COLUMN "investigation_time",
ADD COLUMN     "survey_time" INTEGER;

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "investigation_detail",
DROP COLUMN "prediction_investigation_time_of_first",
DROP COLUMN "prediction_investigation_time_of_second",
ADD COLUMN     "prediction_survey_time_of_first" TIMESTAMP(3),
ADD COLUMN     "prediction_survey_time_of_second" TIMESTAMP(3),
ADD COLUMN     "survey_detail" TEXT;
