-- ============================================
-- Vi-ERP - Script de Inicialización de Base de Datos
-- ============================================

-- 1. Crear la base de datos (ejecutar como superusuario de PostgreSQL)
CREATE DATABASE vi_erp;

-- 2. Conectarse a la base de datos
\c vi_erp

-- ============================================
-- Datos de ejemplo
-- ============================================
-- Nota: Primero debes ejecutar las migraciones de Prisma:
-- npx prisma migrate dev --name init
-- Luego puedes ejecutar este script para agregar datos de prueba

-- Insertar clientes de ejemplo
INSERT INTO "Cliente" (nombre, telefono, email) VALUES
('Juan Pérez', '555-0101', 'juan.perez@email.com'),
('María González', '555-0102', 'maria.gonzalez@email.com'),
('Carlos Rodríguez', '555-0103', 'carlos.rodriguez@email.com'),
('Ana Martínez', '555-0104', 'ana.martinez@email.com'),
('Luis Fernández', '555-0105', 'luis.fernandez@email.com');

-- Insertar productos de ejemplo
INSERT INTO "Producto" (nombre, codigo, precio, costo, stock) VALUES
('Laptop Dell XPS 13', 'LAP-001', 1299.99, 899.99, 15),
('Mouse Logitech MX Master', 'MOU-001', 99.99, 59.99, 50),
('Teclado Mecánico Keychron K2', 'TEC-001', 89.99, 54.99, 30),
('Monitor LG 27 4K', 'MON-001', 449.99, 299.99, 10),
('Webcam Logitech C920', 'WEB-001', 79.99, 49.99, 25),
('Auriculares Sony WH-1000XM4', 'AUR-001', 349.99, 249.99, 20),
('Disco SSD Samsung 1TB', 'SSD-001', 109.99, 74.99, 40),
('RAM Corsair 16GB DDR4', 'RAM-001', 79.99, 54.99, 35),
('Cable HDMI 2.1', 'CAB-001', 19.99, 9.99, 100),
('Hub USB-C Anker', 'HUB-001', 49.99, 29.99, 45);

-- Verificar los datos insertados
SELECT * FROM "Cliente";
SELECT * FROM "Producto";

-- ============================================
-- Consultas útiles para verificar el estado
-- ============================================

-- Ver todas las ventas con sus detalles
SELECT 
  v.id as venta_id,
  v.fecha,
  c.nombre as cliente,
  v.total,
  COUNT(vd.id) as cantidad_items
FROM "Venta" v
JOIN "Cliente" c ON v."clienteId" = c.id
LEFT JOIN "VentaDetalle" vd ON vd."ventaId" = v.id
GROUP BY v.id, v.fecha, c.nombre, v.total
ORDER BY v.fecha DESC;

-- Ver stock de productos
SELECT 
  nombre,
  codigo,
  stock,
  precio,
  CASE 
    WHEN stock < 10 THEN '⚠️ Stock bajo'
    WHEN stock < 20 THEN '⚡ Stock medio'
    ELSE '✅ Stock bueno'
  END as estado_stock
FROM "Producto"
ORDER BY stock ASC;

-- Ver ventas por cliente
SELECT 
  c.nombre,
  c.email,
  COUNT(v.id) as total_ventas,
  COALESCE(SUM(v.total), 0) as monto_total
FROM "Cliente" c
LEFT JOIN "Venta" v ON v."clienteId" = c.id
GROUP BY c.id, c.nombre, c.email
ORDER BY monto_total DESC;

-- Productos más vendidos
SELECT 
  p.nombre,
  p.codigo,
  SUM(vd.cantidad) as cantidad_vendida,
  SUM(vd.cantidad * vd."precioUnit") as ingresos_totales
FROM "Producto" p
LEFT JOIN "VentaDetalle" vd ON vd."productoId" = p.id
GROUP BY p.id, p.nombre, p.codigo
ORDER BY cantidad_vendida DESC;
