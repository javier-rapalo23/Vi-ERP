-- AlterTable
ALTER TABLE "InventoryTransaction" ADD COLUMN "reference" VARCHAR(255) NOT NULL DEFAULT 'MANUAL',
ADD COLUMN "referenceId" INTEGER,
ADD COLUMN "userId" INTEGER,
ADD COLUMN "costPerUnit" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "description" TEXT,
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "InventoryTransaction_productId_idx" ON "InventoryTransaction"("productId");
CREATE INDEX "InventoryTransaction_date_idx" ON "InventoryTransaction"("date");
CREATE INDEX "InventoryTransaction_reference_idx" ON "InventoryTransaction"("reference");
CREATE INDEX "InventoryTransaction_productId_date_idx" ON "InventoryTransaction"("productId", "date");
