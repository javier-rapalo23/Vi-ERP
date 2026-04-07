-- AlterTable
ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS "barcode" TEXT;

-- Create unique index only for non-null barcodes
CREATE UNIQUE INDEX IF NOT EXISTS "Product_barcode_key"
ON "Product"("barcode")
WHERE "barcode" IS NOT NULL;
