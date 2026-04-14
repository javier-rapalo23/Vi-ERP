import { Router } from "express";
import { SupplierController } from "../controllers/SupplierController";
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware";
import { requirePermission } from "../../infrastructure/middlewares/permissionMiddleware";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get("/", requirePermission("proveedores", "ver"), SupplierController.getAll);
router.get("/:id", requirePermission("proveedores", "ver"), SupplierController.getById);
router.post("/", requirePermission("proveedores", "crear"), SupplierController.create);
router.put("/:id", requirePermission("proveedores", "editar"), SupplierController.update);
router.delete("/:id", requirePermission("proveedores", "anular"), SupplierController.delete);

export default router;
