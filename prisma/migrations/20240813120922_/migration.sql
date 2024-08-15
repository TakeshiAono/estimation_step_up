/*
  Warnings:

  - You are about to drop the column `first_investigation_time` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `investigated_time` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `last_investigation_time` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `required_time_of_first` on the `Plan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Achievement" ADD COLUMN     "investigation_time" INTEGER,
ADD COLUMN     "isDone" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "first_investigation_time",
DROP COLUMN "investigated_time",
DROP COLUMN "last_investigation_time",
DROP COLUMN "required_time_of_first",
ADD COLUMN     "investigation_detail" TEXT,
ADD COLUMN     "prediction_investigation_time_of_first" TIMESTAMP(3),
ADD COLUMN     "prediction_investigation_time_of_second" TIMESTAMP(3),
ADD COLUMN     "prediction_required_time_of_final" TIMESTAMP(3),
ADD COLUMN     "prediction_required_time_of_first" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "isSurveyTask" BOOLEAN NOT NULL DEFAULT true;
