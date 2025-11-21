/*
  Warnings:

  - The values [USER,HOSPITAL_MANAGER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Booking` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bedId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `bedType` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Booking` table. All the data in the column will be lost.
  - The `id` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Hospital` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `contactPhone` on the `Hospital` table. All the data in the column will be lost.
  - The `id` column on the `Hospital` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hospitalId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpiry` on the `User` table. All the data in the column will be lost.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Bed` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[managerId]` on the table `Hospital` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `condition` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientName` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `userId` on the `Booking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `hospitalId` on the `Booking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `city` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `managerId` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('INCOMING', 'ADMITTED', 'DIVERTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MODERATE', 'CRITICAL');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('PATIENT', 'HOSPITAL', 'ADMIN');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'PATIENT';
COMMIT;

-- DropForeignKey
ALTER TABLE "Bed" DROP CONSTRAINT "Bed_hospitalId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_bedId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_hospitalId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_hospitalId_fkey";

-- DropIndex
DROP INDEX "Booking_hospitalId_idx";

-- DropIndex
DROP INDEX "Booking_status_idx";

-- DropIndex
DROP INDEX "Booking_userId_idx";

-- DropIndex
DROP INDEX "Hospital_name_idx";

-- DropIndex
DROP INDEX "User_resetToken_key";

-- AlterTable
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_pkey",
DROP COLUMN "bedId",
DROP COLUMN "bedType",
DROP COLUMN "updatedAt",
ADD COLUMN     "condition" TEXT NOT NULL,
ADD COLUMN     "patientName" TEXT NOT NULL,
ADD COLUMN     "severity" "Severity" NOT NULL DEFAULT 'MODERATE',
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "hospitalId",
ADD COLUMN     "hospitalId" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'INCOMING',
ADD CONSTRAINT "Booking_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Hospital" DROP CONSTRAINT "Hospital_pkey",
DROP COLUMN "contactPhone",
ADD COLUMN     "bedsGeneral" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bedsICU" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bedsOxygen" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "doctorsActive" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "managerId" INTEGER NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "hospitalId",
DROP COLUMN "resetToken",
DROP COLUMN "resetTokenExpiry",
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'PATIENT',
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Bed";

-- DropEnum
DROP TYPE "BedStatus";

-- DropEnum
DROP TYPE "BedType";

-- DropEnum
DROP TYPE "BookingStatus";

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_managerId_key" ON "Hospital"("managerId");

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
