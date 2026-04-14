import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import logger from "../../config/logger";
import { logCriticalAction } from "../../infrastructure/services/audit.service";
import { getAllAlerts, getStockAlerts, getRotationAlerts } from "../../infrastructure/services/alert.service";
import { getProductKardex } from "../../infrastructure/services/kardex.service";
import { createProductSchema, updateProductSchema } from "../validators/productoValidator";

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
    const parsed = createProductSchema.parse(req.body);

    const codeExists = await prisma.product.findFirst({
      where: {
        code: {
          equals: parsed.code,
          mode: "insensitive",
        },
      },
    });

    if (codeExists) {
      return res.status(400).json({
        error: "Ya existe un producto con ese c�digo de producto",
        field: "code",
        rule: "unique",
      });
    }

    if (parsed.barcode) {
      const barcodeExists = await prisma.product.findFirst({
        where: {
          barcode: {
            equals: parsed.barcode,
            mode: "insensitive",
          },
        },
      });

      if (barcodeExists) {
        return res.status(400).json({
          error: "Ya existe un producto con ese c�digo de barras",
          field: "barcode",
          rule: "unique",
        });
      }
    }

    const product = await prisma.product.create({
      data: {
        code: parsed.code,
        barcode: parsed.barcode,
        name: parsed.name,
        price: parsed.price,
        cost: parsed.cost,
        stock: parsed.stock,
        minStock: parsed.minStock ?? 0,
        isActive: typeof parsed.isActive === "boolean" ? parsed.isActive : true,
      },
    });

    logger.info(`Product created: ${product.name}`);
    res.status(201).json(product);
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return res.status(400).json({
        error: "Datos de producto inv�lidos",
        details: error.issues,
      });
    }

    if (error?.code === "P2002") {
      return res.status(400).json({
        error: "C�digo de producto o c�digo de barras duplicado",
        rule: "unique",
      });
    }

    logger.error("Error creating product:", error);
    res.status(500).json({ error: "Error creating product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = updateProductSchema.parse(req.body);
    const productId = parseInt(id);

    const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!existingProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const updateData: Record<string, unknown> = {};
    if (parsed.code !== undefined) {
      const codeExists = await prisma.product.findFirst({
        where: {
          code: { equals: parsed.code, mode: "insensitive" },
          NOT: { id: productId },
        },
      });

      if (codeExists) {
        return res.status(400).json({
          error: "Ya existe un producto con ese c�digo de producto",
          field: "code",
          rule: "unique",
        });
      }

      updateData.code = parsed.code;
    }

    if (parsed.barcode !== undefined) {
      if (parsed.barcode) {
        const barcodeExists = await prisma.product.findFirst({
          where: {
            barcode: { equals: parsed.barcode, mode: "insensitive" },
            NOT: { id: productId },
          },
        });

        if (barcodeExists) {
          return res.status(400).json({
            error: "Ya existe un producto con ese c�digo de barras",
            field: "barcode",
            rule: "unique",
          });
        }
      }

      updateData.barcode = parsed.barcode;
    }

    if (parsed.name !== undefined) updateData.name = parsed.name;
    if (parsed.price !== undefined) updateData.price = parsed.price;
    if (parsed.cost !== undefined) updateData.cost = parsed.cost;
    if (parsed.stock !== undefined) updateData.stock = parsed.stock;
    if (parsed.minStock !== undefined) updateData.minStock = parsed.minStock;
    if (typeof parsed.isActive === "boolean") updateData.isActive = parsed.isActive;

    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    const priceChanged = parsed.price !== undefined && Number(parsed.price) !== Number(existingProduct.price);
    const costChanged = parsed.cost !== undefined && Number(parsed.cost) !== Number(existingProduct.cost);
    const minStockChanged = parsed.minStock !== undefined && parsed.minStock !== existingProduct.minStock;

    if (priceChanged || costChanged || minStockChanged) {
      await logCriticalAction(req, {
        module: "productos",
        action: "editar",
        entity: "Product",
        entityId: product.id,
        oldValues: {
          price: existingProduct.price,
          cost: existingProduct.cost,
          minStock: existingProduct.minStock,
        },
        newValues: {
          price: product.price,
          cost: product.cost,
          minStock: product.minStock,
        },
        metadata: {
          reason: "Edicion de precio/costo/stock minimo",
          code: product.code,
          name: product.name,
        },
      });
    }

    logger.info(`Product updated: ${product.name}`);
    res.json(product);
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return res.status(400).json({
        error: "Datos de producto inv�lidos",
        details: error.issues,
      });
    }

    if (error?.code === "P2002") {
      return res.status(400).json({
        error: "C�digo de producto o c�digo de barras duplicado",
        rule: "unique",
      });
    }

    logger.error("Error updating product:", error);
    res.status(500).json({ error: "Error updating product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const productId = parseInt(id);
    const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!existingProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    await prisma.product.update({
      where: { id: productId },
      data: { isActive: false },
    });

    await logCriticalAction(req, {
      module: "productos",
      action: "anular",
      entity: "Product",
      entityId: productId,
      oldValues: { isActive: existingProduct.isActive },
      newValues: { isActive: false },
      metadata: {
        code: existingProduct.code,
        name: existingProduct.name,
      },
    });

    logger.info(`Product deactivated: ID ${id}`);
    res.status(204).send();
  } catch (error) {
    logger.error("Error deleting product:", error);
    res.status(500).json({ error: "Error deleting product" });
  }
};

/**
 * Get all inventory alerts (stock + rotation combined)
 */
export const getAllInventoryAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await getAllAlerts();
    res.json(alerts);
  } catch (error) {
    logger.error("Error fetching inventory alerts:", error);
    res.status(500).json({ error: "Error fetching inventory alerts" });
  }
};

/**
 * Get products with low stock
 */
export const getStockLowAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await getStockAlerts();
    res.json(alerts);
  } catch (error) {
    logger.error("Error fetching stock alerts:", error);
    res.status(500).json({ error: "Error fetching stock alerts" });
  }
};

/**
 * Get products without recent sales (rotation)
 */
export const getProductRotationAlerts = async (req: Request, res: Response) => {
  try {
    const daysThreshold = req.query.days ? parseInt(req.query.days as string) : 30;
    const alerts = await getRotationAlerts(daysThreshold);
    res.json(alerts);
  } catch (error) {
    logger.error("Error fetching rotation alerts:", error);
    res.status(500).json({ error: "Error fetching rotation alerts" });
  }
};

/**
 * Get kardex (inventory history) for a product
 */
export const getProductKardexHistory = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.productId);

    if (!Number.isFinite(productId) || productId <= 0) {
      return res.status(400).json({ error: "ID de producto inválido" });
    }

    const kardex = await getProductKardex(productId);
    res.json(kardex);
  } catch (error: any) {
    if (error.message.includes("Producto no encontrado")) {
      return res.status(404).json({ error: error.message });
    }
    logger.error("Error fetching product kardex:", error);
    res.status(500).json({ error: "Error fetching product kardex" });
  }
};
