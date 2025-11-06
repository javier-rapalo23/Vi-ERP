import { Request, Response } from "express";
import { RegistrarVentaUseCase } from "../../application/useCases/ventas/RegistrarVentaUseCase";
import { VentaRepository } from "../../infrastructure/database/repositories/VentaRepository";
import { crearVentaSchema } from "../validators/ventaValidator";
import logger from "../../config/logger";

/**
 * @swagger
 * /api/ventas:
 *   post:
 *     summary: Registrar una nueva venta
 *     tags: [Ventas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clienteId:
 *                 type: number
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     cantidad:
 *                       type: number
 *                     precio:
 *                       type: number
 *     responses:
 *       201:
 *         description: Venta registrada exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
export const crearVenta = async (req: Request, res: Response) => {
  try {
    // Validar datos de entrada
    const validatedData = crearVentaSchema.parse(req.body);
    
    const ventaRepository = new VentaRepository();
    const useCase = new RegistrarVentaUseCase(ventaRepository);
    const result = await useCase.execute(validatedData);
    
    logger.info(`Venta registrada exitosamente: ${result.id}`);
    res.status(201).json({ message: "Venta registrada", data: result });
  } catch (err: any) {
    if (err.name === "ZodError") {
      logger.warn("Error de validación en creación de venta:", err.errors);
      return res.status(400).json({ 
        error: "Datos inválidos", 
        details: err.errors 
      });
    }
    
    logger.error("Error al crear venta:", err);
    res.status(500).json({ error: err.message || "Error interno del servidor" });
  }
};