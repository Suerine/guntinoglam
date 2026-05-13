import express from "express";
import {
  verifyPayment,
  createOrderAfterPayment,
} from "../controllers/paystackController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/verify", protect, verifyPayment);
router.post("/create-order", protect, createOrderAfterPayment);

export default router;
