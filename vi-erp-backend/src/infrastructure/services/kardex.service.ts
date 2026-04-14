import { PrismaClient } from "@prisma/client";
import logger from "../../config/logger";

const prisma = new PrismaClient();

export interface KardexLine {
  id: number;
  date: Date;
  reference: string;
  description?: string | null;
  type: string;
  quantity: number;
  costPerUnit: number;
  runningBalance: number;
  transactionValue: number; // quantity * costPerUnit
  userName?: string | null;
}

export interface KardexSummary {
  productId: number;
  code: string;
  name: string;
  currentStock: number;
  totalEntriesQty: number;
  totalExitsQty: number;
  totalEntriesValue: number;
  totalExitsValue: number;
  averageCost: number;
  lines: KardexLine[];
}

/**
 * Get complete kardex (movement history) for a product
 * Includes running balance and transaction values
 */
export const getProductKardex = async (productId: number): Promise<KardexSummary> => {
  try {
    // Fetch product info
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        code: true,
        name: true,
        stock: true,
      },
    });

    if (!product) {
      throw new Error(`Producto no encontrado: ID ${productId}`);
    }

    // Fetch all transactions sorted by date
    const transactions = await prisma.inventoryTransaction.findMany({
      where: { productId },
      include: {
        user: {
          select: { name: true },
        },
      },
      orderBy: { date: "asc" },
    });

    // Calculate running balance and build kardex lines
    let runningBalance = 0;
    let totalEntriesQty = 0;
    let totalExitsQty = 0;
    let totalEntriesValue = 0;
    let totalExitsValue = 0;

    const lines: KardexLine[] = transactions.map((tx) => {
      const isEntry = tx.type === "IN";
      const sign = isEntry ? 1 : -1;
      const qtyChange = tx.quantity * sign;
      
      runningBalance += qtyChange;

      const transactionValue = tx.quantity * tx.costPerUnit;

      if (isEntry) {
        totalEntriesQty += tx.quantity;
        totalEntriesValue += transactionValue;
      } else {
        totalExitsQty += tx.quantity;
        totalExitsValue += transactionValue;
      }

      return {
        id: tx.id,
        date: tx.date,
        reference: tx.reference,
        description: tx.description,
        type: tx.type,
        quantity: tx.quantity,
        costPerUnit: tx.costPerUnit,
        runningBalance,
        transactionValue,
        userName: tx.user?.name || "Sistema",
      };
    });

    // Calculate average cost
    const averageCost =
      totalEntriesQty > 0
        ? totalEntriesValue / totalEntriesQty
        : 0;

    return {
      productId: product.id,
      code: product.code,
      name: product.name,
      currentStock: product.stock,
      totalEntriesQty,
      totalExitsQty,
      totalEntriesValue,
      totalExitsValue,
      averageCost,
      lines,
    };
  } catch (error) {
    logger.error(`Error fetching kardex for product ${productId}:`, error);
    throw error;
  }
};

/**
 * Get kardex summary for multiple products
 */
export const getProductsKardexSummary = async (
  productIds: number[]
): Promise<Map<number, { entries: number; exits: number; lastTransaction: Date | null }>> => {
  try {
    const result = new Map();

    for (const productId of productIds) {
      const stats = await prisma.inventoryTransaction.aggregate({
        where: { productId },
        _sum: {
          quantity: true,
        },
      });

      const lastTx = await prisma.inventoryTransaction.findFirst({
        where: { productId },
        orderBy: { date: "desc" },
        select: { date: true },
      });

      // Count entries (IN) and exits (OUT)
      const entries = await prisma.inventoryTransaction.aggregate({
        where: { productId, type: "IN" },
        _sum: { quantity: true },
      });

      const exits = await prisma.inventoryTransaction.aggregate({
        where: { productId, type: "OUT" },
        _sum: { quantity: true },
      });

      result.set(productId, {
        entries: entries._sum.quantity || 0,
        exits: exits._sum.quantity || 0,
        lastTransaction: lastTx?.date || null,
      });
    }

    return result;
  } catch (error) {
    logger.error("Error fetching kardex summary:", error);
    throw error;
  }
};

/**
 * Record an inventory transaction (called by sales, purchases, adjustments)
 */
export const recordInventoryTransaction = async (
  productId: number,
  quantity: number,
  type: "IN" | "OUT" | "ADJ",
  reference: string = "MANUAL",
  referenceId: number | null = null,
  costPerUnit: number = 0,
  userId: number | null = null,
  description: string | null = null
): Promise<void> => {
  try {
    await prisma.inventoryTransaction.create({
      data: {
        productId,
        quantity,
        type,
        reference,
        referenceId,
        costPerUnit,
        userId,
        description,
      },
    });

    logger.info(`Inventory transaction recorded: Product ${productId}, ${type} ${quantity} units`);
  } catch (error) {
    logger.error("Error recording inventory transaction:", error);
    throw error;
  }
};
