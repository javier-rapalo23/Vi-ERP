import { Router } from "express";
import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  assignPermissionsToRole,
} from "../controllers/RoleController";
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware";
import { requirePermission } from "../../infrastructure/middlewares/permissionMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/", requirePermission("roles", "ver"), getRoles);
router.get("/:id", requirePermission("roles", "ver"), getRoleById);
router.post("/", requirePermission("roles", "crear"), createRole);
router.put("/:id", requirePermission("roles", "editar"), updateRole);
router.delete("/:id", requirePermission("roles", "anular"), deleteRole);
router.post("/:id/permissions", requirePermission("roles", "editar"), assignPermissionsToRole);

export default router;
