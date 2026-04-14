import { Router } from "express";
import { getDashboard } from "../controllers/DashboardController";
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

// Dashboard endpoint accessible to all authenticated users
router.get("/summary", getDashboard);

export default router;
