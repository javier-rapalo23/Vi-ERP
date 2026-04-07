import api from "@/shared/api/axios";
import { useMutation } from "@tanstack/react-query";

type SaleMutationResponse = {
  message: string;
  data: {
    id: number;
    invoiceNumber: string;
    paymentMethod: "CASH" | "TRANSFER" | "CARD";
    total: number;
    date: string;
    invoiceSnapshot?: {
      saleId: number;
      invoiceNumber: string;
      date: string;
      paymentMethod?: "CASH" | "TRANSFER" | "CARD";
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
        productId: number;
        productName: string;
        productCode: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
      }>;
      subtotal: number;
      total: number;
      customer: {
        name: string;
        phone?: string | null;
        email?: string | null;
      };
    };
  };
};

export function useRegistrarVenta() {
  return useMutation({
    mutationFn: async (payload: { customerId: number; paymentMethod: "CASH" | "TRANSFER" | "CARD"; products: { id: number; quantity: number; price: number }[] }) => {
      const response = await api.post("/ventas", payload);
      return response.data as SaleMutationResponse;
    },
  });
}
