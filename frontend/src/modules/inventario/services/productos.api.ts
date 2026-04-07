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
  isActive?: boolean;
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
