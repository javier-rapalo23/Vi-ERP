import { Request, Response } from "express";
import { PrismaClient } from "../../infrastructure/database/generated/client";
import logger from "../../config/logger";

const prisma = new PrismaClient();

export const obtenerProductos = async (req: Request, res: Response) => {
  try {
    const productos = await prisma.producto.findMany({
      orderBy: { nombre: "asc" },
    });
    
    res.json(productos);
  } catch (error) {
    logger.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

export const obtenerProductoPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const producto = await prisma.producto.findUnique({
      where: { id: parseInt(id) },
    });
    
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    
    res.json(producto);
  } catch (error) {
    logger.error("Error al obtener producto:", error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
};

export const crearProducto = async (req: Request, res: Response) => {
  try {
    const { codigo, nombre, precio, costo, stock } = req.body;
    
    // Verificar si ya existe un producto con ese código
    const existe = await prisma.producto.findUnique({
      where: { codigo },
    });
    
    if (existe) {
      return res.status(400).json({ error: "Ya existe un producto con ese código" });
    }
    
    const producto = await prisma.producto.create({
      data: {
        codigo,
        nombre,
        precio,
        costo,
        stock,
      },
    });
    
    logger.info(`Producto creado: ${producto.nombre}`);
    res.status(201).json(producto);
  } catch (error) {
    logger.error("Error al crear producto:", error);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

export const actualizarProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { codigo, nombre, precio, costo, stock } = req.body;
    
    const producto = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: {
        codigo,
        nombre,
        precio,
        costo,
        stock,
      },
    });
    
    logger.info(`Producto actualizado: ${producto.nombre}`);
    res.json(producto);
  } catch (error) {
    logger.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

export const eliminarProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.producto.delete({
      where: { id: parseInt(id) },
    });
    
    logger.info(`Producto eliminado: ID ${id}`);
    res.status(204).send();
  } catch (error) {
    logger.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};
