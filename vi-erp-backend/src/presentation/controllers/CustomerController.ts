import { Request, Response } from "express";
import { prisma } from "../../infrastructure/database/client";
import logger from "../../config/logger";

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const includeInactive = req.query.includeInactive === "true";
    const customers = await prisma.customer.findMany({
      where: includeInactive ? undefined : { isActive: true },
      orderBy: { name: "asc" },
    });
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
    await prisma.customer.update({
      where: { id },
      data: { isActive: false },
    });
    res.json({ message: "Cliente desactivado exitosamente" });
  } catch (err: any) {
    logger.error("Error deactivating customer:", err);
    res.status(500).json({ error: "Error al desactivar cliente" });
  }
};
