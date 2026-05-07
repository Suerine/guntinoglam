import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  getProductsBycollection,
  updateProduct,
  deleteProduct,
  softDeleteProduct,
  searchProducts,
} from "../controllers/productController.js";
import cloudinary from "../config/cloudinary.js";

import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/cloud-test", async (req, res) => {
  const result = await cloudinary.api.ping();
  res.json(result);
});

/*
GET ALL PRODUCTS (Public)
*/
router.get("/", getProducts);

/* SEARCH PRODUCTS (Public) */
router.get("/search", searchProducts);

/* GET PRODUCTS BY collection (Public) */
router.get("/collection/:collection", getProductsBycollection);

/*
GET SINGLE PRODUCT (Public)
*/
router.get("/:id", getProductById);

/*
CREATE PRODUCT (Admin Only)
*/
router.post("/", protect, admin, createProduct);

/*
UPDATE PRODUCT (Admin Only)
*/
router.put("/:id", protect, admin, updateProduct);

/*
SOFT DELETE PRODUCT (Deactivate - Admin Only)
*/
router.patch("/:id/deactivate", protect, admin, softDeleteProduct);

/*
DELETE PRODUCT (Permanent Delete - Admin Only)
*/
router.delete("/:id", protect, admin, deleteProduct);

// UPLOAD IMAGES (Admin Only)
router.post(
  "/upload",
  protect,
  admin,
  upload.array("images", 5),
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const imageUrls = req.files.map((file) => file.path);

    res.json({
      images: imageUrls,
    });
  },
);

export default router;
