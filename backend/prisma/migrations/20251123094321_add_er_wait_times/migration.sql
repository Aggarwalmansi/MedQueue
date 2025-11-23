-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('WAITING', 'CALLED', 'COMPLETED', 'EXPIRED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Hospital" ADD COLUMN     "erWaitTimes" JSONB;

-- CreateTable
CREATE TABLE "VirtualQueueEntry" (
    "id" SERIAL NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "patientName" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "checkInTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "QueueStatus" NOT NULL DEFAULT 'WAITING',
    "userId" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VirtualQueueEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VirtualQueueEntry" ADD CONSTRAINT "VirtualQueueEntry_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
