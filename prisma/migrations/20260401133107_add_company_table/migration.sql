-- AlterTable
ALTER TABLE "notices" ADD COLUMN     "companySlug" TEXT;

-- CreateTable
CREATE TABLE "Company" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" TEXT,
    "sector" TEXT,
    "hqCity" TEXT,
    "hqState" TEXT,
    "employeeCount" INTEGER,
    "description" TEXT,
    "careersUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("slug")
);

-- AddForeignKey
ALTER TABLE "notices" ADD CONSTRAINT "notices_companySlug_fkey" FOREIGN KEY ("companySlug") REFERENCES "Company"("slug") ON DELETE SET NULL ON UPDATE CASCADE;
