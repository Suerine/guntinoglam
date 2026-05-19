import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/api/meta/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .select("name description images price collection category")
      .lean();

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      title: `${product.name} | Guntino Glam`,
      description:
        product.description ||
        `Premium ${product.collection} from Guntino Glam`,
      image: product.images?.[0],
      url: `https://guntinoglam.com/products/${product._id}`,
      price: product.price,
      currency: "KES",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
