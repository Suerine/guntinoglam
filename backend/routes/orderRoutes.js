import express from "express";
import {
  createOrder,
  createGuestOrder,
  getOrderById,
  getGuestOrderById,
  getGuestOrdersByEmail,
  getMyOrders,
  updatePaymentStatus,
  updateGuestPaymentStatus,
  cancelOrder,
  updateOrderNote,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create new order (Protected)
router.post("/", protect, createOrder);

// Create guest order (No auth required)
router.post("/guest", createGuestOrder);

// Get user's order history (Protected)
router.get("/my-orders", protect, getMyOrders);

// Get guest order by ID (No auth required)
router.get("/guest/:orderId", getGuestOrderById);

// Get guest orders by email (No auth required)
router.post("/guest-orders/by-email", getGuestOrdersByEmail);

// Get single order (Protected)
router.get("/:id", protect, getOrderById);

// Update payment status (Protected)
router.patch("/:id/payment", protect, updatePaymentStatus);

// Update guest payment status (No auth required)
router.patch("/guest/:orderId/payment", updateGuestPaymentStatus);

// Update order note (Protected)
router.patch("/:id/note", protect, updateOrderNote);

// Cancel order (Protected)
router.patch("/:id/cancel", protect, cancelOrder);

export default router;
