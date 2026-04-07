import { Router } from "express";
import { openShift, closeShift, getOpenShift, getShiftDetails, getShiftHistory } from "../controllers/ShiftController";
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

// Open a new shift
router.post("/", openShift);

// Get current open shift for authenticated user
router.get("/actual", getOpenShift);

// Get shift history for authenticated user (or specific user if admin)
router.get("/historial", getShiftHistory);

// Get shift details with sales
router.get("/:id", getShiftDetails);

// Close a shift
router.put("/:id/cierre", closeShift);

export default router;
