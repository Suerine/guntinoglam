import express from "express";
import {
  getAdminStats,
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminToggleProduct,
  adminDeleteProduct,
  adminGetOrders,
  adminUpdateOrderStatus,
  adminGetUsers,
  adminUpdateUserRole,
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require both protect + admin middleware
router.use(protect, admin);

router.get("/stats", getAdminStats);

// Product routes
router.get("/products", adminGetProducts);
router.post("/products", adminCreateProduct);
router.put("/products/:id", adminUpdateProduct);
router.patch("/products/:id/toggle", adminToggleProduct);
router.delete("/products/:id", adminDeleteProduct);

// Order routes
router.get("/orders", adminGetOrders);
router.put("/orders/:id/status", adminUpdateOrderStatus);

// User routes
router.get("/users", adminGetUsers);
router.put("/users/:id/role", adminUpdateUserRole);

export default router;
