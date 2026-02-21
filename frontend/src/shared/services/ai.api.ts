import api from "@/shared/api/axios";
import { useMutation } from "@tanstack/react-query";

export type ProductAIInfo = {
  nombre: string;
  codigo?: string;
  cantidad?: number;
  precio?: number;
  descripcion?: string;
};

type AnalyzeProductResponse = {
  success: boolean;
  data: ProductAIInfo;
};

const analyzeProductImage = async (imageBase64: string): Promise<ProductAIInfo> => {
  const { data } = await api.post<AnalyzeProductResponse>("/ai/analyze-product", {
    image: imageBase64,
  });
  return data.data;
};

export const useAnalyzeProductImage = () => {
  return useMutation({
    mutationFn: analyzeProductImage,
  });
};
