import api from "@/shared/api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Supplier = {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  adress?: string;
  isActive: boolean;
  createdAt: string;
  purchases?: any[];
};

export type CreateSupplierData = {
  name: string;
  phone?: string;
  email?: string;
  adress?: string;
};

export type UpdateSupplierData = {
  name?: string;
  phone?: string;
  email?: string;
  adress?: string;
  isActive?: boolean;
};

export function useSuppliers() {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const response = await api.get("/suppliers");
      return response.data as Supplier[];
    },
  });
}

export function useSupplier(id: number) {
  return useQuery({
    queryKey: ["suppliers", id],
    queryFn: async () => {
      const response = await api.get(`/suppliers/${id}`);
      return response.data as Supplier;
    },
    enabled: !!id,
  });
}

export function useCreateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateSupplierData) => {
      const response = await api.post("/suppliers", data);
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}

export function useUpdateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateSupplierData }) => {
      const response = await api.put(`/suppliers/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}

export function useDeleteSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/suppliers/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}
