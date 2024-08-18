/*
  Warnings:

  - A unique constraint covering the columns `[task_id]` on the table `Achievement` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Achievement_task_id_key" ON "Achievement"("task_id");
