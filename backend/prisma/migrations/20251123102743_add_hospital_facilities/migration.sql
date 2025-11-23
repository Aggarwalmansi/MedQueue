-- AlterTable
ALTER TABLE "Hospital" ADD COLUMN     "accreditations" JSONB,
ADD COLUMN     "criticalCare" JSONB,
ADD COLUMN     "diagnostics" JSONB,
ADD COLUMN     "profileCompleteness" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "specializations" JSONB,
ADD COLUMN     "supportServices" JSONB;
