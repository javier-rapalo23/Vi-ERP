import { Request, Response } from "express";
import { RegisterSaleUseCase } from "../../application/useCases/ventas/RegistrarVentaUseCase";
import { SaleRepository } from "../../infrastructure/database/repositories/VentaRepository";
import { createSaleSchema } from "../validators/ventaValidator";
import logger from "../../config/logger";

/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Register a new sale
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: number
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *     responses:
 *       201:
 *         description: Sale registered successfully
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Server error
 */
export const createSale = async (req: Request, res: Response) => {
  try {
    // Validate input data
    const validatedData = createSaleSchema.parse(req.body);
    
    const saleRepository = new SaleRepository();
    const useCase = new RegisterSaleUseCase(saleRepository);
    const result = await useCase.execute(validatedData);
    
    logger.info(`Sale registered successfully: ${result.id}`);
    res.status(201).json({ message: "Sale registered", data: result });
  } catch (err: any) {
    if (err.name === "ZodError") {
      logger.warn("Validation error in sale creation:", err.errors);
      return res.status(400).json({ 
        error: "Invalid data", 
        details: err.errors 
      });
    }
    
    logger.error("Error creating sale:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};