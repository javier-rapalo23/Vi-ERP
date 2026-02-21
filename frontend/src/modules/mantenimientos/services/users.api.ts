import api from "@/shared/api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type User = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  roles: { id: number; name: string; description?: string }[];
};

export type CreateUserData = {
  name: string;
  email: string;
  password: string;
  role?: string;
  roleIds?: number[];
};

export type UpdateUserData = {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  isActive?: boolean;
  roleIds?: number[];
};

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("/users");
      return response.data as User[];
    },
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const response = await api.get(`/users/${id}`);
      return response.data as User;
    },
    enabled: !!id,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      const response = await api.post("/users", data);
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateUserData }) => {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useAssignRoles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, roleIds }: { userId: number; roleIds: number[] }) => {
      const response = await api.post(`/users/${userId}/roles`, { roleIds });
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
