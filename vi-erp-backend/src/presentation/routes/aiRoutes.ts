import { Router } from "express";
import { AIController } from "../controllers/AIController";
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware";
import { requirePermission } from "../../infrastructure/middlewares/permissionMiddleware";

const router = Router();

// Todas las rutas requieren autenticación
router.post("/analyze-product", authMiddleware, requirePermission("ia", "crear"), AIController.analyzeProduct);

export default router;
