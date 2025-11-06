import { PrismaClient } from "./generated/client";

export const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

// Manejo de cierre gracioso de la conexión
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});