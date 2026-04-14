import { Router } from "express";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deactivateCustomer,
} from "../controllers/CustomerController";
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware";
import { requirePermission } from "../../infrastructure/middlewares/permissionMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/", requirePermission("clientes", "ver"), getCustomers);
router.get("/:id", requirePermission("clientes", "ver"), getCustomerById);
router.post("/", requirePermission("clientes", "crear"), createCustomer);
router.put("/:id", requirePermission("clientes", "editar"), updateCustomer);
router.delete("/:id", requirePermission("clientes", "anular"), deactivateCustomer);

export default router;
