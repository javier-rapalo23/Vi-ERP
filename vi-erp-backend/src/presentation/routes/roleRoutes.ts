import { Router } from "express";
import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  assignPermissionsToRole,
} from "../controllers/RoleController";

const router = Router();

router.get("/", getRoles);
router.get("/:id", getRoleById);
router.post("/", createRole);
router.put("/:id", updateRole);
router.delete("/:id", deleteRole);
router.post("/:id/permissions", assignPermissionsToRole);

export default router;
