import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import logger from "../../config/logger";

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
    });
    
    res.json(products);
  } catch (error) {
    logger.error("Error fetching products:", error);
    res.status(500).json({ error: "Error fetching products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.json(product);
  } catch (error) {
    logger.error("Error fetching product:", error);
    res.status(500).json({ error: "Error fetching product" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { code, name, price, cost, stock } = req.body;
    
    // Check if product with this code already exists
    const exists = await prisma.product.findUnique({
      where: { code },
    });
    
    if (exists) {
      return res.status(400).json({ error: "Product with this code already exists" });
    }
    
    const product = await prisma.product.create({
      data: {
        code,
        name,
        price,
        cost,
        stock,
      },
    });
    
    logger.info(`Product created: ${product.name}`);
    res.status(201).json(product);
  } catch (error) {
    logger.error("Error creating product:", error);
    res.status(500).json({ error: "Error creating product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code, name, price, cost, stock } = req.body;
    
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        code,
        name,
        price,
        cost,
        stock,
      },
    });
    
    logger.info(`Product updated: ${product.name}`);
    res.json(product);
  } catch (error) {
    logger.error("Error updating product:", error);
    res.status(500).json({ error: "Error updating product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    
    logger.info(`Product deleted: ID ${id}`);
    res.status(204).send();
  } catch (error) {
    logger.error("Error deleting product:", error);
    res.status(500).json({ error: "Error deleting product" });
  }
};
