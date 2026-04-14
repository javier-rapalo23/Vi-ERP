import { Router } from "express";
import { openShift, closeShift, getOpenShift, getShiftDetails, getShiftHistory } from "../controllers/ShiftController";
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware";
import { requirePermission } from "../../infrastructure/middlewares/permissionMiddleware";

const router = Router();

router.use(authMiddleware);

// Open a new shift
router.post("/", requirePermission("cajas", "crear"), openShift);

// Get current open shift for authenticated user
router.get("/actual", requirePermission("cajas", "ver"), getOpenShift);

// Get shift history for authenticated user (or specific user if admin)
router.get("/historial", requirePermission("cajas", "ver"), getShiftHistory);

// Get shift details with sales
router.get("/:id", requirePermission("cajas", "ver"), getShiftDetails);

// Close a shift
router.put("/:id/cierre", requirePermission("cajas", "editar"), closeShift);

export default router;
