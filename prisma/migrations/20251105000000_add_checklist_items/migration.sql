-- CreateEnum
CREATE TYPE "public"."ActivityStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'DONE');

-- CreateTable
CREATE TABLE "public"."ChecklistItem" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "activity" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" "public"."ActivityStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "remarks" TEXT NOT NULL DEFAULT 'nil',
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ChecklistItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ChecklistItem" ADD CONSTRAINT "ChecklistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
