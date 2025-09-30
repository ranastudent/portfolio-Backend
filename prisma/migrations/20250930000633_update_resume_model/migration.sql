/*
  Warnings:

  - You are about to drop the column `contactInfo` on the `Resume` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Resume` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contact` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `designation` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projects` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Resume" DROP CONSTRAINT "Resume_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Resume" DROP COLUMN "contactInfo",
ADD COLUMN     "contact" TEXT NOT NULL,
ADD COLUMN     "designation" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "projects" JSONB NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Resume_userId_key" ON "public"."Resume"("userId");

-- AddForeignKey
ALTER TABLE "public"."Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
