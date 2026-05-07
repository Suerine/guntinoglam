import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  mergeWishlist,
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/merge", protect, mergeWishlist);
router.get("/", protect, getWishlist);
router.post("/", protect, addToWishlist);
router.delete("/:productId", protect, removeFromWishlist);
export default router;
