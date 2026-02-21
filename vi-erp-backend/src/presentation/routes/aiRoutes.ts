import { Router } from "express";
import { AIController } from "../controllers/AIController";
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware";

const router = Router();

// Todas las rutas requieren autenticación
router.post("/analyze-product", authMiddleware, AIController.analyzeProduct);

export default router;
