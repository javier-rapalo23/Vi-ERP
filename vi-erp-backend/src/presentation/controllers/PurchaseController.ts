import { Request, Response } from "express";
import { PurchaseRepository } from "../../infrastructure/database/repositories/PurchaseRepository";
import { PurchaseStatus } from "@prisma/client";

const purchaseRepo = new PurchaseRepository();

export class PurchaseController {
  static async getAll(req: Request, res: Response) {
    try {
      const purchases = await purchaseRepo.findAll();
      res.json(purchases);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const purchase = await purchaseRepo.findById(id);

      if (!purchase) {
        return res.status(404).json({ error: "Compra no encontrada" });
      }

      res.json(purchase);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { supplierId, total, dueDate, details } = req.body;

      if (!supplierId || !total || !dueDate || !details || details.length === 0) {
        return res.status(400).json({ 
          error: "Datos incompletos. Se requiere: supplierId, total, dueDate, y al menos un detalle" 
        });
      }

      // Validar que cada detalle tenga los campos requeridos
      for (const detail of details) {
        if (!detail.productId || !detail.quantity || !detail.unitPrice) {
          return res.status(400).json({ 
            error: "Cada detalle debe tener: productId, quantity, unitPrice" 
          });
        }
      }

      const purchase = await purchaseRepo.create({
        supplierId,
        total,
        dueDate: new Date(dueDate),
        details,
      });

      res.status(201).json(purchase);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (!Object.values(PurchaseStatus).includes(status)) {
        return res.status(400).json({ error: "Estado inválido" });
      }

      const purchase = await purchaseRepo.updateStatus(id, status);
      res.json(purchase);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async registerPayment(req: Request, res: Response) {
    try {
      const purchaseId = parseInt(req.params.id);
      const { amount, paymentMethod, reference } = req.body;

      if (!amount || !paymentMethod) {
        return res.status(400).json({ 
          error: "Se requiere: amount, paymentMethod" 
        });
      }

      if (amount <= 0) {
        return res.status(400).json({ error: "El monto debe ser mayor a 0" });
      }

      const payment = await purchaseRepo.registerPayment(purchaseId, {
        amount,
        paymentMethod,
        reference,
      });

      res.status(201).json(payment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
