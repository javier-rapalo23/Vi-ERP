import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import logger from "../../config/logger";

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
  try {
    const includeInactive = req.query.includeInactive === "true";
    const products = await prisma.product.findMany({
      where: includeInactive ? undefined : { isActive: true },
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
    const { code, barcode, name, price, cost, stock, isActive } = req.body;
    
    const normalizedBarcode = typeof barcode === "string" && barcode.trim() !== "" ? barcode.trim() : null;

    const exists = await prisma.product.findUnique({ where: { code } });
    
    if (exists) {
      return res.status(400).json({ error: "Ya existe un producto con ese código de producto" });
    }

    if (normalizedBarcode) {
      const barcodeExists = await prisma.product.findUnique({ where: { barcode: normalizedBarcode } });
      if (barcodeExists) {
        return res.status(400).json({ error: "Ya existe un producto con ese código de barras" });
      }
    }
    
    const product = await prisma.product.create({
      data: {
        code,
        barcode: normalizedBarcode,
        name,
        price,
        cost,
        stock,
        isActive: typeof isActive === "boolean" ? isActive : true,
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
    const { code, barcode, name, price, cost, stock, isActive } = req.body;
    const productId = parseInt(id);

    const updateData: Record<string, unknown> = {};
    if (code !== undefined) {
      const codeExists = await prisma.product.findFirst({
        where: { code, NOT: { id: productId } },
      });

      if (codeExists) {
        return res.status(400).json({ error: "Ya existe un producto con ese código de producto" });
      }

      updateData.code = code;
    }
    if (barcode !== undefined) {
      const normalizedBarcode = typeof barcode === "string" && barcode.trim() !== "" ? barcode.trim() : null;

      if (normalizedBarcode) {
        const barcodeExists = await prisma.product.findFirst({
          where: { barcode: normalizedBarcode, NOT: { id: productId } },
        });

        if (barcodeExists) {
          return res.status(400).json({ error: "Ya existe un producto con ese código de barras" });
        }
      }

      updateData.barcode = normalizedBarcode;
    }
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = price;
    if (cost !== undefined) updateData.cost = cost;
    if (stock !== undefined) updateData.stock = stock;
    if (typeof isActive === "boolean") updateData.isActive = isActive;
    
    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
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

    await prisma.product.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
    });

    logger.info(`Product deactivated: ID ${id}`);
    res.status(204).send();
  } catch (error) {
    logger.error("Error deleting product:", error);
    res.status(500).json({ error: "Error deleting product" });
  }
};
