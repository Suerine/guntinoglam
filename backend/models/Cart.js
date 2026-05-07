import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    size: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true, // snapshot price at time of adding
    },

    // Rental fields
    isRental: { type: Boolean, default: false },
    rentalStartDate: { type: Date },
    rentalEndDate: { type: Date },
    rentalDuration: { type: String, enum: ["daily", "weekly", "event", null] },

    // Color if selected
    color: { type: String },
  },

  { _id: false },
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: [cartItemSchema],

    couponCode: { type: String, trim: true },
    discount: { type: Number, default: 0 },

    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true },
);

cartSchema.pre("save", function (next) {
  this.totalPrice = this.items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
  next();
});

export default mongoose.model("Cart", cartSchema);
