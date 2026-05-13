import axios from "axios";
import Order from "../models/Order.js";

export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({ message: "Reference is required" });
    }

    // Verify with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const data = response.data.data;

    if (data.status !== "success") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    // Create order after successful payment
    const { orderId } = req.body;
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        isPaid: true,
        paidAt: new Date(),
        paymentMethod: "card",
        "paymentResult.transactionId": reference,
        "paymentResult.status": "completed",
        status: "processing",
      },
      { new: true },
    );

    res.json({ success: true, order });
  } catch (err) {
    console.error("Paystack verify error:", err.response?.data || err.message);
    res.status(500).json({ message: "Verification failed" });
  }
};

export const createOrderAfterPayment = async (req, res) => {
  try {
    const {
      reference,
      items,
      shipping,
      totalPrice,
      itemsPrice,
      shippingPrice,
    } = req.body;

    console.log("=== Creating Paystack Order ===");
    console.log("Reference:", reference);
    console.log("User ID:", req.user?._id);
    console.log("Items:", items);
    console.log("Total Price:", totalPrice);

    if (!reference) {
      return res.status(400).json({ message: "Payment reference is required" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Verify payment with Paystack first
    console.log("Verifying with Paystack...");
    const paystackResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const paystackData = paystackResponse.data.data;
    console.log("Paystack verification result:", {
      status: paystackData.status,
      amount: paystackData.amount,
    });

    if (paystackData.status !== "success") {
      console.error("Payment not successful. Status:", paystackData.status);
      return res.status(400).json({
        message: `Payment verification failed: ${paystackData.status}`,
        paystackStatus: paystackData.status,
      });
    }

    // Verify amount matches
    const amountInKobo = totalPrice * 100;
    if (paystackData.amount !== amountInKobo) {
      console.error(
        "Amount mismatch. Expected:",
        amountInKobo,
        "Got:",
        paystackData.amount,
      );
      return res.status(400).json({
        message: "Payment amount does not match order total",
        expected: amountInKobo,
        received: paystackData.amount,
      });
    }

    // Create order after successful payment verification
    console.log("Creating order in database...");
    const order = new Order({
      user: req.user._id,
      orderItems: items,
      shippingAddress: shipping,
      paymentMethod: "card",
      itemsPrice,
      shippingPrice,
      totalPrice,
      isPaid: true,
      paidAt: new Date(),
      "paymentResult.transactionId": reference,
      "paymentResult.status": "completed",
      status: "processing",
    });

    const savedOrder = await order.save();
    console.log("Order saved successfully:", savedOrder._id);

    res.status(201).json({ success: true, order: savedOrder });
  } catch (err) {
    console.error("Create order error:", err.response?.data || err.message);
    console.error("Stack trace:", err.stack);
    res.status(500).json({
      message:
        err.response?.data?.message || err.message || "Failed to create order",
    });
  }
};
