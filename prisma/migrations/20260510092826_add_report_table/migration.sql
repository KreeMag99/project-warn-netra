-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "affected" INTEGER,
    "location" TEXT,
    "reason" TEXT,
    "sourceUrl" TEXT,
    "reporterRole" TEXT,
    "details" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);
