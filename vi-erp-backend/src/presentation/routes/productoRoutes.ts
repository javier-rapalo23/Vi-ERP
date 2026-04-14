import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllInventoryAlerts,
  getStockLowAlerts,
  getProductRotationAlerts,
  getProductKardexHistory,
} from "../controllers/ProductoController";
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware";
import { requirePermission } from "../../infrastructure/middlewares/permissionMiddleware";

const router = Router();

router.use(authMiddleware);

// Alert endpoints (before /:id to avoid route conflicts)
router.get("/alerts/all", requirePermission("productos", "ver"), getAllInventoryAlerts);
router.get("/alerts/stock", requirePermission("productos", "ver"), getStockLowAlerts);
router.get("/alerts/rotation", requirePermission("productos", "ver"), getProductRotationAlerts);

// Kardex endpoint
router.get("/:productId/kardex", requirePermission("productos", "ver"), getProductKardexHistory);

// Product CRUD endpoints
router.get("/", requirePermission("productos", "ver"), getProducts);
router.get("/:id", requirePermission("productos", "ver"), getProductById);
router.post("/", requirePermission("productos", "crear"), createProduct);
router.put("/:id", requirePermission("productos", "editar"), updateProduct);
router.delete("/:id", requirePermission("productos", "anular"), deleteProduct);

export default router;
