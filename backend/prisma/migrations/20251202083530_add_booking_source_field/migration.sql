-- CreateEnum
CREATE TYPE "BookingSource" AS ENUM ('TRIAGE', 'CALENDAR', 'WALK_IN');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Status" ADD VALUE 'SCHEDULED';
ALTER TYPE "Status" ADD VALUE 'COMPLETED';
ALTER TYPE "Status" ADD VALUE 'NO_SHOW';

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "appointmentTime" TIMESTAMP(3),
ADD COLUMN     "source" "BookingSource" NOT NULL DEFAULT 'TRIAGE';
