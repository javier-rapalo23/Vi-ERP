import { Router } from "express";
import { PurchaseController } from "../controllers/PurchaseController";
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware";
import { requirePermission } from "../../infrastructure/middlewares/permissionMiddleware";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get("/", requirePermission("compras", "ver"), PurchaseController.getAll);
router.get("/:id", requirePermission("compras", "ver"), PurchaseController.getById);
router.post("/", requirePermission("compras", "crear"), PurchaseController.create);
router.put("/:id/status", requirePermission("compras", "editar"), PurchaseController.updateStatus);
router.post("/:id/payments", requirePermission("compras", "editar"), PurchaseController.registerPayment);

export default router;
