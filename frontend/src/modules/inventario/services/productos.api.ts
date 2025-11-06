import api from "@/shared/api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Producto = {
  id: number;
  nombre: string;
  codigo: string;
  precio: number;
  costo: number;
  stock: number;
};

export function useProductos() {
  return useQuery({
    queryKey: ["productos"],
    queryFn: async () => {
      const response = await api.get("/productos");
      return response.data as Producto[];
    },
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
