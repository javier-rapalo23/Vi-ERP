import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // Limpiar datos existentes (opcional - comenta si no quieres limpiar)
  // await prisma.$executeRaw`TRUNCATE TABLE "User", "Role", "Permission", "UserRole", "RolePermission", "Product", "Cliente", "Supplier" CASCADE`;

  console.log("📝 Creando roles...");
  
  // Crear roles
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: {
      name: "ADMIN",
      description: "Administrador del sistema con acceso total",
      isActive: true,
    },
  });

  const cajeroRole = await prisma.role.upsert({
    where: { name: "CAJERO" },
    update: {},
    create: {
      name: "CAJERO",
      description: "Cajero con acceso a ventas",
      isActive: true,
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: "USER" },
    update: {},
    create: {
      name: "USER",
      description: "Usuario básico",
      isActive: true,
    },
  });

  console.log("✅ Roles creados");

  console.log("🔐 Creando permisos por módulo y acción...");

  const permissionCatalog = [
    // Ventas
    { name: "ventas.ver", description: "Ver ventas" },
    { name: "ventas.crear", description: "Crear ventas" },
    { name: "ventas.editar", description: "Editar ventas" },
    { name: "ventas.anular", description: "Anular ventas" },
    // Compras
    { name: "compras.ver", description: "Ver compras" },
    { name: "compras.crear", description: "Crear compras" },
    { name: "compras.editar", description: "Editar compras" },
    { name: "compras.anular", description: "Anular compras" },
    // Productos
    { name: "productos.ver", description: "Ver productos" },
    { name: "productos.crear", description: "Crear productos" },
    { name: "productos.editar", description: "Editar productos" },
    { name: "productos.anular", description: "Anular productos" },
    // Clientes
    { name: "clientes.ver", description: "Ver clientes" },
    { name: "clientes.crear", description: "Crear clientes" },
    { name: "clientes.editar", description: "Editar clientes" },
    { name: "clientes.anular", description: "Anular clientes" },
    // Proveedores
    { name: "proveedores.ver", description: "Ver proveedores" },
    { name: "proveedores.crear", description: "Crear proveedores" },
    { name: "proveedores.editar", description: "Editar proveedores" },
    { name: "proveedores.anular", description: "Anular proveedores" },
    // Caja
    { name: "cajas.ver", description: "Ver caja y turnos" },
    { name: "cajas.crear", description: "Abrir turnos de caja" },
    { name: "cajas.editar", description: "Cerrar/editar turnos de caja" },
    { name: "cajas.anular", description: "Anular operaciones de caja" },
    // Configuración
    { name: "configuracion.ver", description: "Ver configuración" },
    { name: "configuracion.editar", description: "Editar configuración" },
    // Seguridad
    { name: "usuarios.ver", description: "Ver usuarios" },
    { name: "usuarios.crear", description: "Crear usuarios" },
    { name: "usuarios.editar", description: "Editar usuarios" },
    { name: "usuarios.anular", description: "Anular usuarios" },
    { name: "roles.ver", description: "Ver roles" },
    { name: "roles.crear", description: "Crear roles" },
    { name: "roles.editar", description: "Editar roles" },
    { name: "roles.anular", description: "Anular roles" },
    { name: "permisos.ver", description: "Ver permisos" },
    { name: "permisos.crear", description: "Crear permisos" },
    { name: "permisos.editar", description: "Editar permisos" },
    { name: "permisos.anular", description: "Anular permisos" },
    // IA
    { name: "ia.crear", description: "Usar análisis de IA" },
  ];

  for (const permission of permissionCatalog) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: { description: permission.description },
      create: permission,
    });
  }

  const allPermissions = await prisma.permission.findMany();
  const permissionIdByName = new Map(allPermissions.map((p) => [p.name, p.id]));

  // Admin: todos los permisos
  await prisma.rolePermission.deleteMany({ where: { roleId: adminRole.id } });
  await prisma.rolePermission.createMany({
    data: allPermissions.map((permission) => ({
      roleId: adminRole.id,
      permissionId: permission.id,
    })),
    skipDuplicates: true,
  });

  // Cajero: ventas, clientes, caja y lectura de productos
  const cajeroPermissionNames = [
    "ventas.ver",
    "ventas.crear",
    "ventas.editar",
    "ventas.anular",
    "clientes.ver",
    "clientes.crear",
    "clientes.editar",
    "productos.ver",
    "cajas.ver",
    "cajas.crear",
    "cajas.editar",
  ];

  await prisma.rolePermission.deleteMany({ where: { roleId: cajeroRole.id } });
  await prisma.rolePermission.createMany({
    data: cajeroPermissionNames
      .map((name) => permissionIdByName.get(name))
      .filter((id): id is number => typeof id === "number")
      .map((permissionId) => ({ roleId: cajeroRole.id, permissionId })),
    skipDuplicates: true,
  });

  // Usuario básico: solo lectura operativa
  const userPermissionNames = ["ventas.ver", "productos.ver", "clientes.ver"];

  await prisma.rolePermission.deleteMany({ where: { roleId: userRole.id } });
  await prisma.rolePermission.createMany({
    data: userPermissionNames
      .map((name) => permissionIdByName.get(name))
      .filter((id): id is number => typeof id === "number")
      .map((permissionId) => ({ roleId: userRole.id, permissionId })),
    skipDuplicates: true,
  });

  console.log("✅ Permisos creados y asignados");

  console.log("👥 Creando usuarios...");

  // Hash de contraseñas
  const adminPassword = await bcrypt.hash("admin123", 10);
  const cajeroPassword = await bcrypt.hash("cajero123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  // Crear usuarios
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@vierp.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@vierp.com",
      password: adminPassword,
      role: "admin",
      isActive: true,
    },
  });

  const cajeroUser = await prisma.user.upsert({
    where: { email: "cajero@vierp.com" },
    update: {},
    create: {
      name: "Cajero Principal",
      email: "cajero@vierp.com",
      password: cajeroPassword,
      role: "cajero",
      isActive: true,
    },
  });

  const normalUser = await prisma.user.upsert({
    where: { email: "usuario@vierp.com" },
    update: {},
    create: {
      name: "Usuario Normal",
      email: "usuario@vierp.com",
      password: userPassword,
      role: "user",
      isActive: true,
    },
  });

  // Asignar roles a usuarios
  await prisma.userRole.createMany({
    data: [
      { userId: adminUser.id, roleId: adminRole.id },
      { userId: cajeroUser.id, roleId: cajeroRole.id },
      { userId: normalUser.id, roleId: userRole.id },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Usuarios creados");

  console.log("📦 Creando productos de ejemplo...");

  // Crear productos
  await prisma.product.createMany({
    data: [
      {
        name: "Laptop Dell XPS 13",
        code: "LAP-001",
        price: 1299.99,
        cost: 899.99,
        stock: 15,
      },
      {
        name: "Mouse Logitech MX Master",
        code: "MOU-001",
        price: 99.99,
        cost: 59.99,
        stock: 50,
      },
      {
        name: "Teclado Mecánico Keychron K2",
        code: "TEC-001",
        price: 89.99,
        cost: 54.99,
        stock: 30,
      },
      {
        name: "Monitor LG 27\" 4K",
        code: "MON-001",
        price: 449.99,
        cost: 299.99,
        stock: 10,
      },
      {
        name: "Webcam Logitech C920",
        code: "WEB-001",
        price: 79.99,
        cost: 49.99,
        stock: 25,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Productos creados");

  console.log("👤 Creando clientes de ejemplo...");

  // Crear clientes
  await prisma.customer.createMany({
    data: [
      {
        name: "Juan Pérez",
        phone: "555-0101",
        email: "juan.perez@email.com",
      },
      {
        name: "María González",
        phone: "555-0102",
        email: "maria.gonzalez@email.com",
      },
      {
        name: "Carlos Rodríguez",
        phone: "555-0103",
        email: "carlos.rodriguez@email.com",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Clientes creados");

  console.log("🏭 Creando proveedores de ejemplo...");

  // Crear proveedores
  await prisma.supplier.createMany({
    data: [
      {
        name: "Tech Supplies Inc.",
        email: "contacto@techsupplies.com",
        phone: "555-1001",
        adress: "Av. Principal 123",
        isActive: true,
      },
      {
        name: "Global Electronics",
        email: "ventas@globalelectronics.com",
        phone: "555-1002",
        adress: "Calle Comercio 456",
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Proveedores creados");

  console.log("\n🎉 Seed completado exitosamente!");
  console.log("\n📋 Usuarios creados:");
  console.log("┌─────────────────────┬──────────────┬────────┐");
  console.log("│ Email               │ Password     │ Role   │");
  console.log("├─────────────────────┼──────────────┼────────┤");
  console.log("│ admin@vierp.com     │ admin123     │ admin  │");
  console.log("│ cajero@vierp.com    │ cajero123    │ cajero │");
  console.log("│ usuario@vierp.com   │ user123      │ user   │");
  console.log("└─────────────────────┴──────────────┴────────┘");
  console.log("\n🚀 Ahora puedes hacer login con cualquiera de estos usuarios");
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
