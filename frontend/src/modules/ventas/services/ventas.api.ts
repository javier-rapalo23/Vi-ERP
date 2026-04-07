import api from "@/shared/api/axios";
import { useQuery } from "@tanstack/react-query";

export type VentasHistoryFilters = {
  dateFrom?: string;
  dateTo?: string;
  customer?: string;
  status?: string;
  minAmount?: string;
  maxAmount?: string;
};

export type VentaHistorial = {
  id: number;
  invoiceNumber: string;
  customerId: number;
  paymentMethod: "CASH" | "TRANSFER" | "CARD";
  total: number;
  status: string;
  date: string;
  customer: {
    id: number;
    name: string;
    phone?: string | null;
    email?: string | null;
  };
  details: {
    id: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    product: {
      id: number;
      name: string;
      code: string;
    };
  }[];
};

export type VentasHistoryResponse = {
  data: VentaHistorial[];
  summary: {
    totalSales: number;
    totalAmount: number;
    totalItemsSold: number;
  };
};

export type StoredInvoiceResponse = {
  saleId: number;
  invoiceNumber: string;
  invoice: {
    saleId: number;
    invoiceNumber: string;
    date: string;
    paymentMethod?: "CASH" | "TRANSFER" | "CARD";
    customer: {
      id: number;
      name: string;
      phone?: string | null;
      email?: string | null;
    };
    company: {
      name: string;
      rtn?: string;
      address?: string;
      phone?: string;
    };
    fiscal?: {
      cai?: string;
      rangeStart?: number;
      rangeEnd?: number;
      validUntil?: string;
    };
    format?: "TICKET" | "PDF";
    currency: {
      symbol: string;
      name: string;
    };
    tax: {
      name: string;
      rate: number;
      amount: number;
    };
    lines: Array<{
      id: number;
      productId: number;
      productName: string;
      productCode: string;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
    }>;
    subtotal: number;
    total: number;
  };
};

export type PeriodTotals = {
  today: { count: number; total: number };
  thisWeek: { count: number; total: number };
  thisMonth: { count: number; total: number };
};

export function useVentasHistorial(filters: VentasHistoryFilters) {
  return useQuery({
    queryKey: ["ventas-historial", filters],
    queryFn: async () => {
      const response = await api.get("/ventas", {
        params: {
          dateFrom: filters.dateFrom || undefined,
          dateTo: filters.dateTo || undefined,
          customer: filters.customer || undefined,
          status: filters.status || undefined,
          minAmount: filters.minAmount || undefined,
          maxAmount: filters.maxAmount || undefined,
        },
      });
      return response.data as VentasHistoryResponse;
    },
  });
}

export async function getVentaFactura(ventaId: number) {
  const response = await api.get(`/ventas/${ventaId}/invoice`);
  return response.data as StoredInvoiceResponse;
}

export function useSalesTotalsByPeriod() {
  return useQuery({
    queryKey: ["ventas-totales-periodo"],
    queryFn: async () => {
      const response = await api.get("/ventas/totales-periodo");
      return response.data as PeriodTotals;
    },
  });
}
