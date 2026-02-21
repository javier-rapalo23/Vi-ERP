import { Router } from "express";
import { SupplierController } from "../controllers/SupplierController";
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get("/", SupplierController.getAll);
router.get("/:id", SupplierController.getById);
router.post("/", SupplierController.create);
router.put("/:id", SupplierController.update);
router.delete("/:id", SupplierController.delete);

export default router;
