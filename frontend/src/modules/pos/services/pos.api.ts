import api from "@/shared/api/axios";
import { useMutation } from "@tanstack/react-query";

export function useRegistrarVenta() {
  return useMutation({
    mutationFn: async (payload: { customerId: number; products: { id: number; quantity: number; price: number }[] }) => {
      const response = await api.post("/ventas", payload);
      return response.data;
    },
  });
}
