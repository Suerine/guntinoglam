import express from "express";
import {
  createOrder,
  getOrderById,
  getMyOrders,
  updatePaymentStatus,
  cancelOrder,
  updateOrderNote,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create new order (Protected)
router.post("/", protect, createOrder);

// Get user's order history (Protected)
router.get("/my-orders", protect, getMyOrders);

// Get single order (Protected)
router.get("/:id", protect, getOrderById);

// Update payment status (Protected)
router.patch("/:id/payment", protect, updatePaymentStatus);

// Update order note (Protected)
router.patch("/:id/note", protect, updateOrderNote);

// Cancel order (Protected)
router.patch("/:id/cancel", protect, cancelOrder);

export default router;
