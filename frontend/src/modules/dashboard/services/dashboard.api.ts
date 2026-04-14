import api from "@/shared/api/axios";
import { useQuery } from "@tanstack/react-query";

export type DashboardMetrics = {
  salesTotal: number;
  salesCount: number;
  averageTicket: number;
  productsCount: number;
  lowStockCount: number;
  noRotationCount: number;
  customersCount: number;
  accountsReceivableBalance: number;
  accountsPayableBalance: number;
};

export type SalesChartData = {
  date: string;
  sales: number;
  count: number;
};

export type TopProductData = {
  id: number;
  code: string;
  name: string;
  quantity: number;
  revenue: number;
};

export type DashboardData = {
  role: string;
  metrics: DashboardMetrics;
  salesLast7Days: SalesChartData[];
  topProducts: TopProductData[];
  alerts: {
    lowStock: number;
    noRotation: number;
    expiredDebts: number;
  };
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: async () => {
      const response = await api.get("/dashboard/summary");
      return response.data as DashboardData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
