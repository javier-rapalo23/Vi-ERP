import api from "@/shared/api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Shift = {
  id: number;
  userId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  openingAmount: number;
  closingAmount?: number;
  expectedAmount?: number;
  variance?: number;
  status: "OPEN" | "CLOSED";
  notes?: string;
  openedAt: string;
  closedAt?: string;
  sales?: Array<{
    id: number;
    invoiceNumber: string;
    total: number;
    date: string;
    customer?: {
      id: number;
      name: string;
    };
  }>;
};

export type ShiftHistorySummary = {
  totalShifts: number;
  openShifts: number;
  closedShifts: number;
  totalOpening: number;
  totalExpected: number;
  totalClosing: number;
  totalVariance: number;
  overages: number;
  shortages: number;
};

export type ShiftHistoryResponse = {
  data: Shift[];
  summary: ShiftHistorySummary;
};

export function useOpenShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (openingAmount: number) => {
      const response = await api.post("/cajas", { openingAmount });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shift-actual"] });
      queryClient.invalidateQueries({ queryKey: ["shift-historial"] });
    },
  });
}

export function useCloseShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      shiftId,
      closingAmount,
      notes,
    }: {
      shiftId: number;
      closingAmount: number;
      notes?: string;
    }) => {
      const response = await api.put(`/cajas/${shiftId}/cierre`, {
        closingAmount,
        notes,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shift-actual"] });
      queryClient.invalidateQueries({ queryKey: ["shift-historial"] });
    },
  });
}

export function useCurrentShift() {
  return useQuery({
    queryKey: ["shift-actual"],
    queryFn: async () => {
      const response = await api.get("/cajas/actual");
      return response.data.data as Shift | null;
    },
    refetchInterval: 30000, // Refresh every 30s
  });
}

export function useShiftDetails(shiftId?: number) {
  return useQuery({
    queryKey: ["shift-detalles", shiftId],
    queryFn: async () => {
      if (!shiftId) return null;
      const response = await api.get(`/cajas/${shiftId}`);
      return response.data.data as Shift;
    },
    enabled: !!shiftId,
  });
}

export function useShiftHistory(userId?: number) {
  return useQuery({
    queryKey: ["shift-historial", userId],
    queryFn: async () => {
      const response = await api.get("/cajas/historial", {
        params: {
          userId: userId || undefined,
        },
      });
      return response.data as ShiftHistoryResponse;
    },
  });
}
