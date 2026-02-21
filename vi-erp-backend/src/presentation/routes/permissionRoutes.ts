import { Router } from "express";
import {
  getPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
} from "../controllers/PermissionController";

const router = Router();

router.get("/", getPermissions);
router.get("/:id", getPermissionById);
router.post("/", createPermission);
router.put("/:id", updatePermission);
router.delete("/:id", deletePermission);

export default router;
