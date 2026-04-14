import { Request, Response } from "express";
import { getDashboardSummary } from "../../infrastructure/services/dashboard.service";
import logger from "../../config/logger";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    // Get user role from auth middleware (should be attached by authMiddleware)
    const userRole = (req as any).user?.role || "user";

    const dashboardData = await getDashboardSummary(userRole);
    res.json(dashboardData);
  } catch (error) {
    logger.error("Error fetching dashboard:", error);
    res.status(500).json({ error: "Error fetching dashboard data" });
  }
};
