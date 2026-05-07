import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: String,
    size: String,
    color: String,
    quantity: Number,
    price: Number,
    image: String,
    isRental: { type: Boolean, default: false },
    rentalStartDate: { type: Date },
    rentalEndDate: { type: Date },
    rentalDuration: { type: String, enum: ["daily", "weekly", "event"] },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    orderItems: [orderItemSchema],

    shippingAddress: {
      address: String,
      city: String,
      postalCode: String,
      country: String,
    },

    paymentMethod: {
      type: String,
      enum: ["mpesa", "card", "cash_on_delivery"],
      required: true,
    },
    paymentResult: {
      transactionId: String,
      status: String,
      paidAt: Date,
      phone: String,
    },

    itemsPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, trim: true },
    totalPrice: { type: Number, required: true, default: 0 },

    isPaid: { type: Boolean, default: false },
    paidAt: Date,

    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
    },

    deliveredAt: Date,
    trackingNumber: { type: String, trim: true },

    customerNote: { type: String, trim: true },
    adminNote: { type: String, trim: true },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
