import { Router } from "express";
import {
  getSettings,
  getSettingByKey,
  updateSettings,
  updateSettingByKey,
} from "../controllers/ConfigurationController";
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getSettings);
router.get("/:key", getSettingByKey);
router.put("/", updateSettings);
router.put("/:key", updateSettingByKey);

export default router;
