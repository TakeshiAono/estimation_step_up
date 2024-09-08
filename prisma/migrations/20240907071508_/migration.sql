-- CreateTable
CREATE TABLE "Histories" (
    "id" SERIAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "achivement_id" INTEGER NOT NULL,
    "survey_time" INTEGER,
    "operating_time" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Histories_achivement_id_key" ON "Histories"("achivement_id");

-- AddForeignKey
ALTER TABLE "Histories" ADD CONSTRAINT "Histories_achivement_id_fkey" FOREIGN KEY ("achivement_id") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
