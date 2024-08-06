/*
  Warnings:

  - You are about to drop the column `parentId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `ticketId` on the `Task` table. All the data in the column will be lost.
  - Added the required column `ticket_id` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_ticketId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "parentId",
DROP COLUMN "ticketId",
ADD COLUMN     "parent_id" INTEGER,
ADD COLUMN     "ticket_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
