import Product from "../models/Product.js";
import mongoose from "mongoose";

/* CREATE PRODUCT */
export const createProduct = async (req, res) => {
  console.log("Request Body:", req.body); // Log the incoming request body
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      discount,
      category,
      collection,
      images,
      colors,
      sizes,
      tags,
      sku,
      isRentable,
      rentalPrice,
      rentalDuration,
      isFeatured,
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !collection) {
      return res.status(400).json({
        message:
          "Name, description, price, category, and collection are required",
      });
    }

    if (!images || images.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    if (!sizes || sizes.length === 0) {
      return res.status(400).json({ message: "At least one size is required" });
    }

    // Check for duplicate SKU
    if (sku) {
      const existingSku = await Product.findOne({ sku });
      if (existingSku) {
        return res.status(400).json({ message: "SKU already exists" });
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      originalPrice: originalPrice || price,
      discount: discount || 0,
      category,
      collection,
      images,
      colors: colors || [],
      sizes,
      tags: tags || [],
      sku: sku || null,
      isRentable: isRentable || false,
      rentalPrice: rentalPrice || 0,
      rentalDuration: rentalDuration || "event",
      isFeatured: isFeatured || false,
      isActive: true,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET ALL PRODUCTS */
export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: "i" } },
            { description: { $regex: req.query.keyword, $options: "i" } },
            { tags: { $in: [new RegExp(req.query.keyword, "i")] } },
          ],
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};
    const collection = req.query.collection
      ? { collection: req.query.collection }
      : {};
    const featured = req.query.featured === "true" ? { isFeatured: true } : {};
    const isRentable =
      req.query.rentable === "true" ? { isRentable: true } : {};

    const filter = {
      isActive: true,
      ...keyword,
      ...category,
      ...collection,
      ...featured,
      ...isRentable,
    };

    const count = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / limit),
      totalProducts: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET PRODUCTS BY collection */
export const getProductsBycollection = async (req, res) => {
  try {
    const { collection } = req.params;
    const limit = Number(req.query.limit) || 20;

    if (!["Maqbal", "Stones", "Faransawi", "Guntino"].includes(collection)) {
      return res.status(400).json({ message: "Invalid collection" });
    }

    const products = await Product.find({ collection, isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET SINGLE PRODUCT */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);

    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE PRODUCT */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check for duplicate SKU if being changed
    if (req.body.sku && req.body.sku !== product.sku) {
      const existingSku = await Product.findOne({ sku: req.body.sku });
      if (existingSku) {
        return res.status(400).json({ message: "SKU already exists" });
      }
    }

    // Allowed fields for update
    const allowedFields = [
      "name",
      "description",
      "price",
      "originalPrice",
      "discount",
      "category",
      "collection",
      "images",
      "colors",
      "sizes",
      "tags",
      "sku",
      "isRentable",
      "rentalPrice",
      "rentalDuration",
      "rating",
      "numReviews",
      "isFeatured",
    ];

    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        product[key] = req.body[key];
      }
    });

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE PRODUCT */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product permanently deleted",
      product: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* SOFT DELETE PRODUCT (toggle isActive) */
export const softDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isActive = false;
    await product.save();

    res.json({ message: "Product deactivated", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* SEARCH PRODUCTS */
export const searchProducts = async (req, res) => {
  try {
    const search = req.query.search;

    let query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const products = await Product.find(query).limit(10);

    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
