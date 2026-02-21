import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export interface ProductInfo {
  nombre: string;
  codigo?: string;
  cantidad?: number;
  precio?: number;
  descripcion?: string;
}

export const analyzeProductImage = async (
  base64Image: string
): Promise<ProductInfo> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analiza esta imagen de producto y extrae la siguiente información en formato JSON:
{
  "nombre": "nombre del producto",
  "codigo": "código de barras o SKU si está visible",
  "cantidad": "cantidad si está visible (solo el número)",
  "precio": "precio si está visible (solo el número sin símbolos)",
  "descripcion": "breve descripción del producto"
}

Si no puedes identificar algún campo, usa null. Responde SOLO con el JSON, sin texto adicional.`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No se pudo analizar la imagen");
    }

    // Extraer JSON del contenido (en caso de que venga con texto adicional)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No se pudo extraer información del producto");
    }

    const productInfo: ProductInfo = JSON.parse(jsonMatch[0]);
    return productInfo;
  } catch (error: any) {
    console.error("Error al analizar imagen:", error);
    throw new Error(
      error?.message || "Error al procesar la imagen con IA"
    );
  }
};
