import express from "express";
import {
  stkPush,
  queryTransaction,
  mpesaCallback,
} from "../controllers/MpesaController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Initiate STK push — user must be logged in
router.post("/stkpush", protect, stkPush);

// Poll transaction status
router.post("/query", protect, queryTransaction);

// Safaricom callback — NO auth, Safaricom calls this directly
router.post("/callback", mpesaCallback);

export default router;
