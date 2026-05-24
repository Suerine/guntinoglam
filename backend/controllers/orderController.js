import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import { sendGuestOrderConfirmationEmail } from "../utils/emailService.js";

/* CREATE ORDER FROM CART */
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, customerNote } = req.body;

    // Validate required fields
    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    if (
      !paymentMethod ||
      !["mpesa", "card", "cash_on_delivery"].includes(paymentMethod)
    ) {
      return res
        .status(400)
        .json({ message: "Valid payment method is required" });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let itemsPrice = 0;
    const orderItems = [];

    // Validate stock and prepare order items
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);

      if (!product || !product.isActive) {
        return res.status(400).json({
          message: `Product "${item.product.name}" is no longer available`,
        });
      }

      const selectedSize = product.sizes.find((s) => s.size === item.size);

      if (!selectedSize) {
        return res.status(400).json({
          message: `Size "${item.size}" not available for ${product.name}`,
        });
      }

      if (selectedSize.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${selectedSize.stock}`,
        });
      }

      // Reduce stock
      selectedSize.stock -= item.quantity;
      await product.save();

      itemsPrice += item.quantity * item.price;

      orderItems.push({
        product: product._id,
        name: product.name,
        size: item.size,
        color: item.color || null,
        quantity: item.quantity,
        price: item.price,
        image: product.images[0],
        isRental: item.isRental || false,
        rentalStartDate: item.rentalStartDate || null,
        rentalEndDate: item.rentalEndDate || null,
        rentalDuration: item.rentalDuration || null,
      });
    }

    // Calculate shipping price (example: flat rate)
    // const shippingPrice = itemsPrice > 5000 ? 0 : 500;
    const shippingPrice = 0;

    // Calculate total with discount
    const discount = cart.discount || 0;
    const totalPrice = itemsPrice + shippingPrice - discount;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      discount,
      couponCode: cart.couponCode || null,
      totalPrice,
      isPaid: paymentMethod === "cash_on_delivery", // Assume COD is immediate
      paidAt: paymentMethod === "cash_on_delivery" ? new Date() : null,
      status: paymentMethod === "cash_on_delivery" ? "processing" : "pending",
      customerNote: customerNote || null,
    });

    // Clear cart after order creation
    cart.items = [];
    cart.couponCode = null;
    cart.discount = 0;
    cart.totalPrice = 0;
    await cart.save();

    const populatedOrder = await order.populate("user", "name email phone");

    res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* CREATE GUEST ORDER (from Paystack payment) */
export const createGuestOrder = async (req, res) => {
  try {
    const {
      items,
      guestEmail,
      guestName,
      guestPhone,
      shippingAddress,
      paymentReference,
      itemsPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    // Validate required fields
    if (
      !guestEmail ||
      !guestName ||
      !guestPhone ||
      !shippingAddress ||
      !items ||
      items.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Missing required guest checkout fields" });
    }

    if (!paymentReference) {
      return res.status(400).json({ message: "Payment reference is required" });
    }

    // Generate orderId
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const orderId = `GG-${timestamp}-${randomStr}`;

    // Validate stock and prepare order items
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product || !product.isActive) {
        return res.status(400).json({
          message: `Product "${item.name}" is no longer available`,
        });
      }

      const selectedSize = product.sizes.find((s) => s.size === item.size);

      if (!selectedSize) {
        return res.status(400).json({
          message: `Size "${item.size}" not available for ${product.name}`,
        });
      }

      if (selectedSize.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${selectedSize.stock}`,
        });
      }

      // Reduce stock
      selectedSize.stock -= item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        name: product.name,
        size: item.size,
        color: item.color || null,
        quantity: item.quantity,
        price: item.price,
        image: product.images?.[0] || "",
        isRental: item.isRental || false,
        rentalStartDate: item.rentalStartDate || null,
        rentalEndDate: item.rentalEndDate || null,
        rentalDuration: item.rentalDuration || null,
      });
    }

    // Create guest order
    const order = await Order.create({
      isGuest: true,
      guestEmail,
      guestName,
      guestPhone,
      orderId,
      orderItems,
      shippingAddress,
      paymentMethod: "paystack",
      itemsPrice,
      shippingPrice: shippingPrice || 0,
      totalPrice,
      isPaid: true,
      paidAt: new Date(),
      status: "processing",
      paymentResult: {
        transactionId: paymentReference,
        status: "completed",
        paidAt: new Date(),
      },
    });

    // Send confirmation email
    try {
      await sendGuestOrderConfirmationEmail(order);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json({
      message: "Guest order created successfully",
      order,
      orderId: order.orderId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET GUEST ORDER BY ID (no auth required) */
export const getGuestOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId, isGuest: true }).populate(
      "orderItems.product",
      "name price images",
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET GUEST ORDER BY EMAIL (no auth required) */
export const getGuestOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const orders = await Order.find({
      guestEmail: email.toLowerCase(),
      isGuest: true,
    })
      .populate("orderItems.product", "name price images")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE GUEST ORDER PAYMENT STATUS */
export const updateGuestPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, transactionId } = req.body;

    const order = await Order.findOne({ orderId, isGuest: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update payment result
    order.paymentResult = {
      transactionId: transactionId || order.paymentResult?.transactionId,
      status: status || "pending",
      paidAt: status === "completed" ? new Date() : order.paymentResult?.paidAt,
    };

    // Mark as paid if status is completed
    if (status === "completed") {
      order.isPaid = true;
      order.paidAt = new Date();
      order.status = "processing";
    }

    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET SINGLE ORDER (original function continued) */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(id)
      .populate("user", "name email phone")
      .populate("orderItems.product", "name price images");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Ensure user can only see their own orders (unless admin)
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET USER'S ORDER HISTORY */
export const getMyOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status ? { status: req.query.status } : {};

    const filter = { user: req.user._id, ...status };

    const count = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate("orderItems.product", "name price images")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1));

    res.status(200).json({
      orders,
      page,
      pages: Math.ceil(count / limit),
      totalOrders: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE PAYMENT STATUS */
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, transactionId, phone } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Ensure user can only update their own orders
    if (order.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this order" });
    }

    // Update payment result
    order.paymentResult = {
      transactionId: transactionId || null,
      status: status || "pending",
      paidAt: status === "completed" ? new Date() : null,
      phone: phone || null,
    };

    // Mark as paid if status is completed
    if (status === "completed") {
      order.isPaid = true;
      order.paidAt = new Date();
      order.status = "processing";
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

/* CANCEL ORDER */
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Ensure user can only cancel their own orders
    if (order.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this order" });
    }

    // Only allow cancellation if order is in pending or processing status
    if (!["pending", "processing"].includes(order.status)) {
      return res.status(400).json({
        message: `Cannot cancel order with status "${order.status}"`,
      });
    }

    // Restore stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);

      if (product) {
        const sizeObj = product.sizes.find((s) => s.size === item.size);
        if (sizeObj) {
          sizeObj.stock += item.quantity;
          await product.save();
        }
      }
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ADD CUSTOMER NOTE TO ORDER */
export const updateOrderNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerNote } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Ensure user can only update their own orders
    if (order.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this order" });
    }

    order.customerNote = customerNote || null;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
