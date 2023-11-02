-- DropForeignKey
ALTER TABLE "Child" DROP CONSTRAINT "Child_roomId_fkey";

-- AlterTable
ALTER TABLE "Child" ALTER COLUMN "roomId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
