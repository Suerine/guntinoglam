import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

/* GET CART */
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price images colors sizes",
    );

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalPrice: 0,
      });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ADD TO CART */
export const addToCart = async (req, res) => {
  try {
    const {
      productId,
      size,
      quantity,
      color,
      isRental,
      rentalStartDate,
      rentalEndDate,
      rentalDuration,
    } = req.body;

    if (!productId || !size || !quantity) {
      return res
        .status(400)
        .json({ message: "Product ID, size, and quantity are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found or inactive" });
    }

    // Verify size exists and has stock
    const sizeObj = product.sizes.find((s) => s.size === size);
    if (!sizeObj) {
      return res
        .status(400)
        .json({ message: "Size not available for this product" });
    }

    if (sizeObj.stock < quantity) {
      return res
        .status(400)
        .json({ message: `Insufficient stock. Available: ${sizeObj.stock}` });
    }

    // Validate rental fields if applicable
    if (isRental) {
      if (!product.isRentable) {
        return res.status(400).json({ message: "Product is not rentable" });
      }
      if (!rentalStartDate || !rentalEndDate || !rentalDuration) {
        return res
          .status(400)
          .json({ message: "Rental dates and duration are required" });
      }
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalPrice: 0,
      });
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color,
    );

    if (existingItem) {
      // Update quantity if same item
      existingItem.quantity += quantity;
    } else {
      // Add new item
      const price = isRental ? product.rentalPrice : product.price;
      cart.items.push({
        product: productId,
        size,
        quantity,
        price,
        color: color || null,
        isRental: isRental || false,
        rentalStartDate: rentalStartDate || null,
        rentalEndDate: rentalEndDate || null,
        rentalDuration: rentalDuration || null,
      });
    }

    await cart.save();
    const updated = await cart.populate("items.product", "name price images");

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE CART ITEM */
export const updateCartItem = async (req, res) => {
  try {
    const { productId, size, quantity, color } = req.body;

    if (!productId || !size || quantity === undefined) {
      return res
        .status(400)
        .json({ message: "Product ID, size, and quantity are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Verify stock
    const sizeObj = product.sizes.find((s) => s.size === size);
    if (!sizeObj || sizeObj.stock < quantity) {
      return res
        .status(400)
        .json({
          message: `Insufficient stock. Available: ${sizeObj?.stock || 0}`,
        });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === (color || null),
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;

    await cart.save();
    const updated = await cart.populate("items.product", "name price images");

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* REMOVE FROM CART */
export const removeFromCart = async (req, res) => {
  try {
    const { productId, size, color } = req.body;

    if (!productId || !size) {
      return res
        .status(400)
        .json({ message: "Product ID and size are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          item.size === size &&
          item.color === (color || null)
        ),
    );

    await cart.save();
    const updated = await cart.populate("items.product", "name price images");

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* CLEAR CART */
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.couponCode = null;
    cart.discount = 0;

    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* MERGE CART */
export const mergeCart = async (req, res) => {
  try {
    const { items } = req.body; // [{ productId, size, quantity, color }, ...]

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items to merge" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalPrice: 0,
      });
    }

    for (const item of items) {
      const { productId, size, quantity, color } = item;

      if (!productId || !size || !quantity) {
        continue;
      }

      const product = await Product.findById(productId);
      if (!product || !product.isActive) {
        continue;
      }

      const sizeObj = product.sizes.find((s) => s.size === size);
      if (!sizeObj || sizeObj.stock < quantity) {
        continue;
      }

      const existingItem = cart.items.find(
        (cartItem) =>
          cartItem.product.toString() === productId &&
          cartItem.size === size &&
          cartItem.color === (color || null),
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          product: productId,
          size,
          quantity,
          price: product.price,
          color: color || null,
        });
      }
    }

    await cart.save();
    const updated = await cart.populate("items.product", "name price images");

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
