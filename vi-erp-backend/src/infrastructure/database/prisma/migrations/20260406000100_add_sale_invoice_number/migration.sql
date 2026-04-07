-- Add invoice number field to sales
ALTER TABLE "Sale"
ADD COLUMN IF NOT EXISTS "invoiceNumber" TEXT;

-- Backfill existing sales with deterministic correlatives based on id
UPDATE "Sale"
SET "invoiceNumber" = CONCAT('FAC-', LPAD("id"::TEXT, 8, '0'))
WHERE "invoiceNumber" IS NULL;

ALTER TABLE "Sale"
ALTER COLUMN "invoiceNumber" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "Sale_invoiceNumber_key"
ON "Sale"("invoiceNumber");

-- Default invoice settings (configurable later from Configuration UI)
INSERT INTO "Setting" ("key", "name", "value", "description", "group", "isActive", "createdAt", "updatedAt")
VALUES
  ('FACTURA_PREFIJO', 'Prefijo de factura', 'FAC-', 'Prefijo del numero de factura', 'FACTURA', true, NOW(), NOW()),
  ('FACTURA_LONGITUD', 'Longitud de correlativo', '8', 'Cantidad de digitos del correlativo', 'FACTURA', true, NOW(), NOW()),
  ('FACTURA_CORRELATIVO_ACTUAL', 'Correlativo actual', '0', 'Ultimo correlativo generado para factura', 'FACTURA', true, NOW(), NOW())
ON CONFLICT ("key") DO NOTHING;
