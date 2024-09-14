/*
  Warnings:

  - You are about to drop the column `operated_terms_json` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "operated_terms_json",
ADD COLUMN     "operated_terms_json_for_time_bar_chart" JSONB;
