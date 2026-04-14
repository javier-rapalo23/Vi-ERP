import { Request, Response } from "express";
import { SupplierRepository } from "../../infrastructure/database/repositories/SupplierRepository";
import { logCriticalAction } from "../../infrastructure/services/audit.service";

const supplierRepo = new SupplierRepository();

export class SupplierController {
  static async getAll(req: Request, res: Response) {
    try {
      const suppliers = await supplierRepo.findAll();
      res.json(suppliers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const supplier = await supplierRepo.findById(id);
      
      if (!supplier) {
        return res.status(404).json({ error: "Proveedor no encontrado" });
      }
      
      res.json(supplier);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, phone, email, adress } = req.body;

      if (!name) {
        return res.status(400).json({ error: "El nombre es requerido" });
      }

      const supplier = await supplierRepo.create({
        name,
        phone,
        email,
        adress,
        createdBy: (req as any).userId,
      });

      res.status(201).json(supplier);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { name, phone, email, adress, isActive } = req.body;

      const supplier = await supplierRepo.update(id, {
        name,
        phone,
        email,
        adress,
        isActive,
        updatedBy: (req as any).userId,
      });

      res.json(supplier);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const existing = await supplierRepo.findById(id);
      if (!existing) {
        return res.status(404).json({ error: "Proveedor no encontrado" });
      }

      await supplierRepo.delete(id);

      await logCriticalAction(req, {
        module: "proveedores",
        action: "anular",
        entity: "Supplier",
        entityId: id,
        oldValues: { isActive: existing.isActive },
        newValues: { isActive: false },
        metadata: { name: existing.name, email: existing.email },
      });

      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
