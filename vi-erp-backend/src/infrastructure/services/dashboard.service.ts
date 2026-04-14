import { PrismaClient } from "@prisma/client";
import logger from "../../config/logger";

const prisma = new PrismaClient();

export interface DashboardMetrics {
  salesTotal: number;
  salesCount: number;
  averageTicket: number;
  productsCount: number;
  lowStockCount: number;
  noRotationCount: number;
  customersCount: number;
  accountsReceivableBalance: number;
  accountsPayableBalance: number;
}

export interface SalesChartData {
  date: string;
  sales: number;
  count: number;
}

export interface TopProductData {
  id: number;
  code: string;
  name: string;
  quantity: number;
  revenue: number;
}

export interface DashboardData {
  role: string;
  metrics: DashboardMetrics;
  salesLast7Days: SalesChartData[];
  topProducts: TopProductData[];
  alerts: {
    lowStock: number;
    noRotation: number;
    expiredDebts: number;
  };
}

/**
 * Get dashboard summary data filtered by user role
 */
export const getDashboardSummary = async (userRole: string): Promise<DashboardData> => {
  try {
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get sales metrics for last 7 days
    const salesData = await prisma.sale.findMany({
      where: {
        date: { gte: last7Days },
      },
      include: {
        details: true,
      },
    });

    // Calculate sales metrics
    const salesTotal = salesData.reduce((sum, sale) => sum + sale.total, 0);
    const salesCount = salesData.length;
    const averageTicket = salesCount > 0 ? salesTotal / salesCount : 0;

    // Get inventory metrics
    const productsCount = await prisma.product.count({
      where: { isActive: true },
    });

    // Low stock products: stock <= minStock (simplified, using JavaScript filtering)
    const lowStockProducts = await prisma.product.findMany({
      where: { isActive: true },
      select: { stock: true, minStock: true },
    });
    const lowStockCount = lowStockProducts.filter(
      (p) => p.stock <= p.minStock
    ).length;

    // Products without rotation (>30 days without sale)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const noRotationCount = await prisma.product.count({
      where: {
        isActive: true,
        OR: [
          { lastSaleDate: null },
          { lastSaleDate: { lt: thirtyDaysAgo } },
        ],
      },
    });

    // Customer metrics
    const customersCount = await prisma.customer.count({
      where: { isActive: true },
    });

    // Accounts receivable and payable
    let accountsReceivableBalance = 0;
    let accountsPayableBalance = 0;

    if (["admin", "contador"].includes(userRole)) {
      const arData = await prisma.accountsReceivable.aggregate({
        _sum: {
          balance: true,
        },
      });
      accountsReceivableBalance = arData._sum.balance || 0;

      const apData = await prisma.accountsPayable.aggregate({
        _sum: {
          balance: true,
        },
      });
      accountsPayableBalance = apData._sum.balance || 0;
    }

    // Calculate sales by day for last 7 days
    const salesChartData: SalesChartData[] = [];
    const dayMap = new Map<string, { sales: number; count: number }>();

    salesData.forEach((sale) => {
      const dateKey = sale.date.toLocaleDateString("es-ES");
      const current = dayMap.get(dateKey) || { sales: 0, count: 0 };
      current.sales += sale.total;
      current.count += 1;
      dayMap.set(dateKey, current);
    });

    // Fill in all 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = date.toLocaleDateString("es-ES");
      const data = dayMap.get(dateKey) || { sales: 0, count: 0 };
      salesChartData.push({
        date: dateKey,
        sales: data.sales,
        count: data.count,
      });
    }

    // Top 5 products by quantity sold
    const topProductsRaw = await prisma.saleDetail.groupBy({
      by: ["productId"],
      where: {
        sale: {
          date: { gte: last7Days },
        },
      },
      _sum: {
        quantity: true,
      },
      _count: true,
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    });

    const topProducts: TopProductData[] = [];
    for (const item of topProductsRaw) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { id: true, code: true, name: true, price: true },
      });

      if (product) {
        const revenue = (item._sum.quantity || 0) * product.price;
        topProducts.push({
          id: product.id,
          code: product.code,
          name: product.name,
          quantity: item._sum.quantity || 0,
          revenue,
        });
      }
    }

    // Expired debts (CxC with dueDate < today)
    let expiredDebts = 0;
    if (["admin", "contador"].includes(userRole)) {
      expiredDebts = await prisma.accountsReceivable.count({
        where: {
          balance: { gt: 0 },
          dueDate: { lt: now },
        },
      });
    }

    return {
      role: userRole,
      metrics: {
        salesTotal,
        salesCount,
        averageTicket,
        productsCount,
        lowStockCount,
        noRotationCount,
        customersCount,
        accountsReceivableBalance,
        accountsPayableBalance,
      },
      salesLast7Days: salesChartData,
      topProducts,
      alerts: {
        lowStock: lowStockCount,
        noRotation: noRotationCount,
        expiredDebts,
      },
    };
  } catch (error) {
    logger.error("Error fetching dashboard summary:", error);
    throw error;
  }
};
