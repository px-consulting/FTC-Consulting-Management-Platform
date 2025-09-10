-- DropForeignKey
ALTER TABLE "public"."ChecklistItem" DROP CONSTRAINT "ChecklistItem_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."ChecklistItem" ADD CONSTRAINT "ChecklistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
