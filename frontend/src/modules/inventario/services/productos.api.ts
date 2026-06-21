import api from "@/shared/api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Producto = {
  id: number;
  name: string;
  code: string;
  barcode?: string | null;
  price: number;
  cost: number;
  stock: number;
  minStock?: number;
  isActive?: boolean;
};

export const PRODUCTOS_PAGE_LIMIT = 20;

export type ProductosPaginadosResponse = {
  data: Producto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export function useProductos(includeInactive = false) {
  return useQuery({
    queryKey: ["productos", includeInactive],
    queryFn: async () => {
      const response = await api.get("/productos", {
        params: includeInactive ? { includeInactive: true } : undefined,
      });
      // Filtrar productos válidos
      return (response.data || []).filter((p: any) => p && p.id && p.name) as Producto[];
    },
  });
}

export function useProductosPaginados(params: { page: number; includeInactive?: boolean }) {
  return useQuery({
    queryKey: ["productos-paginados", params],
    queryFn: async () => {
      const response = await api.get("/productos", {
        params: {
          page: params.page,
          limit: PRODUCTOS_PAGE_LIMIT,
          ...(params.includeInactive ? { includeInactive: true } : {}),
        },
      });
      return response.data as ProductosPaginadosResponse;
    },
  });
}

export function useProducto(id: number) {
  return useQuery({
    queryKey: ["productos", id],
    queryFn: async () => {
      const response = await api.get(`/productos/${id}`);
      return response.data as Producto;
    },
    enabled: !!id,
  });
}

export function useCrearProducto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: Omit<Producto, "id">) => {
      const response = await api.post("/productos", p);
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}

export function useActualizarProducto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Omit<Producto, "id">> }) => {
      const response = await api.put(`/productos/${id}`, data);
      return response.data as Producto;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}

export function useDesactivarProducto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/productos/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}

// Kardex types and hooks
export type KardexLine = {
  id: number;
  date: string; // ISO date
  reference: string;
  description?: string | null;
  type: "IN" | "OUT" | "ADJ";
  quantity: number;
  costPerUnit: number;
  runningBalance: number;
  transactionValue: number;
  userName?: string | null;
};

export type KardexSummary = {
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
};

export function useProductKardex(productId: number) {
  return useQuery({
    queryKey: ["kardex", productId],
    queryFn: async () => {
      const response = await api.get(`/productos/${productId}/kardex`);
      return response.data as KardexSummary;
    },
    enabled: !!productId,
  });
}

