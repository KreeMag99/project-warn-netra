-- AlterTable
ALTER TABLE "notices" ADD COLUMN     "reason" TEXT,
ADD COLUMN     "sector" TEXT,
ALTER COLUMN "status" SET DEFAULT 'completed';

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "alertType" TEXT NOT NULL,
    "alertValue" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_email_alertType_alertValue_key" ON "Subscription"("email", "alertType", "alertValue");
