import { Router } from "express";
import { createSale, getSaleInvoice, getSalesHistory, getSalesTotalsByPeriod } from "../controllers/VentaController";
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware";
import { requirePermission } from "../../infrastructure/middlewares/permissionMiddleware";

const router = Router();
router.use(authMiddleware);

router.get("/totales-periodo", requirePermission("ventas", "ver"), getSalesTotalsByPeriod);
router.get("/", requirePermission("ventas", "ver"), getSalesHistory);
router.get("/:id/invoice", requirePermission("ventas", "ver"), getSaleInvoice);
router.post("/", requirePermission("ventas", "crear"), createSale);

export default router;