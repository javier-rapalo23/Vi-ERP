import api from "@/shared/api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Role = {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  permissions?: { id: number; name: string; description?: string }[];
};

export type CreateRoleData = {
  name: string;
  description?: string;
};

export type UpdateRoleData = {
  name?: string;
  description?: string;
  isActive?: boolean;
};

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await api.get("/roles");
      return response.data as Role[];
    },
  });
}

export function useRole(id: number) {
  return useQuery({
    queryKey: ["roles", id],
    queryFn: async () => {
      const response = await api.get(`/roles/${id}`);
      return response.data as Role;
    },
    enabled: !!id,
  });
}

export function useCreateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateRoleData) => {
      const response = await api.post("/roles", data);
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}

export function useUpdateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateRoleData }) => {
      const response = await api.put(`/roles/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/roles/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}

export function useAssignPermissions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ roleId, permissionIds }: { roleId: number; permissionIds: number[] }) => {
      const response = await api.post(`/roles/${roleId}/permissions`, { permissionIds });
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}
