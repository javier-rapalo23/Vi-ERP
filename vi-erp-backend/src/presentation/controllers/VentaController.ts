import { Request, Response } from "express";
import { RegisterSaleUseCase } from "../../application/useCases/ventas/RegistrarVentaUseCase";
import { SaleRepository } from "../../infrastructure/database/repositories/VentaRepository";
import { createSaleSchema } from "../validators/ventaValidator";
import logger from "../../config/logger";
import { SaleStatus } from "@prisma/client";

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

    const message = String(err?.message || "");
    if (
      message.includes("Stock insuficiente") ||
      message.includes("Producto no disponible") ||
      message.includes("Configuracion fiscal incompleta") ||
      message.includes("Rango de facturacion") ||
      message.includes("fecha limite") ||
      message.includes("Correlativo fuera de rango")
    ) {
      logger.warn("Business validation error in sale creation:", message);
      return res.status(400).json({ error: message });
    }
    
    logger.error("Error creating sale:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

export const getSalesHistory = async (req: Request, res: Response) => {
  try {
    const { dateFrom, dateTo, customer, status, minAmount, maxAmount } = req.query;

    const parsedDateFrom = typeof dateFrom === "string" && dateFrom.trim() !== "" ? new Date(dateFrom) : undefined;
    const parsedDateToRaw = typeof dateTo === "string" && dateTo.trim() !== "" ? new Date(dateTo) : undefined;
    const parsedDateTo = parsedDateToRaw
      ? new Date(
          parsedDateToRaw.getFullYear(),
          parsedDateToRaw.getMonth(),
          parsedDateToRaw.getDate(),
          23,
          59,
          59,
          999
        )
      : undefined;

    if (parsedDateFrom && Number.isNaN(parsedDateFrom.getTime())) {
      return res.status(400).json({ error: "dateFrom invalido" });
    }

    if (parsedDateTo && Number.isNaN(parsedDateTo.getTime())) {
      return res.status(400).json({ error: "dateTo invalido" });
    }

    const parsedMin = typeof minAmount === "string" && minAmount.trim() !== "" ? Number(minAmount) : undefined;
    const parsedMax = typeof maxAmount === "string" && maxAmount.trim() !== "" ? Number(maxAmount) : undefined;

    if (parsedMin !== undefined && !Number.isFinite(parsedMin)) {
      return res.status(400).json({ error: "minAmount invalido" });
    }

    if (parsedMax !== undefined && !Number.isFinite(parsedMax)) {
      return res.status(400).json({ error: "maxAmount invalido" });
    }

    const parsedStatus = typeof status === "string" && status.trim() !== "" ? status.trim().toUpperCase() : undefined;

    if (parsedStatus && !Object.values(SaleStatus).includes(parsedStatus as SaleStatus)) {
      return res.status(400).json({ error: "status invalido" });
    }

    const saleRepository = new SaleRepository();
    const sales = await saleRepository.findAll({
      dateFrom: parsedDateFrom,
      dateTo: parsedDateTo,
      customer: typeof customer === "string" && customer.trim() !== "" ? customer.trim() : undefined,
      status: parsedStatus,
      minAmount: parsedMin,
      maxAmount: parsedMax,
    });

    const totalSalesAmount = sales.reduce((acc, sale) => acc + Number(sale.total || 0), 0);
    const totalItemsSold = sales.reduce(
      (acc, sale) => acc + sale.details.reduce((lineAcc: number, detail: any) => lineAcc + Number(detail.quantity || 0), 0),
      0
    );

    res.json({
      data: sales,
      summary: {
        totalSales: sales.length,
        totalAmount: totalSalesAmount,
        totalItemsSold,
      },
    });
  } catch (err: any) {
    logger.error("Error fetching sales history:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

export const getSalesTotalsByPeriod = async (req: Request, res: Response) => {
  try {
    const saleRepository = new SaleRepository();
    const totals = await saleRepository.getTotalsByPeriod();

    res.json(totals);
  } catch (err: any) {
    logger.error("Error fetching sales totals by period:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

export const getSaleInvoice = async (req: Request, res: Response) => {
  try {
    const saleId = parseInt(req.params.id);

    if (Number.isNaN(saleId) || saleId <= 0) {
      return res.status(400).json({ error: "ID de venta invalido" });
    }

    const saleRepository = new SaleRepository();
    const sale = await saleRepository.findById(saleId);

    if (!sale) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    if (!sale.invoiceSnapshot) {
      return res.status(404).json({ error: "Factura no disponible para reimpresion" });
    }

    res.json({
      saleId: sale.id,
      invoiceNumber: sale.invoiceNumber,
      invoice: sale.invoiceSnapshot,
    });
  } catch (err: any) {
    logger.error("Error fetching sale invoice:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};