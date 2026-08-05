/*
  Warnings:

  - You are about to drop the `Commentary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Commentary" DROP CONSTRAINT "Commentary_userId_fkey";

-- DropForeignKey
ALTER TABLE "Commentary" DROP CONSTRAINT "Commentary_voteId_fkey";

-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "commentary" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "Commentary";
