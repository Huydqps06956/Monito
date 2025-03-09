import express from "express";
import {
  createOrder,
  getOrders,
  getUserOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
} from "../controllers/orderController";
import { protect, authorize } from "../middlewares/auth";

const router = express.Router();

// All order routes require authentication
router.use(protect);

router.post("/", createOrder);
router.get("/myorders", getUserOrders);
router.get("/:id", getOrderById);
router.put("/:id/pay", updateOrderToPaid);

// Admin routes
router.get("/", authorize("admin"), getOrders);
router.put("/:id/deliver", authorize("admin"), updateOrderToDelivered);

export default router;
