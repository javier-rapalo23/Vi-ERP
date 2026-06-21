import api from "@/shared/api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Cliente = {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  adress?: string;
  isActive: boolean;
  createdAt: string;
};

export type CreateClienteData = {
  name: string;
  phone?: string;
  email?: string;
  adress?: string;
};

export type UpdateClienteData = {
  name?: string;
  phone?: string;
  email?: string;
  adress?: string;
  isActive?: boolean;
};

export const CLIENTES_PAGE_LIMIT = 20;

export type ClientesPaginadosResponse = {
  data: Cliente[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export function useClientes(includeInactive = false) {
  return useQuery({
    queryKey: ["clientes", includeInactive],
    queryFn: async () => {
      const response = await api.get("/customers", {
        params: includeInactive ? { includeInactive: true } : {},
      });
      return response.data as Cliente[];
    },
  });
}

export function useClientesPaginados(params: { page: number; includeInactive?: boolean }) {
  return useQuery({
    queryKey: ["clientes-paginados", params],
    queryFn: async () => {
      const response = await api.get("/customers", {
        params: {
          page: params.page,
          limit: CLIENTES_PAGE_LIMIT,
          ...(params.includeInactive ? { includeInactive: true } : {}),
        },
      });
      return response.data as ClientesPaginadosResponse;
    },
  });
}

export function useCliente(id: number) {
  return useQuery({
    queryKey: ["clientes", id],
    queryFn: async () => {
      const response = await api.get(`/customers/${id}`);
      return response.data as Cliente;
    },
    enabled: !!id,
  });
}

export function useCrearCliente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateClienteData) => {
      const response = await api.post("/customers", data);
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clientes"] });
    },
  });
}

export function useActualizarCliente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateClienteData }) => {
      const response = await api.put(`/customers/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clientes"] });
    },
  });
}

export function useDesactivarCliente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/customers/${id}`);
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clientes"] });
    },
  });
}
