INSERT INTO "Setting" ("key", "name", "value", "description", "group", "isActive", "createdAt", "updatedAt")
VALUES
  ('EMPRESA_RTN', 'RTN de empresa', '', 'RTN fiscal del negocio', 'EMPRESA', true, NOW(), NOW()),
  ('FACTURA_CAI', 'CAI', '', 'Codigo de autorizacion fiscal vigente', 'FACTURA', true, NOW(), NOW()),
  ('FACTURA_RANGO_DESDE', 'Rango autorizado desde', '', 'Correlativo inicial autorizado por SAR', 'FACTURA', true, NOW(), NOW()),
  ('FACTURA_RANGO_HASTA', 'Rango autorizado hasta', '', 'Correlativo final autorizado por SAR', 'FACTURA', true, NOW(), NOW()),
  ('FACTURA_FECHA_LIMITE', 'Fecha limite fiscal', '', 'Fecha limite de emision del CAI (YYYY-MM-DD)', 'FACTURA', true, NOW(), NOW()),
  ('FACTURA_FORMATO', 'Formato de impresion', 'TICKET', 'Formato de salida: TICKET o PDF', 'FACTURA', true, NOW(), NOW())
ON CONFLICT ("key") DO NOTHING;
