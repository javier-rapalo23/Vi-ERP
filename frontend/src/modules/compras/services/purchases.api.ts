import api from "@/shared/api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Purchase = {
  id: number;
  supplierId: number;
  total: number;
  status: "PENDING" | "PARTIAL" | "PAID" | "CANCELLED";
  date: string;
  dueDate: string;
  supplier: {
    id: number;
    name: string;
  };
  details: PurchaseDetail[];
  accountsPayable?: {
    id: number;
    totalAmount: number;
    paidAmount: number;
    balance: number;
    payments: Payment[];
  };
};

export type PurchaseDetail = {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  product: {
    id: number;
    name: string;
    code: string;
  };
};

export type Payment = {
  id: number;
  amount: number;
  paymentMethod: string;
  reference?: string;
  date: string;
};

export type CreatePurchaseData = {
  supplierId: number;
  total: number;
  dueDate: string;
  details: Array<{
    productId: number;
    quantity: number;
    unitPrice: number;
  }>;
};

export type CreatePaymentData = {
  amount: number;
  paymentMethod: string;
  reference?: string;
};

export function usePurchases() {
  return useQuery({
    queryKey: ["purchases"],
    queryFn: async () => {
      const response = await api.get("/purchases");
      return response.data as Purchase[];
    },
  });
}

export function usePurchase(id: number) {
  return useQuery({
    queryKey: ["purchases", id],
    queryFn: async () => {
      const response = await api.get(`/purchases/${id}`);
      return response.data as Purchase;
    },
    enabled: !!id,
  });
}

export function useCreatePurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePurchaseData) => {
      const response = await api.post("/purchases", data);
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchases"] });
      qc.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}

export function useUpdatePurchaseStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await api.put(`/purchases/${id}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchases"] });
    },
  });
}

export function useRegisterPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ purchaseId, data }: { purchaseId: number; data: CreatePaymentData }) => {
      const response = await api.post(`/purchases/${purchaseId}/payments`, data);
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchases"] });
    },
  });
}
