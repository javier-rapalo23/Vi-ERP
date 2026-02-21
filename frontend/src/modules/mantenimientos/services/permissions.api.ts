import api from "@/shared/api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Permission = {
  id: number;
  name: string;
  description?: string;
};

export type CreatePermissionData = {
  name: string;
  description?: string;
};

export type UpdatePermissionData = {
  name?: string;
  description?: string;
};

export function usePermissions() {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const response = await api.get("/permissions");
      return response.data as Permission[];
    },
  });
}

export function usePermission(id: number) {
  return useQuery({
    queryKey: ["permissions", id],
    queryFn: async () => {
      const response = await api.get(`/permissions/${id}`);
      return response.data as Permission;
    },
    enabled: !!id,
  });
}

export function useCreatePermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePermissionData) => {
      const response = await api.post("/permissions", data);
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
}

export function useUpdatePermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdatePermissionData }) => {
      const response = await api.put(`/permissions/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
}

export function useDeletePermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/permissions/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
}
