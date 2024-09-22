/*
  Warnings:

  - You are about to drop the column `deadline_date` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "deadline_date",
ADD COLUMN     "deadline" TIMESTAMP(3);
