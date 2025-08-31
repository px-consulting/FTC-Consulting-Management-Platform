-- AlterTable
ALTER TABLE "public"."LearningModule" ADD COLUMN "file" BYTEA NOT NULL;
ALTER TABLE "public"."LearningModule" DROP COLUMN "fileUrl";
