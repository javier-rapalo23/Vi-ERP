import { Request, Response } from "express";
import { analyzeProductImage } from "../../infrastructure/services/openaiService";

export class AIController {
  static async analyzeProduct(req: Request, res: Response) {
    try {
      const { image } = req.body;

      if (!image) {
        return res.status(400).json({ error: "La imagen es requerida" });
      }

      // Extraer base64 si viene con prefijo data:image
      const base64Image = image.includes("base64,")
        ? image.split("base64,")[1]
        : image;

      const productInfo = await analyzeProductImage(base64Image);

      return res.json({
        success: true,
        data: productInfo,
      });
    } catch (error: any) {
      console.error("Error en analyzeProduct:", error);
      return res.status(500).json({
        error: error?.message || "Error al analizar la imagen",
      });
    }
  }
}
