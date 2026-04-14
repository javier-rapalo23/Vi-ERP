import { Router } from "express";
import {
  getPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
} from "../controllers/PermissionController";
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware";
import { requirePermission } from "../../infrastructure/middlewares/permissionMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/", requirePermission("permisos", "ver"), getPermissions);
router.get("/:id", requirePermission("permisos", "ver"), getPermissionById);
router.post("/", requirePermission("permisos", "crear"), createPermission);
router.put("/:id", requirePermission("permisos", "editar"), updatePermission);
router.delete("/:id", requirePermission("permisos", "anular"), deletePermission);

export default router;
