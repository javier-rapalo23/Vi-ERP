import { Router } from "express";
import { PurchaseController } from "../controllers/PurchaseController";
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get("/", PurchaseController.getAll);
router.get("/:id", PurchaseController.getById);
router.post("/", PurchaseController.create);
router.put("/:id/status", PurchaseController.updateStatus);
router.post("/:id/payments", PurchaseController.registerPayment);

export default router;
