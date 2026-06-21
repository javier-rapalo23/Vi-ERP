import { Request, Response } from "express";
import { prisma } from "../../infrastructure/database/client";
import logger from "../../config/logger";
import { logCriticalAction } from "../../infrastructure/services/audit.service";

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const includeInactive = req.query.includeInactive === "true";
    const where = includeInactive ? undefined : { isActive: true };

    const pageStr = req.query.page as string | undefined;
    const limitStr = req.query.limit as string | undefined;

    if (pageStr !== undefined || limitStr !== undefined) {
      const page = Math.max(1, parseInt(pageStr ?? "1") || 1);
      const limit = Math.min(100, Math.max(1, parseInt(limitStr ?? "20") || 20));

      const [total, customers] = await Promise.all([
        prisma.customer.count({ where }),
        prisma.customer.findMany({ where, orderBy: { name: "asc" }, skip: (page - 1) * limit, take: limit }),
      ]);

      return res.json({
        data: customers,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      });
    }

    const customers = await prisma.customer.findMany({ where, orderBy: { name: "asc" } });
    res.json(customers);
  } catch (err: any) {
    logger.error("Error fetching customers:", err);
    res.status(500).json({ error: "Error al obtener clientes" });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) return res.status(404).json({ error: "Cliente no encontrado" });
    res.json(customer);
  } catch (err: any) {
    logger.error("Error fetching customer:", err);
    res.status(500).json({ error: "Error al obtener cliente" });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, adress } = req.body;
    if (!name) return res.status(400).json({ error: "El nombre es requerido" });

    const customer = await prisma.customer.create({
      data: { name, phone, email, adress },
    });
    logger.info(`Customer created: ${customer.id}`);
    res.status(201).json(customer);
  } catch (err: any) {
    logger.error("Error creating customer:", err);
    res.status(500).json({ error: "Error al crear cliente" });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, phone, email, adress, isActive } = req.body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (adress !== undefined) updateData.adress = adress;
    if (isActive !== undefined) updateData.isActive = isActive;

    const customer = await prisma.customer.update({
      where: { id },
      data: updateData,
    });
    res.json(customer);
  } catch (err: any) {
    logger.error("Error updating customer:", err);
    res.status(500).json({ error: "Error al actualizar cliente" });
  }
};

export const deactivateCustomer = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.customer.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Cliente no encontrado" });

    await prisma.customer.update({
      where: { id },
      data: { isActive: false },
    });

    await logCriticalAction(req, {
      module: "clientes",
      action: "anular",
      entity: "Customer",
      entityId: id,
      oldValues: { isActive: existing.isActive },
      newValues: { isActive: false },
      metadata: { name: existing.name, email: existing.email },
    });

    res.json({ message: "Cliente desactivado exitosamente" });
  } catch (err: any) {
    logger.error("Error deactivating customer:", err);
    res.status(500).json({ error: "Error al desactivar cliente" });
  }
};
