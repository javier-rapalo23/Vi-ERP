import api from "@/shared/api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Setting = {
  id: number;
  key: string;
  name: string;
  value: string;
  description?: string;
  group?: string;
  isActive: boolean;
};

export type SettingUpdate = {
  key: string;
  value: string;
};

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await api.get("/configuration");
      return response.data as Setting[];
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates: SettingUpdate[]) => {
      const response = await api.put("/configuration", updates);
      return response.data as Setting[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
