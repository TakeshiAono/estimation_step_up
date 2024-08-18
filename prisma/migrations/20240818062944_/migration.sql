/*
  Warnings:

  - A unique constraint covering the columns `[task_id]` on the table `Check` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[task_id]` on the table `Feedback` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[task_id]` on the table `Plan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Check_task_id_key" ON "Check"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_task_id_key" ON "Feedback"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_task_id_key" ON "Plan"("task_id");
