import { Router } from "express";
import {
  getSettings,
  getSettingByKey,
  updateSettings,
  updateSettingByKey,
} from "../controllers/ConfigurationController";
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware";
import { requirePermission } from "../../infrastructure/middlewares/permissionMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/", requirePermission("configuracion", "ver"), getSettings);
router.get("/:key", requirePermission("configuracion", "ver"), getSettingByKey);
router.put("/", requirePermission("configuracion", "editar"), updateSettings);
router.put("/:key", requirePermission("configuracion", "editar"), updateSettingByKey);

export default router;
