/*
  Warnings:

  - You are about to drop the `Evaluation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_institutionId_fkey";

-- AlterTable
ALTER TABLE "Institution" ADD COLUMN     "level" TEXT NOT NULL DEFAULT 'University';

-- DropTable
DROP TABLE "Evaluation";

-- CreateIndex
CREATE INDEX "Institution_level_idx" ON "Institution"("level");
