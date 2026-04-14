import { Router } from "express";
import { login, refreshToken, logout, checkSession } from "../controllers/AuthController";
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware";

const router = Router();

// Rutas públicas
router.post("/login", login);

// Rutas protegidas
router.post("/refresh", authMiddleware, refreshToken);
router.post("/logout", authMiddleware, logout);
router.get("/check", authMiddleware, checkSession);

export default router;
