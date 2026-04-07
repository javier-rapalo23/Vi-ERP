import { Router } from "express";
import { createSale, getSaleInvoice, getSalesHistory, getSalesTotalsByPeriod } from "../controllers/VentaController";

const router = Router();
router.get("/totales-periodo", getSalesTotalsByPeriod);
router.get("/", getSalesHistory);
router.get("/:id/invoice", getSaleInvoice);
router.post("/", createSale);

export default router;