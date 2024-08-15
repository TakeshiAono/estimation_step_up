/*
  Warnings:

  - You are about to drop the column `first_time_required` on the `Plan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "first_time_required",
ADD COLUMN     "required_time_of_first" TIMESTAMP(3);
