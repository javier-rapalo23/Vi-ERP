import { PrismaClient } from "@prisma/client";
import logger from "../../config/logger";

const prisma = new PrismaClient();

export interface StockAlert {
  productId: number;
  code: string;
  name: string;
  stock: number;
  minStock: number;
  severity: "critical" | "warning"; // critical if stock = 0, warning if stock < minStock
}

export interface RotationAlert {
  productId: number;
  code: string;
  name: string;
  lastSaleDate: Date | null;
  daysSinceLastSale: number | null;
  severity: "critical" | "warning"; // critical if > 60 days or null, warning if 30-60 days
}

export interface AllAlerts {
  stockAlerts: StockAlert[];
  rotationAlerts: RotationAlert[];
  totalAlerts: number;
}

/**
 * Get products with stock below or equal to minimum stock level
 */
export const getStockAlerts = async (): Promise<StockAlert[]> => {
  try {
    // First fetch all products, then filter in memory
    // This approach avoids raw SQL and works with regenerated Prisma client
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        code: true,
        name: true,
        stock: true,
        minStock: true,
      },
    });

    // Filter where stock <= minStock
    const alerts = products
      .filter((p) => p.stock <= p.minStock)
      .sort((a, b) => a.stock - b.stock)
      .map((p) => ({
        productId: p.id,
        code: p.code,
        name: p.name,
        stock: p.stock,
        minStock: p.minStock,
        severity: (p.stock === 0 ? "critical" : "warning") as "critical" | "warning",
      }));

    return alerts;
  } catch (error) {
    logger.error("Error fetching stock alerts:", error);
    throw error;
  }
};

/**
 * Get products without sales for a specified period (default 30 days)
 */
export const getRotationAlerts = async (
  daysThreshold: number = 30
): Promise<RotationAlert[]> => {
  try {
    const now = new Date();
    const thresholdDate = new Date(now.getTime() - daysThreshold * 24 * 60 * 60 * 1000);
    const criticalThresholdDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { lastSaleDate: null },
          { lastSaleDate: { lt: thresholdDate } },
        ],
      },
      select: {
        id: true,
        code: true,
        name: true,
        lastSaleDate: true,
      },
      orderBy: { lastSaleDate: "asc" },
    });

    return products.map((p) => {
      let daysSinceLastSale: number | null = null;
      if (p.lastSaleDate) {
        daysSinceLastSale = Math.floor(
          (now.getTime() - p.lastSaleDate.getTime()) / (24 * 60 * 60 * 1000)
        );
      }

      const severity = (
        !p.lastSaleDate || p.lastSaleDate <= criticalThresholdDate
          ? "critical"
          : "warning"
      ) as "critical" | "warning";

      return {
        productId: p.id,
        code: p.code,
        name: p.name,
        lastSaleDate: p.lastSaleDate,
        daysSinceLastSale,
        severity,
      };
    });
  } catch (error) {
    logger.error("Error fetching rotation alerts:", error);
    throw error;
  }
};

/**
 * Get all alerts combined (stock + rotation)
 */
export const getAllAlerts = async (daysThreshold: number = 30): Promise<AllAlerts> => {
  try {
    const [stockAlerts, rotationAlerts] = await Promise.all([
      getStockAlerts(),
      getRotationAlerts(daysThreshold),
    ]);

    return {
      stockAlerts,
      rotationAlerts,
      totalAlerts: stockAlerts.length + rotationAlerts.length,
    };
  } catch (error) {
    logger.error("Error fetching all alerts:", error);
    throw error;
  }
};

/**
 * Update lastSaleDate when a sale is recorded (to be called from VentaController)
 */
export const updateProductLastSaleDate = async (productId: number): Promise<void> => {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { lastSaleDate: new Date() },
    });
  } catch (error) {
    logger.error(`Error updating lastSaleDate for product ${productId}:`, error);
    // Don't throw - allow sale to continue even if tracking fails
  }
};
