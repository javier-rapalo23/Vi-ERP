import api from "@/shared/api/axios";
import { useMutation } from "@tanstack/react-query";

type Linea = { id: number; cantidad: number; precio: number };

export function useRegistrarVenta() {
  return useMutation({
    mutationFn: async (payload: { clienteId: number; productos: Linea[] }) => {
      const response = await api.post("/ventas", payload);
      return response.data;
    },
  });
}
