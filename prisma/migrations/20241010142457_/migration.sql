-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "isNofied" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "isNofied" BOOLEAN NOT NULL DEFAULT false;
