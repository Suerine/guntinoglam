import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    discount: { type: Number, min: 0, max: 100, default: 0 },

    category: { type: String, required: true, trim: true },
    collection: {
      type: String,
      enum: [
        "Maqbal",
        "Stones",
        "Faransawi",
        "Guntino",
        "Baati",
        "Hido Iyo Dhaqan",
      ],
      required: true,
    },

    images: [{ type: String, required: true }],
    colors: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],
    sku: { type: String, unique: true, sparse: true, trim: true },

    sizes: [
      {
        size: { type: String, required: true, trim: true },
        stock: { type: Number, required: true, min: 0 },
      },
    ],

    isRentable: { type: Boolean, default: false },
    rentalPrice: { type: Number, min: 0 },
    rentalDuration: {
      type: String,
      enum: ["daily", "weekly", "event"],
      default: "event",
    },

    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },

    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
