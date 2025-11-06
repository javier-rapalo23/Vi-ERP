import { PrismaClient } from '../src/infrastructure/database/generated/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  await prisma.ventaDetalle.deleteMany();
  await prisma.venta.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.cliente.deleteMany();

  console.log('✅ Datos anteriores eliminados');

  // Crear clientes
  const clientes = await Promise.all([
    prisma.cliente.create({
      data: {
        nombre: 'Juan Pérez',
        telefono: '555-0101',
        email: 'juan.perez@email.com',
      },
    }),
    prisma.cliente.create({
      data: {
        nombre: 'María González',
        telefono: '555-0102',
        email: 'maria.gonzalez@email.com',
      },
    }),
    prisma.cliente.create({
      data: {
        nombre: 'Carlos Rodríguez',
        telefono: '555-0103',
        email: 'carlos.rodriguez@email.com',
      },
    }),
    prisma.cliente.create({
      data: {
        nombre: 'Ana Martínez',
        telefono: '555-0104',
        email: 'ana.martinez@email.com',
      },
    }),
    prisma.cliente.create({
      data: {
        nombre: 'Luis Fernández',
        telefono: '555-0105',
        email: 'luis.fernandez@email.com',
      },
    }),
  ]);

  console.log(`✅ ${clientes.length} clientes creados`);

  // Crear productos
  const productos = await Promise.all([
    prisma.producto.create({
      data: {
        nombre: 'Laptop Dell XPS 13',
        codigo: 'LAP-001',
        precio: 1299.99,
        costo: 899.99,
        stock: 15,
      },
    }),
    prisma.producto.create({
      data: {
        nombre: 'Mouse Logitech MX Master',
        codigo: 'MOU-001',
        precio: 99.99,
        costo: 59.99,
        stock: 50,
      },
    }),
    prisma.producto.create({
      data: {
        nombre: 'Teclado Mecánico Keychron K2',
        codigo: 'TEC-001',
        precio: 89.99,
        costo: 54.99,
        stock: 30,
      },
    }),
    prisma.producto.create({
      data: {
        nombre: 'Monitor LG 27 4K',
        codigo: 'MON-001',
        precio: 449.99,
        costo: 299.99,
        stock: 10,
      },
    }),
    prisma.producto.create({
      data: {
        nombre: 'Webcam Logitech C920',
        codigo: 'WEB-001',
        precio: 79.99,
        costo: 49.99,
        stock: 25,
      },
    }),
    prisma.producto.create({
      data: {
        nombre: 'Auriculares Sony WH-1000XM4',
        codigo: 'AUR-001',
        precio: 349.99,
        costo: 249.99,
        stock: 20,
      },
    }),
    prisma.producto.create({
      data: {
        nombre: 'Disco SSD Samsung 1TB',
        codigo: 'SSD-001',
        precio: 109.99,
        costo: 74.99,
        stock: 40,
      },
    }),
    prisma.producto.create({
      data: {
        nombre: 'RAM Corsair 16GB DDR4',
        codigo: 'RAM-001',
        precio: 79.99,
        costo: 54.99,
        stock: 35,
      },
    }),
    prisma.producto.create({
      data: {
        nombre: 'Cable HDMI 2.1',
        codigo: 'CAB-001',
        precio: 19.99,
        costo: 9.99,
        stock: 100,
      },
    }),
    prisma.producto.create({
      data: {
        nombre: 'Hub USB-C Anker',
        codigo: 'HUB-001',
        precio: 49.99,
        costo: 29.99,
        stock: 45,
      },
    }),
  ]);

  console.log(`✅ ${productos.length} productos creados`);

  // Crear algunas ventas de ejemplo
  const venta1 = await prisma.venta.create({
    data: {
      clienteId: clientes[0].id,
      total: 1389.98,
      detalles: {
        create: [
          {
            productoId: productos[0].id,
            cantidad: 1,
            precioUnit: 1299.99,
          },
          {
            productoId: productos[1].id,
            cantidad: 1,
            precioUnit: 89.99,
          },
        ],
      },
    },
    include: {
      detalles: true,
    },
  });

  const venta2 = await prisma.venta.create({
    data: {
      clienteId: clientes[1].id,
      total: 549.98,
      detalles: {
        create: [
          {
            productoId: productos[3].id,
            cantidad: 1,
            precioUnit: 449.99,
          },
          {
            productoId: productos[1].id,
            cantidad: 1,
            precioUnit: 99.99,
          },
        ],
      },
    },
    include: {
      detalles: true,
    },
  });

  console.log(`✅ 2 ventas de ejemplo creadas`);

  console.log('\n🎉 Seed completado exitosamente!');
  console.log('\n📊 Resumen:');
  console.log(`   - Clientes: ${clientes.length}`);
  console.log(`   - Productos: ${productos.length}`);
  console.log(`   - Ventas: 2`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error durante el seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
