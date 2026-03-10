-- CreateTable
CREATE TABLE "Setting" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "group" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");

-- Seed default settings
INSERT INTO "Setting" ("key", "name", "value", "description", "group", "isActive", "updatedAt") VALUES
  ('EMPRESA_NOMBRE',    'Nombre del negocio',      'Mi Negocio',              'Nombre que aparece en facturas y reportes',   'EMPRESA',   true, NOW()),
  ('EMPRESA_RUC',       'RUC / NIT',               '',                        'Identificación fiscal',                      'EMPRESA',   true, NOW()),
  ('EMPRESA_DIRECCION', 'Dirección',               '',                        'Dirección del negocio',                      'EMPRESA',   true, NOW()),
  ('EMPRESA_TELEFONO',  'Teléfono',                '',                        'Teléfono de contacto',                       'EMPRESA',   true, NOW()),
  ('EMPRESA_EMAIL',     'Email',                   '',                        'Email de contacto',                          'EMPRESA',   true, NOW()),
  ('MONEDA_NOMBRE',     'Nombre de moneda',        'Dólar',                   'Nombre completo de la moneda local',         'MONEDA',    true, NOW()),
  ('MONEDA_SIMBOLO',    'Símbolo de moneda',       '$',                       'Símbolo que se muestra en precios',          'MONEDA',    true, NOW()),
  ('IMPUESTO_NOMBRE',   'Nombre del impuesto',     'IVA',                     'Nombre del impuesto (IVA, ISV, ITBIS, etc)', 'IMPUESTO',  true, NOW()),
  ('IMPUESTO_TASA',     'Tasa de impuesto (%)',    '0',                       'Porcentaje de impuesto aplicado',            'IMPUESTO',  true, NOW()),
  ('FACTURA_PREFIJO',   'Prefijo de factura',      'FAC-',                    'Prefijo para numeración de facturas',        'FACTURA',   true, NOW()),
  ('SESION_DURACION',   'Duración de sesión (h)',  '8',                       'Horas de duración de la sesión activa',      'SISTEMA',   true, NOW());
