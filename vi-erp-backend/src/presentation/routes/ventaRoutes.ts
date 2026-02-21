import { Router } from "express";
import { createSale } from "../controllers/VentaController";

const router = Router();
router.post("/", createSale);

export default router;