/*
  Warnings:

  - You are about to drop the column `apiId` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `coffeeId` to the `Favorite` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Favorite" DROP CONSTRAINT "Favorite_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Favorite" DROP COLUMN "apiId",
DROP COLUMN "title",
DROP COLUMN "userId",
ADD COLUMN     "coffeeId" INTEGER NOT NULL,
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "createdAt";

-- CreateTable
CREATE TABLE "public"."Coffee" (
    "id" SERIAL NOT NULL,
    "apiId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Coffee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coffee_apiId_key" ON "public"."Coffee"("apiId");

-- AddForeignKey
ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_coffeeId_fkey" FOREIGN KEY ("coffeeId") REFERENCES "public"."Coffee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
