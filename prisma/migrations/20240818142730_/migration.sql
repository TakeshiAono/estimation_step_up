/*
  Warnings:

  - The `prediction_required_time_of_final` column on the `Plan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `prediction_required_time_of_first` column on the `Plan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `prediction_survey_time_of_first` column on the `Plan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `prediction_survey_time_of_second` column on the `Plan` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "prediction_required_time_of_final",
ADD COLUMN     "prediction_required_time_of_final" INTEGER,
DROP COLUMN "prediction_required_time_of_first",
ADD COLUMN     "prediction_required_time_of_first" INTEGER,
DROP COLUMN "prediction_survey_time_of_first",
ADD COLUMN     "prediction_survey_time_of_first" INTEGER,
DROP COLUMN "prediction_survey_time_of_second",
ADD COLUMN     "prediction_survey_time_of_second" INTEGER;
