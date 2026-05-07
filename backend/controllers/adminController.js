import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import mongoose from "mongoose";

/* GET ADMIN STATS */
export const getAdminStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    const paidOrders = await Order.countDocuments({ isPaid: true });
    const pendingOrders = await Order.countDocuments({
      status: { $in: ["pending", "processing"] },
    });
    const deliveredOrders = await Order.countDocuments({ status: "delivered" });

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "name email")
      .populate("orderItems.product", "name");

    res.status(200).json({
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: totalRevenue[0]?.totalRevenue || 0,
        paidOrders,
        pendingOrders,
        deliveredOrders,
      },
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET ALL PRODUCTS (Admin) */
export const adminGetProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};

    const filter = { ...keyword, ...category };

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

/* CREATE PRODUCT (Admin) */
export const adminCreateProduct = async (req, res) => {
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

    // Validation
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

/* UPDATE PRODUCT (Admin) */
export const adminUpdateProduct = async (req, res) => {
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

    // Update only allowed fields
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

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* TOGGLE PRODUCT ACTIVE STATUS (Admin) */
export const adminToggleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.status(200).json({
      message: `Product ${product.isActive ? "activated" : "deactivated"}`,
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE PRODUCT (Admin) */
export const adminDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET ALL ORDERS (Admin) */
export const adminGetOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const status = req.query.status ? { status: req.query.status } : {};

    const filter = { ...status };

    const count = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate("user", "name email phone")
      .populate("orderItems.product", "name price images")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1));

    res.json({
      orders,
      page,
      pages: Math.ceil(count / limit),
      totalOrders: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE ORDER STATUS (Admin) */
export const adminUpdateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, adminNote } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status) {
      order.status = status;
    }

    if (status === "delivered") {
      order.deliveredAt = new Date();
    }

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (adminNote !== undefined) {
      order.adminNote = adminNote;
    }

    await order.save();

    const updated = await order
      .populate("user", "name email phone")
      .populate("orderItems.product", "name price images");

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET ALL USERS (Admin) */
export const adminGetUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const count = await User.countDocuments();

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1));

    res.json({
      users,
      page,
      pages: Math.ceil(count / limit),
      totalUsers: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE USER ROLE (Admin) */
export const adminUpdateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
