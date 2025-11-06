import { Router } from "express";
import { crearVenta } from "../controllers/VentaController";

const router = Router();
router.post("/", crearVenta);

export default router;