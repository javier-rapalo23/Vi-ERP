import { Router } from "express";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deactivateCustomer,
} from "../controllers/CustomerController";
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getCustomers);
router.get("/:id", getCustomerById);
router.post("/", createCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deactivateCustomer);

export default router;
