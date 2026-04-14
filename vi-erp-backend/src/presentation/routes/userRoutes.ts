import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  assignRolesToUser,
} from "../controllers/UserController";
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware";
import { requirePermission } from "../../infrastructure/middlewares/permissionMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/", requirePermission("usuarios", "ver"), getUsers);
router.get("/:id", requirePermission("usuarios", "ver"), getUserById);
router.post("/", requirePermission("usuarios", "crear"), createUser);
router.put("/:id", requirePermission("usuarios", "editar"), updateUser);
router.delete("/:id", requirePermission("usuarios", "anular"), deleteUser);
router.post("/:id/roles", requirePermission("usuarios", "editar"), assignRolesToUser);

export default router;
