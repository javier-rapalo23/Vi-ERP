-- AlterTable
ALTER TABLE "Product" ADD COLUMN "minStock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "lastSaleDate" TIMESTAMP(3);

-- CreateIndex for better query performance on alerts
CREATE INDEX "Product_stock_minStock_isActive_idx" ON "Product"("stock", "minStock", "isActive");
CREATE INDEX "Product_lastSaleDate_isActive_idx" ON "Product"("lastSaleDate", "isActive");
