-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_ticket_id_fkey";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "ticket_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
