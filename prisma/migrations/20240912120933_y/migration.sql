/*
  Warnings:

  - You are about to drop the column `operated_terms_json` on the `Plan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "operated_terms_json";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "operated_terms_json" JSONB;
