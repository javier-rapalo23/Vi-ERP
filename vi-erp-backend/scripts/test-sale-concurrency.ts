import { prisma } from "../src/infrastructure/database/client";

type SalePayload = {
  customerId: number;
  products: Array<{
    id: number;
    quantity: number;
    price: number;
  }>;
};

type AttemptResult = {
  ok: boolean;
  status: number;
  body: unknown;
};

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api";
const QTY = Number(process.env.SALE_TEST_QTY || 1);

async function postSale(payload: SalePayload): Promise<AttemptResult> {
  const response = await fetch(`${API_BASE_URL}/ventas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  return {
    ok: response.ok,
    status: response.status,
    body,
  };
}

async function main() {
  if (!Number.isFinite(QTY) || QTY <= 0) {
    throw new Error("SALE_TEST_QTY debe ser un entero positivo");
  }

  const timestamp = Date.now();
  const customer = await prisma.customer.create({
    data: {
      name: `Cliente Prueba Concurrencia ${timestamp}`,
      email: `concurrency-${timestamp}@test.local`,
      phone: "0000-0000",
      isActive: true,
    },
  });

  const product = await prisma.product.create({
    data: {
      name: `Producto Prueba Concurrencia ${timestamp}`,
      code: `CC-${timestamp}`,
      barcode: null,
      price: 10,
      cost: 5,
      stock: QTY,
      isActive: true,
    },
  });

  const payload: SalePayload = {
    customerId: customer.id,
    products: [
      {
        id: product.id,
        quantity: QTY,
        price: product.price,
      },
    ],
  };

  console.log("Iniciando prueba de concurrencia...");
  console.log(`API: ${API_BASE_URL}`);
  console.log(`Producto: ${product.id} (stock inicial: ${product.stock})`);
  console.log(`Cliente: ${customer.id}`);

  const [saleA, saleB] = await Promise.allSettled([postSale(payload), postSale(payload)]);

  const attempts: AttemptResult[] = [saleA, saleB].map((result) => {
    if (result.status === "fulfilled") return result.value;
    return {
      ok: false,
      status: 0,
      body: result.reason instanceof Error ? result.reason.message : String(result.reason),
    };
  });

  const successCount = attempts.filter((attempt) => attempt.ok).length;
  const failCount = attempts.length - successCount;

  const updatedProduct = await prisma.product.findUnique({
    where: { id: product.id },
    select: { stock: true },
  });

  console.log("\nResultados de intentos:");
  attempts.forEach((attempt, index) => {
    console.log(`Intento ${index + 1}: status=${attempt.status}, ok=${attempt.ok}`);
    console.log(`Body: ${JSON.stringify(attempt.body)}`);
  });

  console.log("\nResumen:");
  console.log(`Ventas exitosas: ${successCount}`);
  console.log(`Ventas fallidas: ${failCount}`);
  console.log(`Stock final: ${updatedProduct?.stock ?? "N/A"}`);

  const passed = successCount === 1 && (updatedProduct?.stock ?? -1) === 0;

  await prisma.product.update({
    where: { id: product.id },
    data: { isActive: false },
  });

  await prisma.customer.update({
    where: { id: customer.id },
    data: { isActive: false },
  });

  if (!passed) {
    throw new Error("La prueba de concurrencia no paso: se esperaba 1 venta exitosa y stock final 0.");
  }

  console.log("\nPrueba completada: concurrencia controlada correctamente.");
}

main()
  .catch((error) => {
    console.error("Error en prueba de concurrencia:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
