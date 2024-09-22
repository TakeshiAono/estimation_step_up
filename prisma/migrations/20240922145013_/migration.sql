/*
  Warnings:

  - You are about to drop the column `calculated_done_date` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `deadline_date` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "calculated_done_date",
DROP COLUMN "deadline_date";

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "calculated_done_date" TIMESTAMP(3),
ADD COLUMN     "deadline_date" TIMESTAMP(3);
