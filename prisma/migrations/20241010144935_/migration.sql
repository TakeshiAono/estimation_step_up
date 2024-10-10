/*
  Warnings:

  - You are about to drop the column `isNofied` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `isNofied` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "isNofied",
ADD COLUMN     "isNotified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "isNofied",
ADD COLUMN     "isNotified" BOOLEAN NOT NULL DEFAULT false;
