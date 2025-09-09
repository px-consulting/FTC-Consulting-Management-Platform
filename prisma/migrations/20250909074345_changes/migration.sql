-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "annualRevenue" INTEGER,
ADD COLUMN     "businessChallenges" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "manufacturing" BOOLEAN;
